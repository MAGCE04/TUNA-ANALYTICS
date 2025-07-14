#!/bin/bash

echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

echo "🔄 Running fix scripts..."
./fix-typescript.sh
./fix-404.sh

echo "🏗️ Rebuilding the application..."
npm run build

echo "✅ Build completed successfully!"