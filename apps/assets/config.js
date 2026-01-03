/**
 * Assets.pi Configuration
 */

export const domainConfig = {
  name: 'Assets',
  displayName: 'Assets.pi',
  domainKey: 'assets',
  icon: '💼',
  tagline: 'Portfolio Management',
  description: 'Professional asset management and portfolio optimization',
  sector: 'Asset Management',
  function: 'Portfolio management, asset valuation, and performance tracking',
  color: 'from-green-900 to-teal-900',
  category: 'finance',
  
  // Database
  database: 'assets_db',
  
  // Security
  forensicEnabled: true,
  approvalRequired: true,
  sovereignEmail: process.env.SOVEREIGN_EMAIL || 'yasserrr.fox17@gmail.com',
  
  // Features
  features: {
    payments: true,
    nftMinting: true,
    subscriptions: true,
    marketplace: true,
    analytics: true
  },
  
  // Thresholds
  thresholds: {
    autoApproveAmount: 1000, // PI
    manualReviewAmount: 10000, // PI
    criticalAmount: 50000 // PI
  }
};

export default domainConfig;
