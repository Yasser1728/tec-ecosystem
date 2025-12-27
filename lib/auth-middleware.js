/**
 * Authentication Middleware for TEC Ecosystem
 * Protects private routes with role-based access control (RBAC)
 */

import { getSession } from 'next-auth/react';

/**
 * Validates user session and checks permissions
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export async function authMiddleware(req, res, next) {
  try {
    const session = await getSession({ req });

    if (!session) {
      // Log unauthorized access attempt
      console.warn(`Unauthorized access attempt to ${req.url} from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
      
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required to access this resource'
      });
    }

    // Attach user to request
    req.user = session.user;
    
    if (next) {
      return next();
    }
    
    return true;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication validation failed'
    });
  }
}

/**
 * Role-Based Access Control (RBAC)
 * @param {Array} allowedRoles - Array of roles allowed to access the resource
 */
export function requireRole(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const session = await getSession({ req });

      if (!session) {
        console.warn(`Unauthorized role check attempt to ${req.url}`);
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      const userRole = session.user?.role || 'user';

      if (!allowedRoles.includes(userRole)) {
        console.warn(`Forbidden access attempt by ${session.user?.email} with role ${userRole} to ${req.url}`);
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions to access this resource'
        });
      }

      req.user = session.user;
      
      if (next) {
        return next();
      }
      
      return true;
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Permission validation failed'
      });
    }
  };
}

/**
 * Validates required environment variables on startup
 */
export function validateEnvironment() {
  const required = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✓ Environment variables validated successfully');
}

/**
 * Session validation for private file access
 * @param {Object} session - User session
 * @returns {boolean} - Whether session is valid
 */
export function validateSession(session) {
  if (!session) {
    return false;
  }

  // Check session expiry
  const now = Date.now();
  const sessionExpiry = new Date(session.expires).getTime();

  if (now > sessionExpiry) {
    console.warn('Session expired for user:', session.user?.email);
    return false;
  }

  return true;
}
