const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const fallbackHtml = fs.readFileSync(path.join(__dirname, 'public', 'fallback.html'), 'utf8');

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Handle API routes
    if (pathname.startsWith('/api/')) {
      handle(req, res, parsedUrl);
      return;
    }

    // Handle Next.js assets
    if (pathname.startsWith('/_next/')) {
      handle(req, res, parsedUrl);
      return;
    }

    // Handle static files
    if (pathname.includes('.')) {
      handle(req, res, parsedUrl);
      return;
    }

    // Valid routes
    const validRoutes = ['/', '/revenue', '/liquidations', '/orders', '/pools', '/users', '/wallets'];
    
    if (validRoutes.includes(pathname)) {
      handle(req, res, parsedUrl);
      return;
    }

    // For all other routes, redirect to home
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fallbackHtml);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});