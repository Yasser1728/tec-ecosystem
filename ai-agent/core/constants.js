// ai-agent/core/constants.js

/**
 * Core Constants for the AI Agent
 * This file contains all shared constants to avoid circular dependencies
 */

/**
 * 🧠 Task Types (Canonical)
 * Defines the types of tasks the AI agent can perform
 */
export const TASK_TYPES = Object.freeze({
  STRATEGY: 'STRATEGY',
  ARCHITECTURE: 'ARCHITECTURE',
  DEVELOPMENT: 'DEVELOPMENT',
  OPERATION: 'OPERATION',
  AUDIT: 'AUDIT',
  FAST: 'FAST',
  REASONING: 'REASONING',
  DATA: 'DATA'
});

/**
 * Default Configuration Values
 */
export const DEFAULTS = Object.freeze({
  /** Default timeout for API requests in milliseconds */
  API_TIMEOUT_MS: 60000,
  
  /** Fast operation timeout in milliseconds */
  FAST_TIMEOUT_MS: 15000,
  
  /** Maximum retries for failed requests */
  MAX_RETRIES: 2,
  
  /** Base delay between retries in milliseconds */
  RETRY_DELAY_MS: 1000,
  
  /** Maximum content length for audit operations */
  MAX_AUDIT_CONTENT_LENGTH: 10000,
  
  /** Default ledger balance */
  DEFAULT_BALANCE: 100.0,
  
  /** Low balance threshold for switching to free models */
  LOW_BALANCE_THRESHOLD: 20.0,
  
  /** Default temperature for AI model requests */
  DEFAULT_TEMPERATURE: 0.2
});

/**
 * Model Tiers
 */
export const MODEL_TIERS = Object.freeze({
  PAID_CORE: 'PAID_CORE',
  ELITE_RESERVE: 'ELITE_RESERVE',
  FAST_OPS: 'FAST_OPS',
  SANDBOX: 'SANDBOX'
});

/**
 * Service Roles
 */
export const ROLES = Object.freeze({
  PRIMARY: 'PRIMARY',
  AUDITOR: 'AUDITOR',
  FALLBACK: 'FALLBACK'
});
