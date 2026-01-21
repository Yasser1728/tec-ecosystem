/**
 * TEC Sovereign Agent - Domain Task Map
 * 
 * Security-constrained task definitions for AI agent operations.
 * All tasks are statically defined and undergo governance validation.
 * 
 * ⚠️ SECURITY POLICY:
 * - No dynamic task registration
 * - All operations require audit trail
 * - Human approval required for critical operations
 * - Rate limiting enforced per domain
 * - No repository write access
 * - No automatic commits
 */

/**
 * Task Security Levels
 */
export const TASK_SECURITY_LEVELS = Object.freeze({
  READ_ONLY: 'read_only',        // Safe operations: read, analyze, report
  MODIFY_DATA: 'modify_data',    // Requires approval: update records
  CRITICAL: 'critical',          // Requires human approval: financial ops
  SYSTEM_ADMIN: 'system_admin',  // Blocked: system-level changes
});

/**
 * Security constraints for each task type
 */
export const TASK_SECURITY_CONSTRAINTS = Object.freeze({
  [TASK_SECURITY_LEVELS.READ_ONLY]: {
    requiresApproval: false,
    requiresAudit: true,
    maxRatePerHour: 100,
    allowedDomains: '*',
  },
  [TASK_SECURITY_LEVELS.MODIFY_DATA]: {
    requiresApproval: true,
    requiresAudit: true,
    maxRatePerHour: 20,
    allowedDomains: ['finance.pi', 'commerce.pi', 'payments.pi'],
  },
  [TASK_SECURITY_LEVELS.CRITICAL]: {
    requiresApproval: true,
    requiresHumanApproval: true,
    requiresAudit: true,
    maxRatePerHour: 5,
    allowedDomains: ['finance.pi', 'payments.pi'],
    minimumApprovalThreshold: 10000, // PI
  },
  [TASK_SECURITY_LEVELS.SYSTEM_ADMIN]: {
    requiresApproval: true,
    requiresHumanApproval: true,
    requiresAudit: true,
    maxRatePerHour: 1,
    allowedDomains: [],
    blocked: true,
    blockReason: 'System administration tasks require manual execution',
  },
});

/**
 * Domain Task Map
 * 
 * Define allowed tasks per domain with security constraints.
 * Empty by default - extend as tasks are validated and approved.
 */
export const domainTaskMap = Object.freeze({
  // Example structure (currently no tasks defined):
  // 'finance.pi': {
  //   tasks: {
  //     'generate_report': {
  //       securityLevel: TASK_SECURITY_LEVELS.READ_ONLY,
  //       description: 'Generate financial report',
  //       allowedOperations: ['read', 'analyze'],
  //       blockedOperations: ['write', 'delete', 'commit'],
  //     },
  //     'process_payment': {
  //       securityLevel: TASK_SECURITY_LEVELS.CRITICAL,
  //       description: 'Process payment transaction',
  //       allowedOperations: ['read', 'validate'],
  //       blockedOperations: ['write', 'delete', 'commit', 'execute'],
  //       requiresHumanApproval: true,
  //     },
  //   },
  // },
});

/**
 * Validate if a task is allowed for a domain
 * @param {string} domain - Domain name
 * @param {string} taskName - Task identifier
 * @returns {Object} Validation result
 */
export function validateTask(domain, taskName) {
  // Domain not in task map
  if (!domainTaskMap[domain]) {
    return {
      allowed: false,
      reason: 'Domain not registered in task map',
      securityLevel: null,
    };
  }

  // Task not defined for domain
  const task = domainTaskMap[domain]?.tasks?.[taskName];
  if (!task) {
    return {
      allowed: false,
      reason: 'Task not defined for this domain',
      securityLevel: null,
    };
  }

  // Get security constraints
  const constraints = TASK_SECURITY_CONSTRAINTS[task.securityLevel];
  
  // Check if task is blocked
  if (constraints.blocked) {
    return {
      allowed: false,
      reason: constraints.blockReason,
      securityLevel: task.securityLevel,
    };
  }

  // Check if domain is allowed
  if (constraints.allowedDomains !== '*' && !constraints.allowedDomains.includes(domain)) {
    return {
      allowed: false,
      reason: 'Domain not authorized for this task security level',
      securityLevel: task.securityLevel,
    };
  }

  return {
    allowed: true,
    securityLevel: task.securityLevel,
    constraints: constraints,
    task: task,
  };
}

/**
 * Check if operation requires human approval
 * @param {string} securityLevel - Task security level
 * @param {Object} operationData - Operation details
 * @returns {boolean}
 */
export function requiresHumanApproval(securityLevel, operationData) {
  const constraints = TASK_SECURITY_CONSTRAINTS[securityLevel];
  
  if (!constraints) {
    return true; // Default to requiring approval if unknown
  }

  // Check if security level requires human approval
  if (constraints.requiresHumanApproval) {
    return true;
  }

  // Check amount threshold for financial operations
  if (operationData?.amount && constraints.minimumApprovalThreshold) {
    return operationData.amount >= constraints.minimumApprovalThreshold;
  }

  return constraints.requiresApproval;
}

/**
 * Security attestations for compliance
 */
export const SECURITY_ATTESTATIONS = Object.freeze({
  NO_DYNAMIC_LOADING: true,
  NO_REPO_WRITE_ACCESS: true,
  NO_AUTO_COMMITS: true,
  AUDIT_TRAIL_REQUIRED: true,
  RATE_LIMITED: true,
  DOMAIN_ALLOWLIST_ENFORCED: true,
  HUMAN_APPROVAL_CRITICAL_OPS: true,
  SECRETS_NOT_LOGGED: true,
});

export default {
  domainTaskMap,
  TASK_SECURITY_LEVELS,
  TASK_SECURITY_CONSTRAINTS,
  validateTask,
  requiresHumanApproval,
  SECURITY_ATTESTATIONS,
};
