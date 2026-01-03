/**
 * Validation Utilities
 * Provides input validation and sanitization functions for security
 */

/**
 * Validate that a value is a positive number
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid positive number
 */
export function isValidAmount(value) {
  return typeof value === "number" && value > 0;
}

/**
 * Escape special characters in a string for safe use in RegExp
 * Prevents ReDoS (Regular Expression Denial of Service) attacks
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for RegExp
 */
export function escapeRegExp(str) {
  if (typeof str !== "string") {
    return "";
  }
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Create a safe RegExp from user input
 * Escapes special characters to prevent ReDoS attacks
 * @param {string} pattern - User-provided pattern
 * @param {string} flags - RegExp flags (optional)
 * @returns {RegExp} Safe RegExp object
 */
export function createSafeRegExp(pattern, flags = "") {
  const escapedPattern = escapeRegExp(pattern);
  return new RegExp(escapedPattern, flags);
}

/**
 * Validate and sanitize a string input
 * Removes null bytes and control characters
 * @param {string} input - Input string to sanitize
 * @param {number} maxLength - Maximum allowed length (default 1000)
 * @returns {string} Sanitized string
 */
export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== "string") {
    return "";
  }
  // Remove null bytes and control characters (except newline, tab, carriage return)
  const sanitized = input
    .replace(/\0/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return sanitized.slice(0, maxLength);
}

/**
 * Validate that a value matches expected prototype-safe keys
 * Prevents prototype pollution attacks
 * @param {string} key - Object key to validate
 * @returns {boolean} True if the key is safe to use
 */
export function isPrototypeSafeKey(key) {
  if (typeof key !== "string") {
    return false;
  }
  const dangerousKeys = [
    "__proto__",
    "constructor",
    "prototype",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
  ];
  return !dangerousKeys.includes(key);
}

/**
 * Safely assign a value to an object, preventing prototype pollution
 * @param {Object} obj - Target object
 * @param {string} key - Key to assign
 * @param {*} value - Value to assign
 * @returns {boolean} True if assignment was made, false if blocked
 */
export function safeAssign(obj, key, value) {
  if (!isPrototypeSafeKey(key)) {
    console.warn(`Blocked attempt to assign to dangerous key: ${key}`);
    return false;
  }
  obj[key] = value;
  return true;
}

/**
 * Create an object with no prototype (null prototype)
 * Useful for dictionaries where prototype pollution is a concern
 * @param {Object} initialValues - Initial key-value pairs (optional)
 * @returns {Object} Object with null prototype
 */
export function createNullPrototypeObject(initialValues = {}) {
  const obj = Object.create(null);
  for (const key of Object.keys(initialValues)) {
    if (isPrototypeSafeKey(key)) {
      obj[key] = initialValues[key];
    }
  }
  return obj;
}
