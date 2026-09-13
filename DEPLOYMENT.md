# Deployment Guide: Vercel & Render Setup

This guide provides step-by-step instructions to deploy **SMARRTIF AI**. You can deploy either as a single full-stack project on Vercel or with the Frontend on Vercel and Backend on Render/Railway.

---

## ⚡ Option 1: Full-Stack One-Click Vercel Deployment (Recommended)

Thanks to the root `vercel.json` and `api/index.py` serverless configuration, you can deploy the complete app (Frontend + FastAPI Backend) in 1 click directly on Vercel:

1. Push your repository to GitHub.
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Leave **Root Directory** as `./` (the root).
5. Click **Deploy**. Vercel will build the React Vite frontend and serve the FastAPI backend API at `/api/*`.

---

## 🌐 Option 2: Vercel (Frontend) + Render (Backend)

If you prefer a dedicated Python instance for heavy processing or background tasks:

### Step 1: Deploy Backend on Render (Free Tier)
1. Sign up/log in at [https://render.com](https://render.com).
2. Click **New +** ➔ Select **Web Service**.
3. Connect your GitHub repository.
4. Configure Web Service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Deploy Web Service** and copy your backend URL (e.g., `https://smarrtif-ai-backend.onrender.com`).

### Step 2: Deploy Frontend on Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.
3. Select **Root Directory**: `frontend`.
4. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://smarrtif-ai-backend.onrender.com/api`
5. Click **Deploy**.
