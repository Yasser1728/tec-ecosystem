/**
 * Pi Payment Approval API - Sandbox Implementation with Forensic Audit
 *
 * For Sandbox/Testnet: No external fetch calls are made. Payment is approved locally.
 * For Mainnet (future): Use official Pi Node.js SDK for secure server-side verification.
 * See: https://github.com/pi-apps/pi-platform-docs
 * 
 * Now integrated with central forensic audit server for security validation.
 */
import { AUDIT_OPERATION_TYPES } from "../../../lib/forensic-utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, internalId, amount, domain } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing payment identifier" });
  }

  try {
    // Call forensic audit server for approval validation
    // NOTE: Using HTTP call maintains service separation. For high-performance
    // scenarios, consider directly importing forensic-utils functions.
    const approvalResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/approval`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          "user-agent": req.headers["user-agent"],
        },
        body: JSON.stringify({
          operationType: AUDIT_OPERATION_TYPES.PAYMENT_APPROVE,
          operationData: {
            paymentId,
            internalId,
            amount: amount || 0,
          },
          domain: domain || "unknown",
          context: {
            endpoint: "/api/payments/approve",
            piPaymentId: paymentId,
          },
        }),
      }
    );

    const approvalResult = await approvalResponse.json();

    // If forensic audit rejects the approval, don't approve the payment
    if (!approvalResult.approved) {
      console.warn("Payment approval rejected by forensic audit:", approvalResult);
      return res.status(403).json({
        success: false,
        error: "Payment approval rejected",
        reason: approvalResult.reason || "Security validation failed",
        auditLogId: approvalResult.auditLogId,
        payment: {
          id: internalId || paymentId,
          piPaymentId: paymentId,
          status: "REJECTED",
        },
      });
    }

    // Sandbox mode: Log payment and return success with forensic audit info
    // No external API calls to avoid SSRF vulnerabilities
    console.log("✅ [Sandbox] Approving payment:", { 
      paymentId, 
      internalId,
      auditLogId: approvalResult.auditLogId,
    });

    return res.status(200).json({
      success: true,
      payment: {
        id: internalId || paymentId,
        piPaymentId: paymentId,
        status: "APPROVED",
        approvedAt: new Date().toISOString(),
      },
      forensicAudit: {
        approved: true,
        auditLogId: approvalResult.auditLogId,
        auditHash: approvalResult.auditHash,
        riskLevel: approvalResult.riskLevel,
      },
      message: "Payment approved (sandbox mode with forensic audit)",
    });
  } catch (error) {
    console.error("Payment approval error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to approve payment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
