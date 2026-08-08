from typing import Dict, List, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class JobMatcher:
    @classmethod
    def match(cls, cv_text: str, candidate_skills: List[str], target_role: str, required_role_skills: List[str], job_description: str = "") -> Dict[str, Any]:
        # Target reference text: combined role skills + optional job description
        reference_text = f"Role: {target_role}. Required Skills: {', '.join(required_role_skills)}. {job_description}"
        
        cv_clean = cv_text.lower()
        ref_clean = reference_text.lower()

        # TF-IDF Cosine Similarity
        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        try:
            tfidf_matrix = vectorizer.fit_transform([cv_clean, ref_clean])
            sim_score = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
            raw_match_pct = round(sim_score * 100.0, 1)
        except Exception:
            raw_match_pct = 75.0

        # Skill overlap calculation
        cand_skill_set = set([s.lower() for s in candidate_skills])
        req_skill_set = set([s.lower() for s in required_role_skills])

        matched_skills = sorted([s.title() for s in req_skill_set.intersection(cand_skill_set)])
        missing_skills = sorted([s.title() for s in req_skill_set.difference(cand_skill_set)])

        skill_overlap_ratio = len(matched_skills) / len(req_skill_set) if req_skill_set else 1.0

        # Final blended role match score (60% skill overlap + 40% TF-IDF cosine similarity)
        role_match_score = round(max(35.0, min(99.0, (skill_overlap_ratio * 60.0) + (raw_match_pct * 0.40))), 1)

        recommendations = []
        if missing_skills:
            recommendations.append(f"To raise role compatibility for {target_role}, focus on mastering {', '.join(missing_skills[:3])}.")
        if role_match_score >= 80:
            recommendations.append(f"Strong semantic alignment with {target_role} expectations.")
        else:
            recommendations.append("Incorporate role-specific terminology in work summary and project descriptions.")

        return {
            "role_match_score": role_match_score,
            "tfidf_similarity_score": raw_match_pct,
            "target_role": target_role,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "recommendations": recommendations
        }
