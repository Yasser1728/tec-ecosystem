/**
 * TEC.pi Configuration
 * Professional configuration for the TEC central hub and AI assistant
 * 
 * @module config/tec-pi-config
 * @version 2.0.0
 * @governance TEC Council Approved
 * @compliance ISO27001, SOC2, GDPR
 */

/**
 * Core TEC.pi Configuration
 * Defines operational parameters, governance rules, and system behavior
 */
export const tecPiConfig = {
  // ========================================
  // IDENTITY & METADATA
  // ========================================
  identity: {
    name: "TEC.pi",
    nameAr: "تي إي سي",
    version: "2.0.0",
    domain: "tec.pi",
    role: "Central Hub & AI Assistant",
    roleAr: "المركز المركزي والمساعد الذكي",
    tagline: "Your Intelligent Guide to the TEC Ecosystem",
    taglineAr: "دليلك الذكي في نظام TEC البيئي",
  },

  // ========================================
  // SERVICE LEVEL AGREEMENT (SLA)
  // ========================================
  sla: {
    uptime: 99.99, // 99.99% uptime commitment
    responseTime: {
      p50: 50, // milliseconds
      p95: 200, // milliseconds
      p99: 500, // milliseconds
    },
    availabilityZones: 3, // Multi-region deployment
    dataReplication: "synchronous", // Real-time replication
    backupFrequency: "hourly",
    recoveryTimeObjective: 15, // minutes
    recoveryPointObjective: 5, // minutes (max data loss)
  },

  // ========================================
  // GOVERNANCE POLICIES
  // ========================================
  governance: {
    approvedBy: "TEC Council",
    policyVersion: "2.0",
    lastAudit: "2026-01-23",
    nextAudit: "2026-04-23",
    auditFrequency: "monthly",
    complianceFrameworks: [
      "ISO27001",
      "SOC2 Type II",
      "GDPR",
      "Zero-Trust Architecture",
    ],
    dataResidency: "sovereign",
    crossDomainAccessModel: "opt-in",
    sovereignControl: true,
  },

  // ========================================
  // AI ASSISTANT CONFIGURATION
  // ========================================
  assistant: {
    // Language Detection & Support
    languages: {
      supported: ["en", "ar"],
      defaultLanguage: "en",
      autoDetect: true,
      fallbackLanguage: "en",
    },

    // Operating Principles
    principles: {
      advisoryOnly: true, // Never execute irreversible actions
      humanApprovalRequired: true,
      domainSovereigntyRespect: true,
      zeroTrustValidation: true,
      governanceFirst: true,
    },

    // Behavior Configuration
    behavior: {
      tone: {
        default: "professional",
        vip: "exclusive",
        elite: "distinguished",
        titan: "authoritative",
        legend: "prestigious",
      },
      responseStyle: "concise", // concise, detailed, technical
      maxResponseLength: 500, // words
      contextRetention: 10, // number of conversation turns
    },

    // Recommendation Engine
    recommendations: {
      enabled: true,
      governanceApprovalRequired: true,
      maxSuggestions: 5,
      personalizedScoring: true,
      crossDomainSuggestions: "opt-in",
    },

    // Decision Support
    decisionSupport: {
      enabled: true,
      surfaceInsights: true,
      rawAnalytics: false, // Only governance-approved insights
      strategicFocus: true,
    },
  },

  // ========================================
  // DASHBOARD CONFIGURATION
  // ========================================
  dashboard: {
    // Layout Configuration
    layout: {
      defaultView: "overview",
      customizationAllowed: true,
      widgetSystem: "modular",
      responsiveBreakpoints: {
        mobile: 640,
        tablet: 768,
        desktop: 1024,
        ultrawide: 1920,
      },
    },

    // Widget Configuration
    widgets: {
      availableWidgets: [
        "financial-summary",
        "activity-feed",
        "notifications-center",
        "quick-stats",
        "domain-access",
        "smart-search",
        "recommendations-panel",
      ],
      maxWidgetsPerUser: 12,
      refreshInterval: 30000, // milliseconds
    },

    // Notification System
    notifications: {
      enabled: true,
      model: "event-based", // event-based, not noise-based
      channels: ["in-app", "email"],
      priority: {
        critical: true,
        high: true,
        medium: true,
        low: false, // Don't show low priority by default
      },
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "08:00",
      },
    },

    // Search Configuration
    search: {
      enabled: true,
      scope: "all-domains",
      aiPowered: true,
      indexing: "real-time",
      maxResults: 50,
      filters: ["domain", "category", "date", "type"],
    },
  },

  // ========================================
  // DOMAIN INTEGRATION
  // ========================================
  domainIntegration: {
    // Total number of domains
    totalDomains: 24,

    // Domain categories
    categories: {
      financial: {
        count: 4,
        domains: ["fundx.pi", "assets.pi", "nbf.pi", "insure.pi"],
      },
      premium: {
        count: 5,
        domains: ["vip.pi", "elite.pi", "titan.pi", "epic.pi", "legend.pi"],
      },
      commerce: {
        count: 3,
        domains: ["commerce.pi", "ecommerce.pi", "estate.pi"],
      },
      technology: {
        count: 7,
        domains: [
          "explorer.pi",
          "dx.pi",
          "nx.pi",
          "system.pi",
          "analytics.pi",
          "alert.pi",
          "nexus.pi",
        ],
      },
      specialized: {
        count: 4,
        domains: ["life.pi", "connection.pi", "brookfield.pi", "zone.pi"],
      },
      hub: {
        count: 1,
        domains: ["tec.pi"],
      },
    },

    // Access Control
    accessControl: {
      model: "role-based", // RBAC
      requiresAuthentication: true,
      singleSignOn: true,
      sessionTimeout: 3600, // seconds (1 hour)
      refreshTokenLifetime: 604800, // seconds (7 days)
    },

    // Cross-Domain Communication
    crossDomainCommunication: {
      enabled: true,
      requiresApproval: true,
      protocol: "event-bus",
      encryption: "end-to-end",
      auditLogging: true,
    },
  },

  // ========================================
  // SECURITY CONFIGURATION
  // ========================================
  security: {
    // Zero-Trust Principles
    zeroTrust: {
      enabled: true,
      continuousValidation: true,
      leastPrivilege: true,
      explicitVerification: true,
    },

    // Authentication
    authentication: {
      methods: ["pi-network", "oauth2", "jwt"],
      mfaRequired: false, // Optional but recommended
      mfaMethods: ["totp", "sms", "email"],
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expiryDays: 90,
      },
    },

    // Encryption
    encryption: {
      atRest: "AES-256",
      inTransit: "TLS 1.3",
      keyManagement: "hsm", // Hardware Security Module
      keyRotationPeriod: 90, // days
    },

    // Rate Limiting
    rateLimiting: {
      enabled: true,
      requests: {
        perSecond: 100,
        perMinute: 1000,
        perHour: 10000,
      },
      burstAllowance: 200,
    },

    // Audit Logging
    auditLogging: {
      enabled: true,
      retention: 2555, // days (7 years)
      immutable: true,
      includeDetails: true,
      logLevel: "info",
    },
  },

  // ========================================
  // MONITORING & OBSERVABILITY
  // ========================================
  monitoring: {
    // Metrics Collection
    metrics: {
      enabled: true,
      interval: 10, // seconds
      retention: 90, // days
      aggregation: "minute",
    },

    // Health Checks
    healthChecks: {
      enabled: true,
      interval: 30, // seconds
      endpoints: [
        "/health",
        "/health/database",
        "/health/cache",
        "/health/domains",
      ],
      timeout: 5000, // milliseconds
    },

    // Alerts
    alerts: {
      enabled: true,
      channels: ["email", "slack", "pagerduty"],
      thresholds: {
        errorRate: 1, // percent
        responseTime: 1000, // milliseconds
        uptime: 99.9, // percent
        cpuUsage: 80, // percent
        memoryUsage: 80, // percent
      },
    },

    // Performance Tracking
    performance: {
      apm: true, // Application Performance Monitoring
      tracing: true, // Distributed tracing
      profiling: false, // CPU/Memory profiling (production: false)
      realUserMonitoring: true,
    },
  },

  // ========================================
  // FEATURE FLAGS
  // ========================================
  features: {
    aiAssistant: true,
    dashboard: true,
    recommendations: true,
    crossDomainSearch: true,
    notifications: true,
    analytics: true,
    customWidgets: true,
    exportData: true,
    bulkOperations: false, // Disabled for safety
    betaFeatures: false,
  },

  // ========================================
  // OPERATIONAL LIMITS
  // ========================================
  limits: {
    maxConcurrentUsers: 10000,
    maxSessionsPerUser: 5,
    maxDashboardWidgets: 12,
    maxSearchResults: 100,
    maxFileUploadSize: 10485760, // bytes (10 MB)
    maxApiCallsPerDay: 100000,
  },

  // ========================================
  // CONTACT & SUPPORT
  // ========================================
  contact: {
    support: {
      email: "support@tec.pi",
      emailAr: "support@tec.pi",
      phone: "+1-XXX-XXX-XXXX",
      hours: "24/7",
      hoursAr: "24/7",
    },
    technical: {
      email: "tech@tec.pi",
      emergencyEmail: "emergency@tec.pi",
      escalationEmail: "escalation@tec.pi",
    },
    governance: {
      email: "governance@tec.pi",
      council: "council@tec.pi",
    },
  },
};

/**
 * TEC.pi Operational Status
 * Current operational status and metrics
 */
export const tecPiStatus = {
  operational: true,
  lastUpdated: new Date().toISOString(),
  services: {
    aiAssistant: "operational",
    dashboard: "operational",
    authentication: "operational",
    domainRouter: "operational",
    notifications: "operational",
  },
  metrics: {
    uptime: 99.99,
    activeUsers: 0,
    responsTimeP95: 150, // milliseconds
    errorRate: 0.01, // percent
  },
};

/**
 * Helper function to get configuration value
 * @param {string} path - Dot-notation path to config value
 * @returns {any} Configuration value
 */
export function getConfig(path) {
  return path.split(".").reduce((obj, key) => obj?.[key], tecPiConfig);
}

/**
 * Helper function to check if feature is enabled
 * @param {string} featureName - Name of the feature
 * @returns {boolean} Whether feature is enabled
 */
export function isFeatureEnabled(featureName) {
  return tecPiConfig.features[featureName] === true;
}

/**
 * Helper function to get SLA commitment
 * @returns {number} SLA uptime percentage
 */
export function getSLA() {
  return tecPiConfig.sla.uptime;
}

/**
 * Helper function to check if governance approval is required
 * @param {string} action - Action requiring approval
 * @returns {boolean} Whether approval is required
 */
export function requiresGovernanceApproval(action) {
  const approvalRequired = {
    crossDomainAccess: true,
    dataExport: true,
    bulkOperations: true,
    systemConfiguration: true,
  };
  return approvalRequired[action] || false;
}

export default tecPiConfig;
