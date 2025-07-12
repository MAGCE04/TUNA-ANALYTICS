#!/bin/bash

# Make the reinstall-typescript.sh script executable and run it
chmod +x /home/magce7564/DEFITUNA3/defi-analytics-dashboard/reinstall-typescript.sh
cd /home/magce7564/DEFITUNA3/defi-analytics-dashboard
./reinstall-typescript.sh

# Add changes to git
git add .
git commit -m "fix: add TypeScript for Vercel build"
git push origin main