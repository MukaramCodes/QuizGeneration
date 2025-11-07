# Quizgen - Auto MCQ Generator from Lecture Materials

## Overview
- Upload up to 10 PDF/TXT files or paste text directly
- **Everything runs in your browser** - no backend needed!
- Automatically generates MCQs from your content
- Interactive quiz interface with instant results
- All data stored locally in your browser (localStorage)

## Tech Stack
- **Frontend**: React + Vite, react-router
- **Text Extraction**: PDF.js (for PDFs), FileReader API (for text files)
- **Storage**: Browser localStorage (no server needed!)

## Features
✅ **100% Client-Side** - No backend, no API calls, works offline after first load  
✅ **PDF Support** - Extract text from PDF files directly in browser  
✅ **Text Files & Multiple Uploads** - Upload up to 10 .txt/.pdf files or paste text  
✅ **Smarter Quiz Generation** - Builds context-aware, fill-in-the-blank MCQs from your notes  
✅ **Local Storage** - Quizzes and results saved in your browser  
✅ **No Installation** - Just open the app and use it!

## Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js 18+ (only needed for local development)

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```powershell
cd "W:\Uni Work\Quizgen\client"
npm install
```

### 2. Run Development Server
```powershell
npm run dev
```

### 3. Open in Browser
- Visit http://localhost:5173
- That's it! No backend needed!

---

## 📦 Production Build

### Build for Production
```powershell
cd client
npm run build
```

### Preview Production Build
```powershell
npm run preview
```

The built files will be in `client/dist/` - you can deploy this folder to any static hosting!

---

## 🌐 FREE Cloud Deployment (No Backend Needed!)

Since this is a **client-only app**, deployment is super simple! Just deploy the `client` folder.

### Option 1: Vercel (Recommended - Free Forever)
1. Go to https://vercel.com and sign up with GitHub
2. Click **"New Project"** → Import your GitHub repo
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **"Deploy"**
5. Your app is live! (e.g., `https://your-app.vercel.app`)

**No environment variables needed!** No backend to configure!

### Option 2: Netlify (Free Forever)
1. Go to https://netlify.com and sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your GitHub repo
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Click **"Deploy site"**
6. Done! (e.g., `https://your-app.netlify.app`)

### Option 3: Cloudflare Pages (Free Forever)
1. Go to https://pages.cloudflare.com and sign up
2. Connect your GitHub account
3. Select your repository
4. Configure:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `client`
5. Deploy!

### Option 4: GitHub Pages
1. Build your app: `cd client && npm run build`
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in your repo settings
4. Done!

---

## 📖 Usage

1. **Upload or Paste Content**
   - Upload up to 10 PDF/TXT files (or mix with pasted text)
   - For PowerPoint/Word files, export to PDF or copy/paste the text

2. **Generate Quiz**
   - Click "Generate Quiz"
   - Quiz is created instantly in your browser

3. **Take the Quiz**
   - Answer all questions (submission only allowed when every question is attempted)
   - Click "Submit" once all answers are selected

4. **View Results**
   - See your score and which answers were correct/wrong
   - Results are saved in your browser's localStorage

---

## 💾 Data Storage

- **Quizzes**: Stored in `localStorage` with key `quiz_<id>`
- **Results**: Stored in `localStorage` with key `results_<id>`
- **Current Session**: Stored in `sessionStorage` as `currentQuizId`

**Note**: Data is stored locally in your browser. Clearing browser data will remove saved quizzes.

---

## 🔧 Supported File Formats

- ✅ **PDF** - Extracted using PDF.js
- ✅ **TXT** - Read directly using FileReader API
- ✅ **Plain Text** - Paste directly into textarea

**For other formats** (PPT, DOCX, etc.), convert to PDF or copy/paste the text.

---

## 🎯 Advantages of Client-Only Approach

1. **No Backend Costs** - Zero server expenses
2. **Privacy** - All processing happens in your browser
3. **Speed** - No network latency for quiz generation
4. **Offline** - Works offline after first page load
5. **Simple Deployment** - Just static files, deploy anywhere
6. **No API Keys** - No configuration needed

---

## 📝 Notes

- PDF extraction works best with text-based PDFs (not scanned images)
- Large PDFs may take a few seconds to process
- Quizzes are generated algorithmically - quality depends on input text
- All data stays in your browser - nothing is sent to any server

---

## 🛠️ Development

### Project Structure
```
client/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Quiz generation & text extraction
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
└── package.json
```

### Key Files
- `src/lib/quizGenerator.js` - Quiz generation logic
- `src/lib/textExtraction.js` - PDF/text extraction
- `src/components/UploadForm.jsx` - File upload & text input
- `src/components/Quiz.jsx` - Quiz interface
- `src/components/Results.jsx` - Results display

---

## 🆘 Troubleshooting

**PDF extraction fails?**
- Try a different PDF (some PDFs are image-based)
- Copy text from PDF and paste directly

**Quiz not generating?**
- Make sure your text has enough content (at least a few sentences)
- Check browser console (F12) for errors

**Data lost after refresh?**
- localStorage persists across sessions
- sessionStorage is cleared when browser closes
- If data is missing, generate a new quiz

---

## 📄 License

Free to use for personal and educational purposes.

---

**Enjoy creating quizzes from your lecture materials! 🎓**
