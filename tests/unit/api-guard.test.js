/**
 * Unit tests for API Guard Middleware
 */

import { z } from 'zod';
import { 
  withApiGuard, 
  checkRateLimit, 
  checkRequestSize, 
  getClientIdentifier,
  clearRateLimitStore 
} from '../../lib/api-guard.js';

describe('API Guard Middleware', () => {
  let mockReq;
  let mockRes;
  let mockHandler;

  beforeEach(() => {
    clearRateLimitStore(); // Clear before each test
    
    mockReq = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      method: 'POST',
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation(function(data) {
        this._jsonData = data;
        return this;
      }),
      _jsonData: null,
    };

    mockHandler = jest.fn(async (req, res) => {
      res.status(200);
      res.json({ success: true });
      return res;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    clearRateLimitStore(); // Clear after each test
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        rateLimit: 5,
      });

      mockReq.socket.remoteAddress = '10.0.0.1'; // Unique IP for this test
      await guardedHandler(mockReq, mockRes);
      await guardedHandler(mockReq, mockRes);
      await guardedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledTimes(3);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should block requests exceeding rate limit', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        rateLimit: 2,
      });

      mockReq.socket.remoteAddress = '10.0.0.2'; // Unique IP for this test
      await guardedHandler(mockReq, mockRes);
      await guardedHandler(mockReq, mockRes);
      await guardedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledTimes(2);
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Rate limit exceeded',
        })
      );
    });
  });

  describe('Request Size Check', () => {
    it('should allow requests within size limit', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        maxBodySize: 1024,
      });

      mockReq.socket.remoteAddress = '10.0.0.3'; // Unique IP
      mockReq.body = { message: 'Hello' };
      await guardedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should block requests exceeding size limit', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        maxBodySize: 10, // Very small limit
      });

      mockReq.socket.remoteAddress = '10.0.0.4'; // Unique IP
      mockReq.body = { message: 'This is a long message that exceeds the limit' };
      await guardedHandler(mockReq, mockRes);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(413);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Payload too large',
        })
      );
    });
  });

  describe('Schema Validation', () => {
    const testSchema = z.object({
      message: z.string().min(1).max(100),
      userId: z.string().optional(),
    });

    it('should validate valid request data', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        schema: testSchema,
      });

      mockReq.socket.remoteAddress = '10.0.0.5'; // Unique IP
      mockReq.body = { message: 'Hello', userId: '123' };
      await guardedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should reject invalid request data', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        schema: testSchema,
      });

      mockReq.socket.remoteAddress = '10.0.0.6'; // Unique IP
      mockReq.body = { message: '', userId: '123' }; // Empty message
      await guardedHandler(mockReq, mockRes);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Validation failed',
        })
      );
    });

    it('should provide validation error details', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        schema: testSchema,
      });

      mockReq.socket.remoteAddress = '10.0.0.7'; // Unique IP
      mockReq.body = { userId: '123' }; // Missing required message field
      await guardedHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.any(Array),
        })
      );
    });
  });

  describe('Combined Guards', () => {
    const schema = z.object({
      message: z.string().min(1),
    });

    it('should enforce all guards in order', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        schema,
        rateLimit: 3,
        maxBodySize: 1024,
      });

      mockReq.socket.remoteAddress = '10.0.0.8'; // Unique IP
      mockReq.body = { message: 'Test' };
      await guardedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should fail on first guard violation', async () => {
      const guardedHandler = withApiGuard(mockHandler, {
        schema,
        rateLimit: 1,
        maxBodySize: 1024,
      });

      mockReq.socket.remoteAddress = '10.0.0.9'; // Unique IP
      mockReq.body = { message: 'Test' };
      await guardedHandler(mockReq, mockRes);
      await guardedHandler(mockReq, mockRes); // Should be rate limited

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });
  });

  describe('Client Identifier', () => {
    it('should extract IP from socket', () => {
      const req = {
        headers: {},
        socket: { remoteAddress: '192.168.1.1' },
      };
      expect(getClientIdentifier(req)).toBe('192.168.1.1');
    });

    it('should extract IP from x-forwarded-for header', () => {
      const req = {
        headers: { 'x-forwarded-for': '10.0.0.1, 10.0.0.2' },
        socket: { remoteAddress: '192.168.1.1' },
      };
      expect(getClientIdentifier(req)).toBe('10.0.0.1');
    });

    it('should handle missing IP gracefully', () => {
      const req = {
        headers: {},
        socket: {},
      };
      expect(getClientIdentifier(req)).toBe('unknown');
    });
  });

  describe('Error Handling', () => {
    it('should handle handler errors gracefully', async () => {
      const errorHandler = jest.fn().mockRejectedValue(new Error('Test error'));
      const guardedHandler = withApiGuard(errorHandler);

      mockReq.socket.remoteAddress = '10.0.0.10'; // Unique IP
      mockReq.body = { message: 'Test' };
      await guardedHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Internal server error',
        })
      );
    });
  });

  describe('Utility Functions', () => {
    it('checkRateLimit should track requests correctly', () => {
      clearRateLimitStore(); // Start fresh
      const identifier = 'test-user-unique';
      const maxRequests = 3;
      const windowMs = 60000;

      expect(checkRateLimit(identifier, maxRequests, windowMs)).toBe(true);
      expect(checkRateLimit(identifier, maxRequests, windowMs)).toBe(true);
      expect(checkRateLimit(identifier, maxRequests, windowMs)).toBe(true);
      expect(checkRateLimit(identifier, maxRequests, windowMs)).toBe(false);
    });

    it('checkRequestSize should validate body size', () => {
      const smallBody = { message: 'Hello' };
      const largeBody = { message: 'x'.repeat(10000) };

      expect(checkRequestSize(smallBody, 1024)).toBe(true);
      expect(checkRequestSize(largeBody, 100)).toBe(false);
    });
  });
});
