/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable this if you need to import components from outside src directory
  experimental: {
    externalDir: true
  },

};

module.exports = nextConfig;