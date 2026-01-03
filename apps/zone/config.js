/**
 * Zone.pi Configuration
 */

export const domainConfig = {
  name: 'Zone',
  displayName: 'Zone.pi',
  domainKey: 'zone',
  icon: '🌍',
  tagline: 'Regional Services',
  description: 'Location-based services and regional opportunities',
  sector: 'Regional Services',
  function: 'Optimal locations, economic zones, and investment guides',
  color: 'from-emerald-900 to-green-900',
  category: 'regional',
  
  // Database
  database: 'zone_db',
  
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
