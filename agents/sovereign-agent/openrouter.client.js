/**
 * OpenRouter Client for Sovereign Agent
 * Provides LLM execution capability
 */

import { executeModel } from '../../ai-agent/core/openrouter.js';
import { OPENROUTER_API_KEY } from '../../ai-agent/core/config.js';

/**
 * Run LLM with given prompt
 * @param {string} prompt - The prompt to send to the LLM
 * @returns {Promise<{text: string, model: string, usage: object}>}
 */
export async function runLLM(prompt) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const messages = [
    {
      role: 'user',
      content: prompt
    }
  ];

  // Use a default free model
  const model = {
    model: 'google/gemini-2.0-flash-exp:free',
    tier: 'free'
  };

  const result = await executeModel({
    model,
    messages,
    temperature: 0.7,
    domain: 'sovereign-agent',
    role: 'primary'
  });

  if (!result.ok) {
    throw new Error(`LLM execution failed: ${result.error}`);
  }

  return {
    text: result.content || '',
    model: result.meta?.model || 'unknown',
    usage: result.usage || null
  };
}
