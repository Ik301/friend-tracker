#!/bin/bash
npm run build
cd dist
git init
git add -A
git commit -m 'Deploy to GitHub Pages'
git push -f git@github.com:USERNAME/friend-tracker.git main:gh-pages
