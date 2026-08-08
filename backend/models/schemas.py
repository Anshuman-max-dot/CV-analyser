from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class CandidateInfo(BaseModel):
    name: str = Field(..., example="Alex Mercer")
    email: str = Field(..., example="alex@example.com")
    target_role: str = Field(..., example="AI/ML Engineer")
    linkedin_url: Optional[str] = Field(default="", example="https://linkedin.com/in/alex-mercer")
    github_url: Optional[str] = Field(default="", example="https://github.com/torvalds")
    tableau_url: Optional[str] = Field(default="", example="https://public.tableau.com/profile/alex")
    powerbi_url: Optional[str] = Field(default="", example="https://app.powerbi.com/view?r=sample")

class AnalyzeRequest(BaseModel):
    candidate_info: CandidateInfo
    cv_text: str = Field(..., description="Raw text extracted from PDF/DOCX CV")
    job_description: Optional[str] = Field(default="", description="Target job description for semantic matching & ATS gap analysis")

class ScoreDimension(BaseModel):
    name: str
    score: float = Field(..., description="Score out of 100")
    weight: float = Field(..., description="Weight decimal e.g. 0.30")
    contribution: float = Field(..., description="Calculated contribution = score * weight")
    explanation: str
    evidence: List[str]

class ScoreBreakdown(BaseModel):
    skills: ScoreDimension
    experience: ScoreDimension
    projects: ScoreDimension
    ats: ScoreDimension
    education: ScoreDimension
    semantic_match: ScoreDimension
    formula_expression: str = "Overall = (Skills × 0.30) + (Experience × 0.20) + (Projects × 0.15) + (ATS × 0.15) + (Education × 0.10) + (Semantic Match × 0.10)"

class SkillItem(BaseModel):
    name: str
    category: str
    found: bool = True
    found_in_sections: List[str] = []

class SkillAnalysisResult(BaseModel):
    candidate_skills: List[str]
    required_role_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    categorized_skills: Dict[str, List[str]]
    match_percentage: float

class ATSWeakPhrase(BaseModel):
    original: str
    phrase_detected: str
    reason: str
    suggestion: str

class ATSResult(BaseModel):
    ats_score: float
    matched_keywords: List[str]
    missing_keywords: List[str]
    section_checks: Dict[str, bool]
    weak_phrases: List[ATSWeakPhrase]
    formatting_issues: List[str]
    recommendations: List[str]

class GitHubRepoHighlight(BaseModel):
    name: str
    stars: int
    forks: int
    language: Optional[str]
    description: Optional[str]
    updated_at: str
    has_readme: bool

class GitHubAnalysis(BaseModel):
    username: str
    connected: bool
    status_message: str
    public_repos_count: int = 0
    followers: int = 0
    total_stars: int = 0
    top_languages: Dict[str, int] = {}
    documentation_score: float = 0.0
    github_score: float = 0.0
    recent_repositories: List[GitHubRepoHighlight] = []
    recommendations: List[str] = []

class PlatformStatus(BaseModel):
    platform: str
    url: str
    status: str  # "Connected — Public API Data", "URL Provided — Limited Analysis", "Not Provided"
    detail: str

class RecommendationItem(BaseModel):
    id: str
    priority: str  # "HIGH", "MEDIUM", "LOW"
    category: str  # "SKILLS", "PROJECTS", "ATS", "GITHUB", "EXPERIENCE"
    title: str
    problem: str
    why_it_matters: str
    recommended_action: str
    expected_impact: str

class ProjectAnalysisItem(BaseModel):
    title: str
    tech_stack_detected: List[str]
    complexity_score: float
    quantified_metrics_found: bool
    weak_phrases_detected: List[str]
    feedback: str
    improved_bullet_suggestion: str

class ExperienceAnalysis(BaseModel):
    years_detected: float
    seniority_level: str
    action_verb_count: int
    role_history_count: int
    feedback: List[str]

class AnalysisResponse(BaseModel):
    id: str
    timestamp: datetime
    candidate_info: CandidateInfo
    overall_score: float
    status_label: str  # "Exceptional Match", "Strong Candidate", "Moderate Match", "Needs Optimization"
    breakdown: ScoreBreakdown
    skills_analysis: SkillAnalysisResult
    ats_analysis: ATSResult
    github_analysis: GitHubAnalysis
    platform_statuses: List[PlatformStatus]
    recommendations: List[RecommendationItem]
    project_analysis: List[ProjectAnalysisItem]
    experience_analysis: ExperienceAnalysis
    raw_cv_excerpt: str
