/**
 * Bilingual Payment Error Provider
 * 
 * Provides error messages in both English and Arabic
 * Stores detailed error information for developers
 */

import { paymentAlertLogger } from '../monitoring/payment-alerts.js';

/**
 * Error codes for payment operations
 */
export const PAYMENT_ERROR_CODES = {
  TIMEOUT: 'PAYMENT_TIMEOUT',
  UNAUTHORIZED: 'PAYMENT_UNAUTHORIZED',
  VALIDATION_FAILED: 'PAYMENT_VALIDATION_FAILED',
  INSUFFICIENT_FUNDS: 'PAYMENT_INSUFFICIENT_FUNDS',
  NETWORK_ERROR: 'PAYMENT_NETWORK_ERROR',
  EXTERNAL_SERVICE_ERROR: 'PAYMENT_EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR: 'PAYMENT_DATABASE_ERROR',
  UNKNOWN_ERROR: 'PAYMENT_UNKNOWN_ERROR',
  PAYMENT_NOT_FOUND: 'PAYMENT_NOT_FOUND',
  PAYMENT_ALREADY_PROCESSED: 'PAYMENT_ALREADY_PROCESSED',
  APPROVAL_FAILED: 'PAYMENT_APPROVAL_FAILED',
  COMPLETION_FAILED: 'PAYMENT_COMPLETION_FAILED',
  CANCELLATION_FAILED: 'PAYMENT_CANCELLATION_FAILED',
  PI_SDK_NOT_AVAILABLE: 'PI_SDK_NOT_AVAILABLE',
  USER_NOT_AUTHENTICATED: 'USER_NOT_AUTHENTICATED',
};

/**
 * Error message translations
 */
const ERROR_MESSAGES = {
  [PAYMENT_ERROR_CODES.TIMEOUT]: {
    en: 'The payment operation timed out. Please try again.',
    ar: 'انتهت مهلة عملية الدفع. يرجى المحاولة مرة أخرى.',
  },
  [PAYMENT_ERROR_CODES.UNAUTHORIZED]: {
    en: 'You are not authorized to perform this payment operation.',
    ar: 'غير مصرح لك بإجراء عملية الدفع هذه.',
  },
  [PAYMENT_ERROR_CODES.VALIDATION_FAILED]: {
    en: 'Payment validation failed. Please check your input.',
    ar: 'فشل التحقق من الدفع. يرجى التحقق من البيانات المدخلة.',
  },
  [PAYMENT_ERROR_CODES.INSUFFICIENT_FUNDS]: {
    en: 'Insufficient funds to complete this payment.',
    ar: 'رصيد غير كافٍ لإتمام عملية الدفع.',
  },
  [PAYMENT_ERROR_CODES.NETWORK_ERROR]: {
    en: 'Network error occurred. Please check your connection and try again.',
    ar: 'حدث خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
  },
  [PAYMENT_ERROR_CODES.EXTERNAL_SERVICE_ERROR]: {
    en: 'External payment service is temporarily unavailable. Please try again later.',
    ar: 'خدمة الدفع الخارجية غير متاحة مؤقتًا. يرجى المحاولة لاحقًا.',
  },
  [PAYMENT_ERROR_CODES.DATABASE_ERROR]: {
    en: 'Database error occurred. Please contact support if this persists.',
    ar: 'حدث خطأ في قاعدة البيانات. يرجى الاتصال بالدعم إذا استمرت المشكلة.',
  },
  [PAYMENT_ERROR_CODES.UNKNOWN_ERROR]: {
    en: 'An unexpected error occurred. Please try again or contact support.',
    ar: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.',
  },
  [PAYMENT_ERROR_CODES.PAYMENT_NOT_FOUND]: {
    en: 'Payment not found. Please verify the payment ID.',
    ar: 'لم يتم العثور على الدفعة. يرجى التحقق من معرّف الدفع.',
  },
  [PAYMENT_ERROR_CODES.PAYMENT_ALREADY_PROCESSED]: {
    en: 'This payment has already been processed.',
    ar: 'تمت معالجة هذه الدفعة بالفعل.',
  },
  [PAYMENT_ERROR_CODES.APPROVAL_FAILED]: {
    en: 'Payment approval failed. Please try again.',
    ar: 'فشل الموافقة على الدفع. يرجى المحاولة مرة أخرى.',
  },
  [PAYMENT_ERROR_CODES.COMPLETION_FAILED]: {
    en: 'Payment completion failed. Please contact support.',
    ar: 'فشل إتمام الدفع. يرجى الاتصال بالدعم.',
  },
  [PAYMENT_ERROR_CODES.CANCELLATION_FAILED]: {
    en: 'Payment cancellation failed. Please contact support.',
    ar: 'فشل إلغاء الدفع. يرجى الاتصال بالدعم.',
  },
  [PAYMENT_ERROR_CODES.PI_SDK_NOT_AVAILABLE]: {
    en: 'Pi Browser is required to complete this payment.',
    ar: 'مطلوب متصفح Pi لإتمام هذا الدفع.',
  },
  [PAYMENT_ERROR_CODES.USER_NOT_AUTHENTICATED]: {
    en: 'You must be signed in to make a payment.',
    ar: 'يجب تسجيل الدخول لإجراء عملية دفع.',
  },
};

/**
 * PaymentError class - Enhanced error with bilingual support
 */
export class PaymentError extends Error {
  constructor(code, details = {}, locale = 'en') {
    const message = ERROR_MESSAGES[code]?.[locale] || ERROR_MESSAGES[PAYMENT_ERROR_CODES.UNKNOWN_ERROR][locale];
    super(message);
    
    this.name = 'PaymentError';
    this.code = code;
    this.locale = locale;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // Store both language versions
    this.messages = {
      en: ERROR_MESSAGES[code]?.en || ERROR_MESSAGES[PAYMENT_ERROR_CODES.UNKNOWN_ERROR].en,
      ar: ERROR_MESSAGES[code]?.ar || ERROR_MESSAGES[PAYMENT_ERROR_CODES.UNKNOWN_ERROR].ar,
    };
    
    // Log error to monitoring system
    this.logError();
  }

  /**
   * Log error to alert system
   */
  logError() {
    paymentAlertLogger.failure(
      'PaymentError',
      this,
      {
        code: this.code,
        locale: this.locale,
        details: this.details,
      }
    );
  }

  /**
   * Get error message in specific language
   */
  getMessage(locale = 'en') {
    return this.messages[locale] || this.messages.en;
  }

  /**
   * Get user-friendly error response
   */
  toUserResponse(locale = 'en') {
    return {
      error: true,
      code: this.code,
      message: this.getMessage(locale),
      timestamp: this.timestamp,
    };
  }

  /**
   * Get developer error response (includes stack trace)
   */
  toDeveloperResponse() {
    return {
      error: true,
      code: this.code,
      messages: this.messages,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Create a payment error with automatic logging
 */
export function createPaymentError(code, details = {}, locale = 'en') {
  return new PaymentError(code, details, locale);
}

/**
 * Handle error and return appropriate response
 * @param {Error} error - Original error
 * @param {string} operation - Operation that failed
 * @param {string} locale - User's preferred locale
 * @param {boolean} isDevelopment - Whether in development mode
 * @returns {object} - Error response object
 */
export function handlePaymentError(error, operation, locale = 'en', isDevelopment = false) {
  // If it's already a PaymentError, return its response
  if (error instanceof PaymentError) {
    return isDevelopment ? error.toDeveloperResponse() : error.toUserResponse(locale);
  }

  // Determine error code based on error type/message
  let code = PAYMENT_ERROR_CODES.UNKNOWN_ERROR;
  
  if (error.message.includes('timeout') || error.message.includes('timed out')) {
    code = PAYMENT_ERROR_CODES.TIMEOUT;
  } else if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
    code = PAYMENT_ERROR_CODES.UNAUTHORIZED;
  } else if (error.message.includes('network') || error.message.includes('fetch')) {
    code = PAYMENT_ERROR_CODES.NETWORK_ERROR;
  } else if (error.message.includes('database') || error.message.includes('prisma')) {
    code = PAYMENT_ERROR_CODES.DATABASE_ERROR;
  }

  // Create PaymentError with determined code
  const paymentError = new PaymentError(code, {
    operation,
    originalError: error.message,
    originalStack: error.stack,
  }, locale);

  return isDevelopment ? paymentError.toDeveloperResponse() : paymentError.toUserResponse(locale);
}

/**
 * Get user's preferred locale from request
 * @param {object} req - Request object
 * @returns {string} - Locale ('en' or 'ar')
 */
export function getLocaleFromRequest(req) {
  // Check query parameter
  if (req.query?.locale) {
    return req.query.locale === 'ar' ? 'ar' : 'en';
  }
  
  // Check header
  const acceptLanguage = req.headers['accept-language'] || '';
  if (acceptLanguage.includes('ar')) {
    return 'ar';
  }
  
  // Check cookie (if using next-i18next)
  const cookies = req.headers.cookie || '';
  if (cookies.includes('NEXT_LOCALE=ar')) {
    return 'ar';
  }
  
  // Default to English
  return 'en';
}

export default {
  PaymentError,
  createPaymentError,
  handlePaymentError,
  getLocaleFromRequest,
  PAYMENT_ERROR_CODES,
};
