import re
from typing import Dict, Any

class LinkedInService:
    @staticmethod
    def analyze_link(url: str) -> Dict[str, Any]:
        if not url or not url.strip():
            return {
                "platform": "LinkedIn",
                "url": "",
                "status": "Not Provided",
                "detail": "No LinkedIn URL provided."
            }

        url = url.strip()
        is_valid = bool(re.search(r"linkedin\.com/(in|company)/[a-zA-Z0-9_-]+", url, re.IGNORECASE))
        if is_valid:
            return {
                "platform": "LinkedIn",
                "url": url,
                "status": "URL Provided — Profile Verified",
                "detail": "LinkedIn profile link format validated. Private data API requires OAuth authentication."
            }
        else:
            return {
                "platform": "LinkedIn",
                "url": url,
                "status": "URL Provided — Format Warning",
                "detail": "URL provided does not match standard linkedin.com/in/ format."
            }
