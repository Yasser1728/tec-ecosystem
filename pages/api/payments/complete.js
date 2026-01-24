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
import { validatePiConfig, getPiApiConfig } from "../../../lib/pi-config-validator";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use validated body from middleware, fallback to req.body for testing
  const { paymentId, txid } = req.validatedBody || req.body;
  const internalId = req.body.internalId; // Optional field

  try {
    // Validate Pi configuration
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

    // Check if running in sandbox mode
    const isSandbox = configValidation.isSandbox;

    if (isSandbox) {
      // Sandbox mode: Log payment and return success immediately
      // No external API calls to avoid SSRF vulnerabilities
      console.log("✅ [Sandbox] Completing payment:", {
        paymentId,
        txid,
        internalId,
      });

      return res.status(200).json({
        success: true,
        payment: {
          id: internalId || paymentId,
          piPaymentId: paymentId,
          status: "COMPLETED",
          txid: txid,
          completedAt: new Date().toISOString(),
          verified: true,
          sandbox: true,
        },
        message: "Payment completed (sandbox mode)",
      });
    }

    // Production mode: Get Pi API configuration (validates API key is present)
    let piConfig;
    try {
      piConfig = getPiApiConfig(true); // requireApiKey = true for production
    } catch (error) {
      console.error("❌", error.message);
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
        message: "Production mode requires PI_API_KEY to be configured.",
      });
    }

    const piCompleteResponse = await fetch(
      `${piConfig.apiUrl}/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${piConfig.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      },
    );

    if (!piCompleteResponse.ok) {
      const errorData = await piCompleteResponse.json().catch(() => ({}));
      console.error("❌ Pi API complete failed:", errorData);
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
        sandbox: false,
        // Include only safe fields from Pi API response
        ...(piCompleteData.identifier && {
          piIdentifier: piCompleteData.identifier,
        }),
        ...(piCompleteData.amount && { verifiedAmount: piCompleteData.amount }),
      },
      message: "Payment completed successfully",
    });
  } catch (error) {
    console.error("Payment completion error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to complete payment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Apply security middleware layers
export default withCORS(
  withErrorHandler(
    withBodyValidation(handler, CompletePaymentSchema)
  )
);
