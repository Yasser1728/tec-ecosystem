import crypto from "crypto";

/**
 * Create a SHA-256 hash of the provided data
 * @param {string} data - Data to hash
 * @returns {string} Hexadecimal hash string
 */
export function hash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Generate cryptographically secure random bytes
 * Use this instead of Math.random() for security-sensitive operations
 * @param {number} length - Number of bytes to generate
 * @returns {Buffer} Secure random bytes
 */
export function generateSecureRandomBytes(length = 32) {
  return crypto.randomBytes(length);
}

/**
 * Generate a cryptographically secure random string
 * Use this instead of Math.random() for tokens, IDs, and security-sensitive values
 * @param {number} length - Length of the string to generate
 * @param {string} encoding - Encoding for the output ('hex', 'base64', 'base64url')
 * @returns {string} Secure random string
 */
export function generateSecureRandomString(length = 32, encoding = "hex") {
  // For hex encoding, each byte produces 2 characters
  // For base64, each 3 bytes produce 4 characters
  const bytesNeeded =
    encoding === "hex" ? Math.ceil(length / 2) : Math.ceil((length * 3) / 4);
  const buffer = crypto.randomBytes(bytesNeeded);

  if (encoding === "base64url") {
    return buffer
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
      .slice(0, length);
  }

  return buffer.toString(encoding).slice(0, length);
}

/**
 * Generate a cryptographically secure random integer
 * Use this instead of Math.random() for security-sensitive random numbers
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Secure random integer
 */
export function generateSecureRandomInt(min, max) {
  return crypto.randomInt(min, max);
}

/**
 * Generate a secure token for authentication or session purposes
 * @param {number} length - Length of the token in bytes (default 32 = 256 bits)
 * @returns {string} Secure token as a hex string
 */
export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Generate a UUID v4 using cryptographically secure random bytes
 * @returns {string} UUID v4 string
 */
export function generateSecureUUID() {
  return crypto.randomUUID();
}
