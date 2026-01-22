/**
 * FundX.pi Configuration
 */

export const domainConfig = {
  name: "FundX",
  displayName: "FundX.pi",
  domainKey: "fundx",
  icon: "📊",
  tagline: "Investment Strategies",
  description: "Sovereign investment strategies powered by Pi Network",
  sector: "Investment",
  function:
    "Investment strategies, ROI calculation, and portfolio optimization",
  color: "from-blue-900 to-indigo-900",
  category: "finance",

  // Database
  database: "fundx_db",

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
