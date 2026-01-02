/**
 * Tests for generate-domains script and safe-paths utilities
 */

const { sanitizeName, safeResolveFile } = require('../lib/safe-paths');
const path = require('path');

describe('safe-paths - sanitizeName', () => {
  it('should accept valid alphanumeric names with dashes', () => {
    expect(sanitizeName('fundx')).toBe('fundx');
    expect(sanitizeName('e-commerce')).toBe('e-commerce');
    expect(sanitizeName('test-123')).toBe('test-123');
    expect(sanitizeName('Domain1')).toBe('Domain1');
  });

  it('should reject names with path traversal attempts', () => {
    expect(() => sanitizeName('../etc')).toThrow('Invalid name format');
    expect(() => sanitizeName('../../etc/passwd')).toThrow('Invalid name format');
    expect(() => sanitizeName('..')).toThrow('Invalid name format');
  });

  it('should reject names with special characters', () => {
    expect(() => sanitizeName('test@domain')).toThrow('Invalid name format');
    expect(() => sanitizeName('test/domain')).toThrow('Invalid name format');
    expect(() => sanitizeName('test\\domain')).toThrow('Invalid name format');
    expect(() => sanitizeName('test:domain')).toThrow('Invalid name format');
  });

  it('should reject empty or too long names', () => {
    expect(() => sanitizeName('')).toThrow('Invalid name format');
    expect(() => sanitizeName('a'.repeat(64))).toThrow('Invalid name format');
  });
});

describe('safe-paths - safeResolveFile', () => {
  const baseDir = '/tmp/test-base';

  it('should resolve valid paths within base directory', () => {
    const result = safeResolveFile(baseDir, 'subdirectory');
    expect(result).toBe(path.resolve(baseDir, 'subdirectory'));
  });

  it('should resolve nested valid paths', () => {
    const result = safeResolveFile(baseDir, 'sub/nested/dir');
    expect(result).toBe(path.resolve(baseDir, 'sub/nested/dir'));
  });

  it('should block Unix-style path traversal with ../', () => {
    expect(() => safeResolveFile(baseDir, '../etc')).toThrow(
      'Sovereign Security: Path traversal detected!'
    );
    expect(() => safeResolveFile(baseDir, '../../etc/passwd')).toThrow(
      'Sovereign Security: Path traversal detected!'
    );
  });

  it('should block Windows-style path traversal with ..\\', () => {
    expect(() => safeResolveFile(baseDir, '..\\windows')).toThrow(
      'Sovereign Security: Path traversal detected!'
    );
    expect(() => safeResolveFile(baseDir, '..\\..\\windows\\system32')).toThrow(
      'Sovereign Security: Path traversal detected!'
    );
  });

  it('should handle root base directory correctly', () => {
    const result = safeResolveFile(baseDir, '.');
    expect(result).toBe(path.resolve(baseDir));
  });

  it('should normalize paths correctly', () => {
    const result = safeResolveFile(baseDir, './subdirectory');
    expect(result).toBe(path.resolve(baseDir, 'subdirectory'));
  });
});

describe('generate-domains integration', () => {
  it('should validate all 24 domain names', () => {
    const domains = [
      'fundx',
      'assets',
      'nbf',
      'insure',
      'vip',
      'life',
      'commerce',
      'ecommerce',
      'connection',
      'elite',
      'explorer',
      'brookfield',
      'zone',
      'dx',
      'nx',
      'system',
      'analytics',
      'alert',
      'titan',
      'epic',
      'legend',
      'nexus',
      'tec',
      'estate',
    ];

    domains.forEach((domain) => {
      expect(() => sanitizeName(domain)).not.toThrow();
    });
  });

  it('should safely resolve domain paths', () => {
    const baseDir = '/tmp/apps';
    const domains = ['fundx', 'assets', 'commerce'];

    domains.forEach((domain) => {
      const sanitized = sanitizeName(domain);
      const resolved = safeResolveFile(baseDir, sanitized);
      expect(resolved).toBe(path.resolve(baseDir, domain));
    });
  });
});
