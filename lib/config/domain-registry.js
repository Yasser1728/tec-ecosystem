// Sovereign Domain Registry
// Complete configuration for all 24 TEC sovereign domains

export const SOVEREIGN_DOMAINS = {
  // Finance & Investment Tier
  FUNDX: {
    id: 'fundx',
    domain: 'fundx.pi',
    name: 'FundX',
    nameAr: 'فَنْد إكس',
    description: 'High-yield investment strategies',
    descriptionAr: 'استراتيجيات استثمارية عالية العائد',
    tier: 'Finance & Investment',
    theme: 'tec-gradient',
    requiresAuth: false,
    analytics: 'fundx-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  ASSETS: {
    id: 'assets',
    domain: 'assets.pi',
    name: 'Assets',
    nameAr: 'الأصول',
    description: 'Asset management and diversification',
    descriptionAr: 'إدارة الأصول والتنويع',
    tier: 'Finance & Investment',
    theme: 'tec-gradient',
    requiresAuth: false,
    analytics: 'assets-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  NBF: {
    id: 'nbf',
    domain: 'nbf.pi',
    name: 'NBF',
    nameAr: 'إن بي إف',
    description: 'Next-generation banking and finance',
    descriptionAr: 'الخدمات المصرفية والمالية من الجيل القادم',
    tier: 'Finance & Investment',
    theme: 'tec-gradient',
    requiresAuth: false,
    analytics: 'nbf-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  INSURE: {
    id: 'insure',
    domain: 'insure.pi',
    name: 'Insure',
    nameAr: 'التأمين',
    description: 'Comprehensive insurance solutions',
    descriptionAr: 'حلول تأمين شاملة',
    tier: 'Finance & Investment',
    theme: 'tec-gradient',
    requiresAuth: false,
    analytics: 'insure-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  VIP: {
    id: 'vip',
    domain: 'vip.pi',
    name: 'VIP',
    nameAr: 'في آي بي',
    description: 'Exclusive VIP services and benefits',
    descriptionAr: 'خدمات ومزايا حصرية للأعضاء المميزين',
    tier: 'Finance & Investment',
    theme: 'premium-gold',
    requiresAuth: true,
    analytics: 'vip-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  LIFE: {
    id: 'life',
    domain: 'life.pi',
    name: 'Life',
    nameAr: 'الحياة',
    description: 'Life insurance and wealth protection',
    descriptionAr: 'التأمين على الحياة وحماية الثروة',
    tier: 'Finance & Investment',
    theme: 'tec-gradient',
    requiresAuth: false,
    analytics: 'life-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },

  // Commerce & Trade Tier
  COMMERCE: {
    id: 'commerce',
    domain: 'commerce.pi',
    name: 'Commerce',
    nameAr: 'التجارة',
    description: 'B2B commerce and trade platform',
    descriptionAr: 'منصة التجارة والأعمال بين الشركات',
    tier: 'Commerce & Trade',
    theme: 'commerce-blue',
    requiresAuth: false,
    analytics: 'commerce-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  ECOMMERCE: {
    id: 'ecommerce',
    domain: 'ecommerce.pi',
    name: 'Ecommerce',
    nameAr: 'التجارة الإلكترونية',
    description: 'Online marketplace and retail',
    descriptionAr: 'السوق الإلكترونية والبيع بالتجزئة',
    tier: 'Commerce & Trade',
    theme: 'commerce-blue',
    requiresAuth: false,
    analytics: 'ecommerce-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  CONNECTION: {
    id: 'connection',
    domain: 'connection.pi',
    name: 'Connection',
    nameAr: 'الاتصال',
    description: 'Business networking and partnerships',
    descriptionAr: 'شبكات الأعمال والشراكات',
    tier: 'Commerce & Trade',
    theme: 'commerce-blue',
    requiresAuth: false,
    analytics: 'connection-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  ELITE: {
    id: 'elite',
    domain: 'elite.pi',
    name: 'Elite',
    nameAr: 'النخبة',
    description: 'Elite merchant services',
    descriptionAr: 'خدمات التجار النخبة',
    tier: 'Commerce & Trade',
    theme: 'premium-gold',
    requiresAuth: true,
    analytics: 'elite-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },

  // Real Estate Tier
  ESTATE: {
    id: 'estate',
    domain: 'estate.pi',
    name: 'Estate',
    nameAr: 'العقارات',
    description: 'Real estate investment and management',
    descriptionAr: 'الاستثمار العقاري والإدارة',
    tier: 'Real Estate',
    theme: 'estate-green',
    requiresAuth: false,
    analytics: 'estate-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  BROOKFIELD: {
    id: 'brookfield',
    domain: 'brookfield.pi',
    name: 'Brookfield',
    nameAr: 'بروكفيلد',
    description: 'Premium real estate development',
    descriptionAr: 'التطوير العقاري الفاخر',
    tier: 'Real Estate',
    theme: 'estate-green',
    requiresAuth: false,
    analytics: 'brookfield-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  EXPLORER: {
    id: 'explorer',
    domain: 'explorer.pi',
    name: 'Explorer',
    nameAr: 'المستكشف',
    description: 'Property discovery and exploration',
    descriptionAr: 'اكتشاف واستكشاف العقارات',
    tier: 'Real Estate',
    theme: 'estate-green',
    requiresAuth: false,
    analytics: 'explorer-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  ZONE: {
    id: 'zone',
    domain: 'zone.pi',
    name: 'Zone',
    nameAr: 'المنطقة',
    description: 'Regional real estate zones',
    descriptionAr: 'المناطق العقارية الإقليمية',
    tier: 'Real Estate',
    theme: 'estate-green',
    requiresAuth: false,
    analytics: 'zone-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },

  // Technology Tier
  DX: {
    id: 'dx',
    domain: 'dx.pi',
    name: 'DX',
    nameAr: 'دي إكس',
    description: 'Digital transformation services',
    descriptionAr: 'خدمات التحول الرقمي',
    tier: 'Technology',
    theme: 'tech-purple',
    requiresAuth: false,
    analytics: 'dx-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  NX: {
    id: 'nx',
    domain: 'nx.pi',
    name: 'NX',
    nameAr: 'إن إكس',
    description: 'Next-generation technology solutions',
    descriptionAr: 'حلول تقنية من الجيل القادم',
    tier: 'Technology',
    theme: 'tech-purple',
    requiresAuth: false,
    analytics: 'nx-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  SYSTEM: {
    id: 'system',
    domain: 'system.pi',
    name: 'System',
    nameAr: 'النظام',
    description: 'Enterprise system integration',
    descriptionAr: 'تكامل أنظمة المؤسسات',
    tier: 'Technology',
    theme: 'tech-purple',
    requiresAuth: false,
    analytics: 'system-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  ANALYTICS: {
    id: 'analytics',
    domain: 'analytics.pi',
    name: 'Analytics',
    nameAr: 'التحليلات',
    description: 'Business intelligence and analytics',
    descriptionAr: 'ذكاء الأعمال والتحليلات',
    tier: 'Technology',
    theme: 'tech-purple',
    requiresAuth: false,
    analytics: 'analytics-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  ALERT: {
    id: 'alert',
    domain: 'alert.pi',
    name: 'Alert',
    nameAr: 'التنبيهات',
    description: 'Real-time monitoring and alerts',
    descriptionAr: 'المراقبة والتنبيهات في الوقت الفعلي',
    tier: 'Technology',
    theme: 'tech-purple',
    requiresAuth: false,
    analytics: 'alert-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },

  // Authority & Legacy Tier
  TITAN: {
    id: 'titan',
    domain: 'titan.pi',
    name: 'Titan',
    nameAr: 'تايتن',
    description: 'Enterprise-level strategic services',
    descriptionAr: 'الخدمات الاستراتيجية على مستوى المؤسسات',
    tier: 'Authority & Legacy',
    theme: 'premium-gold',
    requiresAuth: true,
    analytics: 'titan-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  NEXUS: {
    id: 'nexus',
    domain: 'nexus.pi',
    name: 'Nexus',
    nameAr: 'نيكسوس',
    description: 'Central connection hub',
    descriptionAr: 'مركز الاتصال المركزي',
    tier: 'Authority & Legacy',
    theme: 'nexus-dark',
    requiresAuth: false,
    analytics: 'nexus-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  EPIC: {
    id: 'epic',
    domain: 'epic.pi',
    name: 'Epic',
    nameAr: 'إيبك',
    description: 'Large-scale project management',
    descriptionAr: 'إدارة المشاريع الكبرى',
    tier: 'Authority & Legacy',
    theme: 'premium-gold',
    requiresAuth: true,
    analytics: 'epic-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },
  LEGEND: {
    id: 'legend',
    domain: 'legend.pi',
    name: 'Legend',
    nameAr: 'ليجند',
    description: 'Legacy business solutions',
    descriptionAr: 'حلول الأعمال التراثية',
    tier: 'Authority & Legacy',
    theme: 'premium-gold',
    requiresAuth: true,
    analytics: 'legend-analytics',
    independent: true,
    value: 'sovereign-unit',
    launchDate: '2026-01-01',
  },

  // Hub
  TEC: {
    id: 'tec',
    domain: 'tec.pi',
    name: 'TEC',
    nameAr: 'تِك',
    description: 'Total Ecosystem Connection - Central Hub',
    descriptionAr: 'تِك - المركز الرئيسي للنظام البيئي الشامل',
    tier: 'Hub',
    theme: 'tec-primary',
    requiresAuth: false,
    analytics: 'tec-analytics',
    independent: false,
    value: 'central-hub',
    launchDate: '2026-01-01',
  },
};

/**
 * Get domain configuration by hostname
 * @param {string} hostname - The domain hostname (e.g., 'fundx.pi')
 * @returns {object|null} Domain configuration or null if not found
 */
export function getDomainConfig(hostname) {
  // Remove port if present
  const domain = hostname.split(':')[0];
  
  // Find matching domain
  const domainKey = Object.keys(SOVEREIGN_DOMAINS).find(
    key => SOVEREIGN_DOMAINS[key].domain === domain
  );
  
  return domainKey ? SOVEREIGN_DOMAINS[domainKey] : null;
}

/**
 * Get all domains
 * @returns {array} Array of all domain configurations
 */
export function getAllDomains() {
  return Object.values(SOVEREIGN_DOMAINS);
}

/**
 * Get domains by tier
 * @param {string} tier - The tier name
 * @returns {array} Array of domains in the specified tier
 */
export function getDomainsByTier(tier) {
  return Object.values(SOVEREIGN_DOMAINS).filter(
    domain => domain.tier === tier
  );
}

/**
 * Get only independent domains (excluding hub)
 * @returns {array} Array of independent domain configurations
 */
export function getIndependentDomains() {
  return Object.values(SOVEREIGN_DOMAINS).filter(
    domain => domain.independent === true
  );
}

/**
 * Get domains requiring authentication
 * @returns {array} Array of domains that require authentication
 */
export function getAuthRequiredDomains() {
  return Object.values(SOVEREIGN_DOMAINS).filter(
    domain => domain.requiresAuth === true
  );
}

/**
 * Get all domain hostnames
 * @returns {array} Array of domain hostnames
 */
export function getAllDomainNames() {
  return Object.values(SOVEREIGN_DOMAINS).map(domain => domain.domain);
}

export default SOVEREIGN_DOMAINS;
