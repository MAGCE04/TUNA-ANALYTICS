#!/bin/bash

echo "🔧 Running Vercel deployment script..."

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Run the script to create the fix-swc.js script
node create-fix-swc-script.js

# Run the fix-swc.js script
node ./scripts/fix-swc.js

# Create necessary directories
mkdir -p public

# Create fallback.html if it doesn't exist
if [ ! -f ./public/fallback.html ]; then
  echo "Creating fallback.html..."
  cat > ./public/fallback.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DeFi Tuna Analytics Dashboard</title>
  <meta http-equiv="refresh" content="0;url=/" />
</head>
<body>
  <script>
    window.location.href = '/';
  </script>
</body>
</html>
EOL
fi

# Create 404.html if it doesn't exist
if [ ! -f ./public/404.html ]; then
  echo "Creating 404.html..."
  cat > ./public/404.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - DeFi Tuna Analytics</title>
  <meta http-equiv="refresh" content="0;url=/" />
</head>
<body>
  <script>
    window.location.href = '/';
  </script>
</body>
</html>
EOL
fi

# Create index.html if it doesn't exist
if [ ! -f ./public/index.html ]; then
  echo "Creating index.html..."
  cat > ./public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DeFi Tuna Analytics Dashboard</title>
  <meta http-equiv="refresh" content="0;url=/" />
</head>
<body>
  <script>
    window.location.href = '/';
  </script>
</body>
</html>
EOL
fi

echo "✅ Vercel deployment script completed successfully!"