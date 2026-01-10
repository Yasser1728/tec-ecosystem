// ============================================
// Sovereign OS 2026 - TEC Ecosystem Factory
// Main Launcher (Option C Architecture)
// ============================================

import { runSovereignTaskMap } from './ai-agent/domain-task-map.js';

// ============================================
// Main Launcher Function
// ============================================
async function runSovereignOS() {
  console.log("\n🚀 Sovereign OS 2026: Factory Booting...\n");
  
  try {
    // Execute the domain task map runner
    const result = await runSovereignTaskMap();
    
    console.log('\n✅ Sovereign OS Factory completed successfully!\n');
    
    return result;
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
    console.error("\n💥 Critical failure:", err);
    process.exit(1);
  });
}

// ============================================
// Exports (preserve for consumers)
// ============================================
export { runSovereignOS, runSovereignTaskMap };
