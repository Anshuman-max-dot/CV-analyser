# SMARRTIF AI — AI Career Profile Analyzer

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_Vite_TS-61DAFB.svg)](https://react.dev)
[![spaCy](https://img.shields.io/badge/NLP-spaCy-09A3D5.svg)](https://spacy.io)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg)](https://scikit-learn.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_PyMongo-47A248.svg)](https://www.mongodb.com)

**SMARRTIF AI** is a production-quality, AI-powered professional profile analyzer designed for technical hiring evaluation. It evaluates candidate CVs (PDF/DOCX), GitHub metric signals, social profile connections, and target job descriptions using spaCy NLP, TF-IDF semantic matching, a normalized 8-category skill taxonomy, and an explicit explainable 6-dimension scoring matrix.

---

## 🌟 Key Features

1. **Multi-Input Candidate Analysis**:
   - PDF & DOCX CV text extraction (`pypdf` & `python-docx`).
   - GitHub handle/URL live REST API audit.
   - Verified connection status representation for LinkedIn, Tableau Public, and Power BI without fake scraping.
   - Target Job Description semantic matching.

2. **Normalized Skill Taxonomy Engine**:
   - Classifies skills across 8 categories (*Programming, AI/ML, Frameworks, Web, Database, Cloud, DevOps, Data*).
   - Normalizes alias variations (e.g. `node js` ➔ `Node.js`, `scikit learn` ➔ `Scikit-learn`).

3. **Transparent Explainable Scoring Matrix**:
   $$\text{Overall Score} = (0.30 \times \text{Skills}) + (0.20 \times \text{Experience}) + (0.15 \times \text{Projects}) + (0.15 \times \text{ATS}) + (0.10 \times \text{Education}) + (0.10 \times \text{Semantic Match})$$
   - Every dimension provides explicit `score`, `weight`, `contribution`, `explanation`, and empirical `evidence`.

4. **ATS Resume Optimizer**:
   - Evaluates standard section headings (*Summary, Skills, Experience, Projects, Education*).
   - Identifies matched & missing keywords without encouraging keyword stuffing.
   - Detects passive phrasing (`worked on`, `helped`, `responsible for`) and suggests quantified action bullet points.

5. **Live GitHub Engineering Audit**:
   - Queries public GitHub REST API for repository count, followers, total stars, top programming language breakdown, and README documentation signals.

6. **Prioritized Action Roadmap**:
   - Generates categorized recommendations (*High, Medium, Low*) with Problem, Why it Matters, Recommended Action, and Expected Impact.

---

## 🚀 Quick Setup & Local Execution

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies & download spaCy model
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Start FastAPI server (Port 8000)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server (Port 5173)
npm run dev
```

### 3. Access Application
Open your browser at: `http://localhost:5173`

---

## 🧪 Testing

To run backend unit tests:
```bash
cd backend
venv/bin/pytest tests/test_backend.py
```

To run frontend TypeScript build validation:
```bash
cd frontend
npm run build
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── main.py                  # FastAPI REST API endpoints
│   ├── config.py                # Environment configuration
│   ├── data/                    # Taxonomy, role requirements matrix, sample candidate
│   ├── models/schemas.py        # Pydantic data models
│   ├── services/                # Modular NLP & scoring services
│   │   ├── cv_parser.py
│   │   ├── skill_extractor.py
│   │   ├── experience_analyzer.py
│   │   ├── project_analyzer.py
│   │   ├── ats_analyzer.py
│   │   ├── job_matcher.py
│   │   ├── scoring_engine.py
│   │   ├── recommendation_engine.py
│   │   ├── github_service.py
│   │   └── db_service.py
│   └── tests/                   # Pytest unit tests
├── frontend/
│   ├── src/
│   │   ├── components/          # Glassmorphic UI components & drawers
│   │   ├── pages/               # 9 SaaS routes (/analyze, /dashboard, /skills, /ats, etc.)
│   │   ├── services/api.ts      # REST API client
│   │   └── types/               # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── ARCHITECTURE.md              # System design & data pipeline
├── API.md                       # API documentation
├── SCORING.md                   # Scoring methodology & math formula
└── .env.example
```
