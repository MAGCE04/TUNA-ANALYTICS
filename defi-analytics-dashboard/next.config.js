/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // Ensure we're not using stale cache
  generateEtags: false,
  // Disable image optimization to prevent caching issues
  images: {
    unoptimized: true,
  },
  // Add headers to prevent caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  // Disable webpack caching
  webpack: (config, { dev, isServer }) => {
    // Add cache busting for development
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },
  // Output standalone build for better Vercel compatibility
  output: 'standalone',
};

module.exports = nextConfig;