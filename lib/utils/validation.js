/**
 * Validation utilities for TEC Ecosystem
 * @module lib/utils/validation
 */

/**
 * Validates if a value is a positive number
 * @param {*} value - The value to validate
 * @returns {boolean} True if value is a positive number, false otherwise
 * @example
 * isValidAmount(100) // returns true
 * isValidAmount(-10) // returns false
 * isValidAmount("100") // returns false
 */
export function isValidAmount(value) {
  return typeof value === "number" && value > 0;
}

