#!/bin/bash
cd "/Users/mohammadzayed/Desktop/Mini Golf Score Tracker"

echo "Adding specific files..."
git add .gitignore
git add netlify.toml
git add DEPLOY_APPVIEW.md
git add ui/netlify.toml

echo "Adding app-view files..."
find app-view -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.css" -o -name "*.svg" -o -name "*.png" -o -name "*.jpg" -o -name ".gitignore" \) -print0 | xargs -0 git add

echo "Done!"
git status --short | head -20
