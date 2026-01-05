/**
 * DX.pi Configuration
 */

export const domainConfig = {
  name: 'DX',
  displayName: 'DX.pi',
  domainKey: 'dx',
  icon: '🚀',
  tagline: 'Digital Transformation',
  description: 'Advanced digital transformation services',
  sector: 'Technology',
  function: 'Digital transformation projects, innovation labs, and tech consulting',
  color: 'from-violet-900 to-purple-900',
  category: 'technology',
  
  // Database
  database: 'dx_db',
  
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
