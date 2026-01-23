/**
 * TEC Ecosystem Domain Mapping Configuration
 * 
 * Professional domain governance and routing system for 24 sovereign .pi domains
 * 
 * @module domainMapping
 * @version 2.0.0
 * @compliant Domain Sovereignty Policy v2.0
 * @governance TEC Council Approved
 */

/**
 * Domain configuration structure:
 * - route: Application route path
 * - businessUnit: Internal business unit identifier
 * - name: Display name (English)
 * - nameAr: Display name (Arabic)
 * - category: Domain category for organization
 * - priority: Tier level (Tier 1: Core, Tier 2: Strategic, Tier 3: Specialized)
 * - status: Operational status (active/maintenance/planned)
 * - sla: Service Level Agreement percentage
 * - governance: Governance and compliance metadata
 */

export const domainMapping = {
  // ========================================
  // FINANCIAL SERVICES TIER
  // High-priority financial and investment domains
  // ========================================
  
  "fundx.pi": {
    route: "/fundx",
    businessUnit: "fundx",
    name: "FundX",
    nameAr: "فاند إكس",
    category: "Financial",
    priority: "Tier 1",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["KYC", "AML", "GDPR"],
      auditFrequency: "monthly",
      sovereignControl: true,
    },
    description: "High-yield investment strategies and portfolio management",
    descriptionAr: "استراتيجيات الاستثمار ذات العوائد المرتفعة وإدارة المحافظ",
  },
  "assets.pi": {
    route: "/assets",
    businessUnit: "assets",
    name: "Assets",
    nameAr: "الأصول",
    category: "Financial",
    priority: "Tier 2",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["SOC2", "ISO27001"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Asset tracking and portfolio optimization",
    descriptionAr: "تتبع الأصول وتحسين المحافظ الاستثمارية",
  },
  "nbf.pi": {
    route: "/nbf",
    businessUnit: "nbf",
    name: "NBF",
    nameAr: "المصرف الوطني",
    category: "Financial",
    priority: "Tier 2",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["PCI-DSS", "Basel III", "AML"],
      auditFrequency: "monthly",
      sovereignControl: true,
    },
    description: "National Banking & Financial Services",
    descriptionAr: "الخدمات المصرفية والمالية الوطنية",
  },
  "insure.pi": {
    route: "/insure",
    businessUnit: "insure",
    name: "Insure",
    nameAr: "التأمين",
    category: "Financial",
    priority: "Tier 3",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["Solvency II", "GDPR"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Deal protection and risk management",
    descriptionAr: "حماية الصفقات وإدارة المخاطر",
  },

  // ========================================
  // PREMIUM SERVICES TIER
  // Elite membership and exclusive services
  // ========================================
  
  "vip.pi": {
    route: "/vip",
    businessUnit: "vip",
    name: "VIP",
    nameAr: "في آي بي",
    category: "Premium",
    priority: "Tier 2",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR", "Privacy Shield"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Exclusive membership and opportunities",
    descriptionAr: "العضوية الحصرية والفرص الفريدة",
  },
  "elite.pi": {
    route: "/elite",
    businessUnit: "elite",
    name: "Elite",
    nameAr: "النخبة",
    category: "Premium",
    priority: "Tier 2",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR", "ISO27001"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Premium consulting and advisory services",
    descriptionAr: "الاستشارات والخدمات الاستشارية الممتازة",
  },
  "titan.pi": {
    route: "/titan",
    businessUnit: "titan",
    name: "Titan",
    nameAr: "تيتان",
    category: "Premium",
    priority: "Tier 2",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR", "SOC2"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Market authority and enterprise solutions",
    descriptionAr: "سلطة السوق والحلول المؤسسية",
  },
  "epic.pi": {
    route: "/epic",
    businessUnit: "epic",
    name: "Epic",
    nameAr: "ملحمة",
    category: "Premium",
    priority: "Tier 2",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Signature projects and legacy experiences",
    descriptionAr: "المشاريع المميزة وتجارب الإرث",
  },
  "legend.pi": {
    route: "/legend",
    businessUnit: "legend",
    name: "Legend",
    nameAr: "الأسطورة",
    category: "Premium",
    priority: "Tier 2",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Heritage services and elite membership",
    descriptionAr: "خدمات الإرث والعضوية النخبوية",
  },

  // ========================================
  // COMMERCE TIER
  // Trading and e-commerce platforms
  // ========================================
  
  "commerce.pi": {
    route: "/commerce",
    businessUnit: "commerce",
    name: "Commerce",
    nameAr: "التجارة",
    category: "Commerce",
    priority: "Tier 1",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["PCI-DSS", "GDPR", "eCommerce Directive"],
      auditFrequency: "monthly",
      sovereignControl: true,
    },
    description: "B2B trading and enterprise commerce",
    descriptionAr: "التجارة بين الشركات والتجارة المؤسسية",
  },
  "ecommerce.pi": {
    route: "/ecommerce",
    businessUnit: "ecommerce",
    name: "Ecommerce",
    nameAr: "التجارة الإلكترونية",
    category: "Commerce",
    priority: "Tier 2",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["PCI-DSS", "GDPR", "Consumer Rights"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Luxury marketplace and online retail",
    descriptionAr: "السوق الفاخر والتجزئة الإلكترونية",
  },
  "estate.pi": {
    route: "/estate",
    businessUnit: "estate",
    name: "Estate",
    nameAr: "العقارات",
    category: "Commerce",
    priority: "Tier 3",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR", "Real Estate Regulations"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Property investment and real estate management",
    descriptionAr: "الاستثمار العقاري وإدارة العقارات",
  },

  // ========================================
  // TECHNOLOGY TIER
  // Innovation, analytics, and infrastructure
  // ========================================
  
  "explorer.pi": {
    route: "/explorer",
    businessUnit: "explorer",
    name: "Explorer",
    nameAr: "المستكشف",
    category: "Technology",
    priority: "Tier 1",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR", "ISO27001"],
      auditFrequency: "monthly",
      sovereignControl: true,
    },
    description: "Discovery services and blockchain explorer",
    descriptionAr: "خدمات الاستكشاف ومتصفح البلوك تشين",
  },
  "dx.pi": {
    route: "/dx",
    businessUnit: "dx",
    name: "DX",
    nameAr: "دي إكس",
    category: "Technology",
    priority: "Tier 2",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["ISO27001", "SOC2"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Digital transformation and consulting",
    descriptionAr: "التحول الرقمي والاستشارات",
  },
  "nx.pi": {
    route: "/nx",
    businessUnit: "nx",
    name: "NX",
    nameAr: "إن إكس",
    category: "Technology",
    priority: "Tier 3",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["ISO27001"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Next-generation systems and innovation",
    descriptionAr: "أنظمة الجيل القادم والابتكار",
  },
  "system.pi": {
    route: "/system",
    businessUnit: "system",
    name: "System",
    nameAr: "النظام",
    category: "Technology",
    priority: "Tier 3",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["ISO27001", "SOC2"],
      auditFrequency: "monthly",
      sovereignControl: true,
    },
    description: "Operational intelligence and infrastructure",
    descriptionAr: "الذكاء التشغيلي والبنية التحتية",
  },
  "analytics.pi": {
    route: "/analytics",
    businessUnit: "analytics",
    name: "Analytics",
    nameAr: "التحليلات",
    category: "Technology",
    priority: "Tier 2",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR", "Privacy Shield"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Market intelligence and data analytics",
    descriptionAr: "ذكاء السوق وتحليلات البيانات",
  },
  "alert.pi": {
    route: "/alert",
    businessUnit: "alert",
    name: "Alert",
    nameAr: "التنبيهات",
    category: "Technology",
    priority: "Tier 3",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Critical notifications and event monitoring",
    descriptionAr: "الإشعارات الحرجة ومراقبة الأحداث",
  },
  "nexus.pi": {
    route: "/nexus",
    businessUnit: "nexus",
    name: "Nexus",
    nameAr: "نيكسوس",
    category: "Technology",
    priority: "Tier 1",
    status: "active",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      compliance: ["ISO27001", "SOC2"],
      auditFrequency: "monthly",
      sovereignControl: true,
    },
    description: "Cross-sector coordination and integration hub",
    descriptionAr: "التنسيق بين القطاعات ومركز التكامل",
  },

  // ========================================
  // SPECIALIZED SERVICES TIER
  // Niche services and specialized offerings
  // ========================================
  
  "life.pi": {
    route: "/life",
    businessUnit: "life",
    name: "Life",
    nameAr: "الحياة",
    category: "Specialized",
    priority: "Tier 3",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR", "HIPAA"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Lifestyle services and long-term planning",
    descriptionAr: "خدمات نمط الحياة والتخطيط طويل الأجل",
  },
  "connection.pi": {
    route: "/connection",
    businessUnit: "connection",
    name: "Connection",
    nameAr: "الاتصال",
    category: "Specialized",
    priority: "Tier 3",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Partner networks and strategic connections",
    descriptionAr: "شبكات الشركاء والاتصالات الاستراتيجية",
  },
  "brookfield.pi": {
    route: "/brookfield",
    businessUnit: "brookfield",
    name: "Brookfield",
    nameAr: "بروكفيلد",
    category: "Specialized",
    priority: "Tier 3",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Landmark projects and property development",
    descriptionAr: "المشاريع البارزة والتطوير العقاري",
  },
  "zone.pi": {
    route: "/zone",
    businessUnit: "zone",
    name: "Zone",
    nameAr: "المنطقة",
    category: "Specialized",
    priority: "Tier 3",
    status: "active",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      compliance: ["GDPR"],
      auditFrequency: "quarterly",
      sovereignControl: true,
    },
    description: "Economic zones and regional services",
    descriptionAr: "المناطق الاقتصادية والخدمات الإقليمية",
  },

  // ========================================
  // CENTRAL HUB
  // Core coordination and AI assistant
  // ========================================
  
  "tec.pi": {
    route: "/tec",
    businessUnit: "tec",
    name: "TEC",
    nameAr: "تي إي سي",
    category: "Hub",
    priority: "Tier 1",
    status: "active",
    sla: 99.99,
    governance: {
      dataResidency: "sovereign",
      compliance: ["ISO27001", "SOC2", "GDPR"],
      auditFrequency: "monthly",
      sovereignControl: true,
      isHub: true,
    },
    description: "Central hub and AI-powered assistant",
    descriptionAr: "المركز المركزي والمساعد الذكي المدعوم بالـ AI",
  },
};

// ========================================
// HELPER FUNCTIONS
// Professional utility functions for domain operations
// ========================================

/**
 * Get route path for a given domain
 * @param {string} domain - The .pi domain name
 * @returns {string} Route path or "/" if not found
 */
export function getDomainRoute(domain) {
  return domainMapping[domain]?.route || "/";
}

/**
 * Get business unit identifier for a domain
 * @param {string} domain - The .pi domain name
 * @returns {string|undefined} Business unit identifier
 */
export function getBusinessUnit(domain) {
  return domainMapping[domain]?.businessUnit;
}

/**
 * Get all domains in a specific category
 * @param {string} category - Category name (Financial, Premium, Commerce, Technology, Specialized, Hub)
 * @returns {Array<Object>} Array of domain objects with metadata
 */
export function getDomainsByCategory(category) {
  return Object.entries(domainMapping)
    .filter(([_, config]) => config.category === category)
    .map(([domain, config]) => ({ domain, ...config }));
}

/**
 * Get all domains with a specific priority tier
 * @param {string} priority - Priority tier (Tier 1, Tier 2, Tier 3)
 * @returns {Array<Object>} Array of domain objects with metadata
 */
export function getDomainsByPriority(priority) {
  return Object.entries(domainMapping)
    .filter(([_, config]) => config.priority === priority)
    .map(([domain, config]) => ({ domain, ...config }));
}

/**
 * Get all domain names
 * @returns {Array<string>} Array of all .pi domain names
 */
export function getAllDomains() {
  return Object.keys(domainMapping);
}

/**
 * Get total count of domains
 * @returns {number} Total number of domains
 */
export function getTotalDomains() {
  return Object.keys(domainMapping).length;
}

/**
 * Get comprehensive domain statistics
 * @returns {Object} Statistics object with categorization and counts
 */
export function getDomainStats() {
  const domains = Object.entries(domainMapping);

  return {
    total: domains.length,
    byCategory: {
      Financial: domains.filter(([_, c]) => c.category === "Financial").length,
      Premium: domains.filter(([_, c]) => c.category === "Premium").length,
      Commerce: domains.filter(([_, c]) => c.category === "Commerce").length,
      Technology: domains.filter(([_, c]) => c.category === "Technology")
        .length,
      Specialized: domains.filter(([_, c]) => c.category === "Specialized")
        .length,
      Hub: domains.filter(([_, c]) => c.category === "Hub").length,
    },
    byPriority: {
      "Tier 1": domains.filter(([_, c]) => c.priority === "Tier 1").length,
      "Tier 2": domains.filter(([_, c]) => c.priority === "Tier 2").length,
      "Tier 3": domains.filter(([_, c]) => c.priority === "Tier 3").length,
    },
    active: domains.filter(([_, c]) => c.status === "active").length,
    averageSLA:
      domains.reduce((sum, [_, c]) => sum + (c.sla || 0), 0) / domains.length,
  };
}

/**
 * Get domains with governance compliance requirements
 * @param {string} complianceType - Compliance type to filter by (e.g., "GDPR", "PCI-DSS")
 * @returns {Array<Object>} Array of domains meeting the compliance requirement
 */
export function getDomainsByCompliance(complianceType) {
  return Object.entries(domainMapping)
    .filter(([_, config]) =>
      config.governance?.compliance?.includes(complianceType)
    )
    .map(([domain, config]) => ({ domain, ...config }));
}

/**
 * Get domains with minimum SLA requirement
 * @param {number} minSLA - Minimum SLA percentage (e.g., 99.9)
 * @returns {Array<Object>} Array of domains meeting the SLA requirement
 */
export function getDomainsBySLA(minSLA) {
  return Object.entries(domainMapping)
    .filter(([_, config]) => config.sla >= minSLA)
    .map(([domain, config]) => ({ domain, ...config }));
}

/**
 * Get sovereign-controlled domains
 * @returns {Array<Object>} Array of domains with sovereign control
 */
export function getSovereignDomains() {
  return Object.entries(domainMapping)
    .filter(([_, config]) => config.governance?.sovereignControl === true)
    .map(([domain, config]) => ({ domain, ...config }));
}

export default domainMapping;
