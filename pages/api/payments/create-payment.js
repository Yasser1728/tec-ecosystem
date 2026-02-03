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
import { PAYMENT_TIMEOUTS, withTimeout } from "../../../lib/config/payment-timeouts.js";
import { paymentAlertLogger } from "../../../lib/monitoring/payment-alerts.js";
import { handlePaymentError, getLocaleFromRequest, PAYMENT_ERROR_CODES } from "../../../lib/errors/payment-errors.js";

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
  
  // Get user's preferred locale for error messages
  const locale = getLocaleFromRequest(req);

  try {
    // Direct verification with timeout - NO fetch to avoid ECONNREFUSED on serverless
    const verification = await withTimeout(
      verifyPiPayment(userId),
      PAYMENT_TIMEOUTS.PI_API_VERIFY,
      'Payment Verification'
    );

    if (!verification.valid) {
      console.warn(
        "Payment creation verification failed:",
        verification.reason,
      );
      
      // Log validation failure
      paymentAlertLogger.validation('create-payment', [verification.reason], { userId, amount, domain });
      
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
    });

    // Create payment record in database with PENDING status
    const payment = await withTimeout(
      prisma.payment.create({
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
      }),
      PAYMENT_TIMEOUTS.DB_QUERY_TIMEOUT,
      'Database Create Payment'
    );

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
    
    // Log appropriate error type
    if (error.message.includes('timed out')) {
      const operation = error.message.includes('Verification') ? 'verify-payment' : 'database-create-payment';
      const timeout = error.message.includes('Verification') 
        ? PAYMENT_TIMEOUTS.PI_API_VERIFY 
        : PAYMENT_TIMEOUTS.DB_QUERY_TIMEOUT;
      paymentAlertLogger.timeout(operation, timeout, { userId, amount, domain });
    } else if (error.message.includes('prisma') || error.message.includes('database')) {
      paymentAlertLogger.database('create-payment', error, { userId, amount, domain });
    } else {
      paymentAlertLogger.failure('create-payment', error, { userId, amount, domain });
    }
    
    // Return bilingual error response
    const errorResponse = handlePaymentError(
      error,
      'create-payment',
      locale,
      process.env.NODE_ENV === 'development'
    );

    return res.status(500).json(errorResponse);
  }
}

// Apply CORS and validation middleware
export default withCORS(withBodyValidation(handler, CreatePaymentSchema));
