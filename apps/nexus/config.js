/**
 * Nexus.pi Configuration
 */

export const domainConfig = {
  name: "Nexus",
  displayName: "Nexus.pi",
  domainKey: "nexus",
  icon: "🌐",
  tagline: "AI-Powered Integration",
  description:
    "Connect, coordinate, and integrate your business with AI-powered solutions",
  sector: "AI & Integration",
  function: "Business integration, AI solutions, and coordination hub",
  color: "from-indigo-900 to-blue-900",
  category: "technology",

  // Database
  database: "nexus_db",

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
