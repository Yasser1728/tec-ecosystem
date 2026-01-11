// ======================================================
// Sovereign Base Service Template
// Used by all domain services (Plugin-based)
// ======================================================

import { executeModel } from '../core/openrouter.js';
import { recordTransaction, getCostSignal } from '../core/ledger.js';
import { councilDecision, TASK_TYPES } from '../core/council.js';

/**
 * Validate AI response structure
 * @param {Object} result - Result from AI model
 * @returns {Object} - Validation result
 */
function validateAIResponse(result) {
  const errors = [];
  
  if (!result) {
    errors.push('Response is null or undefined');
  }
  
  if (result && typeof result.ok !== 'boolean') {
    errors.push('Response missing "ok" field');
  }
  
  if (result?.ok && !result.content && !result.data) {
    errors.push('Successful response missing content or data');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

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

    try {
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

      // Execute via OpenRouter with error handling
      let result;
      try {
        result = await executeModel({
          model: decision.primary,
          messages: [{ role: 'user', content: prompt }],
          domain
        });
      } catch (executionError) {
        console.error(`[SERVICE ERROR] Model execution threw exception for ${domain}:`, executionError.message);
        return { 
          ok: false, 
          error: `Model execution failed: ${executionError.message}`,
          meta: { domain, model: decision.primary.name }
        };
      }

      // Validate response structure
      const validation = validateAIResponse(result);
      if (!validation.isValid) {
        console.error(`[SERVICE ERROR] Invalid response structure for ${domain}:`, validation.errors);
        return { 
          ok: false, 
          error: 'Invalid AI response structure',
          validationErrors: validation.errors
        };
      }

      if (!result || !result.ok) {
        console.error(`[SERVICE ERROR] Execution failed for ${domain}`);
        return { 
          ok: false, 
          error: result?.error || 'Model execution failed',
          meta: { domain, model: decision.primary.name }
        };
      }

      // Record transaction in the Ledger
      try {
        recordTransaction({
          model: decision.primary,
          usage: result.usage,
          domain,
          role: 'PRIMARY'
        });
      } catch (ledgerError) {
        console.error(`[SERVICE WARN] Failed to record transaction for ${domain}:`, ledgerError.message);
        // Non-fatal, continue
      }

      // Log output preview
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
    } catch (error) {
      // Catch-all for unexpected errors
      console.error(`[SERVICE CRITICAL] Unexpected error in ${domain}:`, error.message);
      console.error(error.stack);
      
      return {
        ok: false,
        error: `Unexpected service error: ${error.message}`,
        meta: { domain, errorType: error.constructor.name }
      };
    }
  }

  return { run };
}
