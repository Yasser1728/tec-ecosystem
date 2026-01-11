// ai-agent/core/council.js

/**
 * Council Engine
 * Responsible for:
 * - Model selection
 * - Cost-aware routing
 * - Automatic fallback
 * - Cross-model auditing
 */

import { MODEL_REGISTRY } from './config.js';

/**
 * 🧠 Task Types (Canonical)
 */
const TASK_TYPES = {
  STRATEGY: 'STRATEGY',
  ARCHITECTURE: 'ARCHITECTURE',
  DEVELOPMENT: 'DEVELOPMENT',
  OPERATION: 'OPERATION',
  AUDIT: 'AUDIT',
  FAST: 'FAST'
};

/**
 * 💰 Runtime State (will be linked to ledger.js later)
 */
let RUNTIME_STATE = {
  balance: 100, // virtual credits (placeholder)
  lowBalanceThreshold: 20
};

/**
 * 🔍 Utility: pick first available model from tier
 */
function pickAvailableModel(tier) {
  for (const key of Object.keys(tier)) {
    const model = tier[key];
    if (model?.model) return model;
  }
  return null;
}

/**
 * 🧮 Cost Guard
 */
function isLowBalance() {
  return RUNTIME_STATE.balance <= RUNTIME_STATE.lowBalanceThreshold;
}

/**
 * 🎯 Primary Decision Engine
 */
export function councilDecision({ taskType, domain, requiresAudit = false }) {
  let primaryModel;
  let auditModel = null;

  switch (taskType) {
    case TASK_TYPES.STRATEGY:
      primaryModel = isLowBalance()
        ? pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE)
        : MODEL_REGISTRY.PAID_CORE.STRATEGY;
      break;

    case TASK_TYPES.ARCHITECTURE:
      primaryModel = isLowBalance()
        ? pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE)
        : MODEL_REGISTRY.PAID_CORE.ARCHITECT;
      break;

    case TASK_TYPES.DEVELOPMENT:
      primaryModel = isLowBalance()
        ? MODEL_REGISTRY.ELITE_RESERVE.CODE_BACKUP
        : MODEL_REGISTRY.PAID_CORE.DEVELOPER;
      break;

    case TASK_TYPES.OPERATION:
      primaryModel = isLowBalance()
        ? pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE)
        : MODEL_REGISTRY.PAID_CORE.DEVELOPER;
      break;

    case TASK_TYPES.AUDIT:
      primaryModel = MODEL_REGISTRY.PAID_CORE.AUDITOR;
      break;

    case TASK_TYPES.FAST:
      primaryModel = pickAvailableModel(MODEL_REGISTRY.FAST_OPS);
      break;

    default:
      throw new Error(`[COUNCIL] Unknown task type: ${taskType}`);
  }

  /**
   * 🔁 Fallback Safety
   */
  if (!primaryModel) {
    primaryModel = pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE);
  }

  /**
   * 🔍 Cross-Audit Logic
   */
  if (requiresAudit && taskType !== TASK_TYPES.AUDIT) {
    auditModel =
      MODEL_REGISTRY.PAID_CORE.AUDITOR ||
      pickAvailableModel(MODEL_REGISTRY.ELITE_RESERVE);
  }

  return {
    domain,
    taskType,
    primary: primaryModel,
    auditor: auditModel,
    meta: {
      lowBalance: isLowBalance(),
      tier: primaryModel.tier
    }
  };
}

/**
 * 📦 Export Task Enum
 */
export { TASK_TYPES };
