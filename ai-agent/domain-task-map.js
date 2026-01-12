// Domain task map for the AI agent. Tasks are grouped per domain.
// Extend with concrete task definitions as they become available.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const domainTaskMap = Object.freeze({});

/**
 * Run a sovereign task for a specific domain
 * Enforces security constraints and logs to ledger
 * @param {string} domain - The domain to run the task for (must be in allowlist)
 * @param {string} task - The task description
 * @returns {Promise<{ok: boolean, content?: string, error?: string}>}
 */
export async function runSovereignTaskMap(domain, task) {
  // Security: Reject non-allowlisted domains
  if (!CONFIG.domains.includes(domain)) {
    throw new Error(`Domain ${domain} is not in the sovereign allowlist`);
  }

  // Create sandbox service file for the domain
  const servicesFolder = CONFIG.servicesFolder;
  const servicePath = path.join(servicesFolder, `${domain}.js`);

  // Ensure services folder exists
  if (!fs.existsSync(servicesFolder)) {
    fs.mkdirSync(servicesFolder, { recursive: true });
  }

  // Create sandbox service if it doesn't exist
  if (!fs.existsSync(servicePath)) {
    const template = [
      'export async function runDomainService(taskPrompt) {',
      `    console.log('[SANDBOX] Running service for ${domain}');`,
      `    return { ok: true, content: taskPrompt, usage: { total_tokens: 0 }, meta: { domain: "${domain}", sandbox: true, role: "PRIMARY" } };`,
      '}'
    ].join('\n');
    fs.writeFileSync(servicePath, template.trim());
  }

  // Log to ledger
  const ledgerPath = path.join(path.dirname(__dirname), 'ledger_governance.json');
  
  const event = {
    timestamp: new Date().toISOString(),
    domain,
    task,
    action: 'task_execution'
  };

  let ledgerData = { events: [] };
  if (fs.existsSync(ledgerPath)) {
    try {
      ledgerData = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    } catch (error) {
      // If ledger is corrupted, start fresh
      ledgerData = { events: [] };
    }
  }

  ledgerData.events.push(event);
  fs.writeFileSync(ledgerPath, JSON.stringify(ledgerData, null, 2));

  return {
    ok: true,
    content: `Task executed for ${domain}: ${task}`
  };
}
