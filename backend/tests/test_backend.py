import pytest
import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.skill_extractor import SkillExtractor
from services.scoring_engine import ScoringEngine
from services.ats_analyzer import ATSAnalyzer
from services.experience_analyzer import ExperienceAnalyzer
from services.github_service import GitHubService
from services.cv_parser import CVParser

def test_skill_extractor_normalization():
    extractor = SkillExtractor()
    sample_text = "I have experience in Python, node js, scikit learn, pytorch, and machine learning."
    result = extractor.extract_skills(sample_text)
    
    detected = result["all_detected"]
    assert "Python" in detected
    assert "Node.js" in detected
    assert "Scikit-learn" in detected
    assert "PyTorch" in detected
    assert "Machine Learning" in detected

def test_scoring_formula_weights():
    # Verify that total score formula weights sum up to 1.0 (100%)
    weights = ScoringEngine.WEIGHTS
    total_weight = sum(weights.values())
    assert abs(total_weight - 1.0) < 1e-5

def test_ats_analyzer_weak_phrases():
    sample_cv = "Worked on machine learning models and helped team build APIs."
    sections = {"skills": "Python, SQL", "experience": sample_cv}
    res = ATSAnalyzer.analyze_ats(
        cv_text=sample_cv,
        sections=sections,
        candidate_skills=["Python", "SQL"],
        required_role_skills=["Python", "SQL", "Docker"]
    )
    assert res["ats_score"] > 0
    assert len(res["weak_phrases"]) >= 1
    assert "worked on" in [wp["phrase_detected"] for wp in res["weak_phrases"]]

def test_github_username_extractor():
    assert GitHubService.extract_username("https://github.com/torvalds") == "torvalds"
    assert GitHubService.extract_username("torvalds") == "torvalds"
    assert GitHubService.extract_username("https://github.com/torvalds/") == "torvalds"

def test_cv_section_parser():
    raw_cv = """
    JOHN DOE
    SUMMARY
    Experienced AI Engineer.
    
    TECHNICAL SKILLS
    Python, FastAPI, PyTorch.
    
    WORK EXPERIENCE
    Software Engineer at Tech Corp (2022 - Present)
    Built high throughput APIs.
    
    EDUCATION
    BS in Computer Science.
    """
    sections = CVParser.parse_sections(raw_cv)
    assert "summary" in sections
    assert "skills" in sections
    assert "experience" in sections
    assert "education" in sections
