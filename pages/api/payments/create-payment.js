import { prisma } from "../../../lib/db/prisma";
import { AUDIT_OPERATION_TYPES } from "../../../lib/forensic-utils";
import { verifyPiPayment, generateAuditHash } from "../../../lib/payments/piVerify";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, memo, domain, userId, category = "general", metadata } = req.body;

  if (!amount || !domain || !userId) {
    return res.status(400).json({ error: "Invalid payment data" });
  }

  try {
    // Direct verification - NO fetch to avoid ECONNREFUSED on serverless
    const verification = await verifyPiPayment(userId);
    
    if (!verification.valid) {
      console.warn("Payment creation verification failed:", verification.reason);
      return res.status(403).json({
        error: "Verification failed",
        reason: verification.reason,
        message: "This payment request could not be verified",
      });
    }

    // Generate audit hash for the payment
    const auditPayload = {
      operationType: AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      operationData: {
        amount: parseFloat(amount),
        currency: "PI",
        category,
        memo,
        userId,
      },
      domain,
      timestamp: Date.now(),
    };

    const auditHash = generateAuditHash(auditPayload);
    const auditLogId = `audit-${Date.now()}`;

    console.log("Payment creation verified:", {
      auditLogId,
      userId,
      amount,
      domain,
    });

    // Create payment record in database with PENDING status
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(amount),
        currency: "PI",
        domain,
        category,
        description: memo || `Payment for ${domain}`,
        status: "PENDING",
        metadata: {
          initiatedAt: new Date().toISOString(),
          source: "web",
          auditLogId,
          auditHash,
          forensicApproval: true,
        },
      },
    });

    // Return payment details for client-side Pi SDK processing
    return res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        domain: payment.domain,
        status: payment.status,
      },
      forensicAudit: {
        approved: true,
        auditLogId,
        auditHash,
        riskLevel: "low",
      },
      message: "Payment initiated. Complete transaction in Pi Browser.",
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return res.status(500).json({
      error: "Failed to create payment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
