/**
 * Elite.pi Configuration
 */

export const domainConfig = {
  name: 'Elite',
  displayName: 'Elite.pi',
  domainKey: 'elite',
  icon: '⭐',
  tagline: 'Premium Consulting',
  description: 'Elite business consulting and advisory services',
  sector: 'Consulting',
  function: 'Premium insights, business consulting, and networking events',
  color: 'from-amber-900 to-yellow-900',
  category: 'consulting',
  
  // Database
  database: 'elite_db',
  
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
