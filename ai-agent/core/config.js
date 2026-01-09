// ai-agent/core/config.js

/**
 * Sovereign Configuration Registry
 * Single Source of Truth for all AI models
 */

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[CONFIG] Missing required secret: ${name}`);
  }
  return value;
}

/**
 * 🔑 Master Key
 */
export const OPENROUTER_API_KEY = requireEnv('OPENROUTER_API_KEY');

/**
 * 🏛️ Paid Core – Critical Sovereigns
 */
export const PAID_CORE = {
  STRATEGY: {
    name: 'GPT-5.2 Pro',
    model: requireEnv('GPT_MODEL'),
    tier: 'PAID_CORE',
    costPerCall: 1.5
  },
  ARCHITECT: {
    name: 'Claude 4.5 Sonnet',
    model: requireEnv('CLAUDE_MODEL'),
    tier: 'PAID_CORE',
    costPerCall: 1.2
  },
  AUDITOR: {
    name: 'Gemini 3 Pro',
    model: requireEnv('GEMINI_MODEL'),
    tier: 'PAID_CORE',
    costPerCall: 1.8
  },
  DEVELOPER: {
    name: 'GPT-5.1 Codex Max',
    model: requireEnv('CODEX_MODEL'),
    tier: 'PAID_CORE',
    costPerCall: 1.4
  }
};

/**
 * 🛡️ Free Elite Reserve – Paid-class quality
 */
export const ELITE_RESERVE = {
  REASONING: {
    name: 'DeepSeek R1',
    model: process.env.DEEPSEEK_MODEL,
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0
  },
  GENERAL_INTELLIGENCE: {
    name: 'LLaMA 3.1 405B',
    model: process.env.LLAMA_MODEL,
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0
  },
  CRITICAL_REVIEW: {
    name: 'Hermes 3 405B',
    model: process.env.HERMES_MODEL,
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0
  },
  CODE_BACKUP: {
    name: 'Qwen3 Coder 480B',
    model: process.env.QWEN_MODEL,
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0
  },
  OPEN_STRATEGY: {
    name: 'GPT-OSS 120B',
    model: process.env.GPT_OSS_FREE,
    tier: 'ELITE_RESERVE',
    costPerCall: 0.0
  }
};

/**
 * ⚡ Fast Ops – High-speed utilities
 */
export const FAST_OPS = {
  QUICK_AUDIT: {
    name: 'Gemini Flash',
    model: process.env.GEMINI_FLASH_FREE,
    tier: 'FAST_OPS',
    costPerCall: 0.0
  },
  RAPID_ENGINEER: {
    name: 'o4-mini-high',
    model: process.env.O4_ENGINEER_MODEL,
    tier: 'FAST_OPS',
    costPerCall: 0.2
  },
  DATA_SPECIALIST: {
    name: 'Devstral',
    model: process.env.DEVSTRAL_MODEL,
    tier: 'FAST_OPS',
    costPerCall: 0.0
  }
};

/**
 * 🧠 Unified Export (for council/router)
 */
export const MODEL_REGISTRY = {
  PAID_CORE,
  ELITE_RESERVE,
  FAST_OPS
};
