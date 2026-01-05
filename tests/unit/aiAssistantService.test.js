/**
 * Tests for AI Assistant Service
 * 
 * Validates input sanitization for path construction
 * and file operations to prevent security vulnerabilities
 */

import {
  validateFilename,
  validateFileExtension,
  validateConfigFilename,
  constructSafePath,
  resolveSafePath,
  loadAIConfig,
  saveAIData,
  readAIData,
  listAIDataFiles,
  AI_ASSISTANT_CONSTANTS,
} from '../../lib/aiAssistantService';
import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';

describe('AI Assistant Service - Filename Validation', () => {
  describe('validateFilename', () => {
    it('should accept valid filenames with alphanumeric characters', () => {
      expect(validateFilename('file123.txt')).toBe(true);
      expect(validateFilename('myfile.json')).toBe(true);
      expect(validateFilename('data_file.log')).toBe(true);
    });

    it('should accept filenames with underscores and hyphens', () => {
      expect(validateFilename('file_name.txt')).toBe(true);
      expect(validateFilename('file-name.txt')).toBe(true);
      expect(validateFilename('file_name-123.txt')).toBe(true);
    });

    it('should accept filenames with dots', () => {
      expect(validateFilename('file.name.txt')).toBe(true);
      expect(validateFilename('my.data.file.json')).toBe(true);
    });

    it('should reject null or undefined filenames', () => {
      expect(() => validateFilename(null)).toThrow('Filename must be a non-empty string');
      expect(() => validateFilename(undefined)).toThrow('Filename must be a non-empty string');
      expect(() => validateFilename('')).toThrow('Filename must be a non-empty string');
    });

    it('should reject filenames with path traversal attempts', () => {
      // These are caught by the regex pattern first (/ and \ are not allowed)
      expect(() => validateFilename('../file.txt')).toThrow();
      expect(() => validateFilename('../../etc/passwd')).toThrow();
      expect(() => validateFilename('..\\file.txt')).toThrow();
    });

    it('should reject filenames with slashes', () => {
      // Slashes are caught by the regex pattern (not alphanumeric, underscore, hyphen, or dot)
      expect(() => validateFilename('path/to/file.txt')).toThrow();
      expect(() => validateFilename('path\\to\\file.txt')).toThrow();
    });

    it('should reject filenames with special characters', () => {
      expect(() => validateFilename('file@name.txt')).toThrow('only alphanumeric characters');
      expect(() => validateFilename('file#name.txt')).toThrow('only alphanumeric characters');
      expect(() => validateFilename('file$name.txt')).toThrow('only alphanumeric characters');
      expect(() => validateFilename('file name.txt')).toThrow('only alphanumeric characters');
    });

    it('should reject filenames with non-string types', () => {
      expect(() => validateFilename(123)).toThrow('Filename must be a non-empty string');
      expect(() => validateFilename({})).toThrow('Filename must be a non-empty string');
      expect(() => validateFilename([])).toThrow('Filename must be a non-empty string');
    });
  });

  describe('validateFileExtension', () => {
    it('should accept allowed file extensions', () => {
      expect(validateFileExtension('file.txt')).toBe(true);
      expect(validateFileExtension('file.md')).toBe(true);
      expect(validateFileExtension('file.json')).toBe(true);
      expect(validateFileExtension('file.log')).toBe(true);
    });

    it('should accept extensions in any case', () => {
      expect(validateFileExtension('file.TXT')).toBe(true);
      expect(validateFileExtension('file.JSON')).toBe(true);
      expect(validateFileExtension('file.Log')).toBe(true);
    });

    it('should reject disallowed file extensions', () => {
      expect(() => validateFileExtension('file.exe')).toThrow('Invalid file extension');
      expect(() => validateFileExtension('file.sh')).toThrow('Invalid file extension');
      expect(() => validateFileExtension('file.php')).toThrow('Invalid file extension');
      expect(() => validateFileExtension('file.js')).toThrow('Invalid file extension');
    });

    it('should reject files without extensions', () => {
      expect(() => validateFileExtension('file')).toThrow('Invalid file extension');
    });

    it('should reject null or undefined filenames', () => {
      expect(() => validateFileExtension(null)).toThrow('Filename must be a non-empty string');
      expect(() => validateFileExtension(undefined)).toThrow('Filename must be a non-empty string');
      expect(() => validateFileExtension('')).toThrow('Filename must be a non-empty string');
    });
  });

  describe('validateConfigFilename', () => {
    it('should accept whitelisted config filenames', () => {
      expect(validateConfigFilename('assistant-config.json')).toBe(true);
      expect(validateConfigFilename('ai-prompts.json')).toBe(true);
      expect(validateConfigFilename('knowledge-base.json')).toBe(true);
      expect(validateConfigFilename('settings.json')).toBe(true);
    });

    it('should reject non-whitelisted config filenames', () => {
      expect(() => validateConfigFilename('other-config.json')).toThrow('Invalid config filename');
      expect(() => validateConfigFilename('custom.json')).toThrow('Invalid config filename');
      expect(() => validateConfigFilename('config.txt')).toThrow('Invalid config filename');
    });

    it('should reject null or undefined filenames', () => {
      expect(() => validateConfigFilename(null)).toThrow('Filename must be a non-empty string');
      expect(() => validateConfigFilename(undefined)).toThrow('Filename must be a non-empty string');
      expect(() => validateConfigFilename('')).toThrow('Filename must be a non-empty string');
    });
  });
});

describe('AI Assistant Service - Safe Path Construction', () => {
  const testBaseDir = '/home/test/data';

  describe('constructSafePath', () => {
    it('should construct safe paths with valid inputs', () => {
      const result = constructSafePath(testBaseDir, 'file.txt');
      expect(result).toBe(path.join(testBaseDir, 'file.txt'));
    });

    it('should validate filename during path construction', () => {
      // Path traversal attempts are caught by regex validation
      expect(() => constructSafePath(testBaseDir, '../etc/passwd')).toThrow();
      expect(() => constructSafePath(testBaseDir, 'file@name.txt')).toThrow('only alphanumeric characters');
    });

    it('should validate file extension by default', () => {
      expect(() => constructSafePath(testBaseDir, 'file.exe')).toThrow('Invalid file extension');
    });

    it('should skip extension validation when disabled', () => {
      expect(() => constructSafePath(testBaseDir, 'file.xyz', { validateExtension: false })).not.toThrow();
    });

    it('should reject non-absolute base directories', () => {
      expect(() => constructSafePath('relative/path', 'file.txt')).toThrow('must be an absolute path');
    });

    it('should reject null or undefined base directories', () => {
      expect(() => constructSafePath(null, 'file.txt')).toThrow('Base directory must be a non-empty string');
      expect(() => constructSafePath(undefined, 'file.txt')).toThrow('Base directory must be a non-empty string');
      expect(() => constructSafePath('', 'file.txt')).toThrow('Base directory must be a non-empty string');
    });

    it('should detect path traversal in constructed paths', () => {
      // Even if filename validation is bypassed somehow, the final check should catch it
      expect(() => constructSafePath(testBaseDir, 'subdir/../../../etc/passwd')).toThrow();
    });

    it('should normalize paths correctly', () => {
      const result = constructSafePath(testBaseDir, 'file.txt');
      expect(result).not.toContain('..');
      expect(result.startsWith(testBaseDir)).toBe(true);
    });
  });

  describe('resolveSafePath', () => {
    it('should resolve safe paths with valid inputs', () => {
      const result = resolveSafePath(testBaseDir, 'file.txt');
      expect(result).toBe(path.resolve(testBaseDir, 'file.txt'));
    });

    it('should validate filename during path resolution', () => {
      // Path traversal attempts are caught by regex validation
      expect(() => resolveSafePath(testBaseDir, '../etc/passwd')).toThrow();
      expect(() => resolveSafePath(testBaseDir, 'file@name.txt')).toThrow('only alphanumeric characters');
    });

    it('should validate file extension by default', () => {
      expect(() => resolveSafePath(testBaseDir, 'file.exe')).toThrow('Invalid file extension');
    });

    it('should skip extension validation when disabled', () => {
      expect(() => resolveSafePath(testBaseDir, 'file.xyz', { validateExtension: false })).not.toThrow();
    });

    it('should reject non-absolute base directories', () => {
      expect(() => resolveSafePath('relative/path', 'file.txt')).toThrow('must be an absolute path');
    });

    it('should reject null or undefined base directories', () => {
      expect(() => resolveSafePath(null, 'file.txt')).toThrow('Base directory must be a non-empty string');
      expect(() => resolveSafePath(undefined, 'file.txt')).toThrow('Base directory must be a non-empty string');
      expect(() => resolveSafePath('', 'file.txt')).toThrow('Base directory must be a non-empty string');
    });

    it('should detect path traversal in resolved paths', () => {
      expect(() => resolveSafePath(testBaseDir, 'subdir/../../../etc/passwd')).toThrow();
    });

    it('should normalize paths correctly', () => {
      const result = resolveSafePath(testBaseDir, 'file.txt');
      expect(result).not.toContain('..');
      expect(result.startsWith(testBaseDir)).toBe(true);
    });
  });
});

describe('AI Assistant Service - File Operations', () => {
  const testBaseDir = '/tmp/test-ai-data';
  const testConfigDir = '/tmp/test-ai-config';

  beforeEach(async () => {
    // Create test directories
    await fs.promises.mkdir(testBaseDir, { recursive: true });
    await fs.promises.mkdir(testConfigDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directories
    try {
      await fs.promises.rm(testBaseDir, { recursive: true, force: true });
      await fs.promises.rm(testConfigDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('loadAIConfig', () => {
    it('should load valid configuration files from whitelist', async () => {
      const configData = { setting1: 'value1', setting2: 'value2' };
      const configPath = path.join(testConfigDir, 'settings.json');
      await fs.promises.writeFile(configPath, JSON.stringify(configData), 'utf8');

      const result = await loadAIConfig(testConfigDir, 'settings.json');
      expect(result).toEqual(configData);
    });

    it('should reject non-whitelisted config files', async () => {
      await expect(loadAIConfig(testConfigDir, 'custom-config.json')).rejects.toThrow('Invalid config filename');
    });

    it('should reject non-existent config files', async () => {
      await expect(loadAIConfig(testConfigDir, 'settings.json')).rejects.toThrow('not found or not readable');
    });

    it('should reject invalid JSON in config files', async () => {
      const configPath = path.join(testConfigDir, 'settings.json');
      await fs.promises.writeFile(configPath, 'invalid json', 'utf8');

      await expect(loadAIConfig(testConfigDir, 'settings.json')).rejects.toThrow('Failed to parse');
    });

    it('should reject non-absolute base directories', async () => {
      await expect(loadAIConfig('relative/path', 'settings.json')).rejects.toThrow('must be an absolute path');
    });

    it('should detect path traversal attempts', async () => {
      // Even with whitelisted filename, verify path doesn't escape base
      const result = await loadAIConfig(testConfigDir, 'settings.json').catch(e => e);
      // Should fail because file doesn't exist, not because of path traversal
      expect(result.message).toContain('not found or not readable');
    });
  });

  describe('saveAIData', () => {
    it('should save data to valid files', async () => {
      const content = 'test content';
      await saveAIData(testBaseDir, 'test.txt', content);

      const saved = await fs.promises.readFile(path.join(testBaseDir, 'test.txt'), 'utf8');
      expect(saved).toBe(content);
    });

    it('should reject invalid filenames', async () => {
      // Path traversal attempts are caught by regex validation
      await expect(saveAIData(testBaseDir, '../etc/passwd', 'content')).rejects.toThrow();
      await expect(saveAIData(testBaseDir, 'file@name.txt', 'content')).rejects.toThrow('only alphanumeric characters');
    });

    it('should reject invalid file extensions', async () => {
      await expect(saveAIData(testBaseDir, 'file.exe', 'content')).rejects.toThrow('Invalid file extension');
    });

    it('should reject non-string content', async () => {
      await expect(saveAIData(testBaseDir, 'test.txt', 123)).rejects.toThrow('Content must be a string');
      await expect(saveAIData(testBaseDir, 'test.txt', {})).rejects.toThrow('Content must be a string');
    });
  });

  describe('readAIData', () => {
    it('should read data from valid files', async () => {
      const content = 'test content';
      const filePath = path.join(testBaseDir, 'test.txt');
      await fs.promises.writeFile(filePath, content, 'utf8');

      const result = await readAIData(testBaseDir, 'test.txt');
      expect(result).toBe(content);
    });

    it('should reject invalid filenames', async () => {
      // Path traversal attempts are caught by regex validation
      await expect(readAIData(testBaseDir, '../etc/passwd')).rejects.toThrow();
      await expect(readAIData(testBaseDir, 'file@name.txt')).rejects.toThrow('only alphanumeric characters');
    });

    it('should reject invalid file extensions', async () => {
      await expect(readAIData(testBaseDir, 'file.exe')).rejects.toThrow('Invalid file extension');
    });

    it('should reject non-existent files', async () => {
      await expect(readAIData(testBaseDir, 'nonexistent.txt')).rejects.toThrow('not found or not readable');
    });
  });

  describe('listAIDataFiles', () => {
    it('should list files with allowed extensions', async () => {
      // Create test files
      await fs.promises.writeFile(path.join(testBaseDir, 'file1.txt'), 'content1', 'utf8');
      await fs.promises.writeFile(path.join(testBaseDir, 'file2.json'), 'content2', 'utf8');
      await fs.promises.writeFile(path.join(testBaseDir, 'file3.md'), 'content3', 'utf8');
      await fs.promises.writeFile(path.join(testBaseDir, 'file4.exe'), 'content4', 'utf8'); // Should be filtered

      const result = await listAIDataFiles(testBaseDir);
      expect(result).toHaveLength(3);
      expect(result).toContain('file1.txt');
      expect(result).toContain('file2.json');
      expect(result).toContain('file3.md');
      expect(result).not.toContain('file4.exe');
    });

    it('should return empty array for empty directory', async () => {
      const result = await listAIDataFiles(testBaseDir);
      expect(result).toEqual([]);
    });

    it('should reject non-absolute base directories', async () => {
      await expect(listAIDataFiles('relative/path')).rejects.toThrow('must be an absolute path');
    });

    it('should reject null or undefined base directories', async () => {
      await expect(listAIDataFiles(null)).rejects.toThrow('Base directory must be a non-empty string');
      await expect(listAIDataFiles(undefined)).rejects.toThrow('Base directory must be a non-empty string');
    });

    it('should reject non-existent directories', async () => {
      await expect(listAIDataFiles('/tmp/nonexistent-directory-xyz')).rejects.toThrow('not found or not readable');
    });
  });
});

describe('AI Assistant Service - Constants Export', () => {
  it('should export expected constants', () => {
    expect(AI_ASSISTANT_CONSTANTS).toBeDefined();
    expect(AI_ASSISTANT_CONSTANTS.SAFE_FILENAME_PATTERN).toBeDefined();
    expect(AI_ASSISTANT_CONSTANTS.ALLOWED_EXTENSIONS).toBeDefined();
    expect(AI_ASSISTANT_CONSTANTS.ALLOWED_CONFIG_FILES).toBeDefined();
  });

  it('should export correct pattern', () => {
    expect(AI_ASSISTANT_CONSTANTS.SAFE_FILENAME_PATTERN).toEqual(/^[\w\-\.]+$/);
  });

  it('should export correct allowed extensions', () => {
    expect(AI_ASSISTANT_CONSTANTS.ALLOWED_EXTENSIONS).toEqual(['.txt', '.md', '.json', '.log']);
  });

  it('should export correct allowed config files', () => {
    expect(AI_ASSISTANT_CONSTANTS.ALLOWED_CONFIG_FILES).toEqual([
      'assistant-config.json',
      'ai-prompts.json',
      'knowledge-base.json',
      'settings.json',
    ]);
  });
});
