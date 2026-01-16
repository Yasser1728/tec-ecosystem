// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFinalReport, getCostSignal, recordTransaction } from './ai-agent/core/ledger.js';
import { logger } from './lib/utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const BASE_DIR = path.dirname(__filename);

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

async function loadService(domain) {
    try {
        const servicePath = path.join(CONFIG.servicesFolder, `${domain}.js`);
        if (!fs.existsSync(servicePath)) {
            const template = [
                'import { logger } from "../../lib/utils/logger.js";',
                '',
                'export async function runDomainService(taskPrompt) {',
                "    logger.info('[SANDBOX] Running service for " + domain + "');",
                '    return { ok: true, content: taskPrompt, usage: { total_tokens: 0 }, meta: { domain: "' + domain + '", sandbox: true, role: "PRIMARY" } };',
                '}'
            ].join('\n');
            fs.writeFileSync(servicePath, template.trim());
            logger.info(`Created sandbox domain file: ${domain}.js`);
        }
        const module = await import(path.join(CONFIG.servicesFolder, `${domain}.js`));
        return module.runDomainService;
    } catch (err) {
        logger.error(`Failed to load service for ${domain}:`, { error: err.message });
        return null;
    }
}

// ============================================
// AI Agent: Organize Domain Files
// ============================================
async function organizeDomainFiles() {
    logger.info('Organizing domain files...');
    for (const domain of CONFIG.domains) {
        await loadService(domain);
    }
    logger.info('All domain files are organized.');
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
    logger.warn('No model found. AI operations will use sandbox defaults.');
    return { type: 'sandbox', name: null };
}

// ============================================
// Main Sovereign Runner
// ============================================
async function runSovereignOS() {
    logger.info("\n[Sovereign OS] Factory Booting...\n");

    await organizeDomainFiles();

    const modelInfo = selectModel();
    logger.info(`Using ${modelInfo.type} model: ${modelInfo.name || 'Sandbox'}`);

    for (const domain of CONFIG.domains) {
        logger.info(`\n[PROCESS] Domain: ${domain}`);

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
                logger.warn(`Budget threshold reached for ${domain}. Switching to reserve mode.`);
            }

            logger.info(`Domain ${domain} processed successfully.`);
            if (result?.usage) {
                logger.info(`Tokens used: ${result.usage.total_tokens || 0}`);
            }

        } catch (err) {
            logger.error(`Error in domain ${domain}:`, { error: err.message });
        }
    }

    // Final report
    const report = generateFinalReport();
    logger.info("\n[Sovereign OS] Final Operational Report:");
    logger.info(JSON.stringify(report.summary, null, 2));

    // Save full logs
    const logsPath = path.join(BASE_DIR, 'ledger_full_log.json');
    fs.writeFileSync(logsPath, JSON.stringify(report.logs, null, 2));
    logger.info(`Full ledger logs saved to ${logsPath}`);
}

// ============================================
// Execute if run directly
// ============================================
if (import.meta.url === `file://${process.argv[1]}`) {
    runSovereignOS().catch(err => {
        logger.error("\n💥 Critical failure in Sovereign OS:", { error: err });
        process.exit(1);
    });
}

// ============================================
// Exports
// ============================================
export { CONFIG, runSovereignOS, organizeDomainFiles, loadService, selectModel };
