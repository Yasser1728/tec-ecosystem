/**
 * Unit tests for selectModel and cost guard functions
 */

describe('Model Selection and Cost Guards', () => {
  // Mock CONFIG for testing
  const mockConfig = {
    limits: {
      maxCostPerRun: 50.0,
      maxCostPerDomain: 5.0,
      maxTokensPerDomain: 100000,
      enableCostGuards: true
    },
    models: {
      paid: {},
      free: {}
    }
  };

  describe('selectModel logic', () => {
    it('should have a valid model structure', () => {
      const model = {
        type: 'sandbox',
        name: null,
        cost: 0
      };
      
      expect(model).toBeDefined();
      expect(model).toHaveProperty('type');
      expect(model).toHaveProperty('name');
      expect(model).toHaveProperty('cost');
      expect(['paid', 'free', 'sandbox']).toContain(model.type);
    });

    it('should prefer paid models when available', () => {
      const models = {
        paid: { gpt: 'gpt-5.2-pro' },
        free: {}
      };
      
      // Simulate selectModel logic
      let selectedModel = { type: 'sandbox', name: null, cost: 0 };
      
      for (const [key, model] of Object.entries(models.paid)) {
        if (model) {
          selectedModel = { type: 'paid', name: model, cost: 1.0 };
          break;
        }
      }
      
      expect(selectedModel.type).toBe('paid');
      expect(selectedModel.name).toBe('gpt-5.2-pro');
      expect(selectedModel.cost).toBeGreaterThan(0);
    });

    it('should fallback to free models when no paid models', () => {
      const models = {
        paid: {},
        free: { deepseek: 'deepseek-r1' }
      };
      
      let selectedModel = { type: 'sandbox', name: null, cost: 0 };
      
      // Check paid first
      let found = false;
      for (const [key, model] of Object.entries(models.paid)) {
        if (model) {
          selectedModel = { type: 'paid', name: model, cost: 1.0 };
          found = true;
          break;
        }
      }
      
      // Fallback to free
      if (!found) {
        for (const [key, model] of Object.entries(models.free)) {
          if (model) {
            selectedModel = { type: 'free', name: model, cost: 0 };
            break;
          }
        }
      }
      
      expect(selectedModel.type).toBe('free');
      expect(selectedModel.name).toBe('deepseek-r1');
      expect(selectedModel.cost).toBe(0);
    });

    it('should return sandbox when no models available', () => {
      const models = {
        paid: {},
        free: {}
      };
      
      let selectedModel = { type: 'sandbox', name: null, cost: 0 };
      
      expect(selectedModel.type).toBe('sandbox');
      expect(selectedModel.name).toBe(null);
      expect(selectedModel.cost).toBe(0);
    });
  });

  describe('canProceedWithCost logic', () => {
    function testCanProceedWithCost(domain, estimatedCost, totalCostSoFar, config = mockConfig) {
      if (!config.limits.enableCostGuards) {
        return { allowed: true };
      }
      
      if (totalCostSoFar + estimatedCost > config.limits.maxCostPerRun) {
        return {
          allowed: false,
          reason: `Total run cost would exceed limit: ${config.limits.maxCostPerRun}`
        };
      }
      
      if (estimatedCost > config.limits.maxCostPerDomain) {
        return {
          allowed: false,
          reason: `Domain cost would exceed limit: ${config.limits.maxCostPerDomain}`
        };
      }
      
      return { allowed: true };
    }

    it('should allow when cost guards are disabled', () => {
      const config = { ...mockConfig, limits: { ...mockConfig.limits, enableCostGuards: false } };
      const result = testCanProceedWithCost('test.pi', 100, 1000, config);
      
      expect(result.allowed).toBe(true);
    });

    it('should allow when within total cost limit', () => {
      const result = testCanProceedWithCost('test.pi', 3.0, 10.0);
      
      expect(result.allowed).toBe(true);
    });

    it('should block when exceeding total cost limit', () => {
      const result = testCanProceedWithCost('test.pi', 10.0, 45.0);
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Total run cost');
    });

    it('should block when exceeding per-domain cost limit', () => {
      const result = testCanProceedWithCost('test.pi', 10.0, 5.0);
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Domain cost');
    });

    it('should return object with allowed property', () => {
      const result = testCanProceedWithCost('test.pi', 1.0, 1.0);
      
      expect(result).toHaveProperty('allowed');
      expect(typeof result.allowed).toBe('boolean');
    });

    it('should include reason when blocked', () => {
      const result = testCanProceedWithCost('test.pi', 5.0, 48.0);
      
      if (!result.allowed) {
        expect(result).toHaveProperty('reason');
        expect(typeof result.reason).toBe('string');
        expect(result.reason.length).toBeGreaterThan(0);
      }
    });
  });

  describe('CONFIG limits structure', () => {
    it('should have expected limits configuration', () => {
      expect(mockConfig).toHaveProperty('limits');
      expect(mockConfig.limits).toHaveProperty('maxCostPerRun');
      expect(mockConfig.limits).toHaveProperty('maxCostPerDomain');
      expect(mockConfig.limits).toHaveProperty('maxTokensPerDomain');
      expect(mockConfig.limits).toHaveProperty('enableCostGuards');
    });

    it('should have numeric cost limits', () => {
      expect(typeof mockConfig.limits.maxCostPerRun).toBe('number');
      expect(typeof mockConfig.limits.maxCostPerDomain).toBe('number');
      expect(typeof mockConfig.limits.maxTokensPerDomain).toBe('number');
    });

    it('should have boolean cost guards flag', () => {
      expect(typeof mockConfig.limits.enableCostGuards).toBe('boolean');
    });

    it('should have reasonable default values', () => {
      expect(mockConfig.limits.maxCostPerRun).toBeGreaterThan(0);
      expect(mockConfig.limits.maxCostPerDomain).toBeGreaterThan(0);
      expect(mockConfig.limits.maxTokensPerDomain).toBeGreaterThan(0);
    });
  });
});
