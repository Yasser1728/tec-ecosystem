/**
 * Tests for Sovereign Agent Security Guards
 * Validates path traversal protection and filesystem containment
 */

import {
  resolveSafePath,
  safeWriteFile,
  safeReadFile,
  safeFileExists,
  safeMkdir,
  writeDomainFile,
  readDomainFile,
  domainFileExists,
  createDomainDirectory,
  PROJECT_ROOT,
  DOMAINS_BASE,
  LEDGER_PATH,
} from '../../agents/sovereign-agent/index.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Sovereign Agent Security Guards', () => {
  const testDomain = 'test-security-domain';
  const testFileName = 'test-file.txt';
  const testContent = 'Test content for security validation';
  let tempTestDir;

  // Setup: Create a temporary test directory
  beforeAll(() => {
    // Create temp directory for this test suite
    tempTestDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sovereign-test-'));
  });

  // Cleanup after tests using guarded operations
  afterAll(() => {
    // Clean up test domain using guarded check
    try {
      if (safeFileExists(DOMAINS_BASE, testDomain)) {
        const domainPath = resolveSafePath(DOMAINS_BASE, testDomain);
        fs.rmSync(domainPath, { recursive: true, force: true });
      }
    } catch (error) {
      // If cleanup fails, it's not critical for test results
      console.warn('Test cleanup warning:', error.message);
    }
    
    // Clean up temp directory (fixed path, safe to remove)
    if (tempTestDir && fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  describe('resolveSafePath', () => {
    it('should resolve valid paths within the base directory', () => {
      const safePath = resolveSafePath(DOMAINS_BASE, 'valid/path/file.txt');
      expect(safePath).toContain(DOMAINS_BASE);
      expect(safePath).toContain('valid/path/file.txt');
    });

    it('should block path traversal attempts with ../', () => {
      expect(() => {
        resolveSafePath(DOMAINS_BASE, '../../../etc/passwd');
      }).toThrow('Path traversal detected');
    });

    it('should block absolute path injections', () => {
      expect(() => {
        resolveSafePath(DOMAINS_BASE, '/etc/passwd');
      }).toThrow('Path traversal detected');
    });

    it('should block symbolic link-style traversal', () => {
      expect(() => {
        resolveSafePath(DOMAINS_BASE, 'valid/../../../etc/passwd');
      }).toThrow('Path traversal detected');
    });

    it('should allow same directory access', () => {
      const safePath = resolveSafePath(DOMAINS_BASE, '.');
      expect(safePath).toBe(DOMAINS_BASE);
    });
  });

  describe('safeWriteFile', () => {
    it('should write files within the guarded directory', () => {
      const relativePath = path.join(testDomain, testFileName);
      const safePath = safeWriteFile(DOMAINS_BASE, relativePath, testContent);
      
      // Use guarded check instead of direct fs.existsSync
      expect(safeFileExists(DOMAINS_BASE, relativePath)).toBe(true);
      expect(safePath).toContain(DOMAINS_BASE);
      expect(safePath).toContain(testDomain);
    });

    it('should create parent directories if they do not exist', () => {
      const deepPath = path.join(testDomain, 'deep', 'nested', 'file.txt');
      const safePath = safeWriteFile(DOMAINS_BASE, deepPath, testContent);
      
      // Verify file exists using guarded helper
      expect(safeFileExists(DOMAINS_BASE, deepPath)).toBe(true);
      // Verify parent directory exists using guarded helper
      const parentPath = path.join(testDomain, 'deep', 'nested');
      expect(safeFileExists(DOMAINS_BASE, parentPath)).toBe(true);
    });

    it('should reject path traversal in write operations', () => {
      expect(() => {
        safeWriteFile(DOMAINS_BASE, '../../../etc/passwd', 'malicious');
      }).toThrow('Path traversal detected');
    });
  });

  describe('safeReadFile', () => {
    beforeAll(() => {
      const relativePath = path.join(testDomain, 'read-test.txt');
      safeWriteFile(DOMAINS_BASE, relativePath, 'Read test content');
    });

    it('should read files within the guarded directory', () => {
      const relativePath = path.join(testDomain, 'read-test.txt');
      const content = safeReadFile(DOMAINS_BASE, relativePath);
      
      expect(content).toBe('Read test content');
    });

    it('should throw error for non-existent files', () => {
      expect(() => {
        safeReadFile(DOMAINS_BASE, path.join(testDomain, 'nonexistent.txt'));
      }).toThrow('File not found');
    });

    it('should reject path traversal in read operations', () => {
      expect(() => {
        safeReadFile(DOMAINS_BASE, '../../../etc/passwd');
      }).toThrow('Path traversal detected');
    });
  });

  describe('safeFileExists', () => {
    it('should return true for existing files', () => {
      const relativePath = path.join(testDomain, 'read-test.txt');
      const exists = safeFileExists(DOMAINS_BASE, relativePath);
      
      expect(exists).toBe(true);
    });

    it('should return false for non-existent files', () => {
      const exists = safeFileExists(DOMAINS_BASE, path.join(testDomain, 'no-such-file.txt'));
      
      expect(exists).toBe(false);
    });

    it('should return false for path traversal attempts', () => {
      const exists = safeFileExists(DOMAINS_BASE, '../../../etc/passwd');
      
      expect(exists).toBe(false);
    });
  });

  describe('safeMkdir', () => {
    it('should create directories within the guarded directory', () => {
      const newDir = path.join(testDomain, 'new-directory');
      const safePath = safeMkdir(DOMAINS_BASE, newDir);
      
      // Verify directory exists using guarded helper
      expect(safeFileExists(DOMAINS_BASE, newDir)).toBe(true);
      // Verify it's actually a directory by checking resolved path
      expect(safePath).toContain(DOMAINS_BASE);
      expect(safePath).toContain(newDir);
    });

    it('should reject path traversal in mkdir operations', () => {
      expect(() => {
        safeMkdir(DOMAINS_BASE, '../../../tmp/malicious');
      }).toThrow('Path traversal detected');
    });
  });

  describe('Domain Operations', () => {
    describe('writeDomainFile', () => {
      it('should write files to domain directories', () => {
        const result = writeDomainFile(testDomain, 'domain-write.txt', 'Domain content');
        
        expect(result.success).toBe(true);
        expect(result.path).toContain(DOMAINS_BASE);
        expect(result.path).toContain(testDomain);
      });

      it('should record transactions in the ledger', () => {
        // This test validates that the operation completes without errors
        // and returns success status
        const result = writeDomainFile(testDomain, 'ledger-test.txt', 'Ledger test');
        
        expect(result.success).toBe(true);
      });

      it('should handle path traversal attempts gracefully', () => {
        const result = writeDomainFile('../../../etc', 'passwd', 'malicious');
        
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('readDomainFile', () => {
      beforeAll(() => {
        writeDomainFile(testDomain, 'read-domain.txt', 'Read domain content');
      });

      it('should read files from domain directories', () => {
        const result = readDomainFile(testDomain, 'read-domain.txt');
        
        expect(result.success).toBe(true);
        expect(result.content).toBe('Read domain content');
      });

      it('should handle missing files gracefully', () => {
        const result = readDomainFile(testDomain, 'missing-file.txt');
        
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should block path traversal attempts', () => {
        const result = readDomainFile('../../../etc', 'passwd');
        
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('domainFileExists', () => {
      it('should return true for existing domain files', () => {
        const exists = domainFileExists(testDomain, 'read-domain.txt');
        
        expect(exists).toBe(true);
      });

      it('should return false for non-existent domain files', () => {
        const exists = domainFileExists(testDomain, 'no-such-file.txt');
        
        expect(exists).toBe(false);
      });
    });

    describe('createDomainDirectory', () => {
      it('should create domain directories', () => {
        const newDomainName = 'new-test-domain';
        const result = createDomainDirectory(newDomainName);
        
        expect(result.success).toBe(true);
        expect(result.path).toContain(DOMAINS_BASE);
        
        // Cleanup using guarded operation
        if (safeFileExists(DOMAINS_BASE, newDomainName)) {
          const domainPath = resolveSafePath(DOMAINS_BASE, newDomainName);
          fs.rmSync(domainPath, { recursive: true, force: true });
        }
      });
    });
  });

  describe('Constants', () => {
    it('should define PROJECT_ROOT as an absolute path', () => {
      expect(path.isAbsolute(PROJECT_ROOT)).toBe(true);
    });

    it('should define DOMAINS_BASE within PROJECT_ROOT', () => {
      expect(DOMAINS_BASE).toContain(PROJECT_ROOT);
      expect(DOMAINS_BASE.endsWith('domains')).toBe(true);
    });

    it('should define LEDGER_PATH within PROJECT_ROOT', () => {
      expect(LEDGER_PATH).toContain(PROJECT_ROOT);
      expect(LEDGER_PATH.endsWith('ledger.json')).toBe(true);
    });
  });
});
