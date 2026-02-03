/**
 * Payment Error Handling with Bilingual Support
 * Centralized error definitions and handling for payment operations
 * 
 * Supports Arabic and English error messages
 * Security: Sanitizes error details for client responses
 */

import { logPaymentFailure } from '../monitoring/payment-alerts.js';

// Error codes
export const PaymentErrorCode = {
  TIMEOUT: 'PAYMENT_TIMEOUT',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  PAYMENT_CANCELLED: 'PAYMENT_CANCELLED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

// Bilingual error messages
const ERROR_MESSAGES = {
  [PaymentErrorCode.TIMEOUT]: {
    en: 'Payment operation timed out. Please try again.',
    ar: 'انتهت مهلة عملية الدفع. يرجى المحاولة مرة أخرى.',
  },
  [PaymentErrorCode.VALIDATION_FAILED]: {
    en: 'Invalid payment data provided.',
    ar: 'بيانات الدفع المقدمة غير صالحة.',
  },
  [PaymentErrorCode.UNAUTHORIZED]: {
    en: 'Authentication required.',
    ar: 'المصادقة مطلوبة.',
  },
  [PaymentErrorCode.FORBIDDEN]: {
    en: 'You do not have permission to perform this action.',
    ar: 'ليس لديك إذن لتنفيذ هذا الإجراء.',
  },
  [PaymentErrorCode.NOT_FOUND]: {
    en: 'Payment not found.',
    ar: 'لم يتم العثور على الدفعة.',
  },
  [PaymentErrorCode.EXTERNAL_API_ERROR]: {
    en: 'External payment service error. Please try again later.',
    ar: 'خطأ في خدمة الدفع الخارجية. يرجى المحاولة لاحقاً.',
  },
  [PaymentErrorCode.DATABASE_ERROR]: {
    en: 'Database error. Please contact support.',
    ar: 'خطأ في قاعدة البيانات. يرجى الاتصال بالدعم.',
  },
  [PaymentErrorCode.INSUFFICIENT_BALANCE]: {
    en: 'Insufficient balance.',
    ar: 'رصيد غير كافٍ.',
  },
  [PaymentErrorCode.PAYMENT_CANCELLED]: {
    en: 'Payment was cancelled.',
    ar: 'تم إلغاء الدفع.',
  },
  [PaymentErrorCode.PAYMENT_FAILED]: {
    en: 'Payment failed. Please try again.',
    ar: 'فشل الدفع. يرجى المحاولة مرة أخرى.',
  },
  [PaymentErrorCode.INTERNAL_ERROR]: {
    en: 'An internal error occurred. Please contact support.',
    ar: 'حدث خطأ داخلي. يرجى الاتصال بالدعم.',
  },
};

/**
 * Custom Payment Error class
 */
export class PaymentError extends Error {
  constructor(code, message, statusCode = 500, details = {}) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Get locale from request
 * @param {object} req - Request object
 * @returns {string} - Locale (en or ar)
 */
export function getLocaleFromRequest(req) {
  // Check query parameter
  if (req.query?.locale) {
    return req.query.locale === 'ar' ? 'ar' : 'en';
  }

  // Check header
  const acceptLanguage = req.headers?.['accept-language'];
  if (acceptLanguage?.includes('ar')) {
    return 'ar';
  }

  // Check cookie
  const locale = req.cookies?.NEXT_LOCALE;
  if (locale === 'ar') {
    return 'ar';
  }

  // Default to English
  return 'en';
}

/**
 * Get localized error message
 * @param {string} code - Error code
 * @param {string} locale - Locale (en or ar)
 * @returns {string} - Localized error message
 */
export function getErrorMessage(code, locale = 'en') {
  const messages = ERROR_MESSAGES[code];
  if (!messages) {
    return locale === 'ar' 
      ? 'حدث خطأ غير متوقع.'
      : 'An unexpected error occurred.';
  }
  return messages[locale] || messages.en;
}

/**
 * Create a standardized error response
 * @param {Error|PaymentError} error - Error object
 * @param {string} operation - Operation name
 * @param {string} locale - Locale (en or ar)
 * @param {boolean} isDevelopment - Is development environment
 * @returns {object} - Error response object
 */
export function createErrorResponse(error, operation, locale = 'en', isDevelopment = false) {
  let code = PaymentErrorCode.INTERNAL_ERROR;
  let statusCode = 500;
  let message = getErrorMessage(code, locale);

  // Handle PaymentError instances
  if (error instanceof PaymentError) {
    code = error.code;
    statusCode = error.statusCode;
    message = getErrorMessage(code, locale);
  }
  // Handle known error patterns
  else if (error.message?.includes('timed out') || error.message?.includes('timeout')) {
    code = PaymentErrorCode.TIMEOUT;
    statusCode = 504;
    message = getErrorMessage(code, locale);
  }
  else if (error.message?.includes('not found') || error.statusCode === 404) {
    code = PaymentErrorCode.NOT_FOUND;
    statusCode = 404;
    message = getErrorMessage(code, locale);
  }
  else if (error.statusCode === 401) {
    code = PaymentErrorCode.UNAUTHORIZED;
    statusCode = 401;
    message = getErrorMessage(code, locale);
  }
  else if (error.statusCode === 403) {
    code = PaymentErrorCode.FORBIDDEN;
    statusCode = 403;
    message = getErrorMessage(code, locale);
  }

  const response = {
    error: true,
    code,
    message,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace and details only in development
  if (isDevelopment) {
    response.details = {
      originalMessage: error.message,
      operation,
      ...(error.details || {}),
    };
    if (error.stack) {
      response.stack = error.stack;
    }
  }

  return { statusCode, response };
}

/**
 * Handle payment error with logging and response
 * @param {Error} error - Error object
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {string} operation - Operation name
 */
export function handlePaymentError(error, req, res, operation) {
  const locale = getLocaleFromRequest(req);
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log the error
  logPaymentFailure({
    operation,
    paymentId: req.body?.paymentId || req.query?.paymentId,
    error,
    data: {
      method: req.method,
      url: req.url,
      locale,
    },
  });

  // Create and send error response
  const { statusCode, response } = createErrorResponse(error, operation, locale, isDevelopment);
  return res.status(statusCode).json(response);
}

export default {
  PaymentError,
  PaymentErrorCode,
  getLocaleFromRequest,
  getErrorMessage,
  createErrorResponse,
  handlePaymentError,
};
