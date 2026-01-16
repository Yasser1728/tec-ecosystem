// ======================================================
// Sovereign Base Service Template
// Used by all domain services (Plugin-based)
// ======================================================

import { executeModel } from '../core/openrouter.js';
import { recordTransaction, getCostSignal } from '../core/ledger.js';
import { councilDecision, TASK_TYPES } from '../core/council.js';
import { logger } from '../../lib/utils/logger.js';

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
   * @param {string} taskPrompt - optional override prompt from orchestrator
   */
  async function run(taskPrompt) {
    console.log(`\n[SERVICE BOOT] ${domain}`);
    console.log(`Purpose: ${purpose}`);

    // Council selection
    const decision = councilDecision({
      taskType: TASK_TYPES.OPERATION,
      domain,
      requiresAudit: true,
      costSignal: getCostSignal()
    });

    if (!decision || !decision.primary) {
      console.warn(`[SERVICE WARN] Council returned no valid model for ${domain}`);
      return { ok: false, error: 'No valid model available' };
    }

    // Build the prompt (can be overridden per service)
    const prompt = (
      taskPrompt ||
      `
You are the sovereign AI service for domain: ${domain}.
Purpose: ${purpose}

Constraints:
- Focus on security, correctness, and scalability
- Prefer local processing logic
- Output structured, production-ready results

Task:
Generate or process the core operation for this domain.
      `
    ).trim();

    // Execute via OpenRouter
    const result = await executeModel({
      model: decision.primary,
      messages: [{ role: 'user', content: prompt }],
      domain
    });

    if (!result || !result.ok) {
      console.error(`[SERVICE ERROR] Execution failed for ${domain}`);
      return { ok: false, error: 'Model execution failed' };
    }

    // Record transaction in the Ledger
    recordTransaction({
      model: decision.primary,
      usage: result.usage,
      domain,
      role: 'PRIMARY'
    });

    // Optional: log output preview
    console.log(`[SERVICE DONE] ${domain}`);
    console.log(`Model Used: ${decision.primary.name}`);
    console.log(`Tokens: ${result.usage?.total_tokens || 0}`);

    return {
      ok: true,
      content: result.content ?? result.data ?? null,
      usage: result.usage,
      meta: {
        ...result.meta,
        modelConfig: decision.primary,
        recorded: true
      }
    };
  }

  return { run };
}
