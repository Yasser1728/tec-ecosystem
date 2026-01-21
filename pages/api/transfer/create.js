/**
 * Transfer API - Create Transfer
 * W3SA Security Enhancements Applied
 * Handles inter-domain transfers with dual forensic check and circuit breaker protection
 */

import { prisma } from "../../../lib/db/prisma";
import {
  emergencyCircuitBreaker,
  dualForensicCheck,
  SYSTEM_INTEGRITY_LEVEL,
} from "../../../lib/forensic-utils";
import { withCORS } from "../../../middleware/cors";
import { withBodyValidation } from "../../../lib/validations";
import { TransferSchema } from "../../../lib/validations/payment";
import { withErrorHandler } from "../../../lib/utils/errorHandler";
import { requirePermission } from "../../../lib/auth/permissions";
import { PERMISSIONS } from "../../../lib/roles/definitions";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Use validated body from middleware
    const {
      fromUserId: sourceUserId,
      toUserId: targetUserId,
      amount,
      memo,
      type,
    } = req.validatedBody;
    
    // Map internal field names (validatedBody uses fromUserId/toUserId)
    const sourceDomain = req.body.sourceDomain || 'system';
    const targetDomain = req.body.targetDomain || 'system';
    const currency = req.body.currency || "PI";

    // Check emergency circuit breaker
    const circuitBreakerStatus = await emergencyCircuitBreaker();
    if (circuitBreakerStatus.blocked) {
      return res.status(circuitBreakerStatus.status || 403).json({
        error: circuitBreakerStatus.message,
        details: circuitBreakerStatus.details,
        integrityLevel: circuitBreakerStatus.integrityLevel,
        blocked: true,
      });
    }

    // Fetch users
    const sourceUser = await prisma.user.findUnique({
      where: { id: sourceUserId },
    });

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!sourceUser || !targetUser) {
      return res.status(404).json({ error: "Source or target user not found" });
    }

    // Perform dual forensic check
    const forensicResult = await dualForensicCheck({
      sourceUser,
      targetUser,
      transferData: {
        amount,
        currency,
        sourceDomain,
        targetDomain,
      },
      request: {
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
        origin: req.headers.origin,
      },
    });

    // If blocked or not approved, reject transfer
    if (forensicResult.blocked || !forensicResult.approved) {
      return res.status(403).json({
        error: "Transfer rejected by forensic check",
        reason: forensicResult.reason,
        details: forensicResult.details,
        sourceAudit: forensicResult.sourceAudit?.persistResult,
        targetAudit: forensicResult.targetAudit?.persistResult,
      });
    }

    // Create transfer record
    const transfer = await prisma.transfer.create({
      data: {
        sourceUserId,
        targetUserId,
        sourceDomain,
        targetDomain,
        amount,
        currency,
        status: "APPROVED",
        sourceAuditId: forensicResult.sourceAuditId,
        targetAuditId: forensicResult.targetAuditId,
        sourceApproved: true,
        targetApproved: true,
        riskLevel: forensicResult.sourceAudit?.validationResult?.riskLevel,
        suspicious:
          forensicResult.sourceAudit?.suspicionResult?.suspicious || false,
        approvedAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      transfer: {
        id: transfer.id,
        amount: transfer.amount,
        currency: transfer.currency,
        status: transfer.status,
        sourceDomain: transfer.sourceDomain,
        targetDomain: transfer.targetDomain,
        createdAt: transfer.createdAt,
        approvedAt: transfer.approvedAt,
      },
      forensicCheck: {
        sourceAuditId: forensicResult.sourceAuditId,
        targetAuditId: forensicResult.targetAuditId,
        approved: true,
      },
    });
  } catch (error) {
    console.error("[TRANSFER CREATE ERROR]", error);
    return res.status(500).json({
      error: "Failed to create transfer",
      message: error.message,
    });
  }
}

// Apply security middleware layers
export default withCORS(
  withErrorHandler(
    requirePermission(PERMISSIONS.PAYMENT_CREATE)(
      withBodyValidation(handler, TransferSchema)
    )
  )
);
