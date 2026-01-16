// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// Main orchestrator for AI agent operations
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFinalReport, getCostSignal, recordTransaction, resetLedger } from './ai-agent/core/ledger.js';
import { isSandboxMode } from './ai-agent/core/config.js';
import { domainTaskMap, getTaskConfig, getAllDomains, getDomainsByPriority } from './ai-agent/domain-task-map.js';

const __filename = fileURLToPath(import.meta.url);
const BASE_DIR = path.dirname(__filename);

// ============================================
// Configuration
// ============================================
const CONFIG = {
    servicesFolder: path.join(BASE_DIR, 'ai-agent', 'services'),
    sandbox: isSandboxMode(),
    maxRetries: 2,
    retryDelayMs: 1000,
    domains: getAllDomains(),
    domainGroups: {
        core: ['tec.pi', 'finance.pi', 'wallet.pi', 'commerce.pi', 'market.pi'],
        analytics: ['analytics.pi', 'tokens.pi', 'nft.pi', 'exchange.pi'],
        management: ['crm.pi', 'payments.pi', 'governance.pi', 'legal.pi', 'audit.pi'],
        security: ['security.pi', 'insurance.pi', 'tax.pi'],
        operations: ['staking.pi', 'research.pi', 'marketing.pi', 'support.pi', 'hr.pi'],
        infrastructure: ['devops.pi', 'infra.pi']
    }
};

// ============================================
// Helpers
// ============================================

/**
 * Sleep helper for delays
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Load a domain service dynamically
 * @param {string} domain - Domain name
 * @returns {Promise<Function|null>} Service run function or null
 */
async function loadService(domain) {
    try {
        const servicePath = path.join(CONFIG.servicesFolder, `${domain}.js`);
        
        // Create sandbox service file if it doesn't exist
        if (!fs.existsSync(servicePath)) {
            const template = `import { createService } from './baseService.js';

let runDomainService;

try {
  const { run } = createService({
    domain: '${domain}',
    purpose: 'Sovereign operation for ${domain}'
  });
  runDomainService = run;
} catch (error) {
  console.error('Failed to initialize service for ${domain}:', error.message);
  runDomainService = async () => ({ 
    ok: false, 
    error: error.message, 
    usage: { total_tokens: 0 }, 
    meta: { domain: '${domain}', sandbox: true } 
  });
}

export { runDomainService };
`;
            fs.writeFileSync(servicePath, template);
            console.log(`Created service module: ${domain}.js`);
        }
        
        const module = await import(servicePath);
        return module.runDomainService || module.run || module.default?.run;
    } catch (err) {
        console.error(`Failed to load service for ${domain}:`, err.message);
        return null;
    }
}

/**
 * Run a service with retry logic
 * @param {string} domain - Domain name
 * @param {Function} runService - Service run function
 * @param {string} taskPrompt - Task prompt
 * @returns {Promise<Object>} Service result
 */
async function runWithRetry(domain, runService, taskPrompt) {
    for (let attempt = 1; attempt <= CONFIG.maxRetries + 1; attempt++) {
        try {
            const result = await runService(taskPrompt);
            
            if (result?.ok) {
                return result;
            }
            
            // If not ok but no exception, still count as attempt
            if (attempt <= CONFIG.maxRetries) {
                console.warn(`[ORCHESTRATOR] Attempt ${attempt} returned error for ${domain}: ${result?.error}`);
                await sleep(CONFIG.retryDelayMs * attempt);
            } else {
                return result; // Return the error result on final attempt
            }
        } catch (err) {
            console.warn(`[ORCHESTRATOR] Attempt ${attempt} failed for ${domain}: ${err.message}`);
            
            if (attempt > CONFIG.maxRetries) {
                return {
                    ok: false,
                    error: err.message,
                    meta: { domain, attempts: attempt }
                };
            }
            
            await sleep(CONFIG.retryDelayMs * attempt);
        }
    }
}

// ============================================
// AI Agent: Organize Domain Files
// ============================================
async function organizeDomainFiles() {
    console.log('[ORCHESTRATOR] Organizing domain files...');
    
    for (const domain of CONFIG.domains) {
        await loadService(domain);
    }
    
    console.log(`[ORCHESTRATOR] All ${CONFIG.domains.length} domain files organized.`);
}

// ============================================
// Main Sovereign Runner
// ============================================

/**
 * Run the Sovereign OS for specified domains or groups
 * @param {Object} options - Run options
 * @param {string} [options.group] - Domain group to run
 * @param {string[]} [options.domains] - Specific domains to run
 * @param {number} [options.priority] - Only run domains with this priority or higher
 * @param {boolean} [options.skipOrganize] - Skip file organization
 */
async function runSovereignOS(options = {}) {
    const startTime = Date.now();
    console.log("\n" + "=".repeat(50));
    console.log("[Sovereign OS] Factory Booting...");
    console.log(`Mode: ${CONFIG.sandbox ? 'SANDBOX' : 'PRODUCTION'}`);
    console.log("=".repeat(50) + "\n");

    // Reset ledger for fresh session
    resetLedger();

    // Organize domain files if not skipped
    if (!options.skipOrganize) {
        await organizeDomainFiles();
    }

    // Determine which domains to run
    let domainsToRun = CONFIG.domains;
    
    if (options.domains && options.domains.length > 0) {
        domainsToRun = options.domains;
    } else if (options.group && CONFIG.domainGroups[options.group]) {
        domainsToRun = CONFIG.domainGroups[options.group];
        console.log(`[ORCHESTRATOR] Running group: ${options.group}`);
    } else if (options.priority) {
        domainsToRun = getDomainsByPriority(options.priority);
        console.log(`[ORCHESTRATOR] Running priority <= ${options.priority} domains`);
    }

    console.log(`[ORCHESTRATOR] Processing ${domainsToRun.length} domains\n`);

    const results = {
        success: [],
        failed: [],
        skipped: []
    };

    for (const domain of domainsToRun) {
        console.log(`\n[PROCESS] Domain: ${domain}`);
        console.log("-".repeat(40));

        // Load domain service dynamically
        const runService = await loadService(domain);
        if (!runService) {
            console.warn(`[SKIP] No service found for ${domain}`);
            results.skipped.push(domain);
            continue;
        }

        // Get task configuration for this domain
        const taskConfig = getTaskConfig(domain);
        
        // Prepare task prompt
        const taskPrompt = `Generate a scalable, secure, production-ready operation for ${domain}.
${taskConfig?.description || ''}

Requirements:
- Follow best practices for ${domain.replace('.pi', '')} domain
- Ensure security and data integrity
- Provide structured, actionable output`;

        try {
            const result = await runWithRetry(domain, runService, taskPrompt);

            if (result?.ok) {
                results.success.push({
                    domain,
                    tokens: result.usage?.total_tokens || 0,
                    duration: result.meta?.duration
                });
                
                console.log(`✅ Domain ${domain} processed successfully`);
                if (result?.usage) {
                    console.log(`   Tokens used: ${result.usage.total_tokens || 0}`);
                }
            } else {
                results.failed.push({
                    domain,
                    error: result?.error || 'Unknown error'
                });
                console.error(`❌ Domain ${domain} failed: ${result?.error}`);
            }

            // Budget control check
            const costSignal = getCostSignal();
            if (costSignal.isLowBalance) {
                console.warn(`\n⚠️ Low balance warning: ${costSignal.remainingBalance.toFixed(2)} remaining`);
            }

        } catch (err) {
            results.failed.push({
                domain,
                error: err.message
            });
            console.error(`❌ Error in domain ${domain}:`, err.message);
        }
    }

    // Generate and save final report
    const report = generateFinalReport();
    const duration = Date.now() - startTime;
    
    console.log("\n" + "=".repeat(50));
    console.log("[Sovereign OS] Execution Complete");
    console.log("=".repeat(50));
    console.log("\nSummary:");
    console.log(`  ✅ Successful: ${results.success.length}`);
    console.log(`  ❌ Failed: ${results.failed.length}`);
    console.log(`  ⏭️ Skipped: ${results.skipped.length}`);
    console.log(`  ⏱️ Duration: ${duration}ms`);
    console.log(`  🪙 Total Cost: ${report.summary.totalCost.toFixed(4)}`);
    console.log(`  📊 Total Tokens: ${report.summary.totalTokens}`);

    // Save full logs
    const logsPath = path.join(BASE_DIR, 'ledger_full_log.json');
    fs.writeFileSync(logsPath, JSON.stringify({
        report,
        results,
        executedAt: new Date().toISOString(),
        duration
    }, null, 2));
    console.log(`\n📁 Full logs saved to: ${logsPath}`);

    return {
        report,
        results,
        duration
    };
}

// ============================================
// Execute if run directly
// ============================================
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    const options = {};
    
    // Parse command line arguments
    if (args.length > 0) {
        if (args[0].startsWith('--group=')) {
            options.group = args[0].split('=')[1];
        } else if (args[0].startsWith('--priority=')) {
            options.priority = parseInt(args[0].split('=')[1], 10);
        } else if (args[0].startsWith('--domain=')) {
            options.domains = args[0].split('=')[1].split(',');
        } else {
            // Assume it's a group name for backward compatibility
            options.group = args[0];
        }
    }
    
    runSovereignOS(options).catch(err => {
        console.error("\n💥 Critical failure in Sovereign OS:", err);
        process.exit(1);
    });
}

// ============================================
// Exports
// ============================================
export { 
    CONFIG, 
    runSovereignOS, 
    organizeDomainFiles, 
    loadService,
    runWithRetry
};
