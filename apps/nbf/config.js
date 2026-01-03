/**
 * NBF.pi Configuration
 */

export const domainConfig = {
  name: 'NBF',
  displayName: 'NBF.pi',
  domainKey: 'nbf',
  icon: '🏦',
  tagline: 'Sovereign Banking',
  description: 'Next-generation banking with Pi Network settlements',
  sector: 'Banking',
  function: 'Financial planning, Pi settlements, and banking insights',
  color: 'from-purple-900 to-pink-900',
  category: 'finance',
  
  // Database
  database: 'nbf_db',
  
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
