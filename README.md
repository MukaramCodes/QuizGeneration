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

No-install cloud deployment (recommended if npm isn't available)
1) Push this folder to a GitHub repo.
2) Backend on Render (free):
   - New Web Service → Connect your repo → root: `server`
   - Runtime: Node 18; Build command: `npm ci`; Start command: `npm start`
   - After deploy, copy the backend URL (e.g., https://quizgen-api.onrender.com)
3) Frontend on Render (Static Site):
   - New Static Site → Connect same repo → root: `client`
   - Build command: `npm ci && npm run build`; Publish directory: `dist`
   - Add Environment Variable: `VITE_API_BASE` = your backend URL
   - Deploy and open the site URL



