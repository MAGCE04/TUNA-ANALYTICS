#!/bin/bash

echo "🔍 Checking for 404 issues..."

# Create public directory if it doesn't exist
mkdir -p public

# Create a 404.html file that redirects to index.html
echo "Creating 404.html with redirect to index.html..."

cat > ./public/404.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DeFi Tuna Analytics - Redirecting...</title>
  <script>
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    // This script takes the current URL and converts the path and query
    // string into just a query string, and then redirects the browser
    // to the new URL with only a query string and hash fragment.
    var pathSegmentsToKeep = 0;

    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  <h1>Redirecting...</h1>
  <p>If you are not redirected automatically, <a href="/">click here</a>.</p>
</body>
</html>
EOL

# Update index.html to handle the redirect
echo "Updating index.html to handle redirects..."

cat > ./public/index.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DeFi Tuna Analytics</title>
  <script>
    // Handle redirects from 404.html
    (function() {
      var redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      if (redirect && redirect != location.href) {
        history.replaceState(null, null, redirect);
      }
      
      // Handle SPA redirects
      var l = window.location;
      if (l.search[1] === '/') {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&');
        }).join('?');
        window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    })();
  </script>
  <meta http-equiv="refresh" content="0;url=/" />
</head>
<body>
  <div id="root"></div>
  <script>
    // Redirect to the Next.js app
    window.location.href = '/';
  </script>
</body>
</html>
EOL

echo "✅ 404 handling files created successfully!"