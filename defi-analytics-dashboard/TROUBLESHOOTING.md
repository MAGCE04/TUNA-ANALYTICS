# Troubleshooting Guide

This document provides solutions for common issues you might encounter when working with the DeFi Tuna Analytics Dashboard.

## 404 Page Not Found Errors

If you're experiencing 404 errors:

1. **Check your URL path**: Ensure you're using a valid route defined in the application.

2. **Clear browser cache**: Sometimes browsers cache old routing information.

3. **Rebuild the application**:
   ```bash
   npm run rebuild
   ```

4. **Check for deployment issues**: If deployed on Vercel, check the deployment logs for any routing errors.

## Build Errors

If you encounter build errors:

1. **Clear Next.js cache**:
   ```bash
   npm run clean
   ```

2. **Update dependencies**:
   ```bash
   npm update
   ```

3. **Force a complete rebuild**:
   ```bash
   npm run force-rebuild
   ```

## TypeScript Errors

For TypeScript-related issues:

1. **Run type checking**:
   ```bash
   npm run type-check
   ```

2. **Update TypeScript definitions**:
   ```bash
   npm install --save-dev @types/react @types/node
   ```

3. **Check for incompatible types**: Ensure your component props match their TypeScript interfaces.

## Data Not Loading

If data isn't loading properly:

1. **Check API routes**: Ensure the API routes are working correctly.

2. **Verify network requests**: Use browser developer tools to check for network errors.

3. **Check SWR cache**: Try using the `revalidate` function from SWR to refresh data.

## Styling Issues

For styling problems:

1. **Rebuild Tailwind CSS**:
   ```bash
   npx tailwindcss build -i styles/globals.css -o public/styles.css
   ```

2. **Check for conflicting styles**: Look for CSS conflicts in your components.

3. **Verify class names**: Ensure you're using the correct Tailwind class names.

## Deployment Issues

For deployment problems:

1. **Check environment variables**: Ensure all required environment variables are set.

2. **Verify build output**: Check the build logs for any errors.

3. **Test locally first**: Always test your changes locally before deploying.

## Still Having Issues?

If you're still experiencing problems:

1. Check the project's GitHub issues to see if others have encountered the same problem.

2. Create a new issue with detailed information about the problem, including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots or error logs
   - Environment details (browser, OS, Node.js version)