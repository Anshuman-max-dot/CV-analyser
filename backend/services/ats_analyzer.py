import re
from typing import Dict, List, Any

class ATSAnalyzer:
    REQUIRED_SECTIONS = ["summary", "skills", "experience", "projects", "education"]

    WEAK_VERBS = [
        "worked on", "helped", "responsible for", "made", "learned", "assisted with", "handled"
    ]

    @classmethod
    def analyze_ats(cls, cv_text: str, sections: Dict[str, str], candidate_skills: List[str], required_role_skills: List[str], job_description: str = "") -> Dict[str, Any]:
        cv_lower = cv_text.lower()
        
        # 1. Section Checks
        section_checks = {sec: bool(sections.get(sec, "").strip()) for sec in cls.REQUIRED_SECTIONS}
        missing_sections = [sec.capitalize() for sec, found in section_checks.items() if not found]

        # 2. Keyword Coverage
        required_set = set([s.lower() for s in required_role_skills])
        candidate_set = set([s.lower() for s in candidate_skills])

        # If job description is provided, extract additional keywords
        jd_keywords = set()
        if job_description:
            words = re.findall(r"\b[a-zA-Z]{3,15}\b", job_description.lower())
            for w in words:
                if w in ["python", "pytorch", "tensorflow", "fastapi", "docker", "aws", "sql", "git", "nlp", "mlops", "rag", "react", "node", "mongodb", "postgresql"]:
                    jd_keywords.add(w)

        all_target_keywords = required_set.union(jd_keywords)
        matched = [k for k in all_target_keywords if k in cv_lower]
        missing = [k for k in all_target_keywords if k not in cv_lower]

        keyword_pct = (len(matched) / len(all_target_keywords) * 100.0) if all_target_keywords else 85.0

        # 3. Weak Phrase Detection
        weak_phrases_found = []
        for weak in cls.WEAK_VERBS:
            matches = list(re.finditer(rf"\b({re.escape(weak)})\b", cv_lower))
            for m in matches:
                # Extract surrounding context sentence snippet
                start = max(0, m.start() - 30)
                end = min(len(cv_text), m.end() + 40)
                snippet = cv_text[start:end].replace("\n", " ").strip()
                weak_phrases_found.append({
                    "original": snippet,
                    "phrase_detected": weak,
                    "reason": f"Passive phrasing '{weak}' weakens ATS impact.",
                    "suggestion": f"Replace '{weak}' with strong action verbs like 'Engineered', 'Architected', or 'Spearheaded'."
                })

        # 4. ATS Formatting Checks
        formatting_issues = []
        if len(cv_text.strip()) < 500:
            formatting_issues.append("CV length is under 500 characters; may be parsed incompletely by ATS.")
        if missing_sections:
            formatting_issues.append(f"Missing explicit standard headings: {', '.join(missing_sections)}.")
        if re.search(r"[\u4e00-\u9fff\u0400-\u04ff]", cv_text):
            formatting_issues.append("Contains non-ASCII special characters that could distort parsing.")

        # 5. ATS Score Calculation
        section_score = (sum(section_checks.values()) / len(cls.REQUIRED_SECTIONS)) * 100.0
        formatting_score = max(50.0, 100.0 - (len(formatting_issues) * 15.0))
        weak_penalty = min(20.0, len(weak_phrases_found) * 4.0)

        raw_ats_score = (keyword_pct * 0.50) + (section_score * 0.30) + (formatting_score * 0.20) - weak_penalty
        ats_score = round(max(40.0, min(98.0, raw_ats_score)), 1)

        # 6. Recommendations (Ethical, no keyword stuffing)
        recommendations = []
        if missing:
            nicely_formatted_missing = [m.title() if m not in ["aws", "sql", "nlp", "rag", "mlops", "ci/cd", "llm", "api"] else m.upper() for m in missing[:4]]
            recommendations.append(f"Integrate missing target keywords naturally into project descriptions: {', '.join(nicely_formatted_missing)}.")
        if weak_phrases_found:
            recommendations.append("Replace passive phrases ('worked on', 'helped') with metric-driven accomplishments.")
        if missing_sections:
            recommendations.append(f"Add standard section headers: {', '.join(missing_sections)}.")
        recommendations.append("Avoid keyword stuffing; ensure every added skill is backed by a concrete project or experience bullet point.")

        return {
            "ats_score": ats_score,
            "matched_keywords": sorted([m.title() if m not in ["aws", "sql", "nlp", "rag", "mlops", "ci/cd", "llm", "api"] else m.upper() for m in matched]),
            "missing_keywords": sorted([m.title() if m not in ["aws", "sql", "nlp", "rag", "mlops", "ci/cd", "llm", "api"] else m.upper() for m in missing]),
            "section_checks": section_checks,
            "weak_phrases": weak_phrases_found[:5],
            "formatting_issues": formatting_issues,
            "recommendations": recommendations
        }
