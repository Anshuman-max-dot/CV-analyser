import json
import os
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from models.schemas import (
    CandidateInfo, AnalyzeRequest, AnalysisResponse, ScoreBreakdown,
    SkillAnalysisResult, ATSResult, GitHubAnalysis, PlatformStatus,
    RecommendationItem, ProjectAnalysisItem, ExperienceAnalysis
)
from services.cv_parser import CVParser
from services.skill_extractor import SkillExtractor
from services.experience_analyzer import ExperienceAnalyzer
from services.project_analyzer import ProjectAnalyzer
from services.ats_analyzer import ATSAnalyzer
from services.job_matcher import JobMatcher
from services.scoring_engine import ScoringEngine
from services.recommendation_engine import RecommendationEngine
from services.github_service import GitHubService
from services.linkedin_service import LinkedInService
from services.tableau_service import TableauService, PowerBIService
from services.db_service import db_service

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI-powered professional career profile analyzer backend REST API"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Skill Extractor with taxonomy
skill_extractor = SkillExtractor()

# Load Role Matrix
ROLES_MATRIX_PATH = os.path.join(os.path.dirname(__file__), "data", "roles_matrix.json")
with open(ROLES_MATRIX_PATH, "r", encoding="utf-8") as f:
    ROLES_DATA = json.load(f)["roles"]

SAMPLE_CANDIDATE_PATH = os.path.join(os.path.dirname(__file__), "data", "sample_candidate.json")
with open(SAMPLE_CANDIDATE_PATH, "r", encoding="utf-8") as f:
    SAMPLE_CANDIDATE = json.load(f)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "mongodb_connected": db_service.use_mongo,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/roles")
async def get_roles():
    return {"roles": ROLES_DATA}

@app.get("/api/sample-candidate")
async def get_sample_candidate():
    return SAMPLE_CANDIDATE

@app.post("/api/upload-cv")
async def upload_cv(file: UploadFile = File(...)):
    filename = file.filename or "cv"
    file_bytes = await file.read()
    
    if filename.lower().endswith(".pdf"):
        extracted_text = CVParser.extract_text_from_pdf(file_bytes)
    elif filename.lower().endswith(".docx") or filename.lower().endswith(".doc"):
        extracted_text = CVParser.extract_text_from_docx(file_bytes)
    elif filename.lower().endswith(".txt"):
        extracted_text = file_bytes.decode("utf-8", errors="ignore")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")

    clean_text = CVParser.clean_text(extracted_text)
    if not clean_text or len(clean_text) < 20:
        raise HTTPException(status_code=422, detail="Unable to extract meaningful text from uploaded document.")

    sections = CVParser.parse_sections(clean_text)
    return {
        "filename": filename,
        "size_bytes": len(file_bytes),
        "character_count": len(clean_text),
        "text": clean_text,
        "sections": sections
    }

@app.get("/api/github/{username}")
async def get_github_analysis(username: str, token: Optional[str] = Query(default="")):
    return await GitHubService.analyze_profile(username, token=token or settings.GITHUB_TOKEN)

@app.post("/api/analyze")
async def analyze_profile(payload: AnalyzeRequest):
    cv_text = payload.cv_text
    cand_info = payload.candidate_info
    job_desc = payload.job_description or ""

    if not cv_text or len(cv_text.strip()) < 30:
        raise HTTPException(status_code=400, detail="CV text is too short to perform AI analysis.")

    # 1. Parse CV Sections
    sections = CVParser.parse_sections(cv_text)

    # 2. Extract & Normalize Skills
    extracted_skills_data = skill_extractor.extract_skills(cv_text, sections=sections)
    detected_skills = extracted_skills_data["all_detected"]

    # Retrieve Target Role Skill Benchmarks
    role_config = ROLES_DATA.get(cand_info.target_role, ROLES_DATA["AI/ML Engineer"])
    required_role_skills = role_config["required_skills"]

    # Match skills against role
    skill_matching = skill_extractor.match_against_role(detected_skills, required_role_skills)

    skills_analysis_res = SkillAnalysisResult(
        candidate_skills=detected_skills,
        required_role_skills=required_role_skills,
        matched_skills=skill_matching["matched_skills"],
        missing_skills=skill_matching["missing_skills"],
        categorized_skills=extracted_skills_data["categorized"],
        match_percentage=skill_matching["match_percentage"]
    )

    # 3. Experience Analysis
    exp_res_raw = ExperienceAnalyzer.analyze(cv_text, experience_section=sections.get("experience", ""))
    exp_analysis = ExperienceAnalysis(
        years_detected=exp_res_raw["years_detected"],
        seniority_level=exp_res_raw["seniority_level"],
        action_verb_count=exp_res_raw["action_verb_count"],
        role_history_count=exp_res_raw["role_history_count"],
        feedback=exp_res_raw["feedback"]
    )

    # 4. Project Quality Analysis
    proj_res_raw = ProjectAnalyzer.analyze_projects(cv_text, projects_section=sections.get("projects", ""))
    project_analysis_items = [
        ProjectAnalysisItem(
            title=p["title"],
            tech_stack_detected=p["tech_stack_detected"],
            complexity_score=p["complexity_score"],
            quantified_metrics_found=p["quantified_metrics_found"],
            weak_phrases_detected=p["weak_phrases_detected"],
            feedback=p["feedback"],
            improved_bullet_suggestion=p["improved_bullet_suggestion"]
        ) for p in proj_res_raw
    ]

    # 5. ATS Analysis
    ats_res_raw = ATSAnalyzer.analyze_ats(
        cv_text=cv_text,
        sections=sections,
        candidate_skills=detected_skills,
        required_role_skills=required_role_skills,
        job_description=job_desc
    )
    ats_analysis_res = ATSResult(
        ats_score=ats_res_raw["ats_score"],
        matched_keywords=ats_res_raw["matched_keywords"],
        missing_keywords=ats_res_raw["missing_keywords"],
        section_checks=ats_res_raw["section_checks"],
        weak_phrases=ats_res_raw["weak_phrases"],
        formatting_issues=ats_res_raw["formatting_issues"],
        recommendations=ats_res_raw["recommendations"]
    )

    # 6. Job Semantic Match
    job_match_raw = JobMatcher.match(
        cv_text=cv_text,
        candidate_skills=detected_skills,
        target_role=cand_info.target_role,
        required_role_skills=required_role_skills,
        job_description=job_desc
    )

    # 7. External Integrations (GitHub, LinkedIn, Tableau, Power BI)
    github_analysis_raw = await GitHubService.analyze_profile(
        cand_info.github_url, token=settings.GITHUB_TOKEN
    )
    github_analysis_res = GitHubAnalysis(**github_analysis_raw)

    linkedin_status = LinkedInService.analyze_link(cand_info.linkedin_url)
    tableau_status = TableauService.analyze_link(cand_info.tableau_url)
    powerbi_status = PowerBIService.analyze_link(cand_info.powerbi_url)

    platform_statuses = [
        PlatformStatus(**linkedin_status),
        PlatformStatus(
            platform="GitHub",
            url=cand_info.github_url or "",
            status=github_analysis_res.status_message,
            detail=f"Public repos: {github_analysis_res.public_repos_count}, Total Stars: {github_analysis_res.total_stars}"
        ),
        PlatformStatus(**tableau_status),
        PlatformStatus(**powerbi_status)
    ]

    # 8. Scoring Engine Execution
    overall_score, breakdown, status_label = ScoringEngine.calculate_scores(
        skills_info=skill_matching,
        exp_info=exp_res_raw,
        projects_info=proj_res_raw,
        ats_info=ats_res_raw,
        job_match_info=job_match_raw,
        education_section=sections.get("education", "")
    )

    # 9. Recommendation Engine Execution
    recommendations_res = RecommendationEngine.generate_recommendations(
        target_role=cand_info.target_role,
        missing_skills=skill_matching["missing_skills"],
        ats_info=ats_res_raw,
        github_info=github_analysis_raw,
        projects_info=proj_res_raw,
        exp_info=exp_res_raw
    )

    # Assembly
    record_id = str(uuid.uuid4())
    timestamp = datetime.utcnow()

    response_data = {
        "id": record_id,
        "timestamp": timestamp.isoformat(),
        "candidate_info": cand_info.model_dump(),
        "overall_score": overall_score,
        "status_label": status_label,
        "breakdown": breakdown.model_dump(),
        "skills_analysis": skills_analysis_res.model_dump(),
        "ats_analysis": ats_analysis_res.model_dump(),
        "github_analysis": github_analysis_res.model_dump(),
        "platform_statuses": [p.model_dump() for p in platform_statuses],
        "recommendations": [r.model_dump() for r in recommendations_res],
        "project_analysis": [p.model_dump() for p in project_analysis_items],
        "experience_analysis": exp_analysis.model_dump(),
        "raw_cv_excerpt": cv_text[:300] + "..."
    }

    # Save to Database Store
    db_service.save_analysis(response_data)

    return response_data

@app.get("/api/analysis/{record_id}")
async def get_analysis_by_id(record_id: str):
    data = db_service.get_analysis(record_id)
    if not data:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return data

@app.get("/api/analysis")
async def list_past_analyses(limit: int = Query(default=20)):
    return {"history": db_service.list_analyses(limit=limit)}
