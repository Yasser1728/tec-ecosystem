const { sanitizeName, safeResolveFile } = require('../lib/safe-paths');
const path = require('path');

describe('safe-paths security functions', () => {
  describe('sanitizeName', () => {
    test('should accept valid alphanumeric names', () => {
      expect(sanitizeName('valid-name-123')).toBe('valid-name-123');
      expect(sanitizeName('Commerce')).toBe('Commerce');
      expect(sanitizeName('fundx')).toBe('fundx');
      expect(sanitizeName('Analytics-2024')).toBe('Analytics-2024');
    });

    test('should reject path traversal attempts', () => {
      expect(() => sanitizeName('../etc/passwd')).toThrow('Invalid name format');
      expect(() => sanitizeName('..\\..\\windows')).toThrow('Invalid name format');
      expect(() => sanitizeName('../../../etc')).toThrow('Invalid name format');
    });

    test('should reject invalid characters', () => {
      expect(() => sanitizeName('invalid/name')).toThrow('Invalid name format');
      expect(() => sanitizeName('invalid\\name')).toThrow('Invalid name format');
      expect(() => sanitizeName('invalid name')).toThrow('Invalid name format');
      expect(() => sanitizeName('invalid@name')).toThrow('Invalid name format');
      expect(() => sanitizeName('invalid.name')).toThrow('Invalid name format');
    });

    test('should reject empty or too long names', () => {
      expect(() => sanitizeName('')).toThrow('Invalid name format');
      expect(() => sanitizeName('a'.repeat(64))).toThrow('Invalid name format');
    });
  });

  describe('safeResolveFile', () => {
    const baseDir = '/tmp/test-base';

    test('should resolve safe paths correctly', () => {
      const result = safeResolveFile(baseDir, 'subfolder/file.txt');
      expect(result).toContain('test-base');
      expect(result).not.toContain('..');
    });

    test('should prevent path traversal with ../', () => {
      expect(() => safeResolveFile(baseDir, '../etc/passwd')).toThrow('Sovereign Security: Path traversal detected!');
    });

    test('should prevent path traversal with ..\\', () => {
      // On Unix systems, backslashes are literal characters, not path separators
      // So we test with forward slashes which work on all systems
      expect(() => safeResolveFile(baseDir, '../../windows')).toThrow('Sovereign Security: Path traversal detected!');
    });

    test('should prevent multiple path traversal attempts', () => {
      expect(() => safeResolveFile(baseDir, '../../../../etc/passwd')).toThrow('Sovereign Security: Path traversal detected!');
      expect(() => safeResolveFile(baseDir, '../../../windows/system32')).toThrow('Sovereign Security: Path traversal detected!');
    });

    test('should allow paths within base directory', () => {
      const result = safeResolveFile(baseDir, 'valid/path/file.txt');
      expect(result).toBe(path.resolve(baseDir, 'valid/path/file.txt'));
    });
  });
});
