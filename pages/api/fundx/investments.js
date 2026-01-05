/**
 * FundX Investments API
 * 
 * GET /api/fundx/investments - List user investments
 * POST /api/fundx/investments - Create new investment
 * 
 * Part of the Quick Start workflow - Step 7: First Investment
 */

const { getSession } = require('next-auth/react');
const eventBus = require('../../../lib/eventBus');
const quickStartService = require('../../../lib/services/quickStartService');
const { QUICK_START_STEPS } = require('../../../lib/services/quickStartService');

export default async function handler(req, res) {
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

    // Handle GET - List investments
    if (req.method === 'GET') {
      // Mock data - In production, query Investment table
      const investments = [
        {
          id: `inv_fundx_${userId}_1`,
          userId,
          strategyId: 'strategy_balanced_growth',
          strategyName: 'Balanced Growth Portfolio',
          amount: 5000,
          shares: 39.84,
          entryPrice: 125.50,
          entryDate: new Date().toISOString(),
          currentNAV: 125.50,
          currentValue: 5000,
          unrealizedPL: 0,
          percentageReturn: 0,
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      ];

      return res.status(200).json({
        success: true,
        investments,
        count: investments.length,
        totalValue: investments.reduce((sum, inv) => sum + inv.currentValue, 0)
      });
    }

    // Handle POST - Create investment
    if (req.method === 'POST') {
      const {
        strategyId,
        amount,
        portfolioId,
        paymentMethod = 'PI_WALLET'
      } = req.body;

      // Validate required fields
      if (!strategyId || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: strategyId, amount'
        });
      }

      // Validate minimum investment (example: 1000 PI)
      if (amount < 1000) {
        return res.status(400).json({
          success: false,
          error: 'Minimum investment amount is 1000 PI'
        });
      }

      // Mock strategy data
      const strategies = {
        strategy_balanced_growth: {
          name: 'Balanced Growth Portfolio',
          currentNAV: 125.50,
          minInvestment: 1000
        },
        strategy_conservative_income: {
          name: 'Conservative Income Portfolio',
          currentNAV: 105.25,
          minInvestment: 500
        },
        strategy_aggressive_growth: {
          name: 'Aggressive Growth Portfolio',
          currentNAV: 142.75,
          minInvestment: 2000
        }
      };

      const strategy = strategies[strategyId];

      if (!strategy) {
        return res.status(404).json({
          success: false,
          error: 'Investment strategy not found'
        });
      }

      // Calculate shares
      const shares = amount / strategy.currentNAV;

      // Create investment (mock)
      const investment = {
        id: `inv_fundx_${userId}_${Date.now()}`,
        userId,
        strategyId,
        strategyName: strategy.name,
        amount,
        shares: parseFloat(shares.toFixed(4)),
        entryPrice: strategy.currentNAV,
        entryDate: new Date().toISOString(),
        currentNAV: strategy.currentNAV,
        currentValue: amount,
        unrealizedPL: 0,
        percentageReturn: 0,
        paymentMethod,
        status: 'ACTIVE',
        portfolioId: portfolioId || `portfolio_${userId}_main`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create corresponding asset in portfolio
      const assetInvestment = {
        id: `asset_investment_${investment.id}`,
        portfolioId: investment.portfolioId,
        userId,
        name: `${strategy.name} Investment`,
        assetType: 'INVESTMENT',
        quantity: shares,
        purchasePrice: strategy.currentNAV,
        currentPrice: strategy.currentNAV,
        currentValue: amount,
        sourceId: investment.id,
        sourceDomain: 'fundx',
        createdAt: new Date().toISOString()
      };

      // Publish investment created event
      eventBus.publish('fundx.investment.created', {
        investmentId: investment.id,
        userId,
        strategyId,
        strategyName: strategy.name,
        amount,
        shares: investment.shares,
        portfolioId: investment.portfolioId
      });

      // Publish asset created event for portfolio integration
      eventBus.publish('assets.asset.created', {
        assetId: assetInvestment.id,
        userId,
        portfolioId: investment.portfolioId,
        name: assetInvestment.name,
        assetType: 'INVESTMENT',
        value: amount,
        sourceId: investment.id,
        sourceDomain: 'fundx'
      });

      // Update Quick Start progress
      await quickStartService.updateStep(userId, QUICK_START_STEPS.FIRST_INVESTMENT, {
        investmentId: investment.id,
        strategyName: strategy.name,
        amount,
        shares: investment.shares
      });

      // Get next step (should be completion)
      const nextStep = await quickStartService.getNextStep(userId);
      const quickStartStatus = await quickStartService.getQuickStartStatus(userId);

      return res.status(201).json({
        success: true,
        investment,
        assetCreated: {
          id: assetInvestment.id,
          portfolioId: investment.portfolioId,
          name: assetInvestment.name,
          type: 'INVESTMENT',
          value: amount
        },
        message: 'Investment created successfully and added to your portfolio',
        quickStart: {
          stepCompleted: QUICK_START_STEPS.FIRST_INVESTMENT,
          workflowCompleted: quickStartStatus?.status === 'COMPLETED',
          nextStep
        }
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('[FundX Investments API] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process investment request',
      message: error.message
    });
  }
}
