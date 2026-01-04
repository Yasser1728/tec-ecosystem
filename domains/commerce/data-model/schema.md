# Commerce Domain - Data Model Schema

## 📊 Overview

This document describes the complete data model for the Commerce domain. The schema is designed to support B2B trading operations with full event-driven integration capabilities.

---

## 🗄️ Entity Relationship Diagram

```
User (1) ──────< (M) Business
                      │
                      ├──< (M) Product (as Seller)
                      │         │
                      │         └──< Review
                      │
                      ├──< (M) Order (as Buyer)
                      │         │
                      │         ├──< (M) OrderItem
                      │         │         │
                      │         │         └──< Asset (ref to Assets domain)
                      │         │         └──< InsurancePolicy (ref to Insure domain)
                      │         │
                      │         ├──< (M) Payment
                      │         └──< (1) Shipment
                      │                   │
                      │                   └──< (M) TrackingEvent
                      │
                      └──< (M) Order (as Seller)
                               │
                               └──< Quote
```

---

## 📋 Core Entities

### 1. Business

Represents a registered business entity (buyer or seller).

```prisma
model Business {
  id                   String              @id @default(uuid())
  userId               String              // Link to user account
  name                 String
  tradeName            String?
  type                 BusinessType
  taxId                String              @unique
  registrationNumber   String              @unique
  
  // Address
  addressStreet        String
  addressCity          String
  addressState         String
  addressCountry       String
  addressPostalCode    String
  addressCoordinates   Json?               // {latitude, longitude}
  
  // Contact
  email                String
  phone                String
  website              String?
  contactPerson        String?
  
  // Verification
  verificationStatus   VerificationStatus
  verifiedAt           DateTime?
  verificationDocuments String[]           // URLs to documents
  
  // Metrics
  rating               Float               @default(0)
  totalOrders          Int                 @default(0)
  
  // Relationships
  productsAsSellerFrom Product[]           @relation("SellerProducts")
  ordersAsBuyer        Order[]             @relation("BuyerOrders")
  ordersAsSeller       Order[]             @relation("SellerOrders")
  reviewsGiven         Review[]            @relation("ReviewerReviews")
  reviewsReceived      Review[]            @relation("RevieweeReviews")
  
  // Metadata
  metadata             Json?
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt
  
  @@index([userId])
  @@index([verificationStatus])
  @@index([type])
}

enum BusinessType {
  MANUFACTURER
  DISTRIBUTOR
  WHOLESALER
  RETAILER
  SERVICE_PROVIDER
}

enum VerificationStatus {
  PENDING
  VERIFIED
  REJECTED
  SUSPENDED
}
```

### 2. Product

Represents a product listing in the B2B marketplace.

```prisma
model Product {
  id                String           @id @default(uuid())
  sellerId          String
  seller            Business         @relation("SellerProducts", fields: [sellerId], references: [id])
  
  // Basic info
  name              String
  description       String           @db.Text
  category          ProductCategory
  sku               String           @unique
  images            String[]
  specifications    Json?            // Product-specific specifications
  
  // Pricing
  unitPrice         Float
  currency          String           @default("PI")
  moq               Int              // Minimum Order Quantity
  bulkPricing       Json?            // Array of bulk pricing tiers
  
  // Inventory
  stockQuantity     Int
  status            ProductStatus
  
  // Additional info
  tags              String[]
  weight            Float?
  dimensions        Json?            // {length, width, height, unit}
  
  // Integration flags
  trackAsAsset      Boolean          @default(false)
  requiresInsurance Boolean          @default(false)
  
  // Relationships
  orderItems        OrderItem[]
  reviews           Review[]
  
  // Metadata
  metadata          Json?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  
  @@index([sellerId])
  @@index([category])
  @@index([status])
  @@index([sku])
}

enum ProductCategory {
  ELECTRONICS
  FASHION
  FOOD_BEVERAGE
  INDUSTRIAL
  HEALTHCARE
  AUTOMOTIVE
  CONSTRUCTION
  LUXURY_GOODS
  OTHER
}

enum ProductStatus {
  ACTIVE
  INACTIVE
  OUT_OF_STOCK
  DISCONTINUED
}
```

### 3. Order

Represents a B2B order between buyer and seller.

```prisma
model Order {
  id                    String            @id @default(uuid())
  orderNumber           String            @unique
  
  // Parties
  buyerId               String
  buyer                 Business          @relation("BuyerOrders", fields: [buyerId], references: [id])
  sellerId              String
  seller                Business          @relation("SellerOrders", fields: [sellerId], references: [id])
  
  // Items
  items                 OrderItem[]
  
  // Financial
  subtotal              Float
  tax                   Float
  shippingCost          Float
  totalAmount           Float
  currency              String            @default("PI")
  
  // Status
  status                OrderStatus
  paymentStatus         PaymentStatus
  paymentTerms          PaymentTerms
  
  // Shipping
  shippingStreet        String
  shippingCity          String
  shippingState         String
  shippingCountry       String
  shippingPostalCode    String
  
  billingStreet         String?
  billingCity           String?
  billingState          String?
  billingCountry        String?
  billingPostalCode     String?
  
  // Relationships
  payments              Payment[]
  shipment              Shipment?
  
  // Dates
  orderDate             DateTime          @default(now())
  expectedDeliveryDate  DateTime?
  deliveredAt           DateTime?
  
  // Additional
  notes                 String?           @db.Text
  metadata              Json?
  
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  
  @@index([buyerId])
  @@index([sellerId])
  @@index([status])
  @@index([paymentStatus])
  @@index([orderDate])
}

enum OrderStatus {
  DRAFT
  PENDING_APPROVAL
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  PAID
  PARTIALLY_PAID
  FAILED
  REFUNDED
}

enum PaymentTerms {
  NET_0
  NET_15
  NET_30
  NET_60
  NET_90
  ADVANCE
  PARTIAL_ADVANCE
}
```

### 4. OrderItem

Represents an item within an order.

```prisma
model OrderItem {
  id                  String            @id @default(uuid())
  orderId             String
  order               Order             @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId           String
  product             Product           @relation(fields: [productId], references: [id])
  
  // Pricing
  quantity            Int
  unitPrice           Float
  discount            Float             @default(0)
  subtotal            Float
  
  // Integration
  trackAsAsset        Boolean           @default(false)
  assetId             String?           // Reference to asset in Assets domain
  insuranceRequired   Boolean           @default(false)
  insurancePolicyId   String?           // Reference to policy in Insure domain
  
  // Metadata
  metadata            Json?
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  
  @@index([orderId])
  @@index([productId])
  @@index([assetId])
  @@index([insurancePolicyId])
}
```

### 5. Payment

Represents a payment for an order.

```prisma
model Payment {
  id              String          @id @default(uuid())
  orderId         String
  order           Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  // Payment details
  amount          Float
  currency        String          @default("PI")
  method          String          // PI, CREDIT_CARD, BANK_TRANSFER, etc.
  
  // Status
  status          PaymentStatus
  transactionId   String?
  
  // Dates
  paidAt          DateTime?
  dueDate         DateTime?
  
  // Metadata
  metadata        Json?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([orderId])
  @@index([status])
  @@index([transactionId])
}
```

### 6. Shipment

Represents a shipment for an order.

```prisma
model Shipment {
  id                String              @id @default(uuid())
  orderId           String              @unique
  order             Order               @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  // Tracking
  trackingNumber    String              @unique
  carrier           String
  status            ShipmentStatus
  
  // Addresses
  originStreet      String
  originCity        String
  originCountry     String
  originPostalCode  String
  
  destStreet        String
  destCity          String
  destCountry       String
  destPostalCode    String
  
  // Dates
  shippedAt         DateTime?
  estimatedDelivery DateTime?
  deliveredAt       DateTime?
  
  // Tracking history
  trackingEvents    TrackingEvent[]
  
  // Metadata
  metadata          Json?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  @@index([orderId])
  @@index([trackingNumber])
  @@index([status])
}

enum ShipmentStatus {
  PENDING
  PICKED_UP
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  FAILED
}
```

### 7. TrackingEvent

Represents an event in shipment tracking history.

```prisma
model TrackingEvent {
  id          String      @id @default(uuid())
  shipmentId  String
  shipment    Shipment    @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  
  timestamp   DateTime
  status      ShipmentStatus
  location    String
  description String      @db.Text
  
  createdAt   DateTime    @default(now())
  
  @@index([shipmentId])
  @@index([timestamp])
}
```

### 8. Quote/RFQ

Represents a quote or Request for Quote.

```prisma
model Quote {
  id                  String            @id @default(uuid())
  quoteNumber         String            @unique
  
  buyerId             String
  sellerId            String
  
  // Items
  items               Json              // Array of quote items
  
  // Financial
  totalAmount         Float
  currency            String            @default("PI")
  validUntil          DateTime
  
  // Status
  status              QuoteStatus
  
  // Content
  notes               String?           @db.Text
  termsAndConditions  String?           @db.Text
  
  // Metadata
  metadata            Json?
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  
  @@index([buyerId])
  @@index([sellerId])
  @@index([status])
}

enum QuoteStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
  EXPIRED
}
```

### 9. Review

Represents a review of a seller or product.

```prisma
model Review {
  id           String      @id @default(uuid())
  orderId      String
  productId    String
  product      Product     @relation(fields: [productId], references: [id])
  
  reviewerId   String
  reviewer     Business    @relation("ReviewerReviews", fields: [reviewerId], references: [id])
  revieweeId   String
  reviewee     Business    @relation("RevieweeReviews", fields: [revieweeId], references: [id])
  
  rating       Int         // 1-5
  title        String?
  comment      String?     @db.Text
  
  verified     Boolean     @default(false)
  
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  
  @@index([productId])
  @@index([reviewerId])
  @@index([revieweeId])
  @@index([rating])
}
```

---

## 🔗 Integration References

### Asset Tracking

When an order item has `trackAsAsset = true`, the following happens:

1. **Order Delivery** → Triggers `commerce.asset.tracking.requested` event
2. **Assets Domain** → Creates asset record
3. **Assets Domain** → Returns `assetId`
4. **Commerce Domain** → Updates `OrderItem.assetId`

```javascript
// Example flow
OrderItem {
  trackAsAsset: true,
  assetId: null,              // Initially null
}

// After integration
OrderItem {
  trackAsAsset: true,
  assetId: "asset_xyz_123",   // Updated by integration
}
```

### Insurance Integration

When an order item has `insuranceRequired = true`:

1. **Order Delivery** → Triggers `commerce.insurance.recommended` event
2. **Insure Domain** → Creates recommendation/quote
3. **User** → Reviews and accepts insurance
4. **Insure Domain** → Creates policy and returns `policyId`
5. **Commerce Domain** → Updates `OrderItem.insurancePolicyId`

```javascript
// Example flow
OrderItem {
  insuranceRequired: true,
  insurancePolicyId: null,           // Initially null
}

// After user accepts insurance
OrderItem {
  insuranceRequired: true,
  insurancePolicyId: "pol_abc_456",  // Updated after policy creation
}
```

---

## 📊 Indexes and Performance

### Primary Indexes

- All `id` fields are indexed (primary keys)
- All foreign keys are indexed
- `Business.taxId` and `Business.registrationNumber` are unique
- `Product.sku` is unique
- `Order.orderNumber` is unique
- `Shipment.trackingNumber` is unique

### Query Optimization Indexes

- `Business.verificationStatus` - For filtering verified businesses
- `Product.category` and `Product.status` - For product listing queries
- `Order.status` and `Order.paymentStatus` - For order management
- `Order.orderDate` - For time-based queries
- `Review.rating` - For rating-based sorting

---

## 🔄 Event-Driven Updates

### Events Published by Commerce

1. `commerce.product.created` - When new product is listed
2. `commerce.order.created` - When order is placed
3. `commerce.order.confirmed` - When seller confirms order
4. `commerce.order.shipped` - When order is shipped
5. `commerce.order.delivered` - **Key event** - Triggers integrations
6. `commerce.payment.completed` - When payment is processed
7. `commerce.business.verified` - When business verification completes
8. `commerce.asset.tracking.requested` - Asset tracking request
9. `commerce.insurance.recommended` - Insurance recommendation

### Events Subscribed by Commerce

1. `assets.asset.created` - To update `OrderItem.assetId`
2. `assets.valuation.updated` - To track asset value changes
3. `insure.policy.created` - To update `OrderItem.insurancePolicyId`
4. `insure.recommendation.created` - To notify user
5. `fundx.investment.returns` - For special offers

---

## 💾 Data Retention

- **Active Orders**: Indefinite
- **Delivered Orders**: 7 years (tax compliance)
- **Products**: Until seller deactivates
- **Businesses**: Until account deletion
- **Reviews**: Indefinite
- **Tracking Events**: 2 years

---

## 🔒 Data Privacy

- **User Data**: Encrypted at rest
- **Payment Data**: PCI DSS compliant
- **Business Documents**: Secure storage with access control
- **API Keys**: Never stored in plain text
- **Personal Information**: GDPR compliant

---

**Schema Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintained By**: TEC Commerce Team
