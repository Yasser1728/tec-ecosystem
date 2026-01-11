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
    },
    // Cost control limits
    limits: {
        maxCostPerRun: parseFloat(process.env.MAX_COST_PER_RUN || '50.0'), // Max cost per execution
        maxCostPerDomain: parseFloat(process.env.MAX_COST_PER_DOMAIN || '5.0'), // Max cost per domain
        maxTokensPerDomain: parseInt(process.env.MAX_TOKENS_PER_DOMAIN || '100000', 10), // Max tokens per domain
        enableCostGuards: process.env.ENABLE_COST_GUARDS !== 'false' // Enable by default
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
// Select Model (Paid if available, else Free)
// ============================================
function selectModel() {
    // Validate model configuration
    const selectedModel = { type: 'sandbox', name: null, cost: 0 };
    
    // Check paid models first
    for (const [key, model] of Object.entries(CONFIG.models.paid)) {
        if (model) {
            selectedModel.type = 'paid';
            selectedModel.name = model;
            selectedModel.cost = 1.0; // Estimated cost per call
            return selectedModel;
        }
    }
    
    // Fallback to free models
    for (const [key, model] of Object.entries(CONFIG.models.free)) {
        if (model) {
            selectedModel.type = 'free';
            selectedModel.name = model;
            selectedModel.cost = 0;
            return selectedModel;
        }
    }
    
    console.warn('No model found. AI operations will use sandbox defaults.');
    return selectedModel;
}

// ============================================
// Cost Guard: Check if domain can proceed
// ============================================
function canProceedWithCost(domain, estimatedCost, totalCostSoFar) {
    if (!CONFIG.limits.enableCostGuards) {
        return { allowed: true };
    }
    
    // Check total cost limit
    if (totalCostSoFar + estimatedCost > CONFIG.limits.maxCostPerRun) {
        return {
            allowed: false,
            reason: `Total run cost would exceed limit: ${CONFIG.limits.maxCostPerRun}`
        };
    }
    
    // Check per-domain cost limit
    if (estimatedCost > CONFIG.limits.maxCostPerDomain) {
        return {
            allowed: false,
            reason: `Domain cost would exceed limit: ${CONFIG.limits.maxCostPerDomain}`
        };
    }
    
    return { allowed: true };
}

// ============================================
// Main Sovereign Runner
// ============================================
async function runSovereignOS() {
    console.log("\n[Sovereign OS] Factory Booting...\n");

    await organizeDomainFiles();

    const modelInfo = selectModel();
    console.log(`Using ${modelInfo.type} model: ${modelInfo.name || 'Sandbox'}`);
    
    let totalCost = 0;

    for (const domain of CONFIG.domains) {
        console.log(`\n[PROCESS] Domain: ${domain}`);

        // Cost guard check
        const costCheck = canProceedWithCost(domain, modelInfo.cost, totalCost);
        if (!costCheck.allowed) {
            console.warn(`⚠️ Skipping ${domain}: ${costCheck.reason}`);
            continue;
        }

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
                
                // Track actual cost
                totalCost += (modelDetails.costPerCall || 0);
            }

            // Budget control
            const costSignal = getCostSignal();
            if (costSignal.isLowBalance) {
                console.warn(`Budget threshold reached for ${domain}. Switching to reserve mode.`);
            }
            
            // Additional cost guard during execution
            if (CONFIG.limits.enableCostGuards && totalCost >= CONFIG.limits.maxCostPerRun) {
                console.warn(`⚠️ Maximum run cost reached (${CONFIG.limits.maxCostPerRun}). Stopping execution.`);
                break;
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
    console.log(`Total estimated cost: $${totalCost.toFixed(2)}`);

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
        process.exit(1);
    });
}

// ============================================
// Exports
// ============================================
export { CONFIG, runSovereignOS, organizeDomainFiles, loadService, selectModel, canProceedWithCost };
