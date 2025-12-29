// User Roles and Permissions System

export const USER_TIERS = {
  GUEST: 'GUEST',
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
  ENTERPRISE: 'ENTERPRISE',
  ADMIN: 'ADMIN',
};

export const TIER_HIERARCHY = {
  GUEST: 0,
  STANDARD: 1,
  PREMIUM: 2,
  ENTERPRISE: 3,
  ADMIN: 4,
};

// Permissions for each tier
export const TIER_PERMISSIONS = {
  GUEST: {
    canView: ['public_pages', 'business_unit_landing'],
    canAccess: [],
    canCreate: [],
    canUpdate: [],
    canDelete: [],
    features: {
      viewEcosystem: true,
      viewBusinessUnits: true,
      accessCalculators: false,
      accessAnalytics: false,
      makePurchases: false,
      createListings: false,
      accessPremiumContent: false,
      accessAdminPanel: false,
    },
  },

  STANDARD: {
    canView: ['public_pages', 'business_unit_landing', 'basic_tools'],
    canAccess: ['calculators', 'basic_analytics', 'marketplace'],
    canCreate: ['profile', 'wishlist'],
    canUpdate: ['own_profile'],
    canDelete: ['own_wishlist'],
    features: {
      viewEcosystem: true,
      viewBusinessUnits: true,
      accessCalculators: true,
      accessAnalytics: true,
      makePurchases: true,
      createListings: false,
      accessPremiumContent: false,
      accessAdminPanel: false,
    },
    limits: {
      calculationsPerDay: 10,
      analyticsReportsPerMonth: 5,
      purchasesPerMonth: 20,
    },
  },

  PREMIUM: {
    canView: ['all_standard', 'premium_content', 'advanced_analytics'],
    canAccess: ['all_standard', 'premium_tools', 'seller_hub'],
    canCreate: ['all_standard', 'listings', 'advanced_reports'],
    canUpdate: ['all_standard', 'own_listings'],
    canDelete: ['all_standard', 'own_listings'],
    features: {
      viewEcosystem: true,
      viewBusinessUnits: true,
      accessCalculators: true,
      accessAnalytics: true,
      makePurchases: true,
      createListings: true,
      accessPremiumContent: true,
      accessAdminPanel: false,
      prioritySupport: true,
      customBranding: true,
    },
    limits: {
      calculationsPerDay: 100,
      analyticsReportsPerMonth: 50,
      purchasesPerMonth: 'unlimited',
      listingsActive: 50,
    },
  },

  ENTERPRISE: {
    canView: ['all_premium', 'enterprise_analytics', 'bulk_operations'],
    canAccess: ['all_premium', 'api_access', 'white_label'],
    canCreate: ['all_premium', 'team_members', 'custom_integrations'],
    canUpdate: ['all_premium', 'team_settings'],
    canDelete: ['all_premium', 'team_members'],
    features: {
      viewEcosystem: true,
      viewBusinessUnits: true,
      accessCalculators: true,
      accessAnalytics: true,
      makePurchases: true,
      createListings: true,
      accessPremiumContent: true,
      accessAdminPanel: false,
      prioritySupport: true,
      customBranding: true,
      apiAccess: true,
      whiteLabel: true,
      dedicatedManager: true,
    },
    limits: {
      calculationsPerDay: 'unlimited',
      analyticsReportsPerMonth: 'unlimited',
      purchasesPerMonth: 'unlimited',
      listingsActive: 'unlimited',
      teamMembers: 50,
    },
  },

  ADMIN: {
    canView: ['everything'],
    canAccess: ['everything'],
    canCreate: ['everything'],
    canUpdate: ['everything'],
    canDelete: ['everything'],
    features: {
      viewEcosystem: true,
      viewBusinessUnits: true,
      accessCalculators: true,
      accessAnalytics: true,
      makePurchases: true,
      createListings: true,
      accessPremiumContent: true,
      accessAdminPanel: true,
      manageUsers: true,
      manageBusinessUnits: true,
      viewSystemAnalytics: true,
      configureSystem: true,
    },
    limits: {
      // No limits for admin
    },
  },
};

// Check if user has permission
export function hasPermission(userTier, permission) {
  const tier = userTier || USER_TIERS.GUEST;
  const permissions = TIER_PERMISSIONS[tier];
  
  if (!permissions) return false;
  
  return permissions.features[permission] === true;
}

// Check if user tier is at least the required tier
export function hasTierLevel(userTier, requiredTier) {
  const userLevel = TIER_HIERARCHY[userTier] || 0;
  const requiredLevel = TIER_HIERARCHY[requiredTier] || 0;
  
  return userLevel >= requiredLevel;
}

// Get tier features
export function getTierFeatures(tier) {
  return TIER_PERMISSIONS[tier]?.features || {};
}

// Get tier limits
export function getTierLimits(tier) {
  return TIER_PERMISSIONS[tier]?.limits || {};
}

// Check if user can access business unit page
export function canAccessBusinessUnitPage(userTier, businessUnit, page) {
  const tier = userTier || USER_TIERS.GUEST;
  
  // Landing pages are public
  if (page === 'index' || page === '/') {
    return true;
  }
  
  // Premium pages require at least PREMIUM tier
  const premiumPages = ['advanced', 'premium', 'consulting', 'events'];
  if (premiumPages.some(p => page.includes(p))) {
    return hasTierLevel(tier, USER_TIERS.PREMIUM);
  }
  
  // Standard pages require at least STANDARD tier
  const standardPages = ['calculator', 'strategies', 'analytics', 'portfolio', 'sellers'];
  if (standardPages.some(p => page.includes(p))) {
    return hasTierLevel(tier, USER_TIERS.STANDARD);
  }
  
  // Default: allow access
  return true;
}

// Tier pricing (in Pi)
export const TIER_PRICING = {
  STANDARD: 0, // Free
  PREMIUM: 100, // 100 Pi/month
  ENTERPRISE: 1000, // 1000 Pi/month
};

// Tier benefits summary
export const TIER_BENEFITS = {
  STANDARD: [
    'Access to all business unit landing pages',
    'Basic calculators and tools',
    'Limited analytics (5 reports/month)',
    'Make purchases',
    'Community support',
  ],
  PREMIUM: [
    'All STANDARD features',
    'Unlimited calculators and analytics',
    'Create and manage listings',
    'Access premium content',
    'Priority support',
    'Custom branding',
    'Up to 50 active listings',
  ],
  ENTERPRISE: [
    'All PREMIUM features',
    'API access',
    'White-label solutions',
    'Unlimited listings',
    'Team management (up to 50 members)',
    'Dedicated account manager',
    'Custom integrations',
  ],
};
