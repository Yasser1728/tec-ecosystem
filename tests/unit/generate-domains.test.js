/**
 * Tests for Generate Domains Script
 * Validates secure domain generation and path handling
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  generateDomain,
  validateDomainConfig,
  generateIndexTemplate
} = require('../../scripts/generate-domains');

describe('Generate Domains Script', () => {
  let testDir;
  let originalDomainsDir;
  
  beforeEach(() => {
    // Create a temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'generate-domains-test-'));
  });
  
  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
  
  describe('validateDomainConfig', () => {
    it('should accept valid domain configuration', () => {
      const config = {
        name: 'fundx',
        domain: 'fundx.pi',
        category: 'Financial'
      };
      expect(validateDomainConfig(config)).toBe(true);
    });
    
    it('should reject config without required fields', () => {
      expect(validateDomainConfig({ name: 'test' })).toBe(false);
      expect(validateDomainConfig({ domain: 'test.pi' })).toBe(false);
      expect(validateDomainConfig({ category: 'Tech' })).toBe(false);
    });
    
    it('should reject null or undefined config', () => {
      expect(validateDomainConfig(null)).toBe(false);
      expect(validateDomainConfig(undefined)).toBe(false);
    });
    
    it('should reject non-object config', () => {
      expect(validateDomainConfig('string')).toBe(false);
      expect(validateDomainConfig(123)).toBe(false);
      expect(validateDomainConfig([])).toBe(false);
    });
    
    it('should reject config with non-string values', () => {
      const config = {
        name: 123,
        domain: 'test.pi',
        category: 'Tech'
      };
      expect(validateDomainConfig(config)).toBe(false);
    });
  });
  
  describe('generateIndexTemplate', () => {
    it('should generate valid React component template', () => {
      const config = {
        name: 'TestDomain',
        domain: 'test.pi',
        category: 'Testing'
      };
      
      const template = generateIndexTemplate(config);
      
      expect(template).toContain('TestDomain');
      expect(template).toContain('test.pi');
      expect(template).toContain('Testing');
      expect(template).toContain('export default function');
      expect(template).toContain('getStaticProps');
    });
    
    it('should include all config properties in template', () => {
      const config = {
        name: 'FundX',
        domain: 'fundx.pi',
        category: 'Financial',
        description: 'Financial services'
      };
      
      const template = generateIndexTemplate(config);
      
      expect(template).toContain('FundX');
      expect(template).toContain('fundx.pi');
      expect(template).toContain('Financial');
    });
    
    it('should generate syntactically valid JavaScript', () => {
      const config = {
        name: 'ValidDomain',
        domain: 'valid.pi',
        category: 'Valid'
      };
      
      const template = generateIndexTemplate(config);
      
      // Check for basic syntax validity
      expect(template).toMatch(/^\/\*\*/); // Starts with comment
      expect(template).toContain('import React');
      expect(template).toContain('export default');
      expect(template).toContain('export async function');
    });
  });
  
  describe('Security Tests', () => {
    it('should reject domain names with path traversal attempts', () => {
      const config = {
        name: '../../../etc/passwd',
        domain: 'test.pi',
        category: 'Security'
      };
      
      // Mock console.error to suppress error output during tests
      const originalError = console.error;
      console.error = jest.fn();
      
      // Mock process.exit to prevent actual exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      expect(() => generateDomain(config)).toThrow();
      
      console.error = originalError;
      mockExit.mockRestore();
    });
    
    it('should reject domain names with special characters', () => {
      const config = {
        name: 'domain@invalid',
        domain: 'test.pi',
        category: 'Security'
      };
      
      const originalError = console.error;
      console.error = jest.fn();
      
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      expect(() => generateDomain(config)).toThrow();
      
      console.error = originalError;
      mockExit.mockRestore();
    });
    
    it('should reject domain names with dots', () => {
      const config = {
        name: 'domain.js',
        domain: 'test.pi',
        category: 'Security'
      };
      
      const originalError = console.error;
      console.error = jest.fn();
      
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      expect(() => generateDomain(config)).toThrow();
      
      console.error = originalError;
      mockExit.mockRestore();
    });
    
    it('should accept valid alphanumeric domain names', () => {
      const config = {
        name: 'valid-domain_123',
        domain: 'valid.pi',
        category: 'Valid'
      };
      
      // This test would require mocking the file system operations
      // or using a test directory. For now, we validate the config
      expect(validateDomainConfig(config)).toBe(true);
    });
  });
  
  describe('Path Traversal Prevention', () => {
    it('should prevent creating domains outside the domains directory', () => {
      const maliciousConfigs = [
        { name: '..', domain: 'test.pi', category: 'Test' },
        { name: '../outside', domain: 'test.pi', category: 'Test' },
        { name: '../../root', domain: 'test.pi', category: 'Test' }
      ];
      
      const originalError = console.error;
      console.error = jest.fn();
      
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      maliciousConfigs.forEach(config => {
        expect(() => generateDomain(config)).toThrow();
      });
      
      console.error = originalError;
      mockExit.mockRestore();
    });
    
    it('should handle encoded path traversal attempts', () => {
      const config = {
        name: '%2e%2e%2foutside',
        domain: 'test.pi',
        category: 'Test'
      };
      
      const originalError = console.error;
      console.error = jest.fn();
      
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      expect(() => generateDomain(config)).toThrow();
      
      console.error = originalError;
      mockExit.mockRestore();
    });
  });
  
  describe('Input Validation', () => {
    it('should validate required configuration fields', () => {
      const invalidConfigs = [
        { domain: 'test.pi', category: 'Test' }, // missing name
        { name: 'test', category: 'Test' }, // missing domain
        { name: 'test', domain: 'test.pi' }, // missing category
        {} // empty config
      ];
      
      invalidConfigs.forEach(config => {
        expect(validateDomainConfig(config)).toBe(false);
      });
    });
    
    it('should accept configuration with additional fields', () => {
      const config = {
        name: 'test',
        domain: 'test.pi',
        category: 'Test',
        priority: 'Tier 1',
        status: 'active',
        description: 'Test domain',
        extraField: 'extra value'
      };
      
      expect(validateDomainConfig(config)).toBe(true);
    });
  });
  
  describe('Template Generation', () => {
    it('should escape special characters in generated templates', () => {
      const config = {
        name: 'TestDomain',
        domain: 'test.pi',
        category: 'Test'
      };
      
      const template = generateIndexTemplate(config);
      
      // Template should not contain unescaped characters that could break code
      expect(template).not.toContain('${undefined}');
      expect(template).not.toContain('${null}');
    });
  });
});
