/**
 * Payment Cancellation API
 * W3SA Security Enhancements Applied
 */

import { prisma } from "../../../lib/db/prisma";
import { withCORS } from "../../../middleware/cors";
import { withBodyValidation } from "../../../lib/validations";
import { CancelPaymentSchema } from "../../../lib/validations/payment";
import { withErrorHandler } from "../../../lib/utils/errorHandler";
import { requirePermission } from "../../../lib/auth/permissions";
import { PERMISSIONS } from "../../../lib/roles/definitions";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use validated body from middleware
  const { paymentId, reason } = req.validatedBody;
  const internalId = req.body.internalId; // Optional field

  try {
    const payment = await prisma.payment.update({
      where: { id: internalId || paymentId },
      data: {
        status: "CANCELLED",
        metadata: {
          piPaymentId: paymentId,
          cancelledAt: new Date().toISOString(),
          reason: reason || "Cancelled by user",
        },
      },
    });

    return res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Payment cancellation error:", error);
    return res.status(500).json({
      error: "Failed to cancel payment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Apply security middleware layers
export default withCORS(
  withErrorHandler(
    requirePermission(PERMISSIONS.PAYMENT_REFUND)(
      withBodyValidation(handler, CancelPaymentSchema)
    )
  )
);
