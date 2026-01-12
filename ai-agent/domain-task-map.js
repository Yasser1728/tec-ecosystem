import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AGENT_DIR = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_DOMAINS = Object.freeze([
  'life.pi',
  'insure.pi',
  'commerce.pi',
  'ecommerce.pi',
  'assets.pi',
  'fundx.pi',
  'dx.pi',
  'analytics.pi',
  'nbf.pi',
  'epic.pi',
  'legend.pi',
  'connection.pi',
  'system.pi',
  'alert.pi',
  'tec.pi',
  'estate.pi',
  'nx.pi',
  'explorer.pi',
  'nexus.pi',
  'brookfield.pi',
  'vip.pi',
  'titan.pi',
  'zone.pi',
  'elite.pi'
]);

const SAFE_PATHS = Object.freeze({
  servicesRoot: path.join(AGENT_DIR, 'services'),
  ledger: path.join(AGENT_DIR, 'ledger.json')
});

const domainTaskMap = Object.freeze({
  'life.pi': Object.freeze([
    'Curate sovereign lifestyle intelligence',
    'Route verified life services safely'
  ]),
  'insure.pi': Object.freeze([
    'Compute coverage and risk envelopes',
    'Validate policy governance controls'
  ]),
  'commerce.pi': Object.freeze([
    'Generate marketplace operating blueprint',
    'Audit vendor onboarding and safety'
  ]),
  'ecommerce.pi': Object.freeze([
    'Design digital catalog delivery',
    'Secure checkout and payments pipeline'
  ]),
  'assets.pi': Object.freeze([
    'Rebalance asset allocations',
    'Produce portfolio oversight summary'
  ]),
  'fundx.pi': Object.freeze([
    'Evaluate fund performance and ROI',
    'Generate investment committee memo'
  ]),
  'dx.pi': Object.freeze([
    'Draft digital transformation plan',
    'Map integration dependencies'
  ]),
  'analytics.pi': Object.freeze([
    'Produce analytics pipeline design',
    'Publish KPI dashboard specification'
  ]),
  'nbf.pi': Object.freeze([
    'Model next-bank service catalog',
    'Assess risk controls and guardrails'
  ]),
  'epic.pi': Object.freeze([
    'Design premium flagship experience',
    'Vet milestone delivery governance'
  ]),
  'legend.pi': Object.freeze([
    'Preserve legacy program blueprint',
    'Design heritage incentive matrix'
  ]),
  'connection.pi': Object.freeze([
    'Orchestrate elite networking flows',
    'Validate member governance and safety'
  ]),
  'system.pi': Object.freeze([
    'Harden operational intelligence system',
    'Generate runbook automation steps'
  ]),
  'alert.pi': Object.freeze([
    'Configure alert routing policies',
    'Calibrate anomaly thresholds'
  ]),
  'tec.pi': Object.freeze([
    'Enforce central governance directives',
    'Publish ecosystem oversight bulletin'
  ]),
  'estate.pi': Object.freeze([
    'Draft real estate marketplace flow',
    'Evaluate property compliance gates'
  ]),
  'nx.pi': Object.freeze([
    'Prototype next-gen service loop',
    'Stress test resilience baselines'
  ]),
  'explorer.pi': Object.freeze([
    'Create discovery itinerary engine',
    'Verify partner safety standards'
  ]),
  'nexus.pi': Object.freeze([
    'Model AI integration hub contracts',
    'Validate API interoperability rules'
  ]),
  'brookfield.pi': Object.freeze([
    'Assess property investment dossier',
    'Generate asset risk summary'
  ]),
  'vip.pi': Object.freeze([
    'Curate VIP concierge brief',
    'Verify exclusivity controls'
  ]),
  'titan.pi': Object.freeze([
    'Plan enterprise rollout guardrails',
    'Audit mission-critical SLA readiness'
  ]),
  'zone.pi': Object.freeze([
    'Calibrate regional zoning rules',
    'Model service coverage alignment'
  ]),
  'elite.pi': Object.freeze([
    'Design elite advisory module',
    'Validate council oversight adherence'
  ])
});

function validateDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    throw new Error('[SECURITY] Domain must be a non-empty string');
  }
  const normalized = domain.trim().toLowerCase();
  if (normalized.includes('..') || normalized.includes('/') || normalized.includes('\\')) {
    throw new Error('[SECURITY] Blocked path traversal');
  }
  if (!ALLOWED_DOMAINS.includes(normalized)) {
    throw new Error(`[SECURITY] Domain not allowed: ${domain}`);
  }
  return normalized;
}

function getSafeServicePath(domain) {
  const safeDomain = validateDomain(domain);
  if (!fs.existsSync(SAFE_PATHS.servicesRoot)) {
    fs.mkdirSync(SAFE_PATHS.servicesRoot, { recursive: true });
  }
  const servicePath = path.resolve(SAFE_PATHS.servicesRoot, `${safeDomain}.js`);
  if (!servicePath.startsWith(SAFE_PATHS.servicesRoot)) {
    throw new Error('[SECURITY] Blocked path traversal');
  }
  return servicePath;
}

function recordLedger(domain, task, meta = {}) {
  const ledgerPath = SAFE_PATHS.ledger;
  let existing = { events: [] };
  
  // ✅ FIXED: Wrap fs.readFileSync in try-catch
  if (fs.existsSync(ledgerPath)) {
    try {
      const raw = fs.readFileSync(ledgerPath, 'utf8');
      if (raw && raw.trim()) {
        existing = JSON.parse(raw);
      }
    } catch (error) {
      throw new Error(`[LEDGER] Failed to read or parse ledger: ${error.message}`);
    }
  }
  
  if (!Array.isArray(existing.events)) {
    existing.events = [];
  }
  
  existing.events.push({
    domain,
    task,
    meta,
    timestamp: new Date().toISOString()
  });
  
  fs.writeFileSync(ledgerPath, JSON.stringify(existing, null, 2));
  return ledgerPath;
}

async function ensureSandboxTemplate(servicePath, domain) {
  if (fs.existsSync(servicePath)) return;
  const safeDomainLiteral = JSON.stringify(String(domain));
  const template = `
export async function runDomainService(taskPrompt) {
  return {
    ok: true,
    content: taskPrompt || 'Sovereign sandbox template executed',
    usage: { total_tokens: 0 },
    meta: { domain: ${safeDomainLiteral}, sandbox: true, role: 'PRIMARY' }
  };
}
`.trim();
  fs.writeFileSync(servicePath, template);
}

async function runSovereignTaskMap(domain, task) {
  const safeDomain = validateDomain(domain);
  const approvedTasks = domainTaskMap[safeDomain];
  if (!approvedTasks) {
    throw new Error(`[GOVERNANCE] Task map missing for ${safeDomain}`);
  }
  const selectedTask = task || approvedTasks[0];
  if (task && !approvedTasks.includes(task)) {
    throw new Error(`[GOVERNANCE] Task not approved for ${safeDomain}`);
  }

  const servicePath = getSafeServicePath(safeDomain);
  await ensureSandboxTemplate(servicePath, safeDomain);

  let runDomainService;
  try {
    const serviceModule = await import(pathToFileURL(servicePath).href);
    runDomainService = serviceModule?.runDomainService;
  } catch (_error) {
    // ✅ FIXED: Rename to _error to avoid "unused variable" warning
    // Import failed, will use fallback
    runDomainService = null;
  }
  
  // ✅ FIXED: Convert arrow function to explicit body for better readability
  if (typeof runDomainService !== 'function') {
    runDomainService = async (taskPrompt) => {
      return {
        ok: true,
        content: taskPrompt,
        usage: { total_tokens: 0 },
        meta: { domain: safeDomain, sandbox: true, role: 'PRIMARY', fallback: true }
      };
    };
  }

  const response = await runDomainService(selectedTask);
  recordLedger(safeDomain, selectedTask, response?.meta || {});
  return response;
}

function listAllowedDomains() {
  return [...ALLOWED_DOMAINS];
}

function validateTaskMapIntegrity() {
  const mapDomains = Object.keys(domainTaskMap);
  if (mapDomains.length !== ALLOWED_DOMAINS.length) {
    throw new Error('[GOVERNANCE] Task map domain count mismatch');
  }
  for (const domain of ALLOWED_DOMAINS) {
    const tasks = domainTaskMap[domain];
    if (!Array.isArray(tasks) || tasks.length === 0) {
      throw new Error(`[GOVERNANCE] Missing tasks for ${domain}`);
    }
    for (const t of tasks) {
      if (typeof t !== 'string' || !t.trim()) {
        throw new Error(`[GOVERNANCE] Invalid task entry for ${domain}`);
      }
    }
  }
  return true;
}

export {
  ALLOWED_DOMAINS,
  SAFE_PATHS,
  domainTaskMap,
  validateDomain,
  getSafeServicePath,
  runSovereignTaskMap,
  listAllowedDomains,
  validateTaskMapIntegrity
};
