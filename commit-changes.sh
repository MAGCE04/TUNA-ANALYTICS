#!/bin/bash

# Script to commit and push TypeScript configuration changes

echo "===== COMMITTING AND PUSHING TYPESCRIPT CONFIGURATION CHANGES ====="

# Navigate to the project root
cd /home/magce7564/DEFITUNA3

# Add the changes to git
git add package.json tsconfig.json

# Commit the changes
git commit -m "fix: add TypeScript for Vercel build"

# Push to the main branch
git push origin main

echo "===== CHANGES COMMITTED AND PUSHED ====="