# Commerce Domain (Domain 4) - B2B Trading & Business Solutions

# دومين التجارة (الدومين الرابع) - التجارة B2B والحلول التجارية

---

## 🌐 Language / اللغة

- [English Version](#english-version)
- [النسخة العربية](#النسخة-العربية)

---

# English Version

## 🎯 Domain Mission

**Commerce** (commerce.pi) is the **fourth domain** in the TEC Ecosystem strategic launch sequence, serving as the premier B2B trading platform that facilitates business-to-business transactions, supplier networks, and wholesale marketplaces powered by Pi Network.

**Strategic Launch Position**: **Domain 4** (in launch sequence)

- Launch 1: **Assets** - Portfolio Management & Asset Tracking
- Launch 2: **Insure** - Insurance & Risk Management
- Launch 3: **FundX** - Investment Strategies & Portfolio Optimization
- **Launch 4: Commerce** - B2B Trading & Business Solutions ← Current Domain

_Note: In the overall TEC Ecosystem of 24 domains, Commerce is positioned as domain #10 within the "Commerce & Marketplace" category. However, in the strategic launch sequence, it is the 4th domain to be deployed._

**Vision**: To create a transparent, efficient, and sovereign digital marketplace where businesses can trade with complete control over their data and transactions, leveraging blockchain technology for unparalleled transparency and security.

**Core Values**:

- **Digital Sovereignty**: Complete control over business data and transactions
- **Transparency**: Immutable transaction records on blockchain
- **Efficiency**: Streamlined B2B processes powered by smart contracts
- **Trust**: Verified suppliers and secure payment systems
- **Accessibility**: Fair access to wholesale markets for all businesses

## 📋 Core Features

### 1. B2B Marketplace

- **Product Catalog**: Comprehensive wholesale product listings
- **Bulk Ordering**: Minimum Order Quantities (MOQ) and volume discounts
- **Product Discovery**: Advanced search and filtering
- **Category Management**: Organized product hierarchies
- **Product Variants**: Size, color, specification options

### 2. Supplier Network

- **Verified Suppliers**: Rigorous supplier verification process
- **Supplier Profiles**: Company information, capabilities, certifications
- **Supplier Ratings**: Reviews, ratings, and performance metrics
- **Direct Communication**: Built-in messaging system
- **RFQ System**: Request for Quote functionality

### 3. Order Management

- **Purchase Orders**: Create and track POs with PO numbers
- **Order Tracking**: Real-time shipment tracking
- **Invoicing**: Automated invoice generation
- **Payment Terms**: NET 30, NET 60, advance payment options
- **Order History**: Complete transaction records

### 4. Seller Hub

- **Inventory Management**: Stock levels, SKU management
- **Order Fulfillment**: Process orders, manage shipments
- **Sales Analytics**: Revenue, bestsellers, customer insights
- **Payment Dashboard**: Track payments and settlements
- **Performance Metrics**: Seller performance tracking

### 5. Payment & Financing

- **Pi Payments**: Accept Pi cryptocurrency
- **Payment Terms**: Flexible payment options
- **Trade Credit**: Credit lines for qualified buyers
- **Escrow Service**: Secure payment holding
- **Multi-Currency**: Support for multiple currencies

## 🏗️ Data Architecture

### Entity Relationship Overview

```
Business (1) ──────< (M) Product
                           │
User (1) ──────< (M) Order ──────> (M) OrderItem
      │                    │
      └──< Review          └──< Payment
                                    │
Seller (1) ──────< (M) Product     └──< Invoice
              │
              └──< SellerVerification
```

### Core Entities

#### 1. Business

Company profile for B2B transactions.

**Attributes:**

- `id`: Unique identifier (UUID)
- `name`: Company legal name
- `tradeName`: Trading name
- `type`: Business type (MANUFACTURER, DISTRIBUTOR, WHOLESALER, RETAILER)
- `taxId`: Tax identification number
- `registrationNumber`: Business registration number
- `address`: Business address (JSON)
- `contactInfo`: Contact details (JSON)
- `verificationStatus`: Verification level (PENDING, VERIFIED, PREMIUM)
- `creditLimit`: Approved credit limit
- `paymentTerms`: Default payment terms
- `createdAt`: Registration date

#### 2. Product

Product listing in B2B marketplace.

**Attributes:**

- `id`: Unique identifier (UUID)
- `sellerId`: Seller business ID
- `sku`: Stock Keeping Unit
- `name`: Product name
- `description`: Detailed description
- `category`: Product category
- `subcategory`: Product subcategory
- `unitPrice`: Price per unit
- `currency`: Currency (PI, USD, EUR)
- `moq`: Minimum Order Quantity
- `stockQuantity`: Available stock
- `leadTime`: Production/delivery lead time (days)
- `specifications`: Product specs (JSON)
- `images`: Product images array
- `certifications`: Quality certifications
- `status`: Status (ACTIVE, OUT_OF_STOCK, DISCONTINUED)
- `createdAt`: Listing date

#### 3. Order

Purchase order between businesses.

**Attributes:**

- `id`: Unique identifier (UUID)
- `poNumber`: Purchase Order number
- `buyerId`: Buyer business ID
- `sellerId`: Seller business ID
- `orderDate`: Order creation date
- `status`: Order status (DRAFT, SUBMITTED, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED)
- `totalAmount`: Total order value
- `currency`: Order currency
- `paymentTerms`: Payment terms for this order
- `paymentStatus`: Payment status (PENDING, PARTIAL, PAID, OVERDUE)
- `shippingAddress`: Delivery address (JSON)
- `shippingMethod`: Shipping method
- `trackingNumber`: Shipment tracking number
- `notes`: Order notes
- `dueDate`: Payment due date
- `createdAt`: Order date

#### 4. OrderItem

Line item in purchase order.

**Attributes:**

- `id`: Unique identifier
- `orderId`: Parent order ID
- `productId`: Product reference
- `sku`: Product SKU
- `quantity`: Ordered quantity
- `unitPrice`: Price per unit
- `subtotal`: Line item total
- `discount`: Applied discount
- `taxAmount`: Tax amount
- `totalAmount`: Final line item amount

#### 5. Seller

Seller account and capabilities.

**Attributes:**

- `id`: Unique identifier
- `businessId`: Business reference
- `userId`: Account owner
- `sellerType`: Type (MANUFACTURER, DISTRIBUTOR, AUTHORIZED_RESELLER)
- `capabilities`: Seller capabilities (JSON)
- `performanceScore`: Performance rating (0-100)
- `totalOrders`: Lifetime order count
- `totalRevenue`: Lifetime revenue
- `responseTime`: Average response time (hours)
- `fulfillmentRate`: Order fulfillment percentage
- `disputeRate`: Dispute rate percentage
- `isActive`: Seller status
- `verifiedAt`: Verification date

## 🔌 API Endpoints

### Products

- `GET /api/commerce/products` - Browse products
- `GET /api/commerce/products/:id` - Get product details
- `POST /api/commerce/products` - Create product (seller)
- `PUT /api/commerce/products/:id` - Update product (seller)
- `DELETE /api/commerce/products/:id` - Remove product (seller)
- `GET /api/commerce/products/categories` - Get categories

### Orders

- `POST /api/commerce/orders` - Create purchase order
- `GET /api/commerce/orders` - List orders (buyer/seller view)
- `GET /api/commerce/orders/:id` - Get order details
- `PUT /api/commerce/orders/:id` - Update order
- `POST /api/commerce/orders/:id/confirm` - Confirm order (seller)
- `POST /api/commerce/orders/:id/ship` - Mark as shipped
- `POST /api/commerce/orders/:id/complete` - Complete order
- `POST /api/commerce/orders/:id/cancel` - Cancel order

### Sellers

- `GET /api/commerce/sellers` - Find suppliers
- `GET /api/commerce/sellers/:id` - Get seller profile
- `POST /api/commerce/sellers/register` - Register as seller
- `PUT /api/commerce/sellers/:id` - Update seller profile
- `GET /api/commerce/sellers/:id/products` - Seller's products
- `GET /api/commerce/sellers/:id/reviews` - Seller reviews

### Quotes & RFQ

- `POST /api/commerce/quotes/request` - Request bulk quote (RFQ)
- `GET /api/commerce/quotes` - List quotes
- `POST /api/commerce/quotes/:id/respond` - Respond to RFQ (seller)
- `POST /api/commerce/quotes/:id/accept` - Accept quote (buyer)

### Reviews

- `POST /api/commerce/reviews` - Create review
- `GET /api/commerce/reviews` - Get product/seller reviews
- `PUT /api/commerce/reviews/:id` - Update review
- `DELETE /api/commerce/reviews/:id` - Delete review

## 🔗 Integration Map & Domain Relationships

### Position in TEC Ecosystem

Commerce is the **4th domain** and acts as a central trading hub that connects with other domains:

```
┌─────────────────────────────────────────────────────────┐
│                    TEC ECOSYSTEM                        │
├─────────────────────────────────────────────────────────┤
│  Domain 1: Assets    →  Asset tracking for purchases   │
│  Domain 2: Insure    →  Transaction protection         │
│  Domain 3: FundX     →  Trade financing                │
│  Domain 4: COMMERCE  →  Central B2B marketplace ★      │
│  Domain 5+: Other domains...                           │
└─────────────────────────────────────────────────────────┘
```

### Integration Architecture

**Event-Driven Communication**:

```javascript
// Commerce publishes events to Event Bus
eventBus.emit('commerce.order.completed', {
  orderId: 'ORD-2026-001',
  buyerId: 'buyer_123',
  sellerId: 'seller_456',
  totalAmount: 50000,
  products: [...],
  timestamp: '2026-01-04T10:00:00Z'
});

// Other domains listen and react
// Assets: Creates asset records
// Analytics: Updates sales statistics
// Insure: Checks for insurance coverage
```

**API Integration**:

```javascript
// RESTful API endpoints for synchronous operations
POST /api/commerce/orders
GET /api/commerce/products
PUT /api/commerce/orders/:id

// GraphQL for complex queries
query {
  commerceOrders(buyerId: "buyer_123") {
    id
    products { name, price }
    seller { name, rating }
  }
}
```

### Incoming: Commerce Dependencies

#### Domain 1: Assets → Commerce

**Relationship**: Asset Valuation & Inventory Management

**Integration Flow**:

```
Assets Domain                Commerce Domain
     ↓                            ↑
  User purchases product    →  Order created
     ↓                            ↓
  Asset created automatically  ←  Event published
     ↓
  Inventory tracked as asset
```

**Events Consumed**:

- None (Commerce doesn't consume Assets events)

**Events Published to Assets**:

- `commerce.product.purchased` - When high-value product purchased
- `commerce.order.completed` - For inventory asset creation

**Use Cases**:

- Track purchased inventory as assets in portfolio
- Valuation of business inventory
- Equipment and high-value item tracking

#### Domain 2: Insure → Commerce

**Relationship**: Transaction Insurance & Risk Protection

**Integration Flow**:

```
Insure Domain                Commerce Domain
     ↓                            ↑
  Insurance offer          ←  High-value order
     ↓                            ↓
  Coverage created         →  Order protected
     ↓                            ↓
  Claims processed         ←  Dispute/damage
```

**Events Consumed**:

- `insure.policy.created` - Insurance coverage active
- `insure.claim.approved` - Payout for damaged goods

**Events Published to Insure**:

- `commerce.order.created` - Trigger insurance offer
- `commerce.shipment.issue` - Potential claim trigger

**Use Cases**:

- Transaction insurance for B2B purchases
- Shipping and delivery protection
- Product quality guarantees

#### Domain 3: FundX → Commerce

**Relationship**: Trade Financing & Investment

**Integration Flow**:

```
FundX Domain                 Commerce Domain
     ↓                            ↑
  Trade credit available    ←  Purchase request
     ↓                            ↓
  Credit line approved      →  Order financed
     ↓                            ↓
  Payment settled          ←  Order completed
```

**Events Consumed**:

- `fundx.credit.approved` - Trade credit available
- `fundx.investment.liquidated` - Funds available for purchases

**Events Published to FundX**:

- `commerce.order.payment_due` - Credit payment required
- `commerce.seller.revenue` - Investment performance data

**Use Cases**:

- Trade credit for bulk purchases
- Supplier financing options
- Working capital management

#### NBF Domain → Commerce

**Relationship**: Payment Processing & Banking

**Integration Flow**:

- **Payment Processing**: Process Pi payments for orders
- **Trade Credit**: Credit lines and financing
- **Invoice Factoring**: Early payment options

#### DX Domain → Commerce

**Relationship**: External Integrations

**Integration Flow**:

- **API Integration**: Connect external marketplaces
- **ERP Integration**: Integrate with business systems
- **Data Exchange**: Import/export product catalogs

### Outgoing: Commerce Services

#### Commerce → Assets (Domain 1)

**Flow**: Purchase → Asset Creation

**Technical Implementation**:

```javascript
// When order completes, create asset in Assets domain
async function handleOrderCompletion(order) {
  if (order.trackAsAsset && order.totalAmount > ASSET_THRESHOLD) {
    await eventBus.emit("commerce.asset.create", {
      orderId: order.id,
      assetType: "INVENTORY",
      name: order.products.map((p) => p.name).join(", "),
      purchasePrice: order.totalAmount,
      quantity: order.totalQuantity,
      purchaseDate: order.completedAt,
      metadata: {
        supplier: order.seller,
        category: order.category,
        invoiceNumber: order.invoiceNumber,
      },
    });
  }
}
```

#### Commerce → Insure (Domain 2)

**Flow**: Order → Insurance Recommendation

**Technical Implementation**:

```javascript
// Suggest insurance for high-value orders
async function processOrder(order) {
  if (order.totalAmount > INSURANCE_THRESHOLD) {
    await eventBus.emit("commerce.insurance.recommend", {
      orderId: order.id,
      orderValue: order.totalAmount,
      shippingMethod: order.shippingMethod,
      buyer: order.buyerId,
      recommendationType: "SHIPMENT_PROTECTION",
    });
  }
}
```

#### Commerce → FundX (Domain 3)

**Flow**: Payment Need → Financing Offer

**Technical Implementation**:

```javascript
// Offer trade financing for large orders
async function checkFinancingOptions(order) {
  if (order.totalAmount > FINANCING_THRESHOLD) {
    await eventBus.emit("commerce.financing.needed", {
      orderId: order.id,
      amount: order.totalAmount,
      buyer: order.buyerId,
      paymentTerms: order.paymentTerms,
      creditScore: order.buyer.creditScore,
    });
  }
}
```

#### Commerce → Alert

**Flow**: Transaction Events → Notifications

**Published Events**:

- **Order Notifications**: Order status updates
- **Inventory Alerts**: Low stock notifications
- **Shipment Tracking**: Delivery updates

#### Commerce → Analytics

**Flow**: Business Data → Insights

**Published Events**:

- **Sales Data**: Transaction and revenue data
- **Performance Metrics**: Seller and product analytics
- **Market Trends**: Category and pricing trends

#### Commerce → System

**Flow**: Audit & Monitoring

**Published Events**:

- **Transaction Logs**: Audit trail for compliance
- **Performance Metrics**: System usage statistics

### Digital Sovereignty Features

**1. Data Ownership**

- Businesses own all their transaction data
- Complete data export capabilities
- No vendor lock-in

**2. Transparent Operations**

- All transactions recorded on blockchain
- Immutable audit trails
- Public verification of transactions

**3. Decentralized Control**

- No central authority can block transactions
- Peer-to-peer trading capabilities
- Smart contract automation

**4. Privacy Controls**

- Businesses control data sharing
- Selective visibility settings
- Encrypted communications

**5. Sovereign Payment Rails**

- Pi Network native payments
- No intermediary fees
- Direct peer-to-peer settlements

## 💼 Business Logic

### Order Creation Flow

```javascript
1. Buyer browses products
2. Adds products to cart (checks MOQ)
3. Reviews cart, applies discounts
4. Creates purchase order
5. System generates PO number
6. Seller receives order notification
7. Seller confirms order
8. Payment processing initiated
9. Order enters fulfillment
10. Tracking number provided
11. Shipment tracking updates
12. Delivery confirmation
13. Invoice finalization
14. Payment settlement
```

### Seller Verification Process

```javascript
1. Seller submits application
2. Provide business documentation
3. Verify business registration
4. Check tax ID validity
5. Review business credentials
6. Conduct background check
7. Approve or reject application
8. Set credit limits if approved
9. Activate seller account
10. Send welcome notification
```

### Price Calculation

```javascript
// Import constants from centralized constants file
import {
  PREMIUM_MULTIPLIER,
  BULK_DISCOUNT_MULTIPLIER,
  MEDIUM_DISCOUNT_MULTIPLIER,
  VAT_RATE,
} from "../../private/lib/constants.js";

// Calculate final price with volume discount
function calculateOrderTotal(items) {
  let subtotal = 0;

  items.forEach((item) => {
    let unitPrice = item.basePrice;

    // Apply volume discount
    // Note: Using PREMIUM_MULTIPLIER (0.85) for highest volume tier
    // as it provides the same 15% discount rate
    if (item.quantity >= 1000) {
      unitPrice *= PREMIUM_MULTIPLIER; // 15% discount (0.85 multiplier)
    } else if (item.quantity >= 500) {
      unitPrice *= BULK_DISCOUNT_MULTIPLIER; // 10% discount (0.90 multiplier)
    } else if (item.quantity >= 100) {
      unitPrice *= MEDIUM_DISCOUNT_MULTIPLIER; // 5% discount (0.95 multiplier)
    }

    subtotal += unitPrice * item.quantity;
  });

  // Apply tax
  const tax = subtotal * VAT_RATE; // 10% VAT (0.10 rate)

  return subtotal + tax;
}
```

## 🛠️ Engineering Recommendations

### Architecture Patterns

1. **Microservices**: Separate services for catalog, orders, payments
2. **Event-Driven**: Use events for order status changes
3. **CQRS**: Separate read/write models for scalability
4. **Saga Pattern**: Distributed transactions across domains

### Performance Optimization

1. **Product Search**: Elasticsearch for fast product search
2. **Caching**: Redis for frequently accessed products
3. **CDN**: Cache product images on CDN
4. **Database Indexing**: Index on category, seller, price

### Data Management

1. **Inventory Sync**: Real-time inventory updates
2. **Price History**: Track historical pricing
3. **Order Archive**: Archive completed orders after 1 year
4. **Data Partitioning**: Partition by seller or date

### Security Best Practices

1. **Business Verification**: Rigorous KYB (Know Your Business)
2. **Fraud Detection**: Monitor suspicious order patterns
3. **Payment Security**: PCI compliance for card payments
4. **API Rate Limiting**: Prevent scraping and abuse

## 📊 Sample Data Models

### Product Example

```json
{
  "id": "prod_tech_laptop_001",
  "sellerId": "seller_xyz_corp",
  "sku": "LPT-15-I7-16-512",
  "name": "Business Laptop 15\" i7",
  "description": "High-performance business laptop",
  "category": "Electronics",
  "subcategory": "Computers",
  "unitPrice": 800,
  "currency": "PI",
  "moq": 10,
  "stockQuantity": 500,
  "leadTime": 7,
  "specifications": {
    "processor": "Intel Core i7",
    "ram": "16GB",
    "storage": "512GB SSD",
    "display": "15.6\" FHD"
  },
  "certifications": ["CE", "FCC", "ISO9001"],
  "status": "ACTIVE"
}
```

### Order Example

```json
{
  "id": "order_2026_001234",
  "poNumber": "PO-2026-001234",
  "buyerId": "buyer_abc_inc",
  "sellerId": "seller_xyz_corp",
  "orderDate": "2026-01-04T10:00:00Z",
  "status": "CONFIRMED",
  "items": [
    {
      "productId": "prod_tech_laptop_001",
      "quantity": 50,
      "unitPrice": 760,
      "subtotal": 38000
    }
  ],
  "totalAmount": 41800,
  "currency": "PI",
  "paymentTerms": "NET_30",
  "paymentStatus": "PENDING",
  "dueDate": "2026-02-03"
}
```

## 🛠️ Operational Requirements

### Infrastructure Requirements

**1. Runtime Environment**

- Node.js 18+ LTS
- Next.js 15.5+
- React latest version
- PostgreSQL 14+ database

**2. External Services**

- **Pi Network SDK**: For authentication and payments
- **Event Bus**: Redis or RabbitMQ for inter-domain communication
- **Storage**: S3-compatible object storage for product images and documents
- **Search Engine**: Elasticsearch for product search (optional but recommended)
- **Cache**: Redis for session and data caching

**3. Network Configuration**

- Domain: `commerce.pi` (or subdomain under tec.pi)
- SSL/TLS certificates required
- CDN for static assets and images
- Load balancer for high availability

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/commerce"

# Pi Network
PI_API_KEY="YOUR_PI_API_KEY_HERE"
PI_WALLET_PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY_HERE"
PI_NETWORK="mainnet" # or testnet

# Event Bus
EVENT_BUS_TYPE="redis" # or rabbitmq
REDIS_URL="redis://localhost:6379"

# Storage
S3_BUCKET="commerce-assets"
S3_REGION="us-east-1"
S3_ACCESS_KEY="YOUR_S3_ACCESS_KEY_HERE"
S3_SECRET_KEY="YOUR_S3_SECRET_KEY_HERE"

# Search (Optional)
ELASTICSEARCH_URL="http://localhost:9200"

# Integration
ASSETS_API_URL="http://assets.tec.pi/api"
INSURE_API_URL="http://insure.tec.pi/api"
FUNDX_API_URL="http://fundx.tec.pi/api"

# Thresholds (in Pi)
ASSET_TRACKING_THRESHOLD=10000
INSURANCE_RECOMMENDATION_THRESHOLD=5000
FINANCING_OFFER_THRESHOLD=25000
```

### Deployment Steps

**1. Initial Setup**

```bash
# Clone repository (replace with your repository URL)
git clone https://github.com/<YOUR_ORG>/tec-ecosystem.git
cd tec-ecosystem

# Install dependencies
npm install

# Setup database
npx prisma migrate deploy
npx prisma generate
```

**2. Domain Configuration**

```bash
# Configure environment
cp .env.example domains/commerce/.env
nano domains/commerce/.env

# Run database seeders
npm run seed:commerce
```

**3. Event Bus Setup**

```bash
# Start Redis (if using Redis)
docker run -d -p 6379:6379 redis:latest

# Or start RabbitMQ (if using RabbitMQ)
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management
```

**4. Start Development Server**

```bash
npm run dev:commerce
# Access at http://localhost:3000/commerce
```

**5. Production Deployment**

```bash
# Build for production
npm run build

# Start production server
npm run start

# Or deploy to Vercel/Netlify
vercel deploy --prod
```

### Integration Checklist

- [ ] **Pi Network Integration**
  - [ ] Pi SDK configured and tested
  - [ ] Authentication flow working
  - [ ] Payment processing functional

- [ ] **Event Bus Connection**
  - [ ] Event bus running and accessible
  - [ ] Events publishing successfully
  - [ ] Event listeners configured

- [ ] **Domain Integrations**
  - [ ] Assets domain API accessible
  - [ ] Insure domain API accessible
  - [ ] FundX domain API accessible
  - [ ] Event subscriptions active

- [ ] **Database & Storage**
  - [ ] Database migrations completed
  - [ ] Object storage configured
  - [ ] Backup strategy in place

- [ ] **Monitoring & Logging**
  - [ ] Application logging enabled
  - [ ] Error tracking configured
  - [ ] Performance monitoring active
  - [ ] Audit logs recording

### Performance Optimization

**1. Database Optimization**

- Index on frequently queried fields (sellerId, buyerId, status)
- Partition large tables by date
- Regular VACUUM and ANALYZE operations

**2. Caching Strategy**

- Product catalog in Redis (TTL: 1 hour)
- Seller profiles in cache (TTL: 30 minutes)
- Search results cached (TTL: 15 minutes)

**3. API Rate Limiting**

```javascript
// Prevent abuse and ensure fair usage
const rateLimits = {
  anonymous: "100/hour",
  authenticated: "1000/hour",
  premium: "10000/hour",
  api_partner: "100000/hour",
};
```

**4. Image Optimization**

- Use CDN for product images
- Generate multiple image sizes
- Lazy loading for product catalogs
- WebP format support

### Security Requirements

**1. Authentication & Authorization**

- Pi Network SSO integration
- Role-based access control (RBAC)
- API key authentication for partners
- JWT tokens for session management

**2. Data Protection**

- Encrypt sensitive data at rest
- TLS 1.3 for data in transit
- PCI compliance for payment data
- GDPR compliance for EU users

**3. Fraud Prevention**

- Transaction monitoring
- Suspicious activity detection
- Rate limiting on critical endpoints
- KYB (Know Your Business) verification

**4. Audit & Compliance**

- Immutable transaction logs
- Blockchain verification
- Regular security audits
- Compliance reporting tools

### Monitoring & Alerting

**Key Metrics to Monitor**:

- Order processing time
- Payment success rate
- API response times
- Event bus latency
- Database query performance
- Error rates by endpoint

**Alert Thresholds**:

- Error rate > 1%
- API response time > 1000ms
- Failed payments > 5%
- Event bus lag > 5 minutes
- Database connection pool > 80%

### Disaster Recovery

**1. Backup Strategy**

- Database: Daily full backup, hourly incrementals
- Files: Real-time replication to secondary region
- Configurations: Version controlled in Git

**2. Recovery Procedures**

- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 15 minutes
- Automated failover to backup systems
- Regular disaster recovery drills

### Scaling Considerations

**Horizontal Scaling**:

- Stateless application design
- Load balancer distribution
- Database read replicas
- Distributed caching

**Vertical Scaling**:

- Database: Upgrade to higher-tier instances
- Cache: Increase Redis memory
- Storage: Expand object storage capacity

---

## 📚 Additional Resources

### For Developers

- **[API Documentation](./api/README.md)** - Complete API reference
- **[Event Schemas](./events/schemas.md)** - Event structure definitions
- **[Integration Guide](./docs/integration.md)** - Step-by-step integration
- **[Testing Guide](./docs/testing.md)** - How to test Commerce domain

### For Business Users

- **[User Guide](./docs/user-guide.md)** - How to use Commerce platform
- **[Seller Handbook](./docs/seller-handbook.md)** - Guide for sellers
- **[Buyer Guide](./docs/buyer-guide.md)** - Guide for buyers

### For System Administrators

- **[Deployment Guide](./docs/deployment.md)** - Production deployment
- **[Monitoring Guide](./docs/monitoring.md)** - System monitoring
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues

---

**Domain Owner**: Commerce Team
**Status**: Active Development
**Priority**: HIGH - Critical for B2B ecosystem
**Last Updated**: January 2026

**Next Steps:**

1. Complete seller registration and verification
2. Integrate payment processing with NBF
3. Build advanced search with Elasticsearch
4. Implement RFQ system
5. Add multi-currency support

---

# النسخة العربية

## 🎯 مهمة الدومين

**التجارة** (commerce.pi) هو **الدومين الرابع** في تسلسل الإطلاق الاستراتيجي لنظام TEC البيئي، ويعمل كمنصة التجارة B2B الرائدة التي تسهل المعاملات بين الشركات وشبكات الموردين وأسواق الجملة المدعومة بشبكة Pi.

**موقع الإطلاق الاستراتيجي**: **الدومين 4** (في تسلسل الإطلاق)

- الإطلاق 1: **الأصول** - إدارة المحفظة وتتبع الأصول
- الإطلاق 2: **التأمين** - إدارة التأمين والمخاطر
- الإطلاق 3: **FundX** - استراتيجيات الاستثمار وتحسين المحفظة
- **الإطلاق 4: التجارة** - التجارة B2B والحلول التجارية ← الدومين الحالي

_ملاحظة: في نظام TEC البيئي الشامل المكون من 24 دومين، يتم وضع التجارة كدومين رقم 10 ضمن فئة "التجارة والأسواق". ومع ذلك، في تسلسل الإطلاق الاستراتيجي، هو الدومين الرابع الذي سيتم نشره._

**الرؤية**: إنشاء سوق رقمي شفاف وفعال وذو سيادة حيث يمكن للشركات التجارة مع سيطرة كاملة على بياناتها ومعاملاتها، مستفيدة من تقنية البلوكشين لتحقيق شفافية وأمان لا مثيل لهما.

**القيم الأساسية**:

- **السيادة الرقمية**: سيطرة كاملة على بيانات الأعمال والمعاملات
- **الشفافية**: سجلات معاملات غير قابلة للتغيير على البلوكشين
- **الكفاءة**: عمليات B2B مبسطة مدعومة بالعقود الذكية
- **الثقة**: موردون موثوقون وأنظمة دفع آمنة
- **إمكانية الوصول**: وصول عادل لأسواق الجملة لجميع الشركات

## 📋 الميزات الأساسية

### 1. سوق B2B

- **كتالوج المنتجات**: قوائم منتجات الجملة الشاملة
- **الطلب بالجملة**: الحد الأدنى لكميات الطلب (MOQ) وخصومات الحجم
- **اكتشاف المنتجات**: بحث وتصفية متقدمة
- **إدارة الفئات**: تسلسلات هرمية منظمة للمنتجات
- **متغيرات المنتج**: خيارات الحجم واللون والمواصفات

### 2. شبكة الموردين

- **موردون موثوقون**: عملية التحقق الصارمة من الموردين
- **ملفات الموردين**: معلومات الشركة والقدرات والشهادات
- **تقييمات الموردين**: المراجعات والتقييمات ومقاييس الأداء
- **التواصل المباشر**: نظام المراسلة المدمج
- **نظام RFQ**: وظيفة طلب عرض الأسعار

### 3. إدارة الطلبات

- **أوامر الشراء**: إنشاء وتتبع أوامر الشراء مع أرقام PO
- **تتبع الطلبات**: تتبع الشحنات في الوقت الفعلي
- **الفواتير**: إنشاء الفواتير التلقائي
- **شروط الدفع**: خيارات NET 30، NET 60، الدفع المسبق
- **سجل الطلبات**: سجلات المعاملات الكاملة

### 4. مركز البائع

- **إدارة المخزون**: مستويات المخزون، إدارة SKU
- **تنفيذ الطلبات**: معالجة الطلبات، إدارة الشحنات
- **تحليلات المبيعات**: الإيرادات، الأكثر مبيعًا، رؤى العملاء
- **لوحة الدفع**: تتبع المدفوعات والتسويات
- **مقاييس الأداء**: تتبع أداء البائع

### 5. الدفع والتمويل

- **مدفوعات Pi**: قبول عملة Pi المشفرة
- **شروط الدفع**: خيارات دفع مرنة
- **الائتمان التجاري**: خطوط ائتمان للمشترين المؤهلين
- **خدمة الضمان**: الاحتفاظ الآمن بالدفع
- **متعدد العملات**: دعم عملات متعددة

## 🔗 خريطة التكامل وعلاقات الدومينات

### الموقع في نظام TEC البيئي

التجارة هو **الدومين الرابع** ويعمل كمركز تجاري مركزي يربط مع الدومينات الأخرى:

```
┌─────────────────────────────────────────────────────────┐
│                    نظام TEC البيئي                     │
├─────────────────────────────────────────────────────────┤
│  الدومين 1: الأصول    →  تتبع الأصول للمشتريات       │
│  الدومين 2: التأمين   →  حماية المعاملات             │
│  الدومين 3: FundX     →  تمويل التجارة                │
│  الدومين 4: التجارة   →  سوق B2B المركزي ★           │
│  الدومين 5+: دومينات أخرى...                          │
└─────────────────────────────────────────────────────────┘
```

### معمارية التكامل

**التواصل الموجه بالأحداث**:

```javascript
// التجارة تنشر أحداثًا إلى ناقل الأحداث
eventBus.emit('commerce.order.completed', {
  orderId: 'ORD-2026-001',
  buyerId: 'buyer_123',
  sellerId: 'seller_456',
  totalAmount: 50000,
  products: [...],
  timestamp: '2026-01-04T10:00:00Z'
});

// الدومينات الأخرى تستمع وتتفاعل
// الأصول: ينشئ سجلات الأصول
// التحليلات: يحدث إحصائيات المبيعات
// التأمين: يتحقق من التغطية التأمينية
```

**تكامل API**:

```javascript
// نقاط نهاية RESTful API للعمليات المتزامنة
POST /api/commerce/orders
GET /api/commerce/products
PUT /api/commerce/orders/:id

// GraphQL للاستعلامات المعقدة
query {
  commerceOrders(buyerId: "buyer_123") {
    id
    products { name, price }
    seller { name, rating }
  }
}
```

### علاقات الدومينات

#### الدومين 1: الأصول ↔ التجارة

**العلاقة**: تقييم الأصول وإدارة المخزون

**تدفق التكامل**:

- عند إتمام طلب لمنتج عالي القيمة، يتم إنشاء أصل تلقائيًا في دومين الأصول
- تتبع المخزون المشترى كأصول في المحفظة
- مزامنة التقييمات لحساب صافي الثروة بدقة

**حالات الاستخدام**:

- تتبع المخزون المشترى كأصول في المحفظة
- تقييم مخزون الأعمال
- تتبع المعدات والأصناف عالية القيمة

#### الدومين 2: التأمين ↔ التجارة

**العلاقة**: تأمين المعاملات وحماية المخاطر

**تدفق التكامل**:

- عند إنشاء طلب عالي القيمة، يقترح دومين التأمين تغطية تأمينية
- حماية الشحنات والمنتجات أثناء النقل
- معالجة المطالبات في حالة التلف أو الفقدان

**حالات الاستخدام**:

- تأمين المعاملات للمشتريات B2B
- حماية الشحن والتسليم
- ضمانات جودة المنتج

#### الدومين 3: FundX ↔ التجارة

**العلاقة**: تمويل التجارة والاستثمار

**تدفق التكامل**:

- توفير خطوط ائتمان تجارية للمشتريات الكبيرة
- تمويل الموردين وخيارات رأس المال العامل
- بيانات أداء الاستثمار من إيرادات البائع

**حالات الاستخدام**:

- الائتمان التجاري للمشتريات بالجملة
- خيارات تمويل الموردين
- إدارة رأس المال العامل

### ميزات السيادة الرقمية

**1. ملكية البيانات**

- الشركات تمتلك جميع بيانات معاملاتها
- إمكانيات تصدير البيانات الكاملة
- لا يوجد قفل للبائع

**2. العمليات الشفافة**

- جميع المعاملات مسجلة على البلوكشين
- مسارات تدقيق غير قابلة للتغيير
- التحقق العام من المعاملات

**3. التحكم اللامركزي**

- لا يمكن لأي سلطة مركزية حظر المعاملات
- قدرات التداول من نظير إلى نظير
- أتمتة العقود الذكية

**4. ضوابط الخصوصية**

- الشركات تتحكم في مشاركة البيانات
- إعدادات الرؤية الانتقائية
- الاتصالات المشفرة

**5. سكك الدفع السيادية**

- مدفوعات Pi Network الأصلية
- لا توجد رسوم وسيط
- تسويات مباشرة من نظير إلى نظير

## 🔌 نقاط نهاية الواجهة البرمجية (API)

### المنتجات

- `GET /api/commerce/products` - تصفح المنتجات
- `GET /api/commerce/products/:id` - الحصول على تفاصيل المنتج
- `POST /api/commerce/products` - إنشاء منتج (بائع)
- `PUT /api/commerce/products/:id` - تحديث المنتج (بائع)
- `DELETE /api/commerce/products/:id` - إزالة المنتج (بائع)
- `GET /api/commerce/products/categories` - الحصول على الفئات

### الطلبات

- `POST /api/commerce/orders` - إنشاء أمر شراء
- `GET /api/commerce/orders` - قائمة الطلبات (عرض المشتري/البائع)
- `GET /api/commerce/orders/:id` - الحصول على تفاصيل الطلب
- `PUT /api/commerce/orders/:id` - تحديث الطلب
- `POST /api/commerce/orders/:id/confirm` - تأكيد الطلب (بائع)
- `POST /api/commerce/orders/:id/ship` - وضع علامة كمشحون
- `POST /api/commerce/orders/:id/complete` - إكمال الطلب
- `POST /api/commerce/orders/:id/cancel` - إلغاء الطلب

### البائعون

- `GET /api/commerce/sellers` - البحث عن موردين
- `GET /api/commerce/sellers/:id` - الحصول على ملف البائع
- `POST /api/commerce/sellers/register` - التسجيل كبائع
- `PUT /api/commerce/sellers/:id` - تحديث ملف البائع
- `GET /api/commerce/sellers/:id/products` - منتجات البائع
- `GET /api/commerce/sellers/:id/reviews` - مراجعات البائع

### عروض الأسعار و RFQ

- `POST /api/commerce/quotes/request` - طلب عرض أسعار بالجملة (RFQ)
- `GET /api/commerce/quotes` - قائمة العروض
- `POST /api/commerce/quotes/:id/respond` - الرد على RFQ (بائع)
- `POST /api/commerce/quotes/:id/accept` - قبول العرض (مشتري)

## 🛠️ المتطلبات التشغيلية

### متطلبات البنية التحتية

**1. بيئة التشغيل**

- Node.js 18+ LTS
- Next.js 15.5+
- أحدث إصدار من React
- قاعدة بيانات PostgreSQL 14+

**2. الخدمات الخارجية**

- **Pi Network SDK**: للمصادقة والمدفوعات
- **ناقل الأحداث**: Redis أو RabbitMQ للاتصال بين الدومينات
- **التخزين**: تخزين كائنات متوافق مع S3 لصور المنتجات والمستندات
- **محرك البحث**: Elasticsearch لبحث المنتجات (اختياري لكن موصى به)
- **ذاكرة التخزين المؤقت**: Redis للجلسة والبيانات المؤقتة

**3. تكوين الشبكة**

- النطاق: `commerce.pi` (أو نطاق فرعي تحت tec.pi)
- شهادات SSL/TLS مطلوبة
- CDN للأصول الثابتة والصور
- موازن الحمل للتوافر العالي

### متغيرات البيئة

```env
# قاعدة البيانات
DATABASE_URL="postgresql://user:pass@host:5432/commerce"

# شبكة Pi
PI_API_KEY="YOUR_PI_API_KEY_HERE"
PI_WALLET_PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY_HERE"
PI_NETWORK="mainnet" # أو testnet

# ناقل الأحداث
EVENT_BUS_TYPE="redis" # أو rabbitmq
REDIS_URL="redis://localhost:6379"

# التخزين
S3_BUCKET="commerce-assets"
S3_REGION="us-east-1"
S3_ACCESS_KEY="YOUR_S3_ACCESS_KEY_HERE"
S3_SECRET_KEY="YOUR_S3_SECRET_KEY_HERE"

# البحث (اختياري)
ELASTICSEARCH_URL="http://localhost:9200"

# التكامل
ASSETS_API_URL="http://assets.tec.pi/api"
INSURE_API_URL="http://insure.tec.pi/api"
FUNDX_API_URL="http://fundx.tec.pi/api"

# العتبات (بعملة Pi)
ASSET_TRACKING_THRESHOLD=10000
INSURANCE_RECOMMENDATION_THRESHOLD=5000
FINANCING_OFFER_THRESHOLD=25000
```

### خطوات النشر

**1. الإعداد الأولي**

```bash
# استنساخ المستودع (استبدل بعنوان URL لمستودعك)
git clone https://github.com/<YOUR_ORG>/tec-ecosystem.git
cd tec-ecosystem

# تثبيت التبعيات
npm install

# إعداد قاعدة البيانات
npx prisma migrate deploy
npx prisma generate
```

**2. تكوين الدومين**

```bash
# تكوين البيئة
cp .env.example domains/commerce/.env
nano domains/commerce/.env

# تشغيل بذور قاعدة البيانات
npm run seed:commerce
```

**3. إعداد ناقل الأحداث**

```bash
# بدء Redis (إذا كنت تستخدم Redis)
docker run -d -p 6379:6379 redis:latest

# أو بدء RabbitMQ (إذا كنت تستخدم RabbitMQ)
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management
```

**4. بدء خادم التطوير**

```bash
npm run dev:commerce
# الوصول على http://localhost:3000/commerce
```

**5. نشر الإنتاج**

```bash
# البناء للإنتاج
npm run build

# بدء خادم الإنتاج
npm run start

# أو النشر إلى Vercel/Netlify
vercel deploy --prod
```

### قائمة التحقق من التكامل

- [ ] **تكامل شبكة Pi**
  - [ ] تكوين واختبار Pi SDK
  - [ ] تدفق المصادقة يعمل
  - [ ] معالجة الدفع تعمل

- [ ] **اتصال ناقل الأحداث**
  - [ ] ناقل الأحداث يعمل ويمكن الوصول إليه
  - [ ] الأحداث تُنشر بنجاح
  - [ ] مستمعي الأحداث مكونون

- [ ] **تكاملات الدومينات**
  - [ ] واجهة API دومين الأصول متاحة
  - [ ] واجهة API دومين التأمين متاحة
  - [ ] واجهة API دومين FundX متاحة
  - [ ] اشتراكات الأحداث نشطة

- [ ] **قاعدة البيانات والتخزين**
  - [ ] ترحيلات قاعدة البيانات مكتملة
  - [ ] تخزين الكائنات مكون
  - [ ] استراتيجية النسخ الاحتياطي في مكانها

- [ ] **المراقبة والتسجيل**
  - [ ] تسجيل التطبيق مفعّل
  - [ ] تتبع الأخطاء مكون
  - [ ] مراقبة الأداء نشطة
  - [ ] سجلات التدقيق تسجل

### متطلبات الأمان

**1. المصادقة والترخيص**

- تكامل Pi Network SSO
- التحكم في الوصول القائم على الأدوار (RBAC)
- مصادقة مفتاح API للشركاء
- رموز JWT لإدارة الجلسة

**2. حماية البيانات**

- تشفير البيانات الحساسة في حالة السكون
- TLS 1.3 للبيانات أثناء النقل
- الامتثال لـ PCI لبيانات الدفع
- الامتثال لـ GDPR لمستخدمي الاتحاد الأوروبي

**3. منع الاحتيال**

- مراقبة المعاملات
- كشف النشاط المشبوه
- تحديد المعدل على نقاط النهاية الحرجة
- التحقق من KYB (اعرف عملك)

**4. التدقيق والامتثال**

- سجلات المعاملات غير القابلة للتغيير
- التحقق من البلوكشين
- عمليات التدقيق الأمني المنتظمة
- أدوات تقارير الامتثال

### المراقبة والتنبيه

**المقاييس الرئيسية للمراقبة**:

- وقت معالجة الطلب
- معدل نجاح الدفع
- أوقات استجابة API
- تأخر ناقل الأحداث
- أداء استعلام قاعدة البيانات
- معدلات الخطأ حسب نقطة النهاية

**عتبات التنبيه**:

- معدل الخطأ > 1%
- وقت استجابة API > 1000 مللي ثانية
- فشل الدفعات > 5%
- تأخر ناقل الأحداث > 5 دقائق
- تجمع اتصال قاعدة البيانات > 80%

## 📚 موارد إضافية

### للمطورين

- **[توثيق API](./api/README.md)** - مرجع API كامل
- **[مخططات الأحداث](./events/schemas.md)** - تعريفات بنية الأحداث
- **[دليل التكامل](./docs/integration.md)** - التكامل خطوة بخطوة
- **[دليل الاختبار](./docs/testing.md)** - كيفية اختبار دومين التجارة

### لمستخدمي الأعمال

- **[دليل المستخدم](./docs/user-guide.md)** - كيفية استخدام منصة التجارة
- **[دليل البائع](./docs/seller-handbook.md)** - دليل للبائعين
- **[دليل المشتري](./docs/buyer-guide.md)** - دليل للمشترين

### لمسؤولي النظام

- **[دليل النشر](./docs/deployment.md)** - نشر الإنتاج
- **[دليل المراقبة](./docs/monitoring.md)** - مراقبة النظام
- **[استكشاف الأخطاء وإصلاحها](./docs/troubleshooting.md)** - المشاكل الشائعة

---

**مالك الدومين**: فريق التجارة
**الحالة**: قيد التطوير النشط
**الأولوية**: عالية - حرجة لنظام B2B البيئي
**آخر تحديث**: يناير 2026

**الخطوات التالية:**

1. إكمال تسجيل والتحقق من البائعين
2. دمج معالجة الدفع مع NBF
3. بناء بحث متقدم مع Elasticsearch
4. تنفيذ نظام RFQ
5. إضافة دعم متعدد العملات

---

## 🎓 دومين التجارة كدومين رابع في نظام TEC

دومين التجارة يشكل **الدومين الرابع** في نظام TEC البيئي، مما يوضح:

✅ **موقع استراتيجي في المنظومة**

- يبني على أساس الأصول (الدومين 1) والتأمين (الدومين 2) و FundX (الدومين 3)
- يوفر بنية تحتية تجارية أساسية لبقية الدومينات
- يربط بين العديد من جوانب النظام البيئي

✅ **السيادة الرقمية**

- سيطرة كاملة على البيانات التجارية
- شفافية كاملة في المعاملات
- استقلالية في القرارات التجارية
- لا يوجد وسطاء يتحكمون في العمليات

✅ **معمارية موجهة بالأحداث**

- ينشر أحداثًا للمستهلكين اللاحقين
- يستمع للأحداث من الأصول و التأمين و FundX
- تتبع معرف الارتباط للتتبع الموزع
- معالجة الأخطاء ومنطق إعادة المحاولة

✅ **التكامل السلس**

- واجهات برمجة تطبيقات RESTful للعمليات المتزامنة
- ناقل الأحداث للتحديثات غير المتزامنة
- GraphQL للاستعلامات المعقدة
- WebHooks لإشعارات الشركاء

استخدم هذا الدومين كمثال عند إنشاء دومينات جديدة في نظام TEC البيئي.

---

**آخر تحديث**: يناير 2026
**الإصدار**: 2.0.0 - التوثيق الثنائي اللغة والسيادة الرقمية
**الحالة**: نشط - الدومين الرابع في تسلسل الإطلاق الاستراتيجي

---

© 2024-2026 نظام TEC البيئي - جميع الحقوق محفوظة
