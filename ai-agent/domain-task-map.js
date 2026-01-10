// ai-agent/domain-task-map.js

/**
 * Sovereign Task Map Orchestrator (Option C Architecture)
 * Responsibilities:
 * - Iterate configured domains
 * - Call council decision and TASK_TYPES
 * - Execute model operations
 * - Record transactions in ledger
 * - Load/create domain services
 * - Write ledger_full_log.json with security compliance
 */

import fs from 'fs';
import { councilDecision, TASK_TYPES } from './core/council.js';
import { executeModel } from './core/openrouter.js';
import { recordTransaction, generateFinalReport, getCostSignal } from './core/ledger.js';
import {
  validateDomain,
  getDomainServicePath,
  domainServiceExists,
  writeDomainService,
  writeFullLedgerLog
} from './core/fs-utils.js';

/**
 * Load or create a domain service with security validation
 */
async function loadOrCreateService(domain) {
  // Strict domain validation against allowlist
  validateDomain(domain);
  
  try {
    // Get safe path for domain service
    const servicePath = getDomainServicePath(domain);
    
    if (!domainServiceExists(domain)) {
      // Create sandbox service template if doesn't exist
      const template = `
export async function runDomainService(domain, prompt) {
  console.log('🟢 Running sandbox service for', domain);
  return { success: true, message: 'Sandbox mode', prompt };
}`;
      writeDomainService(domain, template.trim());
      console.log(`✅ Created sandbox domain file: ${domain}.js`);
    }
    
    // Dynamic import with safe path
    const module = await import(servicePath);
    return module.runDomainService;
  } catch (err) {
    console.error(`❌ Failed to load service for ${domain}:`, err.message);
    return null;
  }
}

/**
 * Select best available model (paid or free)
 */
function selectBestAvailableModel(decision) {
  // Use primary model from council decision
  if (decision.primary?.model) {
    return { type: decision.primary.tier, model: decision.primary };
  }
  
  // Fallback to sandbox mode
  console.warn('⚠️ No model available. Running in sandbox mode.');
  return { type: 'sandbox', model: null };
}

/**
 * Main Orchestrator: Run Sovereign Task Map
 * @param {Object} config - Configuration object with domains and settings
 */
export async function runSovereignTaskMap(config = {}) {
  console.log("\n🚀 Sovereign Task Map Orchestrator: Booting...\n");
  
  const {
    domains = [],
    sandbox = true,
    verbose = true
  } = config;
  
  // Validate all domains before processing
  for (const domain of domains) {
    try {
      validateDomain(domain);
    } catch (err) {
      console.error(`❌ Invalid domain ${domain}:`, err.message);
      throw err;
    }
  }
  
  if (verbose) {
    console.log(`📋 Processing ${domains.length} domains in ${sandbox ? 'sandbox' : 'production'} mode`);
  }
  
  for (const domain of domains) {
    console.log(`\n🏗️ Processing domain: ${domain}`);
    
    try {
      // 1️⃣ Council Decision - determine task type and model
      const decision = councilDecision({
        taskType: TASK_TYPES.DEVELOPMENT,
        domain,
        requiresAudit: true
      });
      
      if (verbose) {
        console.log(`🧠 Council decision: ${decision.taskType} (${decision.primary?.name || 'sandbox'})`);
      }
      
      // 2️⃣ Load or create domain service
      const runService = await loadOrCreateService(domain);
      if (!runService) {
        console.warn(`⚠️ Skipping domain ${domain} - service unavailable`);
        continue;
      }
      
      // 3️⃣ Select model
      const modelInfo = selectBestAvailableModel(decision);
      
      // 4️⃣ Prepare task prompt
      const taskPrompt = `Generate a scalable, secure, production-ready module for ${domain} using model: ${modelInfo.model?.name || 'Sandbox'}`;
      
      // 5️⃣ Execute model if available (otherwise run in sandbox)
      let result;
      if (modelInfo.model?.model && process.env.OPENROUTER_API_KEY) {
        try {
          const modelResponse = await executeModel({
            model: modelInfo.model,
            messages: [
              { role: 'system', content: 'You are a sovereign AI architect.' },
              { role: 'user', content: taskPrompt }
            ],
            temperature: 0.2,
            domain,
            role: 'primary'
          });
          
          if (modelResponse.ok) {
            result = { success: true, content: modelResponse.content, usage: modelResponse.usage };
            
            // Record transaction in ledger
            recordTransaction({
              model: modelInfo.model,
              usage: modelResponse.usage,
              domain,
              role: 'primary'
            });
          } else {
            console.warn(`⚠️ Model execution failed, falling back to sandbox for ${domain}`);
            result = await runService(domain, taskPrompt);
          }
        } catch (err) {
          console.error(`❌ Error executing model for ${domain}:`, err.message);
          result = await runService(domain, taskPrompt);
        }
      } else {
        // Sandbox mode - run service without AI
        result = await runService(domain, taskPrompt);
      }
      
      // 6️⃣ Budget control signal
      const costSignal = getCostSignal();
      if (costSignal.isLowBalance) {
        console.warn(`⚠️ Budget threshold reached for ${domain}. Remaining: ${costSignal.remainingBalance.toFixed(2)}`);
      }
      
      console.log(`✅ Domain ${domain} processed successfully.`);
      
    } catch (err) {
      console.error(`💥 Error processing domain ${domain}:`, err.message);
      // Continue with next domain instead of failing completely
    }
  }
  
  // 7️⃣ Generate final report
  const report = generateFinalReport();
  console.log("\n📊 Sovereign Task Map Final Report:");
  console.log(JSON.stringify(report.summary, null, 2));
  
  // 8️⃣ Save full logs using safe filesystem utility
  try {
    const logsPath = writeFullLedgerLog(report.logs);
    console.log(`📁 Full ledger logs saved to ${logsPath}`);
  } catch (err) {
    console.error('❌ Failed to write ledger logs:', err.message);
  }
  
  return report;
}
