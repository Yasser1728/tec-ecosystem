import { prisma } from "../../../lib/db/prisma";
import { AUDIT_OPERATION_TYPES } from "../../../lib/forensic-utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, memo, domain, userId, category = "general", metadata } = req.body;

  if (!amount || !domain || !userId) {
    return res.status(400).json({ error: "Invalid payment data" });
  }

  try {
    // Call forensic audit server for approval before creating payment
    const approvalResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/approval`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward original request headers for audit trail
          "x-forwarded-for": req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          "user-agent": req.headers["user-agent"],
        },
        body: JSON.stringify({
          operationType: AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
          operationData: {
            amount: parseFloat(amount),
            currency: "PI",
            category,
            memo,
            userId,
          },
          domain,
          context: {
            metadata,
            endpoint: "/api/payments/create-payment",
          },
        }),
      }
    );

    const approvalResult = await approvalResponse.json();

    // If operation is not approved, reject the payment creation
    if (!approvalResult.approved) {
      console.warn("Payment creation rejected by forensic audit:", approvalResult);
      return res.status(403).json({
        error: "Payment creation rejected",
        reason: approvalResult.reason || "Security validation failed",
        auditLogId: approvalResult.auditLogId,
        message: "This payment request has been flagged and cannot be processed",
      });
    }

    console.log("Payment creation approved by forensic audit:", {
      auditLogId: approvalResult.auditLogId,
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
          auditLogId: approvalResult.auditLogId,
          auditHash: approvalResult.auditHash,
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
        auditLogId: approvalResult.auditLogId,
        riskLevel: approvalResult.riskLevel,
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
