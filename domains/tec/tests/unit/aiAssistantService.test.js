/**
 * Unit Tests for AI Assistant Service
 * 
 * @module tests/unit/aiAssistantService.test
 */

const AiAssistantService = require('../../services/aiAssistantService');

describe('AiAssistantService', () => {
  let assistantService;

  beforeEach(() => {
    assistantService = new AiAssistantService();
  });

  describe('processMessage', () => {
    it('should process user message and return response', async () => {
      const userId = 'test-user-123';
      const message = 'Tell me about domains';

      const response = await assistantService.processMessage(userId, message);

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(typeof response.content).toBe('string');
    });

    it('should maintain conversation history', async () => {
      const userId = 'test-user-123';
      
      await assistantService.processMessage(userId, 'Hello');
      await assistantService.processMessage(userId, 'Tell me about domains');

      const history = assistantService.getConversationHistory(userId);

      expect(history.length).toBe(4); // 2 user messages + 2 assistant responses
    });
  });

  describe('generateResponse', () => {
    it('should return domain info for domain-related queries', async () => {
      const response = await assistantService.generateResponse('What domains are available?');

      expect(response.content).toContain('domain');
      expect(response.suggestions).toBeDefined();
    });

    it('should return payment info for payment-related queries', async () => {
      const response = await assistantService.generateResponse('How do I make payments?');

      expect(response.content.toLowerCase()).toContain('pi');
    });
  });

  describe('getConversationHistory', () => {
    it('should return conversation history for user', async () => {
      const userId = 'test-user-123';
      
      await assistantService.processMessage(userId, 'Test message');

      const history = assistantService.getConversationHistory(userId);

      expect(history).toBeInstanceOf(Array);
      expect(history.length).toBeGreaterThan(0);
    });

    it('should return empty array for new user', () => {
      const history = assistantService.getConversationHistory('new-user');

      expect(history).toEqual([]);
    });
  });

  describe('clearConversationHistory', () => {
    it('should clear conversation history for user', async () => {
      const userId = 'test-user-123';
      
      await assistantService.processMessage(userId, 'Test message');
      const result = assistantService.clearConversationHistory(userId);

      expect(result).toBe(true);
      
      const history = assistantService.getConversationHistory(userId);
      expect(history.length).toBe(0);
    });
  });

  describe('getSuggestedPrompts', () => {
    it('should return array of suggested prompts', () => {
      const prompts = assistantService.getSuggestedPrompts();

      expect(prompts).toBeInstanceOf(Array);
      expect(prompts.length).toBe(4);
      prompts.forEach(prompt => {
        expect(typeof prompt).toBe('string');
      });
    });
  });
});
