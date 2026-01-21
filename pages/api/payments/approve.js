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

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use validated body from middleware
  const { paymentId } = req.validatedBody;

  try {
    console.log("Approving payment:", paymentId);

    // Check if in sandbox mode
    const isSandbox =
      process.env.NEXT_PUBLIC_PI_SANDBOX === "true" ||
      process.env.PI_SANDBOX_MODE === "true";

    if (isSandbox) {
      // Sandbox mode: auto-approve without calling Pi API
      const auditLogId = `audit-${Date.now()}-${crypto.randomUUID()}`;

      return res.status(200).json({
        success: true,
        approved: true,
        paymentId,
        auditLogId,
        message: "Payment approved successfully",
      });
    }

    // Production mode: Call Pi Network API to approve the payment
    const piApiKey = process.env.PI_API_KEY;

    if (!piApiKey) {
      console.error("PI_API_KEY not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    console.log("Approving payment:", paymentId);

    // Retry logic - try up to 3 times with delays
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds between retries

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to approve payment...`);

        const approveResponse = await fetch(
          `https://api.minepi.com/v2/payments/${paymentId}/approve`,
          {
            method: "POST",
            headers: {
              Authorization: `Key ${piApiKey}`,
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
