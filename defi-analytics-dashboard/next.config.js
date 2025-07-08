/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server components for static export
  experimental: {
    appDir: true,
  },
  // Ensure trailing slashes for better static file serving
  trailingSlash: true,
  // Disable image optimization for static export
  distDir: 'out',
};

module.exports = nextConfig;