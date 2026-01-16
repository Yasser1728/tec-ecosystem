// ai-agent/core/council.js

/**
 * Council Engine
 * Responsible for:
 * - Model selection based on task type
 * - Cost-aware routing with budget constraints
 * - Automatic fallback to free models
 * - Cross-model auditing for critical operations
 */

import { MODEL_REGISTRY, isSandboxMode, findModelByCapability } from './config.js';
import { getCostSignal } from './ledger.js';

/**
 * 🧠 Task Types (Canonical)
 * Defines the types of tasks the AI agent can perform
 */
const TASK_TYPES = {
  STRATEGY: 'STRATEGY',
  ARCHITECTURE: 'ARCHITECTURE',
  DEVELOPMENT: 'DEVELOPMENT',
  OPERATION: 'OPERATION',
  AUDIT: 'AUDIT',
  FAST: 'FAST',
  REASONING: 'REASONING',
  DATA: 'DATA'
};

/**
 * 💰 Runtime State (will be linked to ledger.js)
 * Tracks the current budget and operational status
 */
let RUNTIME_STATE = {
  balance: 100, // virtual credits (placeholder)
  lowBalanceThreshold: 20,
  sandboxMode: false
};

/**
 * Initialize runtime state
 * @param {Object} options - Initialization options
 */
export function initializeState(options = {}) {
  RUNTIME_STATE = {
    ...RUNTIME_STATE,
    ...options,
    sandboxMode: isSandboxMode()
  };
}

/**
 * 🔍 Utility: pick first available model from tier
 * @param {Object} tier - Model tier object
 * @returns {Object|null} First available model or null
 */
function pickAvailableModel(tier) {
  for (const key of Object.keys(tier)) {
    const model = tier[key];
    if (model?.model) return model;
  }
  return null;
}

/**
 * 🧮 Cost Guard - Check if running low on balance
 * @returns {boolean} True if balance is low
 */
function isLowBalance() {
  const costSignal = getCostSignal();
  return costSignal?.isLowBalance || RUNTIME_STATE.balance <= RUNTIME_STATE.lowBalanceThreshold;
}

/**
 * 🏭 Create Sandbox Model
 * Returns a mock model configuration for sandbox mode
 * @param {string} taskType - Type of task
 * @returns {Object} Sandbox model configuration
 */
function createSandboxModel(taskType) {
  return {
    name: `Sandbox-${taskType}`,
    model: 'sandbox/mock-model',
    tier: 'SANDBOX',
    costPerCall: 0,
    capabilities: ['sandbox'],
    isSandbox: true
  };
}

/**
 * 🎯 Primary Decision Engine
 * Selects the most appropriate model based on task type, budget, and requirements
 * 
 * @param {Object} options - Decision options
 * @param {string} options.taskType - Type of task (from TASK_TYPES)
 * @param {string} options.domain - Domain name for the operation
 * @param {boolean} [options.requiresAudit=false] - Whether audit is required
 * @param {boolean} [options.preferFree=false] - Prefer free models
 * @returns {Object} Decision object with primary model and optional auditor
 */
export function councilDecision({ taskType, domain, requiresAudit = false, preferFree = false }) {
  // Sandbox mode returns mock models
  if (isSandboxMode()) {
    return {
      domain,
      taskType,
      primary: createSandboxModel(taskType),
      auditor: requiresAudit ? createSandboxModel('AUDIT') : null,
      meta: {
        lowBalance: false,
        tier: 'SANDBOX',
        sandboxMode: true
      }
    };
  }

  let primaryModel;
  let auditModel = null;
  const shouldUseFree = isLowBalance() || preferFree;

  switch (taskType) {
    case TASK_TYPES.STRATEGY:
      primaryModel = shouldUseFree
        ? pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE)
        : MODEL_REGISTRY.PAID_CORE.STRATEGY;
      break;

    case TASK_TYPES.ARCHITECTURE:
      primaryModel = shouldUseFree
        ? pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE)
        : MODEL_REGISTRY.PAID_CORE.ARCHITECT;
      break;

    case TASK_TYPES.DEVELOPMENT:
      primaryModel = shouldUseFree
        ? MODEL_REGISTRY.ELITE_RESERVE.CODE_BACKUP
        : MODEL_REGISTRY.PAID_CORE.DEVELOPER;
      break;

    case TASK_TYPES.OPERATION:
      primaryModel = shouldUseFree
        ? pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE)
        : MODEL_REGISTRY.PAID_CORE.DEVELOPER;
      break;

    case TASK_TYPES.AUDIT:
      primaryModel = shouldUseFree
        ? MODEL_REGISTRY.FAST_OPS.QUICK_AUDIT
        : MODEL_REGISTRY.PAID_CORE.AUDITOR;
      break;

    case TASK_TYPES.FAST:
      primaryModel = pickAvailableModel(MODEL_REGISTRY.FAST_OPS);
      break;

    case TASK_TYPES.REASONING:
      primaryModel = MODEL_REGISTRY.ELITE_RESERVE.REASONING;
      break;

    case TASK_TYPES.DATA:
      primaryModel = MODEL_REGISTRY.FAST_OPS.DATA_SPECIALIST;
      break;

    default:
      console.warn(`[COUNCIL] Unknown task type: ${taskType}, using fallback`);
      primaryModel = pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE);
  }

  /**
   * 🔁 Fallback Safety
   * If no model found, fall back to any available model
   */
  if (!primaryModel || !primaryModel.model) {
    primaryModel = pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE) ||
                   pickAvailableModel(MODEL_REGISTRY.FAST_OPS) ||
                   pickAvailableModel(MODEL_REGISTRY.PAID_CORE);
  }

  // Final fallback to sandbox model
  if (!primaryModel) {
    primaryModel = createSandboxModel(taskType);
  }

  /**
   * 🔍 Cross-Audit Logic
   * Adds an audit model for verification if required
   */
  if (requiresAudit && taskType !== TASK_TYPES.AUDIT) {
    auditModel = shouldUseFree
      ? MODEL_REGISTRY.FAST_OPS.QUICK_AUDIT
      : MODEL_REGISTRY.PAID_CORE.AUDITOR;
    
    if (!auditModel?.model) {
      auditModel = pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE);
    }
  }

  return {
    domain,
    taskType,
    primary: primaryModel,
    auditor: auditModel,
    meta: {
      lowBalance: isLowBalance(),
      tier: primaryModel.tier,
      sandboxMode: false
    }
  };
}

/**
 * Get the best model for a specific capability
 * @param {string} capability - Required capability
 * @param {boolean} [preferFree=false] - Prefer free models
 * @returns {Object|null} Model configuration or null
 */
export function getModelForCapability(capability, preferFree = false) {
  return findModelByCapability(capability, preferFree || isLowBalance());
}

/**
 * 📦 Export Task Enum
 */
export { TASK_TYPES };
