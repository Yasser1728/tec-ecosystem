const path = require("path");

/**
 * Sanitize a domain/file name to prevent injection attacks
 * Enforces alphanumeric characters, hyphens only, max 63 characters
 * @param {string} name - The name to sanitize
 * @returns {string} The sanitized name
 * @throws {Error} If name doesn't match allowed pattern
 */
function sanitizeName(name) {
  const nameRegex = /^[a-z0-9-]{1,63}$/i;

  if (!nameRegex.test(name)) {
    throw new Error(
      `Invalid name: "${name}". Must be 1-63 alphanumeric characters or hyphens only.`,
    );
  }

  return name;
}

/**
 * Safely resolve a file path within a base directory
 * Prevents path traversal attacks by ensuring resolved path stays within baseDir
 * @param {string} baseDir - The base directory to constrain paths within
 * @param {string} userInput - User-provided path input
 * @returns {string} The safely resolved absolute path
 * @throws {Error} If path traversal is detected
 */
function safeResolveFile(baseDir, userInput) {
  // Convert Windows-style backslashes to forward slashes BEFORE normalization
  // This ensures cross-platform security - we want to catch Windows path
  // traversal attempts (..\\) even when running on Unix systems.
  // Normalizing first would not treat backslashes as separators on Unix.
  const sanitizedInput = userInput.replace(/\\/g, "/");
  
  // Normalize to remove any . or .. segments and resolve to absolute path
  const normalizedInput = path.normalize(sanitizedInput);
  const resolvedPath = path.resolve(baseDir, normalizedInput);
  const resolvedBase = path.resolve(baseDir);

  // Ensure the resolved path is within the base directory
  if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
    throw new Error(
      "Sovereign Security: Path traversal detected! Access denied.",
    );
  }

  return resolvedPath;
}

module.exports = {
  sanitizeName,
  safeResolveFile,
};
