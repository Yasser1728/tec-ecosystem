/**
 * Insurance Service - Core Business Logic for Insurance Domain
 * 
 * This service handles all business logic related to insurance management,
 * including policy creation, premium calculations, claims processing, and risk assessments.
 * 
 * @module services/insureService
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Premium rate constants - Using fraction notation for precision and clarity
const PREMIUM_RATES = {
  PROPERTY: {
    // Standard property insurance: 1% of property value (1 per 100)
    BASE: 1 / 100,
    // High-risk property premium: 2% for properties in flood zones or high-crime areas (2 per 100)
    HIGH_RISK: 2 / 100,
  },
  VEHICLE: {
    // Standard vehicle insurance: 10% of vehicle value (10 per 100)
    BASE: 10 / 100,
    // Luxury vehicle premium: 30% for high-value vehicles above $100k (30 per 100)
    LUXURY: 30 / 100,
  },
  HEALTH: {
    // Base monthly health insurance premium in dollars
    BASE: 25,
    // Additional premium per family member in dollars
    FAMILY: 10,
  },
  TRAVEL: {
    // Standard travel insurance: 1% of trip cost (1 per 100)
    BASE: 1 / 100,
    // International travel premium: 2% for overseas trips (2 per 100)
    INTERNATIONAL: 2 / 100,
  },
  LIFE: {
    // Life insurance base rate: $0.10 per $1000 coverage (10 cents per 1000 = 10 per 100 per 1000)
    BASE_PER_1000: 10 / 100,
    // High-risk life insurance: $0.30 per $1000 for smokers/hazardous occupations (30 per 100 per 1000)
    HIGH_RISK: 30 / 100,
  }
};

// Risk assessment factors - Age and claims history impact on premiums
const RISK_FACTORS = {
  // Age-based risk adjustment: 1% increase per year over age 30 (1 per 100)
  AGE_MULTIPLIER: 1 / 100,
  // Claims history penalty: 2% increase per previous claim filed (2 per 100)
  CLAIMS_HISTORY_PENALTY: 2 / 100,
};

// Coverage limits - Minimum required coverage amounts in thousands of dollars
const COVERAGE_LIMITS = {
  // Minimum property coverage: $10,000
  MIN_PROPERTY: 10,
  // Minimum vehicle coverage: $25,000
  MIN_VEHICLE: 25,
};

class InsureService {
  /**
   * Create a new insurance policy
   * 
   * @param {Object} data - Policy creation data
   * @param {string} data.userId - User ID
   * @param {string} data.type - Policy type (PROPERTY, VEHICLE, HEALTH, TRAVEL, LIFE)
   * @param {number} data.coverageAmount - Coverage amount
   * @param {Object} [data.metadata] - Optional metadata
   * @returns {Promise<Object>} Created policy
   */
  async createPolicy(data) {
    try {
      // Validate required fields
      this.validatePolicyData(data);
      
      // Calculate premium
      const premium = await this.calculatePremium(data);
      
      // Generate policy number
      const policyNumber = this.generatePolicyNumber();
      
      // Create policy in database
      const policy = await prisma.insurancePolicy.create({
        data: {
          userId: data.userId,
          policyNumber: policyNumber,
          type: data.type,
          coverageAmount: data.coverageAmount,
          premium: premium,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: this.calculateEndDate(data.term || 12),
          metadata: data.metadata || {},
        },
      });
      
      return policy;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw error;
    }
  }

  /**
   * Calculate insurance premium based on policy type and risk factors
   * 
   * @param {Object} data - Policy data
   * @returns {Promise<number>} Calculated premium
   */
  async calculatePremium(data) {
    let basePremium = 0;
    
    switch (data.type) {
      case 'PROPERTY':
        if (data.riskLevel === 'HIGH') {
          basePremium = data.coverageAmount * PREMIUM_RATES.PROPERTY.HIGH_RISK;
        } else {
          basePremium = data.coverageAmount * PREMIUM_RATES.PROPERTY.BASE;
        }
        break;
        
      case 'VEHICLE':
        if (data.vehicleType === 'LUXURY') {
          basePremium = data.coverageAmount * PREMIUM_RATES.VEHICLE.LUXURY;
        } else {
          basePremium = data.coverageAmount * PREMIUM_RATES.VEHICLE.BASE;
        }
        break;
        
      case 'HEALTH':
        basePremium = PREMIUM_RATES.HEALTH.BASE;
        if (data.familyMembers) {
          basePremium += data.familyMembers * PREMIUM_RATES.HEALTH.FAMILY;
        }
        break;
        
      case 'TRAVEL':
        if (data.international) {
          basePremium = data.tripCost * PREMIUM_RATES.TRAVEL.INTERNATIONAL;
        } else {
          basePremium = data.tripCost * PREMIUM_RATES.TRAVEL.BASE;
        }
        break;
        
      case 'LIFE':
        if (data.riskLevel === 'HIGH') {
          basePremium = (data.coverageAmount / 1000) * PREMIUM_RATES.LIFE.HIGH_RISK;
        } else {
          basePremium = (data.coverageAmount / 1000) * PREMIUM_RATES.LIFE.BASE_PER_1000;
        }
        break;
        
      default:
        throw new Error('Invalid policy type');
    }
    
    // Apply risk adjustments
    const riskAdjustment = await this.calculateRiskAdjustment(data);
    const finalPremium = basePremium * (1 + riskAdjustment);
    
    return Math.round(finalPremium * 100) / 100;
  }

  /**
   * Calculate risk adjustment factor
   * 
   * @param {Object} data - Policy data
   * @returns {Promise<number>} Risk adjustment multiplier
   */
  async calculateRiskAdjustment(data) {
    let adjustment = 0;
    
    // Age factor
    if (data.age > 30) {
      const yearsOver30 = data.age - 30;
      adjustment += yearsOver30 * RISK_FACTORS.AGE_MULTIPLIER;
    }
    
    // Claims history
    if (data.previousClaims) {
      adjustment += data.previousClaims * RISK_FACTORS.CLAIMS_HISTORY_PENALTY;
    }
    
    return adjustment;
  }

  /**
   * Generate a unique policy number using cryptographically secure random number
   * 
   * @returns {string} Policy number
   */
  generatePolicyNumber() {
    const prefix = 'INS';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    // Use crypto.randomInt for secure random number generation (0 to 999999)
    const random = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
    
    return `${prefix}-${year}${month}-${random}`;
  }

  /**
   * Calculate policy end date
   * 
   * @param {number} termMonths - Term in months
   * @returns {Date} End date
   */
  calculateEndDate(termMonths) {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + termMonths);
    return endDate;
  }

  /**
   * Validate policy data
   * 
   * @param {Object} data - Policy data
   * @throws {Error} If validation fails
   */
  validatePolicyData(data) {
    if (!data.userId) {
      throw new Error('User ID is required');
    }
    if (!data.type) {
      throw new Error('Policy type is required');
    }
    if (!data.coverageAmount || data.coverageAmount <= 0) {
      throw new Error('Valid coverage amount is required');
    }
    
    // Type-specific validation
    if (data.type === 'PROPERTY' && data.coverageAmount < COVERAGE_LIMITS.MIN_PROPERTY * 1000) {
      throw new Error(`Minimum property coverage is $${COVERAGE_LIMITS.MIN_PROPERTY}k`);
    }
    if (data.type === 'VEHICLE' && data.coverageAmount < COVERAGE_LIMITS.MIN_VEHICLE * 1000) {
      throw new Error(`Minimum vehicle coverage is $${COVERAGE_LIMITS.MIN_VEHICLE}k`);
    }
  }

  /**
   * Create an insurance claim
   * 
   * @param {Object} data - Claim data
   * @returns {Promise<Object>} Created claim
   */
  async createClaim(data) {
    try {
      // Validate claim
      this.validateClaimData(data);
      
      // Generate claim number
      const claimNumber = this.generateClaimNumber();
      
      // Create claim
      const claim = await prisma.insuranceClaim.create({
        data: {
          policyId: data.policyId,
          claimNumber: claimNumber,
          type: data.type,
          amount: data.amount,
          description: data.description,
          status: 'SUBMITTED',
          submittedDate: new Date(),
          metadata: data.metadata || {},
        },
      });
      
      return claim;
    } catch (error) {
      console.error('Error creating claim:', error);
      throw error;
    }
  }

  /**
   * Generate a unique claim number using cryptographically secure random number
   * 
   * @returns {string} Claim number
   */
  generateClaimNumber() {
    const prefix = 'CLM';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    // Use crypto.randomInt for secure random number generation (0 to 99999)
    const random = crypto.randomInt(0, 100000).toString().padStart(5, '0');
    
    return `${prefix}-${year}${month}${day}-${random}`;
  }

  /**
   * Validate claim data
   * 
   * @param {Object} data - Claim data
   * @throws {Error} If validation fails
   */
  validateClaimData(data) {
    if (!data.policyId) {
      throw new Error('Policy ID is required');
    }
    if (!data.type) {
      throw new Error('Claim type is required');
    }
    if (!data.amount || data.amount <= 0) {
      throw new Error('Valid claim amount is required');
    }
  }

  /**
   * Process a claim and determine approval
   * 
   * @param {string} claimId - Claim ID
   * @returns {Promise<Object>} Updated claim
   */
  async processClaim(claimId) {
    try {
      // Get claim and policy
      const claim = await prisma.insuranceClaim.findUnique({
        where: { id: claimId },
        include: { policy: true },
      });
      
      if (!claim) {
        throw new Error('Claim not found');
      }
      
      // Auto-approve logic
      const shouldApprove = await this.evaluateClaimApproval(claim);
      
      // Update claim status
      const updatedClaim = await prisma.insuranceClaim.update({
        where: { id: claimId },
        data: {
          status: shouldApprove ? 'APPROVED' : 'UNDER_REVIEW',
          processedDate: new Date(),
        },
      });
      
      return updatedClaim;
    } catch (error) {
      console.error('Error processing claim:', error);
      throw error;
    }
  }

  /**
   * Evaluate whether a claim should be auto-approved
   * 
   * @param {Object} claim - Claim object
   * @returns {Promise<boolean>} Whether to approve
   */
  async evaluateClaimApproval(claim) {
    // Simple auto-approval logic
    // In production, this would be more sophisticated
    
    // Auto-approve claims less than 10% of total coverage (10 per 100)
    const claimRatio = claim.amount / claim.policy.coverageAmount;
    if (claimRatio < 10 / 100) {
      return true;
    }
    
    // Auto-approve small claims under $2,500 threshold
    if (claim.amount < 25 * 100) {
      return true;
    }
    
    return false;
  }
}

module.exports = new InsureService();
