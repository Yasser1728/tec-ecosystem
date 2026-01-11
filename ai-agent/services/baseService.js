// ======================================================
// Sovereign Base Service Template
// Used by all domain services (Plugin-based)
// ======================================================

import { executeModel } from '../core/openrouter.js';
import { recordTransaction, getCostSignal } from '../core/ledger.js';
import { councilDecision, TASK_TYPES } from '../core/council.js';

// Service execution timeout
const SERVICE_TIMEOUT_MS = 45000; // 45 seconds
const SLOW_EXECUTION_THRESHOLD_MS = 30000; // 30 seconds

/**
 * Validate model response structure
 * Basic schema validation to ensure response integrity
 */
function validateModelResponse(result) {
  if (!result || typeof result !== 'object') {
    return { valid: false, error: 'Response is not an object' };
  }

  if (result.ok === false) {
    return { valid: false, error: result.error || 'Model execution failed' };
  }

  if (result.ok === true && !result.content && !result.data) {
    return { valid: false, error: 'Response missing content/data' };
  }

  return { valid: true };
}

/**
 * Sanitize model response content
 * Remove potentially unsafe content and normalize structure
 */
function sanitizeResponse(result) {
  const sanitized = {
    ok: result.ok || false,
    content: null,
    usage: result.usage || { total_tokens: 0 },
    meta: result.meta || {},
  };

  // Sanitize content - ensure it's a safe string
  if (result.content) {
    const content = String(result.content);
    // Basic sanitization: limit length and remove control characters
    sanitized.content = content
      .substring(0, 50000) // Max 50,000 characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control chars
  } else if (result.data) {
    sanitized.content = result.data;
  }

  return sanitized;
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
    const startTime = Date.now();
    
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
        return { 
          ok: false, 
          error: 'No valid model available',
          usage: { total_tokens: 0 },
          meta: { domain, sandbox: true },
        };
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

      // Execute via OpenRouter with timeout
      const executionPromise = executeModel({
        model: decision.primary,
        messages: [{ role: 'user', content: prompt }],
        domain
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Service execution timeout')), SERVICE_TIMEOUT_MS)
      );

      const result = await Promise.race([executionPromise, timeoutPromise]);

      // Validate response structure
      const validation = validateModelResponse(result);
      if (!validation.valid) {
        console.error(`[SERVICE ERROR] Invalid response for ${domain}: ${validation.error}`);
        return { 
          ok: false, 
          error: validation.error,
          usage: { total_tokens: 0 },
          meta: { domain, error: 'validation_failed' },
        };
      }

      // Sanitize response
      const sanitized = sanitizeResponse(result);

      // Record transaction in the Ledger
      recordTransaction({
        model: decision.primary,
        usage: sanitized.usage,
        domain,
        role: 'PRIMARY'
      });

      const executionTime = Date.now() - startTime;

      // Warn on slow executions
      if (executionTime > SLOW_EXECUTION_THRESHOLD_MS) {
        console.warn(`[SERVICE WARN] Slow execution for ${domain}: ${executionTime}ms`);
      }

      // Structured logging
      console.log(`[SERVICE DONE] ${domain}`);
      console.log(`Model Used: ${decision.primary.name}`);
      console.log(`Tokens: ${sanitized.usage?.total_tokens || 0}`);
      console.log(`Execution Time: ${executionTime}ms`);

      return {
        ok: true,
        content: sanitized.content,
        usage: sanitized.usage,
        meta: {
          ...sanitized.meta,
          modelConfig: decision.primary,
          recorded: true,
          executionTime,
        }
      };

    } catch (err) {
      const executionTime = Date.now() - startTime;
      console.error(`[SERVICE ERROR] ${domain} failed after ${executionTime}ms:`, err.message);

      // Return safe fallback
      return {
        ok: false,
        error: 'Service execution failed',
        content: null,
        usage: { total_tokens: 0 },
        meta: {
          domain,
          error: err.message,
          executionTime,
          fallback: true,
        }
      };
    }
  }

  return { run };
}
