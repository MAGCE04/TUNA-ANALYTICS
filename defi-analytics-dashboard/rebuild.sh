#!/bin/bash

# Script to force rebuild and restart the Next.js application

echo "Cleaning Next.js cache..."
rm -rf .next

echo "Cleaning node_modules/.cache..."
rm -rf node_modules/.cache

echo "Rebuilding the application..."
npm run build

echo "Starting the application..."
npm run start