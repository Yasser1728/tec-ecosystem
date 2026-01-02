/**
 * Titan.pi Configuration
 */

export const domainConfig = {
  name: 'Titan',
  displayName: 'Titan.pi',
  domainKey: 'titan',
  icon: '💪',
  tagline: 'Enterprise Solutions',
  description: 'Large-scale enterprise services and solutions',
  sector: 'Enterprise',
  function: 'Market authority, strategic tools, and exclusive enterprise access',
  color: 'from-gray-900 to-slate-900',
  category: 'enterprise',
  
  // Database
  database: 'titan_db',
  
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
