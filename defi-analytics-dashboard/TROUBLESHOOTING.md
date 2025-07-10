# How to Fix the Frontend Update Issue

Follow these steps to resolve the issue with the frontend not updating:

## 1. Delete the conflicting layout.js file

The presence of both `layout.js` and `layout.tsx` is causing conflicts. I've already deleted the `layout.js` file for you.

## 2. Clear Next.js cache

Next.js caches aggressively, which can prevent updates from appearing. Run these commands:

```bash
# Navigate to your project directory
cd /home/magce7564/DEFITUNA2/defi-analytics-dashboard

# Remove the .next cache directory
rm -rf .next

# Remove node_modules cache
rm -rf node_modules/.cache
```

## 3. Rebuild and restart the application

```bash
# Make the rebuild script executable
chmod +x rebuild.sh

# Run the rebuild script
./rebuild.sh
```

## 4. If using development server

If you're using the development server instead of a production build:

```bash
# Stop any running Next.js processes
# Then start the development server with cache disabled
npm run dev
```

## 5. Hard refresh your browser

Once the server is running again, do a hard refresh in your browser:
- Chrome/Firefox: Ctrl+Shift+R or Cmd+Shift+R (Mac)
- Or clear your browser cache completely

## Additional Troubleshooting

If the issue persists:

1. Check if you're viewing the correct URL (make sure you're not on a cached version)
2. Verify that the server is actually running the updated code
3. Try a different browser to rule out browser-specific caching issues
4. Check the browser console for any errors that might be preventing the page from rendering correctly

The changes should now be visible in your application.