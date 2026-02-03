/**
 * Unit tests for Bilingual Payment Error Handler
 */

import {
  PaymentError,
  createPaymentError,
  handlePaymentError,
  getLocaleFromRequest,
  PAYMENT_ERROR_CODES,
} from '../../lib/errors/payment-errors.js';
import { paymentAlertLogger } from '../../lib/monitoring/payment-alerts.js';

// Mock the payment alert logger
jest.mock('../../lib/monitoring/payment-alerts.js', () => ({
  paymentAlertLogger: {
    failure: jest.fn(),
  },
}));

describe('Payment Error Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PAYMENT_ERROR_CODES', () => {
    it('should have all required error codes', () => {
      expect(PAYMENT_ERROR_CODES.TIMEOUT).toBe('PAYMENT_TIMEOUT');
      expect(PAYMENT_ERROR_CODES.UNAUTHORIZED).toBe('PAYMENT_UNAUTHORIZED');
      expect(PAYMENT_ERROR_CODES.VALIDATION_FAILED).toBe('PAYMENT_VALIDATION_FAILED');
      expect(PAYMENT_ERROR_CODES.NETWORK_ERROR).toBe('PAYMENT_NETWORK_ERROR');
      expect(PAYMENT_ERROR_CODES.EXTERNAL_SERVICE_ERROR).toBe('PAYMENT_EXTERNAL_SERVICE_ERROR');
      expect(PAYMENT_ERROR_CODES.DATABASE_ERROR).toBe('PAYMENT_DATABASE_ERROR');
      expect(PAYMENT_ERROR_CODES.UNKNOWN_ERROR).toBe('PAYMENT_UNKNOWN_ERROR');
      expect(PAYMENT_ERROR_CODES.APPROVAL_FAILED).toBe('PAYMENT_APPROVAL_FAILED');
      expect(PAYMENT_ERROR_CODES.COMPLETION_FAILED).toBe('PAYMENT_COMPLETION_FAILED');
      expect(PAYMENT_ERROR_CODES.PI_SDK_NOT_AVAILABLE).toBe('PI_SDK_NOT_AVAILABLE');
      expect(PAYMENT_ERROR_CODES.USER_NOT_AUTHENTICATED).toBe('USER_NOT_AUTHENTICATED');
    });
  });

  describe('PaymentError', () => {
    it('should create error with English message', () => {
      const error = new PaymentError(
        PAYMENT_ERROR_CODES.TIMEOUT,
        { operation: 'approve-payment' },
        'en'
      );

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('PaymentError');
      expect(error.code).toBe(PAYMENT_ERROR_CODES.TIMEOUT);
      expect(error.locale).toBe('en');
      expect(error.message).toBe('The payment operation timed out. Please try again.');
      expect(error.details.operation).toBe('approve-payment');
      expect(error.timestamp).toBeDefined();
    });

    it('should create error with Arabic message', () => {
      const error = new PaymentError(
        PAYMENT_ERROR_CODES.TIMEOUT,
        { operation: 'approve-payment' },
        'ar'
      );

      expect(error.message).toBe('انتهت مهلة عملية الدفع. يرجى المحاولة مرة أخرى.');
      expect(error.locale).toBe('ar');
    });

    it('should store both language versions', () => {
      const error = new PaymentError(
        PAYMENT_ERROR_CODES.UNAUTHORIZED,
        {},
        'en'
      );

      expect(error.messages.en).toBe('You are not authorized to perform this payment operation.');
      expect(error.messages.ar).toBe('غير مصرح لك بإجراء عملية الدفع هذه.');
    });

    it('should log error to monitoring system', () => {
      const error = new PaymentError(
        PAYMENT_ERROR_CODES.NETWORK_ERROR,
        { paymentId: '123' },
        'en'
      );

      expect(paymentAlertLogger.failure).toHaveBeenCalledWith(
        'PaymentError',
        error,
        expect.objectContaining({
          code: PAYMENT_ERROR_CODES.NETWORK_ERROR,
          locale: 'en',
          details: { paymentId: '123' },
        })
      );
    });

    it('should fallback to unknown error for invalid code', () => {
      const error = new PaymentError(
        'INVALID_CODE',
        {},
        'en'
      );

      expect(error.message).toBe('An unexpected error occurred. Please try again or contact support.');
    });

    describe('getMessage', () => {
      it('should return message in requested locale', () => {
        const error = new PaymentError(
          PAYMENT_ERROR_CODES.VALIDATION_FAILED,
          {},
          'en'
        );

        expect(error.getMessage('en')).toBe('Payment validation failed. Please check your input.');
        expect(error.getMessage('ar')).toBe('فشل التحقق من الدفع. يرجى التحقق من البيانات المدخلة.');
      });

      it('should fallback to English for unknown locale', () => {
        const error = new PaymentError(
          PAYMENT_ERROR_CODES.TIMEOUT,
          {},
          'en'
        );

        expect(error.getMessage('fr')).toBe('The payment operation timed out. Please try again.');
      });
    });

    describe('toUserResponse', () => {
      it('should return user-friendly response', () => {
        const error = new PaymentError(
          PAYMENT_ERROR_CODES.INSUFFICIENT_FUNDS,
          { amount: 100 },
          'en'
        );

        const response = error.toUserResponse('en');

        expect(response).toEqual({
          error: true,
          code: PAYMENT_ERROR_CODES.INSUFFICIENT_FUNDS,
          message: 'Insufficient funds to complete this payment.',
          timestamp: error.timestamp,
        });
      });

      it('should return message in requested locale', () => {
        const error = new PaymentError(
          PAYMENT_ERROR_CODES.DATABASE_ERROR,
          {},
          'en'
        );

        const response = error.toUserResponse('ar');

        expect(response.message).toBe('حدث خطأ في قاعدة البيانات. يرجى الاتصال بالدعم إذا استمرت المشكلة.');
      });
    });

    describe('toDeveloperResponse', () => {
      it('should return detailed response with stack trace', () => {
        const error = new PaymentError(
          PAYMENT_ERROR_CODES.EXTERNAL_SERVICE_ERROR,
          { service: 'Pi Network API', status: 500 },
          'en'
        );

        const response = error.toDeveloperResponse();

        expect(response).toEqual({
          error: true,
          code: PAYMENT_ERROR_CODES.EXTERNAL_SERVICE_ERROR,
          messages: {
            en: expect.any(String),
            ar: expect.any(String),
          },
          details: {
            service: 'Pi Network API',
            status: 500,
          },
          timestamp: error.timestamp,
          stack: expect.stringContaining('Error'),
        });
      });
    });
  });

  describe('createPaymentError', () => {
    it('should create PaymentError instance', () => {
      const error = createPaymentError(
        PAYMENT_ERROR_CODES.APPROVAL_FAILED,
        { paymentId: '123' },
        'en'
      );

      expect(error).toBeInstanceOf(PaymentError);
      expect(error.code).toBe(PAYMENT_ERROR_CODES.APPROVAL_FAILED);
      expect(error.details.paymentId).toBe('123');
    });
  });

  describe('handlePaymentError', () => {
    it('should handle PaymentError and return user response', () => {
      const paymentError = new PaymentError(
        PAYMENT_ERROR_CODES.TIMEOUT,
        {},
        'en'
      );

      const response = handlePaymentError(paymentError, 'approve-payment', 'en', false);

      expect(response).toEqual({
        error: true,
        code: PAYMENT_ERROR_CODES.TIMEOUT,
        message: expect.any(String),
        timestamp: expect.any(String),
      });
      expect(response.stack).toBeUndefined();
    });

    it('should handle PaymentError and return developer response in development', () => {
      const paymentError = new PaymentError(
        PAYMENT_ERROR_CODES.TIMEOUT,
        {},
        'en'
      );

      const response = handlePaymentError(paymentError, 'approve-payment', 'en', true);

      expect(response).toEqual(expect.objectContaining({
        error: true,
        code: PAYMENT_ERROR_CODES.TIMEOUT,
        messages: expect.any(Object),
        details: expect.any(Object),
        stack: expect.any(String),
      }));
    });

    it('should convert regular Error to PaymentError with timeout detection', () => {
      const error = new Error('Request timed out after 5000ms');

      const response = handlePaymentError(error, 'approve-payment', 'en', false);

      expect(response.code).toBe(PAYMENT_ERROR_CODES.TIMEOUT);
      expect(response.message).toContain('timed out');
    });

    it('should detect network errors', () => {
      const error = new Error('Network request failed');

      const response = handlePaymentError(error, 'approve-payment', 'en', false);

      expect(response.code).toBe(PAYMENT_ERROR_CODES.NETWORK_ERROR);
    });

    it('should detect database errors', () => {
      const error = new Error('Prisma connection error');

      const response = handlePaymentError(error, 'create-payment', 'en', false);

      expect(response.code).toBe(PAYMENT_ERROR_CODES.DATABASE_ERROR);
    });

    it('should detect unauthorized errors', () => {
      const error = new Error('User not authenticated');

      const response = handlePaymentError(error, 'create-payment', 'en', false);

      expect(response.code).toBe(PAYMENT_ERROR_CODES.UNAUTHORIZED);
    });

    it('should default to unknown error for unrecognized errors', () => {
      const error = new Error('Something went wrong');

      const response = handlePaymentError(error, 'process-payment', 'en', false);

      expect(response.code).toBe(PAYMENT_ERROR_CODES.UNKNOWN_ERROR);
    });

    it('should use requested locale for error messages', () => {
      const error = new Error('Request timed out');

      const responseEn = handlePaymentError(error, 'approve-payment', 'en', false);
      const responseAr = handlePaymentError(error, 'approve-payment', 'ar', false);

      expect(responseEn.message).toContain('timed out');
      expect(responseAr.message).toContain('انتهت مهلة');
    });
  });

  describe('getLocaleFromRequest', () => {
    it('should get locale from query parameter', () => {
      const req = {
        query: { locale: 'ar' },
        headers: {},
      };

      expect(getLocaleFromRequest(req)).toBe('ar');
    });

    it('should default to English for invalid query locale', () => {
      const req = {
        query: { locale: 'fr' },
        headers: {},
      };

      expect(getLocaleFromRequest(req)).toBe('en');
    });

    it('should get locale from Accept-Language header', () => {
      const req = {
        query: {},
        headers: {
          'accept-language': 'ar-SA,ar;q=0.9',
        },
      };

      expect(getLocaleFromRequest(req)).toBe('ar');
    });

    it('should get locale from cookie', () => {
      const req = {
        query: {},
        headers: {
          'accept-language': '',
          cookie: 'NEXT_LOCALE=ar; other=value',
        },
      };

      expect(getLocaleFromRequest(req)).toBe('ar');
    });

    it('should default to English when no locale is found', () => {
      const req = {
        query: {},
        headers: {},
      };

      expect(getLocaleFromRequest(req)).toBe('en');
    });

    it('should prioritize query parameter over headers', () => {
      const req = {
        query: { locale: 'en' },
        headers: {
          'accept-language': 'ar-SA',
          cookie: 'NEXT_LOCALE=ar',
        },
      };

      expect(getLocaleFromRequest(req)).toBe('en');
    });
  });
});
