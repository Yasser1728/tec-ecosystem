// ============================================
// Sovereign AI Agent - Main Runner
// Headless CLI agent with ledger tracking
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chatCompletion } from './openrouter.client.js';
import { getAllDomains, getTasksForDomain } from './task-map.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const LEDGER_PATH = path.join(__dirname, 'ledger.json');
const DOMAINS_ROOT = path.join(__dirname, '../../domains');

/**
 * Generate OS-safe filename from text
 * @param {string} text - Original text
 * @param {number} maxLength - Maximum filename length
 * @returns {string} Safe filename
 */
function safeSlug(text, maxLength = 50) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength);
}

/**
 * Read existing ledger or return empty array
 * @returns {Array} Ledger entries
 */
function readLedger() {
  try {
    if (fs.existsSync(LEDGER_PATH)) {
      const content = fs.readFileSync(LEDGER_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`⚠️  Error reading ledger: ${error.message}`);
  }
  return [];
}

/**
 * Append entry to ledger (crash-safe)
 * @param {Object} entry - Ledger entry
 */
function appendToLedger(entry) {
  const ledger = readLedger();
  ledger.push(entry);
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), 'utf-8');
}

/**
 * Ensure domain output directory exists
 * @param {string} domain - Domain name
 * @returns {string} Domain directory path
 */
function ensureDomainDir(domain) {
  const domainDir = path.join(DOMAINS_ROOT, domain);
  if (!fs.existsSync(domainDir)) {
    fs.mkdirSync(domainDir, { recursive: true });
    console.log(`📁 Created domain directory: ${domain}`);
  }
  return domainDir;
}

/**
 * Write output to domain directory
 * @param {string} domain - Domain name
 * @param {string} task - Task description
 * @param {string} content - Output content
 * @returns {string} Output file path
 */
function writeOutput(domain, task, content) {
  const domainDir = ensureDomainDir(domain);
  const filename = `${safeSlug(task)}.md`;
  const filepath = path.join(domainDir, filename);
  
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`📝 Wrote output to: domains/${domain}/${filename}`);
  
  return `domains/${domain}/${filename}`;
}

/**
 * Process a single task for a domain
 * @param {string} domain - Domain name
 * @param {string} task - Task description
 * @returns {Promise<Object>} Task result
 */
async function processTask(domain, task) {
  console.log(`\n🔄 Processing: ${domain} - ${task}`);
  
  const startTime = Date.now();
  
  try {
    // Create prompt for the task
    const prompt = `You are a professional technical writer for the TEC Ecosystem.
Domain: ${domain}
Task: ${task}

Generate comprehensive, production-ready documentation for this task.
Format your response in Markdown with proper sections, examples, and best practices.`;

    // Call OpenRouter LLM
    const result = await chatCompletion([
      { role: 'system', content: 'You are an expert technical writer and domain architect.' },
      { role: 'user', content: prompt }
    ]);

    // Write output to domain directory
    const outputFile = writeOutput(domain, task, result.text);

    // Create ledger entry
    const entry = {
      domain,
      task,
      model: result.model,
      usage: result.usage,
      output_file: outputFile,
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - startTime
    };

    // Append to ledger immediately (crash-safe)
    appendToLedger(entry);

    console.log(`✅ Completed: ${domain} - ${task}`);
    console.log(`   Model: ${result.model}`);
    console.log(`   Duration: ${entry.duration_ms}ms`);
    
    return { success: true, entry };
    
  } catch (error) {
    console.error(`❌ Failed: ${domain} - ${task}`);
    console.error(`   Error: ${error.message}`);
    
    // Log failure to ledger
    const entry = {
      domain,
      task,
      model: null,
      usage: null,
      output_file: null,
      error: error.message,
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - startTime
    };
    
    appendToLedger(entry);
    
    return { success: false, entry };
  }
}

/**
 * Run the sovereign agent for all domains
 */
async function runAgent() {
  console.log('\n🚀 Sovereign AI Agent Starting...\n');
  console.log('═'.repeat(60));
  
  // Initialize ledger if it doesn't exist
  if (!fs.existsSync(LEDGER_PATH)) {
    fs.writeFileSync(LEDGER_PATH, '[]', 'utf-8');
    console.log('📋 Initialized ledger.json');
  }

  const domains = getAllDomains();
  console.log(`📊 Processing ${domains.length} domains\n`);

  let totalTasks = 0;
  let successfulTasks = 0;
  let failedTasks = 0;

  for (const domain of domains) {
    const tasks = getTasksForDomain(domain);
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🏗️  Domain: ${domain} (${tasks.length} tasks)`);
    console.log('═'.repeat(60));

    for (const task of tasks) {
      totalTasks++;
      const result = await processTask(domain, task);
      
      if (result.success) {
        successfulTasks++;
      } else {
        failedTasks++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Final summary
  console.log('\n' + '═'.repeat(60));
  console.log('🎉 Sovereign AI Agent Completed');
  console.log('═'.repeat(60));
  console.log(`📊 Total tasks: ${totalTasks}`);
  console.log(`✅ Successful: ${successfulTasks}`);
  console.log(`❌ Failed: ${failedTasks}`);
  console.log(`📋 Ledger: ${LEDGER_PATH}`);
  console.log(`📁 Outputs: ${DOMAINS_ROOT}`);
  console.log('═'.repeat(60) + '\n');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAgent().catch(error => {
    console.error('\n💥 Critical error:', error);
    process.exit(1);
  });
}

export { runAgent, processTask, safeSlug };
