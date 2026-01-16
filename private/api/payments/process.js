/**
 * PROPRIETARY AND CONFIDENTIAL
 *
 * Copyright (c) 2024-2025 TEC Ecosystem
 * All rights reserved.
 *
 * This file is part of the TEC Ecosystem proprietary software.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * See LICENSE_PROPRIETARY for full license terms.
 *
 * @file process.js
 * @description Payment processing API endpoint for Pi Network transactions
 * @license Proprietary
 */

import { prisma } from "../../../../lib/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { logger } from '../../../lib/utils/logger.js';

/**
 * Process Pi Network payment transactions
 * Validates, approves, and completes payments through the Pi Network
 *
 * @route POST /api/payments/process
 * @access Private - Authentication required
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST requests are accepted",
    });
  }

  // Authentication check - verify user session using NextAuth
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required. Please sign in to continue.",
    });
  }

  // Validate user status
  if (session.user.status !== "ACTIVE") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Your account is not active. Please contact support.",
    });
  }

  const userId = session.user.id;

  try {
    const { paymentId, piPaymentId, amount, memo, domain, category, metadata } =
      req.body;

    // Validate required fields
    if (!paymentId || !piPaymentId || !amount) {
      return res.status(400).json({
        error: "Invalid payment data",
        message: "Missing required fields: paymentId, piPaymentId, or amount",
      });
    }

    // Step 1: Retrieve existing payment record
    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!existingPayment) {
      return res.status(404).json({
        error: "Payment not found",
        message: `No payment record found with ID: ${paymentId}`,
      });
    }

    // Step 2: Verify payment ownership
    if (existingPayment.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to process this payment",
      });
    }

    // Step 3: Check if payment is already processed
    if (existingPayment.status === "COMPLETED") {
      return res.status(409).json({
        error: "Payment already processed",
        message: "This payment has already been completed",
        payment: existingPayment,
      });
    }

    // Step 4: Validate Pi Network payment (simulated validation)
    // In production, this would call Pi Network API to verify the transaction
    const isValidPiPayment = await validatePiNetworkPayment(
      piPaymentId,
      amount,
    );

    if (!isValidPiPayment) {
      // Update payment status to FAILED
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "FAILED",
          metadata: {
            ...existingPayment.metadata,
            failedAt: new Date().toISOString(),
            failureReason: "Pi Network validation failed",
          },
        },
      });

      return res.status(400).json({
        error: "Payment validation failed",
        message: "Pi Network transaction could not be verified",
      });
    }

    // Step 5: Update payment record with completion details
    const completedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        piPaymentId: piPaymentId,
        amount: parseFloat(amount),
        description: memo || existingPayment.description,
        metadata: {
          ...existingPayment.metadata,
          ...(metadata || {}),
          completedAt: new Date().toISOString(),
          piPaymentId: piPaymentId,
          processedBy: "payment-processor-v1",
        },
      },
    });

    // Step 6: Record transaction in audit log
    await logTransaction({
      userId,
      paymentId,
      piPaymentId,
      amount,
      domain,
      category,
      status: "COMPLETED",
      timestamp: new Date().toISOString(),
    });

    // Step 7: Trigger post-payment actions (e.g., unlock features, send confirmation)
    await triggerPostPaymentActions(completedPayment);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      payment: {
        id: completedPayment.id,
        amount: completedPayment.amount,
        currency: completedPayment.currency,
        status: completedPayment.status,
        piPaymentId: completedPayment.piPaymentId,
        domain: completedPayment.domain,
        completedAt: completedPayment.metadata.completedAt,
      },
    });
  } catch (error) {
    console.error("Payment processing error:", error);

    // Log error for monitoring
    await logError({
      error: error.message,
      stack: error.stack,
      userId,
      timestamp: new Date().toISOString(),
      context: "payment-processing",
    });

    return res.status(500).json({
      error: "Payment processing failed",
      message: "An error occurred while processing your payment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Validate Pi Network payment transaction
 * @private
 * @param {string} piPaymentId - Pi Network payment identifier
 * @param {number} amount - Payment amount
 * @returns {Promise<boolean>} - True if payment is valid
 */
async function validatePiNetworkPayment(piPaymentId, amount) {
  try {
    // Note: Implement actual Pi Network API validation in production
    // This is a placeholder for the actual Pi Network SDK integration
    // const piPayment = await PiNetwork.payments.get(piPaymentId);
    // return piPayment && piPayment.amount === amount && piPayment.status === 'completed';

    // Simulated validation for development
    if (process.env.NODE_ENV === "development") {
      return piPaymentId && amount > 0;
    }

    // In production, integrate with Pi Network API
    return true;
  } catch (error) {
    console.error("Pi Network validation error:", error);
    return false;
  }
}

/**
 * Log transaction for audit trail
 * @private
 */
async function logTransaction(transactionData) {
  try {
    // Note: Implement transaction logging to separate audit table for compliance
    // await prisma.transactionLog.create({ data: transactionData });
    logger.info("Transaction logged:", { transactionData });
  } catch (error) {
    logger.error("Transaction logging error:", { error });
  }
}

/**
 * Trigger post-payment actions
 * @private
 */
async function triggerPostPaymentActions(payment) {
  try {
    // Note: Implement post-payment workflows:
    // - Send confirmation email
    // - Unlock premium features
    // - Update user tier
    // - Trigger webhooks
    console.log("Post-payment actions triggered for payment:", payment.id);
  } catch (error) {
    console.error("Post-payment actions error:", error);
  }
}

/**
 * Log errors for monitoring
 * @private
 */
async function logError(errorData) {
  try {
    // Note: Implement centralized error logging system
    // await prisma.errorLog.create({ data: errorData });
    logger.error("Error logged:", { errorData });
  } catch (error) {
    logger.error("Error logging failed:", { error });
  }
}
