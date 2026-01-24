/**
 * Centralized Payment Timeout Configuration
 * 
 * This module provides configurable timeout values for all payment operations
 * to prevent hanging requests and ensure reliable fallback behavior.
 * 
 * All timeout values are in milliseconds.
 */

/**
 * Default timeout configurations for payment operations
 * Can be overridden via environment variables
 */
export const PAYMENT_TIMEOUTS = {
  // Pi Network API call timeouts
  PI_API_APPROVE: parseInt(process.env.PI_API_APPROVE_TIMEOUT) || 15000, // 15 seconds
  PI_API_COMPLETE: parseInt(process.env.PI_API_COMPLETE_TIMEOUT) || 15000, // 15 seconds
  PI_API_VERIFY: parseInt(process.env.PI_API_VERIFY_TIMEOUT) || 10000, // 10 seconds
  
  // Backend API call timeouts (from client)
  CLIENT_CREATE_PAYMENT: parseInt(process.env.CLIENT_CREATE_PAYMENT_TIMEOUT) || 10000, // 10 seconds
  CLIENT_APPROVE: parseInt(process.env.CLIENT_APPROVE_TIMEOUT) || 20000, // 20 seconds (includes retries)
  CLIENT_COMPLETE: parseInt(process.env.CLIENT_COMPLETE_TIMEOUT) || 20000, // 20 seconds
  CLIENT_CANCEL: parseInt(process.env.CLIENT_CANCEL_TIMEOUT) || 8000, // 8 seconds
  CLIENT_ERROR: parseInt(process.env.CLIENT_ERROR_TIMEOUT) || 5000, // 5 seconds
  
  // Retry configuration
  RETRY_DELAY: parseInt(process.env.PAYMENT_RETRY_DELAY) || 2000, // 2 seconds between retries
  MAX_RETRIES: parseInt(process.env.PAYMENT_MAX_RETRIES) || 3, // Maximum retry attempts
  
  // Database operation timeouts
  DB_QUERY_TIMEOUT: parseInt(process.env.DB_QUERY_TIMEOUT) || 5000, // 5 seconds
  
  // External service fallback timeout
  EXTERNAL_SERVICE_TIMEOUT: parseInt(process.env.EXTERNAL_SERVICE_TIMEOUT) || 30000, // 30 seconds
};

/**
 * Timeout utility to wrap promises with timeout and fallback
 * @param {Promise} promise - The promise to wrap
 * @param {number} timeout - Timeout in milliseconds
 * @param {string} operationName - Name of the operation for error messages
 * @returns {Promise} - Promise that rejects on timeout
 */
export async function withTimeout(promise, timeout, operationName = 'Operation') {
  let timeoutId;
  
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${operationName} timed out after ${timeout}ms`));
    }, timeout);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Fetch wrapper with timeout support
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithTimeout(url, options = {}, timeout = PAYMENT_TIMEOUTS.EXTERNAL_SERVICE_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
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
      throw new Error(`Request to ${url} timed out after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Retry wrapper with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay between retries in milliseconds
 * @param {string} operationName - Name of the operation for logging
 * @returns {Promise} - Result of the function
 */
export async function withRetry(fn, maxRetries = PAYMENT_TIMEOUTS.MAX_RETRIES, baseDelay = PAYMENT_TIMEOUTS.RETRY_DELAY, operationName = 'Operation') {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff: baseDelay * 2^(attempt-1)
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`${operationName} attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`${operationName} failed after ${maxRetries} attempts: ${lastError.message}`);
}

export default PAYMENT_TIMEOUTS;
