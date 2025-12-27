// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@public': path.resolve(__dirname, 'public'),
      '@private': path.resolve(__dirname, 'private'),
      '@components': path.resolve(__dirname, 'public/components'),
      '@pages': path.resolve(__dirname, 'public/pages'),
      '@styles': path.resolve(__dirname, 'public/styles'),
      '@hooks': path.resolve(__dirname, 'public/hooks'),
      '@utils': path.resolve(__dirname, 'public/utils'),
    };
    return config;
  }
}

module.exports = nextConfig;
