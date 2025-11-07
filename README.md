# Quizgen – AI Quiz Generator for Lecture Materials

## Overview
- Upload up to 10 PDF/TXT files or paste text directly
- Browser cleans and merges the content, then a tiny Node/Express backend calls **Google Gemini 1.5 Flash** (free tier)
- Gemini returns high-quality MCQs with explanations; the UI stores them in localStorage for instant practice
- Automatic fallback to the heuristic generator if the AI call fails

## Tech Stack
- **Frontend**: React 18 + Vite + React Router
- **Text extraction**: PDF.js (PDF), FileReader (TXT), local cleaning utilities
- **Backend**: Express + @google/generative-ai
- **AI Model**: Google Gemini 1.5 Flash (configurable)
- **Storage**: Browser localStorage / sessionStorage

## Key Features
- ✅ AI-generated MCQs with explanations
- ✅ Upload multiple lectures at once (PDF/TXT) + paste support
- ✅ Submission requires every question answered
- ✅ Detailed results view with correct/incorrect flags
- ✅ Resilient: falls back to heuristic generator if the AI call fails

## Prerequisites
- Node.js 18+
- Modern browser (Chrome, Firefox, Edge, Safari)
- Google AI Studio account (free) to obtain a Gemini API key

---

## 🔑 Obtain a Free Gemini API Key
1. Visit https://makersuite.google.com/app/apikey (Google AI Studio)
2. Create/select a project → generate an API key
3. Copy the key
4. Create `server/.env` with:
   ```env
   GEMINI_API_KEY=your-key-here
   # Optional: GEMINI_MODEL=gemini-1.5-flash
   ```

---

## 🚀 Local Development

```powershell
# From repo root
cd server
npm install

cd ..\client
npm install

# Terminal A – backend
cd ..\server
npm run dev

# Terminal B – frontend
cd ..\client
npm run dev
```

Open http://localhost:5173 to use the app.

> The Vite dev server proxies `/api/*` to the Express backend on port 4000.

---

## 📦 Production Build
- Frontend: `cd client && npm run build` → deploy `client/dist`
- Backend: `cd server && npm install && npm start`

Environment variables required in production:
- `GEMINI_API_KEY`
- optional `GEMINI_MODEL` (defaults to `gemini-1.5-flash`)

---

## 🌐 Deployment Options

### Backend (choose one free option)
- **Render / Railway / Fly.io / Cyclic / Cloudflare Workers**
  - Root: `server`
  - Build: `npm install`
  - Start: `npm start`
  - Env: `GEMINI_API_KEY=<your_key>`

### Frontend (Vercel / Netlify / Cloudflare Pages / GitHub Pages)
1. Root: `client`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Env: `VITE_API_BASE=<backend URL>` (e.g., `https://quizgen-api.onrender.com`)

---

## Usage Flow
1. Upload up to 10 lecture PDFs/TXTs or paste text
2. Click **Generate Quiz** – Gemini builds MCQs (fallback generator runs if the AI request fails)
3. Complete every question → submit
4. Review detailed results (correct/incorrect + explanations)

Quizzes and results persist in localStorage until you clear them.

---

## Supported File Formats
- ✅ Text-based PDF (best quality)
- ✅ TXT / pasted notes
- ⚠️ Other formats → convert to PDF or paste text

---

## Troubleshooting
- **“AI request failed”** → ensure backend is running and `GEMINI_API_KEY` is valid
- **Quiz still weak** → Gemini might need more context; try uploading more detailed notes
- **PDF extraction issues** → use text-based PDFs or copy/paste the contents
- **Deployment** → make sure both backend and frontend have the correct environment variables

---

## Project Structure
```
client/
  src/
    components/      # Upload, Quiz, Results UI
    lib/             # AI call helpers, text extraction, fallback generator
    App.jsx          # Routes + state
    main.jsx         # React entry
server/
  src/index.js       # Express API bridge to Gemini
  package.json
```

---

Enjoy generating smart quizzes from your lecture materials! 🎓

