// ============================================
// Sovereign OS 2026 - TEC Ecosystem Launcher
// ============================================
// Simple launcher that delegates to domain-task-map runner
// All orchestration logic is in ai-agent/domain-task-map.js

import { runSovereignTaskMap } from './ai-agent/domain-task-map.js';

// ============================================
// Execute if run directly
// ============================================
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Sovereign OS 2026: Launching Task Map Runner...\n');
  
  runSovereignTaskMap().catch(err => {
    console.error('\n💥 Critical failure in Sovereign Task Map:', err);
    process.exit(1);
  });
}

// ============================================
// Exports
// ============================================
export { runSovereignTaskMap };
