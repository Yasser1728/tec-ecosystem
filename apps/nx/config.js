/**
 * NX.pi Configuration
 */

export const domainConfig = {
  name: 'NX',
  displayName: 'NX.pi',
  domainKey: 'nx',
  icon: '🔮',
  tagline: 'Next-Gen Technology',
  description: 'Future technology and innovation services',
  sector: 'Innovation',
  function: 'Next-gen projects, tech labs, and innovation insights',
  color: 'from-fuchsia-900 to-pink-900',
  category: 'technology',
  
  // Database
  database: 'nx_db',
  
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
