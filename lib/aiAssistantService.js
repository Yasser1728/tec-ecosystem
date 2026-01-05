/**
 * AI Assistant Service
 * 
 * Provides AI-powered assistance features for the TEC Ecosystem.
 * Implements robust input sanitization for all file/path operations
 * to prevent path traversal and other security vulnerabilities.
 * 
 * Security Features:
 * - Regex validation for safe file names
 * - Whitelist validation for allowed file types
 * - Prevention of path traversal attacks
 * - Secure file path construction
 */

import path from 'path';
import fs from 'fs';

/**
 * Regular expression for validating safe file names
 * Allows only alphanumeric characters, underscores, hyphens, and dots
 */
const SAFE_FILENAME_PATTERN = /^[\w\-\.]+$/;

/**
 * Whitelist of allowed file extensions for AI assistant operations
 */
const ALLOWED_EXTENSIONS = [
  '.txt',
  '.md',
  '.json',
  '.log',
];

/**
 * Whitelist of allowed configuration files
 */
const ALLOWED_CONFIG_FILES = [
  'assistant-config.json',
  'ai-prompts.json',
  'knowledge-base.json',
  'settings.json',
];

/**
 * Validate that a filename matches the safe pattern
 * @param {string} filename - The filename to validate
 * @throws {Error} If filename contains invalid characters
 * @returns {boolean} True if valid
 */
export function validateFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    throw new Error('Filename must be a non-empty string');
  }
  
  if (!SAFE_FILENAME_PATTERN.test(filename)) {
    throw new Error(
      'Invalid filename: only alphanumeric characters, underscores, hyphens, and dots are allowed'
    );
  }
  
  // Additional check to prevent path traversal attempts
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    throw new Error('Invalid filename: path traversal attempts are not allowed');
  }
  
  return true;
}

/**
 * Validate that a filename has an allowed extension
 * @param {string} filename - The filename to validate
 * @throws {Error} If extension is not in whitelist
 * @returns {boolean} True if valid
 */
export function validateFileExtension(filename) {
  if (!filename || typeof filename !== 'string') {
    throw new Error('Filename must be a non-empty string');
  }
  
  const extension = path.extname(filename).toLowerCase();
  
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error(
      `Invalid file extension: only ${ALLOWED_EXTENSIONS.join(', ')} are allowed`
    );
  }
  
  return true;
}

/**
 * Validate that a filename is in the allowed config files whitelist
 * @param {string} filename - The filename to validate
 * @throws {Error} If filename is not in whitelist
 * @returns {boolean} True if valid
 */
export function validateConfigFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    throw new Error('Filename must be a non-empty string');
  }
  
  if (!ALLOWED_CONFIG_FILES.includes(filename)) {
    throw new Error(
      `Invalid config filename: must be one of ${ALLOWED_CONFIG_FILES.join(', ')}`
    );
  }
  
  return true;
}

/**
 * Safely construct a file path with validation
 * @param {string} baseDir - The base directory (must be absolute)
 * @param {string} filename - The filename to append
 * @param {Object} options - Validation options
 * @param {boolean} options.validateExtension - Whether to validate file extension (default: true)
 * @throws {Error} If inputs are invalid
 * @returns {string} The safely constructed path
 */
export function constructSafePath(baseDir, filename, options = {}) {
  const { validateExtension = true } = options;
  
  // Validate base directory
  if (!baseDir || typeof baseDir !== 'string') {
    throw new Error('Base directory must be a non-empty string');
  }
  
  if (!path.isAbsolute(baseDir)) {
    throw new Error('Base directory must be an absolute path');
  }
  
  // Validate filename
  validateFilename(filename);
  
  if (validateExtension) {
    validateFileExtension(filename);
  }
  
  // Construct the path safely
  const fullPath = path.join(baseDir, filename);
  
  // Verify the constructed path is still within the base directory
  const normalizedPath = path.normalize(fullPath);
  const normalizedBase = path.normalize(baseDir);
  
  if (!normalizedPath.startsWith(normalizedBase)) {
    throw new Error('Path traversal detected: constructed path is outside base directory');
  }
  
  return fullPath;
}

/**
 * Safely resolve a file path with validation
 * @param {string} baseDir - The base directory (must be absolute)
 * @param {string} filename - The filename to resolve
 * @param {Object} options - Validation options
 * @param {boolean} options.validateExtension - Whether to validate file extension (default: true)
 * @throws {Error} If inputs are invalid
 * @returns {string} The safely resolved path
 */
export function resolveSafePath(baseDir, filename, options = {}) {
  const { validateExtension = true } = options;
  
  // Validate base directory
  if (!baseDir || typeof baseDir !== 'string') {
    throw new Error('Base directory must be a non-empty string');
  }
  
  if (!path.isAbsolute(baseDir)) {
    throw new Error('Base directory must be an absolute path');
  }
  
  // Validate filename
  validateFilename(filename);
  
  if (validateExtension) {
    validateFileExtension(filename);
  }
  
  // Resolve the path safely
  const fullPath = path.resolve(baseDir, filename);
  
  // Verify the resolved path is still within the base directory
  const normalizedPath = path.normalize(fullPath);
  const normalizedBase = path.normalize(baseDir);
  
  if (!normalizedPath.startsWith(normalizedBase)) {
    throw new Error('Path traversal detected: resolved path is outside base directory');
  }
  
  return fullPath;
}

/**
 * Load AI assistant configuration from a whitelisted config file
 * @param {string} baseDir - The base configuration directory
 * @param {string} configFilename - The config filename (must be in whitelist)
 * @throws {Error} If inputs are invalid or file doesn't exist
 * @returns {Promise<Object>} The parsed configuration
 */
export async function loadAIConfig(baseDir, configFilename) {
  // Validate base directory
  if (!baseDir || typeof baseDir !== 'string') {
    throw new Error('Base directory must be a non-empty string');
  }
  
  if (!path.isAbsolute(baseDir)) {
    throw new Error('Base directory must be an absolute path');
  }
  
  // Validate config filename against whitelist
  validateConfigFilename(configFilename);
  
  // Construct safe path (no extension validation needed for whitelisted configs)
  const configPath = path.join(baseDir, configFilename);
  
  // Verify the constructed path is still within the base directory
  const normalizedPath = path.normalize(configPath);
  const normalizedBase = path.normalize(baseDir);
  
  if (!normalizedPath.startsWith(normalizedBase)) {
    throw new Error('Path traversal detected: config path is outside base directory');
  }
  
  // Check if file exists
  try {
    await fs.promises.access(configPath, fs.constants.R_OK);
  } catch (error) {
    throw new Error(`Configuration file not found or not readable: ${configFilename}`);
  }
  
  // Read and parse the configuration
  try {
    const content = await fs.promises.readFile(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse configuration file: ${error.message}`);
  }
}

/**
 * Save AI assistant data to a validated file
 * @param {string} baseDir - The base data directory
 * @param {string} filename - The filename to save to
 * @param {string} content - The content to write
 * @throws {Error} If inputs are invalid
 * @returns {Promise<void>}
 */
export async function saveAIData(baseDir, filename, content) {
  // Construct safe path with validation
  const filePath = constructSafePath(baseDir, filename);
  
  // Validate content
  if (typeof content !== 'string') {
    throw new Error('Content must be a string');
  }
  
  // Write file safely
  try {
    await fs.promises.writeFile(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write file: ${error.message}`);
  }
}

/**
 * Read AI assistant data from a validated file
 * @param {string} baseDir - The base data directory
 * @param {string} filename - The filename to read from
 * @throws {Error} If inputs are invalid or file doesn't exist
 * @returns {Promise<string>} The file content
 */
export async function readAIData(baseDir, filename) {
  // Construct safe path with validation
  const filePath = constructSafePath(baseDir, filename);
  
  // Check if file exists
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch (error) {
    throw new Error(`File not found or not readable: ${filename}`);
  }
  
  // Read file safely
  try {
    return await fs.promises.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

/**
 * List AI assistant data files in a directory
 * @param {string} baseDir - The base data directory
 * @throws {Error} If base directory is invalid
 * @returns {Promise<Array<string>>} List of filenames with allowed extensions
 */
export async function listAIDataFiles(baseDir) {
  // Validate base directory
  if (!baseDir || typeof baseDir !== 'string') {
    throw new Error('Base directory must be a non-empty string');
  }
  
  if (!path.isAbsolute(baseDir)) {
    throw new Error('Base directory must be an absolute path');
  }
  
  // Check if directory exists
  try {
    await fs.promises.access(baseDir, fs.constants.R_OK);
  } catch (error) {
    throw new Error(`Directory not found or not readable: ${baseDir}`);
  }
  
  // Read directory
  try {
    const files = await fs.promises.readdir(baseDir);
    
    // Filter files by allowed extensions
    const validFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return ALLOWED_EXTENSIONS.includes(extension);
    });
    
    return validFiles;
  } catch (error) {
    throw new Error(`Failed to read directory: ${error.message}`);
  }
}

/**
 * Get AI assistant constants for external use
 */
export const AI_ASSISTANT_CONSTANTS = {
  SAFE_FILENAME_PATTERN,
  ALLOWED_EXTENSIONS,
  ALLOWED_CONFIG_FILES,
};
