from typing import Dict, List, Any
from models.schemas import RecommendationItem

class RecommendationEngine:
    @classmethod
    def generate_recommendations(
        cls,
        target_role: str,
        missing_skills: List[str],
        ats_info: Dict[str, Any],
        github_info: Dict[str, Any],
        projects_info: List[Dict[str, Any]],
        exp_info: Dict[str, Any]
    ) -> List[RecommendationItem]:
        recommendations = []
        rec_counter = 1

        # 1. Critical Missing Skills (HIGH Priority)
        for skill in missing_skills[:3]:
            recommendations.append(RecommendationItem(
                id=f"rec-{rec_counter}",
                priority="HIGH",
                category="SKILLS",
                title=f"Acquire & Showcase '{skill}'",
                problem=f"'{skill}' is missing from your profile but is a core requirement for {target_role} positions.",
                why_it_matters=f"Recruiters and automated ATS filters heavily screen for '{skill}' when shortlisting for {target_role} roles.",
                recommended_action=f"Build and deploy a targeted hands-on project utilizing {skill}, and add it explicitly to your skills matrix.",
                expected_impact=f"+5% to +8% boost in overall {target_role} role compatibility."
            ))
            rec_counter += 1

        # 2. ATS Weak Verb / Passive Phrasing (HIGH or MEDIUM Priority)
        weak_phrases = ats_info.get("weak_phrases", [])
        if weak_phrases:
            recommendations.append(RecommendationItem(
                id=f"rec-{rec_counter}",
                priority="HIGH",
                category="ATS",
                title="Replace Passive Verbs with Quantified Achievements",
                problem=f"Detected passive phrasing like '{weak_phrases[0].get('phrase_detected')}' in bullet points.",
                why_it_matters="Passive language weakens candidate impact and scores lower on ATS parser algorithms.",
                recommended_action="Rewrite bullet points using action verbs (e.g. 'Engineered', 'Optimized', 'Spearheaded') paired with measurable metrics.",
                expected_impact="+6% improvement in ATS Parsing & Impact Score."
            ))
            rec_counter += 1

        # 3. Project Outcome Metrics (MEDIUM Priority)
        unquantified_projs = [p for p in projects_info if not p.get("quantified_metrics_found")]
        if unquantified_projs:
            recommendations.append(RecommendationItem(
                id=f"rec-{rec_counter}",
                priority="MEDIUM",
                category="PROJECTS",
                title="Add Quantified Outcomes to Project Descriptions",
                problem=f"Project '{unquantified_projs[0].get('title')}' lacks measurable metrics (% boost, latency reduction, user scale).",
                why_it_matters="Hiring managers look for concrete business or technical evidence of performance.",
                recommended_action="Include specific metrics such as 'reduced inference latency by 35%' or 'improved accuracy to 94.2%'.",
                expected_impact="+5% increase in Project Quality Score."
            ))
            rec_counter += 1

        # 4. GitHub Documentation & Activity (MEDIUM / LOW Priority)
        if github_info.get("connected"):
            doc_score = github_info.get("documentation_score", 100.0)
            if doc_score < 75:
                recommendations.append(RecommendationItem(
                    id=f"rec-{rec_counter}",
                    priority="MEDIUM",
                    category="GITHUB",
                    title="Enhance Public GitHub Project Documentation",
                    problem=f"Only {doc_score}% of your recent GitHub repositories include README descriptions.",
                    why_it_matters="Clear README documentation is a primary signal technical interviewers inspect during profile reviews.",
                    recommended_action="Add structured READMEs with architecture diagrams, setup instructions, and demo links to your top 3 repos.",
                    expected_impact="+8% boost in GitHub Audit & Engineering Signal Score."
                ))
                rec_counter += 1
        else:
            recommendations.append(RecommendationItem(
                id=f"rec-{rec_counter}",
                priority="LOW",
                category="GITHUB",
                title="Connect Public GitHub Handle",
                problem="No verified public GitHub handle connected to profile.",
                why_it_matters="Public code repositories validate your hands-on coding ability for engineering roles.",
                recommended_action="Provide your public GitHub username in the profile analyzer form.",
                expected_impact="Unlocks full automated repository analysis and code diversity audit."
            ))
            rec_counter += 1

        # 5. Experience Action Verb Density (LOW Priority)
        if exp_info.get("action_verb_count", 0) < 5:
            recommendations.append(RecommendationItem(
                id=f"rec-{rec_counter}",
                priority="LOW",
                category="EXPERIENCE",
                title="Increase Density of High-Impact Technical Action Verbs",
                problem="Low count of high-impact technical action verbs across experience section.",
                why_it_matters="Strong verbs communicate leadership and ownership of technical systems.",
                recommended_action="Begin experience bullet points with verbs such as 'Architected', 'Scaled', 'Automated', or 'Trained'.",
                expected_impact="+4% increase in Experience Dimension Score."
            ))
            rec_counter += 1

        return recommendations
