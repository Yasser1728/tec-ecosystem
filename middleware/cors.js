/**
 * CORS Middleware - W3SA-CORS-001 Fix
 * 
 * Centralized CORS configuration with origin whitelist
 * Security Level: HIGH
 * 
 * @see W3SA_REMEDIATION_PLAN.md - Phase 1
 */

const ALLOWED_ORIGINS = [
  // Production domains (all 24 TEC domains)
  'https://tec.pi',
  'https://commerce.pi',
  'https://fundx.pi',
  'https://explorer.pi',
  'https://assets.pi',
  'https://nbf.pi',
  'https://insure.pi',
  'https://vip.pi',
  'https://life.pi',
  'https://ecommerce.pi',
  'https://connection.pi',
  'https://elite.pi',
  'https://brookfield.pi',
  'https://zone.pi',
  'https://dx.pi',
  'https://nx.pi',
  'https://system.pi',
  'https://analytics.pi',
  'https://alert.pi',
  'https://titan.pi',
  'https://epic.pi',
  'https://legend.pi',
  'https://estate.pi',
  'https://nexus.pi',
  
  // Vercel production URLs
  'https://tec-ecosystem.vercel.app',
  'https://tec-ecosystem-*.vercel.app',
];

// Allow localhost only in development
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  ALLOWED_ORIGINS.push('http://localhost:3000');
  ALLOWED_ORIGINS.push('http://localhost:3001');
  ALLOWED_ORIGINS.push('http://localhost:3002');
  ALLOWED_ORIGINS.push('http://127.0.0.1:3000');
}

/**
 * Check if origin is allowed
 * @param {string} origin - Request origin
 * @returns {boolean}
 */
function isOriginAllowed(origin) {
  if (!origin) return false;
  
  // Exact match
  if (ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }
  
  // Wildcard match for Vercel preview deployments
  if (origin.includes('.vercel.app')) {
    const wildcardPatterns = ALLOWED_ORIGINS.filter(o => o.includes('*'));
    return wildcardPatterns.some(pattern => {
      // Escape all regex special characters except *, then replace * with .*
      // Use replaceAll or global regex to replace ALL occurrences of *
      const escapedPattern = pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars
        .replace(/\*/g, '.*');                  // Replace all * with .*
      const regex = new RegExp('^' + escapedPattern + '$');
      return regex.test(origin);
    });
  }
  
  return false;
}

/**
 * CORS Middleware
 * Apply to all API routes that need CORS protection
 */
export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  // Check if origin is allowed
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  } else if (origin) {
    // Log unauthorized origin attempts for security monitoring
    console.warn('[CORS BLOCKED]', {
      origin,
      path: req.url,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      timestamp: new Date().toISOString()
    });
    
    return res.status(403).json({ 
      error: 'Origin not allowed',
      message: 'Your domain is not authorized to access this API'
    });
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}

/**
 * HOC to wrap API handlers with CORS protection
 * @param {Function} handler - Next.js API handler
 * @returns {Function} - Wrapped handler
 */
export function withCORS(handler) {
  return async (req, res) => {
    return new Promise((resolve, reject) => {
      corsMiddleware(req, res, async (err) => {
        if (err) {
          reject(err);
        } else {
          try {
            await handler(req, res);
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };
}

export { ALLOWED_ORIGINS, isOriginAllowed };
export default corsMiddleware;
