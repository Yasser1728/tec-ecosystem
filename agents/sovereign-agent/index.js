import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runLLM } from './openrouter.client.js';
import TASK_MAP from './task-map.js';

/**
 * ============================
 * Sovereign Filesystem Guard
 * ============================
 * All outputs MUST live under /domains
 * No absolute paths
 * No traversal
 */

// Resolve domains directory relative to repository root (2 levels up from agents/sovereign-agent/)
// Using URL API for secure module-relative path resolution
const DOMAINS_BASE = fileURLToPath(new URL('../../domains/', import.meta.url));

function resolveSafeDomainPath(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    throw new Error('Invalid relative path');
  }

  // Reject absolute paths explicitly
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Absolute paths not allowed: ${relativePath}`);
  }

  // Use path.join to prevent absolute path override
  const fullPath = path.join(DOMAINS_BASE, relativePath);

  // Normalize to handle different path separators (Windows/Unix)
  const normalizedFull = path.normalize(fullPath);
  const normalizedBase = path.normalize(DOMAINS_BASE);

  // Use path.relative to detect traversal attempts
  const relative = path.relative(normalizedBase, normalizedFull);
  
  // If the relative path starts with '..', it's trying to escape
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Blocked path traversal attempt: ${relativePath}`);
  }

  return normalizedFull;
}

/**
 * ============================
 * Orchestrator
 * ============================
 */

async function runAgent() {
  for (const task of TASK_MAP) {
    const { domain, prompt, output } = task;

    console.log(`\n▶ Running task: ${domain}/${output}`);

    const result = await runLLM(prompt);

    const safeOutputPath = resolveSafeDomainPath(
      path.join(domain, output)
    );

    // Ensure directory exists
    fs.mkdirSync(path.dirname(safeOutputPath), { recursive: true });

    fs.writeFileSync(safeOutputPath, result.text, 'utf-8');

    appendLedger({
      domain,
      task: output,
      model: result.model,
      usage: result.usage || null,
      output: safeOutputPath,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * ============================
 * Ledger (append-only)
 * ============================
 */

const LEDGER_PATH = fileURLToPath(new URL('./ledger.json', import.meta.url));

function appendLedger(entry) {
  let ledger = [];

  if (fs.existsSync(LEDGER_PATH)) {
    try {
      ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf-8'));
    } catch (parseError) {
      console.warn('⚠️ Ledger file corrupted, initializing new ledger:', parseError.message);
      ledger = [];
    }
  }

  ledger.push(entry);

  fs.writeFileSync(
    LEDGER_PATH,
    JSON.stringify(ledger, null, 2),
    'utf-8'
  );
}

// Execute
runAgent().catch(err => {
  console.error('Agent failed:', err);
  process.exit(1);
});
