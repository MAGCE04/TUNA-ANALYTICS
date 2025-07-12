# Troubleshooting Guide

## 404 Errors on Vercel Deployment

If you're experiencing 404 errors on your Vercel deployment, follow these steps to resolve the issue:

### 1. Check Your Vercel Configuration

Make sure your `vercel.json` file has the correct routing configuration:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/" }
  ]
}
```

### 2. Ensure Proper Next.js Configuration

Update your `next.config.js` to include:

```js
module.exports = {
  // Other config...
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
}
```

### 3. Add Fallback Pages

Create fallback pages in both the `public` directory and the `pages` directory:

- `public/404.html`
- `pages/404.js`

### 4. Force a Clean Rebuild

Run the following commands to force a clean rebuild:

```bash
npm run clean
rm -rf .vercel/output
npm run build
```

### 5. Check for Conflicting Configurations

Ensure you don't have conflicting configurations between:
- App Router (`app` directory)
- Pages Router (`pages` directory)

### 6. Verify Middleware

Make sure your middleware isn't blocking any routes unintentionally.

### 7. Contact Vercel Support

If all else fails, contact Vercel support with your deployment logs.

## Common Issues

### Mixed Router Types

Next.js 13+ supports both the App Router and Pages Router. Make sure you're not mixing them incorrectly.

### Caching Issues

Vercel might cache your deployment. Try:

```bash
vercel --force
```

### Build Output Issues

Check your build output directory matches what Vercel expects:

```json
{
  "outputDirectory": ".next"
}
```