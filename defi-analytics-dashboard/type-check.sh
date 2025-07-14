#!/bin/bash

echo "🔍 Running TypeScript type check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "✅ Type check passed successfully!"
else
  echo "⚠️ Type check failed. Please fix the errors above."
  echo "Note: You can still build the application with 'npm run build' as we've configured TypeScript to ignore errors during build."
fi