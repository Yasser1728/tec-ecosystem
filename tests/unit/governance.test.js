import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { CONFIG } from '../../index.js';
import { runSovereignTaskMap } from '../../ai-agent/domain-task-map.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testServicePath = () => path.join(CONFIG.servicesFolder, 'governance.pi.js');
const ledgerPath = path.join(path.dirname(__dirname), '..', 'ledger_governance.json');

describe('Sovereign governance constraints', () => {
  // Track pre-existing files
  let servicePreExists;
  let ledgerPreExists;

  beforeEach(() => {
    // Record which files exist BEFORE tests
    servicePreExists = fs.existsSync(testServicePath());
    ledgerPreExists = fs.existsSync(ledgerPath);

    // Clean up files from previous tests ONLY
    // Only delete if file was NOT pre-existing (i.e., created by a previous test)
    if (!servicePreExists && fs.existsSync(testServicePath())) {
      fs.rmSync(testServicePath(), { force: true });
    }
    if (!ledgerPreExists && fs.existsSync(ledgerPath)) {
      fs.rmSync(ledgerPath, { force: true });
    }
  });

  afterEach(() => {
    // Clean up test artifacts
    // Only delete files that were created during tests (not pre-existing)
    if (!servicePreExists && fs.existsSync(testServicePath())) {
      fs.rmSync(testServicePath(), { force: true });
    }
    if (!ledgerPreExists && fs.existsSync(ledgerPath)) {
      fs.rmSync(ledgerPath, { force: true });
    }
  });

  test('domains are statically allowlisted', () => {
    const expectedDomains = [
      'tec.pi',
      'finance.pi',
      'market.pi',
      'wallet.pi',
      'commerce.pi',
      'analytics.pi',
      'security.pi',
      'crm.pi',
      'payments.pi',
      'tokens.pi',
      'nft.pi',
      'exchange.pi',
      'staking.pi',
      'governance.pi',
      'insurance.pi',
      'tax.pi',
      'legal.pi',
      'audit.pi',
      'research.pi',
      'marketing.pi',
      'support.pi',
      'hr.pi',
      'devops.pi',
      'infra.pi',
    ];

    expect(CONFIG.domains).toEqual(expectedDomains);
  });

  test('runs in sandbox mode by default', () => {
    expect(CONFIG.sandbox).toBe(true);
  });

  test('services folder is fixed to ai-agent/services', () => {
    const servicesSuffix = path.join('ai-agent', 'services');
    expect(CONFIG.servicesFolder.endsWith(servicesSuffix)).toBe(true);
  });

  test('rejects non-allowlisted domains', async () => {
    const maliciousDomain = 'malicious.pi';
    const task = 'Execute unauthorized task';

    await expect(runSovereignTaskMap(maliciousDomain, task))
      .rejects
      .toThrow('not in the sovereign allowlist');
  });

  test('runSovereignTaskMap creates sandbox service and logs ledger', async () => {
    const domain = 'governance.pi';
    const task = 'Test governance task';

    const result = await runSovereignTaskMap(domain, task);

    // Verify result
    expect(result.ok).toBe(true);
    expect(result.content).toContain(domain);
    expect(result.content).toContain(task);

    // Verify ledger was created and logged
    expect(fs.existsSync(ledgerPath)).toBe(true);

    let ledgerData;
    try {
      ledgerData = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to parse ledger file: ${error.message}`);
    }

    expect(ledgerData.events).toBeDefined();
    expect(ledgerData.events.length).toBeGreaterThan(0);

    // Use .at(-1) to get the last event
    const lastEvent = ledgerData.events.at(-1);
    expect(lastEvent.domain).toBe(domain);
    expect(lastEvent.task).toBe(task);
    expect(lastEvent.action).toBe('task_execution');
    expect(lastEvent.timestamp).toBeDefined();
  }, 10000); // 10 seconds timeout
});
