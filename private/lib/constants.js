/**
 * PROPRIETARY AND CONFIDENTIAL
 *
 * Copyright (c) 2024-2025 TEC Ecosystem
 * All rights reserved.
 *
 * This file is part of the TEC Ecosystem proprietary software.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * See LICENSE_PROPRIETARY for full license terms.
 *
 * @file constants.js
 * @description Centralized decimal constants for commerce domain pricing and calculations
 * @license Proprietary
 */

/**
 * Discount Multipliers - Applied to base prices to calculate discounted amounts
 * Formula: finalPrice = basePrice * multiplier
 * Example: basePrice * 0.85 = 15% discount (price reduced to 85% of original)
 */

/**
 * Premium tier discount multiplier
 * Represents 85% of original price (15% discount)
 * @constant {number}
 */
export const PREMIUM_MULTIPLIER = 0.85;

/**
 * VIP tier discount multiplier
 * Represents 70% of original price (30% discount)
 * @constant {number}
 */
export const VIP_MULTIPLIER = 0.7;

/**
 * Bulk order discount multiplier
 * Represents 90% of original price (10% discount for bulk orders)
 * @constant {number}
 */
export const BULK_DISCOUNT_MULTIPLIER = 0.9;

/**
 * Medium volume discount multiplier
 * Represents 95% of original price (5% discount for medium volume orders)
 * @constant {number}
 */
export const MEDIUM_DISCOUNT_MULTIPLIER = 0.95;

/**
 * Discount Percentages - Used for displaying discount rates and calculating savings
 * Formula: discountAmount = basePrice * discountPercentage
 */

/**
 * Welcome promotional discount rate (10%)
 * @constant {number}
 */
export const PROMO_WELCOME_DISCOUNT = 0.1;

/**
 * Premium tier discount rate (15%)
 * @constant {number}
 */
export const PREMIUM_DISCOUNT_RATE = 0.15;

/**
 * Save20 promotional discount rate (20%)
 * @constant {number}
 */
export const PROMO_SAVE20_DISCOUNT = 0.2;

/**
 * Premium tier maximum discount rate (25%)
 * @constant {number}
 */
export const PREMIUM_MAX_DISCOUNT = 0.25;

/**
 * VIP tier discount rate (30%)
 * @constant {number}
 */
export const VIP_DISCOUNT_RATE = 0.3;

/**
 * VIP tier maximum discount rate (40%)
 * @constant {number}
 */
export const VIP_MAX_DISCOUNT = 0.4;

/**
 * VIP50 promotional discount rate (50%)
 * @constant {number}
 */
export const PROMO_VIP50_DISCOUNT = 0.5;

/**
 * Tax and Fee Rates
 */

/**
 * Standard VAT rate (10%)
 * Used for calculating tax on subtotals
 * @constant {number}
 */
export const VAT_RATE = 0.10;

/**
 * Additional decimal constants for future use
 */

/**
 * Very small precision threshold (0.0001)
 * Used for floating point comparisons and rounding tolerances
 * @constant {number}
 */
export const PRECISION_THRESHOLD = 0.0001;

/**
 * Standard base multiplier (100%)
 * Represents no discount applied
 * @constant {number}
 */
export const BASE_MULTIPLIER = 1.0;

/**
 * Export all constants as a single object for convenience
 * This allows importing the entire collection if needed
 */
export const COMMERCE_CONSTANTS = {
  // Discount multipliers
  PREMIUM_MULTIPLIER,
  VIP_MULTIPLIER,
  BULK_DISCOUNT_MULTIPLIER,
  MEDIUM_DISCOUNT_MULTIPLIER,

  // Discount rates
  PROMO_WELCOME_DISCOUNT,
  PREMIUM_DISCOUNT_RATE,
  PROMO_SAVE20_DISCOUNT,
  PREMIUM_MAX_DISCOUNT,
  VIP_DISCOUNT_RATE,
  VIP_MAX_DISCOUNT,
  PROMO_VIP50_DISCOUNT,

  // Tax and fees
  VAT_RATE,

  // Utility constants
  PRECISION_THRESHOLD,
  BASE_MULTIPLIER
};

/**
 * Default export for importing the entire constants object
 */
export default COMMERCE_CONSTANTS;