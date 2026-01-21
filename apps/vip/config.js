/**
 * VIP.pi Configuration
 */

export const domainConfig = {
  name: "VIP",
  displayName: "VIP.pi",
  domainKey: "vip",
  icon: "👑",
  tagline: "Exclusive Opportunities",
  description: "VIP access to elite investment opportunities",
  sector: "VIP Services",
  function: "Exclusive opportunities, VIP events, and membership benefits",
  color: "from-yellow-900 to-amber-900",
  category: "premium",

  // Database
  database: "vip_db",

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
