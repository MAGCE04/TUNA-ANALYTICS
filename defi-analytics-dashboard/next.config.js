/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Enable app directory
  experimental: {
    appDir: true,
  },
  // Ensure trailing slashes for better static file serving
  trailingSlash: true,
  // Set output directory
  distDir: 'out',
};

module.exports = nextConfig;