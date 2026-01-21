/**
 * Brookfield.pi Configuration
 */

export const domainConfig = {
  name: "Brookfield",
  displayName: "Brookfield.pi",
  domainKey: "brookfield",
  icon: "🏛️",
  tagline: "Property Investment",
  description: "Landmark property investment and development",
  sector: "Property Development",
  function: "Landmark projects, property valuation, and investment strategy",
  color: "from-stone-900 to-gray-900",
  category: "realestate",

  // Database
  database: "brookfield_db",

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
