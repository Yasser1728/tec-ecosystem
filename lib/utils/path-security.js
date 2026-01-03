import path from "path";

/**
 * Secure path utilities to prevent Path Traversal attacks.
 * These functions validate and sanitize user input before using it in path operations.
 */

/**
 * Validates that a path component doesn't contain path traversal sequences.
 * @param {string} pathComponent - The path component to validate
 * @returns {boolean} - True if the component is safe
 */
export function isValidPathComponent(pathComponent) {
  if (typeof pathComponent !== "string") {
    return false;
  }

  // Reject empty strings
  if (pathComponent.length === 0) {
    return false;
  }

  // Reject path traversal sequences
  if (
    pathComponent.includes("..") ||
    pathComponent.includes("./") ||
    pathComponent.includes("/..") ||
    pathComponent.includes("\\..") ||
    pathComponent.includes(".\\")
  ) {
    return false;
  }

  // Reject absolute paths in user input
  if (path.isAbsolute(pathComponent)) {
    return false;
  }

  // Reject null bytes (can be used in path injection)
  if (pathComponent.includes("\0")) {
    return false;
  }

  return true;
}

/**
 * Sanitizes a path component by removing dangerous characters.
 * Uses component-based approach to ensure complete sanitization.
 * @param {string} pathComponent - The path component to sanitize
 * @returns {string} - The sanitized path component
 */
export function sanitizePathComponent(pathComponent) {
  if (typeof pathComponent !== "string") {
    return "";
  }

  // Remove null bytes
  let sanitized = pathComponent.replace(/\0/g, "");

  // Normalize path separators to forward slash
  sanitized = sanitized.replace(/\\/g, "/");

  // Split into components and filter out dangerous ones
  const components = sanitized.split("/");
  const safeComponents = components.filter((component) => {
    // Filter out empty components (from leading/trailing/consecutive slashes)
    if (component === "") return false;
    // Filter out "." and ".." and any component that is only dots
    if (/^\.+$/.test(component)) return false;
    return true;
  });

  return safeComponents.join("/");
}

/**
 * Securely joins path components, ensuring the result stays within the base directory.
 * @param {string} baseDir - The base directory (must be an absolute path)
 * @param {...string} components - Path components from user input
 * @returns {string|null} - The joined path, or null if unsafe
 */
export function securePathJoin(baseDir, ...components) {
  if (typeof baseDir !== "string" || !path.isAbsolute(baseDir)) {
    throw new Error("Base directory must be an absolute path");
  }

  // Validate all components
  for (const component of components) {
    if (!isValidPathComponent(component)) {
      return null;
    }
  }

  // Sanitize components
  const sanitizedComponents = components.map(sanitizePathComponent);

  // Join the paths
  const joinedPath = path.join(baseDir, ...sanitizedComponents);

  // Resolve to absolute path and verify it's still within baseDir
  const resolvedPath = path.resolve(joinedPath);
  const resolvedBase = path.resolve(baseDir);

  // Ensure the resolved path starts with the base directory
  if (
    !resolvedPath.startsWith(resolvedBase + path.sep) &&
    resolvedPath !== resolvedBase
  ) {
    return null;
  }

  return resolvedPath;
}

/**
 * Securely resolves a user-provided path relative to a base directory.
 * @param {string} baseDir - The base directory (must be an absolute path)
 * @param {string} userPath - The user-provided path
 * @returns {string|null} - The resolved path, or null if unsafe
 */
export function securePathResolve(baseDir, userPath) {
  if (typeof baseDir !== "string" || !path.isAbsolute(baseDir)) {
    throw new Error("Base directory must be an absolute path");
  }

  if (!isValidPathComponent(userPath)) {
    return null;
  }

  const sanitizedPath = sanitizePathComponent(userPath);
  const resolvedPath = path.resolve(baseDir, sanitizedPath);
  const resolvedBase = path.resolve(baseDir);

  // Ensure the resolved path is within the base directory
  if (
    !resolvedPath.startsWith(resolvedBase + path.sep) &&
    resolvedPath !== resolvedBase
  ) {
    return null;
  }

  return resolvedPath;
}

/**
 * Validates a filename to ensure it's safe for file operations.
 * @param {string} filename - The filename to validate
 * @returns {boolean} - True if the filename is safe
 */
export function isValidFilename(filename) {
  if (typeof filename !== "string") {
    return false;
  }

  // Reject empty filenames
  if (filename.length === 0 || filename.length > 255) {
    return false;
  }

  // Reject files with path separators
  if (filename.includes("/") || filename.includes("\\")) {
    return false;
  }

  // Reject path traversal patterns (only . and ..)
  if (filename === "." || filename === "..") {
    return false;
  }

  // Reject null bytes
  if (filename.includes("\0")) {
    return false;
  }

  // Reject reserved Windows filenames
  const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;
  if (reservedNames.test(filename)) {
    return false;
  }

  return true;
}
