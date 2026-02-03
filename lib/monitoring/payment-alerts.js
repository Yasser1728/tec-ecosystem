/**
 * Payment Monitoring and Alerting System
 * 
 * Centralized logging and alerting for payment operations
 * Sentry-ready integration for production monitoring
 */

/**
 * Alert severity levels
 */
export const ALERT_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
};

/**
 * Alert categories for payment operations
 */
export const ALERT_CATEGORIES = {
  TIMEOUT: 'timeout',
  FAILURE: 'failure',
  VALIDATION: 'validation',
  EXTERNAL_SERVICE: 'external_service',
  DATABASE: 'database',
  SECURITY: 'security',
};

/**
 * Payment alert logger class
 */
class PaymentAlertLogger {
  constructor() {
    this.alerts = [];
    this.sentryEnabled = this.checkSentryEnabled();
  }

  /**
   * Check if Sentry is configured and available
   */
  checkSentryEnabled() {
    return !!(
      process.env.NEXT_PUBLIC_SENTRY_DSN ||
      process.env.SENTRY_DSN
    );
  }

  /**
   * Log an alert with context
   * @param {string} level - Alert severity level
   * @param {string} category - Alert category
   * @param {string} message - Alert message
   * @param {object} context - Additional context data
   */
  log(level, category, message, context = {}) {
    const alert = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      context: {
        environment: process.env.NODE_ENV || 'development',
        systemService: 'payment-system',
        ...context,
      },
    };

    // Store alert in memory (useful for testing)
    this.alerts.push(alert);

    // Console logging based on level
    const logMethod = this.getLogMethod(level);
    console[logMethod](`[${level.toUpperCase()}] [${category}] ${message}`, context);

    // Send to Sentry if enabled
    if (this.sentryEnabled) {
      this.sendToSentry(alert);
    }

    // Send to custom monitoring endpoint if configured
    if (process.env.MONITORING_ENDPOINT) {
      this.sendToMonitoring(alert);
    }

    return alert;
  }

  /**
   * Get console log method based on severity
   */
  getLogMethod(level) {
    switch (level) {
      case ALERT_LEVELS.CRITICAL:
      case ALERT_LEVELS.ERROR:
        return 'error';
      case ALERT_LEVELS.WARNING:
        return 'warn';
      default:
        return 'log';
    }
  }

  /**
   * Send alert to Sentry (Sentry SDK integration)
   * 
   * To enable Sentry integration:
   * 1. Install @sentry/nextjs: npm install --save @sentry/nextjs
   * 2. Run Sentry setup wizard: npx @sentry/wizard@latest -i nextjs
   * 3. Set NEXT_PUBLIC_SENTRY_DSN environment variable
   * 4. Uncomment the Sentry.captureEvent call below
   * 
   * For more information, see:
   * - https://docs.sentry.io/platforms/javascript/guides/nextjs/
   * - /docs/PAYMENT_SYSTEM.md (Troubleshooting section)
   */
  sendToSentry(alert) {
    try {
      // Uncomment when @sentry/nextjs is installed:
      // import * as Sentry from '@sentry/nextjs';
      // Sentry.captureEvent({
      //   message: alert.message,
      //   level: alert.level,
      //   extra: alert.context,
      //   tags: {
      //     category: alert.category,
      //     environment: alert.context.environment,
      //   },
      // });
      
      console.log('[Sentry] Alert prepared for sending:', {
        message: alert.message,
        level: alert.level,
      });
    } catch (error) {
      console.error('[Sentry] Failed to send alert:', error);
    }
  }

  /**
   * Send alert to custom monitoring endpoint
   */
  async sendToMonitoring(alert) {
    try {
      // Non-blocking async request to monitoring endpoint
      fetch(process.env.MONITORING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      }).catch(err => {
        console.error('[Monitoring] Failed to send alert:', err);
      });
    } catch (error) {
      // Fail silently to not affect payment flow
      console.error('[Monitoring] Error sending alert:', error);
    }
  }

  /**
   * Log timeout alert
   */
  timeout(operation, duration, context = {}) {
    return this.log(
      ALERT_LEVELS.WARNING,
      ALERT_CATEGORIES.TIMEOUT,
      `Payment operation timeout: ${operation} exceeded ${duration}ms`,
      {
        operation,
        duration,
        ...context,
      }
    );
  }

  /**
   * Log failure alert
   */
  failure(operation, error, context = {}) {
    return this.log(
      ALERT_LEVELS.ERROR,
      ALERT_CATEGORIES.FAILURE,
      `Payment operation failed: ${operation}`,
      {
        operation,
        error: error.message,
        stack: error.stack,
        ...context,
      }
    );
  }

  /**
   * Log critical failure (requires immediate attention)
   */
  critical(operation, error, context = {}) {
    return this.log(
      ALERT_LEVELS.CRITICAL,
      ALERT_CATEGORIES.FAILURE,
      `CRITICAL: Payment operation failed: ${operation}`,
      {
        operation,
        error: error.message,
        stack: error.stack,
        ...context,
      }
    );
  }

  /**
   * Log validation error
   */
  validation(operation, validationErrors, context = {}) {
    return this.log(
      ALERT_LEVELS.WARNING,
      ALERT_CATEGORIES.VALIDATION,
      `Payment validation failed: ${operation}`,
      {
        operation,
        validationErrors,
        ...context,
      }
    );
  }

  /**
   * Log external service error
   */
  externalService(service, operation, error, context = {}) {
    return this.log(
      ALERT_LEVELS.ERROR,
      ALERT_CATEGORIES.EXTERNAL_SERVICE,
      `External service error: ${service} - ${operation}`,
      {
        service,
        operation,
        error: error.message,
        ...context,
      }
    );
  }

  /**
   * Log database error
   */
  database(operation, error, context = {}) {
    return this.log(
      ALERT_LEVELS.ERROR,
      ALERT_CATEGORIES.DATABASE,
      `Database operation failed: ${operation}`,
      {
        operation,
        error: error.message,
        ...context,
      }
    );
  }

  /**
   * Log security alert
   */
  security(operation, reason, context = {}) {
    return this.log(
      ALERT_LEVELS.CRITICAL,
      ALERT_CATEGORIES.SECURITY,
      `Security alert: ${operation} - ${reason}`,
      {
        operation,
        reason,
        ...context,
      }
    );
  }

  /**
   * Get recent alerts (useful for debugging and testing)
   */
  getRecentAlerts(limit = 100) {
    return this.alerts.slice(-limit);
  }

  /**
   * Clear alerts (useful for testing)
   */
  clearAlerts() {
    this.alerts = [];
  }
}

// Export singleton instance
export const paymentAlertLogger = new PaymentAlertLogger();

// Export class for testing
export { PaymentAlertLogger };
