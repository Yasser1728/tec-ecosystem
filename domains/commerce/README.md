# Commerce Domain - B2B Trading & Business Solutions

## 🎯 Domain Mission

Commerce (commerce.pi) is the premier B2B trading platform within the TEC Ecosystem, facilitating business-to-business transactions, supplier networks, and wholesale marketplaces powered by Pi Network.

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

## 🔗 Integration Map

### Incoming: Commerce Dependencies

#### NBF Domain → Commerce
- **Payment Processing**: Process Pi payments for orders
- **Trade Credit**: Credit lines and financing
- **Invoice Factoring**: Early payment options

#### Assets Domain → Commerce
- **Inventory Tracking**: Track purchased inventory as assets
- **Equipment Purchases**: High-value equipment tracking

#### DX Domain → Commerce
- **API Integration**: Connect external marketplaces
- **ERP Integration**: Integrate with business systems

### Outgoing: Commerce Services

#### Commerce → Alert
- **Order Notifications**: Order status updates
- **Inventory Alerts**: Low stock notifications
- **Shipment Tracking**: Delivery updates

#### Commerce → Analytics
- **Sales Data**: Transaction and revenue data
- **Performance Metrics**: Seller and product analytics
- **Market Trends**: Category and pricing trends

#### Commerce → System
- **Transaction Logs**: Audit trail for compliance
- **Performance Metrics**: System usage statistics

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
// Calculate final price with volume discount
function calculateOrderTotal(items) {
  let subtotal = 0;
  
  items.forEach(item => {
    let unitPrice = item.basePrice;
    
    // Apply volume discount
    if (item.quantity >= 1000) {
      unitPrice *= 0.85; // 15% discount
    } else if (item.quantity >= 500) {
      unitPrice *= 0.90; // 10% discount
    } else if (item.quantity >= 100) {
      unitPrice *= 0.95; // 5% discount
    }
    
    subtotal += unitPrice * item.quantity;
  });
  
  // Apply tax
  const tax = subtotal * 0.10; // 10% VAT
  
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

## 🚀 Implementation Roadmap

### Phase 1: Core Marketplace (Current)
- ✅ Product catalog and search
- ✅ Basic order management
- ⏳ Seller registration
- ⏳ Payment integration
- ⏳ Order tracking

### Phase 2: Advanced Features
- ⏳ RFQ system
- ⏳ Trade credit
- ⏳ Advanced seller hub
- ⏳ Bulk import/export
- ⏳ API for integrations

### Phase 3: Intelligence
- 📋 Smart recommendations
- 📋 Price optimization
- 📋 Inventory forecasting
- 📋 Fraud detection
- 📋 Market analytics

### Phase 4: Ecosystem Integration
- 📋 Full NBF integration
- 📋 Asset tracking automation
- 📋 Advanced analytics
- 📋 Multi-language support
- 📋 Global expansion

## 📝 Collaboration Notes

### For Frontend Developers
- Build responsive product catalog with filters
- Implement shopping cart with MOQ validation
- Create seller dashboard with analytics
- Add real-time order tracking UI

### For Backend Developers
- Implement robust order state machine
- Build scalable product search
- Add payment gateway integrations
- Create webhook system for events

### For Product Managers
- Define seller verification criteria
- Set payment terms policies
- Create dispute resolution process
- Plan pricing strategies

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