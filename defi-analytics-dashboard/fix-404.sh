#!/bin/bash

echo "🔍 Diagnosing and fixing 404 errors..."

# Clear all caches
echo "🧹 Clearing caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .vercel/output

# Ensure correct Next.js version
echo "📦 Checking Next.js version..."
npm list next || echo "Next.js not found in node_modules, will reinstall"

# Reinstall dependencies
echo "🔄 Reinstalling dependencies..."
rm -rf node_modules
npm install

# Build the application with verbose logging
echo "🏗️ Building application with verbose logging..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Start the application
echo "✅ Build complete! Starting application..."
npm start