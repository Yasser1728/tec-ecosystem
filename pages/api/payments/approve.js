/**
 * Payment Approval API
 * W3SA Security Enhancements Applied
 */

import crypto from "crypto";
import { withCORS } from "../../../middleware/cors";
import { withBodyValidation } from "../../../lib/validations";
import { ApprovePaymentSchema } from "../../../lib/validations/payment";
import { withErrorHandler } from "../../../lib/utils/errorHandler";
import { requirePermission } from "../../../lib/auth/permissions";
import { PERMISSIONS } from "../../../lib/roles/definitions";
import { PAYMENT_TIMEOUTS, fetchWithTimeout, withRetry } from "../../../lib/config/payment-timeouts.js";
import { paymentAlertLogger } from "../../../lib/monitoring/payment-alerts.js";
import { handlePaymentError, getLocaleFromRequest, PAYMENT_ERROR_CODES } from "../../../lib/errors/payment-errors.js";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use validated body from middleware, fallback to req.body for testing
  const { paymentId } = req.validatedBody || req.body;
  
  // Get user's preferred locale for error messages
  const locale = getLocaleFromRequest(req);

  try {
    console.log("Approving payment:", paymentId);

    // Always call Pi Network API to approve the payment (for both sandbox and production)
    const piApiKey = process.env.PI_API_KEY;

    if (!piApiKey) {
      console.error("PI_API_KEY not configured");
      paymentAlertLogger.critical('approve-payment', new Error('PI_API_KEY not configured'), { paymentId });
      return res.status(500).json({ error: "Server configuration error" });
    }

    console.log("Approving payment:", paymentId);

    // Use centralized retry logic with configured timeouts
    try {
      const result = await withRetry(
        async () => {
          console.log(`Attempting to approve payment ${paymentId}...`);

          const approveResponse = await fetchWithTimeout(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {
              method: "POST",
              headers: {
                Authorization: `Key ${piApiKey}`,
                "Content-Type": "application/json",
              },
            },
            PAYMENT_TIMEOUTS.PI_API_APPROVE
          );

          // If successful, return the result
          if (approveResponse.ok) {
            const approveData = await approveResponse.json();
            console.log("✅ Payment approved successfully:", approveData);
            return approveData;
          }

          // If 404, payment not registered yet - throw retriable error to trigger retry
          if (approveResponse.status === 404) {
            const errorData = await approveResponse.json().catch(() => ({}));
            console.log(`⏳ Payment not found yet:`, errorData);
            const retriableError = new Error('Payment not found - will retry');
            retriableError.retriable = true; // Mark as retriable
            throw retriableError;
          }

          // Other errors - don't retry (throw non-retriable error)
          const errorText = await approveResponse.text();
          console.error("❌ Pi API error:", approveResponse.status, errorText);
          
          // Log to monitoring system
          paymentAlertLogger.externalService(
            'Pi Network API',
            'approve-payment',
            new Error(`Pi API returned ${approveResponse.status}`),
            { paymentId, status: approveResponse.status }
          );

          const nonRetriableError = new Error(`Pi API error: ${approveResponse.status}`);
          nonRetriableError.retriable = false; // Mark as non-retriable
          throw nonRetriableError;
        },
        PAYMENT_TIMEOUTS.MAX_RETRIES,
        PAYMENT_TIMEOUTS.RETRY_DELAY,
        'Payment Approval'
      );

      // Generate audit log
      const auditLogId = `audit-${Date.now()}-${crypto.randomUUID()}`;

      return res.status(200).json({
        success: true,
        approved: true,
        paymentId,
        auditLogId,
        message: "Payment approved successfully",
      });

    } catch (retryError) {
      // All retries exhausted
      console.error("❌ Payment approval failed after retries:", retryError);
      
      // Log timeout or failure
      if (retryError.message.includes('timed out')) {
        paymentAlertLogger.timeout('approve-payment', PAYMENT_TIMEOUTS.PI_API_APPROVE, { paymentId });
      } else {
        paymentAlertLogger.failure('approve-payment', retryError, { paymentId });
      }

      const errorResponse = handlePaymentError(
        retryError,
        'approve-payment',
        locale,
        process.env.NODE_ENV === 'development'
      );

      return res.status(500).json(errorResponse);
    }
  } catch (error) {
    console.error("Payment approval error:", error);
    
    // Log critical error to monitoring system
    paymentAlertLogger.critical('approve-payment', error, { paymentId });
    
    // Return bilingual error response
    const errorResponse = handlePaymentError(
      error,
      'approve-payment',
      locale,
      process.env.NODE_ENV === 'development'
    );

    return res.status(500).json(errorResponse);
  }
}

// Apply security middleware layers
export default withCORS(
  withErrorHandler(
    requirePermission(PERMISSIONS.PAYMENT_APPROVE)(
      withBodyValidation(handler, ApprovePaymentSchema)
    )
  )
);
