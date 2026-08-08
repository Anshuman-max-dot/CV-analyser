# Transparent Scoring Methodology

SMARRTIF AI enforces explicit, explainable mathematical scoring for candidate evaluation. Every candidate score is derived from a 6-dimension weighted formula where every component returns:
- `score` (out of 100)
- `weight` (decimal proportion)
- `contribution` (score * weight)
- `explanation` (human readable rationale)
- `evidence` (array of CV/profile snippets)

---

## 1. Weighted Formula

$$\text{Overall Score} = (0.30 \times \text{Skills}) + (0.20 \times \text{Experience}) + (0.15 \times \text{Projects}) + (0.15 \times \text{ATS}) + (0.10 \times \text{Education}) + (0.10 \times \text{Semantic Match})$$

---

## 2. Dimension Definitions

### 1. Skills Match (30%)
Calculates the proportion of target role required skills matched in the candidate's normalized skills taxonomy.

### 2. Experience Depth (20%)
Evaluates years of practical industry experience detected, role duration history, and action verb density (`Engineered`, `Architected`, `Spearheaded`).

### 3. Project Quality (15%)
Rates technical complexity based on framework usage and checks for quantified metric outcomes (% latency reduction, accuracy boost, scale).

### 4. ATS Compatibility (15%)
Checks standard section headings (*Summary, Skills, Experience, Projects, Education*), keyword coverage, and flags passive phrasing (`worked on`, `helped`).

### 5. Education Signal (10%)
Evaluates degree level (Master's/PhD = 95%, Bachelor's = 90%, Coursework = 80%) in Computer Science or related STEM fields.

### 6. Semantic Role Match (10%)
Computes TF-IDF vectorization and cosine similarity between candidate CV text and target job description/role benchmarks.

---

## 3. Status Labels

- **Exceptional Match**: Overall Score $\ge 88$
- **Strong Candidate**: $78 \le \text{Overall Score} < 88$
- **Moderate Match**: $68 \le \text{Overall Score} < 78$
- **Needs Profile Optimization**: Overall Score $< 68$
