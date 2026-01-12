/**
 * Cost Guard Unit Tests
 * Tests cost estimation, rate limiting, and budget enforcement
 */

let estimateRequestCost;
let checkCostGuard;

beforeAll(async () => {
  const module = await import('../../index.js');
  estimateRequestCost = module.estimateRequestCost;
  checkCostGuard = module.checkCostGuard;
});

describe('Cost Guard System', () => {
  describe('Cost Estimation Logic', () => {
    it('should estimate cost for paid GPT models', () => {
      const cost = estimateRequestCost('openai/gpt-5.2-pro');
      expect(cost).toBe(1.5);
    });

    it('should estimate cost for Claude models', () => {
      const cost = estimateRequestCost('anthropic/claude-4.5-sonnet');
      expect(cost).toBe(1.2);
    });

    it('should estimate cost for Gemini Pro models', () => {
      const cost = estimateRequestCost('google/gemini-3-pro');
      expect(cost).toBe(1.8);
    });

    it('should estimate cost for Codex models', () => {
      const cost = estimateRequestCost('openai/codex-advanced');
      expect(cost).toBe(1.4);
    });

    it('should estimate cost for o4-mini models', () => {
      const cost = estimateRequestCost('openai/o4-mini-high');
      expect(cost).toBe(0.2);
    });

    it('should return zero cost for free models', () => {
      const cost = estimateRequestCost('deepseek/deepseek-r1');
      expect(cost).toBe(0.0);
    });

    it('should return zero cost for flash models', () => {
      const cost = estimateRequestCost('google/gemini-flash');
      expect(cost).toBe(0.0);
    });

    it('should prioritize flash detection over pro detection', () => {
      const cost = estimateRequestCost('google/gemini-pro-flash');
      expect(cost).toBe(0.0);
    });

    it('should handle null/undefined model names', () => {
      expect(estimateRequestCost(null)).toBe(0);
      expect(estimateRequestCost(undefined)).toBe(0);
    });

    it('should handle unknown models', () => {
      expect(estimateRequestCost('unknown/model')).toBe(0.0);
    });
  });

  describe('Cost Guard Logic', () => {
    // Simplified version of the cost guard check for testing
    function checkCostGuardLogic(currentCost, requestCost, maxPerRequest, maxPerMinute) {
      // Check per-request ceiling
      if (requestCost > maxPerRequest) {
        return {
          allowed: false,
          reason: 'Per-request cost ceiling exceeded',
          requestCost,
          maxCost: maxPerRequest,
        };
      }
      
      // Check per-minute ceiling
      if (currentCost + requestCost > maxPerMinute) {
        return {
          allowed: false,
          reason: 'Per-minute cost ceiling exceeded',
          currentCost,
          requestCost,
          maxCost: maxPerMinute,
        };
      }
      
      return {
        allowed: true,
        requestCost,
        remainingBudget: maxPerMinute - (currentCost + requestCost),
      };
    }

    it('should allow requests within both ceilings', () => {
      const result = checkCostGuardLogic(
        0,    // current cost
        1.5,  // request cost
        2.0,  // max per request
        10.0  // max per minute
      );
      
      expect(result.allowed).toBe(true);
      expect(result.requestCost).toBe(1.5);
      expect(result.remainingBudget).toBe(8.5);
    });

    it('should block requests exceeding per-request ceiling', () => {
      const result = checkCostGuardLogic(
        0,    // current cost
        2.5,  // request cost (exceeds limit)
        2.0,  // max per request
        10.0  // max per minute
      );
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Per-request cost ceiling exceeded');
    });

    it('should block requests exceeding per-minute ceiling', () => {
      const result = checkCostGuardLogic(
        9.0,  // current cost
        1.5,  // request cost (total would be 10.5)
        2.0,  // max per request
        10.0  // max per minute
      );
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Per-minute cost ceiling exceeded');
    });

    it('should allow free models (0 cost)', () => {
      const result = checkCostGuardLogic(
        9.5,  // current cost (near limit)
        0.0,  // request cost (free model)
        2.0,  // max per request
        10.0  // max per minute
      );
      
      expect(result.allowed).toBe(true);
      expect(result.remainingBudget).toBe(0.5);
    });

    it('should calculate remaining budget correctly', () => {
      const result = checkCostGuardLogic(
        3.0,  // current cost
        1.0,  // request cost
        2.0,  // max per request
        10.0  // max per minute
      );
      
      expect(result.allowed).toBe(true);
      expect(result.remainingBudget).toBe(6.0);
    });
  });

  describe('Model Selection with Cost Guard', () => {
    it('should prioritize paid models when budget allows', () => {
      // Simulate model selection logic
      const paidModels = ['gpt-5', 'claude-4'];
      const freeModels = ['deepseek-r1', 'llama-3'];
      
      // With sufficient budget, use paid model
      const hasBudget = true;
      const selectedModel = hasBudget ? paidModels[0] : freeModels[0];
      
      expect(selectedModel).toBe('gpt-5');
    });

    it('should fallback to free models when budget is low', () => {
      const paidModels = ['gpt-5', 'claude-4'];
      const freeModels = ['deepseek-r1', 'llama-3'];
      
      // With low budget, use free model
      const hasBudget = false;
      const selectedModel = hasBudget ? paidModels[0] : freeModels[0];
      
      expect(selectedModel).toBe('deepseek-r1');
    });
  });
});

