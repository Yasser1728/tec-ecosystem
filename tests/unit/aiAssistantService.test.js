/**
 * Unit tests for AI Assistant Service
 * 
 * These tests verify that the AI Assistant Service uses cryptographically
 * secure random number generation via crypto.randomInt() instead of Math.random()
 */

const crypto = require('crypto');
const aiAssistantService = require('../../domains/tec/services/aiAssistantService');

describe('AI Assistant Service - Secure Random Number Generation', () => {
  
  describe('getRandomGreeting', () => {
    it('should return a valid greeting message', () => {
      const greeting = aiAssistantService.getRandomGreeting();
      expect(typeof greeting).toBe('string');
      expect(greeting.length).toBeGreaterThan(0);
    });

    it('should return different greetings over multiple calls (randomness test)', () => {
      const greetings = new Set();
      // Generate multiple greetings to test randomness
      for (let i = 0; i < 20; i++) {
        greetings.add(aiAssistantService.getRandomGreeting());
      }
      // Should have some variety (at least 2 different greetings)
      expect(greetings.size).toBeGreaterThanOrEqual(2);
    });

    it('should use crypto for random selection (not Math.random)', () => {
      // Spy on crypto.randomInt to verify it's being used
      const cryptoSpy = jest.spyOn(crypto, 'randomInt');
      aiAssistantService.getRandomGreeting();
      expect(cryptoSpy).toHaveBeenCalled();
      cryptoSpy.mockRestore();
    });
  });

  describe('getRandomResponse', () => {
    it('should return a valid acknowledgment response', () => {
      const response = aiAssistantService.getRandomResponse('ACKNOWLEDGMENT');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should return a valid error response', () => {
      const response = aiAssistantService.getRandomResponse('ERROR');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should return a valid thinking response', () => {
      const response = aiAssistantService.getRandomResponse('THINKING');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should default to acknowledgment for unknown types', () => {
      const response = aiAssistantService.getRandomResponse('UNKNOWN');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should use crypto for random selection', () => {
      const cryptoSpy = jest.spyOn(crypto, 'randomInt');
      aiAssistantService.getRandomResponse('ACKNOWLEDGMENT');
      expect(cryptoSpy).toHaveBeenCalled();
      cryptoSpy.mockRestore();
    });
  });

  describe('generateSecureSessionId', () => {
    it('should generate a valid session ID', () => {
      const sessionId = aiAssistantService.generateSecureSessionId();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);
    });

    it('should generate unique session IDs', () => {
      const sessionIds = new Set();
      for (let i = 0; i < 100; i++) {
        sessionIds.add(aiAssistantService.generateSecureSessionId());
      }
      // All session IDs should be unique
      expect(sessionIds.size).toBe(100);
    });

    it('should generate hex-formatted session IDs', () => {
      const sessionId = aiAssistantService.generateSecureSessionId();
      // Should be a valid hex string (32 characters for 16 bytes)
      expect(sessionId).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should use crypto.randomBytes for secure generation', () => {
      const cryptoSpy = jest.spyOn(crypto, 'randomBytes');
      aiAssistantService.generateSecureSessionId();
      expect(cryptoSpy).toHaveBeenCalledWith(16);
      cryptoSpy.mockRestore();
    });
  });

  describe('selectWeightedResponse', () => {
    it('should select a response from weighted options', () => {
      const options = [
        { text: 'Option A', weight: 1 },
        { text: 'Option B', weight: 2 },
        { text: 'Option C', weight: 1 }
      ];
      const response = aiAssistantService.selectWeightedResponse(options);
      expect(typeof response).toBe('string');
      expect(['Option A', 'Option B', 'Option C']).toContain(response);
    });

    it('should throw error for empty options array', () => {
      expect(() => {
        aiAssistantService.selectWeightedResponse([]);
      }).toThrow('Options array cannot be empty');
    });

    it('should throw error for null/undefined options', () => {
      expect(() => {
        aiAssistantService.selectWeightedResponse(null);
      }).toThrow('Options array cannot be empty');
    });

    it('should use crypto for weighted selection', () => {
      const cryptoSpy = jest.spyOn(crypto, 'randomInt');
      const options = [
        { text: 'Option A', weight: 1 },
        { text: 'Option B', weight: 1 }
      ];
      aiAssistantService.selectWeightedResponse(options);
      expect(cryptoSpy).toHaveBeenCalled();
      cryptoSpy.mockRestore();
    });

    it('should handle single option', () => {
      const options = [{ text: 'Only Option', weight: 1 }];
      const response = aiAssistantService.selectWeightedResponse(options);
      expect(response).toBe('Only Option');
    });
  });

  describe('getSecureRandomDelay', () => {
    it('should return a delay within the specified range', () => {
      const delay = aiAssistantService.getSecureRandomDelay(100, 500);
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThan(500);
    });

    it('should return different delays over multiple calls', () => {
      const delays = new Set();
      for (let i = 0; i < 20; i++) {
        delays.add(aiAssistantService.getSecureRandomDelay(0, 1000));
      }
      // Should have variety in delays
      expect(delays.size).toBeGreaterThan(1);
    });

    it('should use crypto.randomInt for delay generation', () => {
      const cryptoSpy = jest.spyOn(crypto, 'randomInt');
      aiAssistantService.getSecureRandomDelay(100, 500);
      expect(cryptoSpy).toHaveBeenCalled();
      cryptoSpy.mockRestore();
    });
  });

  describe('selectRandomItem', () => {
    it('should select an item from the array', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      const selected = aiAssistantService.selectRandomItem(items);
      expect(items).toContain(selected);
    });

    it('should throw error for empty array', () => {
      expect(() => {
        aiAssistantService.selectRandomItem([]);
      }).toThrow('Array cannot be empty');
    });

    it('should throw error for null/undefined array', () => {
      expect(() => {
        aiAssistantService.selectRandomItem(null);
      }).toThrow('Array cannot be empty');
    });

    it('should use crypto for item selection', () => {
      const cryptoSpy = jest.spyOn(crypto, 'randomInt');
      const items = ['Item 1', 'Item 2', 'Item 3'];
      aiAssistantService.selectRandomItem(items);
      expect(cryptoSpy).toHaveBeenCalled();
      cryptoSpy.mockRestore();
    });

    it('should handle single item array', () => {
      const items = ['Only Item'];
      const selected = aiAssistantService.selectRandomItem(items);
      expect(selected).toBe('Only Item');
    });
  });

  describe('generateConfidenceScore', () => {
    it('should generate a score between 0 and 1', () => {
      const score = aiAssistantService.generateConfidenceScore();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should generate varied scores over multiple calls', () => {
      const scores = new Set();
      for (let i = 0; i < 20; i++) {
        scores.add(aiAssistantService.generateConfidenceScore());
      }
      // Should have variety in scores
      expect(scores.size).toBeGreaterThan(1);
    });

    it('should use crypto for score generation', () => {
      const cryptoSpy = jest.spyOn(crypto, 'randomInt');
      aiAssistantService.generateConfidenceScore();
      expect(cryptoSpy).toHaveBeenCalled();
      cryptoSpy.mockRestore();
    });
  });

  describe('getSecureRandomInt', () => {
    it('should generate an integer within the specified range', () => {
      const randomInt = aiAssistantService.getSecureRandomInt(0, 10);
      expect(Number.isInteger(randomInt)).toBe(true);
      expect(randomInt).toBeGreaterThanOrEqual(0);
      expect(randomInt).toBeLessThan(10);
    });

    it('should use crypto.randomInt', () => {
      const cryptoSpy = jest.spyOn(crypto, 'randomInt');
      aiAssistantService.getSecureRandomInt(0, 100);
      expect(cryptoSpy).toHaveBeenCalledWith(0, 100);
      cryptoSpy.mockRestore();
    });

    it('should generate varied integers over multiple calls', () => {
      const numbers = new Set();
      for (let i = 0; i < 50; i++) {
        numbers.add(aiAssistantService.getSecureRandomInt(0, 100));
      }
      // Should have variety (at least 10 different numbers out of 50 calls)
      expect(numbers.size).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Security Compliance', () => {
    it('should NOT use Math.random anywhere in the service', () => {
      const fs = require('fs');
      const path = require('path');
      const serviceFilePath = path.join(__dirname, '../../domains/tec/services/aiAssistantService.js');
      const serviceCode = fs.readFileSync(serviceFilePath, 'utf8');
      
      // Check that Math.random() is not used in the code
      // Allow it in comments but not in actual code
      const codeWithoutComments = serviceCode
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*/g, ''); // Remove line comments
      
      expect(codeWithoutComments).not.toMatch(/Math\.random\s*\(/);
    });

    it('should import and use crypto module', () => {
      const fs = require('fs');
      const path = require('path');
      const serviceFilePath = path.join(__dirname, '../../domains/tec/services/aiAssistantService.js');
      const serviceCode = fs.readFileSync(serviceFilePath, 'utf8');
      
      // Verify crypto is imported
      expect(serviceCode).toMatch(/require\(['"]crypto['"]\)/);
      // Verify crypto.randomInt is used
      expect(serviceCode).toMatch(/crypto\.randomInt/);
    });
  });
});
