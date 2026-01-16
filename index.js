// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFinalReport, getCostSignal, recordTransaction } from './ai-agent/core/ledger.js';

const __filename = fileURLToPath(import.meta.url);
const BASE_DIR = path.dirname(__filename);

// Static log file path (safe from user input manipulation)
const LEDGER_LOG_PATH = path.join(BASE_DIR, 'ledger_full_log.json');

// ============================================
// Configuration
// ============================================
const CONFIG = {
    servicesFolder: path.join(BASE_DIR, 'ai-agent', 'services'),
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

/**
 * Validate domain name to prevent code injection
 * Only allows alphanumeric characters, dots, and hyphens matching format: name.pi
 * @param {string} domain - Domain name to validate
 * @returns {boolean} True if domain is valid
 */
function isValidDomain(domain) {
    const domainPattern = /^[a-z][a-z0-9-]*\.pi$/;
    return typeof domain === 'string' && domainPattern.test(domain);
}

/**
 * Safely resolve a path within a base directory
 * Prevents path traversal attacks by ensuring resolved path stays within baseDir
 * @param {string} baseDir - Base directory (must be a trusted static path)
 * @param {string} filename - Filename to resolve (may contain user input)
 * @returns {string|null} Safe path or null if traversal detected
 */
function safePathResolve(baseDir, filename) {
    // Resolve both paths to absolute form for comparison
    const resolvedBase = path.resolve(baseDir);
    const resolvedPath = path.resolve(baseDir, filename);
    
    // Ensure the resolved path is within the base directory
    if (!resolvedPath.startsWith(resolvedBase + path.sep)) {
        return null;
    }
    return resolvedPath;
}

async function loadService(domain) {
    // Validate domain name to prevent injection attacks
    if (!isValidDomain(domain)) {
        console.error(`[SECURITY] Invalid domain name rejected: ${domain}`);
        return null;
    }

    try {
        // Use safe path resolution to prevent path traversal
        const servicePath = safePathResolve(CONFIG.servicesFolder, `${domain}.js`);
        if (!servicePath) {
            console.error(`[SECURITY] Path traversal detected for domain: ${domain}`);
            return null;
        }
        
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
        const module = await import(servicePath);
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
    for (const [key, model] of Object.entries(CONFIG.models.paid)) {
        if (model) return { type: 'paid', name: model };
    }
    // fallback to free models
    for (const [key, model] of Object.entries(CONFIG.models.free)) {
        if (model) return { type: 'free', name: model };
    }
    console.warn('No model found. AI operations will use sandbox defaults.');
    return { type: 'sandbox', name: null };
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

    // Save full logs to static path (no user input)
    fs.writeFileSync(LEDGER_LOG_PATH, JSON.stringify(report.logs, null, 2));
    console.log(`Full ledger logs saved to ${LEDGER_LOG_PATH}`);
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
export { CONFIG, runSovereignOS, organizeDomainFiles, loadService, selectModel, isValidDomain, safePathResolve };
