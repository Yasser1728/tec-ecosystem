import path from "path";

/**
 * Security utilities for safe path construction
 * Prevents Path Traversal attacks by sanitizing user input
 */

/**
 * Sanitize a filename by removing path traversal sequences and invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename, empty string if input is invalid
 */
export function sanitizeFilename(filename) {
  if (typeof filename !== "string" || filename.length === 0) {
    return "";
  }

  // Remove null bytes
  let safeName = filename.replace(/\0/g, "");

  // Remove path traversal sequences
  safeName = safeName.replace(/\.\./g, "");

  // Remove leading/trailing spaces and multiple consecutive dots (preserve single leading dot for hidden files)
  safeName = safeName.replace(/^[\s]+|[\s]+$/g, "");
  safeName = safeName.replace(/\.{2,}/g, ".");

  // Remove path separators
  safeName = safeName.replace(/[/\\]/g, "");

  // Remove control characters and other dangerous characters (null byte already removed above)
  safeName = safeName.replace(/[<>:"|?*\x01-\x1f]/g, "");

  // Trim whitespace
  safeName = safeName.trim();

  return safeName;
}

/**
 * Safely join paths while preventing path traversal attacks
 * @param {string} basePath - The base directory path (trusted)
 * @param {string} userPath - The user-provided path component (untrusted)
 * @returns {string|null} - The safe joined path, or null if path traversal was detected
 */
export function safePathJoin(basePath, userPath) {
  if (typeof basePath !== "string" || typeof userPath !== "string") {
    return null;
  }

  // Sanitize the user-provided path
  const sanitizedPath = sanitizePathComponent(userPath);

  if (sanitizedPath === null) {
    return null;
  }

  // Resolve the paths
  const resolvedBase = path.resolve(basePath);
  const fullPath = path.join(resolvedBase, sanitizedPath);
  const resolvedFull = path.resolve(fullPath);

  // Verify the resolved path is still within the base directory
  if (!resolvedFull.startsWith(resolvedBase + path.sep) && resolvedFull !== resolvedBase) {
    return null;
  }

  return resolvedFull;
}

/**
 * Sanitize a path component by removing dangerous patterns
 * @param {string} pathComponent - The path component to sanitize
 * @returns {string|null} - Sanitized path component, or null if it's dangerous
 */
export function sanitizePathComponent(pathComponent) {
  if (typeof pathComponent !== "string") {
    return null;
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /\.\./,           // Path traversal
    /^\/|^\\/,        // Absolute paths
    /^[a-zA-Z]:\\/,   // Windows drive letters
    /\0/,             // Null bytes
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(pathComponent)) {
      return null;
    }
  }

  // Remove control characters
  const sanitized = pathComponent.replace(/[\x00-\x1f]/g, "");

  return sanitized;
}

/**
 * Validate that a resolved path is within the allowed base directory
 * @param {string} basePath - The allowed base directory
 * @param {string} targetPath - The path to validate
 * @returns {boolean} - True if the path is safe, false otherwise
 */
export function isPathWithinBase(basePath, targetPath) {
  if (typeof basePath !== "string" || typeof targetPath !== "string") {
    return false;
  }

  const resolvedBase = path.resolve(basePath);
  const resolvedTarget = path.resolve(targetPath);

  // Check if target path starts with base path
  return resolvedTarget.startsWith(resolvedBase + path.sep) || resolvedTarget === resolvedBase;
}
