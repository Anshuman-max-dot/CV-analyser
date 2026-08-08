import re
import httpx
from typing import Dict, List, Any, Optional

class GitHubService:
    @staticmethod
    def extract_username(github_input: str) -> Optional[str]:
        if not github_input:
            return None
        github_input = github_input.strip().rstrip("/")
        # Extract from URL e.g. https://github.com/torvalds -> torvalds
        match = re.search(r"github\.com/([a-zA-Z0-9_-]+)", github_input)
        if match:
            return match.group(1)
        # Direct username provided
        if re.match(r"^[a-zA-Z0-9_-]+$", github_input):
            return github_input
        return None

    @classmethod
    async def analyze_profile(cls, github_input: str, token: str = "") -> Dict[str, Any]:
        username = cls.extract_username(github_input)
        if not username:
            return {
                "username": "",
                "connected": False,
                "status_message": "No valid GitHub handle or URL provided",
                "public_repos_count": 0,
                "followers": 0,
                "total_stars": 0,
                "top_languages": {},
                "documentation_score": 0.0,
                "github_score": 0.0,
                "recent_repositories": [],
                "recommendations": ["Provide a valid public GitHub profile URL to enable automated repo audit."]
            }

        headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "SMARRTIF-AI-Analyzer"}
        if token:
            headers["Authorization"] = f"token {token}"

        async with httpx.AsyncClient(timeout=8.0) as client:
            try:
                # 1. Fetch User Profile
                user_resp = await client.get(f"https://api.github.com/users/{username}", headers=headers)
                if user_resp.status_code != 200:
                    return {
                        "username": username,
                        "connected": False,
                        "status_message": f"GitHub API user query returned status {user_resp.status_code}",
                        "public_repos_count": 0,
                        "followers": 0,
                        "total_stars": 0,
                        "top_languages": {},
                        "documentation_score": 0.0,
                        "github_score": 0.0,
                        "recent_repositories": [],
                        "recommendations": [f"Could not verify public user '{username}' on GitHub."]
                    }

                user_data = user_resp.json()
                public_repos_count = user_data.get("public_repos", 0)
                followers = user_data.get("followers", 0)

                # 2. Fetch User Repos (up to 30 public repos)
                repos_resp = await client.get(f"https://api.github.com/users/{username}/repos?sort=updated&per_page=30", headers=headers)
                repos_data = repos_resp.json() if repos_resp.status_code == 200 else []

                total_stars = 0
                languages_count: Dict[str, int] = {}
                recent_repos = []
                repos_with_description = 0

                for r in repos_data:
                    stars = r.get("stargazers_count", 0)
                    total_stars += stars
                    lang = r.get("language")
                    if lang:
                        languages_count[lang] = languages_count.get(lang, 0) + 1

                    if r.get("description"):
                        repos_with_description += 1

                    recent_repos.append({
                        "name": r.get("name"),
                        "stars": stars,
                        "forks": r.get("forks_count", 0),
                        "language": lang,
                        "description": r.get("description"),
                        "updated_at": r.get("updated_at", "")[:10],
                        "has_readme": bool(r.get("description"))  # Proxy signal
                    })

                # Compute Metrics
                doc_pct = round((repos_with_description / max(1, len(recent_repos))) * 100.0, 1)
                
                # GitHub Score Formula
                repo_score = min(40.0, public_repos_count * 2.5)
                star_score = min(30.0, total_stars * 1.5)
                doc_score = (doc_pct / 100.0) * 20.0
                diversity_score = min(10.0, len(languages_count) * 2.5)
                
                github_score = round(max(30.0, min(98.0, repo_score + star_score + doc_score + diversity_score)), 1)

                recommendations = []
                if doc_pct < 70:
                    recommendations.append("Add detailed README files and repository descriptions to all public projects.")
                if public_repos_count < 5:
                    recommendations.append("Publish more public repositories demonstrating technical depth in target role.")
                if len(languages_count) <= 1:
                    recommendations.append("Showcase multi-language versatility in public codebases.")

                return {
                    "username": username,
                    "connected": True,
                    "status_message": f"Connected — Public GitHub API data retrieved for '{username}'",
                    "public_repos_count": public_repos_count,
                    "followers": followers,
                    "total_stars": total_stars,
                    "top_languages": languages_count,
                    "documentation_score": doc_pct,
                    "github_score": github_score,
                    "recent_repositories": recent_repos[:6],
                    "recommendations": recommendations
                }

            except Exception as e:
                return {
                    "username": username,
                    "connected": False,
                    "status_message": f"GitHub API connection limit or error: {str(e)}",
                    "public_repos_count": 0,
                    "followers": 0,
                    "total_stars": 0,
                    "top_languages": {},
                    "documentation_score": 0.0,
                    "github_score": 0.0,
                    "recent_repositories": [],
                    "recommendations": ["Verify network connectivity or GitHub token status."]
                }
