# Deploy AppView to minigolfscoretracker.com/app

## ✅ What I've Done

1. ✅ Copied `app-view` folder into your main project
2. ✅ Created `netlify.toml` at the root to build both your UI and AppView site
3. ✅ Updated `ui/netlify.toml` to exclude `/app` from React Router redirects

## 🚀 Simple Deployment Steps

### Step 1: Commit and Push

```bash
cd "/Users/mohammadzayed/Desktop/Mini Golf Score Tracker"

# Add all files
git add .

# Commit
git commit -m "Add AppView marketing site at /app"

# Push to GitHub
git push
```

### Step 2: Netlify Will Automatically Build

Netlify will:
1. Build your UI (React app)
2. Build the AppView site
3. Copy AppView files into `ui/dist/app/`
4. Deploy everything

**Build time:** ~3-5 minutes

### Step 3: Test

Once deployed, visit:
- `minigolfscoretracker.com` - Your web app (unchanged)
- `minigolfscoretracker.com/app` - Your new AppView marketing site! 🎉

## 📝 What's In The AppView Site

- ✅ Golf ball app icon
- ✅ All 7 screenshots with iPhone bezels
- ✅ Green color theme matching your app
- ✅ 5.0 star rating badge
- ✅ Feature sections for all your app's capabilities
- ✅ SEO optimized
- ✅ Mobile responsive
- ✅ Dark/light mode support

## 🔧 If Something Goes Wrong

### Build Fails on Netlify?

Check the Netlify build log. Most common issues:
- Node version too old (should be 18+)
- Missing dependencies (Netlify will install automatically)

### /app shows 404?

- Make sure the build completed successfully
- Check that `netlify.toml` is at the root of your project
- Clear Netlify cache and retry deploy

### Need to Update Content Later?

Edit files in `app-view/app/(main)/page.tsx` and push again!

---

**Ready to deploy!** Just commit and push to GitHub.

Your website will be live at `minigolfscoretracker.com/app` in a few minutes! 🚀
