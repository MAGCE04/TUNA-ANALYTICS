#!/bin/bash

echo "🔧 Creating a completely static solution..."

# Create necessary directories
mkdir -p public
mkdir -p .github/workflows

# Create static HTML files
echo "Creating static HTML files..."

# Create index.html
cat > ./public/index.html << 'EOL'
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
      max-width: 600px;
    }
    .button {
      display: inline-block;
      background-color: #00e4ff;
      color: #0a0e17;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s ease;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #00c4ff;
      transform: translateY(-2px);
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
  <p>Welcome to the DeFi Tuna Analytics Dashboard. This is a static fallback page.</p>
  
  <div class="loading"></div>
  
  <p>Please click the button below to access the dashboard:</p>
  
  <a href="/" class="button">Access Dashboard</a>
  
  <p style="margin-top: 40px; font-size: 14px;">If you continue to experience issues, please contact our support team.</p>
</body>
</html>
EOL

# Create 404.html
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

# Create _redirects
cat > ./public/_redirects << 'EOL'
/* /index.html 200
EOL

# Create GitHub Actions workflow
cat > ./.github/workflows/deploy.yml << 'EOL'
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build && npm run export

      - name: Copy static files
        run: |
          cp public/index.html out/
          cp public/404.html out/
          cp public/_redirects out/
          touch out/.nojekyll

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: out
EOL

# Create netlify.toml
cat > ./netlify.toml << 'EOL'
[build]
  publish = "out"
  command = "npm run build && npm run export"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOL

# Update package.json
echo "Updating package.json..."
npm pkg set scripts.export="next export"
npm pkg set scripts.static-build="next build && next export"

echo "✅ Static solution created successfully!"
echo "You can now deploy this to GitHub Pages, Netlify, or Vercel."
echo "For GitHub Pages, push to main and the GitHub Actions workflow will deploy it."
echo "For Netlify, connect your repository and it will use the netlify.toml configuration."
echo "For Vercel, connect your repository and it will use the vercel.json configuration."