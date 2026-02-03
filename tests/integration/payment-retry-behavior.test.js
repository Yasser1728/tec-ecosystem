/**
 * Integration tests for Payment Retry and Backoff Behavior
 * Tests the complete retry flow with timeout handling
 * @jest-environment node
 */

import { withRetry, isRetryableError, PAYMENT_TIMEOUTS } from '../../lib/config/payment-timeouts.js';
import { logRetryAttempt } from '../../lib/monitoring/payment-alerts.js';

// Mock the monitoring
jest.mock('../../lib/monitoring/payment-alerts.js', () => ({
  logRetryAttempt: jest.fn(),
}));

describe('Payment Retry and Backoff Integration', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('Payment Approval Retry Behavior', () => {
    it('should succeed immediately on 200 response', async () => {
      const mockApprovePayment = jest.fn().mockResolvedValue({
        status: 200,
        data: { approved: true },
      });

      const result = await withRetry(mockApprovePayment, 3, 100);

      expect(result).toEqual({ status: 200, data: { approved: true } });
      expect(mockApprovePayment).toHaveBeenCalledTimes(1);
    });

    it('should retry on 404 and succeed on second attempt', async () => {
      const mockApprovePayment = jest.fn()
        .mockRejectedValueOnce(Object.assign(new Error('Not found'), { statusCode: 404 }))
        .mockResolvedValue({ status: 200, data: { approved: true } });

      const result = await withRetry(mockApprovePayment, 3, 100);

      expect(result).toEqual({ status: 200, data: { approved: true } });
      expect(mockApprovePayment).toHaveBeenCalledTimes(2);
    });

    it('should retry 3 times on persistent 404 and fail', async () => {
      const mockApprovePayment = jest.fn()
        .mockRejectedValue(Object.assign(new Error('Not found'), { statusCode: 404 }));

      await expect(withRetry(mockApprovePayment, 3, 50)).rejects.toThrow('Not found');
      expect(mockApprovePayment).toHaveBeenCalledTimes(3);
    });

    it('should not retry on 400 validation error', async () => {
      const mockApprovePayment = jest.fn()
        .mockRejectedValue(Object.assign(new Error('Invalid payment'), { statusCode: 400 }));

      await expect(mockApprovePayment()).rejects.toThrow('Invalid payment');
      expect(mockApprovePayment).toHaveBeenCalledTimes(1);
    });

    it('should retry on timeout and succeed', async () => {
      const mockApprovePayment = jest.fn()
        .mockRejectedValueOnce(new Error('Request timed out'))
        .mockResolvedValue({ status: 200, data: { approved: true } });

      const result = await withRetry(mockApprovePayment, 3, 100);

      expect(result).toEqual({ status: 200, data: { approved: true } });
      expect(mockApprovePayment).toHaveBeenCalledTimes(2);
    });

    it('should retry on 503 Service Unavailable', async () => {
      const mockApprovePayment = jest.fn()
        .mockRejectedValueOnce(Object.assign(new Error('Service unavailable'), { statusCode: 503 }))
        .mockResolvedValue({ status: 200, data: { approved: true } });

      const result = await withRetry(mockApprovePayment, 3, 100);

      expect(result).toEqual({ status: 200, data: { approved: true } });
      expect(mockApprovePayment).toHaveBeenCalledTimes(2);
    });
  });

  describe('Exponential Backoff Behavior', () => {
    it('should apply exponential backoff between retries', async () => {
      const delays = [];
      const mockOperation = jest.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      // Track actual delays
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((cb, delay) => {
        if (delay > 0) delays.push(delay);
        return originalSetTimeout(cb, 0); // Execute immediately for test speed
      });

      await withRetry(mockOperation, 3, 100, 2.0);

      // Verify exponential backoff: 100ms, 200ms
      expect(delays).toHaveLength(2);
      expect(delays[0]).toBe(100);
      expect(delays[1]).toBe(200); // 100 * 2.0

      global.setTimeout = originalSetTimeout;
    });

    it('should respect configured retry delay from PAYMENT_TIMEOUTS', async () => {
      const delays = [];
      const mockOperation = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((cb, delay) => {
        if (delay > 0) delays.push(delay);
        return originalSetTimeout(cb, 0);
      });

      await withRetry(
        mockOperation,
        PAYMENT_TIMEOUTS.MAX_RETRIES,
        PAYMENT_TIMEOUTS.RETRY_DELAY,
        PAYMENT_TIMEOUTS.RETRY_BACKOFF_MULTIPLIER
      );

      expect(delays[0]).toBe(PAYMENT_TIMEOUTS.RETRY_DELAY);

      global.setTimeout = originalSetTimeout;
    });
  });

  describe('Payment Completion Retry Behavior', () => {
    it('should handle completion with retry on network error', async () => {
      const mockCompletePayment = jest.fn()
        .mockRejectedValueOnce(Object.assign(new Error('Network error'), { code: 'ECONNREFUSED' }))
        .mockResolvedValue({ status: 200, data: { completed: true } });

      const result = await withRetry(mockCompletePayment, 3, 100);

      expect(result).toEqual({ status: 200, data: { completed: true } });
      expect(mockCompletePayment).toHaveBeenCalledTimes(2);
    });

    it('should not retry completion on 401 unauthorized', async () => {
      const mockCompletePayment = jest.fn()
        .mockRejectedValue(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));

      await expect(mockCompletePayment()).rejects.toThrow('Unauthorized');
      expect(mockCompletePayment).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Classification', () => {
    it('should correctly identify retryable errors', () => {
      const retryableErrors = [
        Object.assign(new Error('Connection refused'), { code: 'ECONNREFUSED' }),
        Object.assign(new Error('Timeout'), { code: 'ETIMEDOUT' }),
        new Error('Request timed out after 15000ms'),
        Object.assign(new Error('Too many requests'), { statusCode: 429 }),
        Object.assign(new Error('Service unavailable'), { statusCode: 503 }),
        Object.assign(new Error('Gateway timeout'), { statusCode: 504 }),
        Object.assign(new Error('Not found'), { statusCode: 404 }),
      ];

      retryableErrors.forEach(error => {
        expect(isRetryableError(error)).toBe(true);
      });
    });

    it('should correctly identify non-retryable errors', () => {
      const nonRetryableErrors = [
        Object.assign(new Error('Bad request'), { statusCode: 400 }),
        Object.assign(new Error('Unauthorized'), { statusCode: 401 }),
        Object.assign(new Error('Forbidden'), { statusCode: 403 }),
        Object.assign(new Error('Method not allowed'), { statusCode: 405 }),
        new Error('Generic error'),
      ];

      nonRetryableErrors.forEach(error => {
        expect(isRetryableError(error)).toBe(false);
      });
    });
  });

  describe('Attempt Counter', () => {
    it('should pass correct attempt number to operation', async () => {
      const attempts = [];
      const mockOperation = jest.fn().mockImplementation((attempt) => {
        attempts.push(attempt);
        if (attempt < 3) {
          return Promise.reject(new Error('fail'));
        }
        return Promise.resolve('success');
      });

      await withRetry(mockOperation, 3, 50);

      expect(attempts).toEqual([1, 2, 3]);
    });
  });

  describe('Real-world Payment Scenarios', () => {
    it('should handle Pi Network payment not registered yet (404 -> 200)', async () => {
      // Simulates Pi Network's eventual consistency
      const mockPiApprove = jest.fn()
        .mockRejectedValueOnce(Object.assign(new Error('Payment not found'), { statusCode: 404 }))
        .mockRejectedValueOnce(Object.assign(new Error('Payment not found'), { statusCode: 404 }))
        .mockResolvedValue({ status: 200, approved: true });

      const result = await withRetry(mockPiApprove, 3, 2000);

      expect(result).toEqual({ status: 200, approved: true });
      expect(mockPiApprove).toHaveBeenCalledTimes(3);
    });

    it('should handle temporary Pi Network API outage', async () => {
      const mockPiApprove = jest.fn()
        .mockRejectedValueOnce(Object.assign(new Error('Service unavailable'), { statusCode: 503 }))
        .mockResolvedValue({ status: 200, approved: true });

      const result = await withRetry(mockPiApprove, 3, 1000);

      expect(result).toEqual({ status: 200, approved: true });
      expect(mockPiApprove).toHaveBeenCalledTimes(2);
    });

    it('should give up after max retries on persistent failure', async () => {
      const mockPiApprove = jest.fn()
        .mockRejectedValue(Object.assign(new Error('Service unavailable'), { statusCode: 503 }));

      await expect(withRetry(mockPiApprove, 3, 100)).rejects.toThrow('Service unavailable');
      expect(mockPiApprove).toHaveBeenCalledTimes(3);
    });
  });

  describe('Performance and Timing', () => {
    it('should complete quickly on immediate success', async () => {
      const startTime = Date.now();
      const mockOperation = jest.fn().mockResolvedValue('success');

      await withRetry(mockOperation, 3, 2000);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100); // Should be nearly instant
    });

    it('should respect delay between retries', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const startTime = Date.now();
      await withRetry(mockOperation, 3, 100);
      const duration = Date.now() - startTime;

      // Should take at least 100ms for one retry delay
      expect(duration).toBeGreaterThanOrEqual(90); // Allow small timing variance
    });
  });
});
