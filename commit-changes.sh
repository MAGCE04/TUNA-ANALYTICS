#!/bin/bash

# Script to commit and push TypeScript configuration changes

echo "===== COMMITTING AND PUSHING TYPESCRIPT CONFIGURATION CHANGES ====="

# Navigate to the project root
cd /home/magce7564/DEFITUNA3

# Create the target/types directory if it doesn't exist
mkdir -p defi_analytics_program/target/types

# Add the changes to git
git add tsconfig.json defi_analytics_program/target/types/defi_analytics.ts

# Commit the changes
git commit -m "fix: exclude Anchor program from TypeScript compilation and add dummy types"

# Push to the main branch
git push origin main

echo "===== CHANGES COMMITTED AND PUSHED ====="