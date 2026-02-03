/**
 * Payment Timeout Configuration
 * Centralized timeout management for all payment operations
 * 
 * Environment-configurable timeouts with safe defaults
 * Security: Prevents hanging requests and DoS vulnerabilities
 */

// Default timeout values (milliseconds)
export const PAYMENT_TIMEOUTS = {
  // Pi Network API timeouts
  PI_API_CREATE: parseInt(process.env.PI_API_CREATE_TIMEOUT) || 10000,    // 10s
  PI_API_APPROVE: parseInt(process.env.PI_API_APPROVE_TIMEOUT) || 15000,  // 15s
  PI_API_COMPLETE: parseInt(process.env.PI_API_COMPLETE_TIMEOUT) || 15000, // 15s
  PI_API_CANCEL: parseInt(process.env.PI_API_CANCEL_TIMEOUT) || 10000,    // 10s
  PI_API_GET: parseInt(process.env.PI_API_GET_TIMEOUT) || 8000,           // 8s

  // Database operation timeouts
  DB_QUERY: parseInt(process.env.DB_QUERY_TIMEOUT) || 5000,               // 5s
  DB_TRANSACTION: parseInt(process.env.DB_TRANSACTION_TIMEOUT) || 10000,  // 10s

  // Verification and audit timeouts
  VERIFICATION: parseInt(process.env.VERIFICATION_TIMEOUT) || 8000,       // 8s
  AUDIT_LOG: parseInt(process.env.AUDIT_LOG_TIMEOUT) || 3000,            // 3s

  // Retry configuration
  MAX_RETRIES: parseInt(process.env.PAYMENT_MAX_RETRIES) || 3,
  RETRY_DELAY: parseInt(process.env.PAYMENT_RETRY_DELAY) || 2000,        // 2s
  RETRY_BACKOFF_MULTIPLIER: parseFloat(process.env.PAYMENT_RETRY_BACKOFF) || 1.5,
};

/**
 * Wrap a promise with a timeout
 * @param {Promise} promise - Promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} operation - Operation name for error messages
 * @returns {Promise} - Promise that rejects on timeout
 */
export function withTimeout(promise, timeoutMs, operation = 'Operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Fetch with automatic timeout
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * Retry an operation with exponential backoff
 * @param {Function} operation - Async operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay between retries (ms)
 * @param {number} backoffMultiplier - Backoff multiplier for each retry
 * @returns {Promise} - Result of the operation
 */
export async function withRetry(
  operation,
  maxRetries = PAYMENT_TIMEOUTS.MAX_RETRIES,
  initialDelay = PAYMENT_TIMEOUTS.RETRY_DELAY,
  backoffMultiplier = PAYMENT_TIMEOUTS.RETRY_BACKOFF_MULTIPLIER
) {
  let lastError;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.floor(delay * backoffMultiplier);
      }
    }
  }

  throw lastError;
}

/**
 * Check if an error is retryable
 * @param {Error} error - Error to check
 * @returns {boolean} - True if error is retryable
 */
export function isRetryableError(error) {
  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return true;
  }

  // Timeout errors
  if (error.message?.includes('timed out')) {
    return true;
  }

  // HTTP status codes that are retryable
  if (error.statusCode === 429 || error.statusCode === 503 || error.statusCode === 504) {
    return true;
  }

  // Pi Network specific: 404 might mean payment not registered yet
  if (error.statusCode === 404) {
    return true;
  }

  return false;
}

export default {
  PAYMENT_TIMEOUTS,
  withTimeout,
  fetchWithTimeout,
  withRetry,
  isRetryableError,
};
