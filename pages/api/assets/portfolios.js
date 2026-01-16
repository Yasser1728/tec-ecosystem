import { logger } from '../../../lib/utils/logger.js';

/**
 * Assets Portfolio API
 * 
 * GET /api/assets/portfolios - List user portfolios
 * POST /api/assets/portfolios - Create new portfolio
 * 
 * Part of the Quick Start workflow - Step 2: Portfolio Creation
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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

    // Handle GET - List portfolios
    if (req.method === 'GET') {
      // For this demo, we'll return mock data
      // In production, this would query the Portfolio table
      const portfolios = [
        {
          id: `portfolio_${userId}_main`,
          userId,
          name: 'Main Portfolio',
          description: 'Primary investment and asset portfolio',
          currency: 'PI',
          totalValue: 0,
          isDefault: true,
          createdAt: new Date().toISOString()
        }
      ];

      return res.status(200).json({
        success: true,
        portfolios,
        count: portfolios.length
      });
    }

    // Handle POST - Create portfolio
    if (req.method === 'POST') {
      const { name, description, currency = 'PI', isDefault = true } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Portfolio name is required'
        });
      }

      // Create portfolio (mock for now)
      const portfolio = {
        id: `portfolio_${userId}_${crypto.randomBytes(16).toString('hex')}`,
        userId,
        name,
        description: description || '',
        currency,
        totalValue: 0,
        isDefault,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Publish event
      eventBus.publish('assets.portfolio.created', {
        portfolioId: portfolio.id,
        userId,
        name,
        currency,
        isDefault
      });

      // Update Quick Start progress
      await quickStartService.updateStep(userId, QUICK_START_STEPS.PORTFOLIO_CREATION, {
        portfolioId: portfolio.id,
        name
      });

      // Get next step
      const nextStep = await quickStartService.getNextStep(userId);

      return res.status(201).json({
        success: true,
        portfolio,
        quickStart: {
          stepCompleted: QUICK_START_STEPS.PORTFOLIO_CREATION,
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
    // console.error('[Assets Portfolio API] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process portfolio request',
      message: error.message
    });
  }
}
