/**
 * Unit tests for aiAssistantService.js
 * Tests path traversal prevention and sanitization
 */

const aiAssistantService = require('@/lib/aiAssistantService');
const { sanitizePathComponent } = require('@/lib/aiAssistantService');
const fs = require('fs').promises;
const path = require('path');

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    unlink: jest.fn(),
  },
}));

describe('sanitizePathComponent', () => {
  describe('valid inputs', () => {
    test('should accept alphanumeric characters', () => {
      expect(sanitizePathComponent('abc123', 'test')).toBe('abc123');
    });

    test('should accept hyphens', () => {
      expect(sanitizePathComponent('my-file', 'test')).toBe('my-file');
    });

    test('should accept underscores', () => {
      expect(sanitizePathComponent('my_file', 'test')).toBe('my_file');
    });

    test('should accept dots in middle', () => {
      expect(sanitizePathComponent('file.name', 'test')).toBe('file.name');
    });

    test('should accept complex valid names', () => {
      expect(sanitizePathComponent('my-file_name.123', 'test')).toBe('my-file_name.123');
    });
  });

  describe('invalid inputs - path traversal attempts', () => {
    test('should reject path with ../', () => {
      expect(() => sanitizePathComponent('../etc/passwd', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });

    test('should reject path with ..\\', () => {
      expect(() => sanitizePathComponent('..\\windows\\system32', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });

    test('should reject path starting with ./', () => {
      expect(() => sanitizePathComponent('./hidden', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });

    test('should reject path starting with .', () => {
      expect(() => sanitizePathComponent('.hidden', 'test')).toThrow(
        'Invalid test: cannot start with a dot'
      );
    });

    test('should reject absolute paths', () => {
      expect(() => sanitizePathComponent('/etc/passwd', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });

    test('should reject Windows absolute paths', () => {
      expect(() => sanitizePathComponent('C:\\Windows\\System32', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });
  });

  describe('invalid inputs - special characters', () => {
    test('should reject paths with spaces', () => {
      expect(() => sanitizePathComponent('my file', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });

    test('should reject paths with forward slashes', () => {
      expect(() => sanitizePathComponent('dir/file', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });

    test('should reject paths with backslashes', () => {
      expect(() => sanitizePathComponent('dir\\file', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });

    test('should reject paths with special characters', () => {
      expect(() => sanitizePathComponent('file@#$%', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });

    test('should reject null bytes', () => {
      expect(() => sanitizePathComponent('file\0name', 'test')).toThrow(
        'Invalid test: contains unsafe characters'
      );
    });
  });

  describe('invalid inputs - empty or null', () => {
    test('should reject empty string', () => {
      expect(() => sanitizePathComponent('', 'test')).toThrow(
        'Invalid test: must be a non-empty string'
      );
    });

    test('should reject null', () => {
      expect(() => sanitizePathComponent(null, 'test')).toThrow(
        'Invalid test: must be a non-empty string'
      );
    });

    test('should reject undefined', () => {
      expect(() => sanitizePathComponent(undefined, 'test')).toThrow(
        'Invalid test: must be a non-empty string'
      );
    });

    test('should reject non-string input', () => {
      expect(() => sanitizePathComponent(123, 'test')).toThrow(
        'Invalid test: must be a non-empty string'
      );
    });
  });
});

describe('AIAssistantService path security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadPrompt', () => {
    test('should sanitize promptId before using in path.join', async () => {
      const validPromptId = 'my-prompt-123';
      fs.readFile.mockResolvedValue('prompt content');

      await aiAssistantService.loadPrompt(validPromptId);

      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('my-prompt-123.txt'),
        'utf8'
      );
    });

    test('should reject path traversal in promptId', async () => {
      const maliciousPromptId = '../../../etc/passwd';

      await expect(aiAssistantService.loadPrompt(maliciousPromptId)).rejects.toThrow(
        'Invalid promptId: contains unsafe characters'
      );

      expect(fs.readFile).not.toHaveBeenCalled();
    });
  });

  describe('savePrompt', () => {
    test('should sanitize promptId before using in path.join', async () => {
      const validPromptId = 'my-prompt-123';
      fs.writeFile.mockResolvedValue();

      await aiAssistantService.savePrompt(validPromptId, 'content');

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('my-prompt-123.txt'),
        'content',
        'utf8'
      );
    });

    test('should reject path traversal in promptId', async () => {
      const maliciousPromptId = '../../../etc/passwd';

      await expect(
        aiAssistantService.savePrompt(maliciousPromptId, 'content')
      ).rejects.toThrow('Invalid promptId: contains unsafe characters');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('loadModelConfig', () => {
    test('should sanitize modelName before using in path.resolve', async () => {
      const validModelName = 'gpt-4';
      fs.readFile.mockResolvedValue('{"model": "gpt-4"}');

      await aiAssistantService.loadModelConfig(validModelName);

      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('gpt-4.config.json'),
        'utf8'
      );
    });

    test('should reject path traversal in modelName', async () => {
      const maliciousModelName = '../../../etc/passwd';

      await expect(aiAssistantService.loadModelConfig(maliciousModelName)).rejects.toThrow(
        'Invalid modelName: contains unsafe characters'
      );

      expect(fs.readFile).not.toHaveBeenCalled();
    });
  });

  describe('saveModelConfig', () => {
    test('should sanitize modelName before using in path.resolve', async () => {
      const validModelName = 'gpt-4';
      const config = { model: 'gpt-4' };
      fs.writeFile.mockResolvedValue();

      await aiAssistantService.saveModelConfig(validModelName, config);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('gpt-4.config.json'),
        expect.any(String),
        'utf8'
      );
    });

    test('should reject path traversal in modelName', async () => {
      const maliciousModelName = '../../../etc/passwd';

      await expect(
        aiAssistantService.saveModelConfig(maliciousModelName, {})
      ).rejects.toThrow('Invalid modelName: contains unsafe characters');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('exportAssistantData', () => {
    test('should sanitize assistantId before using in path.join', async () => {
      const validAssistantId = 'assistant-123';
      fs.readFile.mockResolvedValue('{"id": "assistant-123"}');
      fs.writeFile.mockResolvedValue();

      await aiAssistantService.exportAssistantData(validAssistantId);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('assistant-123.json'),
        expect.any(String),
        'utf8'
      );
    });

    test('should reject path traversal in assistantId', async () => {
      const maliciousAssistantId = '../../../etc/passwd';

      await expect(
        aiAssistantService.exportAssistantData(maliciousAssistantId)
      ).rejects.toThrow('Invalid assistantId: contains unsafe characters');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    test('should sanitize exportFormat before using in path.join', async () => {
      const validAssistantId = 'assistant-123';
      const maliciousFormat = '../../../etc';

      fs.readFile.mockResolvedValue('{"id": "assistant-123"}');

      await expect(
        aiAssistantService.exportAssistantData(validAssistantId, maliciousFormat)
      ).rejects.toThrow('Invalid exportFormat: contains unsafe characters');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('loadAssistant', () => {
    test('should sanitize name before using in path.join', async () => {
      const validName = 'my-assistant';
      fs.readFile.mockResolvedValue('{"name": "my-assistant"}');

      await aiAssistantService.loadAssistant(validName);

      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('my-assistant.json'),
        'utf8'
      );
    });

    test('should reject path traversal in name', async () => {
      const maliciousName = '../../../etc/passwd';

      await expect(aiAssistantService.loadAssistant(maliciousName)).rejects.toThrow(
        'Invalid name: contains unsafe characters'
      );

      expect(fs.readFile).not.toHaveBeenCalled();
    });
  });

  describe('saveAssistant', () => {
    test('should sanitize name before using in path.join', async () => {
      const validName = 'my-assistant';
      fs.writeFile.mockResolvedValue();

      await aiAssistantService.saveAssistant(validName, { name: 'my-assistant' });

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('my-assistant.json'),
        expect.any(String),
        'utf8'
      );
    });

    test('should reject path traversal in name', async () => {
      const maliciousName = '../../../etc/passwd';

      await expect(
        aiAssistantService.saveAssistant(maliciousName, {})
      ).rejects.toThrow('Invalid name: contains unsafe characters');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('deleteAssistant', () => {
    test('should sanitize name before using in path.join', async () => {
      const validName = 'my-assistant';
      fs.unlink.mockResolvedValue();

      await aiAssistantService.deleteAssistant(validName);

      expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining('my-assistant.json'));
    });

    test('should reject path traversal in name', async () => {
      const maliciousName = '../../../etc/passwd';

      await expect(aiAssistantService.deleteAssistant(maliciousName)).rejects.toThrow(
        'Invalid name: contains unsafe characters'
      );

      expect(fs.unlink).not.toHaveBeenCalled();
    });
  });

  describe('loadTemplate', () => {
    test('should sanitize templateName before using in path.join', async () => {
      const validTemplateName = 'my-template';
      fs.readFile.mockResolvedValue('{"template": "content"}');

      await aiAssistantService.loadTemplate(validTemplateName);

      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('my-template.json'),
        'utf8'
      );
    });

    test('should reject path traversal in templateName', async () => {
      const maliciousTemplateName = '../../../etc/passwd';

      await expect(aiAssistantService.loadTemplate(maliciousTemplateName)).rejects.toThrow(
        'Invalid templateName: contains unsafe characters'
      );

      expect(fs.readFile).not.toHaveBeenCalled();
    });
  });

  describe('saveTemplate', () => {
    test('should sanitize templateName before using in path.join', async () => {
      const validTemplateName = 'my-template';
      fs.writeFile.mockResolvedValue();

      await aiAssistantService.saveTemplate(validTemplateName, { template: 'content' });

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('my-template.json'),
        expect.any(String),
        'utf8'
      );
    });

    test('should reject path traversal in templateName', async () => {
      const maliciousTemplateName = '../../../etc/passwd';

      await expect(
        aiAssistantService.saveTemplate(maliciousTemplateName, {})
      ).rejects.toThrow('Invalid templateName: contains unsafe characters');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('importAssistantData', () => {
    test('should sanitize filename before using in path.join', async () => {
      const validFilename = 'import-data.json';
      fs.readFile.mockResolvedValue('{"data": "content"}');

      await aiAssistantService.importAssistantData(validFilename);

      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('import-data.json'),
        'utf8'
      );
    });

    test('should reject path traversal in filename', async () => {
      const maliciousFilename = '../../../etc/passwd';

      await expect(aiAssistantService.importAssistantData(maliciousFilename)).rejects.toThrow(
        'Invalid filename: contains unsafe characters'
      );

      expect(fs.readFile).not.toHaveBeenCalled();
    });
  });
});
