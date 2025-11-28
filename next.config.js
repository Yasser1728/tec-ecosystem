/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // الدومينات الفرعية جاهزة
      { source: '/commerce', destination: '/commerce', permanent: true },
      { source: '/ecommerce', destination: '/ecommerce', permanent: true },
      { source: '/assets', destination: '/assets', permanent: true },
      { source: '/fundx', destination: '/fundx', permanent: true },
      { source: '/estate', destination: '/estate', permanent: true },
      { source: '/insure', destination: '/insure', permanent: true },
      { source: '/dx', destination: '/dx', permanent: true },
      { source: '/explorer', destination: '/explorer', permanent: true },
      { source: '/nbf', destination: '/nbf', permanent: true },
      { source: '/epic', destination: '/epic', permanent: true },
      { source: '/legend', destination: '/legend', permanent: true },
      { source: '/connection', destination: '/connection', permanent: true },
      { source: '/system', destination: '/system', permanent: true },
      { source: '/alerts', destination: '/alerts', permanent: true },
      { source: '/nx', destination: '/nx', permanent: true },
      { source: '/nexus', destination: '/nexus', permanent: true },
      { source: '/brookfield', destination: '/brookfield', permanent: true },
      { source: '/sab', destination: '/sab', permanent: true },
      { source: '/vip', destination: '/vip', permanent: true },
      { source: '/titan', destination: '/titan', permanent: true },
      { source: '/zone', destination: '/zone', permanent: true },
      { source: '/elite', destination: '/elite', permanent: true },

      // أي مسار غير موجود يروح للـ Landing Page
      { source: '/:path*', destination: '/', permanent: false },
    ]
  },
}

module.exports = nextConfig
