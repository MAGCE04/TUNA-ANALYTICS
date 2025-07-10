/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  // Only use these settings if you need a static export
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
  // distDir: 'out',
};

module.exports = nextConfig;