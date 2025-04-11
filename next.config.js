/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "random.imagecdn.app" }],
    remotePatterns: [{ protocol: "http", hostname: "iwiygi-assets.s3.amazonaws.com" }],
    domains: ['iwiygi-assets.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
