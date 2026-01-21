/**
 * Insure.pi Configuration
 */

export const domainConfig = {
  name: "Insure",
  displayName: "Insure.pi",
  domainKey: "insure",
  icon: "🛡️",
  tagline: "Deal Protection",
  description: "Comprehensive insurance for your investments and assets",
  sector: "Insurance",
  function: "Asset protection, deal insurance, and claim management",
  color: "from-red-900 to-orange-900",
  category: "insurance",

  // Database
  database: "insure_db",

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
