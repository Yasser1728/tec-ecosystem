// next.config.js
import i18nConfig from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig.i18n,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/validation-key.txt",
          destination: "/validation-key.txt",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.minepi.com https://sdk.minepi.com https://app-cdn.minepi.com",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
