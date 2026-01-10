// ai-agent/domain-task-map.js
// Domain task mapping + guarded file access helpers.
//
// Codacy File Access findings addressed by:
//  - strict domain allowlist validation
//  - safe path resolution guards (no path traversal, fixed base dir)
//  - writing ledger_full_log.json via fixed guarded paths
//  - separate fixed constants for ledger and temp file (no dynamic construction)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Absolute base directory for all file operations in this module.
 * Using __dirname equivalent ensures paths are scoped to this file's directory.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname);

/**
 * Fixed filenames to avoid user-controlled path components.
 * Separate constants ensure no dynamic construction that Codacy might flag.
 */
const LEDGER_FILENAME = 'ledger_full_log.json';
const LEDGER_TMP_FILENAME = 'ledger_full_log.json.tmp';

/**
 * Domain allowlist (lowercase).
 * Keep this list tight. Add new domains explicitly.
 */
const DOMAIN_ALLOWLIST = new Set([
  'ai',
  'agent',
  'agents',
  'architecture',
  'backend',
  'build',
  'ci',
  'compliance',
  'core',
  'data',
  'database',
  'devops',
  'docs',
  'documentation',
  'ecosystem',
  'frontend',
  'infra',
  'infrastructure',
  'legal',
  'lint',
  'observability',
  'ops',
  'platform',
  'product',
  'qa',
  'quality',
  'release',
  'reliability',
  'security',
  'testing',
  'tooling',
]);

/**
 * Validate and normalize a domain string.
 * @param {string} domain
 * @returns {string} normalized domain
 */
function validateDomain(domain) {
  if (typeof domain !== 'string') {
    throw new TypeError('domain must be a string');
  }
  const normalized = domain.trim().toLowerCase();
  if (!normalized) {
    throw new Error('domain is required');
  }
  if (!DOMAIN_ALLOWLIST.has(normalized)) {
    throw new Error(`domain not allowed: ${normalized}`);
  }
  return normalized;
}

/**
 * Resolve a file path within BASE_DIR, preventing path traversal.
 *
 * Rules:
 *  - rejects absolute paths
 *  - resolves and ensures result remains under BASE_DIR
 *
 * @param {...string} segments
 * @returns {string} absolute safe path
 */
function resolveSafePath(...segments) {
  for (const seg of segments) {
    if (typeof seg !== 'string') {
      throw new TypeError('path segment must be a string');
    }
    // Reject absolute segments early (including Windows drive letters)
    if (path.isAbsolute(seg)) {
      throw new Error('absolute paths are not allowed');
    }
  }

  const resolved = path.resolve(BASE_DIR, ...segments);

  // Ensure resolved path is BASE_DIR or within it
  const baseWithSep = BASE_DIR.endsWith(path.sep) ? BASE_DIR : BASE_DIR + path.sep;
  if (resolved !== BASE_DIR && !resolved.startsWith(baseWithSep)) {
    throw new Error('path traversal detected');
  }

  return resolved;
}

/**
 * Write ledger_full_log.json using fixed guarded paths.
 * Both ledger and tmp paths use separate fixed filename constants,
 * not derived from each other, to satisfy Codacy's static analysis.
 *
 * @param {object|Array|any} ledger
 */
function writeFullLedgerLog(ledger) {
  const ledgerPath = resolveSafePath(LEDGER_FILENAME);
  const tmpPath = resolveSafePath(LEDGER_TMP_FILENAME);

  const json = JSON.stringify(ledger ?? {}, null, 2);

  // Both paths use fixed constants resolved via resolveSafePath - no dynamic construction
  fs.writeFileSync(tmpPath, json, { encoding: 'utf8', mode: 0o600 });
  fs.renameSync(tmpPath, ledgerPath);
}

/**
 * Example domain → task map.
 * If your project uses a different structure, keep the guards and update the map only.
 */
const DOMAIN_TASK_MAP = Object.freeze({
  docs: ['update-readme', 'write-guides'],
  security: ['audit-deps', 'harden-config'],
  qa: ['add-tests', 'fix-flaky'],
  backend: ['fix-api', 'add-endpoints'],
  frontend: ['fix-ui', 'improve-ux'],
  devops: ['update-ci', 'improve-deploy'],
});

/**
 * Get tasks for a given domain (validated against allowlist).
 * @param {string} domain
 * @returns {string[]}
 */
function getTasksForDomain(domain) {
  const d = validateDomain(domain);
  return DOMAIN_TASK_MAP[d] ? [...DOMAIN_TASK_MAP[d]] : [];
}

export {
  DOMAIN_TASK_MAP,
  DOMAIN_ALLOWLIST,
  validateDomain,
  resolveSafePath,
  writeFullLedgerLog,
  getTasksForDomain,
};
