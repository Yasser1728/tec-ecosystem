/**
 * Analytics.pi Configuration
 */

export const domainConfig = {
  name: 'Analytics',
  displayName: 'Analytics.pi',
  domainKey: 'analytics',
  icon: '📈',
  tagline: 'Data & Insights',
  description: 'Business intelligence and predictive analytics',
  sector: 'Data Analytics',
  function: 'Market trends analysis, intelligence reports, and predictive insights',
  color: 'from-blue-900 to-cyan-900',
  category: 'technology',
  
  // Database
  database: 'analytics_db',
  
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
