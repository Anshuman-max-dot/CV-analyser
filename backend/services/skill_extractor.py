import json
import os
import re
from typing import Dict, List, Set, Tuple, Any
import spacy

class SkillExtractor:
    def __init__(self, taxonomy_path: str = None):
        if taxonomy_path is None:
            taxonomy_path = os.path.join(os.path.dirname(__file__), "..", "data", "skill_taxonomy.json")
        
        with open(taxonomy_path, "r", encoding="utf-8") as f:
            self.taxonomy_data = json.load(f)["categories"]
            
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except Exception:
            self.nlp = None

        # Build alias lookup map -> normalized skill name
        self.alias_to_canonical: Dict[str, Tuple[str, str]] = {}
        for category, skills in self.taxonomy_data.items():
            for skill in skills:
                canonical_name = skill["name"]
                for alias in skill["aliases"]:
                    self.alias_to_canonical[alias.lower()] = (canonical_name, category)

    def extract_skills(self, text: str, sections: Dict[str, str] = None) -> Dict[str, Any]:
        text_lower = text.lower()
        found_skills_map: Dict[str, Dict[str, Any]] = {}

        # 1. Exact & Regex Alias Match
        for alias, (canonical_name, category) in self.alias_to_canonical.items():
            # Use word boundaries for short aliases to avoid substring matching inside other words
            if len(alias) <= 3:
                pattern = rf"\b{re.escape(alias)}\b"
            else:
                pattern = rf"\b{re.escape(alias)}\b"

            if re.search(pattern, text_lower, re.IGNORECASE):
                if canonical_name not in found_skills_map:
                    found_skills_map[canonical_name] = {
                        "name": canonical_name,
                        "category": category,
                        "sections": []
                    }

                # Check which sections contain the skill
                if sections:
                    for sec_name, sec_content in sections.items():
                        if re.search(pattern, sec_content.lower(), re.IGNORECASE):
                            if sec_name not in found_skills_map[canonical_name]["sections"]:
                                found_skills_map[canonical_name]["sections"].append(sec_name)

        # Categorize detected skills
        categorized: Dict[str, List[str]] = {cat: [] for cat in self.taxonomy_data.keys()}
        all_detected_names: List[str] = []

        for skill_info in found_skills_map.values():
            all_detected_names.append(skill_info["name"])
            cat = skill_info["category"]
            if cat in categorized:
                categorized[cat].append(skill_info["name"])

        return {
            "all_detected": sorted(list(set(all_detected_names))),
            "categorized": categorized,
            "details": list(found_skills_map.values())
        }

    def match_against_role(self, detected_skills: List[str], required_role_skills: List[str]) -> Dict[str, Any]:
        detected_set = set(detected_skills)
        required_set = set(required_role_skills)

        matched = sorted(list(detected_set.intersection(required_set)))
        missing = sorted(list(required_set.difference(detected_set)))

        match_pct = round((len(matched) / len(required_set) * 100), 1) if required_set else 100.0

        return {
            "matched_skills": matched,
            "missing_skills": missing,
            "match_percentage": match_pct
        }
