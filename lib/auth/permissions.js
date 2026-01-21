/**
 * Permission Middleware - W3SA-ACCESS-001 Fix
 * 
 * Permission checking middleware for protected endpoints
 * Security Level: HIGH
 * 
 * @see W3SA_REMEDIATION_PLAN.md - Phase 1
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { ROLE_PERMISSIONS } from '../roles/definitions';
import { createAuditEntry } from '../forensic-utils';

/**
 * Check if user has a specific permission
 * @param {string} userRole - User's role
 * @param {string} requiredPermission - Required permission
 * @returns {boolean}
 */
export function hasPermission(userRole, requiredPermission) {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(requiredPermission);
}

/**
 * Middleware: Require specific permission
 * @param {string} permission - Required permission
 * @returns {Function} - Wrapped handler
 */
export function requirePermission(permission) {
  return function (handler) {
    return async (req, res) => {
      try {
        // Get user session
        const session = await getServerSession(req, res, authOptions);
        
        if (!session) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
          });
        }
        
        const userRole = session.user?.role || 'user';
        
        // Check permission
        if (!hasPermission(userRole, permission)) {
          // Log permission denial for audit
          await createAuditEntry({
            user: session.user,
            operationType: 'permission_denied',
            operationData: {
              requiredPermission: permission,
              userRole,
              endpoint: req.url,
              method: req.method,
            },
            request: {
              ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
              userAgent: req.headers['user-agent']
            },
            approved: false,
          }).catch(err => {
            console.error('[Permission Audit] Failed to log:', err);
          });
          
          return res.status(403).json({
            error: 'Forbidden',
            message: `You don't have permission: ${permission}`
          });
        }
        
        // Attach user to request
        req.user = session.user;
        req.userRole = userRole;
        
        // Call original handler
        return await handler(req, res);
        
      } catch (error) {
        console.error('[Permission Middleware Error]', error);
        return res.status(500).json({
          error: 'Internal server error'
        });
      }
    };
  };
}

/**
 * Middleware: Require one of multiple permissions
 * @param {string[]} permissions - Array of required permissions (any)
 * @returns {Function} - Wrapped handler
 */
export function requireAnyPermission(permissions) {
  return function (handler) {
    return async (req, res) => {
      try {
        const session = await getServerSession(req, res, authOptions);
        
        if (!session) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
          });
        }
        
        const userRole = session.user?.role || 'user';
        
        // Check if user has ANY of the required permissions
        const hasAnyPermission = permissions.some(permission => 
          hasPermission(userRole, permission)
        );
        
        if (!hasAnyPermission) {
          await createAuditEntry({
            user: session.user,
            operationType: 'permission_denied',
            operationData: {
              requiredPermissions: permissions,
              userRole,
              endpoint: req.url,
              method: req.method,
            },
            request: {
              ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
              userAgent: req.headers['user-agent']
            },
            approved: false,
          }).catch(err => {
            console.error('[Permission Audit] Failed to log:', err);
          });
          
          return res.status(403).json({
            error: 'Forbidden',
            message: `You don't have any of the required permissions`
          });
        }
        
        req.user = session.user;
        req.userRole = userRole;
        
        return await handler(req, res);
        
      } catch (error) {
        console.error('[Permission Middleware Error]', error);
        return res.status(500).json({
          error: 'Internal server error'
        });
      }
    };
  };
}

/**
 * Middleware: Require all of multiple permissions
 * @param {string[]} permissions - Array of required permissions (all)
 * @returns {Function} - Wrapped handler
 */
export function requireAllPermissions(permissions) {
  return function (handler) {
    return async (req, res) => {
      try {
        const session = await getServerSession(req, res, authOptions);
        
        if (!session) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
          });
        }
        
        const userRole = session.user?.role || 'user';
        
        // Check if user has ALL of the required permissions
        const hasAllPermissions = permissions.every(permission => 
          hasPermission(userRole, permission)
        );
        
        if (!hasAllPermissions) {
          await createAuditEntry({
            user: session.user,
            operationType: 'permission_denied',
            operationData: {
              requiredPermissions: permissions,
              userRole,
              endpoint: req.url,
              method: req.method,
            },
            request: {
              ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
              userAgent: req.headers['user-agent']
            },
            approved: false,
          }).catch(err => {
            console.error('[Permission Audit] Failed to log:', err);
          });
          
          return res.status(403).json({
            error: 'Forbidden',
            message: `You don't have all the required permissions`
          });
        }
        
        req.user = session.user;
        req.userRole = userRole;
        
        return await handler(req, res);
        
      } catch (error) {
        console.error('[Permission Middleware Error]', error);
        return res.status(500).json({
          error: 'Internal server error'
        });
      }
    };
  };
}

export default {
  hasPermission,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
};
