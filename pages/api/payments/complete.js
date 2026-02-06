/**
 * Pi Payment Completion API - Sandbox & Production Implementation
 * W3SA Security Enhancements Applied
 *
 * For Sandbox/Testnet: No external fetch calls are made. Payment is completed locally.
 * For Production/Mainnet: Calls Pi Platform API to complete payment.
 * See: https://github.com/pi-apps/pi-platform-docs
 */

import { withCORS } from "../../../middleware/cors";
import { withBodyValidation } from "../../../lib/validations";
import { CompletePaymentSchema } from "../../../lib/validations/payment";
import { withErrorHandler } from "../../../lib/utils/errorHandler";
import { PAYMENT_TIMEOUTS, fetchWithTimeout } from "../../../lib/config/payment-timeouts.js";
import { paymentAlertLogger } from "../../../lib/monitoring/payment-alerts.js";
import { handlePaymentError, getLocaleFromRequest, PAYMENT_ERROR_CODES } from "../../../lib/errors/payment-errors.js";
import { getPiApiBaseUrl } from "../../../lib/config/pi-api.js";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use validated body from middleware, fallback to req.body for testing
  const { paymentId, txid } = req.validatedBody || req.body;
  const internalId = req.body.internalId; // Optional field
  
  // Get user's preferred locale for error messages
  const locale = getLocaleFromRequest(req);

  try {
    // Always call Pi Network API to complete the payment (for both sandbox and production)
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!PI_API_KEY) {
      console.error("❌ PI_API_KEY not configured");
      paymentAlertLogger.critical('complete-payment', new Error('PI_API_KEY not configured'), { paymentId });
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    // Get the correct Pi API base URL (sandbox or production)
    const piApiBaseUrl = getPiApiBaseUrl();
    console.log(`Using Pi API: ${piApiBaseUrl}`);

    try {
      const piCompleteResponse = await fetchWithTimeout(
        `${piApiBaseUrl}/payments/${paymentId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Key ${PI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ txid }),
        },
        PAYMENT_TIMEOUTS.PI_API_COMPLETE
      );

      if (!piCompleteResponse.ok) {
        const errorData = await piCompleteResponse.json().catch(() => ({}));
        console.error("❌ Pi API complete failed:", errorData);
        
        // Log external service error
        paymentAlertLogger.externalService(
          'Pi Network API',
          'complete-payment',
          new Error(`Pi API returned ${piCompleteResponse.status}`),
          { paymentId, txid, status: piCompleteResponse.status }
        );

        return res.status(piCompleteResponse.status).json({
          success: false,
          error: "Failed to complete payment with Pi Network",
          message: "Unable to complete payment. Please contact support.",
        });
      }

      const piCompleteData = await piCompleteResponse.json();
      console.log("✅ Payment completed via Pi API:", piCompleteData);

      return res.status(200).json({
        success: true,
        payment: {
          id: internalId || paymentId,
          piPaymentId: paymentId,
          status: "COMPLETED",
          txid: txid,
          completedAt: new Date().toISOString(),
          verified: true,
          // Include only safe fields from Pi API response
          ...(piCompleteData.identifier && {
            piIdentifier: piCompleteData.identifier,
          }),
          ...(piCompleteData.amount && { verifiedAmount: piCompleteData.amount }),
        },
        message: "Payment completed successfully",
      });
    } catch (fetchError) {
      // Handle timeout or network errors
      console.error("❌ Payment completion fetch error:", fetchError);
      
      // Log timeout or failure
      if (fetchError.message.includes('timed out')) {
        paymentAlertLogger.timeout('complete-payment', PAYMENT_TIMEOUTS.PI_API_COMPLETE, { paymentId, txid });
      } else {
        paymentAlertLogger.failure('complete-payment', fetchError, { paymentId, txid });
      }

      const errorResponse = handlePaymentError(
        fetchError,
        'complete-payment',
        locale,
        process.env.NODE_ENV === 'development'
      );

      return res.status(500).json(errorResponse);
    }
  } catch (error) {
    console.error("Payment completion error:", error);
    
    // Log critical error to monitoring system
    paymentAlertLogger.critical('complete-payment', error, { paymentId, txid, internalId });
    
    // Return bilingual error response
    const errorResponse = handlePaymentError(
      error,
      'complete-payment',
      locale,
      process.env.NODE_ENV === 'development'
    );

    return res.status(500).json(errorResponse);
  }
}

// Apply security middleware layers
export default withCORS(
  withErrorHandler(
    withBodyValidation(handler, CompletePaymentSchema)
  )
);
