/**
 * Error Handler Utility - W3SA-ERROR-001 Fix
 * 
 * Centralized error handling that sanitizes error messages
 * Security Level: MEDIUM
 * 
 * @see W3SA_REMEDIATION_PLAN.md - Phase 2
 */

import crypto from 'crypto';

/**
 * Generate a unique request ID for error tracking
 * @returns {string} - Request ID
 */
export function generateRequestId() {
  return `req-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Sanitize error for client response
 * Prevents stack traces and sensitive information leakage
 * 
 * @param {Error} error - Original error
 * @param {string} requestId - Request ID for tracking
 * @param {boolean} isDevelopment - Is development environment
 * @returns {Object} - Sanitized error response
 */
export function sanitizeError(error, requestId, isDevelopment = false) {
  // Log full error server-side
  console.error(`[Error ${requestId}]`, {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
  });

  // Return sanitized error to client
  const response = {
    error: 'Internal server error',
    requestId,
    timestamp: new Date().toISOString(),
  };

  // Only include details in development
  if (isDevelopment) {
    response.details = {
      message: error.message,
      name: error.name,
    };
  }

  return response;
}

/**
 * Handle API error with proper sanitization
 * @param {Error} error - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function handleApiError(error, req, res) {
  const requestId = generateRequestId();
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log comprehensive error details
  console.error(`[API Error ${requestId}]`, {
    error: error.message,
    stack: error.stack,
    path: req.url,
    method: req.method,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = error.statusCode || error.status || 500;

  // Send sanitized response
  return res.status(statusCode).json(
    sanitizeError(error, requestId, isDevelopment)
  );
}

/**
 * Wrap async handler with error handling
 * @param {Function} handler - API handler
 * @returns {Function} - Wrapped handler
 */
export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      return handleApiError(error, req, res);
    }
  };
}

export default {
  generateRequestId,
  sanitizeError,
  handleApiError,
  withErrorHandler,
};
