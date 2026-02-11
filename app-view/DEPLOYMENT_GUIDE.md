# Mini Golf Score Tracker - AppView Deployment Guide

Your website is fully customized and ready to deploy at **minigolfscoretracker.com/app**

## ✅ What's Been Completed

- ✅ App Store ID: 6755137607
- ✅ 5.0 star rating badge
- ✅ Green color theme matching your app
- ✅ All 7 screenshots imported
- ✅ App icon (golf ball)
- ✅ SEO metadata optimized
- ✅ Contact email: mohammadzayed521@gmail.com
- ✅ Configured for `/app` subdirectory

## 🚀 Deployment Options

### Option 1: Deploy with Vercel (Recommended - Easiest)

1. **Create a GitHub repository** for the app-view folder
2. **Push your code** to GitHub:
   ```bash
   cd app-view
   git init
   git add .
   git commit -m "Initial commit - Mini Golf Score Tracker website"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

4. **Configure your domain**:
   - In Vercel project settings → Domains
   - Add: `minigolfscoretracker.com/app`
   - Or set up a subdomain redirect

### Option 2: Build and Upload to Your Server

1. **Build the static site**:
   ```bash
   cd /Users/mohammadzayed/Desktop/AppView/minigolfscoretracker/app-view
   npm run build
   ```
   This will create an `out/` folder with all static files.

2. **Upload to your server**:
   - Upload the contents of the `out/` folder to your server at `/var/www/minigolfscoretracker.com/app/`
   - Or wherever your web root is located

3. **Configure your web server**:
   Make sure requests to `minigolfscoretracker.com/app` serve files from the correct directory.

### Option 3: Deploy with Netlify

1. **Drag and drop** (after building):
   ```bash
   npm run build
   ```
   Then drag the `out/` folder to https://app.netlify.com/drop

2. **Connect to GitHub** (like Vercel):
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `out`

## 📝 Important Notes

- **Base Path**: The site is configured for `/app` subdirectory
- **Build Time**: Initial build may take 5-10 minutes due to image processing
- **Screenshots**: All 7 iPhone screenshots are included with automatic bezels
- **Static Export**: No server required, pure HTML/CSS/JS

## 🎨 Customization After Deployment

If you need to change anything later:

1. **Update content**: Edit `app/(main)/page.tsx`
2. **Change colors**: Edit `src/constants.ts`
3. **Update metadata**: Edit `app/(main)/layout.tsx`
4. **Rebuild and redeploy**: `npm run build` then upload new `out/` folder

## 🔧 When You're Ready for /app Path

After deployment, your site will be accessible at:
- Production: `https://minigolfscoretracker.com/app`
- The root (`minigolfscoretracker.com`) will still serve your web app

## 📞 Support

If you need help:
- AppView docs: https://appview.dev/docs
- Email AppView creator: mykola@appview.dev
- Create GitHub issue in your private AppView repo

---

**Project Location**: `/Users/mohammadzayed/Desktop/AppView/minigolfscoretracker/app-view/`

Ready to deploy! 🚀
