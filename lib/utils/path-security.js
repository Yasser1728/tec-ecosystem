/**
 * Path Security Utilities
 * Provides secure path handling to prevent path traversal attacks
 * and ensure only valid domain/app names are used in file operations
 */

const path = require('path');
const fs = require('fs');

/**
 * Validates a name against an allowlist pattern
 * Only allows alphanumeric characters, hyphens, and underscores
 * @param {string} name - The name to validate
 * @param {number} maxLength - Maximum allowed length (default: 50)
 * @returns {boolean} - True if name is valid
 */
function isValidName(name, maxLength = 50) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  if (name.length === 0 || name.length > maxLength) {
    return false;
  }
  
  // Only allow alphanumeric, hyphens, and underscores
  // No dots to prevent extension manipulation
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(name);
}

/**
 * Sanitizes a name for use in file/directory operations
 * @param {string} name - The name to sanitize
 * @returns {string} - Sanitized name
 * @throws {Error} - If name is invalid
 */
function sanitizeName(name) {
  if (!isValidName(name)) {
    throw new Error(
      `Invalid name: "${name}". Only alphanumeric characters, hyphens, and underscores are allowed.`
    );
  }
  return name;
}

/**
 * Safely resolves a file path within a base directory
 * Prevents path traversal attacks by ensuring the resolved path
 * stays within the base directory
 * @param {string} baseDir - The base directory (must be absolute)
 * @param {...string} userInputs - Path segments from user input
 * @returns {string} - Safe resolved path
 * @throws {Error} - If path traversal is detected or baseDir is invalid
 */
function safeResolveFile(baseDir, ...userInputs) {
  // Ensure baseDir is absolute
  if (!path.isAbsolute(baseDir)) {
    throw new Error('Base directory must be an absolute path');
  }
  
  // Normalize the base directory
  const normalizedBase = path.normalize(baseDir);
  
  // Join and resolve the path
  const targetPath = path.resolve(normalizedBase, ...userInputs);
  
  // Normalize to remove any .. or . segments
  const normalizedTarget = path.normalize(targetPath);
  
  // Ensure the target path starts with the base directory
  // This prevents path traversal attacks
  if (!normalizedTarget.startsWith(normalizedBase + path.sep) && 
      normalizedTarget !== normalizedBase) {
    throw new Error(
      `Path traversal detected. Target path must be within: ${normalizedBase}`
    );
  }
  
  return normalizedTarget;
}

/**
 * Safely creates a directory with proper validation
 * @param {string} baseDir - The base directory (must be absolute)
 * @param {string} dirName - The directory name (will be sanitized)
 * @returns {string} - The created directory path
 * @throws {Error} - If validation fails or directory creation fails
 */
function safeCreateDirectory(baseDir, dirName) {
  const sanitizedName = sanitizeName(dirName);
  const targetDir = safeResolveFile(baseDir, sanitizedName);
  
  try {
    fs.mkdirSync(targetDir, { recursive: true });
    return targetDir;
  } catch (error) {
    throw new Error(`Failed to create directory: ${error.message}`);
  }
}

/**
 * Safely writes a file with proper validation
 * @param {string} baseDir - The base directory (must be absolute)
 * @param {string} fileName - The file name (will be sanitized)
 * @param {string} content - The file content
 * @param {object} options - Additional options
 * @returns {string} - The written file path
 * @throws {Error} - If validation fails or file write fails
 */
function safeWriteFile(baseDir, fileName, content, options = {}) {
  const sanitizedName = sanitizeName(fileName);
  const targetFile = safeResolveFile(baseDir, sanitizedName);
  
  // Ensure parent directory exists
  const parentDir = path.dirname(targetFile);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
  
  try {
    fs.writeFileSync(targetFile, content, options);
    return targetFile;
  } catch (error) {
    throw new Error(`Failed to write file: ${error.message}`);
  }
}

/**
 * Validates that a path exists and is within the base directory
 * @param {string} baseDir - The base directory
 * @param {string} targetPath - The path to validate
 * @returns {boolean} - True if path is safe and exists
 */
function isSafePath(baseDir, targetPath) {
  try {
    const safePath = safeResolveFile(baseDir, targetPath);
    return fs.existsSync(safePath);
  } catch {
    return false;
  }
}

module.exports = {
  sanitizeName,
  safeResolveFile,
  safeCreateDirectory,
  safeWriteFile,
  isValidName,
  isSafePath
};
