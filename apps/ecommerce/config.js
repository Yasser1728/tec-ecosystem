/**
 * Ecommerce.pi Configuration
 */

export const domainConfig = {
  name: "Ecommerce",
  displayName: "Ecommerce.pi",
  domainKey: "ecommerce",
  icon: "🛒",
  tagline: "Digital Commerce",
  description: "Access rare luxury goods and digital products",
  sector: "Digital Retail",
  function: "Luxury goods marketplace, digital products, and sales analytics",
  color: "from-pink-900 to-rose-900",
  category: "retail",

  // Database
  database: "ecommerce_db",

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
