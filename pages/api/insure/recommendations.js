/**
 * Insurance Recommendations API
 * 
 * GET /api/insure/recommendations - Get insurance recommendations for user's assets
 * 
 * Part of the Quick Start workflow - Step 4: Insurance Recommendation
 * Automatically recommends insurance for high-value assets
 */

const { getSession } = require('next-auth/react');
const eventBus = require('../../../lib/eventBus');

// Premium calculation constants
const PREMIUM_RATE = 0.01; // 1% of asset value per year
const INSURANCE_THRESHOLD = process.env.INSURANCE_THRESHOLD || 10000;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Get user session
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Please authenticate first'
      });
    }

    const userId = session.user.id;
    const { assetId, portfolioId } = req.query;

    // Mock data - In production, query actual user assets
    // For Quick Start demo, generate recommendations
    const recommendations = [
      {
        id: `rec_ins_${userId}_${Date.now()}`,
        userId,
        assetId: assetId || `asset_${userId}_1`,
        assetName: 'Bitcoin Holdings',
        assetType: 'CRYPTOCURRENCY',
        assetValue: 47000,
        recommendedCoverage: 47000,
        policyType: 'ASSET_PROTECTION',
        estimatedPremium: Math.round(47000 * PREMIUM_RATE / 12), // Monthly premium
        premiumFrequency: 'MONTHLY',
        annualPremium: Math.round(47000 * PREMIUM_RATE),
        coverageDetails: {
          theft: true,
          loss: true,
          damage: false,
          fraudProtection: true
        },
        reason: 'High-value cryptocurrency asset recommended for protection against theft and loss',
        benefits: [
          'Protection against theft and unauthorized access',
          'Coverage for exchange hacks and security breaches',
          'Loss recovery up to policy limit',
          'Fraud protection and identity theft coverage'
        ],
        terms: {
          deductible: 500,
          maxClaim: 47000,
          claimLimit: '2 claims per year',
          coverage: '24/7 global coverage'
        },
        createdAt: new Date().toISOString()
      }
    ];

    return res.status(200).json({
      success: true,
      recommendations,
      count: recommendations.length,
      threshold: INSURANCE_THRESHOLD,
      message: recommendations.length > 0
        ? 'Insurance recommendations available for your high-value assets'
        : 'No insurance recommendations at this time'
    });

  } catch (error) {
    // console.error('[Insurance Recommendations API] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve insurance recommendations',
      message: error.message
    });
  }
}
