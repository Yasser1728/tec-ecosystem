/**
 * Unit Tests for Insure Service
 * 
 * @module domains/insure/tests/unit/insureService.test
 */

const InsureService = require('../../services/insureService');

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    insurancePolicy: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    claim: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    premiumPayment: {
      createMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

// Mock Event Bus
jest.mock('../../../../lib/eventBus', () => ({
  publish: jest.fn(),
  subscribe: jest.fn(),
}));

describe('InsureService', () => {
  let service;
  let mockPrisma;

  beforeEach(() => {
    service = new InsureService();
    const { PrismaClient } = require('@prisma/client');
    mockPrisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('Policy Number Generation', () => {
    it('should generate unique policy numbers', () => {
      const policyNumber1 = service.generatePolicyNumber();
      const policyNumber2 = service.generatePolicyNumber();

      expect(policyNumber1).toMatch(/^INS-\d+-\d{4}$/);
      expect(policyNumber2).toMatch(/^INS-\d+-\d{4}$/);
      expect(policyNumber1).not.toBe(policyNumber2);
    });
  });

  describe('Claim Number Generation', () => {
    it('should generate unique claim numbers', () => {
      const claimNumber1 = service.generateClaimNumber();
      const claimNumber2 = service.generateClaimNumber();

      expect(claimNumber1).toMatch(/^CLM-\d{4}-\d+-\d{3}$/);
      expect(claimNumber2).toMatch(/^CLM-\d{4}-\d+-\d{3}$/);
      expect(claimNumber1).not.toBe(claimNumber2);
    });
  });

  describe('Premium Calculation', () => {
    it('should calculate premium correctly for LIFE insurance', () => {
      const result = service.calculatePremium({
        policyType: 'LIFE',
        coverageAmount: 100000,
        term: 10,
        premiumFrequency: 'MONTHLY',
      });

      expect(result).toHaveProperty('basePremium');
      expect(result).toHaveProperty('adjustedPremium');
      expect(result).toHaveProperty('finalPremium');
      expect(result.finalPremium).toBeGreaterThan(0);
    });

    it('should apply term discount for long-term policies', () => {
      const shortTerm = service.calculatePremium({
        policyType: 'ASSET',
        coverageAmount: 50000,
        term: 3,
        premiumFrequency: 'MONTHLY',
      });

      const longTerm = service.calculatePremium({
        policyType: 'ASSET',
        coverageAmount: 50000,
        term: 15,
        premiumFrequency: 'MONTHLY',
      });

      expect(longTerm.finalPremium).toBeLessThan(shortTerm.finalPremium);
    });

    it('should adjust premium based on frequency', () => {
      const monthly = service.calculatePremium({
        policyType: 'PROPERTY',
        coverageAmount: 200000,
        term: 5,
        premiumFrequency: 'MONTHLY',
      });

      const annual = service.calculatePremium({
        policyType: 'PROPERTY',
        coverageAmount: 200000,
        term: 5,
        premiumFrequency: 'ANNUAL',
      });

      // Annual should be approximately 12x monthly
      expect(annual.finalPremium).toBeCloseTo(monthly.finalPremium * 12, 0);
    });
  });

  describe('Risk Assessment', () => {
    it('should assess risk correctly with no additional factors', () => {
      const risk = service.assessRisk('LIFE', {});

      expect(risk).toHaveProperty('riskScore');
      expect(risk).toHaveProperty('riskLevel');
      expect(risk).toHaveProperty('recommendations');
      expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(risk.riskLevel);
    });

    it('should increase risk score with high-risk factors', () => {
      const lowRisk = service.assessRisk('LIFE', {});
      const highRisk = service.assessRisk('LIFE', {
        assetAge: 15,
        location: 'HIGH_RISK',
        claimHistory: 3,
      });

      expect(highRisk.riskScore).toBeGreaterThan(lowRisk.riskScore);
    });

    it('should provide recommendations based on risk level', () => {
      const lowRisk = service.assessRisk('LIFE', {});
      const highRisk = service.assessRisk('AUTO', {
        assetAge: 20,
        location: 'HIGH_RISK',
        claimHistory: 5,
      });

      expect(lowRisk.recommendations).toBeInstanceOf(Array);
      expect(highRisk.recommendations).toBeInstanceOf(Array);
      expect(highRisk.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Policy Validation', () => {
    it('should pass validation for valid policy data', () => {
      const validData = {
        userId: 'user_123',
        policyType: 'LIFE',
        productName: 'Term Life Insurance',
        coverageAmount: 100000,
        premium: 150,
        startDate: new Date(),
        term: 10,
      };

      expect(() => service.validatePolicyData(validData)).not.toThrow();
    });

    it('should throw error for missing userId', () => {
      const invalidData = {
        policyType: 'LIFE',
        productName: 'Term Life',
        coverageAmount: 100000,
        premium: 150,
        startDate: new Date(),
        term: 10,
      };

      expect(() => service.validatePolicyData(invalidData)).toThrow('User ID is required');
    });

    it('should throw error for invalid coverage amount', () => {
      const invalidData = {
        userId: 'user_123',
        policyType: 'LIFE',
        productName: 'Term Life',
        coverageAmount: -100,
        premium: 150,
        startDate: new Date(),
        term: 10,
      };

      expect(() => service.validatePolicyData(invalidData)).toThrow('Coverage amount must be positive');
    });

    it('should throw error for invalid premium', () => {
      const invalidData = {
        userId: 'user_123',
        policyType: 'LIFE',
        productName: 'Term Life',
        coverageAmount: 100000,
        premium: 0,
        startDate: new Date(),
        term: 10,
      };

      expect(() => service.validatePolicyData(invalidData)).toThrow('Premium must be positive');
    });

    it('should throw error for invalid term', () => {
      const invalidData = {
        userId: 'user_123',
        policyType: 'LIFE',
        productName: 'Term Life',
        coverageAmount: 100000,
        premium: 150,
        startDate: new Date(),
        term: -5,
      };

      expect(() => service.validatePolicyData(invalidData)).toThrow('Term must be positive');
    });
  });

  describe('Claim Validation', () => {
    it('should pass validation for valid claim data', () => {
      const validData = {
        policyId: 'policy_123',
        userId: 'user_123',
        claimAmount: 5000,
        incidentDate: new Date(),
        incidentType: 'ACCIDENT',
        description: 'Vehicle accident on highway',
      };

      expect(() => service.validateClaimData(validData)).not.toThrow();
    });

    it('should throw error for missing policyId', () => {
      const invalidData = {
        userId: 'user_123',
        claimAmount: 5000,
        incidentDate: new Date(),
        incidentType: 'ACCIDENT',
        description: 'Test',
      };

      expect(() => service.validateClaimData(invalidData)).toThrow('Policy ID is required');
    });

    it('should throw error for invalid claim amount', () => {
      const invalidData = {
        policyId: 'policy_123',
        userId: 'user_123',
        claimAmount: -1000,
        incidentDate: new Date(),
        incidentType: 'ACCIDENT',
        description: 'Test',
      };

      expect(() => service.validateClaimData(invalidData)).toThrow('Claim amount must be positive');
    });
  });

  describe('Insurance Recommendation Generation', () => {
    it('should generate recommendation for real estate asset', () => {
      const recommendation = service.generateInsuranceRecommendation({
        userId: 'user_123',
        assetId: 'asset_456',
        assetType: 'REAL_ESTATE',
        assetValue: 500000,
      });

      expect(recommendation).toHaveProperty('userId', 'user_123');
      expect(recommendation).toHaveProperty('assetId', 'asset_456');
      expect(recommendation).toHaveProperty('recommendedPolicyType', 'PROPERTY');
      expect(recommendation).toHaveProperty('coverageAmount', 500000);
      expect(recommendation).toHaveProperty('estimatedPremium');
      expect(recommendation.estimatedPremium).toBeGreaterThan(0);
    });

    it('should generate recommendation for vehicle asset', () => {
      const recommendation = service.generateInsuranceRecommendation({
        userId: 'user_123',
        assetId: 'asset_789',
        assetType: 'VEHICLE',
        assetValue: 30000,
      });

      expect(recommendation.recommendedPolicyType).toBe('AUTO');
      expect(recommendation.coverageAmount).toBe(30000);
    });

    it('should recommend ASSET policy for unknown asset types', () => {
      const recommendation = service.generateInsuranceRecommendation({
        userId: 'user_123',
        assetId: 'asset_xyz',
        assetType: 'UNKNOWN_TYPE',
        assetValue: 10000,
      });

      expect(recommendation.recommendedPolicyType).toBe('ASSET');
    });

    it('should include risk score in recommendation', () => {
      const recommendation = service.generateInsuranceRecommendation({
        userId: 'user_123',
        assetId: 'asset_456',
        assetType: 'INVESTMENT',
        assetValue: 100000,
      });

      expect(recommendation).toHaveProperty('riskScore');
      expect(typeof recommendation.riskScore).toBe('number');
    });
  });

  describe('Create Policy', () => {
    it('should create policy successfully with valid data', async () => {
      const policyData = {
        userId: 'user_123',
        policyType: 'LIFE',
        productName: 'Term Life Insurance',
        coverageAmount: 100000,
        premium: 150,
        premiumFrequency: 'MONTHLY',
        startDate: new Date('2026-01-01'),
        term: 10,
      };

      const mockPolicy = {
        id: 'policy_123',
        policyNumber: 'INS-123456-7890',
        ...policyData,
        endDate: new Date('2036-01-01'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.insurancePolicy.create.mockResolvedValue(mockPolicy);
      mockPrisma.premiumPayment.createMany.mockResolvedValue({ count: 12 });

      const result = await service.createPolicy(policyData);

      expect(mockPrisma.insurancePolicy.create).toHaveBeenCalled();
      expect(mockPrisma.premiumPayment.createMany).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'policy_123');
      expect(result).toHaveProperty('policyNumber');
    });

    it('should throw error for invalid policy data', async () => {
      const invalidData = {
        policyType: 'LIFE',
        coverageAmount: 100000,
        // Missing required fields
      };

      await expect(service.createPolicy(invalidData)).rejects.toThrow();
    });
  });

  describe('Submit Claim', () => {
    it('should submit claim successfully for active policy', async () => {
      const claimData = {
        policyId: 'policy_123',
        userId: 'user_123',
        claimAmount: 5000,
        incidentDate: new Date(),
        incidentType: 'ACCIDENT',
        description: 'Test accident',
      };

      const mockPolicy = {
        id: 'policy_123',
        status: 'ACTIVE',
        coverageAmount: 100000,
      };

      const mockClaim = {
        id: 'claim_123',
        claimNumber: 'CLM-2026-123',
        ...claimData,
        status: 'SUBMITTED',
        createdAt: new Date(),
      };

      mockPrisma.insurancePolicy.findUnique.mockResolvedValue(mockPolicy);
      mockPrisma.claim.create.mockResolvedValue({ ...mockClaim, policy: mockPolicy });

      const result = await service.submitClaim(claimData);

      expect(mockPrisma.claim.create).toHaveBeenCalled();
      expect(result).toHaveProperty('claimNumber');
      expect(result.status).toBe('SUBMITTED');
    });

    it('should reject claim if policy is not active', async () => {
      const claimData = {
        policyId: 'policy_123',
        userId: 'user_123',
        claimAmount: 5000,
        incidentDate: new Date(),
        incidentType: 'ACCIDENT',
        description: 'Test',
      };

      mockPrisma.insurancePolicy.findUnique.mockResolvedValue({
        id: 'policy_123',
        status: 'EXPIRED',
        coverageAmount: 100000,
      });

      await expect(service.submitClaim(claimData)).rejects.toThrow('Policy is not active');
    });

    it('should reject claim exceeding coverage amount', async () => {
      const claimData = {
        policyId: 'policy_123',
        userId: 'user_123',
        claimAmount: 150000,
        incidentDate: new Date(),
        incidentType: 'ACCIDENT',
        description: 'Test',
      };

      mockPrisma.insurancePolicy.findUnique.mockResolvedValue({
        id: 'policy_123',
        status: 'ACTIVE',
        coverageAmount: 100000,
      });

      await expect(service.submitClaim(claimData)).rejects.toThrow('Claim amount exceeds coverage amount');
    });
  });

  describe('Review Claim', () => {
    it('should approve claim successfully', async () => {
      const mockClaim = {
        id: 'claim_123',
        claimNumber: 'CLM-2026-123',
        status: 'SUBMITTED',
        claimAmount: 5000,
        policy: {
          id: 'policy_123',
          coverageAmount: 100000,
          assetId: 'asset_123',
        },
      };

      const updatedClaim = {
        ...mockClaim,
        status: 'APPROVED',
        approvedAmount: 5000,
        reviewedAt: new Date(),
      };

      mockPrisma.claim.findUnique.mockResolvedValue(mockClaim);
      mockPrisma.claim.update.mockResolvedValue(updatedClaim);

      const result = await service.reviewClaim('claim_123', {
        status: 'APPROVED',
        approvedAmount: 5000,
        reviewNotes: 'Claim approved',
        reviewedBy: 'admin_123',
      });

      expect(result.status).toBe('APPROVED');
      expect(result.approvedAmount).toBe(5000);
    });

    it('should reject claim successfully', async () => {
      const mockClaim = {
        id: 'claim_123',
        status: 'UNDER_REVIEW',
        policy: {
          id: 'policy_123',
          coverageAmount: 100000,
          assetId: 'asset_123',
        },
      };

      const updatedClaim = {
        ...mockClaim,
        status: 'REJECTED',
        reviewNotes: 'Insufficient evidence',
      };

      mockPrisma.claim.findUnique.mockResolvedValue(mockClaim);
      mockPrisma.claim.update.mockResolvedValue(updatedClaim);

      const result = await service.reviewClaim('claim_123', {
        status: 'REJECTED',
        reviewNotes: 'Insufficient evidence',
        reviewedBy: 'admin_123',
      });

      expect(result.status).toBe('REJECTED');
    });

    it('should reject review with invalid status', async () => {
      await expect(service.reviewClaim('claim_123', {
        status: 'INVALID_STATUS',
      })).rejects.toThrow('Invalid review status');
    });
  });
});
