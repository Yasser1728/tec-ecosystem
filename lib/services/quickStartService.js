/**
 * Quick Start Service - Orchestrates the complete user onboarding workflow
 * 
 * This service coordinates the integrated workflow across Assets, Insure, and FundX domains,
 * tracking user progress through the Quick Start journey.
 * 
 * @module lib/services/quickStartService
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const eventBus = require('../eventBus');

// Quick Start workflow steps
const QUICK_START_STEPS = {
  AUTHENTICATION: 'authentication',
  PORTFOLIO_CREATION: 'portfolioCreation',
  ASSET_ADDITION: 'assetAddition',
  INSURANCE_RECOMMENDATION: 'insuranceRecommendation',
  INSURANCE_ACTIVATION: 'insuranceActivation',
  INVESTMENT_OPPORTUNITY: 'investmentOpportunity',
  FIRST_INVESTMENT: 'firstInvestment'
};

// Status values
const STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

class QuickStartService {
  /**
   * Initialize Quick Start tracking for a new user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Quick Start progress record
   */
  async initializeQuickStart(userId) {
    try {
      // Check if already exists
      const existing = await this.getQuickStartStatus(userId);
      if (existing) {
        return existing;
      }

      // Create new progress record
      const progress = {
        userId,
        status: STATUS.IN_PROGRESS,
        steps: {
          [QUICK_START_STEPS.AUTHENTICATION]: true,
          [QUICK_START_STEPS.PORTFOLIO_CREATION]: false,
          [QUICK_START_STEPS.ASSET_ADDITION]: false,
          [QUICK_START_STEPS.INSURANCE_RECOMMENDATION]: false,
          [QUICK_START_STEPS.INSURANCE_ACTIVATION]: false,
          [QUICK_START_STEPS.INVESTMENT_OPPORTUNITY]: false,
          [QUICK_START_STEPS.FIRST_INVESTMENT]: false
        },
        startedAt: new Date(),
        completedAt: null
      };

      // Store in database (using User metadata for simplicity)
      await prisma.user.update({
        where: { id: userId },
        data: {
          metadata: progress
        }
      });

      // Publish event
      eventBus.publish('quickstart.initialized', {
        userId,
        startedAt: progress.startedAt
      });

      return progress;
    } catch (error) {
      console.error('[QuickStartService] Error initializing:', error);
      throw new Error('Failed to initialize Quick Start workflow');
    }
  }

  /**
   * Get Quick Start status for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Quick Start progress or null
   */
  async getQuickStartStatus(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { metadata: true }
      });

      if (!user || !user.metadata || !user.metadata.steps) {
        return null;
      }

      return user.metadata;
    } catch (error) {
      console.error('[QuickStartService] Error getting status:', error);
      return null;
    }
  }

  /**
   * Update a specific step in the Quick Start workflow
   * 
   * @param {string} userId - User ID
   * @param {string} step - Step name from QUICK_START_STEPS
   * @param {Object} data - Additional data for the step
   * @returns {Promise<Object>} Updated progress
   */
  async updateStep(userId, step, data = {}) {
    try {
      const current = await this.getQuickStartStatus(userId) || await this.initializeQuickStart(userId);

      // Update the step
      current.steps[step] = true;
      current.updatedAt = new Date();

      // Store step-specific data
      if (data) {
        current[step + 'Data'] = data;
      }

      // Check if workflow is complete
      const allStepsComplete = Object.values(QUICK_START_STEPS)
        .every(s => current.steps[s] === true);

      if (allStepsComplete && current.status !== STATUS.COMPLETED) {
        current.status = STATUS.COMPLETED;
        current.completedAt = new Date();

        // Publish completion event
        eventBus.publish('quickstart.completed', {
          userId,
          completedAt: current.completedAt,
          duration: current.completedAt - current.startedAt
        });
      }

      // Save to database
      await prisma.user.update({
        where: { id: userId },
        data: {
          metadata: current
        }
      });

      // Publish step update event
      eventBus.publish('quickstart.step.updated', {
        userId,
        step,
        completed: true,
        data
      });

      return current;
    } catch (error) {
      console.error('[QuickStartService] Error updating step:', error);
      throw new Error(`Failed to update Quick Start step: ${step}`);
    }
  }

  /**
   * Get next recommended step for user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Next step recommendation
   */
  async getNextStep(userId) {
    try {
      const status = await this.getQuickStartStatus(userId);

      if (!status) {
        return {
          step: QUICK_START_STEPS.AUTHENTICATION,
          title: 'Authenticate with Pi Network',
          description: 'Sign in or create an account using your Pi Network credentials',
          endpoint: '/api/auth/pi-authenticate',
          method: 'POST'
        };
      }

      const steps = status.steps;

      // Check each step in order
      if (!steps[QUICK_START_STEPS.PORTFOLIO_CREATION]) {
        return {
          step: QUICK_START_STEPS.PORTFOLIO_CREATION,
          title: 'Create Your Portfolio',
          description: 'Set up your first asset portfolio to start tracking your wealth',
          endpoint: '/api/assets/portfolios',
          method: 'POST',
          domain: 'assets.pi'
        };
      }

      if (!steps[QUICK_START_STEPS.ASSET_ADDITION]) {
        return {
          step: QUICK_START_STEPS.ASSET_ADDITION,
          title: 'Add Your First Asset',
          description: 'Add an asset to your portfolio (cryptocurrency, property, investment, etc.)',
          endpoint: '/api/assets',
          method: 'POST',
          domain: 'assets.pi'
        };
      }

      if (!steps[QUICK_START_STEPS.INSURANCE_ACTIVATION]) {
        return {
          step: QUICK_START_STEPS.INSURANCE_ACTIVATION,
          title: 'Protect Your Assets',
          description: 'Review and activate insurance recommendations for your high-value assets',
          endpoint: '/api/insure/recommendations',
          method: 'GET',
          domain: 'insure.pi'
        };
      }

      if (!steps[QUICK_START_STEPS.FIRST_INVESTMENT]) {
        return {
          step: QUICK_START_STEPS.FIRST_INVESTMENT,
          title: 'Start Investing',
          description: 'Explore investment opportunities tailored to your risk profile',
          endpoint: '/api/fundx/opportunities/recommended',
          method: 'GET',
          domain: 'fundx.pi'
        };
      }

      // All steps completed
      return {
        step: 'COMPLETED',
        title: 'Quick Start Complete!',
        description: 'You have successfully completed the Quick Start workflow. Explore more features!',
        completed: true
      };
    } catch (error) {
      console.error('[QuickStartService] Error getting next step:', error);
      throw new Error('Failed to get next Quick Start step');
    }
  }

  /**
   * Get progress percentage
   * 
   * @param {string} userId - User ID
   * @returns {Promise<number>} Progress percentage (0-100)
   */
  async getProgressPercentage(userId) {
    try {
      const status = await this.getQuickStartStatus(userId);

      if (!status) {
        return 0;
      }

      const totalSteps = Object.keys(QUICK_START_STEPS).length;
      const completedSteps = Object.values(status.steps).filter(s => s === true).length;

      return Math.round((completedSteps / totalSteps) * 100);
    } catch (error) {
      console.error('[QuickStartService] Error calculating progress:', error);
      return 0;
    }
  }

  /**
   * Reset Quick Start workflow for a user (for testing)
   * 
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async resetQuickStart(userId) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          metadata: null
        }
      });

      return true;
    } catch (error) {
      console.error('[QuickStartService] Error resetting:', error);
      return false;
    }
  }
}

module.exports = new QuickStartService();
module.exports.QUICK_START_STEPS = QUICK_START_STEPS;
module.exports.STATUS = STATUS;
