/**
 * Alert.pi Configuration
 */

export const domainConfig = {
  name: "Alert",
  displayName: "Alert.pi",
  domainKey: "alert",
  icon: "🔔",
  tagline: "Smart Notifications",
  description: "Real-time alerts and monitoring systems",
  sector: "Monitoring",
  function: "Critical alerts, market updates, and event tracking",
  color: "from-red-900 to-pink-900",
  category: "technology",

  // Database
  database: "alert_db",

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
