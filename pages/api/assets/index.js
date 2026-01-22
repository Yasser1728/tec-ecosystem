/**
 * Assets API
 *
 * GET /api/assets - List user assets
 * POST /api/assets - Add new asset to portfolio
 *
 * Part of the Quick Start workflow - Step 3: Asset Addition
 */

const crypto = require("crypto");
const { getSession } = require("next-auth/react");
const eventBus = require("../../../lib/eventBus");
const quickStartService = require("../../../lib/services/quickStartService");
const {
  QUICK_START_STEPS,
} = require("../../../lib/services/quickStartService");

// Insurance threshold for automatic recommendations
const INSURANCE_THRESHOLD = process.env.INSURANCE_THRESHOLD || 10000;

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

    // Handle GET - List assets
    if (req.method === "GET") {
      const { portfolioId } = req.query;

      // For this demo, return mock data
      const assets = [
        {
          id: `asset_${userId}_1`,
          portfolioId: portfolioId || `portfolio_${userId}_main`,
          name: "Sample Asset",
          assetType: "CRYPTOCURRENCY",
          quantity: 1,
          purchasePrice: 45000,
          currentPrice: 47000,
          currentValue: 47000,
          unrealizedGainLoss: 2000,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        },
      ];

      return res.status(200).json({
        success: true,
        assets,
        count: assets.length,
      });
    }

    // Handle POST - Add asset
    if (req.method === "POST") {
      const {
        portfolioId,
        name,
        assetType,
        quantity,
        purchasePrice,
        purchaseDate,
        currentPrice,
        description,
      } = req.body;

      // Validate required fields
      if (!portfolioId || !name || !assetType || !quantity || !purchasePrice) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: portfolioId, name, assetType, quantity, purchasePrice",
        });
      }

      // Calculate values
      const price = currentPrice || purchasePrice;
      const currentValue = quantity * price;
      const costBasis = quantity * purchasePrice;
      const unrealizedGainLoss = currentValue - costBasis;

      // Create asset (mock)
      const asset = {
        id: `asset_${userId}_${crypto.randomBytes(16).toString("hex")}`,
        portfolioId,
        userId,
        name,
        assetType,
        quantity,
        purchasePrice,
        purchaseDate: purchaseDate || new Date().toISOString(),
        currentPrice: price,
        currentValue,
        costBasis,
        unrealizedGainLoss,
        status: "ACTIVE",
        description: description || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Publish asset created event
      eventBus.publish("assets.asset.created", {
        assetId: asset.id,
        userId,
        portfolioId,
        name,
        assetType,
        value: currentValue,
        quantity,
        currentPrice: price,
      });

      // Update Quick Start progress
      await quickStartService.updateStep(
        userId,
        QUICK_START_STEPS.ASSET_ADDITION,
        {
          assetId: asset.id,
          assetName: name,
          assetValue: currentValue,
        },
      );

      // Check if insurance recommendation should be triggered
      const insuranceTriggered = currentValue >= INSURANCE_THRESHOLD;

      if (insuranceTriggered) {
        // Mark insurance recommendation step
        await quickStartService.updateStep(
          userId,
          QUICK_START_STEPS.INSURANCE_RECOMMENDATION,
          {
            assetId: asset.id,
            assetValue: currentValue,
            recommendationTriggered: true,
          },
        );
      }

      // Get next step
      const nextStep = await quickStartService.getNextStep(userId);

      return res.status(201).json({
        success: true,
        asset,
        insuranceRecommended: insuranceTriggered,
        insuranceThreshold: INSURANCE_THRESHOLD,
        quickStart: {
          stepCompleted: QUICK_START_STEPS.ASSET_ADDITION,
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
    // console.error('[Assets API] Error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to process asset request",
      message: error.message,
    });
  }
}
