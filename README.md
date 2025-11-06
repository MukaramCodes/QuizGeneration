Quizgen - Auto MCQ Generator from Lecture Materials

Overview
- Upload a lecture/assignment presentation (PDF/PPT/PPTX/TXT) or paste text
- Backend extracts text and generates MCQs automatically
- Frontend shows an interactive quiz and final results with a score

Tech Stack
- Backend: Node.js + Express, Multer, textract
- Frontend: React + Vite, react-router

Prerequisites
- Node.js 18+
- On Windows, textract may require additional dependencies for some formats. If extraction fails for PPT/PPTX, try converting to PDF or TXT.

Setup
1) Install dependencies

Windows PowerShell:
```
cd "W:\Uni Work\Quizgen"
cd server; npm install; cd ..
cd client; npm install; cd ..
```

2) Run the servers (two terminals)
```
cd "W:\Uni Work\Quizgen\server"; npm run dev
```
```
cd "W:\Uni Work\Quizgen\client"; npm run dev
```

3) Open the app
- Visit http://localhost:5173

Usage
1. On the homepage, upload a PDF/PPT/PPTX/TXT (or paste text)
2. Click Generate Quiz to create a 10-question MCQ
3. Answer questions and submit
4. See which answers were correct/wrong and your final score

Notes
- Files are not persisted; quizzes are stored in-memory and cleared on server restart
- If PPT/PPTX extraction fails on your system, try uploading a PDF or paste text instead

## 🚀 FREE Cloud Deployment (No Install Required)

**Step 1: Push to GitHub**
- Create a new repository on GitHub
- Push this entire folder to GitHub

**Step 2: Deploy Backend (Choose ONE)**

### Option A: Railway (Recommended - $5/month free credit)
1. Go to https://railway.app and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Add Service" → "GitHub Repo" → select your repo again
5. In service settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm ci`
   - **Start Command**: `npm start`
6. After deployment, copy your Railway URL (e.g., `https://your-app.up.railway.app`)

### Option B: Fly.io (Free tier available)
1. Go to https://fly.io and sign up
2. Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
3. In terminal, navigate to `server` folder:
   ```bash
   cd server
   fly launch
   ```
4. Follow prompts (use default settings)
5. Deploy: `fly deploy`
6. Copy your Fly.io URL (e.g., `https://your-app.fly.dev`)

### Option C: Cyclic.sh (100% Free)
1. Go to https://cyclic.sh and sign up with GitHub
2. Click "New App" → Connect your GitHub repo
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm ci`
   - **Start Command**: `npm start`
4. Deploy and copy URL (e.g., `https://your-app.cyclic.app`)

### Option D: Replit (Free tier)
1. Go to https://replit.com and sign up
2. Click "Create Repl" → "Import from GitHub"
3. Select your repo and set root to `server`
4. Click "Run" - Replit auto-detects Node.js
5. Copy your Replit URL (e.g., `https://your-app.replit.app`)

**Step 3: Deploy Frontend (Choose ONE)**

### Option A: Vercel (Recommended - Free Forever)
1. Go to https://vercel.com and sign up with GitHub
2. Click "New Project" → Import your GitHub repo
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_BASE` = your backend URL from Step 2
4. Click "Deploy"
5. Your app is live! (e.g., `https://your-app.vercel.app`)

### Option B: Netlify (Free Forever)
1. Go to https://netlify.com and sign up with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repo
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - **Environment variables**: Add `VITE_API_BASE` = your backend URL
5. Click "Deploy site"
6. Your app is live! (e.g., `https://your-app.netlify.app`)

### Option C: Cloudflare Pages (Free Forever)
1. Go to https://pages.cloudflare.com and sign up
2. Connect your GitHub account
3. Select your repository
4. Configure:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `client`
   - **Environment variables**: Add `VITE_API_BASE` = your backend URL
5. Deploy!

**Quick Comparison:**
- **Backend**: Railway (easiest) > Cyclic.sh (100% free) > Fly.io > Replit
- **Frontend**: Vercel (best) = Netlify (best) > Cloudflare Pages

**All options above are FREE and don't require installing anything on your computer!**



