#!/bin/bash

echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

echo "🔄 Reinstalling dependencies..."
npm ci

echo "🏗️ Rebuilding the application..."
npm run build

echo "✅ Build completed successfully!"