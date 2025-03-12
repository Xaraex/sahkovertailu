/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.fingrid.fi'], // Jos tarvitsemme kuvia Fingridin API:sta
  },
  // Tärkeää CORS-ongelmien välttämiseksi API-kutsuissa
  async rewrites() {
    return [
      {
        source: '/api/fingrid/:path*',
        destination: 'https://api.fingrid.fi/v1/avoindata-api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;