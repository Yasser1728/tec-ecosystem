/**
 * TEC.pi Configuration
 */

export const domainConfig = {
  name: "TEC",
  displayName: "TEC.pi",
  domainKey: "tec",
  icon: "🎪",
  tagline: "Ecosystem Hub",
  description: "Central hub for all TEC services and business units",
  sector: "Ecosystem Management",
  function: "Central marketplace, ecosystem overview, and strategic guidance",
  color: "from-purple-900 to-indigo-900",
  category: "hub",

  // Database
  database: "tec_db",

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
