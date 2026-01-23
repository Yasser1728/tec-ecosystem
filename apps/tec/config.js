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

  // Service Level Agreement (SLA)
  sla: {
    uptime: 99.99,
    responseTime: 200,
    supportHours: "24/7",
  },

  // AI Configuration
  ai: {
    model: "governance-approved",
    maxTokens: 500,
    temperature: 0.7,
    languages: ["en", "ar"],
  },

  // Compliance Configuration
  compliance: {
    standards: ["ISO27001", "SOC2", "GDPR"],
    lastAudit: "2026-01-23",
    dataResidency: "sovereign",
  },

  // Monitoring Configuration
  monitoring: {
    enabled: true,
    metricsInterval: 10,
    alertChannels: ["email", "slack"],
  },
};

export default domainConfig;
