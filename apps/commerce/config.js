/**
 * Commerce.pi Configuration
 */

export const domainConfig = {
  name: 'Commerce',
  displayName: 'Commerce.pi',
  domainKey: 'commerce',
  icon: '🛍️',
  tagline: 'B2B Trading',
  description: 'Business-to-business trading and commerce solutions',
  sector: 'B2B Trade',
  function: 'B2B trading strategies, market insights, and partner network',
  color: 'from-indigo-900 to-purple-900',
  category: 'trading',
  
  // Database
  database: 'commerce_db',
  
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
