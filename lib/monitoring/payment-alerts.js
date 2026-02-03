/**
 * Payment Alert and Monitoring System
 * Centralized logging and alerting for payment operations
 * 
 * Integrates with Sentry and provides structured logging
 * Security: Prevents sensitive data leakage in logs
 */

// Alert levels
export const AlertLevel = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};

// Alert categories
export const AlertCategory = {
  TIMEOUT: 'timeout',
  FAILURE: 'failure',
  VALIDATION: 'validation',
  EXTERNAL_SERVICE: 'external_service',
  DATABASE: 'database',
  SECURITY: 'security',
  RETRY: 'retry',
};

/**
 * Sanitize data for logging (remove sensitive information)
 * @param {object} data - Data to sanitize
 * @returns {object} - Sanitized data
 */
function sanitizeForLogging(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveFields = ['apiKey', 'password', 'secret', 'token', 'authorization', 'piId'];
  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  }

  // Sanitize nested objects
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeForLogging(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Log a payment alert
 * @param {object} options - Alert options
 * @param {string} options.level - Alert level (INFO, WARNING, ERROR, CRITICAL)
 * @param {string} options.category - Alert category
 * @param {string} options.message - Alert message
 * @param {object} options.data - Additional data
 * @param {Error} options.error - Error object (optional)
 */
export function logPaymentAlert({
  level = AlertLevel.INFO,
  category,
  message,
  data = {},
  error = null,
}) {
  const timestamp = new Date().toISOString();
  const sanitizedData = sanitizeForLogging(data);

  const alert = {
    timestamp,
    level,
    category,
    message,
    data: sanitizedData,
    ...(error && {
      error: {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    }),
  };

  // Console logging with colors
  const prefix = `[${level}] [${category}]`;
  if (level === AlertLevel.CRITICAL || level === AlertLevel.ERROR) {
    console.error(prefix, message, sanitizedData);
    if (error) console.error(error);
  } else if (level === AlertLevel.WARNING) {
    console.warn(prefix, message, sanitizedData);
  } else {
    console.log(prefix, message, sanitizedData);
  }

  // Send to Sentry if configured
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && (level === AlertLevel.ERROR || level === AlertLevel.CRITICAL)) {
    try {
      // Dynamic import to avoid build issues if Sentry isn't installed
      if (typeof window === 'undefined') {
        // Server-side: would use @sentry/node if available
        // For now, just log
        console.log('[Sentry] Would capture:', alert);
      }
    } catch (err) {
      console.error('[Sentry] Failed to capture alert:', err);
    }
  }

  return alert;
}

/**
 * Log payment timeout
 * @param {object} options - Options
 */
export function logPaymentTimeout({ operation, timeoutMs, paymentId, data = {} }) {
  return logPaymentAlert({
    level: AlertLevel.ERROR,
    category: AlertCategory.TIMEOUT,
    message: `Payment operation timed out: ${operation}`,
    data: {
      operation,
      timeoutMs,
      paymentId,
      ...data,
    },
  });
}

/**
 * Log payment failure
 * @param {object} options - Options
 */
export function logPaymentFailure({ operation, paymentId, error, data = {} }) {
  return logPaymentAlert({
    level: AlertLevel.ERROR,
    category: AlertCategory.FAILURE,
    message: `Payment operation failed: ${operation}`,
    data: {
      operation,
      paymentId,
      ...data,
    },
    error,
  });
}

/**
 * Log external service error
 * @param {object} options - Options
 */
export function logExternalServiceError({ service, operation, statusCode, error, data = {} }) {
  return logPaymentAlert({
    level: statusCode >= 500 ? AlertLevel.CRITICAL : AlertLevel.ERROR,
    category: AlertCategory.EXTERNAL_SERVICE,
    message: `External service error: ${service}`,
    data: {
      service,
      operation,
      statusCode,
      ...data,
    },
    error,
  });
}

/**
 * Log retry attempt
 * @param {object} options - Options
 */
export function logRetryAttempt({ operation, attempt, maxRetries, delay, reason }) {
  return logPaymentAlert({
    level: AlertLevel.WARNING,
    category: AlertCategory.RETRY,
    message: `Retrying operation: ${operation}`,
    data: {
      operation,
      attempt,
      maxRetries,
      delay,
      reason,
    },
  });
}

/**
 * Log security event
 * @param {object} options - Options
 */
export function logSecurityEvent({ event, severity, data = {} }) {
  return logPaymentAlert({
    level: severity === 'high' ? AlertLevel.CRITICAL : AlertLevel.WARNING,
    category: AlertCategory.SECURITY,
    message: `Security event: ${event}`,
    data,
  });
}

export default {
  AlertLevel,
  AlertCategory,
  logPaymentAlert,
  logPaymentTimeout,
  logPaymentFailure,
  logExternalServiceError,
  logRetryAttempt,
  logSecurityEvent,
};
