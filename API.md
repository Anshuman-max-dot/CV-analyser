# REST API Documentation

Base URL: `http://localhost:8000/api`

## Endpoints Summary

### 1. `POST /api/analyze`
Submits candidate profile data, CV text, profile links, and target job description for full AI evaluation.

**Request Body (`application/json`)**:
```json
{
  "candidate_info": {
    "name": "Alex Mercer",
    "email": "alex.mercer@example.com",
    "target_role": "AI/ML Engineer",
    "linkedin_url": "https://linkedin.com/in/alex-mercer-ai",
    "github_url": "https://github.com/torvalds",
    "tableau_url": "https://public.tableau.com/profile/alexmercer",
    "powerbi_url": "https://app.powerbi.com/view?r=sample"
  },
  "cv_text": "ALEX MERCER...",
  "job_description": "We are seeking a senior AI/ML Engineer..."
}
```

**Response (`200 OK`)**: Returns complete `AnalysisResponse` payload with `overall_score`, `breakdown`, `skills_analysis`, `ats_analysis`, `github_analysis`, `recommendations`, `project_analysis`, and `experience_analysis`.

---

### 2. `POST /api/upload-cv`
Extracts raw text and parsed section boundaries from an uploaded PDF or DOCX file.

**Request Body (`multipart/form-data`)**:
- `file`: PDF or DOCX file binary.

**Response (`200 OK`)**:
```json
{
  "filename": "resume.pdf",
  "size_bytes": 1048576,
  "character_count": 2450,
  "text": "ALEX MERCER...",
  "sections": {
    "summary": "...",
    "skills": "...",
    "experience": "...",
    "projects": "...",
    "education": "..."
  }
}
```

---

### 3. `GET /api/github/{username}`
Fetches live public GitHub API profile metrics, repositories, stars, language counts, and documentation score for a handle.

---

### 4. `GET /api/roles`
Returns configured role requirements matrix for all 7 supported candidate target roles.

---

### 5. `GET /api/sample-candidate`
Returns realistic demo candidate dataset for instant testing.

---

### 6. `GET /api/analysis`
Lists previous candidate analysis history records stored in the database.

---

### 7. `GET /api/health`
Returns system health status, MongoDB connectivity, and version.
