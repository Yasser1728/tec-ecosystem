/**
 * Pi Payment Approval API - Sandbox & Production Implementation
 *
 * For Sandbox/Testnet: No external fetch calls are made. Payment is approved locally.
 * For Production/Mainnet: Calls Pi Platform API to approve payment.
 * See: https://github.com/pi-apps/pi-platform-docs
 * 
 * Now integrated with central forensic audit server for security validation.
 * Uses direct function calls instead of HTTP fetch to avoid ECONNREFUSED errors.
 */
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { AUDIT_OPERATION_TYPES, createAuditEntry, RISK_LEVELS } from "../../../lib/forensic-utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, internalId, amount, domain } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing payment identifier" });
  }

  try {
    // Check if running in sandbox mode
    const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true" || 
                      process.env.PI_SANDBOX_MODE === "true";
    
    if (isSandbox) {
      // Sandbox mode: Skip forensic audit and approve payment directly
      // No external API calls to avoid ECONNREFUSED errors on Vercel
      console.log("✅ [Sandbox] Approving payment without forensic audit:", { 
        paymentId, 
        internalId,
      });

      return res.status(200).json({
        success: true,
        payment: {
          id: internalId || paymentId,
          piPaymentId: paymentId,
          status: "APPROVED",
          approvedAt: new Date().toISOString(),
        },
        message: "Payment approved (sandbox mode)",
      });
    }

    // Production mode: Call forensic audit directly for approval validation
    // Direct function call avoids ECONNREFUSED errors when NEXTAUTH_URL is not set
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user || null;

    const requestMetadata = {
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
      origin: req.headers.origin || req.headers.referer,
    };

    const auditResult = await createAuditEntry({
      user,
      operationType: AUDIT_OPERATION_TYPES.PAYMENT_APPROVE,
      operationData: {
        paymentId,
        internalId,
        amount: amount || 0,
        domain: domain || "unknown",
      },
      request: requestMetadata,
      context: {
        endpoint: "/api/payments/approve",
        piPaymentId: paymentId,
        requestedAt: new Date().toISOString(),
      },
      // Intent to approve - actual approval is determined by createAuditEntry's
      // internal identity check, validation, and suspicion detection logic
      approved: true,
    });

    const approvalResult = {
      approved: auditResult.approved,
      auditLogId: auditResult.logEntry?.id,
      auditHash: auditResult.logEntry?.hash,
      riskLevel: auditResult.validationResult?.riskLevel || RISK_LEVELS.LOW,
      reason: auditResult.approved ? null : generateRejectionReason(auditResult),
    };

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
        // Include only safe fields from Pi API response
        ...(piApproveData.identifier && { piIdentifier: piApproveData.identifier }),
        ...(piApproveData.amount && { verifiedAmount: piApproveData.amount }),
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

/**
 * Generate a human-readable rejection reason from audit result
 * @param {Object} auditResult - The audit result
 * @returns {string} - Rejection reason
 */
function generateRejectionReason(auditResult) {
  const reasons = [];
  
  if (!auditResult.identityCheck?.verified) {
    reasons.push(auditResult.identityCheck?.reason || 'Identity verification failed');
  }
  
  if (!auditResult.validationResult?.valid) {
    reasons.push(...(auditResult.validationResult?.errors || []));
  }
  
  if (auditResult.suspicionResult?.suspicious) {
    reasons.push(...(auditResult.suspicionResult?.indicators || []));
  }
  
  return reasons.join('; ') || 'Operation rejected';
}
