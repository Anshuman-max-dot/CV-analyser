import math
import re
from typing import Dict, List, Any

def _compute_pure_tfidf_similarity(doc1: str, doc2: str) -> float:
    """Lightweight pure-Python TF-IDF Cosine Similarity calculation."""
    stop_words = {
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
        "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't",
        "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
        "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he",
        "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
        "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
        "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
        "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll",
        "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs",
        "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've",
        "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll",
        "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while",
        "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
        "you've", "your", "yours", "yourself", "yourselves"
    }

    def get_tokens(text: str) -> List[str]:
        words = [w for w in re.findall(r"\b[a-z0-9]+\b", text.lower()) if len(w) > 1 and w not in stop_words]
        bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words)-1)]
        return words + bigrams

    tokens1 = get_tokens(doc1)
    tokens2 = get_tokens(doc2)

    if not tokens1 or not tokens2:
        return 0.75

    vocab = sorted(list(set(tokens1).union(set(tokens2))))
    if not vocab:
        return 0.75

    counts1 = {w: tokens1.count(w) for w in vocab}
    counts2 = {w: tokens2.count(w) for w in vocab}
    len1 = len(tokens1)
    len2 = len(tokens2)

    tf1 = {w: counts1[w] / len1 for w in vocab}
    tf2 = {w: counts2[w] / len2 for w in vocab}

    N = 2
    idf = {}
    for w in vocab:
        df = (1 if counts1[w] > 0 else 0) + (1 if counts2[w] > 0 else 0)
        idf[w] = math.log((N + 1) / (df + 1)) + 1.0

    vec1 = [tf1[w] * idf[w] for w in vocab]
    vec2 = [tf2[w] * idf[w] for w in vocab]

    dot_product = sum(v1 * v2 for v1, v2 in zip(vec1, vec2))
    mag1 = math.sqrt(sum(v1 * v1 for v1 in vec1))
    mag2 = math.sqrt(sum(v2 * v2 for v2 in vec2))

    if mag1 == 0 or mag2 == 0:
        return 0.75

    return dot_product / (mag1 * mag2)


class JobMatcher:
    @classmethod
    def match(cls, cv_text: str, candidate_skills: List[str], target_role: str, required_role_skills: List[str], job_description: str = "") -> Dict[str, Any]:
        reference_text = f"Role: {target_role}. Required Skills: {', '.join(required_role_skills)}. {job_description}"
        
        cv_clean = cv_text.lower()
        ref_clean = reference_text.lower()

        raw_match_pct = 75.0

        # Try sklearn if present, otherwise use pure Python TF-IDF cosine similarity
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
            tfidf_matrix = vectorizer.fit_transform([cv_clean, ref_clean])
            sim_score = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
            raw_match_pct = round(sim_score * 100.0, 1)
        except Exception:
            sim_score = _compute_pure_tfidf_similarity(cv_clean, ref_clean)
            raw_match_pct = round(sim_score * 100.0, 1)

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
