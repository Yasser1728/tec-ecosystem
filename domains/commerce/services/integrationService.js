/**
 * Commerce Integration Service
 * 
 * Handles all cross-domain integrations for the Commerce domain using the Event Bus.
 * Publishes events when commerce transactions occur and listens to events from other domains.
 * 
 * Key integrations:
 * - Assets: Track valuable purchased items as assets
 * - Insure: Recommend/create insurance for high-value purchases
 * - FundX: Track investment-related commerce activities
 * 
 * @module domains/commerce/services/integrationService
 */

const eventBus = require('../../../lib/eventBus');
const CommerceService = require('./commerceService');

class CommerceIntegrationService {
  constructor() {
    this.commerceService = new CommerceService();
    this.subscribers = [];
  }

  /**
   * Initialize all event subscriptions
   * Sets up listeners for events from other domains
   */
  initialize() {
    console.log('[CommerceIntegration] Initializing cross-domain event subscriptions...');

    // Subscribe to Assets events (asset price updates, valuations)
    this.subscribeAssetsEvents();

    // Subscribe to Insure events (policy created, claim processed)
    this.subscribeInsureEvents();

    // Subscribe to FundX events (investment matured, returns)
    this.subscribeFundXEvents();

    console.log('[CommerceIntegration] All subscriptions initialized');
  }

  /**
   * Subscribe to Assets domain events
   */
  subscribeAssetsEvents() {
    // Listen for asset valuation updates
    const unsubAssetValuation = eventBus.subscribe(
      'assets.valuation.updated',
      async (eventData, metadata) => {
        console.log('[CommerceIntegration] Received assets.valuation.updated event');
        try {
          // If asset was from commerce, update product value tracking
          if (eventData.sourceDomain === 'commerce') {
            await this.handleAssetValuationUpdate(eventData, metadata);
          }
        } catch (error) {
          console.error('[CommerceIntegration] Error handling asset valuation:', error);
          // TODO: Implement retry mechanism with exponential backoff for critical integrations
          // For production, consider using a queue-based retry system for resilience
        }
      },
      { domain: 'commerce', description: 'Handle asset valuation updates' }
    );

    this.subscribers.push(unsubAssetValuation);
  }

  /**
   * Subscribe to Insure domain events
   */
  subscribeInsureEvents() {
    // Listen for insurance policy created
    const unsubPolicyCreated = eventBus.subscribe(
      'insure.policy.created',
      async (eventData, metadata) => {
        console.log('[CommerceIntegration] Received insure.policy.created event');
        try {
          // Link insurance policy to order item if it was from commerce
          if (eventData.sourceDomain === 'commerce') {
            await this.handleInsurancePolicyCreated(eventData, metadata);
          }
        } catch (error) {
          console.error('[CommerceIntegration] Error handling insurance policy:', error);
        }
      },
      { domain: 'commerce', description: 'Handle insurance policy creation' }
    );

    this.subscribers.push(unsubPolicyCreated);
  }

  /**
   * Subscribe to FundX domain events
   */
  subscribeFundXEvents() {
    // Listen for investment returns
    const unsubInvestmentReturns = eventBus.subscribe(
      'fundx.investment.returns',
      async (eventData, metadata) => {
        console.log('[CommerceIntegration] Received fundx.investment.returns event');
        try {
          // Could trigger special offers or notifications for successful investors
          await this.handleInvestmentReturns(eventData, metadata);
        } catch (error) {
          console.error('[CommerceIntegration] Error handling investment returns:', error);
        }
      },
      { domain: 'commerce', description: 'Handle investment returns notifications' }
    );

    this.subscribers.push(unsubInvestmentReturns);
  }

  // ==================== EVENT PUBLISHERS ====================

  /**
   * Publish product created event
   * 
   * @param {Object} product - Product object
   * @param {string} userId - User ID
   * @param {Object} metadata - Event metadata
   */
  publishProductCreated(product, userId, metadata = {}) {
    const eventData = {
      productId: product.id,
      sellerId: product.sellerId,
      name: product.name,
      category: product.category,
      unitPrice: product.unitPrice,
      currency: product.currency,
      trackAsAsset: product.trackAsAsset,
      requiresInsurance: product.requiresInsurance,
      timestamp: new Date().toISOString(),
    };

    eventBus.publish('commerce.product.created', eventData, {
      correlationId: metadata.correlationId || `prod_${product.id}`,
      userId: userId,
      timestamp: new Date().toISOString(),
    });

    console.log(`[CommerceIntegration] Published commerce.product.created for ${product.id}`);
  }

  /**
   * Publish order created event
   * 
   * @param {Object} order - Order object
   * @param {string} userId - User ID
   * @param {Object} metadata - Event metadata
   */
  publishOrderCreated(order, userId, metadata = {}) {
    const eventData = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName || 'Product',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        trackAsAsset: item.trackAsAsset,
        insuranceRequired: item.insuranceRequired,
      })),
      totalAmount: order.totalAmount,
      currency: order.currency,
      timestamp: new Date().toISOString(),
    };

    eventBus.publish('commerce.order.created', eventData, {
      correlationId: metadata.correlationId || `ord_${order.id}`,
      userId: userId,
      timestamp: new Date().toISOString(),
    });

    console.log(`[CommerceIntegration] Published commerce.order.created for ${order.orderNumber}`);
  }

  /**
   * Publish order delivered event
   * This is the key event that triggers asset tracking and insurance recommendations
   * 
   * @param {Object} order - Order object
   * @param {string} userId - User ID
   * @param {Object} metadata - Event metadata
   */
  publishOrderDelivered(order, userId, metadata = {}) {
    const eventData = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      buyerId: order.buyerId,
      items: order.items.map(item => ({
        itemId: item.id,
        productId: item.productId,
        productName: item.productName || 'Product',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalValue: item.subtotal,
        trackAsAsset: item.trackAsAsset,
        insuranceRequired: item.insuranceRequired,
      })),
      deliveredAt: order.deliveredAt,
      totalValue: order.totalAmount,
    };

    const eventMetadata = {
      correlationId: metadata.correlationId || `ord_${order.id}`,
      userId: userId,
      timestamp: new Date().toISOString(),
    };

    // Publish main delivery event
    eventBus.publish('commerce.order.delivered', eventData, eventMetadata);

    // For each item that should be tracked as asset, publish specific event
    order.items.forEach(item => {
      if (item.trackAsAsset) {
        this.publishAssetTrackingRequest(order, item, userId, eventMetadata);
      }

      // For items requiring insurance, publish insurance recommendation
      if (item.insuranceRequired) {
        this.publishInsuranceRecommendation(order, item, userId, eventMetadata);
      }
    });

    console.log(`[CommerceIntegration] Published commerce.order.delivered for ${order.orderNumber}`);
  }

  /**
   * Publish asset tracking request to Assets domain
   * 
   * @param {Object} order - Order object
   * @param {Object} item - Order item
   * @param {string} userId - User ID
   * @param {Object} metadata - Event metadata
   */
  publishAssetTrackingRequest(order, item, userId, metadata) {
    const eventData = {
      // Commerce references
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderItemId: item.id,
      
      // Product details for asset creation
      productId: item.productId,
      name: item.productName || 'Commerce Purchase',
      description: `Purchased via ${order.orderNumber}`,
      quantity: item.quantity,
      purchasePrice: item.unitPrice,
      purchaseDate: order.deliveredAt,
      currentPrice: item.unitPrice,
      
      // Asset classification
      assetType: 'PHYSICAL_ASSET', // or DIGITAL_ASSET based on product
      category: 'COMMERCE_PURCHASE',
      
      // Buyer information
      buyerId: order.buyerId,
      userId: userId,
      
      // Integration metadata
      sourceDomain: 'commerce',
      sourceTransactionId: order.id,
      
      // Additional info
      totalValue: item.subtotal,
      currency: order.currency,
    };

    eventBus.publish('commerce.asset.tracking.requested', eventData, {
      ...metadata,
      targetDomain: 'assets',
    });

    console.log(`[CommerceIntegration] Published asset tracking request for item ${item.id}`);
  }

  /**
   * Publish insurance recommendation to Insure domain
   * 
   * @param {Object} order - Order object
   * @param {Object} item - Order item
   * @param {string} userId - User ID
   * @param {Object} metadata - Event metadata
   */
  publishInsuranceRecommendation(order, item, userId, metadata) {
    const eventData = {
      // Commerce references
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderItemId: item.id,
      
      // Item details for insurance
      productId: item.productId,
      productName: item.productName || 'Product',
      productValue: item.subtotal,
      currency: order.currency,
      
      // Insurance recommendation details
      recommendationType: 'PRODUCT_INSURANCE',
      coverageAmount: item.subtotal,
      insuredItemType: 'PHYSICAL_GOODS', // or DIGITAL_GOODS
      
      // Buyer information
      buyerId: order.buyerId,
      userId: userId,
      
      // Integration metadata
      sourceDomain: 'commerce',
      sourceTransactionId: order.id,
      
      // Purchase details
      purchaseDate: order.deliveredAt,
      shippingAddress: order.shippingAddress,
    };

    eventBus.publish('commerce.insurance.recommended', eventData, {
      ...metadata,
      targetDomain: 'insure',
    });

    console.log(`[CommerceIntegration] Published insurance recommendation for item ${item.id}`);
  }

  /**
   * Publish payment completed event
   * 
   * @param {Object} payment - Payment object
   * @param {Object} order - Order object
   * @param {string} userId - User ID
   * @param {Object} metadata - Event metadata
   */
  publishPaymentCompleted(payment, order, userId, metadata = {}) {
    const eventData = {
      paymentId: payment.id,
      orderId: order.id,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      paidAt: payment.paidAt,
    };

    eventBus.publish('commerce.payment.completed', eventData, {
      correlationId: metadata.correlationId || `pay_${payment.id}`,
      userId: userId,
      timestamp: new Date().toISOString(),
    });

    console.log(`[CommerceIntegration] Published commerce.payment.completed for ${payment.id}`);
  }

  // ==================== EVENT HANDLERS ====================

  /**
   * Handle asset valuation update
   */
  async handleAssetValuationUpdate(eventData, metadata) {
    console.log('[CommerceIntegration] Processing asset valuation update');
    console.log('[CommerceIntegration] Asset ID:', eventData.assetId);
    console.log('[CommerceIntegration] New value:', eventData.currentValue);
    
    // Could update product value history, market prices, etc.
    // This helps keep commerce prices aligned with real-world valuations
  }

  /**
   * Handle insurance policy created
   */
  async handleInsurancePolicyCreated(eventData, metadata) {
    console.log('[CommerceIntegration] Processing insurance policy creation');
    console.log('[CommerceIntegration] Policy ID:', eventData.policyId);
    console.log('[CommerceIntegration] Order Item ID:', eventData.sourceItemId);
    
    // Link the policy to the order item
    // This creates a complete audit trail: Order → Item → Insurance Policy
  }

  /**
   * Handle investment returns
   */
  async handleInvestmentReturns(eventData, metadata) {
    console.log('[CommerceIntegration] Processing investment returns');
    console.log('[CommerceIntegration] User ID:', eventData.userId);
    console.log('[CommerceIntegration] Returns amount:', eventData.returnAmount);
    
    // Could trigger personalized offers, premium tier unlocks, etc.
  }

  /**
   * Cleanup subscriptions
   */
  cleanup() {
    this.subscribers.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.subscribers = [];
    console.log('[CommerceIntegration] Cleaned up all subscriptions');
  }
}

module.exports = new CommerceIntegrationService();
