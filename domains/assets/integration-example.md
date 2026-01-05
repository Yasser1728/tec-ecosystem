# Real-World Integration Example: FundX → Assets → Analytics

## 🎯 Overview

This document provides a complete, working example of how domains integrate through the Event Bus in the TEC Ecosystem. We'll walk through a real user scenario where an investment in FundX automatically creates an asset in the Assets domain and triggers analytics updates.

---

## 📋 Scenario: User Makes Investment

**User Story:**  
"As a user, when I invest 10,000 PI in the 'Balanced Growth Strategy' through FundX, I want my portfolio to automatically reflect this investment and my analytics dashboard to update with performance metrics."

**Domains Involved:**
1. **FundX** - Investment platform (source)
2. **Assets** - Portfolio management (processor)
3. **Analytics** - Data insights (consumer)
4. **Alert** - Notifications (consumer)
5. **NBF** - Banking/payment (supporting)

---

## 🔄 Complete Integration Flow

### Phase 1: User Action in FundX Domain

```javascript
// File: domains/fundx/services/investmentService.js

const eventBus = require('../../../lib/eventBus');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class InvestmentService {
  /**
   * Create new investment
   */
  async createInvestment(userId, investmentData) {
    try {
      // 1. Validate investment data
      this.validateInvestment(investmentData);
      
      // 2. Process payment via NBF
      const payment = await this.processPayment(userId, investmentData.amount);
      
      // 3. Calculate shares based on NAV
      const strategy = await this.getStrategy(investmentData.strategyId);
      const shares = investmentData.amount / strategy.currentNAV;
      
      // 4. Create investment record
      const investment = await prisma.investment.create({
        data: {
          userId: userId,
          strategyId: investmentData.strategyId,
          amount: investmentData.amount,
          shares: shares,
          entryPrice: strategy.currentNAV,
          entryDate: new Date(),
          status: 'ACTIVE',
          portfolioId: investmentData.portfolioId,
          metadata: {
            strategyName: strategy.name,
            riskLevel: strategy.riskLevel,
            paymentId: payment.id,
          },
        },
      });
      
      // 5. Publish investment created event
      this.publishInvestmentCreated(investment, userId, strategy);
      
      console.log(`[FundX] Investment created: ${investment.id}`);
      
      return investment;
    } catch (error) {
      console.error('[FundX] Error creating investment:', error);
      throw error;
    }
  }
  
  /**
   * Publish investment created event
   */
  publishInvestmentCreated(investment, userId, strategy) {
    const eventData = {
      // Investment identifiers
      investmentId: investment.id,
      portfolioId: investment.portfolioId,
      userId: userId,
      
      // Investment details
      strategyName: strategy.name,
      symbol: strategy.symbol || `FX-${strategy.id.slice(0, 8).toUpperCase()}`,
      amount: investment.amount,
      shares: investment.shares,
      pricePerUnit: investment.entryPrice,
      date: investment.entryDate,
      
      // Strategy information
      strategy: strategy.type, // GROWTH, BALANCED, etc.
      riskLevel: strategy.riskLevel, // LOW, MEDIUM, HIGH
      expectedReturn: strategy.expectedReturn,
      
      // Additional metadata
      metadata: {
        strategyId: strategy.id,
        category: strategy.category,
      },
    };
    
    // Publish to Event Bus
    eventBus.publish('fundx.investment.created', eventData, {
      correlationId: `inv_${investment.id}`,
      userId: userId,
      timestamp: new Date().toISOString(),
    });
    
    console.log(`[FundX] Published event: fundx.investment.created for ${investment.id}`);
  }
  
  async processPayment(userId, amount) {
    // Payment processing logic...
    return { id: 'payment_123', status: 'COMPLETED' };
  }
  
  async getStrategy(strategyId) {
    // Fetch strategy details...
    return {
      id: strategyId,
      name: 'Balanced Growth Strategy',
      type: 'BALANCED',
      riskLevel: 'MEDIUM',
      currentNAV: 25.00,
      expectedReturn: 12.5,
      symbol: 'BGS',
      category: 'MIXED',
    };
  }
  
  validateInvestment(data) {
    if (!data.strategyId) throw new Error('Strategy ID required');
    if (!data.amount || data.amount <= 0) throw new Error('Valid amount required');
    if (!data.portfolioId) throw new Error('Portfolio ID required');
  }
}

module.exports = InvestmentService;
```

---

### Phase 2: Assets Domain Receives and Processes Event

```javascript
// File: domains/assets/services/integrationService.js

const eventBus = require('../../../lib/eventBus');
const AssetService = require('./assetService');

class AssetsIntegrationService {
  constructor() {
    this.assetService = new AssetService();
  }
  
  /**
   * Initialize event subscriptions
   */
  initialize() {
    // Subscribe to FundX investment events
    this.subscribeFundXEvents();
  }
  
  /**
   * Subscribe to FundX events
   */
  subscribeFundXEvents() {
    eventBus.subscribe(
      'fundx.investment.created',
      async (eventData, metadata) => {
        console.log('[Assets] Received fundx.investment.created event');
        console.log('[Assets] Investment ID:', eventData.investmentId);
        console.log('[Assets] Correlation ID:', metadata.correlationId);
        
        try {
          // Process the investment and create asset
          const asset = await this.handleFundXInvestment(eventData, metadata);
          
          console.log(`[Assets] Created asset ${asset.id} from FundX investment ${eventData.investmentId}`);
          
          // Publish asset created event
          this.publishAssetCreated(asset, eventData.userId, metadata);
          
        } catch (error) {
          console.error('[Assets] Error handling FundX investment:', error);
          
          // Publish error event
          eventBus.publish('assets.integration.error', {
            sourceDomain: 'fundx',
            sourceEvent: 'investment.created',
            sourceId: eventData.investmentId,
            error: error.message,
          }, metadata);
          
          throw error;
        }
      },
      { 
        domain: 'assets',
        description: 'Create asset from FundX investment'
      }
    );
  }
  
  /**
   * Handle FundX investment - create corresponding asset
   */
  async handleFundXInvestment(eventData, metadata) {
    // Create asset using AssetService
    const asset = await this.assetService.createAsset({
      // Portfolio linkage
      portfolioId: eventData.portfolioId,
      
      // Asset classification
      assetTypeId: 'INVESTMENT',
      categoryId: null, // User can categorize later
      
      // Basic information
      name: eventData.strategyName,
      symbol: eventData.symbol,
      description: `Investment in ${eventData.strategyName} (${eventData.strategy} strategy)`,
      
      // Financial details
      quantity: eventData.shares,
      purchasePrice: eventData.pricePerUnit,
      purchaseDate: new Date(eventData.date),
      currentPrice: eventData.pricePerUnit, // Initially same as purchase price
      
      // Integration metadata
      metadata: {
        sourceId: eventData.investmentId,
        sourceDomain: 'fundx',
        strategy: eventData.strategy,
        riskLevel: eventData.riskLevel,
        expectedReturn: eventData.expectedReturn,
        strategyId: eventData.metadata?.strategyId,
        integrationTimestamp: metadata.timestamp,
        correlationId: metadata.correlationId,
      },
      
      // Transaction linkage
      relatedDomain: 'fundx',
      relatedTransactionId: eventData.investmentId,
    });
    
    return asset;
  }
  
  /**
   * Publish asset created event for downstream consumers
   */
  publishAssetCreated(asset, userId, originalMetadata) {
    // Event for general consumption
    eventBus.publish('assets.asset.created', {
      // Asset identifiers
      assetId: asset.id,
      portfolioId: asset.portfolioId,
      userId: userId,
      
      // Asset details
      assetType: asset.assetTypeId,
      name: asset.name,
      symbol: asset.symbol,
      value: parseFloat(asset.currentValue),
      
      // Integration tracking
      sourceDomain: 'fundx',
      sourceId: asset.metadata.sourceId,
      
      // Timestamps
      createdAt: asset.createdAt,
    }, {
      correlationId: originalMetadata.correlationId,
      userId: userId,
      sourceEvent: 'fundx.investment.created',
    });
    
    // Event specifically for analytics
    eventBus.publish('analytics.data.updated', {
      domain: 'assets',
      type: 'asset_created',
      userId: userId,
      data: {
        assetId: asset.id,
        portfolioId: asset.portfolioId,
        assetType: 'INVESTMENT',
        value: parseFloat(asset.currentValue),
        source: 'fundx',
        strategy: asset.metadata.strategy,
        riskLevel: asset.metadata.riskLevel,
      },
      timestamp: new Date().toISOString(),
    }, {
      correlationId: originalMetadata.correlationId,
      userId: userId,
    });
    
    console.log(`[Assets] Published events for asset ${asset.id}`);
  }
}

module.exports = new AssetsIntegrationService();
```

---

### Phase 3: Analytics Domain Processes Asset Data

```javascript
// File: domains/analytics/services/integrationService.js

const eventBus = require('../../../lib/eventBus');

class AnalyticsIntegrationService {
  initialize() {
    this.subscribeToAssetEvents();
  }
  
  subscribeToAssetEvents() {
    // Subscribe to analytics data updates
    eventBus.subscribe(
      'analytics.data.updated',
      async (eventData, metadata) => {
        console.log('[Analytics] Received data update from:', eventData.domain);
        
        if (eventData.domain === 'assets' && eventData.type === 'asset_created') {
          await this.processAssetCreation(eventData, metadata);
        }
      },
      {
        domain: 'analytics',
        description: 'Process analytics data updates'
      }
    );
    
    // Also subscribe to asset events directly
    eventBus.subscribe(
      'assets.asset.created',
      async (eventData, metadata) => {
        console.log('[Analytics] Asset created:', eventData.assetId);
        await this.updateUserFinancialProfile(eventData, metadata);
      },
      {
        domain: 'analytics',
        description: 'Update user financial profile'
      }
    );
  }
  
  async processAssetCreation(eventData, metadata) {
    console.log('[Analytics] Processing asset creation');
    console.log('[Analytics] User:', eventData.userId);
    console.log('[Analytics] Asset Type:', eventData.data.assetType);
    console.log('[Analytics] Value:', eventData.data.value);
    
    // Update analytics metrics
    await this.updateMetrics({
      userId: eventData.userId,
      metricType: 'asset_created',
      assetType: eventData.data.assetType,
      value: eventData.data.value,
      source: eventData.data.source,
      timestamp: eventData.timestamp,
    });
    
    // Update user portfolio analytics
    await this.recalculatePortfolioMetrics(
      eventData.userId,
      eventData.data.portfolioId
    );
    
    // Check if investment goals are affected
    await this.checkInvestmentGoals(eventData.userId);
    
    console.log('[Analytics] Asset creation processed');
  }
  
  async updateUserFinancialProfile(eventData, metadata) {
    console.log('[Analytics] Updating financial profile for user:', eventData.userId);
    
    // Update aggregated metrics
    await this.incrementUserMetric(eventData.userId, 'total_assets');
    await this.updateAssetAllocation(eventData.userId, eventData.assetType);
    await this.updatePortfolioValue(eventData.portfolioId, eventData.value);
    
    // Generate insights
    const insights = await this.generateInvestmentInsights(eventData.userId);
    
    console.log('[Analytics] Financial profile updated, insights:', insights.length);
  }
  
  async updateMetrics(data) {
    // Store analytics data
    console.log('[Analytics] Metrics updated');
  }
  
  async recalculatePortfolioMetrics(userId, portfolioId) {
    // Recalculate portfolio performance
    console.log(`[Analytics] Recalculating portfolio ${portfolioId}`);
  }
  
  async checkInvestmentGoals(userId) {
    // Check if user's investment goals are impacted
    console.log(`[Analytics] Checking investment goals for user ${userId}`);
  }
  
  async incrementUserMetric(userId, metric) {
    console.log(`[Analytics] Incrementing ${metric} for user ${userId}`);
  }
  
  async updateAssetAllocation(userId, assetType) {
    console.log(`[Analytics] Updating asset allocation: ${assetType}`);
  }
  
  async updatePortfolioValue(portfolioId, value) {
    console.log(`[Analytics] Updating portfolio ${portfolioId} value by ${value}`);
  }
  
  async generateInvestmentInsights(userId) {
    console.log(`[Analytics] Generating insights for user ${userId}`);
    return [];
  }
}

module.exports = new AnalyticsIntegrationService();
```

---

### Phase 4: Alert Domain Creates Notifications

```javascript
// File: domains/alert/services/integrationService.js

const eventBus = require('../../../lib/eventBus');

class AlertIntegrationService {
  initialize() {
    this.subscribeToAssetEvents();
  }
  
  subscribeToAssetEvents() {
    eventBus.subscribe(
      'assets.asset.created',
      async (eventData, metadata) => {
        console.log('[Alert] New asset created, setting up alerts');
        await this.createDefaultAlerts(eventData, metadata);
      },
      {
        domain: 'alert',
        description: 'Create alerts for new assets'
      }
    );
  }
  
  async createDefaultAlerts(eventData, metadata) {
    // Create price alerts for investment
    if (eventData.assetType === 'INVESTMENT') {
      await this.createPriceAlert(eventData.userId, eventData.assetId, {
        type: 'PRICE_ABOVE',
        threshold: eventData.value * 1.1, // 10% gain
        message: `Your ${eventData.name} investment has gained 10%!`,
      });
      
      await this.createPriceAlert(eventData.userId, eventData.assetId, {
        type: 'PRICE_BELOW',
        threshold: eventData.value * 0.9, // 10% loss
        message: `Your ${eventData.name} investment has dropped 10%`,
      });
      
      console.log(`[Alert] Created default alerts for asset ${eventData.assetId}`);
    }
  }
  
  async createPriceAlert(userId, assetId, config) {
    console.log(`[Alert] Creating ${config.type} alert for asset ${assetId}`);
    // Create alert in database...
  }
}

module.exports = new AlertIntegrationService();
```

---

## 📊 Complete Event Flow Diagram

```
User Action (FundX UI)
       ↓
[1] FundX Investment Service
    - Validates data
    - Processes payment (NBF)
    - Creates investment record
    - Calculates shares
       ↓
[2] Publishes Event: fundx.investment.created
    {
      investmentId, portfolioId, userId,
      strategyName, amount, shares, etc.
    }
       ↓
    Event Bus
    ↙     ↓     ↘
   /      |      \
  /       |       \
[3a]   [3b]     [3c]
Assets Analytics Alert
  ↓       ↓        ↓
Creates Updates  Creates
Asset   Metrics  Alerts
  ↓
[4] Publishes Event: assets.asset.created
    {
      assetId, portfolioId, value, etc.
    }
       ↓
    Event Bus
       ↓
[5] Analytics & Alert process asset event
       ↓
User sees updated portfolio in real-time
```

---

## 🔍 Event Tracing Example

### Request Flow with Correlation ID

```javascript
// Initial request comes in
const correlationId = `inv_${Date.now()}_${randomId()}`;

// FundX publishes with correlation ID
eventBus.publish('fundx.investment.created', eventData, {
  correlationId: correlationId,
  userId: 'user_123',
  timestamp: '2026-01-04T10:00:00Z',
});

// Assets receives and propagates
eventBus.publish('assets.asset.created', assetData, {
  correlationId: correlationId, // Same correlation ID!
  userId: 'user_123',
  sourceEvent: 'fundx.investment.created',
});

// Analytics receives with full trace
// Can now trace back through entire flow
```

### Viewing Event History

```javascript
// Get all events in a flow
const events = eventBus.getHistory({
  correlationId: 'inv_1704362400_abc123',
});

// Results:
// [
//   {
//     eventType: 'fundx.investment.created',
//     metadata: { correlationId: 'inv_...', timestamp: '...' }
//   },
//   {
//     eventType: 'assets.asset.created',
//     metadata: { correlationId: 'inv_...', sourceEvent: 'fundx...' }
//   },
//   {
//     eventType: 'analytics.data.updated',
//     metadata: { correlationId: 'inv_...' }
//   }
// ]
```

---

## 🧪 Testing the Integration

### Integration Test Example

```javascript
describe('FundX to Assets to Analytics Integration', () => {
  it('should create asset and update analytics when investment is made', async () => {
    // Initialize all services
    const assetsIntegration = require('./domains/assets/services/integrationService');
    const analyticsIntegration = require('./domains/analytics/services/integrationService');
    
    assetsIntegration.initialize();
    analyticsIntegration.initialize();
    
    // Track events
    const eventsReceived = [];
    
    eventBus.subscribe('assets.asset.created', (data) => {
      eventsReceived.push('assets.asset.created');
    });
    
    eventBus.subscribe('analytics.data.updated', (data) => {
      eventsReceived.push('analytics.data.updated');
    });
    
    // Simulate FundX investment
    eventBus.publish('fundx.investment.created', {
      investmentId: 'inv_test_123',
      portfolioId: 'port_test_456',
      userId: 'user_test_789',
      strategyName: 'Test Strategy',
      amount: 10000,
      shares: 400,
      pricePerUnit: 25,
      date: new Date(),
      strategy: 'BALANCED',
      riskLevel: 'MEDIUM',
    });
    
    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify events were received
    expect(eventsReceived).toContain('assets.asset.created');
    expect(eventsReceived).toContain('analytics.data.updated');
    
    // Cleanup
    assetsIntegration.cleanup();
    analyticsIntegration.cleanup();
  });
});
```

---

## 💡 Key Takeaways

1. **Loose Coupling**: Domains don't call each other directly
2. **Event-Driven**: All communication through Event Bus
3. **Idempotency**: Events can be replayed safely
4. **Traceability**: Correlation IDs track entire flow
5. **Scalability**: Easy to add new consumers
6. **Resilience**: Failure in one domain doesn't break others
7. **Observability**: Complete event history available

---

## 📚 Related Documentation

- [Event Bus API](/lib/eventBus.js)
- [Assets Integration Service](/domains/assets/services/integrationService.js)
- [User Journey](/domains/assets/user-journey.md)
- [Collaboration Guide](/COLLABORATION_GUIDE.md)

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Maintained By**: TEC Integration Team
