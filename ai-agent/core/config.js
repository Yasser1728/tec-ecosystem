// ai-agent/core/config.js

/**
 * Sovereign Configuration Registry
 * Single Source of Truth for all AI models
 * 
 * This module provides centralized configuration for the AI agent,
 * including model definitions, API keys, and tier management.
 */

/**
 * Get environment variable with optional fallback
 * @param {string} name - Environment variable name
 * @param {string} [fallback] - Optional fallback value
 * @returns {string|undefined} Environment variable value or fallback
 */
function getEnv(name, fallback) {
  const value = process.env[name];
  return value || fallback;
}

/**
 * Require environment variable (throws if missing)
 * @param {string} name - Environment variable name
 * @returns {string} Environment variable value
 * @throws {Error} If environment variable is not set
 */
function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[CONFIG] Missing required secret: ${name}`);
  }
  return value;
}

/**
 * Check if running in sandbox/development mode
 * @returns {boolean} True if in sandbox mode
 */
export function isSandboxMode() {
  const nodeEnv = process.env.NODE_ENV;
  return nodeEnv === 'development' || nodeEnv === 'test' || !process.env.OPENROUTER_API_KEY;
}

/**
 * 🔑 Master Key
 * Returns the API key or null in sandbox mode
 */
export const OPENROUTER_API_KEY = isSandboxMode() ? null : getEnv('OPENROUTER_API_KEY');

/**
 * 🏛️ Paid Core – Critical Sovereigns
 * Primary models for critical operations requiring highest quality
 */
export const PAID_CORE = {
  STRATEGY: {
    name: 'GPT-4o',
    model: getEnv('GPT_MODEL', 'openai/gpt-4o'),
    tier: 'PAID_CORE',
    costPerCall: 0.5,
    capabilities: ['strategy', 'planning', 'analysis']
  },
  ARCHITECT: {
    name: 'Claude 3.5 Sonnet',
    model: getEnv('CLAUDE_MODEL', 'anthropic/claude-3.5-sonnet'),
    tier: 'PAID_CORE',
    costPerCall: 0.3,
    capabilities: ['architecture', 'code-review', 'documentation']
  },
  AUDITOR: {
    name: 'Gemini 2.0 Flash',
    model: getEnv('GEMINI_MODEL', 'google/gemini-2.0-flash-exp'),
    tier: 'PAID_CORE',
    costPerCall: 0.1,
    capabilities: ['audit', 'verification', 'security']
  },
  DEVELOPER: {
    name: 'GPT-4o',
    model: getEnv('CODEX_MODEL', 'openai/gpt-4o'),
    tier: 'PAID_CORE',
    costPerCall: 0.5,
    capabilities: ['coding', 'debugging', 'optimization']
  }
};

/**
 * 🛡️ Free Elite Reserve – Paid-class quality at zero cost
 * High-quality free models for cost-effective operations
 */
export const ELITE_RESERVE = {
  REASONING: {
    name: 'DeepSeek R1',
    model: getEnv('DEEPSEEK_MODEL', 'deepseek/deepseek-r1:free'),
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0,
    capabilities: ['reasoning', 'analysis', 'problem-solving']
  },
  GENERAL_INTELLIGENCE: {
    name: 'LLaMA 3.3 70B',
    model: getEnv('LLAMA_MODEL', 'meta-llama/llama-3.3-70b-instruct:free'),
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0,
    capabilities: ['general', 'conversation', 'knowledge']
  },
  CRITICAL_REVIEW: {
    name: 'Hermes 3 405B',
    model: getEnv('HERMES_MODEL', 'nousresearch/hermes-3-llama-3.1-405b:free'),
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0,
    capabilities: ['review', 'critique', 'improvement']
  },
  CODE_BACKUP: {
    name: 'Qwen 2.5 72B',
    model: getEnv('QWEN_MODEL', 'qwen/qwen-2.5-72b-instruct:free'),
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0,
    capabilities: ['coding', 'multilingual', 'math']
  },
  OPEN_STRATEGY: {
    name: 'GPT-OSS',
    model: getEnv('GPT_OSS_FREE'),
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0,
    capabilities: ['strategy', 'planning']
  }
};

/**
 * ⚡ Fast Ops – High-speed utilities
 * Quick response models for real-time operations
 */
export const FAST_OPS = {
  QUICK_AUDIT: {
    name: 'Gemini Flash',
    model: getEnv('GEMINI_FLASH_FREE', 'google/gemini-2.0-flash-exp:free'),
    tier: 'FAST_OPS',
    costPerCall: 0.0,
    capabilities: ['quick-check', 'validation']
  },
  RAPID_ENGINEER: {
    name: 'GPT-4o Mini',
    model: getEnv('O4_ENGINEER_MODEL', 'openai/gpt-4o-mini'),
    tier: 'FAST_OPS',
    costPerCall: 0.02,
    capabilities: ['quick-code', 'fixes', 'snippets']
  },
  DATA_SPECIALIST: {
    name: 'Mistral Small',
    model: getEnv('DEVSTRAL_MODEL', 'mistralai/mistral-small-3.1-24b-instruct:free'),
    tier: 'FAST_OPS',
    costPerCall: 0.0,
    capabilities: ['data-processing', 'formatting', 'extraction']
  }
};

/**
 * 🧠 Unified Export (for council/router)
 * Provides centralized access to all model tiers
 */
export const MODEL_REGISTRY = {
  PAID_CORE,
  ELITE_RESERVE,
  FAST_OPS
};

/**
 * Get all available models as a flat array
 * @returns {Array} Array of all model configurations
 */
export function getAllModels() {
  const models = [];
  for (const tier of Object.values(MODEL_REGISTRY)) {
    for (const model of Object.values(tier)) {
      if (model.model) {
        models.push(model);
      }
    }
  }
  return models;
}

/**
 * Find a model by its capabilities
 * @param {string} capability - Required capability
 * @param {boolean} [preferFree=false] - Prefer free models
 * @returns {Object|null} Model configuration or null
 */
export function findModelByCapability(capability, preferFree = false) {
  const tiers = preferFree
    ? [ELITE_RESERVE, FAST_OPS, PAID_CORE]
    : [PAID_CORE, ELITE_RESERVE, FAST_OPS];

  for (const tier of tiers) {
    for (const model of Object.values(tier)) {
      if (model.model && model.capabilities?.includes(capability)) {
        return model;
      }
    }
  }
  return null;
}
