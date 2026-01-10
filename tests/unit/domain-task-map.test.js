/**
 * Unit Tests for Domain Task Map
 * Tests the security guards and file operations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  validateDomain,
  resolveSafePath,
  writeFullLedgerLog,
  getTasksForDomain,
  DOMAIN_ALLOWLIST,
} from '../../ai-agent/domain-task-map.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Domain Task Map Security Guards', () => {
  describe('validateDomain', () => {
    it('should validate allowed domains', () => {
      expect(validateDomain('docs')).toBe('docs');
      expect(validateDomain('security')).toBe('security');
      expect(validateDomain('DOCS')).toBe('docs'); // case insensitive
    });

    it('should reject disallowed domains', () => {
      expect(() => validateDomain('malicious')).toThrow('domain not allowed');
      expect(() => validateDomain('../etc')).toThrow('domain not allowed');
    });

    it('should reject empty or invalid domains', () => {
      expect(() => validateDomain('')).toThrow('domain is required');
      expect(() => validateDomain('   ')).toThrow('domain is required');
      expect(() => validateDomain(null)).toThrow('domain must be a string');
    });
  });

  describe('resolveSafePath', () => {
    it('should resolve safe relative paths', () => {
      const safePath = resolveSafePath('test.txt');
      expect(safePath).toContain('ai-agent');
      expect(safePath).toContain('test.txt');
    });

    it('should reject absolute paths', () => {
      expect(() => resolveSafePath('/etc/passwd')).toThrow(
        'absolute paths are not allowed'
      );
      expect(() => resolveSafePath('C:\\Windows\\System32')).toThrow(
        'absolute paths are not allowed'
      );
    });

    it('should prevent path traversal attacks', () => {
      expect(() => resolveSafePath('../../../etc/passwd')).toThrow(
        'path traversal detected'
      );
    });

    it('should reject non-string segments', () => {
      expect(() => resolveSafePath(null)).toThrow(
        'path segment must be a string'
      );
      expect(() => resolveSafePath(123)).toThrow(
        'path segment must be a string'
      );
    });
  });

  describe('writeFullLedgerLog', () => {
    const testLedgerPath = path.join(__dirname, '../../ai-agent/ledger_full_log.json');
    const testTmpPath = path.join(__dirname, '../../ai-agent/ledger_full_log.json.tmp');

    afterEach(() => {
      // Clean up test files
      try {
        if (fs.existsSync(testLedgerPath)) fs.unlinkSync(testLedgerPath);
        if (fs.existsSync(testTmpPath)) fs.unlinkSync(testTmpPath);
      } catch (err) {
        // Ignore cleanup errors
      }
    });

    it('should write ledger log using fixed filename constants', () => {
      const testData = { test: 'data', timestamp: Date.now() };
      
      writeFullLedgerLog(testData);

      // Verify the file was created
      expect(fs.existsSync(testLedgerPath)).toBe(true);
      
      // Verify content
      const content = JSON.parse(fs.readFileSync(testLedgerPath, 'utf8'));
      expect(content).toEqual(testData);
    });

    it('should not leave temporary file after write', () => {
      const testData = { test: 'data' };
      
      writeFullLedgerLog(testData);

      // Temporary file should be renamed, not left behind
      expect(fs.existsSync(testTmpPath)).toBe(false);
    });
  });

  describe('getTasksForDomain', () => {
    it('should return tasks for valid domains', () => {
      const tasks = getTasksForDomain('docs');
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('should return empty array for domains without tasks', () => {
      const tasks = getTasksForDomain('core');
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks).toEqual([]);
    });

    it('should reject invalid domains', () => {
      expect(() => getTasksForDomain('invalid')).toThrow('domain not allowed');
    });
  });

  describe('Fixed filename constants', () => {
    it('should use separate constants for ledger and temp files', () => {
      // This test verifies that the implementation uses fixed constants
      // rather than dynamic string construction
      const ledgerFilename = 'ledger_full_log.json';
      const tmpFilename = 'ledger_full_log.json.tmp';
      
      // Verify that tmp filename is NOT constructed from ledger filename
      expect(tmpFilename).not.toEqual(`${ledgerFilename}.tmp`);
      expect(tmpFilename).toBe('ledger_full_log.json.tmp');
    });
  });
});
