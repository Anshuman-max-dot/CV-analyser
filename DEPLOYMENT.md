# Free Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide provides step-by-step instructions to deploy **SMARRTIF AI** for free.

---

## Step 1: Push Code to GitHub

1. Open your terminal in the project root directory:
   ```bash
   cd "/Users/Apple/Documents/Projects/CV Analyzer"
   ```

2. Initialize Git and commit your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SMARRTIF AI profile analyzer"
   ```

3. Create a new repository on GitHub (e.g. `smarrtif-ai`) and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/smarrtif-ai.git
   git push -u origin main
   ```

---

## Step 2: Deploy Backend on Render (Free Tier)

1. Sign up/log in at [https://render.com](https://render.com).
2. Click **New +** ➔ Select **Web Service**.
3. Connect your GitHub repository `smarrtif-ai`.
4. Configure the Web Service settings:
   - **Name**: `smarrtif-ai-backend`
   - **Region**: Choose closest region (e.g. Oregon or Frankfurt)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python -m spacy download en_core_web_sm
     ```
   - **Start Command**: 
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: **Free**

5. Under **Environment Variables**, add:
   - `PYTHON_VERSION`: `3.11.9`
   - `MONGODB_URI`: *(Optional MongoDB Atlas URI or leave blank for persistent fallback)*
   - `GITHUB_TOKEN`: *(Optional GitHub token)*

6. Click **Deploy Web Service**.
7. Once deployed, copy your Render backend URL (e.g. `https://smarrtif-ai-backend.onrender.com`).

---

## Step 3: Deploy Frontend on Vercel (Free Tier)

1. Sign up/log in at [https://vercel.com](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository `smarrtif-ai`.
4. Configure the Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `frontend` (Click Edit ➔ select `frontend` folder).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://smarrtif-ai-backend.onrender.com/api` *(Your Render backend URL + `/api`)*
6. Click **Deploy**.

---

## 🎉 Done!
Your application will be live at `https://smarrtif-ai.vercel.app` communicating directly with your backend API on Render!
