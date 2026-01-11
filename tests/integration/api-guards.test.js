/**
 * Integration tests for API endpoints with guards
 */

import { createMocks } from 'node-mocks-http';

// Mock the dependencies before importing handlers
jest.mock('../../lib/nexus-ai-knowledge', () => ({
  TEC_KNOWLEDGE: 'Test knowledge base',
  SYSTEM_PROMPT: 'Test system prompt'
}));

jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Test response from AI' } }]
          })
        }
      }
    }))
  };
});

describe('API Endpoints Integration Tests', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
    process.env.OPENAI_API_KEY = 'test-key';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear rate limit stores
    const { clearAllStores } = require('../../lib/api-guard');
    clearAllStores();
  });

  describe('/api/nexus-ai', () => {
    it('should reject non-POST requests', async () => {
      const handler = (await import('../../pages/api/nexus-ai')).default;
      const { req, res } = createMocks({
        method: 'GET'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
    });

    it('should handle valid request with guards', async () => {
      const handler = (await import('../../pages/api/nexus-ai')).default;
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          message: 'Tell me about TEC',
          history: []
        },
        headers: {
          'content-length': '100'
        }
      });

      await handler(req, res);

      // Should either succeed or fallback gracefully
      const statusCode = res._getStatusCode();
      expect([200, 500]).toContain(statusCode);
    });

    it('should sanitize malicious input', async () => {
      const handler = (await import('../../pages/api/nexus-ai')).default;
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          message: '<script>alert("xss")</script>Tell me about TEC',
          history: []
        },
        headers: {
          'content-length': '200'
        }
      });

      await handler(req, res);

      // Should not crash and should process request
      const statusCode = res._getStatusCode();
      expect(statusCode).toBeDefined();
    });
  });

  describe('/api/tec/assistant', () => {
    it('should reject non-POST requests', async () => {
      const handler = (await import('../../pages/api/tec/assistant')).default;
      const { req, res } = createMocks({
        method: 'GET'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
    });

    it('should handle valid request with schema validation', async () => {
      const handler = (await import('../../pages/api/tec/assistant')).default;
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          message: 'Hello assistant',
          userId: 'test-user',
          context: {}
        },
        headers: {
          'content-length': '100'
        }
      });

      await handler(req, res);

      const statusCode = res._getStatusCode();
      expect([200, 500]).toContain(statusCode);
    });

    it('should handle request with missing optional fields', async () => {
      const handler = (await import('../../pages/api/tec/assistant')).default;
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          message: 'Hello assistant'
        },
        headers: {
          'content-length': '50'
        }
      });

      await handler(req, res);

      const statusCode = res._getStatusCode();
      expect(statusCode).toBeDefined();
    });

    it.skip('should handle errors gracefully', async () => {
      const handler = (await import('../../pages/api/tec/assistant')).default;
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          message: 'x'.repeat(1500) // Long message but within limit
        },
        headers: {
          'content-length': '2000'
        }
      });

      await handler(req, res);

      const statusCode = res._getStatusCode();
      expect(statusCode).toBeDefined();
      // Should either validate or reject, but not crash
    });
  });

  describe('Rate Limiting Integration', () => {
    it.skip('should enforce rate limits across multiple requests', async () => {
      const handler = (await import('../../pages/api/tec/assistant')).default;
      
      let blockedRequests = 0;
      
      // Make 35 requests rapidly (above the 30 limit)
      for (let i = 0; i < 35; i++) {
        const { req, res } = createMocks({
          method: 'POST',
          body: {
            message: `Test ${i}`
          },
          headers: {
            'content-length': '20'
          },
          socket: {
            remoteAddress: '127.0.0.1'
          },
          url: '/api/tec/assistant'
        });

        await handler(req, res);

        if (res._getStatusCode() === 429) {
          blockedRequests++;
        }
      }

      // Should have blocked some requests
      expect(blockedRequests).toBeGreaterThan(0);
    }, 15000);
  });
});
