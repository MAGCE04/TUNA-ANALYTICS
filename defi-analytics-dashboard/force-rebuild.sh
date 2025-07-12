#!/bin/bash

# Force clean rebuild script for Next.js application

echo "===== STARTING CLEAN REBUILD PROCESS ====="

# Stop any running processes
echo "Stopping any running processes..."
pkill -f "node" || true

# Remove all build artifacts and caches
echo "Removing build artifacts and caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf out
rm -rf .vercel/output
rm -rf public/sw.js
rm -rf public/workbox-*.js

# Remove any conflicting files
echo "Removing any conflicting files..."
rm -f index.html
rm -f vite.config.js
rm -rf src

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "Reinstalling dependencies..."
rm -rf node_modules
npm install

# Clear browser cache instructions
echo "===== IMPORTANT ====="
echo "Please also clear your browser cache before testing:"
echo "1. Open Developer Tools (F12 or Ctrl+Shift+I)"
echo "2. Go to Network tab"
echo "3. Check 'Disable cache'"
echo "4. Hold Shift and click the refresh button"
echo "===================="

# Build the application
echo "Building the application..."
NODE_ENV=production npm run build

echo "===== REBUILD COMPLETE ====="
echo "You can now deploy the application with:"
echo "npm run start"