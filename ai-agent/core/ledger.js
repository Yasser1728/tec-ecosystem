/**
 * Sovereign Ledger System
 * Responsibilities:
 * - Real-time consumption tracking
 * - Budget enforcement
 * - Cost signals for the Council
 */

// الحالة اللحظية للتشغيل (In-memory)
let ledgerState = {
  totalTokens: 0,
  estimatedCost: 0.0,
  balance: 100.0, // الرصيد الافتراضي المتاح لهذه الدورة
  threshold: 20.0, // حد الأمان لبدء التقشف
  logs: []
};

/**
 * 🧾 Record a Transaction
 */
export function recordTransaction({ model, usage, domain, role }) {
  const promptTokens = usage?.prompt_tokens || 0;
  const completionTokens = usage?.completion_tokens || 0;
  const total = usage?.total_tokens || 0;

  // حساب التكلفة التقديرية (بناءً على تعريف الموديل في config.js)
  const unitCost = model?.costPerCall || 0;
  
  ledgerState.totalTokens += total;
  ledgerState.estimatedCost += unitCost;
  ledgerState.balance -= unitCost;

  const entry = {
    timestamp: new Date().toISOString(),
    domain,
    role,
    model: model.name,
    tokens: total,
    cost: unitCost
  };

  ledgerState.logs.push(entry);

  console.log(`[LEDGER] Record Added: ${model.name} | Cost: ${unitCost} | Remaining: ${ledgerState.balance.toFixed(2)}`);
  
  return entry;
}

/**
 * 🚨 Cost Guard Signal
 * يخبر المجلس إذا كان يجب التحول للنمط المجاني
 */
export function getCostSignal() {
  return {
    isLowBalance: ledgerState.balance <= ledgerState.threshold,
    remainingBalance: ledgerState.balance,
    totalSpent: ledgerState.estimatedCost
  };
}

/**
 * 📊 Final Report
 * يُستدعى في نهاية الـ Workflow لطباعة ملخص العملية
 */
export function generateFinalReport() {
  return {
    summary: {
      totalTokens: ledgerState.totalTokens,
      totalCost: ledgerState.estimatedCost,
      finalBalance: ledgerState.balance
    },
    logs: ledgerState.logs
  };
}
