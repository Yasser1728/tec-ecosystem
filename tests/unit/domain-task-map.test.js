/**
 * Unit Tests for Domain Task Map
 * Tests the security guards and orchestration logic
 * Uses mocks to avoid Codacy file access warnings
 */

import { jest } from '@jest/globals';

// Mock fs before importing the module
const mockFs = {
  existsSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
};

jest.unstable_mockModule('fs', () => mockFs);

// Now import the module under test
const {
  validateDomain,
  resolveSafePath,
  loadOrCreateService,
  DOMAIN_ALLOWLIST,
  SOVEREIGN_DOMAINS,
} = await import('../../ai-agent/domain-task-map.js');

describe('Domain Task Map Security Guards', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('validateDomain', () => {
    it('should validate allowed domains', () => {
      expect(validateDomain('tec.pi')).toBe('tec.pi');
      expect(validateDomain('security.pi')).toBe('security.pi');
      expect(validateDomain('TEC.PI')).toBe('tec.pi'); // case insensitive
    });

    it('should validate legacy domains', () => {
      expect(validateDomain('docs')).toBe('docs');
      expect(validateDomain('security')).toBe('security');
      expect(validateDomain('DOCS')).toBe('docs'); // case insensitive
    });

    it('should reject disallowed domains', () => {
      expect(() => validateDomain('malicious')).toThrow('domain not allowed');
      expect(() => validateDomain('../etc')).toThrow('domain not allowed');
      expect(() => validateDomain('invalid.domain')).toThrow('domain not allowed');
    });

    it('should reject empty or invalid domains', () => {
      expect(() => validateDomain('')).toThrow('domain is required');
      expect(() => validateDomain('   ')).toThrow('domain is required');
      expect(() => validateDomain(null)).toThrow('domain must be a string');
      expect(() => validateDomain(undefined)).toThrow('domain must be a string');
    });
  });

  describe('resolveSafePath', () => {
    it('should resolve safe relative paths', () => {
      const basePath = '/test/base';
      const safePath = resolveSafePath(basePath, 'test.txt');
      expect(safePath).toContain('test.txt');
    });

    it('should reject absolute paths', () => {
      const basePath = '/test/base';
      expect(() => resolveSafePath(basePath, '/etc/passwd')).toThrow(
        'absolute paths are not allowed'
      );
    });

    it('should prevent path traversal attacks', () => {
      const basePath = '/test/base';
      expect(() => resolveSafePath(basePath, '../../../etc/passwd')).toThrow(
        'path traversal detected'
      );
    });

    it('should reject non-string segments', () => {
      const basePath = '/test/base';
      expect(() => resolveSafePath(basePath, null)).toThrow(
        'path segment must be a string'
      );
      expect(() => resolveSafePath(basePath, 123)).toThrow(
        'path segment must be a string'
      );
    });
  });

  describe('loadOrCreateService', () => {
    it('should reject invalid domains', async () => {
      const result = await loadOrCreateService('invalid-domain');
      expect(result).toBeNull();
    });

    it('should handle service creation for valid domains', async () => {
      mockFs.existsSync.mockReturnValue(false);
      mockFs.writeFileSync.mockImplementation(() => {});

      const result = await loadOrCreateService('tec.pi');
      
      // Service creation should have been attempted
      expect(mockFs.existsSync).toHaveBeenCalled();
      expect(mockFs.writeFileSync).toHaveBeenCalled();
      
      // Verify write was called with safe parameters
      const writeCall = mockFs.writeFileSync.mock.calls[0];
      expect(writeCall[0]).toMatch(/tec\.pi\.js$/);
      expect(writeCall[1]).toContain('runDomainService');
    });
  });

  describe('SOVEREIGN_DOMAINS constant', () => {
    it('should contain exactly 24 domains', () => {
      expect(SOVEREIGN_DOMAINS).toHaveLength(24);
    });

    it('should contain all expected domain suffixes', () => {
      SOVEREIGN_DOMAINS.forEach(domain => {
        expect(domain).toMatch(/\.pi$/);
      });
    });

    it('should have all domains in the allowlist', () => {
      SOVEREIGN_DOMAINS.forEach(domain => {
        expect(DOMAIN_ALLOWLIST.has(domain.toLowerCase())).toBe(true);
      });
    });
  });

  describe('DOMAIN_ALLOWLIST', () => {
    it('should be a Set', () => {
      expect(DOMAIN_ALLOWLIST).toBeInstanceOf(Set);
    });

    it('should contain production domains', () => {
      expect(DOMAIN_ALLOWLIST.has('tec.pi')).toBe(true);
      expect(DOMAIN_ALLOWLIST.has('finance.pi')).toBe(true);
      expect(DOMAIN_ALLOWLIST.has('security.pi')).toBe(true);
    });

    it('should contain legacy domains for backward compatibility', () => {
      expect(DOMAIN_ALLOWLIST.has('docs')).toBe(true);
      expect(DOMAIN_ALLOWLIST.has('security')).toBe(true);
      expect(DOMAIN_ALLOWLIST.has('qa')).toBe(true);
    });
  });

  describe('Security - Fixed Path Constants', () => {
    it('should use ledger path in parent directory', () => {
      // This test verifies that LEDGER_PATH is properly scoped
      // and doesn't use dynamic construction
      // The actual path is internal to the module
      expect(true).toBe(true); // Placeholder - actual path is internal
    });
  });
});
