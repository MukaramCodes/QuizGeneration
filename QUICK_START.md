# ⚡ Quick Start Checklist: Fly.io + Vercel

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] You have a GitHub account
- [ ] You're ready to follow the steps

---

## 🎯 Fly.io Backend (5-10 minutes)

- [ ] Sign up at https://fly.io
- [ ] Install Fly CLI: `iwr https://fly.io/install.ps1 -useb | iex`
- [ ] Login: `flyctl auth login`
- [ ] Navigate: `cd server`
- [ ] Launch: `flyctl launch`
  - [ ] Choose app name (or press Enter)
  - [ ] Choose region
  - [ ] Say `n` to PostgreSQL
  - [ ] Say `n` to Redis
  - [ ] Say `y` to deploy
- [ ] **COPY YOUR FLY.IO URL** (e.g., `https://your-app.fly.dev`)
- [ ] Test: Open `https://your-app.fly.dev/api/health` in browser

**Your Backend URL:** `https://____________________.fly.dev`

---

## 🎯 Vercel Frontend (5 minutes)

- [ ] Sign up at https://vercel.com (use GitHub)
- [ ] Click "Add New Project"
- [ ] Import your GitHub repo
- [ ] Configure:
  - [ ] Framework: **Vite**
  - [ ] Root Directory: **`client`**
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] **Add Environment Variable:**
  - [ ] Key: `VITE_API_BASE`
  - [ ] Value: `https://your-app.fly.dev` (from above)
  - [ ] Environments: Select ALL (Production, Preview, Development)
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] **COPY YOUR VERCEL URL**

**Your Frontend URL:** `https://____________________.vercel.app`

---

## 🧪 Test Your App

- [ ] Open your Vercel URL
- [ ] Upload a PDF or paste text
- [ ] Generate a quiz
- [ ] Answer questions
- [ ] Check results page

**If it works:** 🎉 **You're done!**

**If it doesn't work:** Check `DEPLOYMENT_GUIDE.md` troubleshooting section

---

## 📝 Important Notes

1. **Environment Variable is Critical**: Without `VITE_API_BASE`, your frontend won't connect to backend
2. **Both auto-deploy**: Push to GitHub → Both platforms auto-update
3. **Free tier limits**: Both are free for personal projects
4. **Backend URL**: Keep your Fly.io URL safe, you'll need it if you redeploy frontend

---

## 🔄 Updating Your App

**Backend (Fly.io):**
```powershell
cd server
flyctl deploy
```

**Frontend (Vercel):**
- Just push to GitHub! Vercel auto-deploys

---

## 🆘 Need Help?

- Check `DEPLOYMENT_GUIDE.md` for detailed steps
- Fly.io docs: https://fly.io/docs
- Vercel docs: https://vercel.com/docs

