// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { councilDecision, TASK_TYPES } from './ai-agent/core/council.js';
import { executeModel } from './ai-agent/core/openrouter.js';
import { recordTransaction, generateFinalReport, getCostSignal } from './ai-agent/core/ledger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Security: Path Traversal Protection
// ============================================
// Define explicit filesystem boundaries to prevent path traversal attacks
// Codacy Security: These constants establish the canonical base directories
const PROJECT_ROOT = path.resolve(__dirname);
const DOMAINS_BASE = path.resolve(PROJECT_ROOT, 'domains');
const AI_AGENT_SERVICES_BASE = path.resolve(PROJECT_ROOT, 'ai-agent', 'services');
const LEDGER_PATH = path.resolve(PROJECT_ROOT, 'ledger_full_log.json');

/**
 * Security Guard: Resolve and validate paths to prevent directory traversal
 * This function ensures all file operations stay within approved base directories
 * @param {string} baseDir - The approved base directory (must end with path.sep internally)
 * @param {string} targetPath - The target path or filename to resolve
 * @returns {string} - Safe resolved absolute path
 * @throws {Error} - If the resolved path attempts to escape the base directory
 */
function resolveSafePath(baseDir, targetPath) {
    // Codacy Security: Canonical path resolution with explicit containment check
    const resolvedBase = path.resolve(baseDir);
    const resolvedTarget = path.resolve(baseDir, targetPath);
    
    // Security: Check if resolved path stays within base directory
    // Using startsWith with path.sep ensures exact directory boundary match
    if (!resolvedTarget.startsWith(resolvedBase + path.sep) && resolvedTarget !== resolvedBase) {
        throw new Error(`Security: Path traversal attempt blocked. Target path "${targetPath}" would escape base directory "${baseDir}"`);
    }
    
    return resolvedTarget;
}

// ============================================
// Configuration
// ============================================
const CONFIG = {
    servicesFolder: AI_AGENT_SERVICES_BASE, // Security: Use pre-validated base path
    sandbox: true, // true = أي إنشاء ملفات دومين جديد سيكون في وضع Sandbox
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
        // Security: Use safe path resolution to prevent directory traversal
        const servicePath = resolveSafePath(CONFIG.servicesFolder, `${domain}.js`);
        
        if (!fs.existsSync(servicePath)) {
            // إنشاء ملف دومين جديد في وضع Sandbox
            const template = `
export async function runDomainService(domain, prompt) {
    console.log('🟢 Running sandbox service for', domain);
    return { success: true, prompt };
}`;
            // Security: Write to validated safe path only
            fs.writeFileSync(servicePath, template.trim());
            console.log(`✅ Created sandbox domain file: ${domain}.js`);
        }
        
        // Security: Import using validated safe path
        const moduleImportPath = resolveSafePath(CONFIG.servicesFolder, `${domain}.js`);
        const module = await import(moduleImportPath);
        return module.runDomainService;
    } catch (err) {
        console.error(`❌ Failed to load service for ${domain}:`, err.message);
        return null;
    }
}

// ============================================
// AI Agent: Organize Domain Files
// ============================================
async function organizeDomainFiles() {
    console.log('🗂️ Organizing domain files...');
    for (const domain of CONFIG.domains) {
        await loadService(domain); // إنشاء الملفات الجديدة أو ترك القديمة
    }
    console.log('✅ All domain files are organized.');
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
    console.warn('⚠️ No model found. AI operations will use sandbox defaults.');
    return { type: 'sandbox', name: null };
}

// ============================================
// Main Sovereign Runner
// ============================================
async function runSovereignOS() {
    console.log("\n🚀 Sovereign OS 2026: Factory Booting...\n");

    // 1️⃣ تنظيم ملفات الدومينات أولاً
    await organizeDomainFiles();

    const modelInfo = selectModel();
    console.log(`🤖 Using ${modelInfo.type} model: ${modelInfo.name || 'Sandbox'}`);

    for (const domain of CONFIG.domains) {
        console.log(`\n🏗️ Processing domain: ${domain}`);

        // 2️⃣ Council Decision
        const decision = councilDecision({
            taskType: TASK_TYPES.DEVELOPMENT,
            domain,
            requiresAudit: true
        });

        // 3️⃣ Load domain service dynamically
        const runService = await loadService(domain);
        if (!runService) continue;

        // 4️⃣ Prepare task prompt
        const taskPrompt = `Generate a scalable, secure, production-ready module for ${domain} using model: ${modelInfo.name}`;

        try {
            // 5️⃣ Run the service
            const result = await runService(domain, taskPrompt);

            // 6️⃣ Ledger recording
            recordTransaction({
                domain,
                result,
                modelUsed: modelInfo.type,
                sandbox: CONFIG.sandbox
            });

            // 7️⃣ Budget control
            if (getCostSignal().isLowBalance) {
                console.warn(`⚠️ Budget threshold reached for ${domain}. Switching to reserve mode.`);
            }

            console.log(`✅ Domain ${domain} processed successfully.`);

        } catch (err) {
            console.error(`💥 Error in domain ${domain}:`, err.message);
        }
    }

    // 8️⃣ Final report
    const report = generateFinalReport();
    console.log("\n📊 Sovereign OS Final Operational Report:");
    console.log(JSON.stringify(report.summary, null, 2));

    // Security: Save full logs to pre-validated safe path (LEDGER_PATH)
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(report.logs, null, 2));
    console.log(`📁 Full ledger logs saved to ${LEDGER_PATH}`);
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
export { 
    CONFIG, 
    runSovereignOS, 
    organizeDomainFiles, 
    loadService, 
    selectModel,
    resolveSafePath,
    PROJECT_ROOT,
    DOMAINS_BASE,
    AI_AGENT_SERVICES_BASE,
    LEDGER_PATH
};
