// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFinalReport, getCostSignal, recordTransaction } from './ai-agent/core/ledger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Configuration
// ============================================
const CONFIG = {
    servicesFolder: path.join(__dirname, 'ai-agent', 'services'),
    sandbox: true, // new domain files are created in sandbox mode
    domains: [
        'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
        'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
        'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
        'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
    ],
    models: {
        paid: {
            gpt: process.env.GPT_MODEL,
            claude: process.env.CLAUDE_MODEL,
            gemini: process.env.GEMINI_MODEL,
            codex: process.env.CODEX_MODEL
        },
        free: {
            deepseek: process.env.DEEPSEEK_MODEL,
            llama: process.env.LLAMA_MODEL,
            qwen: process.env.QWEN_MODEL,
            hermes: process.env.HERMES_MODEL,
            gpt_oss: process.env.GPT_OSS_FREE,
            gemini_flash: process.env.GEMINI_FLASH_FREE,
            o4: process.env.O4_ENGINEER_MODEL,
            devstral: process.env.DEVSTRAL_MODEL
        }
    }
};

// ============================================
// Helpers
// ============================================

async function loadService(domain) {
    try {
        const servicePath = path.join(CONFIG.servicesFolder, `${domain}.js`);
        if (!fs.existsSync(servicePath)) {
            const template = [
                'export async function runDomainService(taskPrompt) {',
                "    console.log('[SANDBOX] Running service for " + domain + "');",
                '    return { ok: true, content: taskPrompt, usage: { total_tokens: 0 }, meta: { domain: "' + domain + '", sandbox: true, role: "PRIMARY" } };',
                '}'
            ].join('\n');
            fs.writeFileSync(servicePath, template.trim());
            console.log(`Created sandbox domain file: ${domain}.js`);
        }
        const module = await import(path.join(CONFIG.servicesFolder, `${domain}.js`));
        return module.runDomainService;
    } catch (err) {
        console.error(`Failed to load service for ${domain}:`, err.message);
        return null;
    }
}

// ============================================
// AI Agent: Organize Domain Files
// ============================================
async function organizeDomainFiles() {
    console.log('Organizing domain files...');
    for (const domain of CONFIG.domains) {
        await loadService(domain);
    }
    console.log('All domain files are organized.');
}

// ============================================
// Cost Guard: Track per-user costs
// ============================================
const userCostTracker = new Map();
const COST_THRESHOLDS = {
    perUser: {
        warning: 10,  // Warn at $10
        limit: 50,    // Hard limit at $50
    },
    global: {
        warning: 100,
        limit: 500,
    }
};

function trackUserCost(userId, cost) {
    const current = userCostTracker.get(userId) || 0;
    const updated = current + cost;
    userCostTracker.set(userId, updated);
    
    if (updated > COST_THRESHOLDS.perUser.limit) {
        console.error(`[COST GUARD] User ${userId} exceeded cost limit: $${updated.toFixed(2)}`);
        throw new Error(`Cost limit exceeded for user ${userId}`);
    } else if (updated > COST_THRESHOLDS.perUser.warning) {
        console.warn(`[COST GUARD] User ${userId} approaching cost limit: $${updated.toFixed(2)}`);
    }
    
    return updated;
}

function getCostReport() {
    const report = {
        users: Array.from(userCostTracker.entries()).map(([userId, cost]) => ({
            userId,
            cost: cost.toFixed(2),
            status: cost > COST_THRESHOLDS.perUser.limit ? 'EXCEEDED' :
                    cost > COST_THRESHOLDS.perUser.warning ? 'WARNING' : 'OK'
        })),
        total: Array.from(userCostTracker.values()).reduce((sum, cost) => sum + cost, 0)
    };
    return report;
}

// ============================================
// Select Model (Paid if available, else Free)
// Enhanced with fallback mechanisms
// ============================================
function selectModel(options = {}) {
    const { forceType = null, requiresComplex = false } = options;
    
    // If forcing a specific type
    if (forceType === 'free') {
        for (const [key, model] of Object.entries(CONFIG.models.free)) {
            if (model) {
                console.log(`[MODEL SELECT] Forced free model: ${model}`);
                return { type: 'free', name: model, key };
            }
        }
    }
    
    // Prefer paid models for complex tasks or by default
    if (requiresComplex || forceType === 'paid') {
        for (const [key, model] of Object.entries(CONFIG.models.paid)) {
            if (model) {
                console.log(`[MODEL SELECT] Selected paid model: ${model}`);
                return { type: 'paid', name: model, key };
            }
        }
    }
    
    // Smart fallback: try paid first, then free
    for (const [key, model] of Object.entries(CONFIG.models.paid)) {
        if (model) {
            console.log(`[MODEL SELECT] Using paid model: ${model}`);
            return { type: 'paid', name: model, key };
        }
    }
    
    // Fallback to free models
    for (const [key, model] of Object.entries(CONFIG.models.free)) {
        if (model) {
            console.log(`[MODEL SELECT] Fallback to free model: ${model}`);
            return { type: 'free', name: model, key };
        }
    }
    
    console.warn('[MODEL SELECT] No model found. AI operations will use sandbox defaults.');
    return { type: 'sandbox', name: null, key: 'sandbox' };
}

// ============================================
// Main Sovereign Runner
// ============================================
async function runSovereignOS() {
    console.log("\n[Sovereign OS] Factory Booting...\n");

    await organizeDomainFiles();

    const modelInfo = selectModel();
    console.log(`Using ${modelInfo.type} model: ${modelInfo.name || 'Sandbox'}`);

    for (const domain of CONFIG.domains) {
        console.log(`\n[PROCESS] Domain: ${domain}`);

        // Load domain service dynamically
        const runService = await loadService(domain);
        if (!runService) continue;

        // Prepare task prompt
        const taskPrompt = `Generate a scalable, secure, production-ready module for ${domain} using model: ${modelInfo.name}`;

        try {
            const result = await runService(taskPrompt);

            if (result?.usage && !result?.meta?.recorded) {
                const modelDetails =
                    result.meta?.modelConfig ||
                    (result.meta?.model
                        ? { name: result.meta.model, costPerCall: 0, tier: result.meta.tier }
                        : { name: 'sandbox', costPerCall: 0, tier: 'sandbox' });

                recordTransaction({
                    model: modelDetails,
                    usage: result.usage,
                    domain,
                    role: result.meta?.role || 'PRIMARY'
                });
                
                // Track cost per domain (using domain as userId for simplicity)
                const estimatedCost = (result.usage.total_tokens || 0) * 0.00001; // Rough estimate
                try {
                    trackUserCost(domain, estimatedCost);
                } catch (costError) {
                    console.error(`[COST GUARD] ${costError.message}`);
                    break; // Stop processing if cost limit exceeded
                }
            }

            // Budget control
            const costSignal = getCostSignal();
            if (costSignal.isLowBalance) {
                console.warn(`Budget threshold reached for ${domain}. Switching to reserve mode.`);
                // Could switch to free models here if needed
            }

            console.log(`Domain ${domain} processed successfully.`);
            if (result?.usage) {
                console.log(`Tokens used: ${result.usage.total_tokens || 0}`);
            }

        } catch (err) {
            console.error(`Error in domain ${domain}:`, err.message);
        }
    }

    // Final report
    const report = generateFinalReport();
    console.log("\n[Sovereign OS] Final Operational Report:");
    console.log(JSON.stringify(report.summary, null, 2));
    
    // Cost report
    const costReport = getCostReport();
    console.log("\n[Cost Analysis]:");
    console.log(`Total estimated cost: $${costReport.total.toFixed(2)}`);
    console.log(`Users tracked: ${costReport.users.length}`);
    costReport.users.forEach(user => {
        console.log(`  - ${user.userId}: $${user.cost} [${user.status}]`);
    });

    // Save full logs
    const logsPath = path.join(__dirname, 'ledger_full_log.json');
    const fullReport = {
        ...report,
        costAnalysis: costReport,
        timestamp: new Date().toISOString()
    };
    fs.writeFileSync(logsPath, JSON.stringify(fullReport, null, 2));
    console.log(`Full ledger logs saved to ${logsPath}`);
}

// ============================================
// Execute if run directly
// ============================================
if (import.meta.url === `file://${process.argv[1]}`) {
    runSovereignOS().catch(err => {
        console.error("\n💥 Critical failure in Sovereign OS:", err);
        process.exit(1);
    });
}

// ============================================
// Exports
// ============================================
export { CONFIG, runSovereignOS, organizeDomainFiles, loadService, selectModel, trackUserCost, getCostReport };
