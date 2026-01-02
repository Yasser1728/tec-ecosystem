/**
 * System.pi Configuration
 */

export const domainConfig = {
  name: 'System',
  displayName: 'System.pi',
  domainKey: 'system',
  icon: '⚙️',
  tagline: 'Operational Intelligence',
  description: 'System integration and operational excellence',
  sector: 'Operations',
  function: 'Operations management, workflow optimization, and system monitoring',
  color: 'from-slate-900 to-gray-900',
  category: 'technology',
  
  // Database
  database: 'system_db',
  
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
