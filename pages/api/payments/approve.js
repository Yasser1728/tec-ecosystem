/**
 * Pi Payment Approval API - Sandbox & Production Implementation
 *
 * For Sandbox/Testnet: No external fetch calls are made. Payment is approved locally.
 * For Production/Mainnet: Calls Pi Platform API to approve payment.
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

    // Check if running in sandbox mode
    const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true" || 
                      process.env.PI_SANDBOX_MODE === "true";
    
    if (isSandbox) {
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
    }

    // Production mode - call Pi Platform API
    const PI_API_KEY = process.env.PI_API_KEY;
    
    if (!PI_API_KEY) {
      console.error("❌ PI_API_KEY not configured");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    const piApproveResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!piApproveResponse.ok) {
      const errorData = await piApproveResponse.json().catch(() => ({}));
      console.error("❌ Pi API approve failed:", errorData);
      return res.status(piApproveResponse.status).json({
        success: false,
        error: "Failed to approve payment with Pi Network",
        details: errorData,
      });
    }

    const piApproveData = await piApproveResponse.json();
    console.log("✅ Payment approved via Pi API:", piApproveData);

    return res.status(200).json({
      success: true,
      payment: {
        id: internalId || paymentId,
        piPaymentId: paymentId,
        status: "APPROVED",
        approvedAt: new Date().toISOString(),
        ...piApproveData,
      },
      forensicAudit: {
        approved: true,
        auditLogId: approvalResult.auditLogId,
        auditHash: approvalResult.auditHash,
        riskLevel: approvalResult.riskLevel,
      },
      message: "Payment approved successfully",
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
