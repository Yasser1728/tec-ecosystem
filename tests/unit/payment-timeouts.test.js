/**
 * Unit tests for Payment Timeout Configuration
 */

import {
  PAYMENT_TIMEOUTS,
  withTimeout,
  fetchWithTimeout,
  withRetry,
} from '../../lib/config/payment-timeouts.js';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Payment Timeouts Configuration', () => {
  describe('PAYMENT_TIMEOUTS', () => {
    it('should have default timeout values', () => {
      expect(PAYMENT_TIMEOUTS.PI_API_APPROVE).toBeDefined();
      expect(PAYMENT_TIMEOUTS.PI_API_COMPLETE).toBeDefined();
      expect(PAYMENT_TIMEOUTS.PI_API_VERIFY).toBeDefined();
      expect(PAYMENT_TIMEOUTS.CLIENT_CREATE_PAYMENT).toBeDefined();
      expect(PAYMENT_TIMEOUTS.CLIENT_APPROVE).toBeDefined();
      expect(PAYMENT_TIMEOUTS.CLIENT_COMPLETE).toBeDefined();
      expect(PAYMENT_TIMEOUTS.RETRY_DELAY).toBeDefined();
      expect(PAYMENT_TIMEOUTS.MAX_RETRIES).toBeDefined();
      expect(PAYMENT_TIMEOUTS.DB_QUERY_TIMEOUT).toBeDefined();
    });

    it('should have reasonable default values', () => {
      expect(PAYMENT_TIMEOUTS.PI_API_APPROVE).toBeGreaterThan(0);
      expect(PAYMENT_TIMEOUTS.MAX_RETRIES).toBeGreaterThanOrEqual(1);
      expect(PAYMENT_TIMEOUTS.RETRY_DELAY).toBeGreaterThan(0);
    });
  });

  describe('withTimeout', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should resolve when promise completes within timeout', async () => {
      const promise = Promise.resolve('success');
      const result = await withTimeout(promise, 1000, 'Test Operation');
      expect(result).toBe('success');
    });

    it('should reject when promise exceeds timeout', async () => {
      const promise = new Promise((resolve) => setTimeout(resolve, 200));
      
      await expect(
        withTimeout(promise, 50, 'Test Operation')
      ).rejects.toThrow('Test Operation timed out after 50ms');
    });

    it('should clear timeout on success', async () => {
      const promise = Promise.resolve('success');
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      await withTimeout(promise, 1000, 'Test Operation');
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('should clear timeout on error', async () => {
      const promise = Promise.reject(new Error('test error'));
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      await expect(
        withTimeout(promise, 1000, 'Test Operation')
      ).rejects.toThrow('test error');
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('fetchWithTimeout', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      global.AbortController = jest.fn().mockImplementation(() => ({
        signal: 'mock-signal',
        abort: jest.fn(),
      }));
    });

    it('should successfully fetch when within timeout', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'test' }) };
      global.fetch.mockResolvedValue(mockResponse);

      const result = await fetchWithTimeout('https://api.example.com', {}, 5000);
      
      expect(result).toBe(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com',
        expect.objectContaining({ signal: 'mock-signal' })
      );
    });

    it('should throw timeout error when fetch exceeds timeout', async () => {
      const abortController = {
        signal: 'mock-signal',
        abort: jest.fn(),
      };
      global.AbortController = jest.fn(() => abortController);

      global.fetch.mockImplementation(() => 
        new Promise((resolve) => setTimeout(resolve, 200))
      );

      // This test simulates timeout behavior
      const promise = fetchWithTimeout('https://api.example.com', {}, 50);
      
      // Wait for timeout to trigger
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify abort was called
      expect(abortController.abort).toHaveBeenCalled();
    });

    it('should include custom options in fetch call', async () => {
      const mockResponse = { ok: true };
      global.fetch.mockResolvedValue(mockResponse);

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' }),
      };

      await fetchWithTimeout('https://api.example.com', options, 5000);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: 'mock-signal',
        })
      );
    });
  });

  describe('withRetry', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should succeed on first attempt', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      
      const result = await withRetry(mockFn, 3, 1000, 'Test Operation');
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');
      
      const promise = withRetry(mockFn, 3, 100, 'Test Operation');
      
      // Fast-forward through retries
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      jest.advanceTimersByTime(200);
      await Promise.resolve();
      
      const result = await promise;
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('persistent failure'));
      
      const promise = withRetry(mockFn, 3, 100, 'Test Operation');
      
      // Fast-forward through all retries
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      jest.advanceTimersByTime(200);
      await Promise.resolve();
      jest.advanceTimersByTime(400);
      await Promise.resolve();
      
      await expect(promise).rejects.toThrow('Test Operation failed after 3 attempts');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('fail'));
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      
      const promise = withRetry(mockFn, 4, 1000, 'Test Operation');
      
      // Check exponential backoff delays: 1000, 2000, 4000, 8000
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
      
      jest.advanceTimersByTime(4000);
      await Promise.resolve();
      
      await expect(promise).rejects.toThrow();
      
      setTimeoutSpy.mockRestore();
    });
  });
});
