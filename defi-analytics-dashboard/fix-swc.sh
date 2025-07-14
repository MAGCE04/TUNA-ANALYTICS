#!/bin/bash

echo "🔧 Fixing SWC dependencies..."

# Create a temporary package.json with the correct SWC dependencies
cat > temp-package.json << EOL
{
  "name": "defi-tuna-analytics",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.4.12",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "axios": "^1.4.0",
    "chart.js": "^4.3.0",
    "date-fns": "^2.30.0",
    "react-chartjs-2": "^5.2.0",
    "recharts": "^2.7.2",
    "swr": "^2.2.0",
    "@next/swc-darwin-arm64": "13.4.12",
    "@next/swc-darwin-x64": "13.4.12",
    "@next/swc-linux-arm64-gnu": "13.4.12",
    "@next/swc-linux-arm64-musl": "13.4.12",
    "@next/swc-linux-x64-gnu": "13.4.12",
    "@next/swc-linux-x64-musl": "13.4.12",
    "@next/swc-win32-arm64-msvc": "13.4.12",
    "@next/swc-win32-ia32-msvc": "13.4.12",
    "@next/swc-win32-x64-msvc": "13.4.12"
  },
  "devDependencies": {
    "@types/node": "20.4.5",
    "@types/react": "18.2.17",
    "autoprefixer": "10.4.14",
    "postcss": "8.4.27",
    "tailwindcss": "3.3.3",
    "typescript": "5.1.6"
  }
}
EOL

# Replace the existing package.json with the temporary one
mv temp-package.json package.json

# Remove node_modules and package-lock.json
rm -rf node_modules
rm -f package-lock.json

# Reinstall dependencies
npm install

echo "✅ SWC dependencies fixed successfully!"