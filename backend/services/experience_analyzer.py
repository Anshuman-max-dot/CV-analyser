import re
from typing import Dict, List, Any

class ExperienceAnalyzer:
    ACTION_VERBS = [
        "built", "developed", "engineered", "designed", "deployed", "implemented",
        "optimized", "scaled", "led", "architected", "spearheaded", "created",
        "reduced", "increased", "transformed", "automated", "trained", "integrated"
    ]

    YEAR_PATTERNS = [
        r"(\d{4})\s*[-–—]\s*(Present|Current|\d{4})",
        r"(\d+)\+?\s*years?\s+(?:of\s+)?experience"
    ]

    @classmethod
    def analyze(cls, text: str, experience_section: str = "") -> Dict[str, Any]:
        target_text = experience_section if experience_section else text
        
        # 1. Detect year ranges
        year_matches = re.findall(r"(\d{4})\s*[-–—]\s*(present|current|\d{4})", target_text, re.IGNORECASE)
        total_months = 0
        current_year = 2026

        for start_str, end_str in year_matches:
            try:
                start_yr = int(start_str)
                end_yr = current_year if end_str.lower() in ["present", "current"] else int(end_str)
                if 1990 <= start_yr <= end_yr <= current_year:
                    total_months += (end_yr - start_yr) * 12
            except ValueError:
                pass

        years_detected = round(total_months / 12.0, 1)
        if years_detected == 0.0:
            # Fallback direct match e.g. "3+ years experience"
            exp_match = re.search(r"(\d+)\+?\s*years?", text, re.IGNORECASE)
            if exp_match:
                years_detected = float(exp_match.group(1))
            else:
                years_detected = 2.0  # default reasonable estimate if structure is non-standard

        # 2. Count action verbs
        text_lower = target_text.lower()
        verb_counts = {verb: len(re.findall(rf"\b{verb}\b", text_lower)) for verb in cls.ACTION_VERBS}
        total_verb_count = sum(verb_counts.values())

        # 3. Determine Seniority Level
        if years_detected >= 5 or "senior" in text_lower or "lead" in text_lower:
            seniority_level = "Senior / Lead"
        elif years_detected >= 2 or "mid" in text_lower or "specialist" in text_lower:
            seniority_level = "Mid-Level Professional"
        else:
            seniority_level = "Junior / Entry-Level"

        # 4. Generate Feedback
        feedback = []
        if years_detected < 2:
            feedback.append("Experience is below 2 years; focus on showcasing technical projects to compensate.")
        else:
            feedback.append(f"Detected approximately {years_detected} years of practical industry/academic experience.")

        if total_verb_count < 5:
            feedback.append("Low density of strong action verbs. Use verbs like 'Engineered', 'Optimized', 'Architected'.")
        else:
            feedback.append(f"Strong action verb usage detected ({total_verb_count} impactful action verbs found).")

        return {
            "years_detected": years_detected,
            "seniority_level": seniority_level,
            "action_verb_count": total_verb_count,
            "role_history_count": len(year_matches) if year_matches else 1,
            "feedback": feedback
        }
