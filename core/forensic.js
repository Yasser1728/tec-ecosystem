/**
 * Core ForensicLogger
 * 
 * Provides forensic logging capabilities for all domains
 * Integrates with the central forensic-utils library
 */

import {
import { logger } from '../lib/utils/logger.js';
  createAuditEntry,
  createImmutableLogEntry,
  verifyUserIdentity,
  validateOperation,
  detectSuspiciousActivity,
  AUDIT_OPERATION_TYPES,
  RISK_LEVELS
} from '../lib/forensic-utils.js';

export class ForensicLogger {
  constructor(config = {}) {
    this.domain = config.domain;
    this.database = config.database;
    this.enabled = config.enabled !== false;
    
    // Log warning if forensic logging is disabled for critical operations
    if (!this.enabled) {
      console.warn(`[ForensicLogger] WARNING: Forensic logging is DISABLED for domain ${this.domain}. This is a security risk and audit trail will not be maintained.`);
    }
  }
  
  /**
   * Log operation with full forensic audit
   */
  async log({ operationType, operationData, user, request, domain }) {
    if (!this.enabled) {
      return { logged: false, reason: 'Forensic logging disabled' };
    }
    
    try {
      // Create comprehensive audit entry
      const auditResult = await createAuditEntry({
        user,
        operationType,
        operationData: {
          ...operationData,
          domain: domain || this.domain,
          database: this.database
        },
        request,
        context: {
          domain: domain || this.domain,
          database: this.database,
          timestamp: new Date().toISOString()
        },
        approved: false // Will be determined by audit checks
      });
      
      return {
        logged: true,
        auditResult,
        approved: auditResult.approved,
        logId: auditResult.persistResult?.logId
      };
    } catch (error) {
      console.error('[ForensicLogger Error]', error);
      return {
        logged: false,
        error: error.message
      };
    }
  }
  
  /**
   * Create immutable log entry
   */
  createImmutable(entry) {
    return createImmutableLogEntry({
      ...entry,
      domain: this.domain,
      database: this.database
    });
  }
  
  /**
   * Verify user identity
   */
  verifyIdentity(user, request) {
    return verifyUserIdentity(user, request);
  }
  
  /**
   * Validate operation
   */
  validateOperation(operationType, operationData) {
    return validateOperation(operationType, operationData);
  }
  
  /**
   * Detect suspicious activity
   */
  detectSuspicious(user, operationType, operationData, context) {
    return detectSuspiciousActivity(user, operationType, operationData, context);
  }
  
  /**
   * Get domain-specific audit logs
   */
  async getAuditLogs(options = {}) {
    const { fetchAuditLogs } = await import('../lib/forensic-utils');
    return await fetchAuditLogs({
      ...options,
      domain: this.domain
    });
  }
  
  /**
   * Get audit log count for this domain
   */
  async getAuditLogCount(options = {}) {
    const { getAuditLogCount } = await import('../lib/forensic-utils');
    return await getAuditLogCount({
      ...options,
      domain: this.domain
    });
  }
}

export { AUDIT_OPERATION_TYPES, RISK_LEVELS };
export default ForensicLogger;
