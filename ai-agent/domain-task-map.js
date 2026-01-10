// ai-agent/domain-task-map.js
// Restored orchestrator functionality for sovereign domain task map execution.
// ESM module.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import CONFIG from './config.js';
import { executeModel } from './core/openrouter.js';
import {
  recordTransaction,
  generateFinalReport,
  getCostSignal,
} from './core/ledger.js';
import { councilDecision, TASK_TYPES } from './core/council.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Domain task map used to build a prompt per domain.
 * Keep keys matching CONFIG.domains entries.
 */
export const DOMAIN_TASK_MAP = {
  // Default fallback prompt for unknown domains.
  _default: (domain) =>
    `You are the sovereign AI orchestrator for the domain "${domain}".\n\n` +
    `1) Identify the most important work items for this domain.\n` +
    `2) Propose an actionable plan with milestones.\n` +
    `3) Specify any risks, dependencies, and required audits.\n` +
    `Return a concise report.`,

  // Common domain names (safe defaults). Add/adjust as your project evolves.
  core: (domain) =>
    `Domain: ${domain}\nTask: Improve core orchestration and reliability.\n` +
    `Focus on correctness, minimal changes, and ESM compatibility.\n` +
    `Provide: changes, rationale, and quick verification steps.`,
  agent: (domain) =>
    `Domain: ${domain}\nTask: Review agent behavior and task execution.\n` +
    `Provide recommended improvements and a small next-step task list.`,
};

function safeStringify(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.promises.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load domain service module from ai-agent/services/<domain>.js
 * If missing, creates a sandbox service that simply returns the model output.
 */
async function loadService(domain) {
  const servicesDir = path.join(__dirname, 'services');
  await ensureDir(servicesDir);

  const servicePath = path.join(servicesDir, `${domain}.js`);
  if (!(await fileExists(servicePath))) {
    const sandbox = `// ai-agent/services/${domain}.js\n// Auto-created sandbox domain service.\n// You can replace this implementation with real domain logic.\n\nexport async function runDomainService({ domain, aiResult, costSignal }) {\n  return {\n    domain,\n    summary: 'Sandbox service: no domain implementation found; returning model output.',\n    costSignal,\n    modelOutput: aiResult?.content ?? aiResult?.text ?? aiResult,\n  };\n}\n`;
    await fs.promises.writeFile(servicePath, sandbox, 'utf8');
  }

  // Dynamic import with cache-busting query to pick up newly created file.
  const url = pathToFileURL(servicePath);
  url.searchParams.set('t', String(Date.now()));
  const mod = await import(url.href);

  // Support either a named function or default export.
  const runDomainService =
    mod?.runDomainService || mod?.default || mod?.service || null;

  if (typeof runDomainService !== 'function') {
    throw new Error(
      `Domain service for "${domain}" must export a function (runDomainService or default).`
    );
  }

  return runDomainService;
}

function buildTaskPrompt(domain) {
  const entry = DOMAIN_TASK_MAP[domain];
  if (typeof entry === 'function') return entry(domain);
  if (typeof entry === 'string') return entry;
  const fallback = DOMAIN_TASK_MAP._default;
  return typeof fallback === 'function' ? fallback(domain) : String(fallback);
}

/**
 * Main orchestrator loop:
 * - Iterates CONFIG.domains
 * - Uses councilDecision to select model
 * - Executes model via executeModel
 * - Runs domain service
 * - Records usage to ledger
 * - Saves full ledger log (ledger_full_log.json) via generateFinalReport()
 */
export async function runSovereignTaskMap() {
  const domains = Array.isArray(CONFIG?.domains) ? CONFIG.domains : [];
  if (!domains.length) {
    throw new Error(
      'CONFIG.domains is empty or missing. Add domains in ai-agent/config.js.'
    );
  }

  const results = [];

  for (const domain of domains) {
    const taskPrompt = buildTaskPrompt(domain);
    const messages = [{ role: 'user', content: taskPrompt }];

    const decision = await councilDecision({
      taskType: TASK_TYPES.DEVELOPMENT,
      domain,
      requiresAudit: true,
    });

    const aiResult = await executeModel({
      model: decision.primary,
      messages,
      temperature: 0.2,
      domain,
      role: 'primary',
    });

    // Record ledger transaction for model usage.
    await recordTransaction({
      model: decision.primary,
      usage: aiResult?.usage,
      domain,
      role: 'primary',
    });

    // Optional cost signal for services that want to behave conservatively.
    let costSignal;
    try {
      costSignal = await getCostSignal();
    } catch {
      costSignal = undefined;
    }

    // Run local domain service.
    const runDomainService = await loadService(domain);
    const serviceResult = await runDomainService({
      domain,
      aiResult,
      costSignal,
      decision,
      taskPrompt,
      messages,
    });

    results.push({
      domain,
      decision,
      serviceResult,
      usage: aiResult?.usage,
    });
  }

  // Preserve existing behavior: save final report to ledger_full_log.json
  const final = await generateFinalReport({ results });
  const outPath = path.join(process.cwd(), 'ledger_full_log.json');
  await fs.promises.writeFile(outPath, safeStringify(final), 'utf8');

  return final;
}

// Direct-run guard: run when invoked directly (node ai-agent/domain-task-map.js)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runSovereignTaskMap().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
