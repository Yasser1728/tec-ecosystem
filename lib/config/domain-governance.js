/**
 * TEC Ecosystem Domain Governance Policies
 * Professional governance framework for 24 sovereign domains
 * 
 * @module config/domain-governance
 * @version 2.0.0
 * @approvedBy TEC Council
 * @lastUpdated 2026-01-23
 */

/**
 * Domain Sovereignty Policy
 * Ensures each domain maintains independence and control
 */
export const domainSovereigntyPolicy = {
  version: "2.0.0",
  effectiveDate: "2026-01-23",
  approvedBy: "TEC Council",

  principles: {
    independence: {
      title: "Domain Independence",
      titleAr: "استقلالية النطاق",
      description:
        "Each domain operates independently with full sovereignty over its operations, data, and decisions.",
      descriptionAr:
        "كل نطاق يعمل بشكل مستقل مع السيادة الكاملة على عملياته وبياناته وقراراته.",
      enforcement: "mandatory",
    },

    dataOwnership: {
      title: "Data Ownership",
      titleAr: "ملكية البيانات",
      description:
        "Each domain owns and controls all data within its boundaries. No cross-domain data access without explicit approval.",
      descriptionAr:
        "كل نطاق يملك ويتحكم في جميع البيانات ضمن حدوده. لا يوجد وصول للبيانات عبر النطاقات بدون موافقة صريحة.",
      enforcement: "mandatory",
    },

    governanceApproval: {
      title: "Governance Approval",
      titleAr: "موافقة الحوكمة",
      description:
        "All cross-domain operations require explicit TEC Council approval.",
      descriptionAr:
        "جميع العمليات عبر النطاقات تتطلب موافقة صريحة من مجلس TEC.",
      enforcement: "mandatory",
    },

    noDataLeakage: {
      title: "Data Protection",
      titleAr: "حماية البيانات",
      description:
        "No domain data may be shared, analyzed, or accessed by other domains without explicit opt-in.",
      descriptionAr:
        "لا يمكن مشاركة أو تحليل أو الوصول إلى بيانات النطاق من قبل نطاقات أخرى بدون موافقة صريحة.",
      enforcement: "mandatory",
    },
  },

  requirements: {
    optInModel: {
      description:
        "All cross-domain integrations operate on explicit opt-in basis",
      required: true,
    },
    auditTrail: {
      description: "All cross-domain access is logged in immutable audit trail",
      required: true,
    },
    dataSovereignty: {
      description:
        "All data must reside in sovereign-controlled infrastructure",
      required: true,
    },
    complianceValidation: {
      description: "All operations must pass compliance validation checks",
      required: true,
    },
  },
};

/**
 * Service Level Agreement (SLA) Tiers
 * Defines SLA commitments for each domain tier
 */
export const slaTiers = {
  tier1: {
    name: "Tier 1 - Core Services",
    nameAr: "المستوى 1 - الخدمات الأساسية",
    uptime: 99.99,
    responseTime: 100, // milliseconds (P95)
    supportLevel: "24/7 Premium",
    auditFrequency: "monthly",
    domains: [
      "tec.pi",
      "fundx.pi",
      "commerce.pi",
      "explorer.pi",
      "nexus.pi",
    ],
    penalties: {
      below99_99: "10% credit",
      below99_9: "25% credit",
      below99: "50% credit",
    },
  },

  tier2: {
    name: "Tier 2 - Strategic Services",
    nameAr: "المستوى 2 - الخدمات الاستراتيجية",
    uptime: 99.9,
    responseTime: 200, // milliseconds (P95)
    supportLevel: "24/7 Standard",
    auditFrequency: "quarterly",
    domains: [
      "assets.pi",
      "nbf.pi",
      "vip.pi",
      "elite.pi",
      "titan.pi",
      "epic.pi",
      "legend.pi",
      "ecommerce.pi",
      "dx.pi",
      "analytics.pi",
    ],
    penalties: {
      below99_9: "10% credit",
      below99_5: "25% credit",
      below99: "50% credit",
    },
  },

  tier3: {
    name: "Tier 3 - Specialized Services",
    nameAr: "المستوى 3 - الخدمات المتخصصة",
    uptime: 99.5,
    responseTime: 500, // milliseconds (P95)
    supportLevel: "Business Hours",
    auditFrequency: "quarterly",
    domains: [
      "insure.pi",
      "estate.pi",
      "nx.pi",
      "system.pi",
      "alert.pi",
      "life.pi",
      "connection.pi",
      "brookfield.pi",
      "zone.pi",
    ],
    penalties: {
      below99_5: "5% credit",
      below99: "15% credit",
      below98: "30% credit",
    },
  },
};

/**
 * Compliance Requirements
 * Security and compliance standards for all domains
 */
export const complianceRequirements = {
  mandatory: {
    iso27001: {
      name: "ISO 27001",
      description: "Information Security Management System",
      applicableTo: "all",
      auditFrequency: "annual",
      certificationRequired: true,
    },
    gdpr: {
      name: "GDPR",
      description: "General Data Protection Regulation",
      applicableTo: "all",
      auditFrequency: "annual",
      certificationRequired: true,
    },
    soc2: {
      name: "SOC 2 Type II",
      description: "Service Organization Controls",
      applicableTo: ["tier1", "tier2"],
      auditFrequency: "annual",
      certificationRequired: true,
    },
  },

  domainSpecific: {
    financial: {
      standards: ["PCI-DSS", "Basel III", "AML", "KYC"],
      domains: ["fundx.pi", "assets.pi", "nbf.pi", "insure.pi"],
    },
    commerce: {
      standards: ["PCI-DSS", "eCommerce Directive", "Consumer Rights"],
      domains: ["commerce.pi", "ecommerce.pi"],
    },
    healthcare: {
      standards: ["HIPAA"],
      domains: ["life.pi"],
    },
    realEstate: {
      standards: ["Real Estate Regulations"],
      domains: ["estate.pi", "brookfield.pi"],
    },
  },
};

/**
 * Access Control Policies
 * Defines who can access what and under what conditions
 */
export const accessControlPolicies = {
  authentication: {
    required: true,
    methods: ["pi-network", "oauth2", "jwt"],
    mfaRecommended: true,
    sessionTimeout: 3600, // seconds
  },

  authorization: {
    model: "rbac", // Role-Based Access Control
    roles: {
      user: {
        permissions: ["read", "write_own"],
        domains: "all",
      },
      vip: {
        permissions: ["read", "write_own", "priority_support"],
        domains: "all",
        features: ["premium_analytics", "early_access"],
      },
      elite: {
        permissions: ["read", "write_own", "write_team", "advanced_features"],
        domains: "all",
        features: ["custom_dashboards", "api_access"],
      },
      admin: {
        permissions: ["read", "write", "delete", "configure"],
        domains: "owned_only",
        restrictions: ["no_cross_domain_admin"],
      },
      governance: {
        permissions: ["read_all", "audit", "policy_enforcement"],
        domains: "all",
        restrictions: ["read_only", "audit_logged"],
      },
    },
  },

  crossDomainAccess: {
    defaultPolicy: "deny",
    requiresApproval: true,
    approvalAuthority: "TEC Council",
    auditLogging: true,
    expirationPeriod: 90, // days
  },
};

/**
 * Data Residency Requirements
 * Ensures data sovereignty and compliance
 */
export const dataResidencyRequirements = {
  default: {
    location: "sovereign-controlled",
    encryption: {
      atRest: "AES-256",
      inTransit: "TLS 1.3",
    },
    backup: {
      frequency: "hourly",
      retention: 90, // days
      locations: ["primary", "secondary", "disaster-recovery"],
    },
  },

  financial: {
    domains: ["fundx.pi", "assets.pi", "nbf.pi", "insure.pi"],
    location: "sovereign-financial-zone",
    additionalRequirements: [
      "Real-time transaction logging",
      "Immutable audit trail",
      "7-year retention",
    ],
  },

  personal: {
    domains: ["all"],
    requirements: [
      "GDPR compliance",
      "Right to erasure",
      "Data portability",
      "Consent management",
    ],
  },
};

/**
 * Incident Response Policies
 * Defines response procedures for security incidents
 */
export const incidentResponsePolicies = {
  severity: {
    critical: {
      description: "Service unavailable or data breach",
      responseTime: 15, // minutes
      notificationRequired: ["governance", "affected-users", "regulators"],
      escalation: "immediate",
    },
    high: {
      description: "Degraded performance or security vulnerability",
      responseTime: 60, // minutes
      notificationRequired: ["governance", "technical-team"],
      escalation: "2-hours",
    },
    medium: {
      description: "Minor service issues",
      responseTime: 240, // minutes (4 hours)
      notificationRequired: ["technical-team"],
      escalation: "24-hours",
    },
    low: {
      description: "Cosmetic issues or minor bugs",
      responseTime: 480, // minutes (8 hours)
      notificationRequired: ["technical-team"],
      escalation: "not-required",
    },
  },

  procedures: {
    detection: "Automated monitoring and alerting",
    containment: "Isolate affected systems immediately",
    investigation: "Root cause analysis within 24 hours",
    remediation: "Deploy fix and verify resolution",
    documentation: "Complete incident report within 48 hours",
    postMortem: "Lessons learned session within 1 week",
  },
};

/**
 * Change Management Policies
 * Governs how changes are made to the system
 */
export const changeManagementPolicies = {
  types: {
    emergency: {
      description: "Critical security fix or service restoration",
      approvalRequired: false,
      postImplementationReview: true,
      notificationTiming: "after-deployment",
    },
    standard: {
      description: "Regular updates and improvements",
      approvalRequired: true,
      approver: "Technical Lead",
      testingRequired: true,
      notificationTiming: "24-hours-before",
    },
    major: {
      description: "Significant architectural or functional changes",
      approvalRequired: true,
      approver: "TEC Council",
      testingRequired: true,
      pilotRequired: true,
      notificationTiming: "1-week-before",
    },
  },

  process: {
    steps: [
      "Request submission",
      "Impact assessment",
      "Approval workflow",
      "Testing in staging",
      "User notification",
      "Deployment",
      "Verification",
      "Documentation",
    ],
    rollbackPlan: "required",
    maintenanceWindow: {
      preferred: "Saturday 02:00-06:00 UTC",
      blackout: ["Month-end", "Quarter-end", "Year-end"],
    },
  },
};

/**
 * Helper function to check if domain meets SLA
 * @param {string} domain - Domain name
 * @param {number} uptime - Current uptime percentage
 * @returns {Object} SLA status and penalties if applicable
 */
export function checkSLACompliance(domain, uptime) {
  // Find which tier the domain belongs to
  let tier = null;
  for (const [tierName, tierConfig] of Object.entries(slaTiers)) {
    if (tierConfig.domains.includes(domain)) {
      tier = tierConfig;
      break;
    }
  }

  if (!tier) {
    return { compliant: false, error: "Domain not found in any tier" };
  }

  const compliant = uptime >= tier.uptime;
  let penalty = null;

  if (!compliant) {
    // Check penalty thresholds
    for (const [threshold, penaltyValue] of Object.entries(tier.penalties)) {
      const thresholdValue = parseFloat(threshold.replace("below", ""));
      if (uptime < thresholdValue) {
        penalty = penaltyValue;
      }
    }
  }

  return {
    compliant,
    domain,
    tier: tier.name,
    requiredSLA: tier.uptime,
    actualUptime: uptime,
    penalty,
  };
}

/**
 * Helper function to get compliance requirements for domain
 * @param {string} domain - Domain name
 * @returns {Array<string>} List of compliance standards
 */
export function getComplianceRequirements(domain) {
  const requirements = ["ISO27001", "GDPR"]; // Mandatory for all

  // Check domain-specific requirements
  for (const [category, config] of Object.entries(
    complianceRequirements.domainSpecific
  )) {
    if (config.domains.includes(domain)) {
      requirements.push(...config.standards);
    }
  }

  // Check tier-specific requirements
  for (const tierConfig of Object.values(slaTiers)) {
    if (tierConfig.domains.includes(domain)) {
      if (["tier1", "tier2"].includes(tierConfig.name.toLowerCase())) {
        requirements.push("SOC2");
      }
      break;
    }
  }

  return [...new Set(requirements)]; // Remove duplicates
}

/**
 * Helper function to validate cross-domain access request
 * @param {string} sourceDomain - Requesting domain
 * @param {string} targetDomain - Target domain
 * @param {string} requestType - Type of access requested
 * @returns {Object} Validation result
 */
export function validateCrossDomainAccess(
  sourceDomain,
  targetDomain,
  requestType
) {
  if (sourceDomain === targetDomain) {
    return { valid: true, reason: "Same domain access" };
  }

  // Check if cross-domain access is allowed
  if (accessControlPolicies.crossDomainAccess.defaultPolicy === "deny") {
    return {
      valid: false,
      reason: "Cross-domain access requires explicit approval",
      requiresApproval: true,
      approvalAuthority:
        accessControlPolicies.crossDomainAccess.approvalAuthority,
    };
  }

  return { valid: false, reason: "Unknown validation error" };
}

export default {
  domainSovereigntyPolicy,
  slaTiers,
  complianceRequirements,
  accessControlPolicies,
  dataResidencyRequirements,
  incidentResponsePolicies,
  changeManagementPolicies,
};
