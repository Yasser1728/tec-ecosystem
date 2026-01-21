/**
 * Insurance Policies API
 *
 * GET /api/insure/policies - List user policies
 * POST /api/insure/policies - Purchase insurance policy
 *
 * Part of the Quick Start workflow - Step 5: Insurance Activation
 */

const crypto = require("crypto");
const { getSession } = require("next-auth/react");
const eventBus = require("../../../lib/eventBus");
const quickStartService = require("../../../lib/services/quickStartService");
const {
  QUICK_START_STEPS,
} = require("../../../lib/services/quickStartService");

export default async function handler(req, res) {
  try {
    // Get user session
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - Please authenticate first",
      });
    }

    const userId = session.user.id;

    // Handle GET - List policies
    if (req.method === "GET") {
      // Mock data - In production, query Policy table
      const policies = [
        {
          id: `policy_ins_${userId}_1`,
          policyNumber: `INS-ASSET-2026-${crypto.randomInt(0, 100000)}`,
          userId,
          assetId: `asset_${userId}_1`,
          type: "ASSET_PROTECTION",
          product: "Cryptocurrency Asset Insurance",
          coverageAmount: 47000,
          premium: 39, // Monthly premium
          premiumFrequency: "MONTHLY",
          status: "ACTIVE",
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];

      return res.status(200).json({
        success: true,
        policies,
        count: policies.length,
      });
    }

    // Handle POST - Purchase policy
    if (req.method === "POST") {
      const {
        recommendationId,
        assetId,
        coverageAmount,
        term = 12, // months
        paymentMethod = "PI_WALLET",
      } = req.body;

      // Validate required fields
      if (!assetId || !coverageAmount) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: assetId, coverageAmount",
        });
      }

      // Calculate premium
      const annualPremium = Math.round(coverageAmount * 0.01); // 1% annual
      const monthlyPremium = Math.round(annualPremium / 12);

      // Create policy (mock)
      const policy = {
        id: `policy_ins_${userId}_${crypto.randomBytes(16).toString("hex")}`,
        policyNumber: `INS-ASSET-2026-${crypto.randomInt(0, 100000).toString().padStart(6, "0")}`,
        userId,
        assetId,
        recommendationId,
        type: "ASSET_PROTECTION",
        product: "Asset Protection Insurance",
        coverageAmount,
        premium: monthlyPremium,
        premiumFrequency: "MONTHLY",
        annualPremium,
        term,
        paymentMethod,
        status: "ACTIVE",
        startDate: new Date().toISOString(),
        endDate: new Date(
          Date.now() + term * 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        nextPaymentDue: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        deductible: 500,
        coverageDetails: {
          theft: true,
          loss: true,
          damage: false,
          fraudProtection: true,
        },
        createdAt: new Date().toISOString(),
      };

      // Publish policy created event
      eventBus.publish("insure.policy.created", {
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        userId,
        assetId,
        coverageAmount,
        premium: monthlyPremium,
        type: "ASSET_PROTECTION",
      });

      // Update Quick Start progress
      await quickStartService.updateStep(
        userId,
        QUICK_START_STEPS.INSURANCE_ACTIVATION,
        {
          policyId: policy.id,
          policyNumber: policy.policyNumber,
          coverageAmount,
          assetId,
        },
      );

      // Get next step
      const nextStep = await quickStartService.getNextStep(userId);

      return res.status(201).json({
        success: true,
        policy,
        message: "Insurance policy activated successfully",
        quickStart: {
          stepCompleted: QUICK_START_STEPS.INSURANCE_ACTIVATION,
          nextStep,
        },
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  } catch (error) {
    // console.error('[Insurance Policies API] Error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to process insurance policy request",
      message: error.message,
    });
  }
}
