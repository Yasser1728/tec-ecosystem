/**
 * API Guard Utility Module
 * Provides rate limiting, data validation, and request size protection for API endpoints
 */

import { z } from 'zod';

// In-memory store for rate limiting (per IP)
const rateLimitStore = new Map();

/**
 * Simple rate limiter implementation
 * @param {string} identifier - Usually IP address or user ID
 * @param {number} maxRequests - Maximum number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if request is allowed, false if rate limit exceeded
 */
function checkRateLimit(identifier, maxRequests, windowMs) {
  const now = Date.now();
  const userRequests = rateLimitStore.get(identifier) || [];
  
  // Filter out requests outside the current window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
  
  // Check if limit exceeded
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  // Add current request timestamp
  recentRequests.push(now);
  rateLimitStore.set(identifier, recentRequests);
  
  return true;
}

/**
 * Clean up old entries from rate limit store (should be called periodically)
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour
  
  for (const [identifier, requests] of rateLimitStore.entries()) {
    const recentRequests = requests.filter(timestamp => now - timestamp < maxAge);
    if (recentRequests.length === 0) {
      rateLimitStore.delete(identifier);
    } else {
      rateLimitStore.set(identifier, recentRequests);
    }
  }
}

// Cleanup every 10 minutes
setInterval(cleanupRateLimitStore, 10 * 60 * 1000);

/**
 * Check request body size
 * @param {Object} body - Request body
 * @param {number} maxSizeBytes - Maximum allowed size in bytes
 * @returns {boolean} - True if size is acceptable
 */
function checkRequestSize(body, maxSizeBytes) {
  const bodySize = JSON.stringify(body).length;
  return bodySize <= maxSizeBytes;
}

/**
 * Get client identifier from request (IP address)
 * @param {Object} req - Next.js request object
 * @returns {string} - Client identifier
 */
function getClientIdentifier(req) {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
  return ip || 'unknown';
}

/**
 * API Guard Middleware
 * @param {Function} handler - The actual API handler function
 * @param {Object} options - Configuration options
 * @param {Object} options.schema - Zod schema for request validation
 * @param {number} options.rateLimit - Max requests per minute (default: 20)
 * @param {number} options.maxBodySize - Max body size in bytes (default: 1MB)
 * @returns {Function} - Wrapped handler with guards
 */
export function withApiGuard(handler, options = {}) {
  const {
    schema = null,
    rateLimit = 20,
    maxBodySize = 1 * 1024 * 1024, // 1MB default
  } = options;

  return async function guardedHandler(req, res) {
    try {
      // 1. Rate Limiting
      const clientId = getClientIdentifier(req);
      const rateLimitWindow = 60 * 1000; // 1 minute in milliseconds
      
      if (!checkRateLimit(clientId, rateLimit, rateLimitWindow)) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Maximum ${rateLimit} requests per minute allowed.`,
        });
      }

      // 2. Request Size Check
      if (req.body && !checkRequestSize(req.body, maxBodySize)) {
        return res.status(413).json({
          success: false,
          error: 'Payload too large',
          message: `Request body exceeds maximum size of ${maxBodySize} bytes.`,
        });
      }

      // 3. Schema Validation (if provided)
      if (schema && req.body) {
        try {
          const validated = schema.parse(req.body);
          req.body = validated; // Replace with validated data
        } catch (error) {
          if (error instanceof z.ZodError) {
            return res.status(400).json({
              success: false,
              error: 'Validation failed',
              message: 'Invalid request data',
              details: error.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
              })),
            });
          }
          throw error; // Re-throw if not a Zod error
        }
      }

      // 4. Call the actual handler
      return await handler(req, res);

    } catch (error) {
      console.error('API Guard Error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request.',
      });
    }
  };
}

/**
 * Export utilities for direct use
 */
export { checkRateLimit, checkRequestSize, getClientIdentifier };
