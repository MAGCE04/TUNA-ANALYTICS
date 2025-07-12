#!/bin/bash

echo "🧹 Cleaning up..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Reinstalling dependencies..."
npm ci

echo "🏗️ Rebuilding the application..."
npm run build

echo "✅ Build complete! Run 'npm start' to start the application."