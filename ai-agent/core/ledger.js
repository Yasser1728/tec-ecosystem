/**
 * Sovereign Ledger System
 * Responsibilities:
 * - Real-time consumption tracking
 * - Budget enforcement
 * - Cost signals for the Council
 * - Transaction logging and reporting
 */

// Ledger state (In-memory)
let ledgerState = {
  totalTokens: 0,
  estimatedCost: 0.0,
  balance: 100.0, // Default available balance
  threshold: 20.0, // Safety threshold for cost optimization
  logs: [],
  sessionId: generateSessionId(),
  startTime: new Date().toISOString()
};

/**
 * Generate a unique session ID
 * @returns {string} Unique session identifier
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 🔄 Reset the ledger state
 * @param {Object} [options] - Reset options
 * @param {number} [options.balance=100] - Initial balance
 * @param {number} [options.threshold=20] - Low balance threshold
 */
export function resetLedger(options = {}) {
  ledgerState = {
    totalTokens: 0,
    estimatedCost: 0.0,
    balance: options.balance ?? 100.0,
    threshold: options.threshold ?? 20.0,
    logs: [],
    sessionId: generateSessionId(),
    startTime: new Date().toISOString()
  };
}

/**
 * 🧾 Record a Transaction
 * @param {Object} params - Transaction parameters
 * @param {Object} params.model - Model configuration
 * @param {Object} params.usage - Token usage information
 * @param {string} params.domain - Domain name
 * @param {string} params.role - Role (PRIMARY, AUDITOR, etc.)
 * @returns {Object} Transaction entry
 */
export function recordTransaction({ model, usage, domain, role }) {
  const promptTokens = usage?.prompt_tokens || 0;
  const completionTokens = usage?.completion_tokens || 0;
  const total = usage?.total_tokens || 0;

  // Calculate estimated cost based on model configuration
  const unitCost = model?.costPerCall || 0;
  
  ledgerState.totalTokens += total;
  ledgerState.estimatedCost += unitCost;
  ledgerState.balance -= unitCost;

  const entry = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    sessionId: ledgerState.sessionId,
    domain,
    role,
    model: model?.name || 'unknown',
    modelId: model?.model || 'unknown',
    tier: model?.tier || 'unknown',
    tokens: {
      prompt: promptTokens,
      completion: completionTokens,
      total
    },
    cost: unitCost,
    balanceAfter: ledgerState.balance
  };

  ledgerState.logs.push(entry);

  console.log(`[LEDGER] Transaction: ${model?.name || 'unknown'} | Cost: ${unitCost.toFixed(4)} | Balance: ${ledgerState.balance.toFixed(2)}`);
  
  return entry;
}

/**
 * 🚨 Cost Guard Signal
 * Informs the council if it should switch to free mode
 * @returns {Object} Cost signal information
 */
export function getCostSignal() {
  return {
    isLowBalance: ledgerState.balance <= ledgerState.threshold,
    remainingBalance: ledgerState.balance,
    totalSpent: ledgerState.estimatedCost,
    totalTokens: ledgerState.totalTokens,
    transactionCount: ledgerState.logs.length
  };
}

/**
 * 💰 Update balance
 * @param {number} amount - Amount to add (positive) or subtract (negative)
 */
export function updateBalance(amount) {
  ledgerState.balance += amount;
  console.log(`[LEDGER] Balance updated: ${amount > 0 ? '+' : ''}${amount} | New Balance: ${ledgerState.balance.toFixed(2)}`);
}

/**
 * 📊 Get Current State
 * @returns {Object} Current ledger state (read-only copy)
 */
export function getLedgerState() {
  return {
    ...ledgerState,
    logs: [...ledgerState.logs]
  };
}

/**
 * 📊 Final Report
 * Called at the end of workflow to print operation summary
 * @returns {Object} Final report with summary and logs
 */
export function generateFinalReport() {
  const endTime = new Date().toISOString();
  const duration = new Date(endTime) - new Date(ledgerState.startTime);
  
  return {
    summary: {
      sessionId: ledgerState.sessionId,
      startTime: ledgerState.startTime,
      endTime,
      durationMs: duration,
      totalTokens: ledgerState.totalTokens,
      totalCost: ledgerState.estimatedCost,
      finalBalance: ledgerState.balance,
      transactionCount: ledgerState.logs.length,
      averageTokensPerTransaction: ledgerState.logs.length > 0 
        ? Math.round(ledgerState.totalTokens / ledgerState.logs.length) 
        : 0
    },
    logs: ledgerState.logs,
    byDomain: groupLogsByDomain(),
    byTier: groupLogsByTier()
  };
}

/**
 * Group logs by domain
 * @returns {Object} Logs grouped by domain
 */
function groupLogsByDomain() {
  const grouped = {};
  for (const log of ledgerState.logs) {
    if (!grouped[log.domain]) {
      grouped[log.domain] = {
        count: 0,
        totalTokens: 0,
        totalCost: 0
      };
    }
    grouped[log.domain].count++;
    grouped[log.domain].totalTokens += log.tokens.total;
    grouped[log.domain].totalCost += log.cost;
  }
  return grouped;
}

/**
 * Group logs by tier
 * @returns {Object} Logs grouped by tier
 */
function groupLogsByTier() {
  const grouped = {};
  for (const log of ledgerState.logs) {
    if (!grouped[log.tier]) {
      grouped[log.tier] = {
        count: 0,
        totalTokens: 0,
        totalCost: 0
      };
    }
    grouped[log.tier].count++;
    grouped[log.tier].totalTokens += log.tokens.total;
    grouped[log.tier].totalCost += log.cost;
  }
  return grouped;
}
