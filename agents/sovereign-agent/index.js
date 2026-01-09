import fs from 'fs';
import path from 'path';
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

const DOMAINS_BASE = path.resolve('domains');

function resolveSafeDomainPath(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    throw new Error('Invalid relative path');
  }

  const fullPath = path.resolve(DOMAINS_BASE, relativePath);

  // Enforce allowlist boundary
  if (!fullPath.startsWith(DOMAINS_BASE + path.sep)) {
    throw new Error(`Blocked path traversal attempt: ${relativePath}`);
  }

  return fullPath;
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

const LEDGER_PATH = path.resolve('agents/sovereign-agent/ledger.json');

function appendLedger(entry) {
  let ledger = [];

  if (fs.existsSync(LEDGER_PATH)) {
    ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf-8'));
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
  console.error('Agent failed:', err.message);
  process.exit(1);
});
