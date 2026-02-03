/**
 * Tests for Payment Timeout Configuration
 * @jest-environment node
 */

import {
  PAYMENT_TIMEOUTS,
  withTimeout,
  fetchWithTimeout,
  withRetry,
  isRetryableError,
} from '../../lib/config/payment-timeouts.js';

describe('Payment Timeout Configuration', () => {
  describe('PAYMENT_TIMEOUTS', () => {
    it('should have all required timeout values', () => {
      expect(PAYMENT_TIMEOUTS.PI_API_CREATE).toBeDefined();
      expect(PAYMENT_TIMEOUTS.PI_API_APPROVE).toBeDefined();
      expect(PAYMENT_TIMEOUTS.PI_API_COMPLETE).toBeDefined();
      expect(PAYMENT_TIMEOUTS.PI_API_CANCEL).toBeDefined();
      expect(PAYMENT_TIMEOUTS.PI_API_GET).toBeDefined();
      expect(PAYMENT_TIMEOUTS.DB_QUERY).toBeDefined();
      expect(PAYMENT_TIMEOUTS.DB_TRANSACTION).toBeDefined();
      expect(PAYMENT_TIMEOUTS.MAX_RETRIES).toBeDefined();
      expect(PAYMENT_TIMEOUTS.RETRY_DELAY).toBeDefined();
    });

    it('should have reasonable timeout values', () => {
      expect(PAYMENT_TIMEOUTS.PI_API_CREATE).toBeGreaterThan(0);
      expect(PAYMENT_TIMEOUTS.PI_API_APPROVE).toBeGreaterThan(0);
      expect(PAYMENT_TIMEOUTS.MAX_RETRIES).toBeGreaterThanOrEqual(1);
      expect(PAYMENT_TIMEOUTS.RETRY_DELAY).toBeGreaterThan(0);
    });
  });

  describe('withTimeout', () => {
    it('should resolve when promise completes within timeout', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('success'), 100));
      const result = await withTimeout(promise, 500, 'test');
      expect(result).toBe('success');
    });

    it('should reject when promise exceeds timeout', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('success'), 500));
      await expect(withTimeout(promise, 100, 'test')).rejects.toThrow('test timed out after 100ms');
    });

    it('should reject with operation name in error message', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('success'), 500));
      await expect(withTimeout(promise, 100, 'payment approval')).rejects.toThrow('payment approval timed out');
    });
  });

  describe('fetchWithTimeout', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should complete fetch within timeout', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const response = await fetchWithTimeout('https://api.example.com', {}, 5000);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    it('should timeout and abort fetch', async () => {
      global.fetch.mockImplementation(() => 
        new Promise((resolve) => setTimeout(resolve, 1000))
      );

      await expect(
        fetchWithTimeout('https://api.example.com', {}, 100)
      ).rejects.toThrow('timed out after 100ms');
    });

    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      await expect(
        fetchWithTimeout('https://api.example.com', {}, 5000)
      ).rejects.toThrow('Network error');
    });
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await withRetry(operation, 3, 100);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      const result = await withRetry(operation, 3, 10);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('permanent failure'));

      await expect(withRetry(operation, 3, 10)).rejects.toThrow('permanent failure');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should apply exponential backoff', async () => {
      const delays = [];
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      // Mock setTimeout to track delays
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((cb, delay) => {
        delays.push(delay);
        return originalSetTimeout(cb, 0);
      });

      await withRetry(operation, 3, 100, 2.0);

      // First delay: 100ms, second delay: 200ms (100 * 2.0)
      expect(delays[0]).toBe(100);
      expect(delays[1]).toBe(200);

      global.setTimeout = originalSetTimeout;
    });

    it('should pass attempt number to operation', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      await withRetry(operation, 3, 10);
      
      expect(operation).toHaveBeenCalledWith(1);
    });
  });

  describe('isRetryableError', () => {
    it('should identify network errors as retryable', () => {
      const error = new Error('Connection failed');
      error.code = 'ECONNREFUSED';
      expect(isRetryableError(error)).toBe(true);
    });

    it('should identify timeout errors as retryable', () => {
      const error = new Error('Request timed out');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should identify rate limit errors as retryable', () => {
      const error = new Error('Rate limited');
      error.statusCode = 429;
      expect(isRetryableError(error)).toBe(true);
    });

    it('should identify service unavailable as retryable', () => {
      const error = new Error('Service unavailable');
      error.statusCode = 503;
      expect(isRetryableError(error)).toBe(true);
    });

    it('should identify 404 as retryable (Pi Network specific)', () => {
      const error = new Error('Not found');
      error.statusCode = 404;
      expect(isRetryableError(error)).toBe(true);
    });

    it('should not retry on validation errors', () => {
      const error = new Error('Invalid input');
      error.statusCode = 400;
      expect(isRetryableError(error)).toBe(false);
    });

    it('should not retry on authorization errors', () => {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('Environment Variable Configuration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should use environment variables when provided', () => {
      process.env.PI_API_APPROVE_TIMEOUT = '20000';
      process.env.PAYMENT_MAX_RETRIES = '5';

      // Re-import to get new values
      jest.isolateModules(() => {
        const { PAYMENT_TIMEOUTS } = require('../../lib/config/payment-timeouts.js');
        expect(PAYMENT_TIMEOUTS.PI_API_APPROVE).toBe(20000);
        expect(PAYMENT_TIMEOUTS.MAX_RETRIES).toBe(5);
      });
    });

    it('should fall back to defaults when env vars are not set', () => {
      delete process.env.PI_API_APPROVE_TIMEOUT;
      delete process.env.PAYMENT_MAX_RETRIES;

      jest.isolateModules(() => {
        const { PAYMENT_TIMEOUTS } = require('../../lib/config/payment-timeouts.js');
        expect(PAYMENT_TIMEOUTS.PI_API_APPROVE).toBe(15000);
        expect(PAYMENT_TIMEOUTS.MAX_RETRIES).toBe(3);
      });
    });
  });
});
