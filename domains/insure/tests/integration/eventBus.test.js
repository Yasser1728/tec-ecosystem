/**
 * Integration Tests for Insure Event Bus Integration
 * 
 * @module domains/insure/tests/integration/eventBus.test
 */

const eventBus = require('../../../../lib/eventBus');
const integrationService = require('../../services/integrationService');
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

describe('Insure Event Bus Integration', () => {
  beforeAll(() => {
    // Initialize integration service
    integrationService.initialize();
    integrationService.subscribeInternalEvents();
  });

  afterAll(() => {
    // Cleanup subscriptions
    integrationService.cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    eventBus.clearHistory();
  });

  describe('Asset Creation Events', () => {
    it('should generate insurance recommendation when high-value asset is created', (done) => {
      const assetData = {
        userId: 'user_123',
        assetId: 'asset_456',
        assetType: 'REAL_ESTATE',
        value: 500000,
      };

      // Subscribe to recommendation event
      const unsubscribe = eventBus.subscribe(
        'insure.recommendation.generated',
        (eventData) => {
          expect(eventData.userId).toBe('user_123');
          expect(eventData.assetId).toBe('asset_456');
          expect(eventData.recommendedPolicyType).toBe('PROPERTY');
          expect(eventData.estimatedPremium).toBeGreaterThan(0);
          unsubscribe();
          done();
        }
      );

      // Publish asset created event
      eventBus.publish('assets.asset.created', assetData);
    });

    it('should not generate recommendation for low-value assets', (done) => {
      const assetData = {
        userId: 'user_123',
        assetId: 'asset_789',
        assetType: 'COLLECTIBLE',
        value: 500, // Below threshold
      };

      let recommendationReceived = false;

      const unsubscribe = eventBus.subscribe(
        'insure.recommendation.generated',
        () => {
          recommendationReceived = true;
        }
      );

      eventBus.publish('assets.asset.created', assetData);

      // Wait a bit to ensure no event is published
      setTimeout(() => {
        expect(recommendationReceived).toBe(false);
        unsubscribe();
        done();
      }, 100);
    });

    it('should publish notification event with recommendation', (done) => {
      const assetData = {
        userId: 'user_123',
        assetId: 'asset_999',
        assetType: 'VEHICLE',
        value: 30000,
      };

      const unsubscribe = eventBus.subscribe(
        'alert.notification.create',
        (eventData) => {
          expect(eventData.userId).toBe('user_123');
          expect(eventData.type).toBe('INSURANCE_RECOMMENDATION');
          expect(eventData.title).toContain('Insurance Recommendation');
          expect(eventData.data).toHaveProperty('assetId', 'asset_999');
          unsubscribe();
          done();
        }
      );

      eventBus.publish('assets.asset.created', assetData);
    });
  });

  describe('Property Purchase Events', () => {
    it('should offer property insurance when property is purchased', (done) => {
      const propertyData = {
        userId: 'user_123',
        propertyId: 'property_456',
        purchasePrice: 750000,
      };

      const unsubscribe = eventBus.subscribe(
        'alert.notification.create',
        (eventData) => {
          if (eventData.type === 'INSURANCE_REQUIRED') {
            expect(eventData.userId).toBe('user_123');
            expect(eventData.priority).toBe('HIGH');
            expect(eventData.data.propertyId).toBe('property_456');
            unsubscribe();
            done();
          }
        }
      );

      eventBus.publish('estate.property.purchased', propertyData);
    });

    it('should generate property insurance recommendation', (done) => {
      const propertyData = {
        userId: 'user_456',
        propertyId: 'property_789',
        purchasePrice: 1000000,
      };

      const unsubscribe = eventBus.subscribe(
        'insure.recommendation.generated',
        (eventData) => {
          expect(eventData.assetType).toBe('REAL_ESTATE');
          expect(eventData.recommendedPolicyType).toBe('PROPERTY');
          expect(eventData.coverageAmount).toBe(1000000);
          unsubscribe();
          done();
        }
      );

      eventBus.publish('estate.property.purchased', propertyData);
    });
  });

  describe('Commerce Order Events', () => {
    it('should offer transaction insurance for high-value orders', (done) => {
      const orderData = {
        userId: 'user_789',
        orderId: 'order_123',
        total: 10000,
      };

      const unsubscribe = eventBus.subscribe(
        'alert.notification.create',
        (eventData) => {
          if (eventData.type === 'TRANSACTION_INSURANCE_AVAILABLE') {
            expect(eventData.data.orderId).toBe('order_123');
            expect(eventData.data.orderTotal).toBe(10000);
            unsubscribe();
            done();
          }
        }
      );

      eventBus.publish('commerce.order.created', orderData);
    });

    it('should not offer transaction insurance for low-value orders', (done) => {
      const orderData = {
        userId: 'user_789',
        orderId: 'order_456',
        total: 1000, // Below threshold
      };

      let insuranceOffered = false;

      const unsubscribe = eventBus.subscribe(
        'alert.notification.create',
        (eventData) => {
          if (eventData.type === 'TRANSACTION_INSURANCE_AVAILABLE') {
            insuranceOffered = true;
          }
        }
      );

      eventBus.publish('commerce.order.created', orderData);

      setTimeout(() => {
        expect(insuranceOffered).toBe(false);
        unsubscribe();
        done();
      }, 100);
    });
  });

  describe('Claim Approval Events', () => {
    it('should notify Assets domain when claim is approved', (done) => {
      const claimData = {
        claimId: 'claim_123',
        claimNumber: 'CLM-2026-123',
        policyId: 'policy_456',
        userId: 'user_123',
        assetId: 'asset_789',
        approvedAmount: 5000,
      };

      const unsubscribe = eventBus.subscribe(
        'assets.insurance.claim.approved',
        (eventData) => {
          expect(eventData.assetId).toBe('asset_789');
          expect(eventData.claimId).toBe('claim_123');
          expect(eventData.approvedAmount).toBe(5000);
          unsubscribe();
          done();
        }
      );

      eventBus.publish('insure.claim.approved', claimData);
    });

    it('should request payment from NBF when claim is approved', (done) => {
      const claimData = {
        claimId: 'claim_456',
        claimNumber: 'CLM-2026-456',
        policyId: 'policy_789',
        userId: 'user_456',
        assetId: 'asset_123',
        approvedAmount: 10000,
      };

      const unsubscribe = eventBus.subscribe(
        'nbf.payment.request',
        (eventData) => {
          expect(eventData.userId).toBe('user_456');
          expect(eventData.amount).toBe(10000);
          expect(eventData.type).toBe('INSURANCE_CLAIM_PAYOUT');
          expect(eventData.claimId).toBe('claim_456');
          unsubscribe();
          done();
        }
      );

      eventBus.publish('insure.claim.approved', claimData);
    });
  });

  describe('Claim Rejection Events', () => {
    it('should notify Assets domain when claim is rejected', (done) => {
      const claimData = {
        claimId: 'claim_789',
        claimNumber: 'CLM-2026-789',
        policyId: 'policy_123',
        userId: 'user_789',
        assetId: 'asset_456',
        rejectionReason: 'Insufficient evidence',
      };

      const unsubscribe = eventBus.subscribe(
        'assets.insurance.claim.rejected',
        (eventData) => {
          expect(eventData.assetId).toBe('asset_456');
          expect(eventData.claimId).toBe('claim_789');
          expect(eventData.reason).toBe('Insufficient evidence');
          unsubscribe();
          done();
        }
      );

      eventBus.publish('insure.claim.rejected', claimData);
    });

    it('should send notification to user when claim is rejected', (done) => {
      const claimData = {
        claimId: 'claim_999',
        claimNumber: 'CLM-2026-999',
        policyId: 'policy_111',
        userId: 'user_999',
        assetId: 'asset_222',
        rejectionReason: 'Policy expired',
      };

      const unsubscribe = eventBus.subscribe(
        'alert.notification.create',
        (eventData) => {
          if (eventData.type === 'CLAIM_REJECTED') {
            expect(eventData.userId).toBe('user_999');
            expect(eventData.priority).toBe('HIGH');
            expect(eventData.data.claimNumber).toBe('CLM-2026-999');
            unsubscribe();
            done();
          }
        }
      );

      eventBus.publish('insure.claim.rejected', claimData);
    });
  });

  describe('Asset Update Events', () => {
    it('should check for coverage update when asset value changes significantly', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();

      // Mock existing policy
      mockPrisma.insurancePolicy.findMany.mockResolvedValue([
        {
          id: 'policy_123',
          policyNumber: 'INS-123',
          coverageAmount: 100000,
          assetId: 'asset_123',
        },
      ]);

      const assetUpdateData = {
        userId: 'user_123',
        assetId: 'asset_123',
        value: 150000, // 50% increase
      };

      const notificationReceived = new Promise((resolve) => {
        const unsubscribe = eventBus.subscribe(
          'alert.notification.create',
          (eventData) => {
            if (eventData.type === 'INSURANCE_UPDATE_NEEDED') {
              expect(eventData.data.currentCoverage).toBe(100000);
              expect(eventData.data.assetValue).toBe(150000);
              unsubscribe();
              resolve();
            }
          }
        );
      });

      eventBus.publish('assets.asset.updated', assetUpdateData);

      await notificationReceived;
    });
  });

  describe('Event History', () => {
    it('should record insurance events in event history', () => {
      const policyData = {
        policyId: 'policy_test',
        userId: 'user_test',
        policyType: 'LIFE',
      };

      eventBus.publish('insure.policy.created', policyData);

      const history = eventBus.getHistory({ eventType: 'insure.policy.created' });
      expect(history.length).toBeGreaterThan(0);
      
      const lastEvent = history[history.length - 1];
      expect(lastEvent.eventType).toBe('insure.policy.created');
      expect(lastEvent.eventData.policyId).toBe('policy_test');
    });

    it('should track multiple event types', () => {
      eventBus.publish('insure.policy.created', { policyId: 'p1' });
      eventBus.publish('insure.claim.submitted', { claimId: 'c1' });
      eventBus.publish('insure.claim.approved', { claimId: 'c1' });

      const policyEvents = eventBus.getHistory({ eventType: 'insure.policy.created' });
      const claimEvents = eventBus.getHistory({ eventType: 'insure.claim.submitted' });

      expect(policyEvents.length).toBeGreaterThan(0);
      expect(claimEvents.length).toBeGreaterThan(0);
    });
  });
});
