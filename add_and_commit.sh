#!/bin/bash
cd "/Users/mohammadzayed/Desktop/Mini Golf Score Tracker"

echo "Adding files to git..."
git add netlify.toml
git add DEPLOY_APPVIEW.md
git add ui/netlify.toml
git add app-view

echo "Creating commit..."
git commit -m "Add AppView marketing site at /app"

echo "Done! Now you can run: git push"
