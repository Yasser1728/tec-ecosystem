/**
 * Domain Configuration
 * 
 * Comprehensive configuration for all 24 TEC domains
 * Each domain includes identity, sector, function, and metadata
 */

export const DOMAIN_CONFIG = {
  life: {
    name: 'Life',
    displayName: 'Life.pi',
    icon: '🌟',
    tagline: 'Long-term Growth',
    description: 'Lifetime financial planning and wealth management',
    sector: 'Financial Services',
    function: 'Long-term wealth building, financial planning, and educational resources',
    color: 'from-cyan-900 to-blue-900',
    category: 'finance'
  },
  insure: {
    name: 'Insure',
    displayName: 'Insure.pi',
    icon: '🛡️',
    tagline: 'Deal Protection',
    description: 'Comprehensive insurance for your investments and assets',
    sector: 'Insurance',
    function: 'Asset protection, deal insurance, and claim management',
    color: 'from-red-900 to-orange-900',
    category: 'insurance'
  },
  commerce: {
    name: 'Commerce',
    displayName: 'Commerce.pi',
    icon: '🛍️',
    tagline: 'B2B Trading',
    description: 'Business-to-business trading and commerce solutions',
    sector: 'B2B Trade',
    function: 'B2B trading strategies, market insights, and partner network',
    color: 'from-indigo-900 to-purple-900',
    category: 'trading'
  },
  ecommerce: {
    name: 'Ecommerce',
    displayName: 'Ecommerce.pi',
    icon: '🛒',
    tagline: 'Digital Commerce',
    description: 'Access rare luxury goods and digital products',
    sector: 'Digital Retail',
    function: 'Luxury goods marketplace, digital products, and sales analytics',
    color: 'from-pink-900 to-rose-900',
    category: 'retail'
  },
  assets: {
    name: 'Assets',
    displayName: 'Assets.pi',
    icon: '💼',
    tagline: 'Portfolio Management',
    description: 'Professional asset management and portfolio optimization',
    sector: 'Asset Management',
    function: 'Portfolio management, asset valuation, and performance tracking',
    color: 'from-green-900 to-teal-900',
    category: 'finance'
  },
  fundx: {
    name: 'FundX',
    displayName: 'FundX.pi',
    icon: '📊',
    tagline: 'Investment Strategies',
    description: 'Sovereign investment strategies powered by Pi Network',
    sector: 'Investment',
    function: 'Investment strategies, ROI calculation, and portfolio optimization',
    color: 'from-blue-900 to-indigo-900',
    category: 'finance'
  },
  dx: {
    name: 'DX',
    displayName: 'DX.pi',
    icon: '🚀',
    tagline: 'Digital Transformation',
    description: 'Advanced digital transformation services',
    sector: 'Technology',
    function: 'Digital transformation projects, innovation labs, and tech consulting',
    color: 'from-violet-900 to-purple-900',
    category: 'technology'
  },
  analytics: {
    name: 'Analytics',
    displayName: 'Analytics.pi',
    icon: '📈',
    tagline: 'Data & Insights',
    description: 'Business intelligence and predictive analytics',
    sector: 'Data Analytics',
    function: 'Market trends analysis, intelligence reports, and predictive insights',
    color: 'from-blue-900 to-cyan-900',
    category: 'technology'
  },
  nbf: {
    name: 'NBF',
    displayName: 'NBF.pi',
    icon: '🏦',
    tagline: 'Sovereign Banking',
    description: 'Next-generation banking with Pi Network settlements',
    sector: 'Banking',
    function: 'Financial planning, Pi settlements, and banking insights',
    color: 'from-purple-900 to-pink-900',
    category: 'finance'
  },
  epic: {
    name: 'Epic',
    displayName: 'Epic.pi',
    icon: '🎯',
    tagline: 'Premium Projects',
    description: 'Exclusive high-value projects and opportunities',
    sector: 'Premium Services',
    function: 'Legacy projects, early access opportunities, and elite membership',
    color: 'from-orange-900 to-red-900',
    category: 'premium'
  },
  legend: {
    name: 'Legend',
    displayName: 'Legend.pi',
    icon: '🏆',
    tagline: 'Legacy Services',
    description: 'Heritage products and collectible investments',
    sector: 'Heritage & Collectibles',
    function: 'Legacy management, rare collectibles, and prestigious items',
    color: 'from-yellow-900 to-orange-900',
    category: 'premium'
  },
  connection: {
    name: 'Connection',
    displayName: 'Connection.pi',
    icon: '🔗',
    tagline: 'Elite Networking',
    description: 'Connect with high-value business partners',
    sector: 'Networking',
    function: 'Partner matching, strategic alliances, and elite communities',
    color: 'from-teal-900 to-cyan-900',
    category: 'networking'
  },
  system: {
    name: 'System',
    displayName: 'System.pi',
    icon: '⚙️',
    tagline: 'Operational Intelligence',
    description: 'System integration and operational excellence',
    sector: 'Operations',
    function: 'Operations management, workflow optimization, and system monitoring',
    color: 'from-slate-900 to-gray-900',
    category: 'technology'
  },
  alert: {
    name: 'Alert',
    displayName: 'Alert.pi',
    icon: '🔔',
    tagline: 'Smart Notifications',
    description: 'Real-time alerts and monitoring systems',
    sector: 'Monitoring',
    function: 'Critical alerts, market updates, and event tracking',
    color: 'from-red-900 to-pink-900',
    category: 'technology'
  },
  tec: {
    name: 'TEC',
    displayName: 'TEC.pi',
    icon: '🎪',
    tagline: 'Ecosystem Hub',
    description: 'Central hub for all TEC services and business units',
    sector: 'Ecosystem Management',
    function: 'Central marketplace, ecosystem overview, and strategic guidance',
    color: 'from-purple-900 to-indigo-900',
    category: 'hub'
  },
  estate: {
    name: 'Estate',
    displayName: 'Estate.pi',
    icon: '🏠',
    tagline: 'Real Estate Marketplace',
    description: 'Luxury real estate and property investment opportunities',
    sector: 'Real Estate',
    function: 'Property marketplace, investment guidance, and valuation services',
    color: 'from-green-900 to-emerald-900',
    category: 'realestate'
  },
  nx: {
    name: 'NX',
    displayName: 'NX.pi',
    icon: '🔮',
    tagline: 'Next-Gen Technology',
    description: 'Future technology and innovation services',
    sector: 'Innovation',
    function: 'Next-gen projects, tech labs, and innovation insights',
    color: 'from-fuchsia-900 to-pink-900',
    category: 'technology'
  },
  explorer: {
    name: 'Explorer',
    displayName: 'Explorer.pi',
    icon: '✈️',
    tagline: 'Luxury Travel',
    description: 'Exclusive travel experiences and residency programs',
    sector: 'Travel & Lifestyle',
    function: 'Private jet charter, residency programs, and luxury travel packages',
    color: 'from-sky-900 to-blue-900',
    category: 'lifestyle'
  },
  nexus: {
    name: 'Nexus',
    displayName: 'Nexus.pi',
    icon: '🌐',
    tagline: 'AI-Powered Integration',
    description: 'Connect, coordinate, and integrate your business with AI-powered solutions',
    sector: 'AI & Integration',
    function: 'Business integration, AI solutions, and coordination hub',
    color: 'from-indigo-900 to-blue-900',
    category: 'technology'
  },
  brookfield: {
    name: 'Brookfield',
    displayName: 'Brookfield.pi',
    icon: '🏛️',
    tagline: 'Property Investment',
    description: 'Landmark property investment and development',
    sector: 'Property Development',
    function: 'Landmark projects, property valuation, and investment strategy',
    color: 'from-stone-900 to-gray-900',
    category: 'realestate'
  },
  vip: {
    name: 'VIP',
    displayName: 'VIP.pi',
    icon: '👑',
    tagline: 'Exclusive Opportunities',
    description: 'VIP access to elite investment opportunities',
    sector: 'VIP Services',
    function: 'Exclusive opportunities, VIP events, and membership benefits',
    color: 'from-yellow-900 to-amber-900',
    category: 'premium'
  },
  titan: {
    name: 'Titan',
    displayName: 'Titan.pi',
    icon: '💪',
    tagline: 'Enterprise Solutions',
    description: 'Large-scale enterprise services and solutions',
    sector: 'Enterprise',
    function: 'Market authority, strategic tools, and exclusive enterprise access',
    color: 'from-gray-900 to-slate-900',
    category: 'enterprise'
  },
  zone: {
    name: 'Zone',
    displayName: 'Zone.pi',
    icon: '🌍',
    tagline: 'Regional Services',
    description: 'Location-based services and regional opportunities',
    sector: 'Regional Services',
    function: 'Optimal locations, economic zones, and investment guides',
    color: 'from-emerald-900 to-green-900',
    category: 'regional'
  },
  elite: {
    name: 'Elite',
    displayName: 'Elite.pi',
    icon: '⭐',
    tagline: 'Premium Consulting',
    description: 'Elite business consulting and advisory services',
    sector: 'Consulting',
    function: 'Premium insights, business consulting, and networking events',
    color: 'from-amber-900 to-yellow-900',
    category: 'consulting'
  }
};

/**
 * Get domain configuration
 */
export function getDomainConfig(domainKey) {
  return DOMAIN_CONFIG[domainKey];
}

/**
 * Get all domain keys
 */
export function getAllDomainKeys() {
  return Object.keys(DOMAIN_CONFIG);
}

/**
 * Get domains by category
 */
export function getDomainsByCategory(category) {
  return Object.entries(DOMAIN_CONFIG)
    .filter(([_, config]) => config.category === category)
    .map(([key, config]) => ({ key, ...config }));
}

export default DOMAIN_CONFIG;
