// ============================================
// OpenRouter Client - Free-First with Paid Fallback
// Node.js 20+ ESM - Native Fetch
// ============================================

/**
 * Free models list - tried first before paid models
 * These models are available at no cost on OpenRouter
 */
const FREE_MODELS = [
  'google/gemini-flash-1.5-8b',
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'qwen/qwen-2-7b-instruct:free'
];

/**
 * Default paid model fallback
 */
const DEFAULT_PAID_MODEL = 'openai/gpt-4o-mini';

/**
 * OpenRouter API endpoint
 */
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Get configuration from environment
 */
function getConfig() {
  return {
    apiKey: process.env.OPENROUTER_API_KEY,
    paidModel: process.env.OR_PAID_MODEL || DEFAULT_PAID_MODEL,
    httpReferer: process.env.OPENROUTER_HTTP_REFERER || 'https://github.com/Yasser1728/tec-ecosystem',
    appTitle: process.env.OPENROUTER_APP_TITLE || 'TEC Sovereign AI Agent'
  };
}

/**
 * Make request to OpenRouter with native fetch
 * @param {string} model - Model identifier
 * @param {Array} messages - Chat messages
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} Response with model, text, and usage
 */
async function makeRequest(model, messages, config) {
  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': config.httpReferer,
      'X-Title': config.appTitle
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7
    })
  });

  // Get response body for error handling
  const responseText = await response.text();
  
  if (!response.ok) {
    throw new Error(
      `OpenRouter API error (${response.status}): ${responseText}`
    );
  }

  const data = JSON.parse(responseText);
  
  return {
    model: data.model || model,
    text: data.choices?.[0]?.message?.content || '',
    usage: data.usage || null
  };
}

/**
 * Chat completion with free-first strategy and paid fallback
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<Object>} Result with model, text, and usage
 */
export async function chatCompletion(messages) {
  const config = getConfig();

  if (!config.apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY environment variable is required'
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages must be a non-empty array');
  }

  // Try free models first
  for (const freeModel of FREE_MODELS) {
    try {
      console.log(`🔄 Trying free model: ${freeModel}`);
      const result = await makeRequest(freeModel, messages, config);
      console.log(`✅ Success with free model: ${freeModel}`);
      return result;
    } catch (error) {
      console.log(`⚠️  Free model ${freeModel} failed: ${error.message}`);
      // Continue to next free model
      continue;
    }
  }

  // All free models failed, fallback to paid model
  console.log(`💰 Falling back to paid model: ${config.paidModel}`);
  try {
    const result = await makeRequest(config.paidModel, messages, config);
    console.log(`✅ Success with paid model: ${config.paidModel}`);
    return result;
  } catch (error) {
    // Enhance error with more context
    throw new Error(
      `All models failed. Last error from ${config.paidModel}: ${error.message}`
    );
  }
}

/**
 * Simple text completion helper
 * @param {string} prompt - The prompt text
 * @returns {Promise<Object>} Result with model, text, and usage
 */
export async function complete(prompt) {
  return chatCompletion([
    { role: 'user', content: prompt }
  ]);
}
