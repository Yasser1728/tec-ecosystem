/**
 * Unit tests for Payment Alert Logger
 */

import {
  paymentAlertLogger,
  PaymentAlertLogger,
  ALERT_LEVELS,
  ALERT_CATEGORIES,
} from '../../lib/monitoring/payment-alerts.js';

describe('Payment Alert Logger', () => {
  let logger;

  beforeEach(() => {
    // Create fresh instance for each test
    logger = new PaymentAlertLogger();
    logger.clearAlerts();
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ALERT_LEVELS', () => {
    it('should have defined alert levels', () => {
      expect(ALERT_LEVELS.INFO).toBe('info');
      expect(ALERT_LEVELS.WARNING).toBe('warning');
      expect(ALERT_LEVELS.ERROR).toBe('error');
      expect(ALERT_LEVELS.CRITICAL).toBe('critical');
    });
  });

  describe('ALERT_CATEGORIES', () => {
    it('should have defined alert categories', () => {
      expect(ALERT_CATEGORIES.TIMEOUT).toBe('timeout');
      expect(ALERT_CATEGORIES.FAILURE).toBe('failure');
      expect(ALERT_CATEGORIES.VALIDATION).toBe('validation');
      expect(ALERT_CATEGORIES.EXTERNAL_SERVICE).toBe('external_service');
      expect(ALERT_CATEGORIES.DATABASE).toBe('database');
      expect(ALERT_CATEGORIES.SECURITY).toBe('security');
    });
  });

  describe('log', () => {
    it('should create and store alert', () => {
      const alert = logger.log(
        ALERT_LEVELS.ERROR,
        ALERT_CATEGORIES.FAILURE,
        'Test error message',
        { paymentId: '123' }
      );

      expect(alert).toBeDefined();
      expect(alert.level).toBe(ALERT_LEVELS.ERROR);
      expect(alert.category).toBe(ALERT_CATEGORIES.FAILURE);
      expect(alert.message).toBe('Test error message');
      expect(alert.context.paymentId).toBe('123');
      expect(alert.context.environment).toBeDefined();
      expect(alert.context.systemService).toBe('payment-system');
      expect(alert.timestamp).toBeDefined();
    });

    it('should log to console with appropriate method', () => {
      logger.log(ALERT_LEVELS.INFO, ALERT_CATEGORIES.FAILURE, 'Info message');
      expect(console.log).toHaveBeenCalled();

      logger.log(ALERT_LEVELS.WARNING, ALERT_CATEGORIES.TIMEOUT, 'Warning message');
      expect(console.warn).toHaveBeenCalled();

      logger.log(ALERT_LEVELS.ERROR, ALERT_CATEGORIES.FAILURE, 'Error message');
      expect(console.error).toHaveBeenCalled();

      logger.log(ALERT_LEVELS.CRITICAL, ALERT_CATEGORIES.SECURITY, 'Critical message');
      expect(console.error).toHaveBeenCalled();
    });

    it('should add alerts to memory', () => {
      logger.log(ALERT_LEVELS.INFO, ALERT_CATEGORIES.FAILURE, 'Message 1');
      logger.log(ALERT_LEVELS.WARNING, ALERT_CATEGORIES.TIMEOUT, 'Message 2');

      const alerts = logger.getRecentAlerts();
      expect(alerts).toHaveLength(2);
      expect(alerts[0].message).toBe('Message 1');
      expect(alerts[1].message).toBe('Message 2');
    });
  });

  describe('timeout', () => {
    it('should log timeout alert', () => {
      const alert = logger.timeout('approve-payment', 15000, { paymentId: '123' });

      expect(alert.level).toBe(ALERT_LEVELS.WARNING);
      expect(alert.category).toBe(ALERT_CATEGORIES.TIMEOUT);
      expect(alert.message).toContain('approve-payment');
      expect(alert.message).toContain('15000ms');
      expect(alert.context.operation).toBe('approve-payment');
      expect(alert.context.duration).toBe(15000);
      expect(alert.context.paymentId).toBe('123');
    });
  });

  describe('failure', () => {
    it('should log failure alert', () => {
      const error = new Error('Payment failed');
      error.stack = 'Error: Payment failed\n  at test.js:10';

      const alert = logger.failure('process-payment', error, { userId: 'user123' });

      expect(alert.level).toBe(ALERT_LEVELS.ERROR);
      expect(alert.category).toBe(ALERT_CATEGORIES.FAILURE);
      expect(alert.message).toContain('process-payment');
      expect(alert.context.operation).toBe('process-payment');
      expect(alert.context.error).toBe('Payment failed');
      expect(alert.context.stack).toContain('Error: Payment failed');
      expect(alert.context.userId).toBe('user123');
    });
  });

  describe('critical', () => {
    it('should log critical alert', () => {
      const error = new Error('Critical failure');
      const alert = logger.critical('payment-system', error, { service: 'api' });

      expect(alert.level).toBe(ALERT_LEVELS.CRITICAL);
      expect(alert.category).toBe(ALERT_CATEGORIES.FAILURE);
      expect(alert.message).toContain('CRITICAL');
      expect(alert.message).toContain('payment-system');
    });
  });

  describe('validation', () => {
    it('should log validation alert', () => {
      const validationErrors = [
        'Amount must be positive',
        'User ID is required'
      ];

      const alert = logger.validation('create-payment', validationErrors, { amount: -10 });

      expect(alert.level).toBe(ALERT_LEVELS.WARNING);
      expect(alert.category).toBe(ALERT_CATEGORIES.VALIDATION);
      expect(alert.context.validationErrors).toEqual(validationErrors);
      expect(alert.context.amount).toBe(-10);
    });
  });

  describe('externalService', () => {
    it('should log external service alert', () => {
      const error = new Error('API timeout');
      const alert = logger.externalService(
        'Pi Network API',
        'approve-payment',
        error,
        { paymentId: '123' }
      );

      expect(alert.level).toBe(ALERT_LEVELS.ERROR);
      expect(alert.category).toBe(ALERT_CATEGORIES.EXTERNAL_SERVICE);
      expect(alert.message).toContain('Pi Network API');
      expect(alert.message).toContain('approve-payment');
      expect(alert.context.service).toBe('Pi Network API');
      expect(alert.context.operation).toBe('approve-payment');
      expect(alert.context.error).toBe('API timeout');
    });
  });

  describe('database', () => {
    it('should log database alert', () => {
      const error = new Error('Connection timeout');
      const alert = logger.database('create-payment', error, { table: 'payments' });

      expect(alert.level).toBe(ALERT_LEVELS.ERROR);
      expect(alert.category).toBe(ALERT_CATEGORIES.DATABASE);
      expect(alert.message).toContain('create-payment');
      expect(alert.context.operation).toBe('create-payment');
      expect(alert.context.error).toBe('Connection timeout');
      expect(alert.context.table).toBe('payments');
    });
  });

  describe('security', () => {
    it('should log security alert', () => {
      const alert = logger.security(
        'payment-verification',
        'Suspicious activity detected',
        { userId: 'user123', ip: '1.2.3.4' }
      );

      expect(alert.level).toBe(ALERT_LEVELS.CRITICAL);
      expect(alert.category).toBe(ALERT_CATEGORIES.SECURITY);
      expect(alert.message).toContain('payment-verification');
      expect(alert.message).toContain('Suspicious activity detected');
      expect(alert.context.operation).toBe('payment-verification');
      expect(alert.context.reason).toBe('Suspicious activity detected');
      expect(alert.context.userId).toBe('user123');
      expect(alert.context.ip).toBe('1.2.3.4');
    });
  });

  describe('getRecentAlerts', () => {
    it('should return recent alerts', () => {
      logger.log(ALERT_LEVELS.INFO, ALERT_CATEGORIES.FAILURE, 'Alert 1');
      logger.log(ALERT_LEVELS.WARNING, ALERT_CATEGORIES.TIMEOUT, 'Alert 2');
      logger.log(ALERT_LEVELS.ERROR, ALERT_CATEGORIES.FAILURE, 'Alert 3');

      const alerts = logger.getRecentAlerts();
      expect(alerts).toHaveLength(3);
    });

    it('should limit alerts by provided limit', () => {
      for (let i = 0; i < 10; i++) {
        logger.log(ALERT_LEVELS.INFO, ALERT_CATEGORIES.FAILURE, `Alert ${i}`);
      }

      const alerts = logger.getRecentAlerts(5);
      expect(alerts).toHaveLength(5);
      expect(alerts[0].message).toBe('Alert 5');
      expect(alerts[4].message).toBe('Alert 9');
    });
  });

  describe('clearAlerts', () => {
    it('should clear all alerts', () => {
      logger.log(ALERT_LEVELS.INFO, ALERT_CATEGORIES.FAILURE, 'Alert 1');
      logger.log(ALERT_LEVELS.WARNING, ALERT_CATEGORIES.TIMEOUT, 'Alert 2');

      expect(logger.getRecentAlerts()).toHaveLength(2);

      logger.clearAlerts();

      expect(logger.getRecentAlerts()).toHaveLength(0);
    });
  });

  describe('Sentry integration', () => {
    it('should detect when Sentry is not configured', () => {
      const logger = new PaymentAlertLogger();
      expect(logger.sentryEnabled).toBe(false);
    });

    it('should detect when Sentry is configured', () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://example@sentry.io/123';
      const logger = new PaymentAlertLogger();
      expect(logger.sentryEnabled).toBe(true);
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    });
  });

  describe('singleton instance', () => {
    it('should provide a singleton instance', () => {
      expect(paymentAlertLogger).toBeInstanceOf(PaymentAlertLogger);
    });
  });
});
