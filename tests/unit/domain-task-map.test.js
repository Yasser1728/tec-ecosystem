/**
 * Unit Tests for Domain Task Map
 * Tests the security guards and orchestration logic
 * 
 * Note: These tests validate the security functions without actual file system access
 * to avoid Codacy file access warnings.
 */

describe('Domain Task Map Security Guards', () => {
  // Import will be done dynamically to handle ES modules
  let domainTaskMap;
  
  beforeAll(async () => {
    // Dynamically import the module
    domainTaskMap = await import('../../ai-agent/domain-task-map.js');
  });

  describe('validateDomain', () => {
    it('should validate allowed production domains', () => {
      expect(domainTaskMap.validateDomain('tec.pi')).toBe('tec.pi');
      expect(domainTaskMap.validateDomain('security.pi')).toBe('security.pi');
      expect(domainTaskMap.validateDomain('finance.pi')).toBe('finance.pi');
    });

    it('should be case insensitive', () => {
      expect(domainTaskMap.validateDomain('TEC.PI')).toBe('tec.pi');
      expect(domainTaskMap.validateDomain('Finance.PI')).toBe('finance.pi');
    });

    it('should validate legacy domains for backward compatibility', () => {
      expect(domainTaskMap.validateDomain('docs')).toBe('docs');
      expect(domainTaskMap.validateDomain('security')).toBe('security');
      expect(domainTaskMap.validateDomain('DOCS')).toBe('docs');
    });

    it('should reject disallowed domains', () => {
      expect(() => domainTaskMap.validateDomain('malicious')).toThrow('domain not allowed');
      expect(() => domainTaskMap.validateDomain('../etc')).toThrow('domain not allowed');
      expect(() => domainTaskMap.validateDomain('invalid.domain')).toThrow('domain not allowed');
    });

    it('should reject empty or invalid domains', () => {
      expect(() => domainTaskMap.validateDomain('')).toThrow('domain is required');
      expect(() => domainTaskMap.validateDomain('   ')).toThrow('domain is required');
      expect(() => domainTaskMap.validateDomain(null)).toThrow('domain must be a string');
      expect(() => domainTaskMap.validateDomain(undefined)).toThrow('domain must be a string');
      expect(() => domainTaskMap.validateDomain(123)).toThrow('domain must be a string');
    });
  });

  describe('resolveSafePath', () => {
    it('should resolve safe relative paths within base directory', () => {
      const basePath = '/test/base';
      const safePath = domainTaskMap.resolveSafePath(basePath, 'test.txt');
      expect(safePath).toContain('test.txt');
      expect(safePath.startsWith(basePath)).toBe(true);
    });

    it('should resolve nested paths safely', () => {
      const basePath = '/test/base';
      const safePath = domainTaskMap.resolveSafePath(basePath, 'subdir', 'file.js');
      expect(safePath.startsWith(basePath)).toBe(true);
      expect(safePath).toContain('subdir');
      expect(safePath).toContain('file.js');
    });

    it('should reject absolute paths', () => {
      const basePath = '/test/base';
      expect(() => domainTaskMap.resolveSafePath(basePath, '/etc/passwd')).toThrow(
        'absolute paths are not allowed'
      );
      expect(() => domainTaskMap.resolveSafePath(basePath, '/var/log/system.log')).toThrow(
        'absolute paths are not allowed'
      );
    });

    it('should prevent path traversal attacks', () => {
      const basePath = '/test/base';
      expect(() => domainTaskMap.resolveSafePath(basePath, '../../../etc/passwd')).toThrow(
        'path traversal detected'
      );
      expect(() => domainTaskMap.resolveSafePath(basePath, '..', '..', 'etc', 'passwd')).toThrow(
        'path traversal detected'
      );
    });

    it('should reject non-string segments', () => {
      const basePath = '/test/base';
      expect(() => domainTaskMap.resolveSafePath(basePath, null)).toThrow(
        'path segment must be a string'
      );
      expect(() => domainTaskMap.resolveSafePath(basePath, 123)).toThrow(
        'path segment must be a string'
      );
      expect(() => domainTaskMap.resolveSafePath(basePath, undefined)).toThrow(
        'path segment must be a string'
      );
    });
  });

  describe('SOVEREIGN_DOMAINS constant', () => {
    it('should contain exactly 24 domains', () => {
      expect(domainTaskMap.SOVEREIGN_DOMAINS).toHaveLength(24);
    });

    it('should contain all expected domain suffixes', () => {
      domainTaskMap.SOVEREIGN_DOMAINS.forEach(domain => {
        expect(domain).toMatch(/\.pi$/);
      });
    });

    it('should have all domains in lowercase', () => {
      domainTaskMap.SOVEREIGN_DOMAINS.forEach(domain => {
        expect(domain).toBe(domain.toLowerCase());
      });
    });

    it('should have all domains in the allowlist', () => {
      domainTaskMap.SOVEREIGN_DOMAINS.forEach(domain => {
        expect(domainTaskMap.DOMAIN_ALLOWLIST.has(domain.toLowerCase())).toBe(true);
      });
    });

    it('should include core business domains', () => {
      const coreDomains = ['tec.pi', 'finance.pi', 'security.pi', 'commerce.pi'];
      coreDomains.forEach(domain => {
        expect(domainTaskMap.SOVEREIGN_DOMAINS).toContain(domain);
      });
    });
  });

  describe('DOMAIN_ALLOWLIST', () => {
    it('should be a Set', () => {
      expect(domainTaskMap.DOMAIN_ALLOWLIST).toBeInstanceOf(Set);
    });

    it('should contain production .pi domains', () => {
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('tec.pi')).toBe(true);
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('finance.pi')).toBe(true);
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('security.pi')).toBe(true);
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('wallet.pi')).toBe(true);
    });

    it('should contain legacy domains for backward compatibility', () => {
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('docs')).toBe(true);
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('security')).toBe(true);
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('qa')).toBe(true);
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('testing')).toBe(true);
    });

    it('should not contain malicious patterns', () => {
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('../etc')).toBe(false);
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('/etc/passwd')).toBe(false);
      expect(domainTaskMap.DOMAIN_ALLOWLIST.has('../../')).toBe(false);
    });
  });

  describe('Security - Module exports', () => {
    it('should export runSovereignTaskMap function', () => {
      expect(typeof domainTaskMap.runSovereignTaskMap).toBe('function');
    });

    it('should export security validation functions', () => {
      expect(typeof domainTaskMap.validateDomain).toBe('function');
      expect(typeof domainTaskMap.resolveSafePath).toBe('function');
    });

    it('should export constants', () => {
      expect(domainTaskMap.SOVEREIGN_DOMAINS).toBeDefined();
      expect(domainTaskMap.DOMAIN_ALLOWLIST).toBeDefined();
    });
  });
});
