#!/bin/bash

# Script to fix TypeScript configuration for Vercel

echo "===== FIXING TYPESCRIPT CONFIGURATION FOR VERCEL ====="

# Ensure TypeScript is installed
echo "Ensuring TypeScript is installed..."
npm install --save-dev typescript @types/react

# Ensure tsconfig.json exists and is valid
echo "Checking tsconfig.json..."
if [ ! -f tsconfig.json ]; then
  echo "Creating tsconfig.json..."
  npx tsc --init
fi

# Run a simple build to verify everything works
echo "Running build to verify configuration..."
npm run build

echo "===== TYPESCRIPT CONFIGURATION FIXED ====="