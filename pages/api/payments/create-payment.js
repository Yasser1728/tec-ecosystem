import crypto from "crypto";
import { prisma } from "../../../lib/db/prisma";
import { AUDIT_OPERATION_TYPES } from "../../../lib/forensic-utils";
import {
  verifyPiPayment,
  generateAuditHash,
} from "../../../lib/payments/piVerify";
import { withCORS } from "../../../middleware/cors";
import { withBodyValidation } from "../../../lib/validations";
import { CreatePaymentSchema } from "../../../lib/validations/payment";
import { validatePiConfig } from "../../../lib/pi-config-validator";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use validated body from middleware
  const {
    amount,
    memo,
    domain,
    userId,
    category,
    metadata,
  } = req.validatedBody;

  try {
    // Validate Pi configuration before processing payment
    const configValidation = validatePiConfig();
    if (!configValidation.isValid) {
      console.error(
        "❌ Pi Network not configured:",
        configValidation.missing.join(", ")
      );
      return res.status(500).json({
        error: "Pi Network configuration error",
        message:
          "Server is not properly configured for Pi Network payments. Please contact administrator.",
        missingConfig: configValidation.missing,
      });
    }

    // Direct verification - NO fetch to avoid ECONNREFUSED on serverless
    const verification = await verifyPiPayment(userId);

    if (!verification.valid) {
      console.warn(
        "Payment creation verification failed:",
        verification.reason,
      );
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
    const auditLogId = `audit-${Date.now()}-${crypto.randomUUID()}`;

    console.log("Payment creation verified:", {
      auditLogId,
      userId,
      amount,
      domain,
      sandbox: configValidation.isSandbox,
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
          sandbox: configValidation.isSandbox,
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
        sandbox: configValidation.isSandbox,
      },
      forensicAudit: {
        approved: true,
        auditLogId,
        auditHash,
        riskLevel: "low",
      },
      message: `Payment initiated. Complete transaction in Pi Browser.${configValidation.isSandbox ? " (Sandbox mode)" : ""}`,
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

// Apply CORS and validation middleware
export default withCORS(withBodyValidation(handler, CreatePaymentSchema));
