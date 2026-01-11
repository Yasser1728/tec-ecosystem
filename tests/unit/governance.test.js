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
    if (servicePreExists) {
      fs.rmSync(lifeServicePath(), { force: true });
    }
    if (ledgerPreExists) {
      fs.rmSync(ledgerPath, { force: true });
    }
  });

  afterEach(() => {
    if (!servicePreExists) {
      fs.rmSync(lifeServicePath(), { force: true });
    }
    if (!ledgerPreExists) {
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
    const task = domainTaskMap['life.pi'][0];
    const response = await runSovereignTaskMap('life.pi', task);

    expect(response?.ok).toBe(true);
    expect(response?.meta?.domain).toBe('life.pi');
    expect(response?.meta?.sandbox).toBe(true);
    expect(fs.existsSync(lifeServicePath())).toBe(true);

    const ledgerData = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    expect(Array.isArray(ledgerData.events)).toBe(true);
    expect(ledgerData.events.at(-1).domain).toBe('life.pi');
    expect(ledgerData.events.at(-1).task).toBe(task);
  });

  test('runSovereignTaskMap rejects tasks outside the map', async () => {
    await expect(runSovereignTaskMap('life.pi', 'unauthorized task')).rejects.toThrow(
      /Task not approved/i
    );
  });

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
