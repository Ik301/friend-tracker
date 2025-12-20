#!/bin/bash
npm run build
cd dist
git init
git add -A
git commit -m 'Deploy to GitHub Pages'
git push -f https://github.com/Ik301/friend-tracker.git main:gh-pages
