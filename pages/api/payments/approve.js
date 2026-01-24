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
import { validatePiConfig, getPiApiConfig } from "../../../lib/pi-config-validator";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use validated body from middleware, fallback to req.body for testing
  const { paymentId } = req.validatedBody || req.body;

  try {
    console.log("Approving payment:", paymentId);

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

    // Check if in sandbox mode
    const isSandbox = configValidation.isSandbox;

    if (isSandbox) {
      // Sandbox mode: auto-approve without calling Pi API
      const auditLogId = `audit-${Date.now()}-${crypto.randomUUID()}`;

      console.log("✅ [Sandbox] Payment approved:", paymentId);

      return res.status(200).json({
        success: true,
        approved: true,
        paymentId,
        auditLogId,
        sandbox: true,
        message: "Payment approved successfully (sandbox mode)",
      });
    }

    // Production mode: Call Pi Network API to approve the payment
    const piConfig = getPiApiConfig();

    if (!piConfig.apiKey) {
      console.error("❌ PI_API_KEY not configured for production mode");
      return res.status(500).json({
        error: "Server configuration error",
        message: "Production mode requires PI_API_KEY to be configured.",
      });
    }

    console.log("Approving payment:", paymentId);

    // Retry logic - try up to 3 times with delays
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds between retries

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to approve payment...`);

        const approveResponse = await fetch(
          `${piConfig.apiUrl}/payments/${paymentId}/approve`,
          {
            method: "POST",
            headers: {
              Authorization: `Key ${piConfig.apiKey}`,
              "Content-Type": "application/json",
            },
          },
        );

        // If successful, return the result
        if (approveResponse.ok) {
          const approveData = await approveResponse.json();
          console.log("✅ Payment approved successfully:", approveData);

          // Generate audit log
          const auditLogId = `audit-${Date.now()}-${crypto.randomUUID()}`;

          return res.status(200).json({
            success: true,
            approved: true,
            paymentId,
            auditLogId,
            sandbox: false,
            message: "Payment approved successfully",
          });
        }

        // If 404, payment not registered yet - retry
        if (approveResponse.status === 404) {
          const errorData = await approveResponse.json();
          console.log(
            `⏳ Payment not found yet (attempt ${attempt}):`,
            errorData,
          );

          if (attempt < maxRetries) {
            console.log(`Waiting ${retryDelay}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          }

          // Last attempt with 404 - return sanitized error
          console.error("Payment not found after retries:", errorData);
          return res.status(404).json({
            error: "Failed to approve payment",
            message: "Payment not found. Please try again later.",
          });
        }

        // Other errors - don't retry
        const errorText = await approveResponse.text();
        console.error("❌ Pi API error:", approveResponse.status, errorText);

        return res.status(approveResponse.status).json({
          error: "Failed to approve payment",
          message: "Payment approval failed. Please contact support.",
        });
      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }

        return res.status(500).json({
          error: "Failed to approve payment",
          message: "An error occurred while processing your request.",
        });
      }
    }

    // Should not reach here, but just in case
    return res.status(500).json({
      error: "Failed to approve payment after all retries",
      message: "Unable to process payment approval. Please try again later.",
    });
  } catch (error) {
    console.error("Payment approval error:", error);
    return res.status(500).json({
      error: "Failed to approve payment",
      message: "An unexpected error occurred. Please contact support.",
    });
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
