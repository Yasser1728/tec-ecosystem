/**
 * Tests for Path Security Utilities
 * Validates path traversal prevention and input sanitization
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  sanitizeName,
  sanitizeTemplateText,
  safeResolveFile,
  safeCreateDirectory,
  safeWriteFile,
  isValidName,
  isSafePath
} = require('../../lib/utils/path-security');

describe('Path Security Utilities', () => {
  let testDir;
  
  beforeEach(() => {
    // Create a temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'path-security-test-'));
  });
  
  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
  
  describe('isValidName', () => {
    it('should accept valid alphanumeric names', () => {
      expect(isValidName('validname')).toBe(true);
      expect(isValidName('valid123')).toBe(true);
      expect(isValidName('ValidName')).toBe(true);
    });
    
    it('should accept names with hyphens and underscores', () => {
      expect(isValidName('valid-name')).toBe(true);
      expect(isValidName('valid_name')).toBe(true);
      expect(isValidName('valid-name_123')).toBe(true);
    });
    
    it('should reject names with dots', () => {
      expect(isValidName('invalid.name')).toBe(false);
      expect(isValidName('.hidden')).toBe(false);
      expect(isValidName('name.js')).toBe(false);
    });
    
    it('should reject names with path separators', () => {
      expect(isValidName('path/to/file')).toBe(false);
      expect(isValidName('..\\..\\file')).toBe(false);
      expect(isValidName('../parent')).toBe(false);
    });
    
    it('should reject names with special characters', () => {
      expect(isValidName('name@domain')).toBe(false);
      expect(isValidName('name$var')).toBe(false);
      expect(isValidName('name&ref')).toBe(false);
      expect(isValidName('name*wildcard')).toBe(false);
    });
    
    it('should reject empty or null names', () => {
      expect(isValidName('')).toBe(false);
      expect(isValidName(null)).toBe(false);
      expect(isValidName(undefined)).toBe(false);
    });
    
    it('should reject names exceeding max length', () => {
      const longName = 'a'.repeat(51);
      expect(isValidName(longName)).toBe(false);
      expect(isValidName(longName, 100)).toBe(true);
    });
    
    it('should reject non-string inputs', () => {
      expect(isValidName(123)).toBe(false);
      expect(isValidName({})).toBe(false);
      expect(isValidName([])).toBe(false);
    });
  });
  
  describe('sanitizeName', () => {
    it('should return valid names unchanged', () => {
      expect(sanitizeName('validname')).toBe('validname');
      expect(sanitizeName('valid-name_123')).toBe('valid-name_123');
    });
    
    it('should throw error for invalid names', () => {
      expect(() => sanitizeName('../parent')).toThrow('Invalid name');
      expect(() => sanitizeName('file.js')).toThrow('Invalid name');
      expect(() => sanitizeName('path/to/file')).toThrow('Invalid name');
      expect(() => sanitizeName('')).toThrow('Invalid name');
    });
    
    it('should throw specific error for non-string input', () => {
      expect(() => sanitizeName(123)).toThrow('Name must be a string');
      expect(() => sanitizeName(null)).toThrow('Name must be a string');
    });
  });
  
  describe('sanitizeTemplateText', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeTemplateText('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });
    
    it('should escape single quotes and backticks', () => {
      expect(sanitizeTemplateText("it's")).toBe('it&#x27;s');
      expect(sanitizeTemplateText('`template`')).toBe('&#96;template&#96;');
    });
    
    it('should escape backslashes', () => {
      expect(sanitizeTemplateText('path\\to\\file')).toBe('path&#92;to&#92;file');
    });
    
    it('should return empty string for non-string input', () => {
      expect(sanitizeTemplateText(null)).toBe('');
      expect(sanitizeTemplateText(undefined)).toBe('');
      expect(sanitizeTemplateText(123)).toBe('');
    });
    
    it('should handle normal text without special characters', () => {
      expect(sanitizeTemplateText('Hello World')).toBe('Hello World');
      expect(sanitizeTemplateText('Test123')).toBe('Test123');
    });
  });
  
  describe('safeResolveFile', () => {
    it('should resolve paths within base directory', () => {
      const safePath = safeResolveFile(testDir, 'subdir', 'file.txt');
      expect(safePath).toContain(testDir);
      expect(safePath).toContain('subdir');
      expect(safePath).toContain('file.txt');
    });
    
    it('should prevent path traversal with ..', () => {
      expect(() => {
        safeResolveFile(testDir, '..', 'outside');
      }).toThrow('Path traversal detected');
      
      expect(() => {
        safeResolveFile(testDir, 'subdir', '..', '..', 'outside');
      }).toThrow('Path traversal detected');
    });
    
    it('should prevent absolute path injection', () => {
      const outsidePath = '/etc/passwd';
      expect(() => {
        safeResolveFile(testDir, outsidePath);
      }).toThrow('Path traversal detected');
    });
    
    it('should handle multiple path segments', () => {
      const safePath = safeResolveFile(testDir, 'level1', 'level2', 'file.txt');
      expect(safePath).toContain(testDir);
      expect(safePath).toContain(path.join('level1', 'level2', 'file.txt'));
    });
    
    it('should normalize paths correctly', () => {
      const safePath = safeResolveFile(testDir, 'sub/./dir/../dir', 'file.txt');
      expect(safePath).toContain(testDir);
      expect(safePath).toContain(path.join('sub', 'dir', 'file.txt'));
    });
    
    it('should reject non-absolute base directory', () => {
      expect(() => {
        safeResolveFile('relative/path', 'file.txt');
      }).toThrow('Base directory must be an absolute path');
    });
    
    it('should allow resolving to base directory itself', () => {
      const safePath = safeResolveFile(testDir);
      expect(safePath).toBe(path.normalize(testDir));
    });
  });
  
  describe('safeCreateDirectory', () => {
    it('should create directory with valid name', () => {
      const dirPath = safeCreateDirectory(testDir, 'newdir');
      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });
    
    it('should create nested directories', () => {
      const dir1 = safeCreateDirectory(testDir, 'level1');
      const dir2 = safeCreateDirectory(dir1, 'level2');
      expect(fs.existsSync(dir2)).toBe(true);
    });
    
    it('should reject invalid directory names', () => {
      expect(() => {
        safeCreateDirectory(testDir, '../outside');
      }).toThrow('Invalid name');
      
      expect(() => {
        safeCreateDirectory(testDir, 'dir.name');
      }).toThrow('Invalid name');
    });
    
    it('should handle existing directories gracefully', () => {
      const dirPath = safeCreateDirectory(testDir, 'existingdir');
      expect(() => {
        safeCreateDirectory(testDir, 'existingdir');
      }).not.toThrow();
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });
  
  describe('safeWriteFile', () => {
    it('should write file with valid name', () => {
      const content = 'test content';
      const filePath = safeWriteFile(testDir, 'testfile', content);
      
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(content);
    });
    
    it('should reject invalid file names', () => {
      expect(() => {
        safeWriteFile(testDir, '../outside', 'content');
      }).toThrow('Invalid name');
      
      expect(() => {
        safeWriteFile(testDir, 'file.js', 'content');
      }).toThrow('Invalid name');
    });
    
    it('should write file with options', () => {
      const content = 'test content';
      const filePath = safeWriteFile(testDir, 'testfile2', content, { 
        encoding: 'utf8' 
      });
      
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(content);
    });
  });
  
  describe('isSafePath', () => {
    it('should return true for safe existing paths', () => {
      const dirPath = safeCreateDirectory(testDir, 'safedir');
      expect(isSafePath(testDir, 'safedir')).toBe(true);
    });
    
    it('should return false for paths outside base directory', () => {
      expect(isSafePath(testDir, '../outside')).toBe(false);
    });
    
    it('should return false for non-existing paths', () => {
      expect(isSafePath(testDir, 'nonexistent')).toBe(false);
    });
  });
  
  describe('Path Traversal Attack Scenarios', () => {
    it('should prevent directory traversal with encoded characters', () => {
      // URL-encoded ../ is %2e%2e%2f
      // While this particular encoding won't work in the file system,
      // the regex validation should catch path separators
      expect(() => sanitizeName('..%2f')).toThrow();
      expect(() => sanitizeName('%2e%2e')).toThrow();
    });
    
    it('should prevent null byte injection', () => {
      expect(() => sanitizeName('file\x00.txt')).toThrow();
    });
    
    it('should prevent unicode path separator', () => {
      expect(() => sanitizeName('file\u2044name')).toThrow();
    });
    
    it('should prevent Windows-style path traversal', () => {
      // On Unix systems, backslashes are literal characters, not path separators
      // So this test is more relevant for cross-platform validation
      // The path.normalize will handle platform-specific separators
      if (path.sep === '\\') {
        // Windows system
        expect(() => safeResolveFile(testDir, '..\\..\\windows')).toThrow();
      } else {
        // Unix system - backslashes are literal, test path with forward slashes
        expect(() => safeResolveFile(testDir, '../../windows')).toThrow();
      }
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle maximum path length names', () => {
      const maxName = 'a'.repeat(50);
      expect(isValidName(maxName)).toBe(true);
      expect(() => sanitizeName(maxName)).not.toThrow();
    });
    
    it('should handle single character names', () => {
      expect(isValidName('a')).toBe(true);
      expect(() => sanitizeName('a')).not.toThrow();
    });
    
    it('should handle names with leading/trailing hyphens', () => {
      expect(isValidName('-name')).toBe(true);
      expect(isValidName('name-')).toBe(true);
    });
  });
});
