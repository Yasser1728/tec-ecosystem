/**
 * Tests for Payment Alerts and Monitoring
 * @jest-environment node
 */

import {
  AlertLevel,
  AlertCategory,
  logPaymentAlert,
  logPaymentTimeout,
  logPaymentFailure,
  logExternalServiceError,
  logRetryAttempt,
  logSecurityEvent,
} from '../../lib/monitoring/payment-alerts.js';

describe('Payment Alerts and Monitoring', () => {
  let consoleLogSpy, consoleWarnSpy, consoleErrorSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('AlertLevel and AlertCategory', () => {
    it('should have all alert levels defined', () => {
      expect(AlertLevel.INFO).toBe('INFO');
      expect(AlertLevel.WARNING).toBe('WARNING');
      expect(AlertLevel.ERROR).toBe('ERROR');
      expect(AlertLevel.CRITICAL).toBe('CRITICAL');
    });

    it('should have all alert categories defined', () => {
      expect(AlertCategory.TIMEOUT).toBe('timeout');
      expect(AlertCategory.FAILURE).toBe('failure');
      expect(AlertCategory.VALIDATION).toBe('validation');
      expect(AlertCategory.EXTERNAL_SERVICE).toBe('external_service');
      expect(AlertCategory.DATABASE).toBe('database');
      expect(AlertCategory.SECURITY).toBe('security');
      expect(AlertCategory.RETRY).toBe('retry');
    });
  });

  describe('logPaymentAlert', () => {
    it('should log INFO level alerts to console.log', () => {
      logPaymentAlert({
        level: AlertLevel.INFO,
        category: AlertCategory.VALIDATION,
        message: 'Test info message',
        data: { test: 'data' },
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.stringContaining('Test info message'),
        expect.any(Object)
      );
    });

    it('should log WARNING level alerts to console.warn', () => {
      logPaymentAlert({
        level: AlertLevel.WARNING,
        category: AlertCategory.RETRY,
        message: 'Test warning message',
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARNING]'),
        expect.stringContaining('Test warning message'),
        expect.any(Object)
      );
    });

    it('should log ERROR level alerts to console.error', () => {
      logPaymentAlert({
        level: AlertLevel.ERROR,
        category: AlertCategory.FAILURE,
        message: 'Test error message',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('Test error message'),
        expect.any(Object)
      );
    });

    it('should log CRITICAL level alerts to console.error', () => {
      logPaymentAlert({
        level: AlertLevel.CRITICAL,
        category: AlertCategory.SECURITY,
        message: 'Test critical message',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CRITICAL]'),
        expect.stringContaining('Test critical message'),
        expect.any(Object)
      );
    });

    it('should sanitize sensitive data', () => {
      logPaymentAlert({
        level: AlertLevel.INFO,
        category: AlertCategory.VALIDATION,
        message: 'Test',
        data: {
          apiKey: 'secret123',
          password: 'pass123',
          userId: 'user123',
        },
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          apiKey: '***REDACTED***',
          password: '***REDACTED***',
          userId: 'user123',
        })
      );
    });

    it('should include error details when error is provided', () => {
      const testError = new Error('Test error');
      
      logPaymentAlert({
        level: AlertLevel.ERROR,
        category: AlertCategory.FAILURE,
        message: 'Test with error',
        error: testError,
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      // Error is logged in a separate call
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    it('should return alert object', () => {
      const alert = logPaymentAlert({
        level: AlertLevel.INFO,
        category: AlertCategory.VALIDATION,
        message: 'Test message',
      });

      expect(alert).toMatchObject({
        level: AlertLevel.INFO,
        category: AlertCategory.VALIDATION,
        message: 'Test message',
        timestamp: expect.any(String),
      });
    });
  });

  describe('logPaymentTimeout', () => {
    it('should log timeout with correct parameters', () => {
      logPaymentTimeout({
        operation: 'approve',
        timeoutMs: 15000,
        paymentId: 'pi-123',
        data: { attempt: 1 },
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('Payment operation timed out'),
        expect.objectContaining({
          operation: 'approve',
          timeoutMs: 15000,
          paymentId: 'pi-123',
          attempt: 1,
        })
      );
    });
  });

  describe('logPaymentFailure', () => {
    it('should log failure with error object', () => {
      const error = new Error('Payment failed');
      
      logPaymentFailure({
        operation: 'complete',
        paymentId: 'pi-456',
        error,
        data: { txid: 'tx-123' },
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('Payment operation failed'),
        expect.objectContaining({
          operation: 'complete',
          paymentId: 'pi-456',
          txid: 'tx-123',
        })
      );
    });
  });

  describe('logExternalServiceError', () => {
    it('should log external service errors with CRITICAL level for 5xx', () => {
      const error = new Error('Service unavailable');
      
      logExternalServiceError({
        service: 'Pi Network API',
        operation: 'approve',
        statusCode: 503,
        error,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CRITICAL]'),
        expect.stringContaining('External service error'),
        expect.objectContaining({
          service: 'Pi Network API',
          operation: 'approve',
          statusCode: 503,
        })
      );
    });

    it('should log external service errors with ERROR level for 4xx', () => {
      const error = new Error('Bad request');
      
      logExternalServiceError({
        service: 'Pi Network API',
        operation: 'approve',
        statusCode: 400,
        error,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('External service error'),
        expect.any(Object)
      );
    });
  });

  describe('logRetryAttempt', () => {
    it('should log retry attempts with WARNING level', () => {
      logRetryAttempt({
        operation: 'approve',
        attempt: 2,
        maxRetries: 3,
        delay: 2000,
        reason: '404 not found',
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARNING]'),
        expect.stringContaining('Retrying operation'),
        expect.objectContaining({
          operation: 'approve',
          attempt: 2,
          maxRetries: 3,
          delay: 2000,
          reason: '404 not found',
        })
      );
    });
  });

  describe('logSecurityEvent', () => {
    it('should log high severity security events as CRITICAL', () => {
      logSecurityEvent({
        event: 'Unauthorized access attempt',
        severity: 'high',
        data: { ip: '192.168.1.1' },
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CRITICAL]'),
        expect.stringContaining('Security event'),
        expect.any(Object)
      );
    });

    it('should log low severity security events as WARNING', () => {
      logSecurityEvent({
        event: 'Suspicious activity',
        severity: 'low',
        data: { ip: '192.168.1.1' },
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARNING]'),
        expect.stringContaining('Security event'),
        expect.any(Object)
      );
    });
  });

  describe('Data Sanitization', () => {
    it('should sanitize nested sensitive data', () => {
      logPaymentAlert({
        level: AlertLevel.INFO,
        category: AlertCategory.VALIDATION,
        message: 'Test',
        data: {
          user: {
            piId: 'pi-user-123',
            name: 'Test User',
          },
          payment: {
            apiKey: 'secret-key',
            amount: 100,
          },
        },
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          user: expect.objectContaining({
            piId: '***REDACTED***',
            name: 'Test User',
          }),
          payment: expect.objectContaining({
            apiKey: '***REDACTED***',
            amount: 100,
          }),
        })
      );
    });
  });
});
