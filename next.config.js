/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  images: {
    domains: ["ipfs.io", "res.cloudinary.com"]
  },
  compress: true
};

module.exports = nextConfig;
