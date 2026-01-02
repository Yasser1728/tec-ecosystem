/**
 * Epic.pi Configuration
 */

export const domainConfig = {
  name: 'Epic',
  displayName: 'Epic.pi',
  domainKey: 'epic',
  icon: '🎯',
  tagline: 'Premium Projects',
  description: 'Exclusive high-value projects and opportunities',
  sector: 'Premium Services',
  function: 'Legacy projects, early access opportunities, and elite membership',
  color: 'from-orange-900 to-red-900',
  category: 'premium',
  
  // Database
  database: 'epic_db',
  
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
