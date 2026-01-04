/**
 * Commerce Integration Service - Integration Tests
 * 
 * Tests for event-driven integration flows
 */

const eventBus = require('../../../../../lib/eventBus');
const commerceIntegrationService = require('../../../services/integrationService');

describe('Commerce Integration Service', () => {
  beforeEach(() => {
    // Initialize integration service
    commerceIntegrationService.initialize();
  });
  
  afterEach(() => {
    // Cleanup subscriptions
    commerceIntegrationService.cleanup();
  });
  
  describe('Event Publishing', () => {
    test('should publish product created event', (done) => {
      const product = {
        id: 'prod_test_123',
        sellerId: 'biz_seller_123',
        name: 'Test Product',
        category: 'ELECTRONICS',
        unitPrice: 100,
        currency: 'PI',
        trackAsAsset: true,
        requiresInsurance: false,
      };
      
      const userId = 'user_123';
      
      // Subscribe to event
      const unsubscribe = eventBus.subscribe(
        'commerce.product.created',
        (eventData, metadata) => {
          expect(eventData.productId).toBe('prod_test_123');
          expect(eventData.name).toBe('Test Product');
          expect(eventData.trackAsAsset).toBe(true);
          expect(metadata.userId).toBe(userId);
          
          unsubscribe();
          done();
        }
      );
      
      // Publish event
      commerceIntegrationService.publishProductCreated(product, userId);
    });
    
    test('should publish order created event', (done) => {
      const order = {
        id: 'ord_test_123',
        orderNumber: 'PO-TEST-123',
        buyerId: 'biz_buyer_123',
        sellerId: 'biz_seller_123',
        items: [
          {
            productId: 'prod_123',
            productName: 'Test Product',
            quantity: 10,
            unitPrice: 100,
            trackAsAsset: false,
            insuranceRequired: false,
          }
        ],
        totalAmount: 1000,
        currency: 'PI',
      };
      
      const userId = 'user_123';
      
      // Subscribe to event
      const unsubscribe = eventBus.subscribe(
        'commerce.order.created',
        (eventData, metadata) => {
          expect(eventData.orderId).toBe('ord_test_123');
          expect(eventData.orderNumber).toBe('PO-TEST-123');
          expect(eventData.items).toHaveLength(1);
          expect(metadata.userId).toBe(userId);
          
          unsubscribe();
          done();
        }
      );
      
      // Publish event
      commerceIntegrationService.publishOrderCreated(order, userId);
    });
    
    test('should publish order delivered event with asset tracking', (done) => {
      const order = {
        id: 'ord_test_123',
        orderNumber: 'PO-TEST-123',
        buyerId: 'biz_buyer_123',
        items: [
          {
            id: 'item_123',
            productId: 'prod_123',
            productName: 'High-Value Equipment',
            quantity: 1,
            unitPrice: 10000,
            subtotal: 10000,
            trackAsAsset: true,        // This should trigger asset tracking
            insuranceRequired: false,
          }
        ],
        deliveredAt: new Date(),
        totalAmount: 10000,
        currency: 'PI',
        shippingAddress: {
          street: '123 Test St',
          city: 'Dubai',
          country: 'UAE',
        },
      };
      
      const userId = 'user_123';
      let assetTrackingEventReceived = false;
      
      // Subscribe to asset tracking request
      const unsubAssetTracking = eventBus.subscribe(
        'commerce.asset.tracking.requested',
        (eventData, metadata) => {
          expect(eventData.orderId).toBe('ord_test_123');
          expect(eventData.productName).toBe('High-Value Equipment');
          expect(eventData.totalValue).toBe(10000);
          expect(eventData.sourceDomain).toBe('commerce');
          expect(metadata.targetDomain).toBe('assets');
          
          assetTrackingEventReceived = true;
          unsubAssetTracking();
          
          if (assetTrackingEventReceived) {
            done();
          }
        }
      );
      
      // Publish order delivered event
      commerceIntegrationService.publishOrderDelivered(order, userId);
    });
    
    test('should publish order delivered event with insurance recommendation', (done) => {
      const order = {
        id: 'ord_test_456',
        orderNumber: 'PO-TEST-456',
        buyerId: 'biz_buyer_456',
        items: [
          {
            id: 'item_456',
            productId: 'prod_456',
            productName: 'Expensive Machinery',
            quantity: 1,
            unitPrice: 50000,
            subtotal: 50000,
            trackAsAsset: false,
            insuranceRequired: true,    // This should trigger insurance recommendation
          }
        ],
        deliveredAt: new Date(),
        totalAmount: 50000,
        currency: 'PI',
        shippingAddress: {
          street: '456 Test Ave',
          city: 'Abu Dhabi',
          country: 'UAE',
        },
      };
      
      const userId = 'user_456';
      
      // Subscribe to insurance recommendation
      const unsubInsurance = eventBus.subscribe(
        'commerce.insurance.recommended',
        (eventData, metadata) => {
          expect(eventData.orderId).toBe('ord_test_456');
          expect(eventData.productName).toBe('Expensive Machinery');
          expect(eventData.productValue).toBe(50000);
          expect(eventData.coverageAmount).toBe(50000);
          expect(eventData.sourceDomain).toBe('commerce');
          expect(metadata.targetDomain).toBe('insure');
          
          unsubInsurance();
          done();
        }
      );
      
      // Publish order delivered event
      commerceIntegrationService.publishOrderDelivered(order, userId);
    });
    
    test('should publish both asset tracking and insurance when both flags are true', (done) => {
      const order = {
        id: 'ord_test_789',
        orderNumber: 'PO-TEST-789',
        buyerId: 'biz_buyer_789',
        items: [
          {
            id: 'item_789',
            productId: 'prod_789',
            productName: 'Premium Equipment',
            quantity: 5,
            unitPrice: 5000,
            subtotal: 25000,
            trackAsAsset: true,         // Both flags true
            insuranceRequired: true,    // Both flags true
          }
        ],
        deliveredAt: new Date(),
        totalAmount: 25000,
        currency: 'PI',
        shippingAddress: {
          street: '789 Test Blvd',
          city: 'Sharjah',
          country: 'UAE',
        },
      };
      
      const userId = 'user_789';
      let assetTrackingReceived = false;
      let insuranceReceived = false;
      
      // Subscribe to asset tracking
      const unsubAsset = eventBus.subscribe(
        'commerce.asset.tracking.requested',
        () => {
          assetTrackingReceived = true;
          unsubAsset();
          checkCompletion();
        }
      );
      
      // Subscribe to insurance recommendation
      const unsubInsurance = eventBus.subscribe(
        'commerce.insurance.recommended',
        () => {
          insuranceReceived = true;
          unsubInsurance();
          checkCompletion();
        }
      );
      
      function checkCompletion() {
        if (assetTrackingReceived && insuranceReceived) {
          done();
        }
      }
      
      // Publish order delivered event
      commerceIntegrationService.publishOrderDelivered(order, userId);
    });
  });
  
  describe('Event Subscription', () => {
    test('should handle asset valuation update from Assets domain', (done) => {
      const eventData = {
        assetId: 'asset_123',
        currentValue: 12000,
        previousValue: 10000,
        sourceDomain: 'commerce',
      };
      
      const metadata = {
        correlationId: 'test_correlation_123',
        userId: 'user_123',
      };
      
      // Mock the handler
      commerceIntegrationService.handleAssetValuationUpdate = jest.fn().mockResolvedValue(true);
      
      // Publish event from Assets domain
      eventBus.publish('assets.valuation.updated', eventData, metadata);
      
      // Give time for async processing
      setTimeout(() => {
        expect(commerceIntegrationService.handleAssetValuationUpdate).toHaveBeenCalled();
        done();
      }, 100);
    });
    
    test('should handle insurance policy created from Insure domain', (done) => {
      const eventData = {
        policyId: 'pol_123',
        sourceItemId: 'item_123',
        sourceDomain: 'commerce',
        coverageAmount: 10000,
      };
      
      const metadata = {
        correlationId: 'test_correlation_456',
        userId: 'user_456',
      };
      
      // Mock the handler
      commerceIntegrationService.handleInsurancePolicyCreated = jest.fn().mockResolvedValue(true);
      
      // Publish event from Insure domain
      eventBus.publish('insure.policy.created', eventData, metadata);
      
      // Give time for async processing
      setTimeout(() => {
        expect(commerceIntegrationService.handleInsurancePolicyCreated).toHaveBeenCalled();
        done();
      }, 100);
    });
  });
  
  describe('Correlation ID Tracking', () => {
    test('should maintain correlation ID across multiple events', (done) => {
      const order = {
        id: 'ord_correlation_test',
        orderNumber: 'PO-CORR-TEST',
        buyerId: 'biz_buyer_corr',
        items: [
          {
            id: 'item_corr',
            productId: 'prod_corr',
            productName: 'Correlation Test Product',
            quantity: 1,
            unitPrice: 1000,
            subtotal: 1000,
            trackAsAsset: true,
            insuranceRequired: true,
          }
        ],
        deliveredAt: new Date(),
        totalAmount: 1000,
        currency: 'PI',
        shippingAddress: {},
      };
      
      const userId = 'user_corr';
      const correlationId = 'ord_correlation_test';
      
      let assetMetadata;
      let insuranceMetadata;
      
      // Subscribe to both events
      const unsubAsset = eventBus.subscribe(
        'commerce.asset.tracking.requested',
        (eventData, metadata) => {
          assetMetadata = metadata;
          unsubAsset();
          checkCompletion();
        }
      );
      
      const unsubInsurance = eventBus.subscribe(
        'commerce.insurance.recommended',
        (eventData, metadata) => {
          insuranceMetadata = metadata;
          unsubInsurance();
          checkCompletion();
        }
      );
      
      function checkCompletion() {
        if (assetMetadata && insuranceMetadata) {
          // Both should have the same correlation ID
          expect(assetMetadata.correlationId).toBe(correlationId);
          expect(insuranceMetadata.correlationId).toBe(correlationId);
          done();
        }
      }
      
      // Publish order delivered event with correlation ID
      commerceIntegrationService.publishOrderDelivered(order, userId, { correlationId });
    });
  });
});
