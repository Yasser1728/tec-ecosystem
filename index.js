// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// ============================================

import { runSovereignTaskMap } from './ai-agent/domain-task-map.js';

// ============================================
// Configuration
// ============================================
const CONFIG = {
    sandbox: true, // true = any new domain file creation will be in Sandbox mode
    domains: [
        'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
        'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
        'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
        'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
    ],
    verbose: true
};

// ============================================
// Main Sovereign Runner
// ============================================
async function runSovereignOS() {
    console.log("\n🚀 Sovereign OS 2026: Factory Booting...\n");
    
    try {
        // Delegate to orchestrator in domain-task-map.js
        await runSovereignTaskMap(CONFIG);
        console.log("\n✅ Sovereign OS execution completed successfully!");
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
        console.error("\n💥 Unhandled error:", err);
        process.exit(1);
    });
}

// ============================================
// Exports
// ============================================
export { CONFIG, runSovereignOS };
