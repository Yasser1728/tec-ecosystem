/**
 * Transfer API - Create Transfer
 * Handles inter-domain transfers with dual forensic check and circuit breaker protection
 */

import { prisma } from "../../../lib/db/prisma";
import {
  emergencyCircuitBreaker,
  dualForensicCheck,
  SYSTEM_INTEGRITY_LEVEL,
} from "../../../lib/forensic-utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      sourceUserId,
      targetUserId,
      sourceDomain,
      targetDomain,
      amount,
      currency = "PI",
    } = req.body;

    // Validate required fields
    if (
      !sourceUserId ||
      !targetUserId ||
      !sourceDomain ||
      !targetDomain ||
      !amount
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "sourceUserId",
          "targetUserId",
          "sourceDomain",
          "targetDomain",
          "amount",
        ],
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

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
