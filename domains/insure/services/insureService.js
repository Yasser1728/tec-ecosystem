/**
 * Insure Service - Core Business Logic for Insurance Domain
 * 
 * This service handles all business logic related to insurance management,
 * including policies, claims, quotes, risk assessment, and premium calculations.
 * 
 * Security Note: This service uses cryptographically secure random number generation
 * from Node.js crypto module instead of Math.random() to ensure:
 * - Unpredictable policy numbers that cannot be guessed or enumerated
 * - Secure claim reference numbers to prevent unauthorized access
 * - Cryptographic strength for any security-sensitive operations
 * 
 * @module services/insureService
 */

const crypto = require('crypto');
// const { PrismaClient } = require('@prisma/client');
const eventBus = require('../../../lib/eventBus');

// NOTE: PrismaClient is not instantiated until database schema is implemented
// Uncomment when Prisma schema for insure domain is ready
// const prisma = new PrismaClient();

// Constants for risk assessment and premium calculation
const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY_HIGH',
};

const POLICY_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  SUSPENDED: 'SUSPENDED',
};

const CLAIM_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
};

const POLICY_TYPES = {
  LIFE: 'LIFE',
  HEALTH: 'HEALTH',
  PROPERTY: 'PROPERTY',
  AUTO: 'AUTO',
  TRAVEL: 'TRAVEL',
  TRANSACTION: 'TRANSACTION',
};

/**
 * Base risk factors for different policy types
 */
const BASE_RISK_FACTORS = {
  LIFE: 0.008,
  HEALTH: 0.012,
  PROPERTY: 0.006,
  AUTO: 0.010,
  TRAVEL: 0.005,
  TRANSACTION: 0.003,
};

class InsureService {
  /**
   * Generate a cryptographically secure policy number
   * 
   * Uses crypto.randomBytes instead of Math.random to ensure:
   * - Unpredictable numbers that cannot be guessed
   * - Protection against enumeration attacks
   * - Compliance with security best practices
   * 
   * @param {string} policyType - Type of policy (LIFE, HEALTH, etc.)
   * @returns {string} Secure policy number
   */
  generatePolicyNumber(policyType) {
    // Generate 6 random bytes and convert to hexadecimal
    // This provides 2^48 possible values (281 trillion combinations)
    const randomBytes = crypto.randomBytes(6);
    const randomHex = randomBytes.toString('hex').toUpperCase();
    
    // Format: INS-{TYPE}-{RANDOM_HEX}
    return `INS-${policyType}-${randomHex}`;
  }

  /**
   * Generate a cryptographically secure claim number
   * 
   * Uses crypto.randomInt for secure random number generation
   * instead of Math.random to prevent claim number prediction
   * 
   * @returns {string} Secure claim number
   */
  generateClaimNumber() {
    const year = new Date().getFullYear();
    
    // Generate a secure random number between 100000 and 999999
    // Using crypto.randomInt ensures cryptographic randomness
    const randomNum = crypto.randomInt(100000, 1000000);
    
    // Format: CLM-{YEAR}-{RANDOM_6_DIGITS}
    return `CLM-${year}-${randomNum}`;
  }

  /**
   * Generate a cryptographically secure policy ID
   * 
   * Uses crypto.randomBytes to generate unique internal policy IDs
   * 
   * @returns {string} Secure policy ID
   */
  generatePolicyId() {
    // Generate 8 random bytes for internal ID
    const randomBytes = crypto.randomBytes(8);
    const randomHex = randomBytes.toString('hex');
    
    return `policy_insure_${randomHex}`;
  }

  /**
   * Generate a cryptographically secure claim ID
   * 
   * Uses crypto.randomBytes to generate unique internal claim IDs
   * 
   * @returns {string} Secure claim ID
   */
  generateClaimId() {
    // Generate 8 random bytes for internal ID
    const randomBytes = crypto.randomBytes(8);
    const randomHex = randomBytes.toString('hex');
    
    return `claim_insure_${randomHex}`;
  }

  /**
   * Generate a cryptographically secure quote ID
   * 
   * @returns {string} Secure quote ID
   */
  generateQuoteId() {
    const timestamp = Date.now();
    // Generate 4 random bytes for additional entropy
    const randomBytes = crypto.randomBytes(4);
    const randomHex = randomBytes.toString('hex');
    
    return `quote_${timestamp}_${randomHex}`;
  }

  /**
   * Create a new insurance quote
   * 
   * @param {Object} data - Quote request data
   * @param {string} data.userId - User ID requesting quote
   * @param {string} data.type - Policy type (LIFE, HEALTH, PROPERTY, etc.)
   * @param {number} data.coverageAmount - Desired coverage amount
   * @param {number} data.term - Coverage term in years
   * @param {Object} [data.applicantInfo] - Applicant information for risk assessment
   * @param {string} [data.relatedId] - Related entity ID (property, vehicle, etc.)
   * @returns {Promise<Object>} Insurance quote
   */
  async createQuote(data) {
    try {
      this.validateQuoteData(data);

      const quoteId = this.generateQuoteId();
      const riskScore = await this.calculateRiskScore(data);
      const premium = this.calculatePremium(
        data.type,
        data.coverageAmount,
        data.term,
        riskScore
      );

      const quote = {
        id: quoteId,
        userId: data.userId,
        policyType: data.type,
        coverageAmount: data.coverageAmount,
        term: data.term,
        premium: premium.monthly,
        annualPremium: premium.annual,
        riskLevel: riskScore.level,
        riskScore: riskScore.score,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdAt: new Date(),
        relatedId: data.relatedId || null,
      };

      // Emit event for quote creation
      eventBus.publish('insure.quote.created', quote);

      return quote;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw new Error(`Failed to create insurance quote: ${error.message}`);
    }
  }

  /**
   * Purchase an insurance policy
   * 
   * @param {Object} data - Policy purchase data
   * @param {string} data.quoteId - Quote ID
   * @param {string} data.userId - User ID
   * @param {string} data.type - Policy type (LIFE, HEALTH, PROPERTY, etc.)
   * @param {number} data.coverageAmount - Coverage amount
   * @param {number} data.premium - Premium amount
   * @param {number} data.term - Coverage term in years
   * @param {Object} data.paymentInfo - Payment information
   * @param {Array} [data.beneficiaries] - Policy beneficiaries
   * @returns {Promise<Object>} Created policy
   */
  async purchasePolicy(data) {
    try {
      // In a real implementation, this would interact with Prisma
      // For now, we create a mock policy object

      const policyType = data.type || 'LIFE';
      const policyNumber = this.generatePolicyNumber(policyType);
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + (data.term || 1));

      const policy = {
        id: this.generatePolicyId(),
        userId: data.userId,
        policyNumber,
        type: policyType,
        product: data.productName || 'Standard Insurance',
        coverageAmount: data.coverageAmount,
        premium: data.premium,
        premiumFrequency: data.premiumFrequency || 'MONTHLY',
        term: data.term,
        startDate,
        endDate,
        beneficiaries: data.beneficiaries || [],
        status: POLICY_STATUS.ACTIVE,
        createdAt: new Date(),
      };

      // Emit event for policy creation
      eventBus.publish('insure.policy.created', policy);

      return policy;
    } catch (error) {
      console.error('Error purchasing policy:', error);
      throw new Error(`Failed to purchase policy: ${error.message}`);
    }
  }

  /**
   * Submit an insurance claim
   * 
   * @param {Object} data - Claim submission data
   * @param {string} data.policyId - Policy ID
   * @param {number} data.claimAmount - Claimed amount
   * @param {Date} data.incidentDate - Date of incident
   * @param {string} data.incidentType - Type of incident
   * @param {string} data.description - Claim description
   * @param {Array} [data.documents] - Supporting documents
   * @returns {Promise<Object>} Submitted claim
   */
  async submitClaim(data) {
    try {
      this.validateClaimData(data);

      const claimNumber = this.generateClaimNumber();

      const claim = {
        id: this.generateClaimId(),
        policyId: data.policyId,
        claimNumber,
        claimAmount: data.claimAmount,
        incidentDate: data.incidentDate,
        incidentType: data.incidentType,
        description: data.description,
        documents: data.documents || [],
        status: CLAIM_STATUS.SUBMITTED,
        submittedAt: new Date(),
      };

      // Emit event for claim submission
      eventBus.publish('insure.claim.submitted', claim);

      return claim;
    } catch (error) {
      console.error('Error submitting claim:', error);
      throw new Error(`Failed to submit claim: ${error.message}`);
    }
  }

  /**
   * Calculate risk score for insurance applicant
   * 
   * @param {Object} data - Applicant data
   * @returns {Promise<Object>} Risk assessment result
   */
  async calculateRiskScore(data) {
    try {
      // This is a simplified risk scoring algorithm
      // In production, this would use ML models and extensive data
      
      let baseScore = 0.5; // Start at medium risk
      
      // Adjust based on policy type
      if (data.type === POLICY_TYPES.LIFE) {
        const age = data.applicantInfo?.age || 35;
        baseScore += (age - 35) * 0.01; // Age factor
      } else if (data.type === POLICY_TYPES.PROPERTY) {
        const propertyAge = data.applicantInfo?.propertyAge || 10;
        baseScore += propertyAge * 0.005; // Property age factor
      }

      // Normalize score between 0 and 1
      const score = Math.max(0, Math.min(1, baseScore));

      // Determine risk level
      let level = RISK_LEVELS.LOW;
      if (score > 0.7) {
        level = RISK_LEVELS.VERY_HIGH;
      } else if (score > 0.5) {
        level = RISK_LEVELS.HIGH;
      } else if (score > 0.3) {
        level = RISK_LEVELS.MEDIUM;
      }

      return { score, level };
    } catch (error) {
      console.error('Error calculating risk score:', error);
      throw new Error(`Failed to calculate risk score: ${error.message}`);
    }
  }

  /**
   * Calculate insurance premium
   * 
   * @param {string} policyType - Type of policy
   * @param {number} coverageAmount - Coverage amount
   * @param {number} term - Coverage term in years
   * @param {Object} riskScore - Risk assessment result
   * @returns {Object} Premium calculation
   */
  calculatePremium(policyType, coverageAmount, term, riskScore) {
    try {
      const baseRiskFactor = BASE_RISK_FACTORS[policyType] || 0.01;
      const riskMultiplier = 1 + riskScore.score;

      // Calculate annual premium
      // Formula: (coverageAmount × baseRiskFactor × riskMultiplier) ÷ term
      const annualPremium =
        (coverageAmount * baseRiskFactor * riskMultiplier) / term;

      // Calculate monthly premium (with slight discount for annual payment)
      const monthlyPremium = (annualPremium / 12) * 1.05;

      return {
        monthly: Math.round(monthlyPremium * 100) / 100,
        annual: Math.round(annualPremium * 100) / 100,
        baseRiskFactor,
        riskMultiplier,
      };
    } catch (error) {
      console.error('Error calculating premium:', error);
      throw new Error(`Failed to calculate premium: ${error.message}`);
    }
  }

  /**
   * Validate quote request data
   * 
   * @param {Object} data - Quote data to validate
   * @throws {Error} If validation fails
   */
  validateQuoteData(data) {
    if (!data.userId) {
      throw new Error('User ID is required');
    }
    if (!data.type || !Object.values(POLICY_TYPES).includes(data.type)) {
      throw new Error('Valid policy type is required');
    }
    if (!data.coverageAmount || data.coverageAmount <= 0) {
      throw new Error('Coverage amount must be greater than 0');
    }
    if (!data.term || data.term <= 0) {
      throw new Error('Term must be greater than 0');
    }
  }

  /**
   * Validate claim submission data
   * 
   * @param {Object} data - Claim data to validate
   * @throws {Error} If validation fails
   */
  validateClaimData(data) {
    if (!data.policyId) {
      throw new Error('Policy ID is required');
    }
    if (!data.claimAmount || data.claimAmount <= 0) {
      throw new Error('Claim amount must be greater than 0');
    }
    if (!data.incidentDate) {
      throw new Error('Incident date is required');
    }
    if (!data.incidentType) {
      throw new Error('Incident type is required');
    }
    if (!data.description) {
      throw new Error('Description is required');
    }
  }

  /**
   * Get policy by ID
   * 
   * @param {string} policyId - Policy ID
   * @returns {Promise<Object>} Policy details
   */
  async getPolicyById(policyId) {
    try {
      // In a real implementation, this would query Prisma
      // For now, return a mock response
      throw new Error('Not implemented - requires Prisma schema');
    } catch (error) {
      console.error('Error fetching policy:', error);
      throw error;
    }
  }

  /**
   * Get claim by ID
   * 
   * @param {string} claimId - Claim ID
   * @returns {Promise<Object>} Claim details
   */
  async getClaimById(claimId) {
    try {
      // In a real implementation, this would query Prisma
      throw new Error('Not implemented - requires Prisma schema');
    } catch (error) {
      console.error('Error fetching claim:', error);
      throw error;
    }
  }

  /**
   * List user policies
   * 
   * @param {string} userId - User ID
   * @param {Object} [filters] - Filter options
   * @returns {Promise<Array>} List of policies
   */
  async listUserPolicies(userId, filters = {}) {
    try {
      // In a real implementation, this would query Prisma
      throw new Error('Not implemented - requires Prisma schema');
    } catch (error) {
      console.error('Error listing policies:', error);
      throw error;
    }
  }

  /**
   * List user claims
   * 
   * @param {string} userId - User ID
   * @param {Object} [filters] - Filter options
   * @returns {Promise<Array>} List of claims
   */
  async listUserClaims(userId, filters = {}) {
    try {
      // In a real implementation, this would query Prisma
      throw new Error('Not implemented - requires Prisma schema');
    } catch (error) {
      console.error('Error listing claims:', error);
      throw error;
    }
  }
}

// Export singleton instance
const insureService = new InsureService();

module.exports = insureService;
module.exports.InsureService = InsureService;
module.exports.POLICY_TYPES = POLICY_TYPES;
module.exports.POLICY_STATUS = POLICY_STATUS;
module.exports.CLAIM_STATUS = CLAIM_STATUS;
module.exports.RISK_LEVELS = RISK_LEVELS;
