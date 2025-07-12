#!/bin/bash

# TypeScript check script
echo "===== RUNNING TYPESCRIPT TYPE CHECK ====="

# Run TypeScript compiler in noEmit mode to check types
npx tsc --noEmit

# Check if TypeScript found errors
if [ $? -eq 0 ]; then
  echo "✅ TypeScript check passed successfully!"
else
  echo "❌ TypeScript check failed. Please fix the errors above."
  exit 1
fi

echo "===== TYPE CHECK COMPLETE ====="