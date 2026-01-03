export function isValidAmount(value) {
  return typeof value === "number" && value > 0;
}

/**
 * Escape special regex characters in a string
 * Prevents RegExp DoS attacks by sanitizing user input before using in regex
 * @param {string} input - The string to escape
 * @returns {string} - The escaped string safe for use in RegExp
 */
export function escapeRegExp(input) {
  if (typeof input !== "string") {
    return "";
  }
  // Escape special regex characters: \ ^ $ . | ? * + ( ) [ ] { }
  return input.replace(/[\\^$.|?*+()[\]{}]/g, "\\$&");
}

/**
 * Create a safe RegExp from user input
 * Sanitizes the input to prevent ReDoS (Regular Expression Denial of Service) attacks
 * @param {string} pattern - The user-provided pattern
 * @param {string} [flags=""] - Optional regex flags
 * @param {Object} [options={}] - Additional options
 * @param {number} [options.maxLength=100] - Maximum allowed pattern length
 * @returns {RegExp|null} - Safe RegExp object, or null if pattern is invalid
 */
export function createSafeRegExp(pattern, flags = "", options = {}) {
  const { maxLength = 100 } = options;

  if (typeof pattern !== "string" || pattern.length === 0) {
    return null;
  }

  // Enforce maximum pattern length to prevent ReDoS
  if (pattern.length > maxLength) {
    return null;
  }

  // Validate flags
  const validFlags = "gimsuy";
  for (const flag of flags) {
    if (!validFlags.includes(flag)) {
      return null;
    }
  }

  // Escape the pattern to prevent regex injection
  const escapedPattern = escapeRegExp(pattern);

  try {
    return new RegExp(escapedPattern, flags);
  } catch {
    return null;
  }
}

/**
 * Test if a string matches a pattern safely
 * Uses escaped pattern to prevent regex injection
 * @param {string} input - The string to test
 * @param {string} pattern - The pattern to match (will be escaped)
 * @param {string} [flags="i"] - Optional regex flags
 * @returns {boolean} - True if the pattern is found in input
 */
export function safePatternMatch(input, pattern, flags = "i") {
  if (typeof input !== "string" || typeof pattern !== "string") {
    return false;
  }

  const regex = createSafeRegExp(pattern, flags);
  if (regex === null) {
    return false;
  }

  return regex.test(input);
}
