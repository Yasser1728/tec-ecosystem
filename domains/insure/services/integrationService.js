/**
 * Insure Integration Service
 * 
 * Handles all cross-domain integrations for the Insure domain using the Event Bus.
 * This service listens to events from other domains and creates insurance recommendations,
 * updates asset status based on claims, and coordinates with other financial domains.
 * 
 * @module domains/insure/services/integrationService
 */

const eventBus = require('../../../lib/eventBus');
const InsureService = require('./insureService');

class InsureIntegrationService {
  constructor() {
    this.insureService = new InsureService();
    this.subscribers = [];
  }

  /**
   * Initialize all event subscriptions
   * Sets up listeners for events from other domains
   */
  initialize() {
    console.log('[InsureIntegration] Initializing cross-domain event subscriptions...');

    // Subscribe to Assets domain events
    this.subscribeAssetsEvents();

    // Subscribe to Estate domain events (property purchases)
    this.subscribeEstateEvents();

    // Subscribe to Commerce events (transaction insurance)
    this.subscribeCommerceEvents();

    console.log('[InsureIntegration] All subscriptions initialized');
  }

  /**
   * Subscribe to Assets domain events
   * 
   * Automatically generate insurance recommendations when new assets are created
   */
  subscribeAssetsEvents() {
    // Asset created - Generate insurance recommendation
    const unsubAssetCreated = eventBus.subscribe(
      'assets.asset.created',
      async (eventData, metadata) => {
        console.log('[InsureIntegration] Received assets.asset.created event');
        try {
          // Generate insurance recommendation for high-value assets
          if (eventData.value && eventData.value > 1000) {
            const recommendation = this.insureService.generateInsuranceRecommendation({
              userId: eventData.userId,
              assetId: eventData.assetId,
              assetType: eventData.assetType,
              assetValue: eventData.value,
            });

            // Publish recommendation event
            this.insureService.publishInsuranceRecommendation(recommendation);

            // Optionally publish to Alert domain for user notification
            eventBus.publish('alert.notification.create', {
              userId: eventData.userId,
              type: 'INSURANCE_RECOMMENDATION',
              title: 'Insurance Recommendation Available',
              message: recommendation.recommendation,
              data: {
                recommendationType: 'ASSET_INSURANCE',
                assetId: eventData.assetId,
                policyType: recommendation.recommendedPolicyType,
                estimatedPremium: recommendation.estimatedPremium,
              },
            }, metadata);

            console.log(`[InsureIntegration] Generated insurance recommendation for asset ${eventData.assetId}`);
          }
        } catch (error) {
          console.error('[InsureIntegration] Error handling asset creation:', error);
        }
      },
      { domain: 'insure', description: 'Generate insurance recommendations for new assets' }
    );

    // Asset value updated - Update insurance coverage recommendation
    const unsubAssetUpdated = eventBus.subscribe(
      'assets.asset.updated',
      async (eventData, metadata) => {
        console.log('[InsureIntegration] Received assets.asset.updated event');
        try {
          // Find existing policies for this asset
          const policies = await this.insureService.getUserPolicies(eventData.userId, {
            assetId: eventData.assetId,
            status: 'ACTIVE',
          });

          // If there's an active policy and value changed significantly
          if (policies.length > 0 && eventData.value) {
            const policy = policies[0];
            const valueDifference = Math.abs(eventData.value - policy.coverageAmount);
            const percentChange = (valueDifference / policy.coverageAmount) * 100;

            // If asset value changed by more than 20%, notify user
            if (percentChange > 20) {
              eventBus.publish('alert.notification.create', {
                userId: eventData.userId,
                type: 'INSURANCE_UPDATE_NEEDED',
                title: 'Insurance Coverage Review Recommended',
                message: `Your asset value has changed significantly. Consider updating your insurance coverage.`,
                data: {
                  policyId: policy.id,
                  policyNumber: policy.policyNumber,
                  currentCoverage: policy.coverageAmount,
                  assetValue: eventData.value,
                  assetId: eventData.assetId,
                },
              }, metadata);
            }
          }
        } catch (error) {
          console.error('[InsureIntegration] Error handling asset update:', error);
        }
      },
      { domain: 'insure', description: 'Monitor asset value changes for insurance updates' }
    );

    this.subscribers.push(unsubAssetCreated, unsubAssetUpdated);
  }

  /**
   * Subscribe to Estate domain events
   * 
   * Offer property insurance when properties are purchased
   */
  subscribeEstateEvents() {
    // Property purchased - Offer property insurance
    const unsubPropertyPurchased = eventBus.subscribe(
      'estate.property.purchased',
      async (eventData, metadata) => {
        console.log('[InsureIntegration] Received estate.property.purchased event');
        try {
          // Generate property insurance recommendation
          const recommendation = this.insureService.generateInsuranceRecommendation({
            userId: eventData.userId,
            assetId: eventData.propertyId,
            assetType: 'REAL_ESTATE',
            assetValue: eventData.purchasePrice,
          });

          // Publish recommendation
          this.insureService.publishInsuranceRecommendation(recommendation);

          // Notify user
          eventBus.publish('alert.notification.create', {
            userId: eventData.userId,
            type: 'INSURANCE_REQUIRED',
            title: 'Property Insurance Available',
            message: `Protect your new property with comprehensive insurance coverage starting at ${recommendation.estimatedPremium} PI/month.`,
            priority: 'HIGH',
            data: {
              recommendationType: 'PROPERTY_INSURANCE',
              propertyId: eventData.propertyId,
              estimatedPremium: recommendation.estimatedPremium,
              coverageAmount: recommendation.coverageAmount,
            },
          }, metadata);

          console.log(`[InsureIntegration] Generated property insurance recommendation for ${eventData.propertyId}`);
        } catch (error) {
          console.error('[InsureIntegration] Error handling property purchase:', error);
        }
      },
      { domain: 'insure', description: 'Offer property insurance for new property purchases' }
    );

    this.subscribers.push(unsubPropertyPurchased);
  }

  /**
   * Subscribe to Commerce events
   * 
   * Offer transaction insurance for high-value purchases
   */
  subscribeCommerceEvents() {
    // High-value order created - Offer transaction insurance
    const unsubOrderCreated = eventBus.subscribe(
      'commerce.order.created',
      async (eventData, metadata) => {
        console.log('[InsureIntegration] Received commerce.order.created event');
        try {
          // Only for high-value orders (> 5000 PI)
          if (eventData.total && eventData.total > 5000) {
            const recommendation = this.insureService.generateInsuranceRecommendation({
              userId: eventData.userId,
              assetId: eventData.orderId,
              assetType: 'TRANSACTION',
              assetValue: eventData.total,
            });

            // Notify user about transaction insurance
            eventBus.publish('alert.notification.create', {
              userId: eventData.userId,
              type: 'TRANSACTION_INSURANCE_AVAILABLE',
              title: 'Protect Your Purchase',
              message: `Add transaction insurance to your order for ${recommendation.estimatedPremium} PI.`,
              data: {
                orderId: eventData.orderId,
                orderTotal: eventData.total,
                insurancePremium: recommendation.estimatedPremium,
              },
            }, metadata);
          }
        } catch (error) {
          console.error('[InsureIntegration] Error handling order creation:', error);
        }
      },
      { domain: 'insure', description: 'Offer transaction insurance for high-value orders' }
    );

    this.subscribers.push(unsubOrderCreated);
  }

  /**
   * Handle claim approved - Update asset status
   * 
   * This is called internally when a claim is approved to notify Assets domain
   */
  handleClaimApproved(claimData) {
    console.log('[InsureIntegration] Handling claim approval for asset update');

    // If claim is linked to an asset, notify Assets domain
    if (claimData.assetId) {
      eventBus.publish('assets.insurance.claim.approved', {
        assetId: claimData.assetId,
        claimId: claimData.claimId,
        approvedAmount: claimData.approvedAmount,
        policyId: claimData.policyId,
        userId: claimData.userId,
        note: 'Insurance claim approved - asset may need status update',
      }, {
        userId: claimData.userId,
      });

      console.log(`[InsureIntegration] Notified Assets domain about approved claim for asset ${claimData.assetId}`);
    }

    // Notify NBF for payout processing
    eventBus.publish('nbf.payment.request', {
      userId: claimData.userId,
      amount: claimData.approvedAmount,
      type: 'INSURANCE_CLAIM_PAYOUT',
      reference: claimData.claimNumber,
      claimId: claimData.claimId,
    }, {
      userId: claimData.userId,
    });
  }

  /**
   * Handle claim rejected - Update asset status
   * 
   * This is called internally when a claim is rejected to notify Assets domain
   */
  handleClaimRejected(claimData) {
    console.log('[InsureIntegration] Handling claim rejection for asset update');

    // If claim is linked to an asset, notify Assets domain
    if (claimData.assetId) {
      eventBus.publish('assets.insurance.claim.rejected', {
        assetId: claimData.assetId,
        claimId: claimData.claimId,
        policyId: claimData.policyId,
        userId: claimData.userId,
        reason: claimData.rejectionReason,
        note: 'Insurance claim rejected',
      }, {
        userId: claimData.userId,
      });

      console.log(`[InsureIntegration] Notified Assets domain about rejected claim for asset ${claimData.assetId}`);
    }

    // Notify user
    eventBus.publish('alert.notification.create', {
      userId: claimData.userId,
      type: 'CLAIM_REJECTED',
      title: 'Insurance Claim Update',
      message: `Your claim ${claimData.claimNumber} has been rejected. ${claimData.rejectionReason}`,
      priority: 'HIGH',
      data: {
        claimId: claimData.claimId,
        claimNumber: claimData.claimNumber,
        reason: claimData.rejectionReason,
      },
    }, {
      userId: claimData.userId,
    });
  }

  /**
   * Subscribe to internal insure events to trigger cross-domain actions
   */
  subscribeInternalEvents() {
    // Listen to our own claim events to trigger asset updates
    const unsubClaimApproved = eventBus.subscribe(
      'insure.claim.approved',
      async (eventData, metadata) => {
        this.handleClaimApproved(eventData);
      },
      { domain: 'insure', description: 'Handle approved claims for asset updates' }
    );

    const unsubClaimRejected = eventBus.subscribe(
      'insure.claim.rejected',
      async (eventData, metadata) => {
        this.handleClaimRejected(eventData);
      },
      { domain: 'insure', description: 'Handle rejected claims for asset updates' }
    );

    this.subscribers.push(unsubClaimApproved, unsubClaimRejected);
  }

  /**
   * Cleanup subscriptions
   */
  cleanup() {
    this.subscribers.forEach(unsubscribe => unsubscribe());
    this.subscribers = [];
    console.log('[InsureIntegration] Cleaned up all subscriptions');
  }
}

const integrationService = new InsureIntegrationService();
module.exports = integrationService;
