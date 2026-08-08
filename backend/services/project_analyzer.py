import re
from typing import Dict, List, Any

class ProjectAnalyzer:
    WEAK_PHRASES = [
        ("worked on", "Built, engineered, or developed"),
        ("helped", "Collaborated with or spearheaded"),
        ("responsible for", "Led, managed, or executed"),
        ("made", "Architected or created"),
        ("learned", "Mastered and applied"),
        ("assisted with", "Drove key contributions to"),
        ("handled", "Directed or optimized")
    ]

    COMPLEXITY_KEYWORDS = [
        "fastapi", "pytorch", "tensorflow", "transformer", "spacy", "rag",
        "vector db", "docker", "kubernetes", "redis", "postgresql", "microservices",
        "latency", "concurrency", "distributed", "pipeline", "ci/cd", "aws"
    ]

    @classmethod
    def analyze_projects(cls, cv_text: str, projects_section: str = "") -> List[Dict[str, Any]]:
        section_to_use = projects_section if projects_section else cv_text
        project_blocks = cls._extract_project_blocks(section_to_use)
        
        results = []
        for block in project_blocks:
            lines = [l.strip() for l in block.splitlines() if l.strip()]
            title = lines[0] if lines else "Technical Project"
            block_text = "\n".join(lines)
            block_lower = block_text.lower()

            # 1. Tech stack detection
            tech_stack = [kw.title() for kw in cls.COMPLEXITY_KEYWORDS if kw in block_lower]

            # 2. Metric detection (% or ms or X%)
            metrics_found = bool(re.search(r"(\d+%\b|\d+\s*ms\b|\d+k\b|\$\d+)", block_text, re.IGNORECASE))

            # 3. Complexity score
            complexity_score = min(100.0, 50.0 + (len(tech_stack) * 10.0) + (15.0 if metrics_found else 0.0))

            # 4. Weak phrase detection
            detected_weak = []
            for weak, suggestion in cls.WEAK_PHRASES:
                if re.search(rf"\b{re.escape(weak)}\b", block_lower):
                    detected_weak.append(weak)

            # 5. Feedback & Bullet Rewrites
            if not metrics_found:
                feedback = "Project description lacks measurable outcomes (e.g. % accuracy boost, latency reduction, user scale)."
                improved_bullet = f"Built {title} using {', '.join(tech_stack[:3]) if tech_stack else 'Python'}, reducing latency by 30% and expanding throughput."
            elif detected_weak:
                feedback = f"Contains weak passive phrasing: '{', '.join(detected_weak)}'."
                improved_bullet = f"Spearheaded design of {title}, utilizing {', '.join(tech_stack[:3]) if tech_stack else 'modern frameworks'} to optimize model performance."
            else:
                feedback = "Strong, impactful project description with quantified engineering outcomes."
                improved_bullet = lines[1] if len(lines) > 1 else block_text

            results.append({
                "title": title[:60],
                "tech_stack_detected": list(set(tech_stack)),
                "complexity_score": complexity_score,
                "quantified_metrics_found": metrics_found,
                "weak_phrases_detected": detected_weak,
                "feedback": feedback,
                "improved_bullet_suggestion": improved_bullet
            })

        return results

    @classmethod
    def _extract_project_blocks(cls, text: str) -> List[str]:
        # Split by numbered items or bullet groupings
        blocks = re.split(r"\n(?=\d+\.\s+|\b[A-Z0-9\s]{4,30}\b\s*\(\d{4}\))", text)
        clean_blocks = [b.strip() for b in blocks if len(b.strip()) > 30]
        if not clean_blocks:
            clean_blocks = [text[:400]]
        return clean_blocks[:4]  # Return top 4 project blocks
