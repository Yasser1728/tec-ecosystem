/**
 * RBAC Definitions - W3SA-ACCESS-001 Fix
 * 
 * Role-Based Access Control definitions
 * Security Level: HIGH
 * 
 * @see W3SA_REMEDIATION_PLAN.md - Phase 1
 */

/**
 * System Roles
 */
export const ROLES = {
  ADMIN: 'admin',
  SECURITY_OFFICER: 'security_officer',
  FINANCIAL_MANAGER: 'financial_manager',
  USER: 'user',
  GUEST: 'guest'
};

/**
 * System Permissions
 */
export const PERMISSIONS = {
  // System Control
  CIRCUIT_BREAKER_TOGGLE: 'circuit_breaker:toggle',
  SYSTEM_INTEGRITY_VIEW: 'system_integrity:view',
  SYSTEM_INTEGRITY_MODIFY: 'system_integrity:modify',
  
  // Audit Logs
  AUDIT_LOGS_VIEW: 'audit_logs:view',
  AUDIT_LOGS_EXPORT: 'audit_logs:export',
  
  // Payments
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_APPROVE: 'payment:approve',
  PAYMENT_REFUND: 'payment:refund',
  PAYMENT_VIEW_ALL: 'payment:view_all',
  
  // Users
  USER_VIEW: 'user:view',
  USER_MODIFY: 'user:modify',
  USER_DELETE: 'user:delete',
  USER_VIEW_ALL: 'user:view_all',
  
  // Domains
  DOMAIN_MANAGE: 'domain:manage',
  DOMAIN_VIEW: 'domain:view',
  
  // NFTs
  NFT_MINT: 'nft:mint',
  NFT_TRANSFER: 'nft:transfer',
  NFT_BURN: 'nft:burn',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
};

/**
 * Role Permission Mapping
 * Defines which permissions each role has
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    ...Object.values(PERMISSIONS)  // All permissions
  ],
  
  [ROLES.SECURITY_OFFICER]: [
    PERMISSIONS.CIRCUIT_BREAKER_TOGGLE,
    PERMISSIONS.SYSTEM_INTEGRITY_VIEW,
    PERMISSIONS.SYSTEM_INTEGRITY_MODIFY,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.AUDIT_LOGS_EXPORT,
    PERMISSIONS.USER_VIEW_ALL,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.PAYMENT_VIEW_ALL,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
  ],
  
  [ROLES.FINANCIAL_MANAGER]: [
    PERMISSIONS.PAYMENT_APPROVE,
    PERMISSIONS.PAYMENT_REFUND,
    PERMISSIONS.PAYMENT_VIEW_ALL,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  
  [ROLES.USER]: [
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.USER_VIEW,  // Own profile only
    PERMISSIONS.NFT_MINT,
    PERMISSIONS.NFT_TRANSFER,
    PERMISSIONS.DOMAIN_VIEW,
  ],
  
  [ROLES.GUEST]: [
    PERMISSIONS.DOMAIN_VIEW,
  ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Required permission
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {string[]} - Array of permissions
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role is valid
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  getRolePermissions,
  isValidRole,
};
