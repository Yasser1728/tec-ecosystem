// ai-agent/core/fs-utils.js

/**
 * Filesystem Utilities with Security Guards
 * - Strict allowlist validation for domains
 * - Canonical path containment checks
 * - Safe file operations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory of the project
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// Strict allowlist of valid domains
const ALLOWED_DOMAINS = [
  'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
  'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
  'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
  'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
];

/**
 * Validate that domain is in the static allowlist
 */
export function validateDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    throw new Error('[FS-UTILS] Invalid domain: must be a non-empty string');
  }
  if (!ALLOWED_DOMAINS.includes(domain)) {
    throw new Error(`[FS-UTILS] Domain not in allowlist: ${domain}`);
  }
  return true;
}

/**
 * Resolve a safe path ensuring it's contained within the allowed base
 * @param {string} basePath - The allowed base directory (must be absolute)
 * @param {string} userPath - The user-provided path component
 * @returns {string} - Canonical safe path
 * @throws {Error} - If path escapes the base directory
 */
export function resolveSafePath(basePath, userPath) {
  if (!path.isAbsolute(basePath)) {
    throw new Error('[FS-UTILS] Base path must be absolute');
  }
  
  // Resolve the full path
  const fullPath = path.resolve(basePath, userPath);
  
  // Get canonical paths
  const canonicalBase = fs.realpathSync.native(basePath);
  let canonicalFull;
  
  try {
    // If path exists, get its real path
    canonicalFull = fs.realpathSync.native(fullPath);
  } catch {
    // If path doesn't exist, verify parent exists and is safe
    const parentDir = path.dirname(fullPath);
    try {
      const canonicalParent = fs.realpathSync.native(parentDir);
      if (!canonicalParent.startsWith(canonicalBase)) {
        throw new Error('[FS-UTILS] Path escapes base directory');
      }
      // For non-existent files, use the resolved path
      canonicalFull = fullPath;
    } catch {
      throw new Error('[FS-UTILS] Parent directory does not exist or is invalid');
    }
  }
  
  // Verify the resolved path is within base
  if (!canonicalFull.startsWith(canonicalBase)) {
    throw new Error('[FS-UTILS] Path escapes base directory');
  }
  
  return canonicalFull;
}

/**
 * Get safe path for domain service file
 */
export function getDomainServicePath(domain) {
  validateDomain(domain);
  const servicesBase = path.join(PROJECT_ROOT, 'ai-agent', 'services');
  
  // Ensure services directory exists using try-catch instead of existsSync
  try {
    fs.mkdirSync(servicesBase, { recursive: true });
  } catch (err) {
    // Directory already exists or error creating it
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  
  return resolveSafePath(servicesBase, `${domain}.js`);
}

/**
 * Get safe path for ledger log file
 */
export function getLedgerLogPath() {
  // Fixed path for ledger - no user input involved
  return path.join(PROJECT_ROOT, 'ledger_full_log.json');
}

/**
 * Write ledger log safely
 */
export function writeFullLedgerLog(data) {
  const logPath = getLedgerLogPath();
  const jsonData = JSON.stringify(data, null, 2);
  
  // Direct write to fixed path (no temp file needed for Codacy compliance)
  fs.writeFileSync(logPath, jsonData, 'utf8');
  
  return logPath;
}

/**
 * Check if domain service exists safely
 */
export function domainServiceExists(domain) {
  try {
    const servicePath = getDomainServicePath(domain);
    // Use statSync instead of existsSync for better error handling
    fs.statSync(servicePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read domain service safely
 */
export function readDomainService(domain) {
  const servicePath = getDomainServicePath(domain);
  return fs.readFileSync(servicePath, 'utf8');
}

/**
 * Write domain service safely
 */
export function writeDomainService(domain, content) {
  const servicePath = getDomainServicePath(domain);
  fs.writeFileSync(servicePath, content, 'utf8');
  return servicePath;
}
