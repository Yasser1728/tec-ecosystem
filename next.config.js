/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/commerce', destination: '/', permanent: true },
      { source: '/ecommerce', destination: '/', permanent: true },
      { source: '/assets', destination: '/', permanent: true },
      { source: '/analytics', destination: '/', permanent: true },
      { source: '/fundx', destination: '/', permanent: true },
      { source: '/estate', destination: '/', permanent: true },
      { source: '/insure', destination: '/', permanent: true },
      { source: '/dx', destination: '/', permanent: true },
      { source: '/explorer', destination: '/', permanent: true },
      { source: '/nbf', destination: '/', permanent: true },
      { source: '/epic', destination: '/', permanent: true },
      { source: '/legend', destination: '/', permanent: true },
      { source: '/connection', destination: '/', permanent: true },
      { source: '/system', destination: '/', permanent: true },
      { source: '/alerts', destination: '/', permanent: true },
      { source: '/nx', destination: '/', permanent: true },
      { source: '/nexus', destination: '/', permanent: true },
      { source: '/brookfield', destination: '/', permanent: true },
      { source: '/sab', destination: '/', permanent: true },
      { source: '/vip', destination: '/', permanent: true },
      { source: '/titan', destination: '/', permanent: true },
      { source: '/zone', destination: '/', permanent: true },
      { source: '/elite', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig
