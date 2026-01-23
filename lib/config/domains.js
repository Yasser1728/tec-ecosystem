/**
 * TEC Ecosystem Domain Configuration
 * Bilingual domain structure with governance metadata
 * 
 * @module config/domains
 * @version 2.0.0
 * @governance TEC Council Approved
 */

// Domain configuration for TEC Ecosystem
export const domains = [
  {
    tier: "Finance & Investment",
    tierAr: "المالية والاستثمار",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      complianceRequired: true,
    },
    items: [
      {
        name: "FundX",
        nameAr: "فاند إكس",
        desc: "High-yield strategies",
        descAr: "استراتيجيات عوائد مرتفعة",
        url: "fundx",
        sla: 99.9,
        compliance: ["KYC", "AML", "GDPR"],
      },
      {
        name: "Assets",
        nameAr: "الأصول",
        desc: "Portfolio management",
        descAr: "إدارة المحافظ الاستثمارية",
        url: "assets",
        sla: 99.5,
        compliance: ["SOC2", "ISO27001"],
      },
      {
        name: "NBF",
        nameAr: "المصرف الوطني",
        desc: "Sovereign banking",
        descAr: "الخدمات المصرفية السيادية",
        url: "nbf",
        sla: 99.9,
        compliance: ["PCI-DSS", "Basel III", "AML"],
      },
      {
        name: "Insure",
        nameAr: "التأمين",
        desc: "Deal protection",
        descAr: "حماية الصفقات",
        url: "insure",
        sla: 99.5,
        compliance: ["Solvency II", "GDPR"],
      },
      {
        name: "VIP",
        nameAr: "في آي بي",
        desc: "Exclusive opportunities",
        descAr: "فرص حصرية",
        url: "vip",
        sla: 99.9,
        compliance: ["GDPR", "Privacy Shield"],
      },
      {
        name: "Life",
        nameAr: "الحياة",
        desc: "Long-term growth",
        descAr: "النمو طويل الأجل",
        url: "life",
        sla: 99.5,
        compliance: ["GDPR", "HIPAA"],
      },
    ],
  },
  {
    tier: "Commerce & Trade",
    tierAr: "التجارة والأعمال",
    sla: 99.7,
    governance: {
      dataResidency: "sovereign",
      complianceRequired: true,
    },
    items: [
      {
        name: "Commerce",
        nameAr: "التجارة",
        desc: "B2B trading",
        descAr: "التجارة بين الشركات",
        url: "commerce",
        sla: 99.9,
        compliance: ["PCI-DSS", "GDPR", "eCommerce Directive"],
      },
      {
        name: "Ecommerce",
        nameAr: "التجارة الإلكترونية",
        desc: "Luxury marketplace",
        descAr: "السوق الفاخر",
        url: "ecommerce",
        sla: 99.5,
        compliance: ["PCI-DSS", "GDPR", "Consumer Rights"],
      },
      {
        name: "Connection",
        nameAr: "الاتصال",
        desc: "Partner networks",
        descAr: "شبكات الشركاء",
        url: "connection",
        sla: 99.5,
        compliance: ["GDPR"],
      },
      {
        name: "Elite",
        nameAr: "النخبة",
        desc: "Premium consulting",
        descAr: "الاستشارات الممتازة",
        url: "elite",
        sla: 99.9,
        compliance: ["GDPR", "ISO27001"],
      },
    ],
  },
  {
    tier: "Real Estate",
    tierAr: "العقارات",
    sla: 99.5,
    governance: {
      dataResidency: "sovereign",
      complianceRequired: true,
    },
    items: [
      {
        name: "Estate",
        nameAr: "العقارات",
        desc: "Property investment",
        descAr: "الاستثمار العقاري",
        url: "estate",
        sla: 99.5,
        compliance: ["GDPR", "Real Estate Regulations"],
      },
      {
        name: "Brookfield",
        nameAr: "بروكفيلد",
        desc: "Landmark projects",
        descAr: "المشاريع البارزة",
        url: "brookfield",
        sla: 99.5,
        compliance: ["GDPR"],
      },
      {
        name: "Explorer",
        nameAr: "المستكشف",
        desc: "Luxury travel & residency",
        descAr: "السفر الفاخر والإقامة",
        url: "explorer",
        sla: 99.9,
        compliance: ["GDPR", "ISO27001"],
      },
      {
        name: "Zone",
        nameAr: "المنطقة",
        desc: "Economic zones",
        descAr: "المناطق الاقتصادية",
        url: "zone",
        sla: 99.5,
        compliance: ["GDPR"],
      },
    ],
  },
  {
    tier: "Technology",
    tierAr: "التكنولوجيا",
    sla: 99.8,
    governance: {
      dataResidency: "sovereign",
      complianceRequired: true,
    },
    items: [
      {
        name: "DX",
        nameAr: "دي إكس",
        desc: "Digital transformation",
        descAr: "التحول الرقمي",
        url: "dx",
        sla: 99.5,
        compliance: ["ISO27001", "SOC2"],
      },
      {
        name: "NX",
        nameAr: "إن إكس",
        desc: "Next-gen systems",
        descAr: "أنظمة الجيل القادم",
        url: "nx",
        sla: 99.5,
        compliance: ["ISO27001"],
      },
      {
        name: "System",
        nameAr: "النظام",
        desc: "Operational intelligence",
        descAr: "الذكاء التشغيلي",
        url: "system",
        sla: 99.9,
        compliance: ["ISO27001", "SOC2"],
      },
      {
        name: "Analytics",
        nameAr: "التحليلات",
        desc: "Market intelligence",
        descAr: "ذكاء السوق",
        url: "analytics",
        sla: 99.5,
        compliance: ["GDPR", "Privacy Shield"],
      },
      {
        name: "Alert",
        nameAr: "التنبيهات",
        desc: "Critical notifications",
        descAr: "الإشعارات الحرجة",
        url: "alert",
        sla: 99.9,
        compliance: ["GDPR"],
      },
    ],
  },
  {
    tier: "Authority & Legacy",
    tierAr: "السلطة والإرث",
    sla: 99.9,
    governance: {
      dataResidency: "sovereign",
      complianceRequired: true,
    },
    items: [
      {
        name: "Titan",
        nameAr: "تيتان",
        desc: "Market authority",
        descAr: "سلطة السوق",
        url: "titan",
        sla: 99.9,
        compliance: ["GDPR", "SOC2"],
      },
      {
        name: "Nexus",
        nameAr: "نيكسوس",
        desc: "Cross-sector coordination",
        descAr: "التنسيق بين القطاعات",
        url: "nexus",
        sla: 99.9,
        compliance: ["ISO27001", "SOC2"],
      },
      {
        name: "Epic",
        nameAr: "ملحمة",
        desc: "Legacy projects",
        descAr: "مشاريع الإرث",
        url: "epic",
        sla: 99.5,
        compliance: ["GDPR"],
      },
      {
        name: "Legend",
        nameAr: "الأسطورة",
        desc: "Elite membership",
        descAr: "العضوية النخبوية",
        url: "legend",
        sla: 99.9,
        compliance: ["GDPR"],
      },
    ],
  },
  {
    tier: "Hub",
    tierAr: "المركز",
    sla: 99.99,
    governance: {
      dataResidency: "sovereign",
      complianceRequired: true,
      isHub: true,
    },
    items: [
      {
        name: "TEC",
        nameAr: "تي إي سي",
        desc: "Unified portal",
        descAr: "البوابة الموحدة",
        url: "tec",
        sla: 99.99,
        compliance: ["ISO27001", "SOC2", "GDPR"],
        features: ["AI Assistant", "Dashboard", "Unified Access"],
        featuresAr: ["المساعد الذكي", "لوحة التحكم", "الوصول الموحد"],
      },
    ],
  },
];

// ========================================
// CONTENT TRANSLATIONS
// Bilingual content for the TEC ecosystem
// ========================================

// Content translations
export const content = {
  en: {
    title: "Titan Elite Commerce",
    description: "Private Luxury Marketplace on Pi Network",
    subtitle: "24 Sovereign Business Units | Curated Deals Only",
    loginBtn: "Login with Pi",
    paymentBtn: "Sovereign Payment",
    contactTitle: "Elite Support",
    copyright: "© 2025 Titan Elite Commerce — Sovereign Digital Authority",
    governance: {
      slaCommitment: "Service Level Agreement",
      complianceStandards: "Compliance Standards",
      dataResidency: "Sovereign Data Residency",
      auditSchedule: "Regular Security Audits",
    },
  },
  ar: {
    title: "تيتان إيليت كوميرس",
    description: "سوق فاخر خاص على شبكة Pi",
    subtitle: "24 وحدة أعمال سيادية | صفقات منسقة فقط",
    loginBtn: "تسجيل دخول Pi",
    paymentBtn: "دفع سيادي",
    contactTitle: "الدعم النخبوي",
    copyright: "© 2025 تيتان إيليت كوميرس — سلطة رقمية سيادية",
    governance: {
      slaCommitment: "اتفاقية مستوى الخدمة",
      complianceStandards: "معايير الامتثال",
      dataResidency: "إقامة البيانات السيادية",
      auditSchedule: "عمليات تدقيق أمنية منتظمة",
    },
  },
};

// Dynamic words for animation
export const dynamicWords = {
  en: ["Elite", "Titan", "Luxury", "Sovereign", "Legacy", "Authority"],
  ar: ["نخبوي", "تيتان", "فاخر", "سيادي", "إرث", "سلطة"],
};

// ========================================
// GOVERNANCE METADATA
// TEC Council approved governance structure
// ========================================

export const governanceMetadata = {
  version: "2.0.0",
  approvedBy: "TEC Council",
  lastUpdated: "2026-01-23",
  policyCompliance: "Domain Sovereignty Policy v2.0",
  securityStandards: ["ISO27001", "SOC2", "GDPR", "PCI-DSS"],
  operationalMetrics: {
    minimumSLA: 99.5,
    targetSLA: 99.9,
    enterpriseSLA: 99.99,
  },
  auditFrequencies: {
    tier1: "monthly",
    tier2: "quarterly",
    tier3: "quarterly",
  },
  dataResidencyPolicy: "All data must be stored in sovereign-controlled infrastructure",
  crossDomainAccess: "Requires explicit governance approval",
};
