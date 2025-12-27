/**
 * Unit tests for Rate Limit Middleware
 */

import { withRateLimit, clearRateStore } from '../../middleware/ratelimit';

describe('Rate Limit Middleware', () => {
  let mockReq;
  let mockRes;
  let mockHandler;

  beforeEach(() => {
    clearRateStore();
    
    mockReq = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      url: '/api/test'
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockHandler = jest.fn().mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
    clearRateStore();
  });

  it('should allow requests within rate limit', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, {
      maxRequests: 5,
      windowMs: 60000
    });

    await rateLimitedHandler(mockReq, mockRes);
    await rateLimitedHandler(mockReq, mockRes);
    await rateLimitedHandler(mockReq, mockRes);

    expect(mockHandler).toHaveBeenCalledTimes(3);
    expect(mockRes.status).not.toHaveBeenCalledWith(429);
  });

  it('should block requests exceeding rate limit', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, {
      maxRequests: 3,
      windowMs: 60000
    });

    await rateLimitedHandler(mockReq, mockRes);
    await rateLimitedHandler(mockReq, mockRes);
    await rateLimitedHandler(mockReq, mockRes);
    await rateLimitedHandler(mockReq, mockRes);

    expect(mockHandler).toHaveBeenCalledTimes(3);
    expect(mockRes.status).toHaveBeenCalledWith(429);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Too many requests'
    });
  });

  it('should reset count after window expires', async () => {
    jest.useFakeTimers();

    const rateLimitedHandler = withRateLimit(mockHandler, {
      maxRequests: 2,
      windowMs: 1000
    });

    await rateLimitedHandler(mockReq, mockRes);
    await rateLimitedHandler(mockReq, mockRes);
    
    expect(mockHandler).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(1001);

    await rateLimitedHandler(mockReq, mockRes);
    await rateLimitedHandler(mockReq, mockRes);

    expect(mockHandler).toHaveBeenCalledTimes(4);
    expect(mockRes.status).not.toHaveBeenCalledWith(429);

    jest.useRealTimers();
  });

  it('should track different IPs separately', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, {
      maxRequests: 2,
      windowMs: 60000
    });

    const req1 = { ...mockReq, socket: { remoteAddress: '127.0.0.1' } };
    const req2 = { ...mockReq, socket: { remoteAddress: '192.168.1.1' } };

    await rateLimitedHandler(req1, mockRes);
    await rateLimitedHandler(req1, mockRes);
    await rateLimitedHandler(req2, mockRes);
    await rateLimitedHandler(req2, mockRes);

    expect(mockHandler).toHaveBeenCalledTimes(4);
    expect(mockRes.status).not.toHaveBeenCalledWith(429);
  });

  it('should track different URLs separately', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, {
      maxRequests: 2,
      windowMs: 60000
    });

    const req1 = { ...mockReq, url: '/api/endpoint1' };
    const req2 = { ...mockReq, url: '/api/endpoint2' };

    await rateLimitedHandler(req1, mockRes);
    await rateLimitedHandler(req1, mockRes);
    await rateLimitedHandler(req2, mockRes);
    await rateLimitedHandler(req2, mockRes);

    expect(mockHandler).toHaveBeenCalledTimes(4);
    expect(mockRes.status).not.toHaveBeenCalledWith(429);
  });

  it('should use x-forwarded-for header when available', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, {
      maxRequests: 2,
      windowMs: 60000
    });

    const reqWithForwarded = {
      ...mockReq,
      headers: { 'x-forwarded-for': '10.0.0.1' }
    };

    await rateLimitedHandler(reqWithForwarded, mockRes);
    await rateLimitedHandler(reqWithForwarded, mockRes);
    await rateLimitedHandler(reqWithForwarded, mockRes);

    expect(mockHandler).toHaveBeenCalledTimes(2);
    expect(mockRes.status).toHaveBeenCalledWith(429);
  });

  it('should cleanup expired entries periodically', async () => {
    jest.useFakeTimers();

    const rateLimitedHandler = withRateLimit(mockHandler, {
      maxRequests: 5,
      windowMs: 1000
    });

    // Create multiple entries
    for (let i = 0; i < 10; i++) {
      const req = {
        ...mockReq,
        socket: { remoteAddress: `192.168.1.${i}` }
      };
      await rateLimitedHandler(req, mockRes);
    }

    expect(mockHandler).toHaveBeenCalledTimes(10);

    // Advance time to expire entries
    jest.advanceTimersByTime(2000);

    // Trigger cleanup by making a new request after cleanup interval
    jest.advanceTimersByTime(60 * 60 * 1000);
    
    const newReq = {
      ...mockReq,
      socket: { remoteAddress: '192.168.1.100' }
    };
    await rateLimitedHandler(newReq, mockRes);

    expect(mockHandler).toHaveBeenCalledTimes(11);

    jest.useRealTimers();
  });

  it('should use default options when none provided', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler);

    for (let i = 0; i < 100; i++) {
      await rateLimitedHandler(mockReq, mockRes);
    }

    expect(mockHandler).toHaveBeenCalledTimes(100);

    await rateLimitedHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(429);
  });
});
