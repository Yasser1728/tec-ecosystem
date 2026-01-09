// ======================================================
// Sovereign Base Service Template
// Used by all domain services (Plugin-based)
// ======================================================

import { executeModel } from '../core/openrouter.js';
import { recordTransaction, getCostSignal } from '../core/ledger.js';
import { councilDecision, TASK_TYPES } from '../core/council.js';

/**
 * Factory to create a domain service
 * @param {Object} options
 * @param {string} options.domain - domain name (e.g. tec.pi)
 * @param {string} options.purpose - short description of the service role
 */
export function createService({ domain, purpose }) {
  if (!domain) {
    throw new Error('Service must have a domain name');
  }

  /**
   * Entry point called by index.js
   * @param {Object} CONFIG - global config injected by Orchestrator
   */
  async function run(CONFIG) {
    console.log(`\n🏗️ [SERVICE BOOT] ${domain}`);
    console.log(`🎯 Purpose: ${purpose}`);

    // 1️⃣ Ask the Council
    const decision = councilDecision({
      taskType: TASK_TYPES.OPERATION,
      domain,
      requiresAudit: true,
      costSignal: getCostSignal()
    });

    if (!decision || !decision.primary) {
      console.warn(`⚠️ Council returned no valid model for ${domain}`);
      return;
    }

    // 2️⃣ Build the prompt (can be overridden per service)
    const prompt = `
You are the sovereign AI service for domain: ${domain}.
Purpose: ${purpose}

Constraints:
- Focus on security, correctness, and scalability
- Prefer local processing logic
- Output structured, production-ready results

Task:
Generate or process the core operation for this domain.
    `.trim();

    // 3️⃣ Execute via OpenRouter
    const result = await executeModel({
      model: decision.primary,
      messages: [{ role: 'user', content: prompt }],
      domain
    });

    if (!result || !result.ok) {
      console.error(`❌ Execution failed for ${domain}`);
      return;
    }

    // 4️⃣ Record transaction in the Ledger
    recordTransaction({
      model: decision.primary,
      usage: result.usage,
      domain,
      role: 'PRIMARY'
    });

    // 5️⃣ Optional: log output preview
    console.log(`✅ [SERVICE DONE] ${domain}`);
    console.log(`🧠 Model Used: ${decision.primary.name}`);
    console.log(`📦 Tokens: ${result.usage?.total_tokens || 0}`);

    return result.data;
  }

  return { run };
}
