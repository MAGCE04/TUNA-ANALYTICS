#!/bin/bash

# Script to force rebuild and restart the Next.js application

echo "Cleaning project..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf out

echo "Removing any conflicting files..."
# Remove any Vite-related files
rm -f index.html
rm -f vite.config.js
rm -rf src

echo "Installing dependencies..."
npm install

echo "Rebuilding the application..."
npm run build

echo "Starting the application..."
npm run start