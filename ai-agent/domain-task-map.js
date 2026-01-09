import fs from 'fs';
import path from 'path';
import { CONFIG, loadService } from './index.js';
import { recordTransaction, generateFinalReport, getCostSignal } from './ai-agent/core/ledger.js';
import { executeModel } from './ai-agent/core/openrouter.js';

// كل دومين له مهمة محددة
const DOMAIN_TASK_MAP = {
  'tec.pi': 'Manage TEC core services & dashboard',
  'finance.pi': 'Connect financial modules & audit ledger',
  'market.pi': 'Setup marketplace logic & product modules',
  'wallet.pi': 'Integrate multi-wallet & transaction API',
  'commerce.pi': 'Build commerce modules & pricing engine',
  'analytics.pi': 'Setup analytics pipelines & metrics',
  'security.pi': 'Run security audit & configure policies',
  'crm.pi': 'Integrate CRM system & customer flows',
  'payments.pi': 'Setup payment gateway & token handling',
  'tokens.pi': 'Deploy token contracts & ledger sync',
  'nft.pi': 'NFT minting & collection management',
  'exchange.pi': 'Setup exchange & trading pairs',
  'staking.pi': 'Implement staking logic & reward system',
  'governance.pi': 'Governance contracts & voting modules',
  'insurance.pi': 'Insurance contracts & risk engine',
  'tax.pi': 'Tax reporting & compliance modules',
  'legal.pi': 'Legal documents & smart contracts audit',
  'audit.pi': 'Internal audit & ledger reconciliation',
  'research.pi': 'AI research pipelines & data management',
  'marketing.pi': 'Marketing automation & campaign tracking',
  'support.pi': 'Customer support flows & ticketing',
  'hr.pi': 'HR modules & employee management',
  'devops.pi': 'CI/CD pipelines & deployment scripts',
  'infra.pi': 'Infrastructure monitoring & scaling'
};

// تنفيذ مهمة لكل دومين مع OpenRouter
async function runDomainTask(domain) {
  console.log(`\n🏗️ Starting task for ${domain}`);
  const taskPrompt = DOMAIN_TASK_MAP[domain] || 'Default maintenance & sync task';
  const runService = await loadService(domain);
  if (!runService) return;

  try {
    // 🔹 Execute via OpenRouter
    // يحاول استخدام النماذج المدفوعة أولاً، ثم المجانية تلقائياً
    const result = await executeModel(taskPrompt, {
      domain,
      preferPaid: true,   // true = حاول المدفوع أولاً
      fallbackFree: true  // fallback للمجاني لو المدفوع مش متاح
    });

    // تشغيل الخدمة المحلية للدومين
    const serviceResult = await runService(domain, taskPrompt);

    // تسجيل المعاملة
    recordTransaction({
      domain,
      taskPrompt,
      result: serviceResult,
      modelUsed: result.model || 'free-reserve',
      sandbox: CONFIG.sandbox
    });

    if (getCostSignal().isLowBalance) {
      console.warn(`⚠️ Budget low for ${domain}. Using reserve AI model.`);
    }

    console.log(`✅ Task completed for ${domain}`);
  } catch (err) {
    console.error(`💥 Task failed for ${domain}:`, err.message);
  }
}

// Orchestrator لجميع الدومينات
export async function runSovereignTaskMap() {
  console.log('🚀 Running Sovereign Domain Task Map...');
  for (const domain of CONFIG.domains) {
    await runDomainTask(domain);
  }

  const report = generateFinalReport();
  const logsPath = path.join(process.cwd(), 'ledger_full_log.json');
  fs.writeFileSync(logsPath, JSON.stringify(report.logs, null, 2));
  console.log(`📊 Final report saved to ${logsPath}`);
}

// تشغيل مباشر لو هذا الملف تم تشغيله
if (import.meta.url === `file://${process.argv[1]}`) {
  runSovereignTaskMap().catch(err => {
    console.error('💥 Critical failure in Sovereign Task Map:', err);
    process.exit(1);
  });
}
