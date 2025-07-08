/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for better static file serving
  trailingSlash: true,
  // Disable server components for static export
  experimental: {
    appDir: true,
  },
  // Specify the base path if deploying to a subdirectory
  // basePath: '/defi-analytics',
};

module.exports = nextConfig;