// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// Lightweight Launcher for Option C Orchestrator
// ============================================

import path from 'path';
import { fileURLToPath } from 'url';
import { runSovereignTaskMap } from './ai-agent/domain-task-map.js';

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
    ]
};

// ============================================
// Main Sovereign Runner (Lightweight Launcher)
// ============================================
async function runSovereignOS() {
    console.log("\n🚀 Sovereign OS 2026: Factory Booting...\n");
    
    try {
        // Delegate to Option C orchestrator in domain-task-map.js
        await runSovereignTaskMap(CONFIG);
        console.log("\n✅ Sovereign OS completed successfully!");
    } catch (err) {
        console.error("\n💥 Critical failure in Sovereign OS:", err);
        throw err;
    }
}

// ============================================
// Execute if run directly
// ============================================
if (import.meta.url === `file://${process.argv[1]}`) {
    runSovereignOS().catch(err => {
        console.error("\n💥 Execution failed:", err.message);
        process.exit(1);
    });
}

// ============================================
// Exports
// ============================================
export { CONFIG, runSovereignOS };
