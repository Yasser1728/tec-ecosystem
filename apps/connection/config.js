/**
 * Connection.pi Configuration
 */

export const domainConfig = {
  name: "Connection",
  displayName: "Connection.pi",
  domainKey: "connection",
  icon: "🔗",
  tagline: "Elite Networking",
  description: "Connect with high-value business partners",
  sector: "Networking",
  function: "Partner matching, strategic alliances, and elite communities",
  color: "from-teal-900 to-cyan-900",
  category: "networking",

  // Database
  database: "connection_db",

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
