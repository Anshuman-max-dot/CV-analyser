import io
import re
from typing import Dict, List, Tuple
from pypdf import PdfReader
from docx import Document

class CVParser:
    SECTION_HEADERS = {
        "summary": [r"summary", r"objective", r"profile", r"about me", r"professional summary"],
        "experience": [r"experience", r"work experience", r"employment history", r"career history", r"professional experience"],
        "education": [r"education", r"academic background", r"qualifications", r"degrees"],
        "projects": [r"projects", r"key projects", r"technical projects", r"portfolio"],
        "skills": [r"skills", r"technical skills", r"technologies", r"core competencies", r"expertise"],
        "certifications": [r"certifications", r"licenses", r"courses", r"awards"]
    }

    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        pdf = PdfReader(io.BytesIO(file_bytes))
        extracted_text = []
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)
        return "\n".join(extracted_text)

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        doc = Document(io.BytesIO(file_bytes))
        extracted_text = [paragraph.text for paragraph in doc.paragraphs if paragraph.text]
        return "\n".join(extracted_text)

    @classmethod
    def clean_text(cls, text: str) -> str:
        # Normalize whitespace while preserving line boundaries
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return "\n".join(lines)

    @classmethod
    def parse_sections(cls, text: str) -> Dict[str, str]:
        lines = text.splitlines()
        sections: Dict[str, List[str]] = {
            "summary": [],
            "experience": [],
            "education": [],
            "projects": [],
            "skills": [],
            "certifications": [],
            "other": []
        }
        current_section = "other"

        for line in lines:
            clean_line = line.strip().lower()
            # Remove bullets/numbers to match section titles
            header_candidate = re.sub(r"^[^a-zA-Z0-9]+", "", clean_line).strip()
            
            matched_header = False
            for sec_name, keywords in cls.SECTION_HEADERS.items():
                for kw in keywords:
                    if re.match(rf"^{kw}:?$", header_candidate, re.IGNORECASE):
                        current_section = sec_name
                        matched_header = True
                        break
                if matched_header:
                    break

            if not matched_header:
                sections[current_section].append(line)

        return {k: "\n".join(v).strip() for k, v in sections.items()}
