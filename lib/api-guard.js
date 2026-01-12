/**
 * API Guard Middleware
 * Provides rate limiting, body size validation, and request ID tracking
 */

import { randomUUID } from 'crypto';

// Rate limit store (in-memory for simplicity)
const rateLimitStore = new Map();

// Configuration constants
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 20;
const DEFAULT_MAX_BODY_SIZE = 64 * 1024; // 64 KB
const MAX_RATE_LIMIT_ENTRIES = 10000; // Prevent memory leak

/**
 * Clean up expired rate limit entries and enforce size limit
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  
  // Remove expired entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
  
  // If still over limit, remove oldest entries (LRU eviction)
  if (rateLimitStore.size > MAX_RATE_LIMIT_ENTRIES) {
    const entriesToRemove = rateLimitStore.size - MAX_RATE_LIMIT_ENTRIES;
    const sortedEntries = Array.from(rateLimitStore.entries())
      .sort((a, b) => a[1].windowStart - b[1].windowStart);
    
    for (let i = 0; i < entriesToRemove; i++) {
      rateLimitStore.delete(sortedEntries[i][0]);
    }
  }
}

// Cleanup every minute
setInterval(cleanupRateLimitStore, RATE_LIMIT_WINDOW_MS);

/**
 * Rate limiter implementation (atomic operation)
 * @param {string} clientId - Client identifier (IP, userId, etc.)
 * @param {number} maxRequests - Maximum requests per window
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
function checkRateLimit(clientId, maxRequests) {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window - single atomic operation
    rateLimitStore.set(clientId, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  // Atomic increment check
  const newCount = entry.count + 1;
  if (newCount > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.windowStart + RATE_LIMIT_WINDOW_MS };
  }
  
  entry.count = newCount;
  return { allowed: true, remaining: maxRequests - newCount, resetAt: entry.windowStart + RATE_LIMIT_WINDOW_MS };
}

/**
 * Sanitize user ID to prevent injection attacks
 * @param {string} userId - Raw user ID
 * @returns {string} Sanitized user ID (alphanumeric only, max 50 chars)
 */
function sanitizeUserId(userId) {
  if (!userId || typeof userId !== 'string') return null;
  // Allow only alphanumeric characters, hyphens, and underscores
  // Limit to 50 characters
  return userId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50) || null;
}

/**
 * Get client identifier from request
 */
function getClientId(req) {
  // Try to get user ID from session/body
  const rawUserId = req.session?.user?.id || req.body?.userId;
  const userId = sanitizeUserId(rawUserId);
  if (userId && userId !== 'guest') {
    return `user:${userId}`;
  }

  // Fallback to IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.socket?.remoteAddress || 'unknown';
  return `ip:${ip}`;
}

/**
 * Check body size
 * Checks Content-Length header first (before body parsing)
 * Note: Next.js parses body before this check. Configure bodyParser in next.config.js
 * to match maxSize for complete protection.
 */
function checkBodySize(req, maxSize) {
  // Check Content-Length header first (before body parsing)
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  
  if (contentLength > maxSize) {
    return {
      valid: false,
      size: contentLength,
      maxSize,
    };
  }

  // Also check actual body size if available
  if (req.body) {
    const bodySize = JSON.stringify(req.body).length;
    if (bodySize > maxSize) {
      return {
        valid: false,
        size: bodySize,
        maxSize,
      };
    }
  }

  return { valid: true };
}

/**
 * API Guard Higher-Order Function
 * Wraps an API handler with rate limiting, body size checks, and request ID
 * 
 * @param {Function} handler - The API handler function
 * @param {Object} options - Guard options
 * @param {number} options.maxRequests - Max requests per minute (default: 20)
 * @param {number} options.maxBodySize - Max body size in bytes (default: 64KB)
 * @returns {Function} Wrapped handler
 */
export function withApiGuard(handler, options = {}) {
  const maxRequests = options.maxRequests || DEFAULT_MAX_REQUESTS;
  const maxBodySize = options.maxBodySize || DEFAULT_MAX_BODY_SIZE;

  return async function guardedHandler(req, res) {
    // Generate request ID
    const requestId = randomUUID();
    req.requestId = requestId;

    // Check body size
    const bodySizeCheck = checkBodySize(req, maxBodySize);
    if (!bodySizeCheck.valid) {
      return res.status(413).json({
        success: false,
        error: 'Payload too large',
        requestId,
        details: {
          size: bodySizeCheck.size,
          maxSize: bodySizeCheck.maxSize,
        },
      });
    }

    // Rate limiting
    const clientId = getClientId(req);
    const rateLimitResult = checkRateLimit(clientId, maxRequests);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    res.setHeader('X-RateLimit-Reset', new Date(rateLimitResult.resetAt).toISOString());
    res.setHeader('X-Request-Id', requestId);

    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        requestId,
        retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
      });
    }

    // Call the original handler
    try {
      return await handler(req, res);
    } catch (error) {
      console.error(`[API Guard] Error in handler (requestId: ${requestId}):`, error.message);
      
      // Don't expose internal errors
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
          requestId,
        });
      }
    }
  };
}

export { checkRateLimit, getClientId, checkBodySize };
