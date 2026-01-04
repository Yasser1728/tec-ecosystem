# Real-World Integration Example: Commerce → Assets → Insure
# مثال التكامل الفعلي: التجارة → الأصول → التأمين

---

## 🎯 Overview / نظرة عامة

This document provides a complete, working example of how the Commerce domain integrates with Assets and Insure domains through the Event Bus in the TEC Ecosystem. We'll walk through a real B2B transaction scenario where a purchase triggers asset tracking and insurance recommendations.

يوفر هذا المستند مثالاً كاملاً وعملياً لكيفية تكامل دومين التجارة مع دومينات الأصول والتأمين من خلال ناقل الأحداث في نظام TEC البيئي.

---

## 📋 Scenario: B2B Purchase with Asset Tracking and Insurance

**User Story / قصة المستخدم:**

"As a manufacturing company, when I purchase high-value equipment through the Commerce platform, I want the items automatically tracked in my asset portfolio and receive insurance recommendations to protect my investment."

"كشركة تصنيع، عندما أشتري معدات عالية القيمة من خلال منصة التجارة، أريد تتبع العناصر تلقائيًا في محفظة أصولي وتلقي توصيات التأمين لحماية استثماري."

**Domains Involved / الدومينات المشاركة:**

1. **Commerce (4-commerce)** - B2B trading platform (source)
2. **Assets (1-assets)** - Portfolio management (processor)
3. **Insure (2-insure)** - Insurance management (processor)
4. **Analytics** - Data insights (consumer)

---

## 🔄 Complete Integration Flow / تدفق التكامل الكامل

### Phase 1: Order Creation in Commerce Domain

```javascript
// File: domains/commerce/services/commerceService.js

const eventBus = require('../../../lib/eventBus');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CommerceService {
  /**
   * Create a new B2B order
   * إنشاء طلب B2B جديد
   */
  async createOrder(userId, orderData) {
    try {
      // 1. Validate order data
      this.validateOrderData(orderData);
      
      // 2. Verify buyer and seller are verified businesses
      await this.verifyBusinessStatus(orderData.buyerId);
      await this.verifyBusinessStatus(orderData.sellerId);
      
      // 3. Process order items and fetch product details
      const processedItems = await this.processOrderItems(orderData.items);
      
      // 4. Calculate order financials
      const financials = this.calculateOrderFinancials(processedItems);
      
      // 5. Generate order number
      const orderNumber = this.generateOrderNumber();
      
      // 6. Create order record
      const order = await prisma.order.create({
        data: {
          orderNumber: orderNumber,
          buyerId: orderData.buyerId,
          sellerId: orderData.sellerId,
          items: {
            create: processedItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              subtotal: item.subtotal,
              trackAsAsset: item.trackAsAsset,
              insuranceRequired: item.insuranceRequired,
            }))
          },
          subtotal: financials.subtotal,
          tax: financials.tax,
          shippingCost: financials.shippingCost,
          totalAmount: financials.total,
          currency: 'PI',
          status: 'PENDING_APPROVAL',
          paymentStatus: 'PENDING',
          paymentTerms: orderData.paymentTerms,
          shippingAddress: orderData.shippingAddress,
          billingAddress: orderData.billingAddress || orderData.shippingAddress,
          orderDate: new Date(),
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
      
      // 7. Publish order created event
      this.publishOrderCreated(order, userId);
      
      console.log(`[Commerce] Order created: ${order.orderNumber}`);
      
      return order;
    } catch (error) {
      console.error('[Commerce] Error creating order:', error);
      throw error;
    }
  }
  
  /**
   * Mark order as delivered and trigger integrations
   * وضع علامة على الطلب كمُسلّم وتشغيل التكاملات
   */
  async markOrderDelivered(orderId, userId) {
    try {
      // 1. Fetch order with all details
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true
            }
          },
          shipment: true
        }
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.status !== 'SHIPPED') {
        throw new Error('Order must be shipped before marking as delivered');
      }
      
      // 2. Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'DELIVERED',
          deliveredAt: new Date(),
          shipment: {
            update: {
              status: 'DELIVERED',
              deliveredAt: new Date()
            }
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
      
      // 3. Publish delivery event - THIS TRIGGERS ASSET TRACKING AND INSURANCE
      this.publishOrderDelivered(updatedOrder, userId);
      
      console.log(`[Commerce] Order delivered: ${order.orderNumber}`);
      
      return updatedOrder;
    } catch (error) {
      console.error('[Commerce] Error marking order as delivered:', error);
      throw error;
    }
  }
  
  /**
   * Publish order delivered event
   * نشر حدث تسليم الطلب
   */
  publishOrderDelivered(order, userId) {
    const correlationId = `ord_${order.id}`;
    
    // Main delivery event
    const eventData = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      buyerId: order.buyerId,
      items: order.items.map(item => ({
        itemId: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalValue: item.subtotal,
        trackAsAsset: item.trackAsAsset,
        insuranceRequired: item.insuranceRequired,
      })),
      deliveredAt: order.deliveredAt,
      totalValue: order.totalAmount,
    };
    
    eventBus.publish('commerce.order.delivered', eventData, {
      correlationId: correlationId,
      userId: userId,
      timestamp: new Date().toISOString(),
    });
    
    // For each item requiring asset tracking or insurance
    order.items.forEach(item => {
      if (item.trackAsAsset) {
        this.publishAssetTrackingRequest(order, item, userId, correlationId);
      }
      
      if (item.insuranceRequired) {
        this.publishInsuranceRecommendation(order, item, userId, correlationId);
      }
    });
  }
  
  /**
   * Publish asset tracking request
   * نشر طلب تتبع الأصول
   */
  publishAssetTrackingRequest(order, item, userId, correlationId) {
    const eventData = {
      // Commerce references
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderItemId: item.id,
      
      // Product details for asset creation
      productId: item.productId,
      name: item.product.name,
      description: `Purchased via ${order.orderNumber}`,
      quantity: item.quantity,
      purchasePrice: item.unitPrice,
      purchaseDate: order.deliveredAt,
      currentPrice: item.unitPrice,
      
      // Asset classification
      assetType: 'PHYSICAL_ASSET',
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
      correlationId: correlationId,
      userId: userId,
      targetDomain: 'assets',
      timestamp: new Date().toISOString(),
    });
    
    console.log(`[Commerce] Published asset tracking request for item ${item.id}`);
  }
  
  /**
   * Publish insurance recommendation
   * نشر توصية التأمين
   */
  publishInsuranceRecommendation(order, item, userId, correlationId) {
    const eventData = {
      // Commerce references
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderItemId: item.id,
      
      // Item details
      productId: item.productId,
      productName: item.product.name,
      productValue: item.subtotal,
      currency: order.currency,
      
      // Insurance recommendation
      recommendationType: 'PRODUCT_INSURANCE',
      coverageAmount: item.subtotal,
      insuredItemType: 'PHYSICAL_GOODS',
      
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
      correlationId: correlationId,
      userId: userId,
      targetDomain: 'insure',
      timestamp: new Date().toISOString(),
    });
    
    console.log(`[Commerce] Published insurance recommendation for item ${item.id}`);
  }
}

module.exports = CommerceService;
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
   * تهيئة اشتراكات الأحداث
   */
  initialize() {
    this.subscribeCommerceEvents();
  }
  
  /**
   * Subscribe to Commerce domain events
   * الاشتراك في أحداث دومين التجارة
   */
  subscribeCommerceEvents() {
    // Subscribe to asset tracking requests from Commerce
    eventBus.subscribe(
      'commerce.asset.tracking.requested',
      async (eventData, metadata) => {
        console.log('[Assets] Received commerce.asset.tracking.requested event');
        console.log('[Assets] Order:', eventData.orderNumber);
        console.log('[Assets] Product:', eventData.name);
        console.log('[Assets] Value:', eventData.totalValue);
        
        try {
          // Create asset from commerce purchase
          const asset = await this.handleCommerceAssetTracking(eventData, metadata);
          
          console.log(`[Assets] Created asset ${asset.id} from commerce order ${eventData.orderNumber}`);
          
          // Publish asset created event
          this.publishAssetCreated(asset, eventData.userId, metadata);
          
        } catch (error) {
          console.error('[Assets] Error handling commerce asset tracking:', error);
          
          // Publish error event
          eventBus.publish('assets.integration.error', {
            sourceDomain: 'commerce',
            sourceEvent: 'asset.tracking.requested',
            sourceId: eventData.orderId,
            error: error.message,
          }, metadata);
          
          throw error;
        }
      },
      { 
        domain: 'assets',
        description: 'Create asset from Commerce purchase'
      }
    );
  }
  
  /**
   * Handle commerce asset tracking request
   * معالجة طلب تتبع الأصول من التجارة
   */
  async handleCommerceAssetTracking(eventData, metadata) {
    // Get or create default portfolio for user
    let portfolio = await this.assetService.getDefaultPortfolio(eventData.userId);
    
    if (!portfolio) {
      portfolio = await this.assetService.createPortfolio(eventData.userId, {
        name: 'Main Portfolio',
        description: 'Primary asset portfolio',
        currency: eventData.currency,
        isDefault: true,
      });
    }
    
    // Create asset from commerce purchase
    const asset = await this.assetService.createAsset({
      // Portfolio linkage
      portfolioId: portfolio.id,
      
      // Asset classification
      assetTypeId: 'PHYSICAL_ASSET',
      categoryId: 'COMMERCE_PURCHASE',
      
      // Basic information
      name: eventData.name,
      symbol: eventData.productId.slice(0, 8).toUpperCase(),
      description: eventData.description,
      
      // Financial details
      quantity: eventData.quantity,
      purchasePrice: eventData.purchasePrice,
      purchaseDate: new Date(eventData.purchaseDate),
      currentPrice: eventData.currentPrice,
      
      // Integration metadata
      metadata: {
        sourceId: eventData.orderId,
        sourceItemId: eventData.orderItemId,
        sourceDomain: 'commerce',
        orderNumber: eventData.orderNumber,
        productId: eventData.productId,
        integrationTimestamp: metadata.timestamp,
        correlationId: metadata.correlationId,
      },
      
      // Transaction linkage
      relatedDomain: 'commerce',
      relatedTransactionId: eventData.orderId,
    });
    
    return asset;
  }
  
  /**
   * Publish asset created event
   * نشر حدث إنشاء الأصل
   */
  publishAssetCreated(asset, userId, originalMetadata) {
    eventBus.publish('assets.asset.created', {
      assetId: asset.id,
      portfolioId: asset.portfolioId,
      userId: userId,
      assetType: asset.assetTypeId,
      name: asset.name,
      value: parseFloat(asset.currentValue),
      sourceDomain: 'commerce',
      sourceId: asset.metadata.sourceId,
      createdAt: asset.createdAt,
    }, {
      correlationId: originalMetadata.correlationId,
      userId: userId,
      sourceEvent: 'commerce.asset.tracking.requested',
    });
    
    console.log(`[Assets] Published assets.asset.created for ${asset.id}`);
  }
}

module.exports = new AssetsIntegrationService();
```

---

### Phase 3: Insure Domain Processes Insurance Recommendation

```javascript
// File: domains/insure/services/integrationService.js

const eventBus = require('../../../lib/eventBus');
const InsureService = require('./insureService');

class InsureIntegrationService {
  constructor() {
    this.insureService = new InsureService();
  }
  
  /**
   * Initialize event subscriptions
   * تهيئة اشتراكات الأحداث
   */
  initialize() {
    this.subscribeCommerceEvents();
  }
  
  /**
   * Subscribe to Commerce domain events
   * الاشتراك في أحداث دومين التجارة
   */
  subscribeCommerceEvents() {
    // Subscribe to insurance recommendations from Commerce
    eventBus.subscribe(
      'commerce.insurance.recommended',
      async (eventData, metadata) => {
        console.log('[Insure] Received commerce.insurance.recommended event');
        console.log('[Insure] Order:', eventData.orderNumber);
        console.log('[Insure] Product:', eventData.productName);
        console.log('[Insure] Coverage Amount:', eventData.coverageAmount);
        
        try {
          // Create insurance recommendation/quote
          const recommendation = await this.handleCommerceInsuranceRecommendation(
            eventData,
            metadata
          );
          
          console.log(`[Insure] Created insurance recommendation ${recommendation.id}`);
          
          // Publish recommendation created event
          this.publishRecommendationCreated(recommendation, eventData.userId, metadata);
          
        } catch (error) {
          console.error('[Insure] Error handling commerce insurance recommendation:', error);
          throw error;
        }
      },
      { 
        domain: 'insure',
        description: 'Process insurance recommendation from Commerce'
      }
    );
  }
  
  /**
   * Handle commerce insurance recommendation
   * معالجة توصية التأمين من التجارة
   */
  async handleCommerceInsuranceRecommendation(eventData, metadata) {
    // Calculate insurance premium based on coverage amount and risk
    const premium = this.calculatePremium(
      eventData.coverageAmount,
      eventData.insuredItemType
    );
    
    // Create insurance recommendation
    const recommendation = await this.insureService.createRecommendation({
      userId: eventData.userId,
      type: 'PRODUCT_INSURANCE',
      
      // Coverage details
      coverageAmount: eventData.coverageAmount,
      premium: premium,
      term: 12, // 12 months
      currency: eventData.currency,
      
      // Insured item details
      insuredItem: {
        type: eventData.insuredItemType,
        name: eventData.productName,
        value: eventData.productValue,
        purchaseDate: eventData.purchaseDate,
      },
      
      // Integration metadata
      metadata: {
        sourceId: eventData.orderId,
        sourceItemId: eventData.orderItemId,
        sourceDomain: 'commerce',
        orderNumber: eventData.orderNumber,
        correlationId: metadata.correlationId,
      },
      
      // Status
      status: 'RECOMMENDED',
    });
    
    return recommendation;
  }
  
  /**
   * Calculate insurance premium
   * حساب قسط التأمين
   */
  calculatePremium(coverageAmount, itemType) {
    // Simple premium calculation
    // In reality, would consider many factors: risk, location, history, etc.
    const baseRate = itemType === 'PHYSICAL_GOODS' ? 0.03 : 0.02; // 3% or 2%
    return coverageAmount * baseRate;
  }
  
  /**
   * Publish recommendation created event
   * نشر حدث إنشاء التوصية
   */
  publishRecommendationCreated(recommendation, userId, originalMetadata) {
    eventBus.publish('insure.recommendation.created', {
      recommendationId: recommendation.id,
      userId: userId,
      type: recommendation.type,
      coverageAmount: recommendation.coverageAmount,
      premium: recommendation.premium,
      sourceDomain: 'commerce',
      sourceId: recommendation.metadata.sourceId,
      createdAt: recommendation.createdAt,
    }, {
      correlationId: originalMetadata.correlationId,
      userId: userId,
      sourceEvent: 'commerce.insurance.recommended',
    });
    
    console.log(`[Insure] Published insure.recommendation.created for ${recommendation.id}`);
  }
}

module.exports = new InsureIntegrationService();
```

---

## 📊 Complete Event Flow Diagram / مخطط تدفق الأحداث الكامل

```
User Action: Order Delivered
        ↓
[1] Commerce Service
    - Validates delivery
    - Updates order status
    - Identifies items for tracking
        ↓
[2] Publishes Events:
    - commerce.order.delivered
    - commerce.asset.tracking.requested (for trackable items)
    - commerce.insurance.recommended (for insurable items)
        ↓
     Event Bus
    ↙         ↘
   /           \
  /             \
[3a]          [3b]
Assets        Insure
Domain        Domain
  ↓             ↓
Creates       Creates
Asset         Insurance
Record        Recommendation
  ↓             ↓
Publishes     Publishes
Event         Event
  ↓             ↓
assets.       insure.
asset.        recommendation.
created       created
  ↓             ↓
[4] Analytics Domain
    - Updates metrics
    - Generates insights
        ↓
[5] User sees:
    - Order delivered ✓
    - Asset tracked in portfolio ✓
    - Insurance recommendation available ✓
```

---

## 🔍 Event Tracing Example / مثال تتبع الأحداث

### Request Flow with Correlation ID / تدفق الطلب مع معرف الارتباط

```javascript
// Order delivery triggers everything
const correlationId = `ord_${orderId}`;

// [1] Commerce publishes delivery
eventBus.publish('commerce.order.delivered', orderData, {
  correlationId: correlationId,
  userId: 'user_123',
  timestamp: '2026-01-11T14:30:00Z',
});

// [2] Commerce publishes asset tracking request
eventBus.publish('commerce.asset.tracking.requested', assetData, {
  correlationId: correlationId, // Same correlation ID!
  userId: 'user_123',
  targetDomain: 'assets',
});

// [3] Commerce publishes insurance recommendation
eventBus.publish('commerce.insurance.recommended', insureData, {
  correlationId: correlationId, // Same correlation ID!
  userId: 'user_123',
  targetDomain: 'insure',
});

// [4] Assets publishes asset created
eventBus.publish('assets.asset.created', assetCreatedData, {
  correlationId: correlationId, // Same correlation ID!
  userId: 'user_123',
  sourceEvent: 'commerce.asset.tracking.requested',
});

// [5] Insure publishes recommendation created
eventBus.publish('insure.recommendation.created', recommendationData, {
  correlationId: correlationId, // Same correlation ID!
  userId: 'user_123',
  sourceEvent: 'commerce.insurance.recommended',
});

// Now you can trace the entire flow with one correlation ID!
```

---

## 💡 Key Takeaways / النقاط الرئيسية

### English

1. **Loose Coupling**: Domains don't call each other directly
2. **Event-Driven**: All communication through Event Bus
3. **Automatic Integration**: Order delivery automatically triggers asset tracking and insurance
4. **Traceability**: Correlation IDs track entire flow across domains
5. **Digital Sovereignty**: Each domain maintains data sovereignty
6. **Transparency**: Complete audit trail of all operations
7. **Scalability**: Easy to add new consumers (Analytics, Alerts, etc.)

### العربية

1. **الاقتران الفضفاض**: الدومينات لا تتصل ببعضها مباشرة
2. **موجه بالأحداث**: جميع الاتصالات من خلال ناقل الأحداث
3. **التكامل التلقائي**: تسليم الطلب يشغل تلقائياً تتبع الأصول والتأمين
4. **القابلية للتتبع**: معرفات الارتباط تتبع التدفق الكامل عبر الدومينات
5. **السيادة الرقمية**: كل دومين يحتفظ بسيادة البيانات
6. **الشفافية**: مسار تدقيق كامل لجميع العمليات
7. **قابلية التوسع**: سهولة إضافة مستهلكين جدد (التحليلات، التنبيهات، إلخ)

---

## 📚 Related Documentation / الوثائق ذات الصلة

- [Commerce API Examples](../api/examples.md) - API request/response examples
- [Assets Integration](../../assets/integration-example.md) - Assets domain integration
- [Event Bus Documentation](/lib/eventBus.js) - Event Bus implementation
- [Collaboration Guide](/COLLABORATION_GUIDE.md) - Domain development guide

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Maintained By**: TEC Integration Team
