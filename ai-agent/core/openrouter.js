// ai-agent/core/openrouter.js

/**
 * OpenRouter Executor
 * Responsibilities:
 * - Payload construction
 * - API communication with OpenRouter
 * - Timeout & error handling with retries
 * - Usage reporting (hook for ledger.js)
 * - Sandbox mode support
 */

import { OPENROUTER_API_KEY, isSandboxMode } from './config.js';
import { recordTransaction } from './ledger.js';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_TIMEOUT = 60000; // 60s timeout (increased for complex tasks)
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second base delay

/**
 * ⏱️ Timeout wrapper using AbortController
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} Fetch response
 */
async function fetchWithTimeout(url, options, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * 🧱 Payload Builder (Canonical)
 * @param {Object} options - Payload options
 * @returns {Object} Request payload
 */
function buildPayload({ model, messages, temperature = 0.2, maxTokens }) {
  const payload = {
    model,
    messages,
    temperature
  };
  
  if (maxTokens) {
    payload.max_tokens = maxTokens;
  }
  
  return payload;
}

/**
 * 🧾 Usage Extractor (OpenRouter-compatible)
 * @param {Object} json - Response JSON
 * @returns {Object} Usage information
 */
function extractUsage(json) {
  return json?.usage || {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  };
}

/**
 * 🎭 Sandbox Response Generator
 * Creates mock responses for development/testing
 * @param {Object} options - Execution options
 * @returns {Object} Mock response
 */
function createSandboxResponse({ model, messages, domain, role }) {
  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage?.content || '';
  
  return {
    ok: true,
    content: `[SANDBOX] Mock response for domain: ${domain}\n\nPrompt received: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"\n\nThis is a sandbox response. Configure OPENROUTER_API_KEY to enable real AI responses.`,
    usage: {
      prompt_tokens: Math.ceil(prompt.length / 4),
      completion_tokens: 50,
      total_tokens: Math.ceil(prompt.length / 4) + 50
    },
    meta: {
      model: model?.model || 'sandbox/mock',
      tier: 'SANDBOX',
      role,
      domain,
      sandboxMode: true
    }
  };
}

/**
 * 💤 Sleep helper for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 🚀 Primary Executor
 * Executes AI model requests via OpenRouter
 * 
 * @param {Object} options - Execution options
 * @param {Object} options.model - Model configuration
 * @param {Array} options.messages - Chat messages
 * @param {number} [options.temperature=0.2] - Temperature setting
 * @param {number} [options.maxTokens] - Maximum tokens
 * @param {string} options.domain - Domain name
 * @param {string} [options.role='primary'] - Role identifier
 * @param {boolean} [options.recordUsage=true] - Whether to record usage in ledger
 * @param {number} [options.timeout] - Custom timeout
 * @returns {Promise<Object>} Execution result
 */
export async function executeModel({
  model,
  messages,
  temperature,
  maxTokens,
  domain,
  role = 'primary',
  recordUsage = true,
  timeout = DEFAULT_TIMEOUT
}) {
  // Validate model configuration
  if (!model?.model) {
    return {
      ok: false,
      error: '[EXECUTOR] Invalid model configuration - no model specified',
      meta: { domain, role }
    };
  }

  // Use sandbox mode if no API key or in development
  if (isSandboxMode() || model.isSandbox) {
    console.log(`[EXECUTOR] Sandbox mode - generating mock response for ${domain}`);
    const response = createSandboxResponse({ model, messages, domain, role });
    
    if (recordUsage) {
      recordTransaction({
        model,
        usage: response.usage,
        domain,
        role
      });
    }
    
    return response;
  }

  // Build request payload
  const payload = buildPayload({
    model: model.model,
    messages,
    temperature,
    maxTokens
  });

  let lastError = null;

  // Retry loop
  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const response = await fetchWithTimeout(
        OPENROUTER_ENDPOINT,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': domain || 'tec-ecosystem',
            'X-Title': 'TEC Sovereign AI Agent'
          },
          body: JSON.stringify(payload)
        },
        timeout
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const json = await response.json();
      const content = json?.choices?.[0]?.message?.content || '';
      const usage = extractUsage(json);

      // Record transaction in ledger
      if (recordUsage) {
        recordTransaction({
          model,
          usage,
          domain,
          role
        });
      }

      return {
        ok: true,
        content,
        usage,
        meta: {
          model: model.model,
          tier: model.tier,
          role,
          domain,
          attempt
        }
      };

    } catch (error) {
      lastError = error;
      console.warn(`[EXECUTOR] Attempt ${attempt}/${MAX_RETRIES + 1} failed for ${model.model}: ${error.message}`);

      // Don't retry on abort/timeout errors (check multiple error types for compatibility)
      const isAbortError = error.name === 'AbortError' || 
                          error.name === 'TimeoutError' ||
                          error.code === 'ABORT_ERR' ||
                          error.code === 'ETIMEDOUT' ||
                          (error.message && error.message.toLowerCase().includes('aborted'));
      
      if (isAbortError) {
        console.warn(`[EXECUTOR] Request timed out for ${model.model}, not retrying`);
        break;
      }

      // Wait before retry with exponential backoff
      if (attempt <= MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt);
      }
    }
  }

  // All retries failed
  return {
    ok: false,
    error: lastError?.message || 'Unknown error',
    meta: {
      model: model.model,
      role,
      domain,
      retries: MAX_RETRIES
    }
  };
}

/**
 * 🔄 Execute with fallback
 * Tries primary model, falls back to alternate on failure
 * 
 * @param {Object} options - Execution options
 * @param {Object} options.primaryModel - Primary model to try
 * @param {Object} options.fallbackModel - Fallback model if primary fails
 * @param {Array} options.messages - Chat messages
 * @param {string} options.domain - Domain name
 * @returns {Promise<Object>} Execution result
 */
export async function executeWithFallback({
  primaryModel,
  fallbackModel,
  messages,
  domain,
  ...options
}) {
  // Try primary model
  const primaryResult = await executeModel({
    model: primaryModel,
    messages,
    domain,
    ...options
  });

  if (primaryResult.ok) {
    return primaryResult;
  }

  // Try fallback if available
  if (fallbackModel) {
    console.log(`[EXECUTOR] Primary failed, trying fallback model for ${domain}`);
    return executeModel({
      model: fallbackModel,
      messages,
      domain,
      role: 'fallback',
      ...options
    });
  }

  return primaryResult;
}
