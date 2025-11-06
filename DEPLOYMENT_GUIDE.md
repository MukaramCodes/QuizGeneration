# 🚀 Step-by-Step Deployment Guide: Fly.io + Vercel

## Prerequisites
- A GitHub account
- Your code pushed to a GitHub repository

---

## Part 1: Deploy Backend on Fly.io

### Step 1: Sign up for Fly.io
1. Go to https://fly.io
2. Click **"Sign Up"** (use GitHub login for easiest setup)
3. Complete the signup process

### Step 2: Install Fly CLI
**For Windows (PowerShell):**
```powershell
# Run this in PowerShell (as Administrator if needed)
iwr https://fly.io/install.ps1 -useb | iex
```

**Alternative (if above doesn't work):**
1. Download from: https://github.com/superfly/flyctl/releases
2. Extract and add to your PATH

**Verify installation:**
```powershell
flyctl version
```

### Step 3: Login to Fly.io
```powershell
flyctl auth login
```
This will open your browser to authenticate.

### Step 4: Navigate to Server Folder
```powershell
cd "W:\Uni Work\Quizgen\server"
```

### Step 5: Launch Your App
```powershell
flyctl launch
```

**When prompted:**
- **App name**: Enter a unique name (e.g., `quizgen-api-yourname`) or press Enter for auto-generated
- **Region**: Choose closest to you (e.g., `iad` for US East, `lhr` for London)
- **PostgreSQL**: Type `n` (we don't need a database)
- **Redis**: Type `n` (we don't need Redis)
- **Deploy now**: Type `y` to deploy immediately

### Step 6: Get Your Backend URL
After deployment completes, you'll see:
```
App is available at https://your-app-name.fly.dev
```

**Copy this URL!** You'll need it for Vercel.

### Step 7: Test Your Backend
Open in browser: `https://your-app-name.fly.dev/api/health`

You should see: `{"ok":true}`

**If you need to update later:**
```powershell
cd "W:\Uni Work\Quizgen\server"
flyctl deploy
```

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Sign up for Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### Step 2: Create New Project
1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. **Import** your Quizgen repository

### Step 3: Configure Project Settings
Fill in these settings:

**Framework Preset:**
- Select: **Vite**

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Change from `/` to: `client`
- Click **"Continue"**

**Build and Output Settings:**
- **Build Command**: `npm run build` (should auto-fill)
- **Output Directory**: `dist` (should auto-fill)
- **Install Command**: `npm install` (should auto-fill)

### Step 4: Add Environment Variable
**This is CRITICAL!**

1. Scroll down to **"Environment Variables"** section
2. Click **"Add"** or **"Add Another"**
3. Add this variable:
   - **Key**: `VITE_API_BASE`
   - **Value**: `https://your-app-name.fly.dev` (use your Fly.io URL from Part 1, Step 6)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **"Save"**

### Step 5: Deploy
1. Click **"Deploy"** button at the bottom
2. Wait 1-2 minutes for build to complete
3. You'll see: **"Congratulations! Your project has been deployed."**

### Step 6: Get Your Frontend URL
After deployment, you'll see:
```
Your site is live at https://your-app-name.vercel.app
```

**Click the URL to open your app!**

---

## Part 3: Test Your Live App

1. Open your Vercel URL in browser
2. Try uploading a PDF or pasting some text
3. Generate a quiz and test it
4. Check if results display correctly

**If something doesn't work:**
- Check browser console (F12) for errors
- Verify `VITE_API_BASE` in Vercel settings matches your Fly.io URL
- Make sure Fly.io backend is running (test `/api/health` endpoint)

---

## Troubleshooting

### Fly.io Issues

**"Command not found: flyctl"**
- Make sure Fly CLI is installed and in your PATH
- Try: `flyctl version` to verify

**Deployment fails**
- Check: `flyctl logs` to see error messages
- Make sure `server/package.json` exists
- Verify Dockerfile is correct

**Backend not responding**
- Check status: `flyctl status`
- View logs: `flyctl logs`
- Restart: `flyctl apps restart your-app-name`

### Vercel Issues

**Build fails**
- Check build logs in Vercel dashboard
- Make sure `client/package.json` exists
- Verify Root Directory is set to `client`

**API calls fail (CORS or 404)**
- Double-check `VITE_API_BASE` environment variable
- Make sure it's set for all environments (Production, Preview, Development)
- Redeploy after changing environment variables

**Frontend shows blank page**
- Check browser console (F12) for errors
- Verify the build completed successfully
- Check if routes are working

---

## Quick Commands Reference

### Fly.io
```powershell
# Login
flyctl auth login

# Deploy
cd server
flyctl deploy

# View logs
flyctl logs

# Check status
flyctl status

# Open app
flyctl open
```

### Vercel
- All done through web dashboard
- To update: Just push to GitHub, Vercel auto-deploys!

---

## Next Steps

✅ Your app is now live!
- Share your Vercel URL with others
- Both Fly.io and Vercel auto-deploy on git push
- Monitor usage in both dashboards

**Remember:**
- Fly.io free tier: 3 shared-cpu-1x VMs with 256MB RAM
- Vercel: Unlimited deployments on free tier
- Both are free for personal projects!

