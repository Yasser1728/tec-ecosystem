/**
 * Legend.pi Configuration
 */

export const domainConfig = {
  name: 'Legend',
  displayName: 'Legend.pi',
  domainKey: 'legend',
  icon: '🏆',
  tagline: 'Legacy Services',
  description: 'Heritage products and collectible investments',
  sector: 'Heritage & Collectibles',
  function: 'Legacy management, rare collectibles, and prestigious items',
  color: 'from-yellow-900 to-orange-900',
  category: 'premium',
  
  // Database
  database: 'legend_db',
  
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
