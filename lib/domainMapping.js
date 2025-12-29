// Domain Mapping Configuration
// Maps .pi domains to application routes

export const domainMapping = {
  // Financial Services
  'fundx.pi': {
    route: '/fundx',
    businessUnit: 'fundx',
    name: 'FundX',
    category: 'Financial',
    priority: 'Tier 1',
    status: 'active'
  },
  'assets.pi': {
    route: '/assets',
    businessUnit: 'assets',
    name: 'Assets',
    category: 'Financial',
    priority: 'Tier 2',
    status: 'active'
  },
  'nbf.pi': {
    route: '/nbf',
    businessUnit: 'nbf',
    name: 'NBF',
    category: 'Financial',
    priority: 'Tier 2',
    status: 'active'
  },
  'insure.pi': {
    route: '/insure',
    businessUnit: 'insure',
    name: 'Insure',
    category: 'Financial',
    priority: 'Tier 3',
    status: 'active'
  },

  // Premium Services
  'vip.pi': {
    route: '/vip',
    businessUnit: 'vip',
    name: 'VIP',
    category: 'Premium',
    priority: 'Tier 2',
    status: 'active'
  },
  'elite.pi': {
    route: '/elite',
    businessUnit: 'elite',
    name: 'Elite',
    category: 'Premium',
    priority: 'Tier 2',
    status: 'active'
  },
  'titan.pi': {
    route: '/titan',
    businessUnit: 'titan',
    name: 'Titan',
    category: 'Premium',
    priority: 'Tier 2',
    status: 'active'
  },
  'epic.pi': {
    route: '/epic',
    businessUnit: 'epic',
    name: 'Epic',
    category: 'Premium',
    priority: 'Tier 2',
    status: 'active'
  },
  'legend.pi': {
    route: '/legend',
    businessUnit: 'legend',
    name: 'Legend',
    category: 'Premium',
    priority: 'Tier 2',
    status: 'active'
  },

  // Commerce
  'commerce.pi': {
    route: '/commerce',
    businessUnit: 'commerce',
    name: 'Commerce',
    category: 'Commerce',
    priority: 'Tier 1',
    status: 'active'
  },
  'ecommerce.pi': {
    route: '/ecommerce',
    businessUnit: 'ecommerce',
    name: 'Ecommerce',
    category: 'Commerce',
    priority: 'Tier 2',
    status: 'active'
  },
  'estate.pi': {
    route: '/estate',
    businessUnit: 'estate',
    name: 'Estate',
    category: 'Commerce',
    priority: 'Tier 3',
    status: 'active'
  },

  // Technology
  'explorer.pi': {
    route: '/explorer',
    businessUnit: 'explorer',
    name: 'Explorer',
    category: 'Technology',
    priority: 'Tier 1',
    status: 'active'
  },
  'dx.pi': {
    route: '/dx',
    businessUnit: 'dx',
    name: 'DX',
    category: 'Technology',
    priority: 'Tier 2',
    status: 'active'
  },
  'nx.pi': {
    route: '/nx',
    businessUnit: 'nx',
    name: 'NX',
    category: 'Technology',
    priority: 'Tier 3',
    status: 'active'
  },
  'system.pi': {
    route: '/system',
    businessUnit: 'system',
    name: 'System',
    category: 'Technology',
    priority: 'Tier 3',
    status: 'active'
  },
  'analytics.pi': {
    route: '/analytics',
    businessUnit: 'analytics',
    name: 'Analytics',
    category: 'Technology',
    priority: 'Tier 2',
    status: 'active'
  },
  'alert.pi': {
    route: '/alert',
    businessUnit: 'alert',
    name: 'Alert',
    category: 'Technology',
    priority: 'Tier 3',
    status: 'active'
  },
  'nexus.pi': {
    route: '/nexus',
    businessUnit: 'nexus',
    name: 'Nexus',
    category: 'Technology',
    priority: 'Tier 1',
    status: 'active'
  },

  // Specialized
  'life.pi': {
    route: '/life',
    businessUnit: 'life',
    name: 'Life',
    category: 'Specialized',
    priority: 'Tier 3',
    status: 'active'
  },
  'connection.pi': {
    route: '/connection',
    businessUnit: 'connection',
    name: 'Connection',
    category: 'Specialized',
    priority: 'Tier 3',
    status: 'active'
  },
  'brookfield.pi': {
    route: '/brookfield',
    businessUnit: 'brookfield',
    name: 'Brookfield',
    category: 'Specialized',
    priority: 'Tier 3',
    status: 'active'
  },
  'zone.pi': {
    route: '/zone',
    businessUnit: 'zone',
    name: 'Zone',
    category: 'Specialized',
    priority: 'Tier 3',
    status: 'active'
  },

  // Central Hub
  'tec.pi': {
    route: '/tec',
    businessUnit: 'tec',
    name: 'TEC',
    category: 'Hub',
    priority: 'Tier 1',
    status: 'active'
  }
};

// Helper functions
export function getDomainRoute(domain) {
  return domainMapping[domain]?.route || '/';
}

export function getBusinessUnit(domain) {
  return domainMapping[domain]?.businessUnit;
}

export function getDomainsByCategory(category) {
  return Object.entries(domainMapping)
    .filter(([_, config]) => config.category === category)
    .map(([domain, config]) => ({ domain, ...config }));
}

export function getDomainsByPriority(priority) {
  return Object.entries(domainMapping)
    .filter(([_, config]) => config.priority === priority)
    .map(([domain, config]) => ({ domain, ...config }));
}

export function getAllDomains() {
  return Object.keys(domainMapping);
}

export function getTotalDomains() {
  return Object.keys(domainMapping).length;
}

// Domain statistics
export function getDomainStats() {
  const domains = Object.entries(domainMapping);
  
  return {
    total: domains.length,
    byCategory: {
      Financial: domains.filter(([_, c]) => c.category === 'Financial').length,
      Premium: domains.filter(([_, c]) => c.category === 'Premium').length,
      Commerce: domains.filter(([_, c]) => c.category === 'Commerce').length,
      Technology: domains.filter(([_, c]) => c.category === 'Technology').length,
      Specialized: domains.filter(([_, c]) => c.category === 'Specialized').length,
      Hub: domains.filter(([_, c]) => c.category === 'Hub').length,
    },
    byPriority: {
      'Tier 1': domains.filter(([_, c]) => c.priority === 'Tier 1').length,
      'Tier 2': domains.filter(([_, c]) => c.priority === 'Tier 2').length,
      'Tier 3': domains.filter(([_, c]) => c.priority === 'Tier 3').length,
    },
    active: domains.filter(([_, c]) => c.status === 'active').length,
  };
}

export default domainMapping;
