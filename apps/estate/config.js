/**
 * Estate.pi Configuration
 */

export const domainConfig = {
  name: "Estate",
  displayName: "Estate.pi",
  domainKey: "estate",
  icon: "🏠",
  tagline: "Real Estate Marketplace",
  description: "Luxury real estate and property investment opportunities",
  sector: "Real Estate",
  function: "Property marketplace, investment guidance, and valuation services",
  color: "from-green-900 to-emerald-900",
  category: "realestate",

  // Database
  database: "estate_db",

  // Security
  forensicEnabled: true,
  approvalRequired: true,
  sovereignEmail: process.env.SOVEREIGN_EMAIL || "yasserrr.fox17@gmail.com",

  // Features
  features: {
    payments: true,
    nftMinting: true,
    subscriptions: true,
    marketplace: true,
    analytics: true,
  },

  // Thresholds
  thresholds: {
    autoApproveAmount: 1000, // PI
    manualReviewAmount: 10000, // PI
    criticalAmount: 50000, // PI
  },
};

export default domainConfig;
