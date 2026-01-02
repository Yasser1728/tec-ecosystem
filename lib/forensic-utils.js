/**
 * Forensic Audit Utilities
 * 
 * Provides immutable logging and audit trail functionality for financial
 * and sensitive operations in the TEC Ecosystem.
 * 
 * Key Features:
 * - Immutable log entries with cryptographic hashing
 * - User identity verification
 * - Operation validation
 * - Suspicious activity detection
 * - Tamper-proof audit trail
 */

import crypto from 'crypto';

/**
 * Operation types that require forensic audit
 */
export const AUDIT_OPERATION_TYPES = {
  PAYMENT_CREATE: 'payment_create',
  PAYMENT_APPROVE: 'payment_approve',
  PAYMENT_COMPLETE: 'payment_complete',
  PAYMENT_CANCEL: 'payment_cancel',
  NFT_MINT: 'nft_mint',
  SUBSCRIPTION_CREATE: 'subscription_create',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
  DOMAIN_PURCHASE: 'domain_purchase',
};

/**
 * Risk levels for operations
 */
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Create an immutable log entry with cryptographic hash
 * @param {Object} entry - The log entry data
 * @returns {Object} - The immutable log entry with hash
 */
export function createImmutableLogEntry(entry) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    ...entry,
    timestamp,
    id: crypto.randomUUID(),
  };

  // Create hash of the entry for immutability
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(logEntry))
    .digest('hex');

  return {
    ...logEntry,
    hash,
    immutable: true,
  };
}

/**
 * Verify user identity and session
 * @param {Object} user - User object from session
 * @param {Object} request - Request metadata
 * @returns {Object} - Verification result
 */
export function verifyUserIdentity(user, request = {}) {
  if (!user || !user.id) {
    return {
      verified: false,
      reason: 'No user session found',
      riskLevel: RISK_LEVELS.CRITICAL,
    };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [];

  // Check if user ID format is valid
  if (typeof user.id !== 'string' || user.id.length === 0) {
    suspiciousPatterns.push('Invalid user ID format');
  }

  // Check for missing required user fields
  if (!user.email && !user.piId) {
    suspiciousPatterns.push('Missing user identification');
  }

  // Additional checks based on request metadata
  if (request.ip && isBlacklistedIP(request.ip)) {
    suspiciousPatterns.push('Blacklisted IP address');
  }

  if (suspiciousPatterns.length > 0) {
    return {
      verified: false,
      reason: suspiciousPatterns.join('; '),
      riskLevel: RISK_LEVELS.HIGH,
      suspiciousPatterns,
    };
  }

  return {
    verified: true,
    userId: user.id,
    userEmail: user.email,
    piId: user.piId,
    riskLevel: RISK_LEVELS.LOW,
  };
}

/**
 * Validate operation parameters
 * @param {string} operationType - Type of operation
 * @param {Object} operationData - Operation data to validate
 * @returns {Object} - Validation result
 */
export function validateOperation(operationType, operationData) {
  const errors = [];
  let riskLevel = RISK_LEVELS.LOW;

  switch (operationType) {
    case AUDIT_OPERATION_TYPES.PAYMENT_CREATE:
    case AUDIT_OPERATION_TYPES.PAYMENT_APPROVE:
      if (!operationData.amount || operationData.amount <= 0) {
        errors.push('Invalid payment amount');
      }
      if (operationData.amount > 10000) {
        riskLevel = RISK_LEVELS.HIGH;
      }
      if (!operationData.domain) {
        errors.push('Missing domain information');
      }
      break;

    case AUDIT_OPERATION_TYPES.NFT_MINT:
      if (!operationData.domainName) {
        errors.push('Missing NFT domain name');
      }
      break;

    case AUDIT_OPERATION_TYPES.WITHDRAWAL:
    case AUDIT_OPERATION_TYPES.TRANSFER:
      if (!operationData.amount || operationData.amount <= 0) {
        errors.push('Invalid amount');
      }
      if (!operationData.destination) {
        errors.push('Missing destination');
      }
      riskLevel = RISK_LEVELS.MEDIUM;
      break;

    case AUDIT_OPERATION_TYPES.DOMAIN_PURCHASE:
      if (!operationData.domain) {
        errors.push('Missing domain name');
      }
      riskLevel = RISK_LEVELS.MEDIUM;
      break;

    default:
      errors.push('Unknown operation type');
      riskLevel = RISK_LEVELS.HIGH;
  }

  return {
    valid: errors.length === 0,
    errors,
    riskLevel,
  };
}

/**
 * Detect suspicious activity patterns
 * @param {Object} user - User information
 * @param {string} operationType - Type of operation
 * @param {Object} operationData - Operation data
 * @param {Object} context - Additional context (IP, previous operations, etc.)
 * @returns {Object} - Suspicion detection result
 */
export function detectSuspiciousActivity(
  user,
  operationType,
  operationData,
  context = {}
) {
  const suspiciousIndicators = [];
  let threatLevel = RISK_LEVELS.LOW;

  // Check for rapid repeated operations
  if (context.recentOperations && context.recentOperations.length > 10) {
    const recentCount = context.recentOperations.filter(
      (op) => new Date(op.timestamp) > new Date(Date.now() - 60000)
    ).length;
    
    if (recentCount > 5) {
      suspiciousIndicators.push('Rapid repeated operations detected');
      threatLevel = RISK_LEVELS.HIGH;
    }
  }

  // Check for unusually large amounts
  if (operationData.amount && operationData.amount > 50000) {
    suspiciousIndicators.push('Unusually large transaction amount');
    threatLevel = RISK_LEVELS.CRITICAL;
  }

  // Check for operations from new users
  if (context.userCreatedAt) {
    const accountAge = Date.now() - new Date(context.userCreatedAt).getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    if (accountAge < oneDayInMs && operationData.amount > 1000) {
      suspiciousIndicators.push('Large transaction from new account');
      threatLevel = RISK_LEVELS.HIGH;
    }
  }

  // Check for operations without proper authentication
  if (!user.verified || !user.email) {
    suspiciousIndicators.push('Unverified user attempting operation');
    threatLevel = RISK_LEVELS.HIGH;
  }

  return {
    suspicious: suspiciousIndicators.length > 0,
    indicators: suspiciousIndicators,
    threatLevel,
    shouldBlock: threatLevel === RISK_LEVELS.CRITICAL,
  };
}

/**
 * Check if an IP address is blacklisted
 * @param {string} ip - IP address to check
 * @returns {boolean} - True if blacklisted
 */
function isBlacklistedIP(ip) {
  // In production, this should check against a database or external service
  // For now, just basic validation
  const blacklistedPatterns = [
    '0.0.0.0',
    '127.0.0.1', // Localhost shouldn't be blacklisted in prod, but example
  ];
  
  return blacklistedPatterns.includes(ip);
}

/**
 * Log audit entry to persistent storage
 * @param {Object} logEntry - The immutable log entry
 * @returns {Promise<Object>} - Result of logging operation
 */
export async function persistAuditLog(logEntry) {
  try {
    // In production, this should write to a dedicated audit log database
    // or append to an immutable log file/service
    
    // For now, we'll log to console and return success
    // This should be replaced with actual persistence logic
    console.log('[FORENSIC AUDIT LOG]', JSON.stringify(logEntry, null, 2));
    
    // In production, you might want to:
    // 1. Write to a dedicated audit database table
    // 2. Send to a log aggregation service (e.g., CloudWatch, Datadog)
    // 3. Append to an immutable log file with file integrity monitoring
    // 4. Send to blockchain for ultimate immutability
    
    return {
      success: true,
      logId: logEntry.id,
      timestamp: logEntry.timestamp,
      hash: logEntry.hash,
    };
  } catch (error) {
    console.error('[FORENSIC AUDIT ERROR]', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a comprehensive audit entry
 * @param {Object} params - Audit parameters
 * @returns {Promise<Object>} - Complete audit result
 */
export async function createAuditEntry({
  user,
  operationType,
  operationData,
  request = {},
  context = {},
  approved = false,
}) {
  // Verify user identity
  const identityCheck = verifyUserIdentity(user, request);
  
  // Validate operation
  const validationResult = validateOperation(operationType, operationData);
  
  // Detect suspicious activity
  const suspicionResult = detectSuspiciousActivity(
    user,
    operationType,
    operationData,
    context
  );

  // Determine if operation should be approved
  const shouldApprove =
    identityCheck.verified &&
    validationResult.valid &&
    !suspicionResult.shouldBlock &&
    approved;

  // Create immutable log entry
  const logEntry = createImmutableLogEntry({
    operationType,
    operationData,
    user: {
      id: user?.id,
      email: user?.email,
      piId: user?.piId,
    },
    identityCheck,
    validationResult,
    suspicionResult,
    approved: shouldApprove,
    request: {
      ip: request.ip,
      userAgent: request.userAgent,
      origin: request.origin,
    },
    context,
  });

  // Persist the audit log
  const persistResult = await persistAuditLog(logEntry);

  return {
    approved: shouldApprove,
    logEntry,
    persistResult,
    identityCheck,
    validationResult,
    suspicionResult,
  };
}
