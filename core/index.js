/**
 * TEC Core - Universal Sovereign Boilerplate
 * 
 * Central exports for all core functionality
 */

export { DomainBootstrap } from './bootstrap';
export { ForensicLogger, AUDIT_OPERATION_TYPES, RISK_LEVELS } from './forensic';
export { ApprovalCenter, SOVEREIGN_EMAIL, APPROVAL_THRESHOLDS } from './approval';

// Re-export forensic utilities for convenience
export {
  createAuditEntry,
  createImmutableLogEntry,
  verifyUserIdentity,
  validateOperation,
  detectSuspiciousActivity,
  fetchAuditLogs,
  getAuditLogCount,
  checkSystemIntegrity,
  updateSystemIntegrity,
  emergencyCircuitBreaker,
  dualForensicCheck,
  getSystemLiquidityStream,
  toggleCircuitBreaker,
  SYSTEM_INTEGRITY_LEVEL,
  SECURITY_THRESHOLDS,
  AUDIT_PAGINATION
} from '../lib/forensic-utils';

export default {
  DomainBootstrap,
  ForensicLogger,
  ApprovalCenter
};
