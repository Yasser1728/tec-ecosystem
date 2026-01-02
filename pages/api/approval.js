/**
 * Central Forensic Audit Server
 * 
 * This API endpoint serves as the central audit authority for all financial
 * and sensitive operations across the TEC Ecosystem. It provides:
 * 
 * - User identity verification
 * - Operation validation
 * - Suspicious activity detection
 * - Immutable audit logging
 * - Centralized approval/rejection decisions
 * 
 * All financial domains (commerce, fundx, etc.) must call this endpoint
 * before executing sensitive operations.
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import {
  createAuditEntry,
  AUDIT_OPERATION_TYPES,
  RISK_LEVELS,
} from '../../lib/forensic-utils';

/**
 * Main approval handler
 */
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      approved: false,
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    });
  }

  try {
    // Get user session for authentication
    const session = await getServerSession(req, res, authOptions);

    // Extract operation details from request
    const {
      operationType,
      operationData,
      domain,
      context = {},
    } = req.body;

    // Validate required fields
    if (!operationType) {
      return res.status(400).json({
        approved: false,
        error: 'Missing operation type',
        message: 'operationType is required',
      });
    }

    if (!operationData) {
      return res.status(400).json({
        approved: false,
        error: 'Missing operation data',
        message: 'operationData is required',
      });
    }

    if (!domain) {
      return res.status(400).json({
        approved: false,
        error: 'Missing domain',
        message: 'domain field is required to identify the requesting service',
      });
    }

    // Validate operation type
    const validOperationTypes = Object.values(AUDIT_OPERATION_TYPES);
    if (!validOperationTypes.includes(operationType)) {
      return res.status(400).json({
        approved: false,
        error: 'Invalid operation type',
        message: `operationType must be one of: ${validOperationTypes.join(', ')}`,
      });
    }

    // Extract user information
    const user = session?.user || null;

    // Extract request metadata
    const requestMetadata = {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      origin: req.headers.origin || req.headers.referer,
    };

    // Add domain to operation data
    const enhancedOperationData = {
      ...operationData,
      domain,
    };

    // Create comprehensive audit entry
    const auditResult = await createAuditEntry({
      user,
      operationType,
      operationData: enhancedOperationData,
      request: requestMetadata,
      context: {
        ...context,
        endpoint: '/api/approval',
        requestedAt: new Date().toISOString(),
      },
      approved: true, // Intent to approve, actual approval depends on checks
    });

    // Log the audit decision
    const logPrefix = auditResult.approved ? '✅ APPROVED' : '❌ REJECTED';
    console.log(`${logPrefix} [Forensic Audit]`, {
      operationType,
      domain,
      userId: user?.id,
      approved: auditResult.approved,
      logId: auditResult.logEntry.id,
    });

    // If operation is rejected, return detailed reason
    if (!auditResult.approved) {
      const rejectionReasons = [];

      if (!auditResult.identityCheck.verified) {
        rejectionReasons.push(auditResult.identityCheck.reason);
      }

      if (!auditResult.validationResult.valid) {
        rejectionReasons.push(...auditResult.validationResult.errors);
      }

      if (auditResult.suspicionResult.suspicious) {
        rejectionReasons.push(...auditResult.suspicionResult.indicators);
      }

      return res.status(403).json({
        approved: false,
        rejected: true,
        reason: rejectionReasons.join('; '),
        details: {
          identityCheck: auditResult.identityCheck,
          validationResult: auditResult.validationResult,
          suspicionResult: auditResult.suspicionResult,
        },
        auditLogId: auditResult.logEntry.id,
        auditHash: auditResult.logEntry.hash,
        message: 'Operation rejected due to security concerns',
      });
    }

    // Operation approved - return approval with audit trail
    return res.status(200).json({
      approved: true,
      rejected: false,
      operationType,
      domain,
      auditLogId: auditResult.logEntry.id,
      auditHash: auditResult.logEntry.hash,
      timestamp: auditResult.logEntry.timestamp,
      riskLevel: auditResult.validationResult.riskLevel,
      message: 'Operation approved and logged',
      details: {
        identityVerified: auditResult.identityCheck.verified,
        operationValid: auditResult.validationResult.valid,
        noSuspiciousActivity: !auditResult.suspicionResult.suspicious,
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error('[Forensic Audit Error]', error);

    // Return generic error to client (don't expose internal details)
    return res.status(500).json({
      approved: false,
      error: 'Internal server error',
      message: 'An error occurred while processing the approval request',
      // Only include error details in development
      ...(process.env.NODE_ENV === 'development' && {
        errorDetails: error.message,
      }),
    });
  }
}

/**
 * Get audit log by ID (separate endpoint could be created for this)
 * For now, this is a placeholder for future implementation
 */
export async function getAuditLog(logId) {
  // In production, this would query the audit log storage
  // and return the immutable log entry
  return null;
}

/**
 * Verify audit log integrity (separate endpoint could be created for this)
 * For now, this is a placeholder for future implementation
 */
export async function verifyAuditLogIntegrity(logId, hash) {
  // In production, this would verify that the log entry hasn't been tampered with
  // by recomputing the hash and comparing it with the stored hash
  return { verified: false, message: 'Not implemented' };
}
