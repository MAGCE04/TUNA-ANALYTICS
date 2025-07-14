#!/bin/bash

echo "🔧 Fixing all issues..."

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
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #0a0e17;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .logo {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 30px;
      color: #94a3b8;
    }
    .loading {
      display: inline-block;
      width: 50px;
      height: 50px;
      border: 4px solid rgba(0, 228, 255, 0.3);
      border-radius: 50%;
      border-top-color: #00e4ff;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="logo">🐟</div>
  <h1>DeFi Tuna Analytics Dashboard</h1>
  <p>Loading the dashboard...</p>
  <div class="loading"></div>
  <script>
    // Redirect to the Next.js app
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
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #0a0e17;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .logo {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 30px;
      color: #94a3b8;
      max-width: 600px;
    }
  </style>
</head>
<body>
  <div class="logo">🐟</div>
  <h1>Page Not Found</h1>
  <p>Redirecting to home page...</p>
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

# Clean build artifacts
echo "Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Rebuild the application
echo "Rebuilding the application..."
npm run build

echo "✅ All issues fixed successfully!"