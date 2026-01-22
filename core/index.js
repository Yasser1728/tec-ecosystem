/**
 * TEC Core - Universal Sovereign Boilerplate
 *
 * Central exports for all core functionality
 */

export { DomainBootstrap } from "./bootstrap.js";
export {
  ForensicLogger,
  AUDIT_OPERATION_TYPES,
  RISK_LEVELS,
} from "./forensic.js";
export {
  ApprovalCenter,
  SOVEREIGN_EMAIL,
  APPROVAL_THRESHOLDS,
} from "./approval.js";

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
  AUDIT_PAGINATION,
} from "../lib/forensic-utils.js";

export default {
  DomainBootstrap,
  ForensicLogger,
  ApprovalCenter,
};
