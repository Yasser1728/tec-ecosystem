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
// Configuration
// ============================================
const CONFIG = {
    servicesFolder: path.join(__dirname, 'ai-agent', 'services'),
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
        const servicePath = path.join(CONFIG.servicesFolder, `${domain}.js`);
        if (!fs.existsSync(servicePath)) {
            // إنشاء ملف دومين جديد في وضع Sandbox
            const template = `
export async function runDomainService(domain, prompt) {
    console.log('🟢 Running sandbox service for', domain);
    return { success: true, prompt };
}`;
            fs.writeFileSync(servicePath, template.trim());
            console.log(`✅ Created sandbox domain file: ${domain}.js`);
        }
        const module = await import(path.join(CONFIG.servicesFolder, `${domain}.js`));
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

    // Save full logs
    const logsPath = path.join(__dirname, 'ledger_full_log.json');
    fs.writeFileSync(logsPath, JSON.stringify(report.logs, null, 2));
    console.log(`📁 Full ledger logs saved to ${logsPath}`);
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
export { CONFIG, runSovereignOS, organizeDomainFiles, loadService, selectModel };
