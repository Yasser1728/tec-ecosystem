const fs = require('fs');
const path = require('path');
const { sanitizeName, safeResolveFile } = require('../lib/safe-paths');
const { generateDomains, domains } = require('../scripts/generate-domains');

describe('Path Sanitization - safe-paths', () => {
  describe('sanitizeName', () => {
    test('should accept valid alphanumeric names', () => {
      expect(sanitizeName('valid-name')).toBe('valid-name');
      expect(sanitizeName('ValidName123')).toBe('ValidName123');
      expect(sanitizeName('commerce')).toBe('commerce');
    });

    test('should reject path traversal attempts', () => {
      expect(() => sanitizeName('../')).toThrow('Invalid name format');
      expect(() => sanitizeName('../../etc/passwd')).toThrow('Invalid name format');
      expect(() => sanitizeName('..')).toThrow('Invalid name format');
    });

    test('should reject names with special characters', () => {
      expect(() => sanitizeName('name/with/slashes')).toThrow('Invalid name format');
      expect(() => sanitizeName('name\\with\\backslashes')).toThrow('Invalid name format');
      expect(() => sanitizeName('name with spaces')).toThrow('Invalid name format');
      expect(() => sanitizeName('name@special')).toThrow('Invalid name format');
    });

    test('should reject empty or too long names', () => {
      expect(() => sanitizeName('')).toThrow('Invalid name format');
      expect(() => sanitizeName('a'.repeat(64))).toThrow('Invalid name format');
    });
  });

  describe('safeResolveFile', () => {
    const baseDir = '/tmp/test-base';

    test('should resolve valid paths within base directory', () => {
      const resolved = safeResolveFile(baseDir, 'subdirectory');
      expect(resolved).toBe(path.join(baseDir, 'subdirectory'));
    });

    test('should block path traversal with ../', () => {
      expect(() => safeResolveFile(baseDir, '../outside')).toThrow('Sovereign Security: Path traversal detected!');
      expect(() => safeResolveFile(baseDir, '../../etc/passwd')).toThrow('Sovereign Security: Path traversal detected!');
      expect(() => safeResolveFile(baseDir, '..')).toThrow('Sovereign Security: Path traversal detected!');
    });

    test('should block path traversal with backslashes (Windows-style)', () => {
      // On Windows, backslashes are path separators. On Unix, they're literal characters.
      if (process.platform === 'win32') {
        expect(() => safeResolveFile(baseDir, '..\\..\\windows')).toThrow('Sovereign Security: Path traversal detected!');
        expect(() => safeResolveFile(baseDir, '..\\outside')).toThrow('Sovereign Security: Path traversal detected!');
      } else {
        // On Unix systems, backslashes are literal characters in filenames
        // path.resolve/path.join treat them as part of the filename, not path separators
        // The resulting path stays within the base directory
        const resolved = safeResolveFile(baseDir, '..\\outside');
        expect(resolved).toBe(path.resolve(baseDir, '..\\outside'));
      }
    });

    test('should handle nested valid paths', () => {
      const resolved = safeResolveFile(baseDir, 'sub1/sub2/file.txt');
      expect(resolved).toBe(path.join(baseDir, 'sub1', 'sub2', 'file.txt'));
    });
  });
});

describe('Domain Generation', () => {
  const testAppsDir = path.join(__dirname, '..', 'apps-test-temp');

  beforeAll(() => {
    // Clean up test directory before tests
    if (fs.existsSync(testAppsDir)) {
      fs.rmSync(testAppsDir, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    // Clean up test directory after tests
    if (fs.existsSync(testAppsDir)) {
      fs.rmSync(testAppsDir, { recursive: true, force: true });
    }
  });

  test('should have 24 domains defined', () => {
    expect(domains).toHaveLength(24);
  });

  test('should include expected domains', () => {
    expect(domains).toContain('Life');
    expect(domains).toContain('Commerce');
    expect(domains).toContain('Fundx');
    expect(domains).toContain('Explorer');
    expect(domains).toContain('Elite');
  });

  test('all domain names should pass sanitization', () => {
    domains.forEach(domain => {
      expect(() => sanitizeName(domain.toLowerCase())).not.toThrow();
    });
  });
});
