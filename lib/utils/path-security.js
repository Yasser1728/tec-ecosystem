/**
 * Path Security Utilities
 * Provides functions to prevent path traversal attacks
 */

import path from "path";

/**
 * Validate that a path stays within a base directory
 * Prevents path traversal attacks (e.g., ../../../etc/passwd)
 * @param {string} basePath - The allowed base directory (must be absolute)
 * @param {string} userPath - The user-provided path component
 * @returns {Object} Result object with valid flag and safe path or error
 */
export function validatePath(basePath, userPath) {
  if (!basePath || typeof basePath !== "string") {
    return {
      valid: false,
      error: "Base path must be a non-empty string",
    };
  }

  if (!userPath || typeof userPath !== "string") {
    return {
      valid: false,
      error: "User path must be a non-empty string",
    };
  }

  // Ensure base path is absolute
  if (!path.isAbsolute(basePath)) {
    return {
      valid: false,
      error: "Base path must be absolute",
    };
  }

  // Normalize the base path
  const normalizedBase = path.normalize(basePath);

  // Join and normalize the full path
  const joinedPath = path.join(normalizedBase, userPath);
  const normalizedFull = path.normalize(joinedPath);

  // Check if the normalized path starts with the base path
  // Add path.sep to ensure we're matching a directory boundary
  const baseWithSep = normalizedBase.endsWith(path.sep)
    ? normalizedBase
    : normalizedBase + path.sep;

  if (
    !normalizedFull.startsWith(baseWithSep) &&
    normalizedFull !== normalizedBase
  ) {
    return {
      valid: false,
      error: "Path traversal detected: path escapes base directory",
    };
  }

  return {
    valid: true,
    safePath: normalizedFull,
  };
}

/**
 * Sanitize a filename to prevent path traversal
 * Removes directory components and dangerous characters
 * @param {string} filename - The user-provided filename
 * @returns {string} Sanitized filename safe for file operations
 */
export function sanitizeFilename(filename) {
  if (!filename || typeof filename !== "string") {
    return "";
  }

  // Get only the base name (removes any directory components)
  let safeName = path.basename(filename);

  // Remove null bytes
  safeName = safeName.replace(/\0/g, "");

  // Remove or replace dangerous characters
  // Allow only alphanumeric, dash, underscore, dot, and space
  safeName = safeName.replace(/[^a-zA-Z0-9\-_. ]/g, "_");

  // Prevent hidden files (starting with dot) if needed
  if (safeName.startsWith(".")) {
    safeName = "_" + safeName.slice(1);
  }

  // Limit length
  if (safeName.length > 255) {
    const ext = path.extname(safeName);
    const nameWithoutExt = safeName.slice(0, 255 - ext.length);
    safeName = nameWithoutExt + ext;
  }

  return safeName;
}

/**
 * Create a safe path by combining base directory with sanitized user input
 * @param {string} basePath - The allowed base directory (must be absolute)
 * @param {string} userFilename - The user-provided filename
 * @returns {Object} Result object with valid flag and safe path or error
 */
export function createSafePath(basePath, userFilename) {
  const sanitized = sanitizeFilename(userFilename);

  if (!sanitized) {
    return {
      valid: false,
      error: "Invalid filename provided",
    };
  }

  return validatePath(basePath, sanitized);
}

/**
 * Check if a path contains path traversal sequences
 * @param {string} pathToCheck - Path to check for traversal sequences
 * @returns {boolean} True if path traversal sequences are detected
 */
export function containsPathTraversal(pathToCheck) {
  if (!pathToCheck || typeof pathToCheck !== "string") {
    return false;
  }

  // Check for common path traversal patterns
  const traversalPatterns = [
    /\.\./,
    /\.\.%2f/i,
    /\.\.%5c/i,
    /%2e%2e/i,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /\.\.\\/, // Windows-style
  ];

  return traversalPatterns.some((pattern) => pattern.test(pathToCheck));
}
