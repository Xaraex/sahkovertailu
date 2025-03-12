/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.fingrid.fi', 'data.fingrid.fi'], // If you need images from Fingrid's API
  },
  // Added env configuration to make sure environment variables are available
  env: {
    FINGRID_API_KEY: process.env.FINGRID_API_KEY,
  },
  // Remove rewrites section - we'll use our API route exclusively
};

module.exports = nextConfig;