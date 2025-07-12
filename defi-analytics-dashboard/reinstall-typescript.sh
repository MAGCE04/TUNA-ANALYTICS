#!/bin/bash

# Script to reinstall TypeScript and ensure proper configuration

echo "===== REINSTALLING TYPESCRIPT FOR VERCEL ====="

# Remove TypeScript from package.json and reinstall
echo "Reinstalling TypeScript..."
npm uninstall typescript
npm install --save-dev typescript

# Ensure tsconfig.json is valid
echo "Verifying tsconfig.json..."
if [ ! -f tsconfig.json ]; then
  echo "Creating tsconfig.json..."
  npx tsc --init
fi

echo "TypeScript has been reinstalled and configured."
echo "===== DONE ====="