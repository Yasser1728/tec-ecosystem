// ============================================
// Sovereign Domain Task Map Runner (Option C)
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { councilDecision, TASK_TYPES } from './core/council.js';
import { executeModel } from './core/openrouter.js';
import { recordTransaction, generateFinalReport, getCostSignal } from './core/ledger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Domain Configuration
// ============================================
const DOMAINS = [
  'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
  'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
  'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
  'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
];

// Domain Prompt Map
const DOMAIN_PROMPTS = {
  'tec.pi': 'Generate core TEC ecosystem coordination logic with security and scalability',
  'finance.pi': 'Build financial transaction processing with compliance and audit trails',
  'market.pi': 'Create marketplace listing and search capabilities with fraud detection',
  'wallet.pi': 'Implement secure wallet operations with multi-sig support',
  'commerce.pi': 'Design e-commerce flows with inventory and payment integration',
  'analytics.pi': 'Build real-time analytics pipeline with data aggregation',
  'security.pi': 'Implement security monitoring and threat detection systems',
  'crm.pi': 'Create customer relationship management with automation',
  'payments.pi': 'Build payment processing gateway with retry logic',
  'tokens.pi': 'Implement token management with transfer and minting capabilities',
  'nft.pi': 'Create NFT marketplace with minting and trading features',
  'exchange.pi': 'Build cryptocurrency exchange with order matching',
  'staking.pi': 'Implement staking mechanisms with reward distribution',
  'governance.pi': 'Create governance voting system with proposal management',
  'insurance.pi': 'Build insurance policy management with claims processing',
  'tax.pi': 'Implement tax calculation and reporting with compliance',
  'legal.pi': 'Create legal document management with contract templates',
  'audit.pi': 'Build audit trail system with compliance reporting',
  'research.pi': 'Implement research tools with data collection and analysis',
  'marketing.pi': 'Create marketing automation with campaign management',
  'support.pi': 'Build customer support ticketing with knowledge base',
  'hr.pi': 'Implement HR management with employee records and payroll',
  'devops.pi': 'Create DevOps automation with CI/CD pipeline',
  'infra.pi': 'Build infrastructure monitoring with alerting'
};

// ============================================
// Helper: Load or Create Domain Service
// ============================================
async function loadDomainService(domain) {
  try {
    const servicePath = path.join(__dirname, 'services', `${domain}.js`);
    
    if (!fs.existsSync(servicePath)) {
      // Create sandbox service file
      const template = `// Sandbox service for ${domain}
export async function runDomainService(domain, prompt) {
  console.log(\`🟢 Running sandbox service for \${domain}\`);
  return { success: true, prompt };
}`;
      fs.writeFileSync(servicePath, template);
      console.log(`✅ Created sandbox service: ${domain}.js`);
    }
    
    const module = await import(`./services/${domain}.js`);
    return module.runDomainService || module.run;
  } catch (err) {
    console.error(`❌ Failed to load service for ${domain}:`, err.message);
    return null;
  }
}

// ============================================
// Main Runner: Sovereign Task Map
// ============================================
export async function runSovereignTaskMap() {
  console.log('\n🚀 Sovereign Task Map Runner - Booting...\n');
  
  const results = [];
  
  for (const domain of DOMAINS) {
    console.log(`\n🏗️ Processing domain: ${domain}`);
    
    try {
      // 1️⃣ Council Decision - Select model based on task type
      const decision = councilDecision({
        taskType: TASK_TYPES.DEVELOPMENT,
        domain,
        requiresAudit: true
      });
      
      if (!decision || !decision.primary) {
        console.warn(`⚠️ No model selected for ${domain}, skipping...`);
        results.push({ domain, success: false, error: 'No model selected' });
        continue;
      }
      
      console.log(`🤖 Selected model: ${decision.primary.name} (${decision.primary.tier})`);
      
      // 2️⃣ Build messages from domain prompt map
      const prompt = DOMAIN_PROMPTS[domain] || `Process tasks for ${domain} domain`;
      const messages = [
        { role: 'user', content: prompt }
      ];
      
      // 3️⃣ Execute model with correct signature
      const modelResult = await executeModel({
        model: decision.primary,
        messages,
        temperature: 0.2,
        domain,
        role: 'primary'
      });
      
      if (!modelResult.ok) {
        console.error(`❌ Model execution failed for ${domain}: ${modelResult.error}`);
        results.push({ domain, success: false, error: modelResult.error });
        continue;
      }
      
      // 4️⃣ Load and call domain service
      const domainService = await loadDomainService(domain);
      if (domainService) {
        try {
          await domainService(domain, prompt);
          console.log(`✅ Domain service executed for ${domain}`);
        } catch (serviceErr) {
          console.error(`⚠️ Domain service error for ${domain}:`, serviceErr.message);
          // Continue anyway - service execution is optional
        }
      }
      
      // 5️⃣ Record ledger transaction with correct signature
      recordTransaction({
        model: decision.primary,
        usage: modelResult.usage,
        domain,
        role: 'primary'
      });
      
      // 6️⃣ Check budget signal
      const costSignal = getCostSignal();
      if (costSignal.isLowBalance) {
        console.warn(`⚠️ Low balance warning: ${costSignal.remainingBalance.toFixed(2)} remaining`);
      }
      
      console.log(`✅ Domain ${domain} processed successfully`);
      results.push({ 
        domain, 
        success: true, 
        model: decision.primary.name,
        tokens: modelResult.usage?.total_tokens || 0
      });
      
    } catch (err) {
      // 7️⃣ Handle errors per-domain without aborting all domains
      console.error(`💥 Error processing ${domain}:`, err.message);
      results.push({ domain, success: false, error: err.message });
    }
  }
  
  // 8️⃣ Generate and persist final report
  console.log('\n📊 Generating final report...');
  const report = generateFinalReport();
  
  const logsPath = path.join(path.dirname(__dirname), 'ledger_full_log.json');
  fs.writeFileSync(logsPath, JSON.stringify(report.logs, null, 2));
  console.log(`📁 Full ledger logs saved to ${logsPath}`);
  
  console.log('\n📈 Sovereign Task Map Summary:');
  console.log(`Total Domains: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  console.log(`Total Tokens: ${report.summary.totalTokens}`);
  console.log(`Total Cost: $${report.summary.totalCost.toFixed(2)}`);
  console.log(`Final Balance: $${report.summary.finalBalance.toFixed(2)}`);
  
  return { results, report };
}

// ============================================
// Execute if run directly
// ============================================
if (import.meta.url === `file://${process.argv[1]}`) {
  runSovereignTaskMap().catch(err => {
    console.error('\n💥 Critical failure in Task Map Runner:', err);
    process.exit(1);
  });
}
