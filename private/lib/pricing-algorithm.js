/**
 * Note: In production, fetch exchange rates from external API or database
 * Current implementation uses mock data for development
 * See: https://github.com/[org]/tec-ecosystem/issues/XXX
 */
const PI_TO_USD_RATE = 314.159; // 1 Pi = $314.159 (example rate - DO NOT USE IN PRODUCTION)

/**
 * Calculate price for a service based on membership tier
 *
 * @param {string} category - Service category (estate, commerce, investment, etc.)
 * @param {string} tier - User membership tier (FREE, PREMIUM, VIP)
 * @param {number} quantity - Quantity of service (default: 1)
 * @param {object} options - Additional pricing options
 * @returns {object} Price breakdown in both USD and Pi
 */
export function calculatePrice(
  category,
  tier = "FREE",
  quantity = 1,
  options = {},
) {
  // Validate inputs
  if (!SERVICE_CATEGORIES[category]) {
    throw new Error(`Invalid service category: ${category}`);
  }

  if (!MEMBERSHIP_TIERS[tier]) {
    throw new Error(`Invalid membership tier: ${tier}`);
  }

  const service = SERVICE_CATEGORIES[category];
  const membershipTier = MEMBERSHIP_TIERS[tier];

  // Calculate base price
  let basePrice = service.basePriceUSD * quantity;

  // Apply membership tier multiplier
  let discountedPrice = basePrice * membershipTier.multiplier;

  // Apply additional discounts if provided
  if (options.promoCode) {
    const promoDiscount = validatePromoCode(options.promoCode);
    discountedPrice *= 1 - promoDiscount;
  }

  // Apply volume discount for bulk purchases
  if (quantity >= VOLUME_DISCOUNTS.BULK_QUANTITY_THRESHOLD) {
    discountedPrice *= VOLUME_DISCOUNTS.BULK_DISCOUNT_RATE; // 10% bulk discount
  } else if (quantity >= VOLUME_DISCOUNTS.MEDIUM_QUANTITY_THRESHOLD) {
    discountedPrice *= VOLUME_DISCOUNTS.MEDIUM_DISCOUNT_RATE; // 5% medium discount
  }

  // Calculate Pi price
  const priceInPi = convertUSDtoPi(discountedPrice);

  // Calculate savings
  const totalSavings = basePrice - discountedPrice;
  const savingsPercentage = (totalSavings / basePrice) * 100;

  return {
    category: service.name,
    tier: membershipTier.name,
    quantity,
    pricing: {
      basePrice: roundPrice(basePrice),
      discountedPrice: roundPrice(discountedPrice),
      priceInUSD: roundPrice(discountedPrice),
      priceInPi: roundPrice(priceInPi, 4),
      currency: "Pi",
    },
    savings: {
      amount: roundPrice(totalSavings),
      percentage: roundPrice(savingsPercentage, 2),
    },
    breakdown: {
      basePricePerUnit: service.basePriceUSD,
      tierDiscount: membershipTier.discount,
      volumeDiscount: calculateVolumeDiscountRate(quantity),
      promoDiscount: options.promoCode
        ? validatePromoCode(options.promoCode)
        : 0,
    },
  };
}

/**
 * Calculate discount amount based on membership tier
 *
 * @param {number} originalPrice - Original price in USD
 * @param {string} tier - Membership tier
 * @returns {object} Discount details
 */
export function calculateDiscount(originalPrice, tier = "FREE") {
  if (!MEMBERSHIP_TIERS[tier]) {
    throw new Error(`Invalid membership tier: ${tier}`);
  }

  const membershipTier = MEMBERSHIP_TIERS[tier];
  const discountAmount = originalPrice * membershipTier.discount;
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice: roundPrice(originalPrice),
    discountPercentage: membershipTier.discount * 100,
    discountAmount: roundPrice(discountAmount),
    finalPrice: roundPrice(finalPrice),
    tier: membershipTier.name,
  };
}

/**
 * Convert USD to Pi cryptocurrency
 *
 * @param {number} usdAmount - Amount in USD
 * @param {number} conversionRate - Custom conversion rate (optional)
 * @returns {number} Amount in Pi
 */
export function convertUSDtoPi(usdAmount, conversionRate = null) {
  const rate = conversionRate || PI_TO_USD_RATE;
  return usdAmount / rate;
}

/**
 * Convert Pi to USD
 *
 * @param {number} piAmount - Amount in Pi
 * @param {number} conversionRate - Custom conversion rate (optional)
 * @returns {number} Amount in USD
 */
export function convertPiToUSD(piAmount, conversionRate = null) {
  const rate = conversionRate || PI_TO_USD_RATE;
  return piAmount * rate;
}

/**
 * Get pricing for all tiers for comparison
 *
 * @param {string} category - Service category
 * @param {number} quantity - Quantity
 * @returns {object} Pricing for all tiers
 */
export function getPricingComparison(category, quantity = 1) {
  const tiers = ["FREE", "PREMIUM", "VIP"];
  const comparison = {};

  tiers.forEach((tier) => {
    comparison[tier] = calculatePrice(category, tier, quantity);
  });

  return comparison;
}

/**
 * Calculate recommended tier based on usage and potential savings
 *
 * @param {object} usageData - User's historical usage data
 * @returns {object} Recommendation details
 */
export function recommendTier(usageData) {
  const { monthlySpending, servicesUsed, frequency } = usageData;

  // Calculate potential savings for each tier
  const freeCost = monthlySpending;
  const premiumCost = monthlySpending * MEMBERSHIP_TIERS.PREMIUM.multiplier;
  const vipCost = monthlySpending * MEMBERSHIP_TIERS.VIP.multiplier;

  const premiumSavings = freeCost - premiumCost;
  const vipSavings = freeCost - vipCost;

  // Determine recommendation
  let recommendedTier = "FREE";
  let reasoning = "Your current usage does not justify a paid tier.";

  if (vipSavings > TIER_RECOMMENDATION_THRESHOLDS.VIP_SAVINGS_THRESHOLD || 
      servicesUsed >= TIER_RECOMMENDATION_THRESHOLDS.VIP_SERVICES_THRESHOLD) {
    recommendedTier = "VIP";
    reasoning = `You could save $${roundPrice(vipSavings)} per month with VIP membership.`;
  } else if (premiumSavings > TIER_RECOMMENDATION_THRESHOLDS.PREMIUM_SAVINGS_THRESHOLD || 
             servicesUsed >= TIER_RECOMMENDATION_THRESHOLDS.PREMIUM_SERVICES_THRESHOLD) {
    recommendedTier = "PREMIUM";
    reasoning = `You could save $${roundPrice(premiumSavings)} per month with Premium membership.`;
  }

  return {
    recommendedTier,
    reasoning,
    potentialSavings: {
      premium: roundPrice(premiumSavings),
      vip: roundPrice(vipSavings),
    },
    currentCost: roundPrice(freeCost),
    projectedCosts: {
      free: roundPrice(freeCost),
      premium: roundPrice(premiumCost),
      vip: roundPrice(vipCost),
    },
  };
}

/**
 * Validate promotional code
 * @private
 *
 * @param {string} promoCode - Promotional code
 * @returns {number} Discount rate (0-1)
 */
function validatePromoCode(promoCode) {
  // Note: In production, implement database validation with security checks
  // Required features:
  // - Database lookup with Prisma
  // - Expiration date validation
  // - Usage limit tracking (max uses per code)
  // - User-specific restrictions (one-time use per user)
  // - Code activation/deactivation status
  // - Rate limiting to prevent brute force attacks
  // Example: const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });

  // SECURITY WARNING: Hard-coded promo codes are for demonstration only
  const promoCodes = {
    WELCOME10: PROMO_WELCOME_DISCOUNT,
    SAVE20: PROMO_SAVE20_DISCOUNT,
    VIP50: PROMO_VIP50_DISCOUNT,
  };

  return promoCodes[promoCode.toUpperCase()] || 0;
}

/**
 * Calculate volume discount rate based on quantity
 * @private
 *
 * @param {number} quantity - Purchase quantity
 * @returns {number} Volume discount rate (0-1)
 */
function calculateVolumeDiscountRate(quantity) {
  if (quantity >= VOLUME_DISCOUNTS.BULK_QUANTITY_THRESHOLD) {
    return 1 - VOLUME_DISCOUNTS.BULK_DISCOUNT_RATE;
  } else if (quantity >= VOLUME_DISCOUNTS.MEDIUM_QUANTITY_THRESHOLD) {
    return 1 - VOLUME_DISCOUNTS.MEDIUM_DISCOUNT_RATE;
  }
  return 0;
}

/**
 * Round price to specified decimal places
 * @private
 *
 * @param {number} price - Price to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded price
 */
function roundPrice(price, decimals = 2) {
  return Math.round(price * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Get membership tier benefits
 *
 * @param {string} tier - Membership tier
 * @returns {object} Tier benefits and features
 */
export function getTierBenefits(tier = "FREE") {
  if (!MEMBERSHIP_TIERS[tier]) {
    throw new Error(`Invalid membership tier: ${tier}`);
  }

  const membershipTier = MEMBERSHIP_TIERS[tier];

  return {
    tier: membershipTier.name,
    discount: `${membershipTier.discount * 100}%`,
    maxDiscount: `${membershipTier.maxDiscount * 100}%`,
    features: membershipTier.features,
    piPriority: membershipTier.piPriority,
    benefits: getTierSpecificBenefits(tier),
  };
}

/**
 * Get tier-specific benefits
 * @private
 */
function getTierSpecificBenefits(tier) {
  const benefits = {
    FREE: ["Access to basic services", "Standard support", "Community access"],
    PREMIUM: [
      "All FREE benefits",
      "15% discount on all services",
      "Priority support",
      "Advanced analytics",
      "Early access to new features",
    ],
    VIP: [
      "All PREMIUM benefits",
      "30% discount on all services",
      "24/7 dedicated support",
      "Exclusive VIP events",
      "Personal account manager",
      "Custom service packages",
      "Highest Pi Network priority",
    ],
  };

  return benefits[tier] || [];
}

/**
 * Export configuration for external use (limited information)
 */
export const PRICING_CONFIG = {
  tiers: Object.keys(MEMBERSHIP_TIERS),
  categories: Object.keys(SERVICE_CATEGORIES),
  currency: "Pi",
};
