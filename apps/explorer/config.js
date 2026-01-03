/**
 * Explorer.pi Configuration
 */

export const domainConfig = {
  name: 'Explorer',
  displayName: 'Explorer.pi',
  domainKey: 'explorer',
  icon: '✈️',
  tagline: 'Luxury Travel',
  description: 'Exclusive travel experiences and residency programs',
  sector: 'Travel & Lifestyle',
  function: 'Private jet charter, residency programs, and luxury travel packages',
  color: 'from-sky-900 to-blue-900',
  category: 'lifestyle',
  
  // Database
  database: 'explorer_db',
  
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
