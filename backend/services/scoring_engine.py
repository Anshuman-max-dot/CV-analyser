from typing import Dict, List, Any, Tuple
from models.schemas import ScoreDimension, ScoreBreakdown

class ScoringEngine:
    WEIGHTS = {
        "skills": 0.30,
        "experience": 0.20,
        "projects": 0.15,
        "ats": 0.15,
        "education": 0.10,
        "semantic_match": 0.10
    }

    @classmethod
    def calculate_scores(
        cls,
        skills_info: Dict[str, Any],
        exp_info: Dict[str, Any],
        projects_info: List[Dict[str, Any]],
        ats_info: Dict[str, Any],
        job_match_info: Dict[str, Any],
        education_section: str = ""
    ) -> Tuple[float, ScoreBreakdown, str]:
        
        # 1. SKILLS SCORE (Weight = 30%)
        match_pct = skills_info.get("match_percentage", 80.0)
        skills_score = round(max(30.0, min(100.0, match_pct)), 1)
        skills_contrib = round(skills_score * cls.WEIGHTS["skills"], 2)
        matched_cnt = len(skills_info.get("matched_skills", []))
        total_req_cnt = len(skills_info.get("matched_skills", [])) + len(skills_info.get("missing_skills", []))
        
        skills_dim = ScoreDimension(
            name="Skills",
            score=skills_score,
            weight=cls.WEIGHTS["skills"],
            contribution=skills_contrib,
            explanation=f"Matched {matched_cnt} of {total_req_cnt} core required role skills ({skills_score}% match).",
            evidence=[f"Matched core skill: {s}" for s in skills_info.get("matched_skills", [])[:5]]
        )

        # 2. EXPERIENCE SCORE (Weight = 20%)
        years = exp_info.get("years_detected", 2.0)
        verbs = exp_info.get("action_verb_count", 3)
        # 3+ years = 90+, 2 years = 80+, 1 year = 70+
        base_exp_score = min(95.0, 60.0 + (years * 10.0) + (min(10, verbs) * 2.0))
        exp_score = round(max(40.0, base_exp_score), 1)
        exp_contrib = round(exp_score * cls.WEIGHTS["experience"], 2)

        exp_dim = ScoreDimension(
            name="Experience",
            score=exp_score,
            weight=cls.WEIGHTS["experience"],
            contribution=exp_contrib,
            explanation=f"Demonstrates approximately {years} years of experience with {verbs} high-impact action verbs.",
            evidence=exp_info.get("feedback", ["Detected practical engineering experience."])
        )

        # 3. PROJECTS SCORE (Weight = 15%)
        proj_scores = [p.get("complexity_score", 70.0) for p in projects_info] if projects_info else [70.0]
        avg_proj_score = sum(proj_scores) / len(proj_scores)
        metrics_count = sum([1 for p in projects_info if p.get("quantified_metrics_found")])
        proj_score = round(max(40.0, min(98.0, avg_proj_score + (metrics_count * 5.0))), 1)
        proj_contrib = round(proj_score * cls.WEIGHTS["projects"], 2)

        proj_dim = ScoreDimension(
            name="Projects",
            score=proj_score,
            weight=cls.WEIGHTS["projects"],
            contribution=proj_contrib,
            explanation=f"Evaluated {len(projects_info)} technical projects. {metrics_count} project(s) contain quantified outcomes.",
            evidence=[f"Project '{p.get('title')}' tech stack: {', '.join(p.get('tech_stack_detected', []))}" for p in projects_info[:3]]
        )

        # 4. ATS COMPATIBILITY SCORE (Weight = 15%)
        ats_score = round(ats_info.get("ats_score", 80.0), 1)
        ats_contrib = round(ats_score * cls.WEIGHTS["ats"], 2)
        matched_kw_cnt = len(ats_info.get("matched_keywords", []))

        ats_dim = ScoreDimension(
            name="ATS Compatibility",
            score=ats_score,
            weight=cls.WEIGHTS["ats"],
            contribution=ats_contrib,
            explanation=f"Strong ATS structure; matched {matched_kw_cnt} target keywords.",
            evidence=[f"Matched ATS keyword: {kw}" for kw in ats_info.get("matched_keywords", [])[:4]]
        )

        # 5. EDUCATION SCORE (Weight = 10%)
        edu_lower = education_section.lower()
        if "master" in edu_lower or "phd" in edu_lower or "m.s." in edu_lower:
            edu_score = 95.0
            edu_exp = "Master's or advanced degree detected in relevant domain."
        elif "bachelor" in edu_lower or "b.s." in edu_lower or "b.tech" in edu_lower or "degree" in edu_lower:
            edu_score = 90.0
            edu_exp = "Bachelor's degree detected in Computer Science or related STEM field."
        elif len(education_section.strip()) > 10:
            edu_score = 80.0
            edu_exp = "Education & coursework section present."
        else:
            edu_score = 70.0
            edu_exp = "Education section is abbreviated."

        edu_contrib = round(edu_score * cls.WEIGHTS["education"], 2)

        edu_dim = ScoreDimension(
            name="Education",
            score=edu_score,
            weight=cls.WEIGHTS["education"],
            contribution=edu_contrib,
            explanation=edu_exp,
            evidence=[education_section[:100]] if education_section else ["Degree detected in CV."]
        )

        # 6. SEMANTIC ROLE MATCH SCORE (Weight = 10%)
        sem_score = round(job_match_info.get("role_match_score", 80.0), 1)
        sem_contrib = round(sem_score * cls.WEIGHTS["semantic_match"], 2)

        sem_dim = ScoreDimension(
            name="Semantic Role Match",
            score=sem_score,
            weight=cls.WEIGHTS["semantic_match"],
            contribution=sem_contrib,
            explanation=f"TF-IDF cosine similarity & domain embedding match score of {sem_score}% with target role.",
            evidence=job_match_info.get("recommendations", ["Good alignment with target role expectations."])
        )

        # TOTAL OVERALL SCORE
        total_overall = round(
            skills_contrib + exp_contrib + proj_contrib + ats_contrib + edu_contrib + sem_contrib, 1
        )

        # Status Label Assignment
        if total_overall >= 88:
            status_label = "Exceptional Match"
        elif total_overall >= 78:
            status_label = "Strong Candidate"
        elif total_overall >= 68:
            status_label = "Moderate Match"
        else:
            status_label = "Needs Profile Optimization"

        breakdown = ScoreBreakdown(
            skills=skills_dim,
            experience=exp_dim,
            projects=proj_dim,
            ats=ats_dim,
            education=edu_dim,
            semantic_match=sem_dim
        )

        return total_overall, breakdown, status_label
