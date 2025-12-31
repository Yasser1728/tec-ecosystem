// next.config.js
const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  // Serve static files from public without i18n prefix
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // Rewrites to bypass i18n for static validation file
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

module.exports = nextConfig;
