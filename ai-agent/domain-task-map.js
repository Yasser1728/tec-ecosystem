// ============================================
// Sovereign Task Map - Option C Orchestrator
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { councilDecision, TASK_TYPES } from './core/council.js';
import { executeModel } from './core/openrouter.js';
import { recordTransaction, generateFinalReport, getCostSignal } from './core/ledger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Safe Path Protections
// ============================================

/**
 * Allowlist for safe directories
 */
const SAFE_DIRECTORIES = [
  path.join(__dirname, 'services'),
  path.join(__dirname, '..'), // root for ledger output
];

/**
 * Check if path is within allowed directories
 */
function isSafePath(filePath) {
  const normalized = path.normalize(filePath);
  return SAFE_DIRECTORIES.some(dir => normalized.startsWith(path.normalize(dir)));
}

/**
 * Ensure directory exists (with safety check)
 */
function ensureSafeDirectory(dirPath) {
  if (!isSafePath(dirPath)) {
    throw new Error(`[SECURITY] Attempted to access unsafe directory: ${dirPath}`);
  }
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ============================================
// Domain Service Loader
// ============================================

async function loadDomainService(domain, servicesFolder) {
  try {
    const servicePath = path.join(servicesFolder, `${domain}.js`);
    
    // Security check
    if (!isSafePath(servicePath)) {
      throw new Error(`[SECURITY] Service path not in allowlist: ${servicePath}`);
    }
    
    if (!fs.existsSync(servicePath)) {
      // Create sandbox service file
      const template = `
// Auto-generated sandbox service for ${domain}
export async function runDomainService(domain, prompt) {
    console.log('🟢 Running sandbox service for', domain);
    return { success: true, domain, prompt };
}`;
      fs.writeFileSync(servicePath, template.trim());
      console.log(`✅ Created sandbox domain file: ${domain}.js`);
    }
    
    const module = await import(servicePath);
    return module.runDomainService || module.run;
  } catch (err) {
    console.error(`❌ Failed to load service for ${domain}:`, err.message);
    return null;
  }
}

// ============================================
// Main Orchestrator: runSovereignTaskMap
// ============================================

/**
 * Option C Orchestrator Runner
 * Orchestrates domain tasks using core module APIs
 */
export async function runSovereignTaskMap(config = {}) {
  console.log("\n🚀 Sovereign Task Map - Option C Orchestrator Starting...\n");

  // Configuration with defaults
  const CONFIG = {
    servicesFolder: config.servicesFolder || path.join(__dirname, 'services'),
    sandbox: config.sandbox !== false, // default true
    domains: config.domains || [
      'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
      'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
      'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
      'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
    ]
  };

  // Ensure services directory exists safely
  try {
    ensureSafeDirectory(CONFIG.servicesFolder);
  } catch (err) {
    console.error('❌ Failed to ensure services directory:', err.message);
    throw err;
  }

  // Process each domain
  for (const domain of CONFIG.domains) {
    console.log(`\n🏗️ Processing domain: ${domain}`);

    try {
      // 1️⃣ Council Decision
      const decision = councilDecision({
        taskType: TASK_TYPES.DEVELOPMENT,
        domain,
        requiresAudit: true
      });

      if (!decision || !decision.primary) {
        console.warn(`⚠️ No valid model decision for ${domain}`);
        continue;
      }

      // 2️⃣ Load domain service
      const runService = await loadDomainService(domain, CONFIG.servicesFolder);
      if (!runService) {
        console.warn(`⚠️ Could not load service for ${domain}`);
        continue;
      }

      // 3️⃣ Prepare task prompt
      const taskPrompt = `Generate a scalable, secure, production-ready module for ${domain}`;

      // 4️⃣ Execute the model
      const result = await executeModel({
        model: decision.primary,
        messages: [{ role: 'user', content: taskPrompt }],
        temperature: 0.2,
        domain,
        role: 'primary'
      });

      if (!result.ok) {
        console.error(`❌ Model execution failed for ${domain}:`, result.error);
        continue;
      }

      // 5️⃣ Record transaction in ledger
      recordTransaction({
        model: decision.primary,
        usage: result.usage,
        domain,
        role: 'primary'
      });

      // 6️⃣ Budget control
      const costSignal = getCostSignal();
      if (costSignal.isLowBalance) {
        console.warn(`⚠️ Low balance detected. Remaining: ${costSignal.remainingBalance}`);
      }

      console.log(`✅ Domain ${domain} processed successfully.`);

    } catch (err) {
      // Per-domain error handling
      console.error(`💥 Error processing domain ${domain}:`, err.message);
      // Continue with next domain instead of failing entire run
    }
  }

  // 7️⃣ Generate final report
  const report = generateFinalReport();
  console.log("\n📊 Sovereign Task Map - Final Report:");
  console.log(JSON.stringify(report.summary, null, 2));

  // 8️⃣ Save ledger logs directly (no tmp file)
  // Use fixed guarded path for artifact log
  const ledgerPath = path.join(__dirname, '..', 'ledger_full_log.json');
  
  // Security check before writing
  if (!isSafePath(ledgerPath)) {
    throw new Error(`[SECURITY] Ledger path not in allowlist: ${ledgerPath}`);
  }

  try {
    // Write directly to final location (no tmp+rename pattern)
    fs.writeFileSync(ledgerPath, JSON.stringify(report.logs, null, 2), 'utf8');
    console.log(`📁 Full ledger logs saved to ${ledgerPath}`);
  } catch (err) {
    console.error('❌ Failed to save ledger logs:', err.message);
    throw err;
  }

  return report;
}

// ============================================
// Domain task map for reference
// ============================================
export const domainTaskMap = {
  // Task map can be extended as needed for specific domain configurations
}
