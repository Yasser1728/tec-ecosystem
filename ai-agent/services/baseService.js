// ======================================================
// Sovereign Base Service Template
// Used by all domain services (Plugin-based)
// Enhanced with output validation and governance
// ======================================================

import { executeModel } from '../core/openrouter.js';
import { recordTransaction, getCostSignal } from '../core/ledger.js';
import { councilDecision, TASK_TYPES } from '../core/council.js';

/**
 * Validate AI output for safety and quality
 * @param {any} content - The content returned by the AI model
 * @param {string} domain - The domain name
 * @returns {Object} - Validation result with sanitized content
 */
function validateOutput(content, domain) {
  const validation = {
    isValid: true,
    warnings: [],
    sanitizedContent: content
  };

  // Check if content exists
  if (!content) {
    validation.isValid = false;
    validation.warnings.push('Empty or null content received');
    return validation;
  }

  // Check for potentially harmful content patterns
  const harmfulPatterns = [
    /eval\(/gi,
    /exec\(/gi,
    /__import__/gi,
    /subprocess/gi,
    /os\.system/gi,
    /rm\s+-rf/gi,
  ];

  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  
  for (const pattern of harmfulPatterns) {
    if (pattern.test(contentStr)) {
      validation.warnings.push(`Potentially harmful pattern detected: ${pattern.source}`);
    }
  }

  // Validate structure for certain domains
  if (typeof content === 'object' && content !== null) {
    if (!content.hasOwnProperty('data') && !content.hasOwnProperty('result') && !content.hasOwnProperty('output')) {
      validation.warnings.push('Output lacks standard structure fields (data/result/output)');
    }
  }

  // Check content length (warn if too short or suspiciously long)
  if (contentStr.length < 10) {
    validation.warnings.push('Output suspiciously short');
  } else if (contentStr.length > 100000) {
    validation.warnings.push('Output suspiciously long');
  }

  return validation;
}

/**
 * Enhanced error handler with governance
 * @param {Error} error - The error object
 * @param {string} domain - The domain name
 * @param {string} phase - The phase where error occurred
 * @returns {Object} - Structured error response
 */
function handleServiceError(error, domain, phase) {
  const errorResponse = {
    ok: false,
    error: error.message || 'Unknown error',
    domain,
    phase,
    timestamp: new Date().toISOString(),
    recoverable: true
  };

  // Categorize errors
  if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
    errorResponse.category = 'TIMEOUT';
    errorResponse.suggestion = 'Retry with exponential backoff';
  } else if (error.message?.includes('rate limit') || error.code === 429) {
    errorResponse.category = 'RATE_LIMIT';
    errorResponse.suggestion = 'Wait before retrying';
    errorResponse.recoverable = true;
  } else if (error.message?.includes('auth') || error.code === 401) {
    errorResponse.category = 'AUTHENTICATION';
    errorResponse.suggestion = 'Check API credentials';
    errorResponse.recoverable = false;
  } else if (error.message?.includes('model') || error.message?.includes('No valid model')) {
    errorResponse.category = 'MODEL_UNAVAILABLE';
    errorResponse.suggestion = 'Use fallback model';
  } else {
    errorResponse.category = 'UNKNOWN';
    errorResponse.suggestion = 'Review logs and retry';
  }

  console.error(`[SERVICE ERROR] ${domain} - ${phase}:`, errorResponse);
  return errorResponse;
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
        return handleServiceError(
          new Error('No valid model available'),
          domain,
          'MODEL_SELECTION'
        );
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
      let result;
      try {
        result = await executeModel({
          model: decision.primary,
          messages: [{ role: 'user', content: prompt }],
          domain
        });
      } catch (execError) {
        return handleServiceError(execError, domain, 'MODEL_EXECUTION');
      }

      if (!result || !result.ok) {
        console.error(`[SERVICE ERROR] Execution failed for ${domain}`);
        return handleServiceError(
          new Error('Model execution failed'),
          domain,
          'MODEL_EXECUTION'
        );
      }

      // Validate output
      const validation = validateOutput(result.content ?? result.data, domain);
      if (!validation.isValid) {
        console.warn(`[SERVICE VALIDATION] Output validation failed for ${domain}:`, validation.warnings);
      }
      if (validation.warnings.length > 0) {
        console.warn(`[SERVICE VALIDATION] Warnings for ${domain}:`, validation.warnings);
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
        console.warn(`[SERVICE WARN] Failed to record transaction: ${ledgerError.message}`);
        // Non-fatal, continue execution
      }

      // Log output preview
      console.log(`[SERVICE DONE] ${domain}`);
      console.log(`Model Used: ${decision.primary.name}`);
      console.log(`Tokens: ${result.usage?.total_tokens || 0}`);
      if (validation.warnings.length > 0) {
        console.log(`Validation Warnings: ${validation.warnings.length}`);
      }

      return {
        ok: true,
        content: validation.sanitizedContent ?? result.content ?? result.data ?? null,
        usage: result.usage,
        meta: {
          ...result.meta,
          modelConfig: decision.primary,
          recorded: true,
          validation: {
            isValid: validation.isValid,
            warnings: validation.warnings
          }
        }
      };
    } catch (unexpectedError) {
      return handleServiceError(unexpectedError, domain, 'UNEXPECTED');
    }
  }

  return { run };
}
