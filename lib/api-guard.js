/**
 * API Guard Utilities
 * Provides rate limiting, body size validation, and schema validation for API endpoints
 */

// Rate limiting store (in-memory)
const rateLimitStore = new Map();
const costLimitStore = new Map();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  
  if (now - lastCleanup < CLEANUP_INTERVAL) {
    return;
  }
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
  
  for (const [key, record] of costLimitStore.entries()) {
    if (now > record.resetTime) {
      costLimitStore.delete(key);
    }
  }
  
  lastCleanup = now;
}

/**
 * Get client identifier from request
 */
function getClientId(req) {
  return req.headers['x-forwarded-for'] || 
         req.socket?.remoteAddress || 
         req.connection?.remoteAddress || 
         'unknown';
}

/**
 * Rate limit middleware
 * @param {Object} options - Rate limit options
 * @param {number} options.maxRequests - Maximum requests per window
 * @param {number} options.windowMs - Time window in milliseconds
 * @returns {Function} Middleware function
 */
export function rateLimit(options = {}) {
  const { maxRequests = 100, windowMs = 15 * 60 * 1000 } = options;
  
  return (req, res, next) => {
    const clientId = getClientId(req);
    const key = `${clientId}-${req.url}`;
    const now = Date.now();
    
    const record = rateLimitStore.get(key) || {
      count: 0,
      resetTime: now + windowMs
    };
    
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    record.count++;
    rateLimitStore.set(key, record);
    
    cleanupExpiredEntries();
    
    next();
  };
}

/**
 * Cost limit tracking
 * @param {Object} options - Cost limit options
 * @param {number} options.maxCostPerHour - Maximum cost per user per hour
 * @returns {Function} Middleware function
 */
export function costLimit(options = {}) {
  const { maxCostPerHour = 10.0, windowMs = 60 * 60 * 1000 } = options;
  
  return (req, res, next) => {
    const clientId = req.body?.userId || getClientId(req);
    const key = `cost-${clientId}`;
    const now = Date.now();
    
    const record = costLimitStore.get(key) || {
      cost: 0,
      resetTime: now + windowMs
    };
    
    if (now > record.resetTime) {
      record.cost = 0;
      record.resetTime = now + windowMs;
    }
    
    // Store record for later cost tracking
    req.costRecord = record;
    req.costKey = key;
    
    if (record.cost >= maxCostPerHour) {
      return res.status(429).json({
        success: false,
        error: 'Cost limit exceeded',
        message: 'You have exceeded your hourly usage limit. Please try again later.'
      });
    }
    
    next();
  };
}

/**
 * Record cost after API call
 * @param {Object} req - Request object
 * @param {number} cost - Cost to record
 */
export function recordCost(req, cost) {
  if (req.costRecord && req.costKey) {
    req.costRecord.cost += cost;
    costLimitStore.set(req.costKey, req.costRecord);
  }
}

/**
 * Body size validation middleware
 * @param {Object} options - Body size options
 * @param {number} options.maxSize - Maximum body size in bytes
 * @returns {Function} Middleware function
 */
export function bodySizeGuard(options = {}) {
  const { maxSize = 10 * 1024 } = options; // Default 10KB
  
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        error: 'Payload too large',
        message: `Request body exceeds maximum size of ${maxSize} bytes`
      });
    }
    
    next();
  };
}

/**
 * Validate request body schema
 * @param {Object} schema - Schema definition
 * @returns {Function} Middleware function
 */
export function validateSchema(schema) {
  return (req, res, next) => {
    const { body } = req;
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];
      
      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`Field '${field}' is required`);
        continue;
      }
      
      // Skip other validations if field is not required and not present
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }
      
      // Type check
      if (rules.type && typeof value !== rules.type) {
        errors.push(`Field '${field}' must be of type ${rules.type}`);
      }
      
      // Min length check
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
      }
      
      // Max length check
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`Field '${field}' must not exceed ${rules.maxLength} characters`);
      }
      
      // Pattern check
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`Field '${field}' format is invalid`);
      }
      
      // Custom validator
      if (rules.validator && !rules.validator(value)) {
        errors.push(rules.validatorError || `Field '${field}' validation failed`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors
      });
    }
    
    next();
  };
}

/**
 * Sanitize user input to prevent injection attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Use a more robust sanitization approach
  // Remove all HTML tags completely
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove any remaining angle brackets
  sanitized = sanitized.replace(/[<>]/g, '');
  
  // Remove javascript: and data: protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  
  // Remove event handlers (more comprehensive)
  sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');
  
  return sanitized.trim();
}

/**
 * Clear all rate limit and cost limit stores (for testing)
 */
export function clearAllStores() {
  rateLimitStore.clear();
  costLimitStore.clear();
  lastCleanup = Date.now();
}

/**
 * Composite middleware for API protection
 * @param {Object} options - Combined options
 * @returns {Array} Array of middleware functions
 */
export function apiGuard(options = {}) {
  const middlewares = [];
  
  if (options.rateLimit !== false) {
    middlewares.push(rateLimit(options.rateLimit || {}));
  }
  
  if (options.costLimit !== false) {
    middlewares.push(costLimit(options.costLimit || {}));
  }
  
  if (options.bodySizeGuard !== false) {
    middlewares.push(bodySizeGuard(options.bodySizeGuard || {}));
  }
  
  if (options.schema) {
    middlewares.push(validateSchema(options.schema));
  }
  
  return middlewares;
}
