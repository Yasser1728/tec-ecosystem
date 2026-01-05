/**
 * Insure Service - Core Business Logic for Insurance Domain
 * 
 * This service handles all business logic related to insurance management,
 * including policy creation, claim processing, premium calculations, and integrations.
 * 
 * @module domains/insure/services/insureService
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Risk and premium calculation constants
const RISK_FACTORS = {
  LOW: 1.0,
  MEDIUM: 1.3,
  HIGH: 1.7,
  CRITICAL: 2.5,
};

const BASE_PREMIUM_RATES = {
  LIFE: 0.002,         // 0.2% of coverage
  HEALTH: 0.003,       // 0.3% of coverage
  PROPERTY: 0.004,     // 0.4% of coverage
  AUTO: 0.005,         // 0.5% of coverage
  TRAVEL: 0.01,        // 1% of coverage
  TRANSACTION: 0.015,  // 1.5% of coverage
  ASSET: 0.003,        // 0.3% of coverage
};

const FREQUENCY_MULTIPLIERS = {
  MONTHLY: 12,
  QUARTERLY: 4,
  SEMI_ANNUAL: 2,
  ANNUAL: 1,
};

class InsureService {
  /**
   * Generate unique policy number
   * 
   * @returns {string} Unique policy number
   */
  generatePolicyNumber() {
    const timestamp = Date.now();
    const random = crypto.randomInt(0, 10000).toString().padStart(4, '0');
    return `INS-${timestamp}-${random}`;
  }

  /**
   * Generate unique claim number
   * 
   * @returns {string} Unique claim number
   */
  generateClaimNumber() {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    const random = crypto.randomInt(0, 1000).toString().padStart(3, '0');
    return `CLM-${year}-${timestamp}-${random}`;
  }

  /**
   * Calculate premium for insurance policy
   * 
   * @param {Object} data - Premium calculation inputs
   * @returns {Object} Premium calculation result
   */
  calculatePremium(data) {
    const { policyType, coverageAmount, term, premiumFrequency = 'MONTHLY', riskFactors = {} } = data;

    // Base premium calculation
    const baseRate = BASE_PREMIUM_RATES[policyType] || 0.003;
    const basePremium = coverageAmount * baseRate;

    // Adjust for term (longer term = discount)
    const termMultiplier = term > 10 ? 0.9 : term > 5 ? 0.95 : 1.0;

    // Risk assessment
    const riskScore = this.assessRisk(policyType, riskFactors);
    const riskMultiplier = RISK_FACTORS[riskScore.riskLevel] || 1.0;

    // Calculate adjusted premium
    const adjustedPremium = basePremium * termMultiplier * riskMultiplier;

    // Frequency adjustment
    const frequencyMultiplier = FREQUENCY_MULTIPLIERS[premiumFrequency] || 12;
    const finalPremium = adjustedPremium / frequencyMultiplier;

    return {
      basePremium,
      adjustedPremium,
      finalPremium: Math.round(finalPremium * 100) / 100,
      riskScore: riskScore.riskScore,
      factors: {
        coverageMultiplier: baseRate,
        termMultiplier,
        riskMultiplier,
        frequencyMultiplier,
      },
    };
  }

  /**
   * Assess risk based on policy type and factors
   * 
   * @param {string} policyType - Type of policy
   * @param {Object} riskFactors - Risk assessment factors
   * @returns {Object} Risk assessment result
   */
  assessRisk(policyType, riskFactors = {}) {
    let riskScore = 50; // Base score

    // Adjust based on policy type
    const policyRiskAdjustments = {
      LIFE: -10,
      HEALTH: 5,
      PROPERTY: 10,
      AUTO: 15,
      TRAVEL: 20,
      TRANSACTION: 25,
      ASSET: 5,
    };

    riskScore += policyRiskAdjustments[policyType] || 0;

    // Adjust based on factors
    if (riskFactors.assetAge && riskFactors.assetAge > 10) riskScore += 10;
    if (riskFactors.location === 'HIGH_RISK') riskScore += 15;
    if (riskFactors.claimHistory && riskFactors.claimHistory > 2) riskScore += 20;

    // Determine risk level
    let riskLevel;
    if (riskScore < 40) riskLevel = 'LOW';
    else if (riskScore < 60) riskLevel = 'MEDIUM';
    else if (riskScore < 80) riskLevel = 'HIGH';
    else riskLevel = 'CRITICAL';

    return {
      riskScore,
      riskLevel,
      factors: riskFactors,
      recommendations: this.generateRiskRecommendations(riskLevel),
    };
  }

  /**
   * Generate recommendations based on risk level
   * 
   * @param {string} riskLevel - Risk level
   * @returns {Array<string>} Recommendations
   */
  generateRiskRecommendations(riskLevel) {
    const recommendations = {
      LOW: ['Maintain current coverage', 'Consider bundling for discounts'],
      MEDIUM: ['Regular maintenance recommended', 'Review coverage annually'],
      HIGH: ['Increase coverage amount', 'Implement risk mitigation measures'],
      CRITICAL: ['Immediate risk assessment required', 'Consider additional coverage'],
    };

    return recommendations[riskLevel] || [];
  }

  /**
   * Validate policy data
   * 
   * @param {Object} data - Policy data to validate
   * @throws {Error} If validation fails
   */
  validatePolicyData(data) {
    if (!data.userId) throw new Error('User ID is required');
    if (!data.policyType) throw new Error('Policy type is required');
    if (!data.productName) throw new Error('Product name is required');
    if (!data.coverageAmount || data.coverageAmount <= 0) {
      throw new Error('Coverage amount must be positive');
    }
    if (!data.premium || data.premium <= 0) {
      throw new Error('Premium must be positive');
    }
    if (!data.startDate) throw new Error('Start date is required');
    if (!data.term || data.term <= 0) {
      throw new Error('Term must be positive');
    }
  }

  /**
   * Create insurance policy
   * 
   * @param {Object} data - Policy creation data
   * @returns {Promise<Object>} Created policy
   */
  async createPolicy(data) {
    try {
      // Validate input
      this.validatePolicyData(data);

      // Generate policy number
      const policyNumber = this.generatePolicyNumber();

      // Calculate end date
      const startDate = new Date(data.startDate);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + data.term);

      // Create policy
      const policy = await prisma.insurancePolicy.create({
        data: {
          policyNumber,
          userId: data.userId,
          assetId: data.assetId || null,
          policyType: data.policyType,
          productName: data.productName,
          coverageAmount: data.coverageAmount,
          premium: data.premium,
          premiumFrequency: data.premiumFrequency || 'MONTHLY',
          deductible: data.deductible || 0,
          startDate,
          endDate,
          term: data.term,
          status: 'ACTIVE',
          metadata: data.metadata || {},
        },
      });

      // Create initial premium payment schedule
      await this.createPremiumSchedule(policy);

      // Publish policy created event
      this.publishPolicyCreated(policy);

      return policy;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw new Error(`Failed to create policy: ${error.message}`);
    }
  }

  /**
   * Create premium payment schedule for policy
   * 
   * @param {Object} policy - Insurance policy
   * @returns {Promise<void>}
   */
  async createPremiumSchedule(policy) {
    const frequency = policy.premiumFrequency;
    const startDate = new Date(policy.startDate);
    const endDate = new Date(policy.endDate);
    const premium = policy.premium;

    // Calculate payment intervals
    const intervals = {
      MONTHLY: 1,
      QUARTERLY: 3,
      SEMI_ANNUAL: 6,
      ANNUAL: 12,
    };

    const intervalMonths = intervals[frequency] || 1;
    const payments = [];

    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      payments.push({
        policyId: policy.id,
        amount: premium,
        dueDate: new Date(currentDate),
        status: 'PENDING',
      });

      currentDate.setMonth(currentDate.getMonth() + intervalMonths);
    }

    // Create first 12 payments (1 year ahead)
    const initialPayments = payments.slice(0, 12);
    if (initialPayments.length > 0) {
      await prisma.premiumPayment.createMany({
        data: initialPayments,
      });
    }
  }

  /**
   * Get policy by ID
   * 
   * @param {string} policyId - Policy ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Policy details
   */
  async getPolicyById(policyId, options = {}) {
    const includeRelations = options.include || {};

    const policy = await prisma.insurancePolicy.findUnique({
      where: { id: policyId },
      include: {
        user: includeRelations.user || false,
        claims: includeRelations.claims || false,
        premiumPayments: includeRelations.premiumPayments || false,
      },
    });

    if (!policy) {
      throw new Error('Policy not found');
    }

    return policy;
  }

  /**
   * Get user policies
   * 
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of policies
   */
  async getUserPolicies(userId, filters = {}) {
    const where = { userId };

    if (filters.status) where.status = filters.status;
    if (filters.policyType) where.policyType = filters.policyType;
    if (filters.assetId) where.assetId = filters.assetId;

    const policies = await prisma.insurancePolicy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        claims: true,
        premiumPayments: {
          where: { status: 'PENDING' },
          take: 1,
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    return policies;
  }

  /**
   * Update policy
   * 
   * @param {string} policyId - Policy ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object>} Updated policy
   */
  async updatePolicy(policyId, updates) {
    try {
      const policy = await prisma.insurancePolicy.update({
        where: { id: policyId },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      // Publish update event
      this.publishPolicyUpdated(policy);

      return policy;
    } catch (error) {
      console.error('Error updating policy:', error);
      throw new Error(`Failed to update policy: ${error.message}`);
    }
  }

  /**
   * Validate claim data
   * 
   * @param {Object} data - Claim data to validate
   * @throws {Error} If validation fails
   */
  validateClaimData(data) {
    if (!data.policyId) throw new Error('Policy ID is required');
    if (!data.userId) throw new Error('User ID is required');
    if (!data.claimAmount || data.claimAmount <= 0) {
      throw new Error('Claim amount must be positive');
    }
    if (!data.incidentDate) throw new Error('Incident date is required');
    if (!data.incidentType) throw new Error('Incident type is required');
    if (!data.description) throw new Error('Description is required');
  }

  /**
   * Submit insurance claim
   * 
   * @param {Object} data - Claim submission data
   * @returns {Promise<Object>} Created claim
   */
  async submitClaim(data) {
    try {
      // Validate input
      this.validateClaimData(data);

      // Verify policy exists and is active
      const policy = await this.getPolicyById(data.policyId);
      if (policy.status !== 'ACTIVE') {
        throw new Error('Policy is not active');
      }

      // Verify claim amount doesn't exceed coverage
      if (data.claimAmount > policy.coverageAmount) {
        throw new Error('Claim amount exceeds coverage amount');
      }

      // Generate claim number
      const claimNumber = this.generateClaimNumber();

      // Create claim
      const claim = await prisma.claim.create({
        data: {
          claimNumber,
          policyId: data.policyId,
          userId: data.userId,
          claimAmount: data.claimAmount,
          incidentDate: new Date(data.incidentDate),
          incidentType: data.incidentType,
          description: data.description,
          documents: data.documents || {},
          status: 'SUBMITTED',
        },
        include: {
          policy: true,
        },
      });

      // Publish claim submitted event
      this.publishClaimSubmitted(claim);

      return claim;
    } catch (error) {
      console.error('Error submitting claim:', error);
      throw new Error(`Failed to submit claim: ${error.message}`);
    }
  }

  /**
   * Review and process claim
   * 
   * @param {string} claimId - Claim ID
   * @param {Object} reviewData - Review decision data
   * @returns {Promise<Object>} Updated claim
   */
  async reviewClaim(claimId, reviewData) {
    try {
      const { status, approvedAmount, reviewNotes, reviewedBy } = reviewData;

      if (!['APPROVED', 'REJECTED'].includes(status)) {
        throw new Error('Invalid review status');
      }

      // Get claim with policy
      const claim = await prisma.claim.findUnique({
        where: { id: claimId },
        include: { policy: true },
      });

      if (!claim) throw new Error('Claim not found');
      if (claim.status !== 'SUBMITTED' && claim.status !== 'UNDER_REVIEW') {
        throw new Error('Claim cannot be reviewed in current status');
      }

      // Validate approved amount
      if (status === 'APPROVED') {
        const finalAmount = approvedAmount || claim.claimAmount;
        if (finalAmount > claim.policy.coverageAmount) {
          throw new Error('Approved amount exceeds coverage');
        }
      }

      // Update claim
      const updatedClaim = await prisma.claim.update({
        where: { id: claimId },
        data: {
          status,
          approvedAmount: status === 'APPROVED' ? (approvedAmount || claim.claimAmount) : null,
          reviewNotes,
          reviewedBy,
          reviewedAt: new Date(),
        },
        include: {
          policy: true,
        },
      });

      // Publish appropriate event
      if (status === 'APPROVED') {
        this.publishClaimApproved(updatedClaim);
      } else {
        this.publishClaimRejected(updatedClaim, reviewNotes);
      }

      return updatedClaim;
    } catch (error) {
      console.error('Error reviewing claim:', error);
      throw new Error(`Failed to review claim: ${error.message}`);
    }
  }

  /**
   * Process claim payout
   * 
   * @param {string} claimId - Claim ID
   * @param {Object} payoutData - Payout details
   * @returns {Promise<Object>} Updated claim
   */
  async processClaimPayout(claimId, payoutData) {
    try {
      const { paidAmount, paymentReference } = payoutData;

      const claim = await prisma.claim.findUnique({
        where: { id: claimId },
        include: { policy: true },
      });

      if (!claim) throw new Error('Claim not found');
      if (claim.status !== 'APPROVED') {
        throw new Error('Only approved claims can be paid');
      }

      // Update claim with payout info
      const updatedClaim = await prisma.claim.update({
        where: { id: claimId },
        data: {
          status: 'PAID',
          paidAmount,
          paidAt: new Date(),
          paymentReference,
        },
        include: {
          policy: true,
        },
      });

      // Publish claim paid event
      this.publishClaimPaid(updatedClaim);

      return updatedClaim;
    } catch (error) {
      console.error('Error processing payout:', error);
      throw new Error(`Failed to process payout: ${error.message}`);
    }
  }

  /**
   * Get user claims
   * 
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of claims
   */
  async getUserClaims(userId, filters = {}) {
    const where = { userId };

    if (filters.status) where.status = filters.status;
    if (filters.policyId) where.policyId = filters.policyId;

    const claims = await prisma.claim.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        policy: true,
      },
    });

    return claims;
  }

  /**
   * Get claim by ID
   * 
   * @param {string} claimId - Claim ID
   * @returns {Promise<Object>} Claim details
   */
  async getClaimById(claimId) {
    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: {
        policy: true,
        user: true,
      },
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    return claim;
  }

  /**
   * Generate insurance recommendation for asset
   * 
   * @param {Object} assetData - Asset information
   * @returns {Object} Insurance recommendation
   */
  generateInsuranceRecommendation(assetData) {
    const { assetType, assetValue, userId } = assetData;

    // Determine recommended policy type
    const policyTypeMap = {
      REAL_ESTATE: 'PROPERTY',
      VEHICLE: 'AUTO',
      INVESTMENT: 'ASSET',
      COLLECTIBLE: 'ASSET',
      BUSINESS: 'PROPERTY',
    };

    const recommendedPolicyType = policyTypeMap[assetType] || 'ASSET';

    // Calculate recommended coverage (typically 100% of asset value)
    const coverageAmount = assetValue;

    // Calculate estimated premium
    const premiumCalc = this.calculatePremium({
      policyType: recommendedPolicyType,
      coverageAmount,
      term: 1,
      premiumFrequency: 'MONTHLY',
    });

    return {
      userId,
      assetId: assetData.assetId,
      assetType,
      assetValue,
      recommendedPolicyType,
      coverageAmount,
      estimatedPremium: premiumCalc.finalPremium,
      annualPremium: premiumCalc.adjustedPremium,
      riskScore: premiumCalc.riskScore,
      recommendation: `We recommend ${recommendedPolicyType} insurance for this asset with coverage of ${coverageAmount} PI at ${premiumCalc.finalPremium} PI/month.`,
    };
  }

  // ==================== Event Publishing ====================

  /**
   * Publish policy created event
   * 
   * @param {Object} policy - Insurance policy
   */
  publishPolicyCreated(policy) {
    const eventBus = require('../../../lib/eventBus');
    eventBus.publish('insure.policy.created', {
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      userId: policy.userId,
      assetId: policy.assetId,
      policyType: policy.policyType,
      coverageAmount: policy.coverageAmount,
      premium: policy.premium,
      startDate: policy.startDate,
      endDate: policy.endDate,
    }, {
      userId: policy.userId,
    });
  }

  /**
   * Publish policy updated event
   * 
   * @param {Object} policy - Insurance policy
   */
  publishPolicyUpdated(policy) {
    const eventBus = require('../../../lib/eventBus');
    eventBus.publish('insure.policy.updated', {
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      userId: policy.userId,
      status: policy.status,
    }, {
      userId: policy.userId,
    });
  }

  /**
   * Publish claim submitted event
   * 
   * @param {Object} claim - Insurance claim
   */
  publishClaimSubmitted(claim) {
    const eventBus = require('../../../lib/eventBus');
    eventBus.publish('insure.claim.submitted', {
      claimId: claim.id,
      claimNumber: claim.claimNumber,
      policyId: claim.policyId,
      userId: claim.userId,
      claimAmount: claim.claimAmount,
      incidentDate: claim.incidentDate,
      incidentType: claim.incidentType,
    }, {
      userId: claim.userId,
    });
  }

  /**
   * Publish claim approved event
   * 
   * @param {Object} claim - Insurance claim
   */
  publishClaimApproved(claim) {
    const eventBus = require('../../../lib/eventBus');
    eventBus.publish('insure.claim.approved', {
      claimId: claim.id,
      claimNumber: claim.claimNumber,
      policyId: claim.policyId,
      userId: claim.userId,
      assetId: claim.policy.assetId,
      approvedAmount: claim.approvedAmount,
    }, {
      userId: claim.userId,
    });
  }

  /**
   * Publish claim rejected event
   * 
   * @param {Object} claim - Insurance claim
   * @param {string} reason - Rejection reason
   */
  publishClaimRejected(claim, reason) {
    const eventBus = require('../../../lib/eventBus');
    eventBus.publish('insure.claim.rejected', {
      claimId: claim.id,
      claimNumber: claim.claimNumber,
      policyId: claim.policyId,
      userId: claim.userId,
      assetId: claim.policy.assetId,
      rejectionReason: reason || 'Not specified',
    }, {
      userId: claim.userId,
    });
  }

  /**
   * Publish claim paid event
   * 
   * @param {Object} claim - Insurance claim
   */
  publishClaimPaid(claim) {
    const eventBus = require('../../../lib/eventBus');
    eventBus.publish('insure.claim.paid', {
      claimId: claim.id,
      claimNumber: claim.claimNumber,
      policyId: claim.policyId,
      userId: claim.userId,
      paidAmount: claim.paidAmount,
      paymentReference: claim.paymentReference,
    }, {
      userId: claim.userId,
    });
  }

  /**
   * Publish insurance recommendation event
   * 
   * @param {Object} recommendation - Insurance recommendation
   */
  publishInsuranceRecommendation(recommendation) {
    const eventBus = require('../../../lib/eventBus');
    eventBus.publish('insure.recommendation.generated', recommendation, {
      userId: recommendation.userId,
    });
  }
}

// Export singleton
module.exports = InsureService;
module.exports.default = new InsureService();
