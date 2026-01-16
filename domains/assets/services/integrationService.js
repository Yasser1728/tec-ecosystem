/**
 * Assets Integration Service
 * 
 * Handles all cross-domain integrations for the Assets domain using the Event Bus.
 * This service listens to events from other domains and creates/updates assets accordingly.
 * 
 * @module domains/assets/services/integrationService
 */

const eventBus = require('../../../lib/eventBus');
const AssetService = require('./assetService');
const { logger } = require('../../../lib/utils/logger.js');

class AssetsIntegrationService {
  constructor() {
    this.assetService = new AssetService();
    this.subscribers = [];
  }

  /**
   * Initialize all event subscriptions
   * Sets up listeners for events from other domains
   */
  initialize() {
    console.log('[AssetsIntegration] Initializing cross-domain event subscriptions...');

    // Subscribe to FundX events
    this.subscribeFundXEvents();

    // Subscribe to Estate events
    this.subscribeEstateEvents();

    // Subscribe to Commerce events
    this.subscribeCommerceEvents();

    // Subscribe to Insure events
    this.subscribeInsureEvents();

    console.log('[AssetsIntegration] All subscriptions initialized');
  }

  /**
   * Subscribe to FundX domain events
   */
  subscribeFundXEvents() {
    // Investment created
    const unsubInvestmentCreated = eventBus.subscribe(
      'fundx.investment.created',
      async (eventData, metadata) => {
        console.log('[AssetsIntegration] Received fundx.investment.created event');
        try {
          const asset = await this.assetService.handleFundXInvestment(eventData);
          
          // Publish asset created event
          eventBus.publish('assets.asset.created', {
            assetId: asset.id,
            portfolioId: asset.portfolioId,
            userId: eventData.userId,
            assetType: 'INVESTMENT',
            name: asset.name,
            value: asset.currentValue,
            sourceDomain: 'fundx',
          }, {
            correlationId: metadata.correlationId,
            userId: eventData.userId,
          });

          // Publish to analytics
          eventBus.publish('analytics.data.updated', {
            domain: 'assets',
            type: 'asset_created',
            userId: eventData.userId,
            data: {
              assetId: asset.id,
              value: asset.currentValue,
              assetType: 'INVESTMENT',
              source: 'fundx',
            },
          }, metadata);

          console.log(`[AssetsIntegration] Created asset ${asset.id} from FundX investment`);
        } catch (error) {
          console.error('[AssetsIntegration] Error handling FundX investment:', error);
          throw error;
        }
      },
      { domain: 'assets', description: 'Handle FundX investment creation' }
    );

    // Investment updated
    const unsubInvestmentUpdated = eventBus.subscribe(
      'fundx.investment.updated',
      async (eventData, metadata) => {
        console.log('[AssetsIntegration] Received fundx.investment.updated event');
        try {
          // Find asset by metadata.sourceId
          const assets = await this.assetService.getUserAssets(eventData.userId, {
            status: 'ACTIVE', // Use string constant for now, can be improved with enum
          });
          
          const linkedAsset = assets.find(a => 
            a.metadata?.sourceId === eventData.investmentId &&
            a.metadata?.sourceDomain === 'fundx'
          );

          if (linkedAsset) {
            // Update asset with new values
            await this.assetService.updateAsset(linkedAsset.id, {
              currentPrice: eventData.currentPrice,
              quantity: eventData.shares,
            });

            console.log(`[AssetsIntegration] Updated asset ${linkedAsset.id} from FundX investment update`);
          }
        } catch (error) {
          console.error('[AssetsIntegration] Error handling FundX investment update:', error);
        }
      },
      { domain: 'assets', description: 'Handle FundX investment updates' }
    );

    this.subscribers.push(unsubInvestmentCreated, unsubInvestmentUpdated);
  }

  /**
   * Subscribe to Estate domain events
   */
  subscribeEstateEvents() {
    const unsubPropertyPurchased = eventBus.subscribe(
      'estate.property.purchased',
      async (eventData, metadata) => {
        console.log('[AssetsIntegration] Received estate.property.purchased event');
        try {
          const asset = await this.assetService.handleEstateProperty(eventData);
          
          // Publish asset created event
          eventBus.publish('assets.asset.created', {
            assetId: asset.id,
            portfolioId: asset.portfolioId,
            userId: eventData.userId,
            assetType: 'REAL_ESTATE',
            name: asset.name,
            value: asset.currentValue,
            sourceDomain: 'estate',
          }, {
            correlationId: metadata.correlationId,
            userId: eventData.userId,
          });

          // Publish to analytics
          eventBus.publish('analytics.data.updated', {
            domain: 'assets',
            type: 'asset_created',
            userId: eventData.userId,
            data: {
              assetId: asset.id,
              value: asset.currentValue,
              assetType: 'REAL_ESTATE',
              source: 'estate',
              location: eventData.address,
            },
          }, metadata);

          console.log(`[AssetsIntegration] Created asset ${asset.id} from Estate property purchase`);
        } catch (error) {
          console.error('[AssetsIntegration] Error handling Estate property purchase:', error);
          throw error;
        }
      },
      { domain: 'assets', description: 'Handle Estate property purchases' }
    );

    this.subscribers.push(unsubPropertyPurchased);
  }

  /**
   * Subscribe to Commerce domain events
   */
  subscribeCommerceEvents() {
    const unsubProductPurchased = eventBus.subscribe(
      'commerce.product.purchased',
      async (eventData, metadata) => {
        console.log('[AssetsIntegration] Received commerce.product.purchased event');
        
        // Only process if marked for asset tracking
        if (!eventData.trackAsAsset) {
          console.log('[AssetsIntegration] Product not marked for asset tracking, skipping');
          return;
        }

        try {
          const asset = await this.assetService.handleCommerceProduct(eventData);
          
          if (asset.success !== false) {
            // Publish asset created event
            eventBus.publish('assets.asset.created', {
              assetId: asset.id,
              portfolioId: asset.portfolioId,
              userId: eventData.userId,
              assetType: eventData.assetType || 'DIGITAL_ASSET',
              name: asset.name,
              value: asset.currentValue,
              sourceDomain: 'commerce',
            }, {
              correlationId: metadata.correlationId,
              userId: eventData.userId,
            });

            console.log(`[AssetsIntegration] Created asset ${asset.id} from Commerce product purchase`);
          }
        } catch (error) {
          console.error('[AssetsIntegration] Error handling Commerce product purchase:', error);
          throw error;
        }
      },
      { domain: 'assets', description: 'Handle Commerce product purchases' }
    );

    this.subscribers.push(unsubProductPurchased);
  }

  /**
   * Subscribe to Insure domain events
   */
  subscribeInsureEvents() {
    // Insurance policy created and linked to asset
    const unsubPolicyLinked = eventBus.subscribe(
      'insure.policy.asset.linked',
      async (eventData, metadata) => {
        console.log('[AssetsIntegration] Received insure.policy.asset.linked event');
        try {
          const result = await this.assetService.linkToInsurance(
            eventData.assetId,
            {
              policyId: eventData.policyId,
              provider: eventData.provider,
              policyType: eventData.policyType,
              coverage: eventData.coverage,
              premium: eventData.premium,
              startDate: eventData.startDate,
              endDate: eventData.endDate,
            }
          );

          // Publish asset updated event
          eventBus.publish('assets.asset.updated', {
            assetId: eventData.assetId,
            userId: eventData.userId,
            changes: { insurance: 'linked' },
            policyId: eventData.policyId,
          }, {
            correlationId: metadata.correlationId,
            userId: eventData.userId,
          });

          console.log(`[AssetsIntegration] Linked asset ${eventData.assetId} to insurance policy ${eventData.policyId}`);
        } catch (error) {
          console.error('[AssetsIntegration] Error linking insurance to asset:', error);
          throw error;
        }
      },
      { domain: 'assets', description: 'Handle insurance policy linking' }
    );

    this.subscribers.push(unsubPolicyLinked);
  }

  /**
   * Publish asset events for consumption by other domains
   */
  publishAssetCreated(asset, userId) {
    eventBus.publish('assets.asset.created', {
      assetId: asset.id,
      portfolioId: asset.portfolioId,
      userId: userId,
      assetType: asset.assetTypeId,
      name: asset.name,
      value: asset.currentValue,
    }, { userId });
  }

  publishAssetUpdated(asset, userId, changes) {
    eventBus.publish('assets.asset.updated', {
      assetId: asset.id,
      portfolioId: asset.portfolioId,
      userId: userId,
      changes: changes,
      oldValue: changes.oldValue,
      newValue: asset.currentValue,
    }, { userId });
  }

  publishPortfolioValueUpdated(portfolioId, userId, oldValue, newValue) {
    const change = newValue - oldValue;
    const changePercentage = oldValue > 0 ? (change / oldValue) * 100 : 0;

    eventBus.publish('assets.portfolio.value.updated', {
      portfolioId,
      userId,
      oldValue,
      newValue,
      change,
      changePercentage,
    }, { userId });

    // Also publish to analytics
    eventBus.publish('analytics.data.updated', {
      domain: 'assets',
      type: 'portfolio_value_updated',
      userId,
      data: {
        portfolioId,
        value: newValue,
        change,
        changePercentage,
      },
    }, { userId });
  }

  /**
   * Cleanup subscriptions
   */
  cleanup() {
    console.log('[AssetsIntegration] Cleaning up subscriptions...');
    this.subscribers.forEach(unsubscribe => unsubscribe());
    this.subscribers = [];
  }
}

// Export singleton instance
const integrationService = new AssetsIntegrationService();

module.exports = integrationService;
module.exports.AssetsIntegrationService = AssetsIntegrationService;
