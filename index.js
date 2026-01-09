// index.js - Sovereign Entry Point 2026
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { councilDecision, TASK_TYPES } from './ai-agent/core/council.js';
import { executeModel } from './ai-agent/core/openrouter.js';
import { recordTransaction, generateFinalReport, getCostSignal } from './ai-agent/core/ledger.js';

// =============================
// Utilities
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically import the service module for a domain
 */
async function loadService(domain) {
    try {
        const servicePath = path.join(__dirname, 'ai-agent', 'services', `${domain}.js`);
        const serviceModule = await import(servicePath);
        return serviceModule.runDomainService;
    } catch (err) {
        console.error(`❌ Failed to load service module for ${domain}:`, err.message);
        return null;
    }
}

// =============================
// List of 24 Domains
// =============================
const DOMAINS = [
    'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
    'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
    'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
    'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
];

// =============================
// Main Sovereign Runner
// =============================
async function runSovereignOS() {
    console.log("\n🚀 Sovereign OS 2026: Factory Booting Up...\n");

    for (const domain of DOMAINS) {
        console.log(`\n🏗️ Initializing domain: ${domain}`);

        // 1️⃣ Council Decision
        const decision = councilDecision({
            taskType: TASK_TYPES.DEVELOPMENT,
            domain,
            requiresAudit: true
        });

        // 2️⃣ Load the domain service dynamically
        const runService = await loadService(domain);
        if (!runService) continue;

        // 3️⃣ Prepare task prompt
        const taskPrompt = `Generate a scalable, secure, production-ready module for ${domain} with local processing.`;

        try {
            // 4️⃣ Run the service
            const result = await runService(domain, taskPrompt);

            // 5️⃣ Ledger recording for primary model (already done in service)
            // 6️⃣ Optional cost guard check
            if (getCostSignal().isLowBalance) {
                console.warn(`⚠️ Budget threshold reached for ${domain}. Switching to reserve mode.`);
            }

            console.log(`✅ Domain ${domain} processed successfully.\n`);

        } catch (err) {
            console.error(`💥 Error processing domain ${domain}:`, err.message);
        }
    }

    // 7️⃣ Final report
    const report = generateFinalReport();
    console.log("\n📊 Sovereign OS Final Operational Report:");
    console.log(JSON.stringify(report.summary, null, 2));

    // Optionally save full logs
    const logsPath = path.join(__dirname, 'ledger_full_log.json');
    fs.writeFileSync(logsPath, JSON.stringify(report.logs, null, 2));
    console.log(`📁 Full ledger logs saved to ${logsPath}`);
}

// =============================
// Execute
// =============================
if (import.meta.url === `file://${process.argv[1]}`) {
    runSovereignOS().catch(err => {
        console.error("\n💥 Critical failure in Sovereign OS:", err);
        process.exit(1);
    });
}
