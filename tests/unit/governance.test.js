import fs from 'node:fs';
import path from 'node:path';
import {
  ALLOWED_DOMAINS,
  SAFE_PATHS,
  domainTaskMap,
  validateDomain,
  getSafeServicePath,
  runSovereignTaskMap,
  listAllowedDomains,
  validateTaskMapIntegrity
} from '../../ai-agent/domain-task-map.js';

describe('🏛️ TEC Sovereign Governance Map', () => {
  const ledgerPath = SAFE_PATHS.ledger;
  const lifeServicePath = () => getSafeServicePath('life.pi');
  let servicePreExists = false;
  let ledgerPreExists = false;

  beforeEach(() => {
    servicePreExists = fs.existsSync(lifeServicePath());
    ledgerPreExists = fs.existsSync(ledgerPath);
    
    // ✅ Create base directories if they don't exist
    const serviceDir = path.dirname(lifeServicePath());
    const ledgerDir = path.dirname(ledgerPath);
    
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }
    if (!fs.existsSync(ledgerDir)) {
      fs.mkdirSync(ledgerDir, { recursive: true });
    }
    
    // Clean up files from previous tests ONLY
    if (!servicePreExists && fs.existsSync(lifeServicePath())) {
      fs.rmSync(lifeServicePath(), { force: true });
    }
    if (!ledgerPreExists && fs.existsSync(ledgerPath)) {
      fs.rmSync(ledgerPath, { force: true });
    }
  });

  afterEach(() => {
    if (!servicePreExists && fs.existsSync(lifeServicePath())) {
      fs.rmSync(lifeServicePath(), { force: true });
    }
    if (!ledgerPreExists && fs.existsSync(ledgerPath)) {
      fs.rmSync(ledgerPath, { force: true });
    }
  });

  test('ALLOWED_DOMAINS contains the 24 TEC domains', () => {
    expect(ALLOWED_DOMAINS).toHaveLength(24);
    expect(new Set(ALLOWED_DOMAINS).size).toBe(24);
    expect(ALLOWED_DOMAINS).toEqual(
      expect.arrayContaining(['tec.pi', 'life.pi', 'elite.pi', 'commerce.pi'])
    );
  });

  test('validateDomain enforces allowlist and blocks traversal', () => {
    expect(validateDomain('TEC.PI')).toBe('tec.pi');
    expect(() => validateDomain('unknown.pi')).toThrow(/Domain not allowed/i);
    expect(() => validateDomain('../etc/passwd')).toThrow(/SECURITY|path traversal/i);
  });

  test('getSafeServicePath resolves inside services root', () => {
    const servicePath = getSafeServicePath('life.pi');
    expect(servicePath.startsWith(SAFE_PATHS.servicesRoot)).toBe(true);
    expect(servicePath.endsWith('life.pi.js')).toBe(true);
    expect(() => getSafeServicePath('../escape')).toThrow(/SECURITY|path traversal/i);
  });

  test('runSovereignTaskMap creates sandbox service and logs ledger', async () => {
    // ✅ Verify domain exists in task map
    expect(domainTaskMap['life.pi']).toBeDefined();
    expect(Array.isArray(domainTaskMap['life.pi'])).toBe(true);
    expect(domainTaskMap['life.pi'].length).toBeGreaterThan(0);
    
    const task = domainTaskMap['life.pi'][0];
    const response = await runSovereignTaskMap('life.pi', task);

    expect(response?.ok).toBe(true);
    expect(response?.meta?.domain).toBe('life.pi');
    expect(response?.meta?.sandbox).toBe(true);
    expect(fs.existsSync(lifeServicePath())).toBe(true);

    // ✅ Verify ledger file exists before reading
    expect(fs.existsSync(ledgerPath)).toBe(true);
    
    let ledgerData;
    try {
      ledgerData = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to parse ledger file: ${error.message}`);
    }
    expect(Array.isArray(ledgerData.events)).toBe(true);
    expect(ledgerData.events.length).toBeGreaterThan(0);
    
    // ✅ Use modern array method
    const lastEvent = ledgerData.events.at(-1);
    expect(lastEvent.domain).toBe('life.pi');
    expect(lastEvent.task).toBe(task);
  }, 10000);

  test('runSovereignTaskMap rejects tasks outside the map', async () => {
    await expect(runSovereignTaskMap('life.pi', 'unauthorized task')).rejects.toThrow(
      /Task not approved/i
    );
  }, 5000);

  test('listAllowedDomains returns a copy of the allowlist', () => {
    const list = listAllowedDomains();
    expect(list).not.toBe(ALLOWED_DOMAINS);
    list.push('fake.pi');
    expect(ALLOWED_DOMAINS.includes('fake.pi')).toBe(false);
  });

  test('validateTaskMapIntegrity verifies every domain has tasks', () => {
    expect(validateTaskMapIntegrity()).toBe(true);
  });
});
