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
};

export default nextConfig;
