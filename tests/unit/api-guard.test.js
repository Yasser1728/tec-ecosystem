/**
 * Unit tests for API Guard utilities
 */

import {
  rateLimit,
  costLimit,
  bodySizeGuard,
  validateSchema,
  sanitizeInput,
  clearAllStores,
  recordCost,
  apiGuard
} from '../../lib/api-guard';

describe('API Guard Utilities', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    clearAllStores();
    
    mockReq = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      url: '/api/test',
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    clearAllStores();
  });

  describe('rateLimit', () => {
    it('should allow requests within rate limit', () => {
      const middleware = rateLimit({ maxRequests: 5, windowMs: 60000 });
      
      middleware(mockReq, mockRes, mockNext);
      middleware(mockReq, mockRes, mockNext);
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(3);
      expect(mockRes.status).not.toHaveBeenCalledWith(429);
    });

    it('should block requests exceeding rate limit', () => {
      const middleware = rateLimit({ maxRequests: 2, windowMs: 60000 });
      
      middleware(mockReq, mockRes, mockNext);
      middleware(mockReq, mockRes, mockNext);
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(2);
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    });

    it('should track different IPs separately', () => {
      const middleware = rateLimit({ maxRequests: 2, windowMs: 60000 });
      
      const req1 = { ...mockReq, socket: { remoteAddress: '127.0.0.1' } };
      const req2 = { ...mockReq, socket: { remoteAddress: '192.168.1.1' } };
      
      middleware(req1, mockRes, mockNext);
      middleware(req1, mockRes, mockNext);
      middleware(req2, mockRes, mockNext);
      middleware(req2, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(4);
      expect(mockRes.status).not.toHaveBeenCalledWith(429);
    });
  });

  describe('costLimit', () => {
    it('should allow requests within cost limit', () => {
      const middleware = costLimit({ maxCostPerHour: 10.0 });
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockReq.costRecord).toBeDefined();
      expect(mockReq.costKey).toBeDefined();
    });

    it('should block requests exceeding cost limit', () => {
      const middleware = costLimit({ maxCostPerHour: 5.0 });
      
      // First request - set up cost record
      middleware(mockReq, mockRes, mockNext);
      
      // Record high cost
      recordCost(mockReq, 6.0);
      
      // Second request should be blocked
      const mockReq2 = { ...mockReq, body: {} };
      middleware(mockReq2, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Cost limit exceeded',
        message: 'You have exceeded your hourly usage limit. Please try again later.'
      });
    });
  });

  describe('bodySizeGuard', () => {
    it('should allow requests within size limit', () => {
      mockReq.headers['content-length'] = '5000';
      const middleware = bodySizeGuard({ maxSize: 10000 });
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalledWith(413);
    });

    it('should block requests exceeding size limit', () => {
      mockReq.headers['content-length'] = '15000';
      const middleware = bodySizeGuard({ maxSize: 10000 });
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(413);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Payload too large',
        message: 'Request body exceeds maximum size of 10000 bytes'
      });
    });
  });

  describe('validateSchema', () => {
    it('should pass validation for valid data', () => {
      mockReq.body = {
        message: 'Hello world',
        userId: 'user123'
      };
      
      const schema = {
        message: { required: true, type: 'string', minLength: 1 },
        userId: { required: false, type: 'string' }
      };
      
      const middleware = validateSchema(schema);
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalledWith(400);
    });

    it('should fail validation for missing required field', () => {
      mockReq.body = {};
      
      const schema = {
        message: { required: true, type: 'string' }
      };
      
      const middleware = validateSchema(schema);
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        errors: ["Field 'message' is required"]
      });
    });

    it('should fail validation for wrong type', () => {
      mockReq.body = {
        message: 123
      };
      
      const schema = {
        message: { required: true, type: 'string' }
      };
      
      const middleware = validateSchema(schema);
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should fail validation for length constraints', () => {
      mockReq.body = {
        message: 'Hi'
      };
      
      const schema = {
        message: { required: true, type: 'string', minLength: 5 }
      };
      
      const middleware = validateSchema(schema);
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("xss")</script> world';
      const result = sanitizeInput(input);
      
      expect(result).toBe('Hello alert("xss") world');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('should remove javascript: protocol', () => {
      const input = 'Click <a href="javascript:alert(1)">here</a>';
      const result = sanitizeInput(input);
      
      expect(result).not.toContain('javascript:');
    });

    it('should remove event handlers', () => {
      const input = '<div onclick="alert(1)">Click</div>';
      const result = sanitizeInput(input);
      
      expect(result).not.toContain('onclick=');
    });

    it('should handle non-string input', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
      expect(sanitizeInput(undefined)).toBe(undefined);
    });
  });

  describe('apiGuard composite', () => {
    it('should return array of middleware functions', () => {
      const middlewares = apiGuard({
        rateLimit: { maxRequests: 100 },
        bodySizeGuard: { maxSize: 10000 },
        schema: { message: { required: true, type: 'string' } }
      });
      
      expect(Array.isArray(middlewares)).toBe(true);
      expect(middlewares.length).toBeGreaterThan(0);
    });
  });
});
