/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // Disable TypeScript and ESLint errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Disable strict mode for production
  reactStrictMode: process.env.NODE_ENV !== 'production',
}

module.exports = nextConfig