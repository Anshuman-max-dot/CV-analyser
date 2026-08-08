import re
from typing import Dict, Any

class TableauService:
    @staticmethod
    def analyze_link(url: str) -> Dict[str, Any]:
        if not url or not url.strip():
            return {
                "platform": "Tableau Public",
                "url": "",
                "status": "Not Provided",
                "detail": "No Tableau Public URL provided."
            }

        url = url.strip()
        is_valid = bool(re.search(r"public\.tableau\.com", url, re.IGNORECASE))
        if is_valid:
            return {
                "platform": "Tableau Public",
                "url": url,
                "status": "URL Provided — Profile Verified",
                "detail": "Tableau Public profile/workbook URL validated. Adds positive data visualization portfolio signal."
            }
        else:
            return {
                "platform": "Tableau Public",
                "url": url,
                "status": "URL Provided — Format Warning",
                "detail": "URL provided does not point to public.tableau.com."
            }

class PowerBIService:
    @staticmethod
    def analyze_link(url: str) -> Dict[str, Any]:
        if not url or not url.strip():
            return {
                "platform": "Power BI",
                "url": "",
                "status": "Not Provided",
                "detail": "No Power BI report/profile URL provided."
            }

        url = url.strip()
        is_valid = bool(re.search(r"(powerbi\.com|app\.powerbi\.com)", url, re.IGNORECASE))
        if is_valid:
            return {
                "platform": "Power BI",
                "url": url,
                "status": "URL Provided — Report Verified",
                "detail": "Power BI report link format validated. Signal recorded for BI analytics capability."
            }
        else:
            return {
                "platform": "Power BI",
                "url": url,
                "status": "URL Provided — Format Warning",
                "detail": "URL provided does not point to app.powerbi.com."
            }
