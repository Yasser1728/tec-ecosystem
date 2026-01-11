// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFinalReport, getCostSignal, recordTransaction } from './ai-agent/core/ledger.js';
import { councilDecision, TASK_TYPES } from './ai-agent/core/council.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Cost Guard Configuration
// ============================================
const COST_GUARD = {
    // Per-request cost ceiling
    MAX_COST_PER_REQUEST: parseFloat(process.env.MAX_COST_PER_REQUEST || '2.0'),
    
    // Per-minute cost ceiling per user
    MAX_COST_PER_MINUTE: parseFloat(process.env.MAX_COST_PER_MINUTE || '10.0'),
    
    // Cost tracking by user
    userCosts: new Map(),
    
    // Cleanup interval (60 seconds)
    cleanupInterval: null,
};

/**
 * Estimate cost by model name
 */
function estimateRequestCost(modelName) {
    if (!modelName) return 0;
    
    const modelLower = modelName.toLowerCase();
    
    // Paid models
    if (modelLower.includes('gpt-5') || modelLower.includes('gpt-4')) return 1.5;
    if (modelLower.includes('claude')) return 1.2;
    if (modelLower.includes('gemini') && modelLower.includes('pro')) return 1.8;
    if (modelLower.includes('codex')) return 1.4;
    
    // Fast ops (low cost)
    if (modelLower.includes('o4-mini')) return 0.2;
    if (modelLower.includes('flash')) return 0.0;
    
    // Free models
    return 0.0;
}

/**
 * Check if user/request is within cost limits
 */
function checkCostGuard(userId, modelName) {
    const requestCost = estimateRequestCost(modelName);
    
    // Check per-request ceiling
    if (requestCost > COST_GUARD.MAX_COST_PER_REQUEST) {
        return {
            allowed: false,
            reason: 'Per-request cost ceiling exceeded',
            requestCost,
            maxCost: COST_GUARD.MAX_COST_PER_REQUEST,
        };
    }
    
    // Check per-minute ceiling
    const now = Date.now();
    const userKey = userId || 'system';
    const userCostData = COST_GUARD.userCosts.get(userKey) || {
        totalCost: 0,
        windowStart: now,
        requests: [],
    };
    
    // Remove requests older than 1 minute
    userCostData.requests = userCostData.requests.filter(
        req => now - req.timestamp < 60000
    );
    
    // Calculate current minute cost
    const currentMinuteCost = userCostData.requests.reduce(
        (sum, req) => sum + req.cost, 0
    );
    
    if (currentMinuteCost + requestCost > COST_GUARD.MAX_COST_PER_MINUTE) {
        return {
            allowed: false,
            reason: 'Per-minute cost ceiling exceeded',
            currentCost: currentMinuteCost,
            requestCost,
            maxCost: COST_GUARD.MAX_COST_PER_MINUTE,
        };
    }
    
    // Update user cost data
    userCostData.requests.push({
        timestamp: now,
        cost: requestCost,
    });
    userCostData.totalCost += requestCost;
    
    COST_GUARD.userCosts.set(userKey, userCostData);
    
    return {
        allowed: true,
        requestCost,
        remainingBudget: COST_GUARD.MAX_COST_PER_MINUTE - (currentMinuteCost + requestCost),
    };
}

/**
 * Cleanup old cost tracking data
 */
function cleanupCostGuard() {
    const now = Date.now();
    for (const [userId, data] of COST_GUARD.userCosts.entries()) {
        data.requests = data.requests.filter(
            req => now - req.timestamp < 60000
        );
        
        if (data.requests.length === 0) {
            COST_GUARD.userCosts.delete(userId);
        }
    }
}

// Start cleanup interval
COST_GUARD.cleanupInterval = setInterval(cleanupCostGuard, 60000);

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
// Select Model (Paid if available, else Free, with Cost Guard integration)
// ============================================
function selectModel(options = {}) {
    const costSignal = getCostSignal();
    const userId = options.userId || 'system';
    
    // If budget is low, skip paid models
    if (costSignal.isLowBalance) {
        console.log('[Model Selection] Low balance detected, using free models');
        for (const [key, model] of Object.entries(CONFIG.models.free)) {
            if (model) return { type: 'free', name: model, tier: 'free' };
        }
    }
    
    // Try paid models first
    for (const [key, model] of Object.entries(CONFIG.models.paid)) {
        if (model) {
            // Check cost guard
            const costCheck = checkCostGuard(userId, model);
            if (costCheck.allowed) {
                return { type: 'paid', name: model, tier: 'paid', costCheck };
            }
            console.log(`[Model Selection] Cost guard blocked paid model: ${costCheck.reason}`);
        }
    }
    
    // Fallback to free models
    for (const [key, model] of Object.entries(CONFIG.models.free)) {
        if (model) return { type: 'free', name: model, tier: 'free' };
    }
    
    console.warn('[Model Selection] No model found. AI operations will use sandbox defaults.');
    return { type: 'sandbox', name: null, tier: 'sandbox' };
}

/**
 * Run Domain Task Utility
 * Wraps model selection, cost guard, and service invocation
 * 
 * @param {Object} options
 * @param {string} options.domain - Domain to run task for
 * @param {string} options.taskPrompt - Task prompt/description
 * @param {string} options.userId - User identifier for cost tracking
 * @param {string} options.taskType - Task type (from TASK_TYPES)
 * @returns {Promise} Task result with metadata
 */
async function runDomainTask(options) {
    const { domain, taskPrompt, userId = 'system', taskType = TASK_TYPES.OPERATION } = options;
    
    if (!domain) {
        throw new Error('[runDomainTask] Domain is required');
    }
    
    console.log(`\n[DOMAIN TASK] Starting: ${domain}`);
    
    // Get model with cost guard
    const modelInfo = selectModel({ userId });
    
    if (!modelInfo.name && modelInfo.type !== 'sandbox') {
        console.error(`[DOMAIN TASK] No model available for ${domain}`);
        return {
            ok: false,
            error: 'No model available',
            domain,
            usage: { total_tokens: 0 },
        };
    }
    
    // Check cost guard one more time before execution
    if (modelInfo.type === 'paid') {
        const costCheck = checkCostGuard(userId, modelInfo.name);
        if (!costCheck.allowed) {
            console.log(`[DOMAIN TASK] Cost guard prevented execution: ${costCheck.reason}`);
            return {
                ok: false,
                error: 'Cost limit exceeded',
                reason: costCheck.reason,
                domain,
                usage: { total_tokens: 0 },
            };
        }
    }
    
    console.log(`[DOMAIN TASK] Using ${modelInfo.type} model: ${modelInfo.name || 'Sandbox'}`);
    
    // Load and run service
    const runService = await loadService(domain);
    if (!runService) {
        return {
            ok: false,
            error: 'Failed to load service',
            domain,
            usage: { total_tokens: 0 },
        };
    }
    
    try {
        const result = await runService(taskPrompt);
        
        // Log cost info if available
        if (modelInfo.costCheck) {
            console.log(`[DOMAIN TASK] Cost: ${modelInfo.costCheck.requestCost}, Remaining: ${modelInfo.costCheck.remainingBudget}`);
        }
        
        return {
            ...result,
            domain,
            modelInfo,
        };
    } catch (err) {
        console.error(`[DOMAIN TASK] Error in ${domain}:`, err.message);
        return {
            ok: false,
            error: err.message,
            domain,
            usage: { total_tokens: 0 },
        };
    }
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
            }

            // Budget control
            if (getCostSignal().isLowBalance) {
                console.warn(`Budget threshold reached for ${domain}. Switching to reserve mode.`);
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

    // Save full logs
    const logsPath = path.join(__dirname, 'ledger_full_log.json');
    fs.writeFileSync(logsPath, JSON.stringify(report.logs, null, 2));
    console.log(`Full ledger logs saved to ${logsPath}`);
}

// ============================================
// Execute if run directly
// ============================================
if (import.meta.url === `file://${process.argv[1]}`) {
    runSovereignOS().catch(err => {
        console.error("\n💥 Critical failure in Sovereign OS:", err);
        // Clear cost guard interval before exit
        if (COST_GUARD.cleanupInterval) {
            clearInterval(COST_GUARD.cleanupInterval);
        }
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
    selectModel, 
    runDomainTask,
    checkCostGuard,
    estimateRequestCost,
};
