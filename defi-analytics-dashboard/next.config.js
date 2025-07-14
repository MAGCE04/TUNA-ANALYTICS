/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // Ensure we're not using stale cache
  generateEtags: false,
  // Disable image optimization to prevent caching issues
  images: {
    unoptimized: true,
    domains: ['solana.com', 'arweave.net'], // Allow Solana-related image domains
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
    
    // Ignore specific modules that cause issues with SSR
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    
    return config;
  },
  // Output standalone build for better Vercel compatibility
  output: 'standalone',
  // Ignore TypeScript and ESLint errors during builds
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Experimental features for Solana compatibility
  experimental: {
    // Enable app directory
    appDir: true,
    // Optimize server components
    serverComponents: true,
    // Improve client-side navigation
    scrollRestoration: true,
  },
};

module.exports = nextConfig;