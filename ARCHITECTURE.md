# System Architecture & Technical Design

## Overview
SMARRTIF AI is designed as a decoupled, multi-stage NLP & scoring web application. The frontend is built using React with TypeScript, Vite, and Tailwind CSS. The backend is built using FastAPI with modular Python service packages.

```
                           ┌───────────────────────────────────────────────┐
                           │          React + Vite + TypeScript UI         │
                           │   / | /analyze | /dashboard | /skills | /ats  │
                           │   /github | /recommendations | /history       │
                           └───────────────────────┬───────────────────────┘
                                                   │ HTTP / REST APIs
                                                   ▼
                           ┌───────────────────────────────────────────────┐
                           │               FastAPI Backend                 │
                           │           main.py & Pydantic Schemas          │
                           └──────┬────────────────┬────────────────┬──────┘
                                  │                │                │
                                  ▼                ▼                ▼
                    ┌──────────────────┐ ┌────────────────┐ ┌──────────────────┐
                    │ NLP / Scoring    │ │ GitHub REST    │ │ Storage Layer    │
                    │ - spaCy          │ │ - Public API   │ │ - MongoDB Motor  │
                    │ - TF-IDF Matcher │ │ - Repos/Stars  │ │ - In-Memory      │
                    │ - Skill Taxonomy │ └────────────────┘ │   Fallback Store │
                    │ - ATS Optimizer  │                    └──────────────────┘
                    └──────────────────┘
```

## NLP Data Processing Pipeline

```
UPLOAD CV (PDF / DOCX)
  │
  ▼
CVParser: Text Extraction & Section Detection
  │
  ▼
SkillExtractor: spaCy NLP & Regex Taxonomy Matcher (8 Categories, Alias Normalization)
  │
  ▼
ExperienceAnalyzer: Year Detection & Action Verb Density
  │
  ▼
ProjectAnalyzer: Complexity Scoring & Bullet Point Rewriter
  │
  ▼
ATSAnalyzer: Section Checks, Keyword Match & Formatting Audit
  │
  ▼
JobMatcher: TF-IDF & Cosine Similarity Matcher
  │
  ▼
GitHubService: Live Public API Repo Audit
  │
  ▼
ScoringEngine: 6-Dimension Weighted Math Calculation
  │
  ▼
RecommendationEngine: Prioritized Action Plan Generation
  │
  ▼
DatabaseService: Mongo / Persistent Store Save & Response Delivery
```

## Database Design (MongoDB / Persistent Fallback)

### Collections:
- **`analyses`**: Stores candidate evaluation records indexed by unique UUID.
- **`skills`**: Taxonomy definitions and alias mappings.
- **`roles`**: Configurable role requirements matrix.
