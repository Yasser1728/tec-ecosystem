export function isValidAmount(value) {
  return typeof value === "number" && value > 0;
}

/**
 * Safe RegExp utilities to prevent ReDoS attacks.
 */

/**
 * Maximum allowed length for RegExp patterns from user input.
 */
const MAX_PATTERN_LENGTH = 100;

/**
 * Characters that need to be escaped in RegExp patterns.
 */
const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

/**
 * Escapes special RegExp characters in a string.
 * Use this when creating a RegExp pattern from user input.
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string safe for RegExp
 */
export function escapeRegExp(str) {
  if (typeof str !== "string") {
    return "";
  }
  return str.replace(REGEX_SPECIAL_CHARS, "\\$&");
}

/**
 * Creates a safe RegExp from user input by escaping special characters.
 * This prevents ReDoS attacks by not allowing users to inject regex patterns.
 * @param {string} userInput - The user-provided search string
 * @param {string} flags - Optional RegExp flags (default: "i" for case-insensitive)
 * @returns {RegExp|null} - A safe RegExp, or null if input is invalid
 */
export function createSafeRegExp(userInput, flags = "i") {
  if (typeof userInput !== "string") {
    return null;
  }

  // Reject overly long patterns
  if (userInput.length > MAX_PATTERN_LENGTH) {
    return null;
  }

  // Reject null bytes
  if (userInput.includes("\0")) {
    return null;
  }

  // Escape all special regex characters
  const escapedPattern = escapeRegExp(userInput);

  try {
    return new RegExp(escapedPattern, flags);
  } catch {
    return null;
  }
}

/**
 * Validates that a string doesn't contain dangerous RegExp patterns.
 * Use this as a secondary check if you must accept regex patterns from users.
 * @param {string} pattern - The regex pattern to validate
 * @returns {boolean} - True if the pattern appears safe
 */
export function isValidRegExpPattern(pattern) {
  if (typeof pattern !== "string") {
    return false;
  }

  // Reject overly long patterns
  if (pattern.length > MAX_PATTERN_LENGTH) {
    return false;
  }

  // Reject patterns known to cause ReDoS
  // These patterns contain nested quantifiers which can cause exponential backtracking
  const dangerousPatterns = [
    /\([^)]*\+[^)]*\)\+/, // Nested quantifiers like (a+)+
    /\([^)]*\*[^)]*\)\*/, // Nested quantifiers like (a*)*
    /\([^)]*\+[^)]*\)\*/, // Nested quantifiers like (a+)*
    /\([^)]*\*[^)]*\)\+/, // Nested quantifiers like (a*)+
    /\(\.\*\)\+/, // (.*)+
    /\(\.\+\)\*/, // (.+)*
    /\{(\d+,)?\d*\}\{/, // Consecutive quantifiers
  ];

  for (const dangerous of dangerousPatterns) {
    if (dangerous.test(pattern)) {
      return false;
    }
  }

  // Try to compile the pattern to catch syntax errors
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely tests a user-provided pattern against text with a timeout.
 * This provides defense in depth against ReDoS.
 * @param {string} pattern - The user-provided pattern (will be escaped)
 * @param {string} text - The text to search
 * @returns {boolean} - True if the pattern matches
 */
export function safeRegExpTest(pattern, text) {
  const regex = createSafeRegExp(pattern);
  if (regex === null) {
    return false;
  }

  try {
    return regex.test(text);
  } catch {
    return false;
  }
}
