// ai-agent/core/openrouter.js

/**
 * OpenRouter Executor
 * Responsibilities:
 * - Payload construction
 * - API communication
 * - Timeout & error handling
 * - Usage reporting (hook for ledger.js)
 */

import fetch from 'node-fetch';
import { OPENROUTER_API_KEY } from './config.js';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_TIMEOUT = 30_000; // 30s hard timeout

/**
 * ⏱️ Timeout wrapper (AbortController)
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
 */
function buildPayload({ model, messages, temperature = 0.2 }) {
  return {
    model,
    messages,
    temperature
  };
}

/**
 * 🧾 Usage Extractor (OpenRouter-compatible)
 */
function extractUsage(json) {
  return json?.usage || {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  };
}

/**
 * 🚀 Primary Executor
 */
export async function executeModel({
  model,
  messages,
  temperature,
  domain,
  role = 'primary'
}) {
  if (!model?.model) {
    throw new Error(`[EXECUTOR] Invalid model configuration`);
  }

  const payload = buildPayload({
    model: model.model,
    messages,
    temperature
  });

  let response;
  let json;

  try {
    response = await fetchWithTimeout(
      OPENROUTER_ENDPOINT,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': domain || 'ai-agent',
          'X-Title': 'Sovereign AI Agent'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `[OPENROUTER:${model.model}] ${response.status} ${text}`
      );
    }

    json = await response.json();

  } catch (error) {
    return {
      ok: false,
      error: error.message,
      meta: {
        model: model.model,
        role,
        domain
      }
    };
  }

  const content =
    json?.choices?.[0]?.message?.content || '';

  const usage = extractUsage(json);

  /**
   * 🔗 Ledger Hook (placeholder)
   * ledger.record({ model, usage, role, domain })
   */

  return {
    ok: true,
    content,
    usage,
    meta: {
      model: model.model,
      tier: model.tier,
      role,
      domain
    }
  };
}
