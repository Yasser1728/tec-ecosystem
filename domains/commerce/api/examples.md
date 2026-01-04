# Commerce Domain - API Examples
# دومين التجارة - أمثلة الواجهة البرمجية

## 📘 Overview / نظرة عامة

This document provides practical examples of API calls for the Commerce domain (4-commerce). All examples use JSON format and assume authentication headers are included.

يوفر هذا المستند أمثلة عملية لاستدعاءات الواجهة البرمجية لدومين التجارة (4-commerce). جميع الأمثلة تستخدم تنسيق JSON وتفترض تضمين رؤوس المصادقة.

---

## 🔐 Authentication / المصادقة

All API endpoints require authentication via JWT token:

```http
Authorization: Bearer <your-jwt-token>
```

---

## 🏢 Business Registration / تسجيل الأعمال

### 1. Register New Business / تسجيل عمل جديد

**Request:**
```http
POST /api/commerce/businesses
Content-Type: application/json

{
  "name": "Acme Trading Co.",
  "tradeName": "Acme Trade",
  "type": "WHOLESALER",
  "taxId": "TAX-123456",
  "registrationNumber": "REG-789012",
  "address": {
    "street": "123 Commerce Street",
    "city": "Dubai",
    "state": "Dubai",
    "country": "UAE",
    "postalCode": "12345"
  },
  "contactInfo": {
    "email": "contact@acmetrade.pi",
    "phone": "+971-50-1234567",
    "website": "https://acmetrade.pi",
    "contactPerson": "Ahmed Al-Mansouri"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "biz_1704362400_abc123",
    "name": "Acme Trading Co.",
    "tradeName": "Acme Trade",
    "type": "WHOLESALER",
    "verificationStatus": "PENDING",
    "rating": 0,
    "totalOrders": 0,
    "createdAt": "2026-01-04T10:00:00.000Z"
  }
}
```

### 2. Get Business Profile / الحصول على ملف الأعمال

**Request:**
```http
GET /api/commerce/businesses/biz_1704362400_abc123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "biz_1704362400_abc123",
    "name": "Acme Trading Co.",
    "tradeName": "Acme Trade",
    "type": "WHOLESALER",
    "taxId": "TAX-123456",
    "verificationStatus": "VERIFIED",
    "verifiedAt": "2026-01-05T10:00:00.000Z",
    "rating": 4.7,
    "totalOrders": 156,
    "address": {
      "street": "123 Commerce Street",
      "city": "Dubai",
      "state": "Dubai",
      "country": "UAE",
      "postalCode": "12345"
    },
    "contactInfo": {
      "email": "contact@acmetrade.pi",
      "phone": "+971-50-1234567",
      "website": "https://acmetrade.pi"
    }
  }
}
```

---

## 📦 Product Management / إدارة المنتجات

### 3. Create Product Listing / إنشاء قائمة منتج

**Request:**
```http
POST /api/commerce/products
Content-Type: application/json

{
  "sellerId": "biz_1704362400_abc123",
  "name": "Premium Electronic Components Kit",
  "description": "High-quality electronic components for industrial use. Includes resistors, capacitors, and integrated circuits.",
  "category": "ELECTRONICS",
  "sku": "ELEC-KIT-001",
  "images": [
    "https://cdn.commerce.pi/products/elec-kit-001-1.jpg",
    "https://cdn.commerce.pi/products/elec-kit-001-2.jpg"
  ],
  "specifications": {
    "componentCount": 500,
    "package": "Industrial Grade",
    "warranty": "24 months",
    "certifications": ["ISO 9001", "CE"]
  },
  "unitPrice": 250.00,
  "currency": "PI",
  "moq": 10,
  "bulkPricing": [
    {
      "minQuantity": 10,
      "maxQuantity": 49,
      "unitPrice": 250.00,
      "discount": 0
    },
    {
      "minQuantity": 50,
      "maxQuantity": 99,
      "unitPrice": 237.50,
      "discount": 5
    },
    {
      "minQuantity": 100,
      "unitPrice": 225.00,
      "discount": 10
    }
  ],
  "stockQuantity": 500,
  "tags": ["electronics", "components", "industrial"],
  "weight": 2.5,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 10,
    "unit": "cm"
  },
  "trackAsAsset": false,
  "requiresInsurance": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_1704362500_xyz789",
    "sellerId": "biz_1704362400_abc123",
    "name": "Premium Electronic Components Kit",
    "category": "ELECTRONICS",
    "sku": "ELEC-KIT-001",
    "unitPrice": 250.00,
    "currency": "PI",
    "moq": 10,
    "stockQuantity": 500,
    "status": "ACTIVE",
    "createdAt": "2026-01-04T10:05:00.000Z"
  }
}
```

### 4. List Products / قائمة المنتجات

**Request:**
```http
GET /api/commerce/products?category=ELECTRONICS&inStock=true&page=1&perPage=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_1704362500_xyz789",
      "name": "Premium Electronic Components Kit",
      "category": "ELECTRONICS",
      "unitPrice": 250.00,
      "moq": 10,
      "stockQuantity": 500,
      "seller": {
        "id": "biz_1704362400_abc123",
        "name": "Acme Trading Co.",
        "rating": 4.7
      }
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 🛒 Order Management / إدارة الطلبات

### 5. Create Order / إنشاء طلب

**Request:**
```http
POST /api/commerce/orders
Content-Type: application/json

{
  "buyerId": "biz_1704362600_buyer1",
  "sellerId": "biz_1704362400_abc123",
  "items": [
    {
      "productId": "prod_1704362500_xyz789",
      "quantity": 50,
      "unitPrice": 237.50,
      "trackAsAsset": true,
      "insuranceRequired": true
    }
  ],
  "paymentTerms": "NET_30",
  "shippingAddress": {
    "street": "456 Industrial Road",
    "city": "Abu Dhabi",
    "state": "Abu Dhabi",
    "country": "UAE",
    "postalCode": "54321"
  },
  "notes": "Please ship via express courier"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ord_1704362700_order1",
    "orderNumber": "PO-1704362700-456",
    "buyerId": "biz_1704362600_buyer1",
    "sellerId": "biz_1704362400_abc123",
    "items": [
      {
        "id": "item_1704362700_1",
        "productId": "prod_1704362500_xyz789",
        "quantity": 50,
        "unitPrice": 237.50,
        "subtotal": 11875.00,
        "trackAsAsset": true,
        "insuranceRequired": true
      }
    ],
    "subtotal": 11875.00,
    "tax": 1187.50,
    "shippingCost": 0,
    "totalAmount": 13062.50,
    "currency": "PI",
    "status": "PENDING_APPROVAL",
    "paymentStatus": "PENDING",
    "paymentTerms": "NET_30",
    "orderDate": "2026-01-04T10:15:00.000Z",
    "createdAt": "2026-01-04T10:15:00.000Z"
  }
}
```

### 6. Confirm Order (Seller) / تأكيد الطلب (البائع)

**Request:**
```http
POST /api/commerce/orders/ord_1704362700_order1/confirm
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ord_1704362700_order1",
    "orderNumber": "PO-1704362700-456",
    "status": "CONFIRMED",
    "confirmedAt": "2026-01-04T11:00:00.000Z",
    "expectedDeliveryDate": "2026-01-11T00:00:00.000Z"
  }
}
```

### 7. Create Shipment / إنشاء شحنة

**Request:**
```http
POST /api/commerce/orders/ord_1704362700_order1/shipments
Content-Type: application/json

{
  "trackingNumber": "TRACK-123456789",
  "carrier": "Emirates Post",
  "origin": {
    "street": "123 Commerce Street",
    "city": "Dubai",
    "state": "Dubai",
    "country": "UAE",
    "postalCode": "12345"
  },
  "estimatedDelivery": "2026-01-11T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ship_1704363000_ship1",
    "orderId": "ord_1704362700_order1",
    "trackingNumber": "TRACK-123456789",
    "carrier": "Emirates Post",
    "status": "PENDING",
    "estimatedDelivery": "2026-01-11T00:00:00.000Z",
    "createdAt": "2026-01-04T11:30:00.000Z"
  }
}
```

### 8. Mark Order as Delivered / وضع علامة على الطلب كمُسلّم

**Request:**
```http
POST /api/commerce/orders/ord_1704362700_order1/delivered
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ord_1704362700_order1",
    "orderNumber": "PO-1704362700-456",
    "status": "DELIVERED",
    "deliveredAt": "2026-01-11T14:30:00.000Z",
    "shipment": {
      "status": "DELIVERED",
      "deliveredAt": "2026-01-11T14:30:00.000Z"
    }
  },
  "integrations": {
    "assetTracking": {
      "initiated": true,
      "itemsTracked": 1,
      "message": "Asset tracking initiated for order items"
    },
    "insuranceRecommendation": {
      "initiated": true,
      "itemsRecommended": 1,
      "message": "Insurance recommendations sent to Insure domain"
    }
  }
}
```

---

## 💳 Payment Processing / معالجة الدفع

### 9. Process Payment / معالجة الدفع

**Request:**
```http
POST /api/commerce/orders/ord_1704362700_order1/payments
Content-Type: application/json

{
  "amount": 13062.50,
  "method": "PI",
  "notes": "Payment via Pi wallet"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pay_1704363500_pay1",
    "orderId": "ord_1704362700_order1",
    "amount": 13062.50,
    "currency": "PI",
    "method": "PI",
    "status": "PAID",
    "transactionId": "TXN-1704363500-abc123",
    "paidAt": "2026-01-04T12:00:00.000Z",
    "dueDate": "2026-02-03T12:00:00.000Z"
  }
}
```

### 10. Get Payment History / الحصول على سجل الدفع

**Request:**
```http
GET /api/commerce/orders/ord_1704362700_order1/payments
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pay_1704363500_pay1",
      "amount": 13062.50,
      "currency": "PI",
      "method": "PI",
      "status": "PAID",
      "paidAt": "2026-01-04T12:00:00.000Z"
    }
  ]
}
```

---

## 📊 Analytics & Reports / التحليلات والتقارير

### 11. Get Order Statistics / الحصول على إحصائيات الطلبات

**Request:**
```http
GET /api/commerce/analytics/orders?buyerId=biz_1704362600_buyer1&period=monthly
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2026-01",
    "totalOrders": 15,
    "totalAmount": 156780.50,
    "currency": "PI",
    "ordersByStatus": {
      "PENDING_APPROVAL": 2,
      "CONFIRMED": 3,
      "SHIPPED": 5,
      "DELIVERED": 5
    },
    "topCategories": [
      {
        "category": "ELECTRONICS",
        "orderCount": 8,
        "totalAmount": 89450.00
      },
      {
        "category": "INDUSTRIAL",
        "orderCount": 5,
        "totalAmount": 52330.50
      }
    ]
  }
}
```

---

## 🔗 Integration Events / أحداث التكامل

### Event Published: Order Delivered

When an order is delivered, Commerce domain publishes events that trigger integrations with Assets and Insure domains.

عندما يتم تسليم طلب، ينشر دومين التجارة أحداثًا تؤدي إلى تكاملات مع دومينات الأصول والتأمين.

**Event: commerce.order.delivered**
```json
{
  "eventType": "commerce.order.delivered",
  "eventData": {
    "orderId": "ord_1704362700_order1",
    "orderNumber": "PO-1704362700-456",
    "buyerId": "biz_1704362600_buyer1",
    "items": [
      {
        "itemId": "item_1704362700_1",
        "productId": "prod_1704362500_xyz789",
        "productName": "Premium Electronic Components Kit",
        "quantity": 50,
        "unitPrice": 237.50,
        "totalValue": 11875.00,
        "trackAsAsset": true,
        "insuranceRequired": true
      }
    ],
    "deliveredAt": "2026-01-11T14:30:00.000Z",
    "totalValue": 13062.50
  },
  "metadata": {
    "correlationId": "ord_1704362700_order1",
    "userId": "user_buyer1",
    "timestamp": "2026-01-11T14:30:00.000Z"
  }
}
```

**Event: commerce.asset.tracking.requested**
```json
{
  "eventType": "commerce.asset.tracking.requested",
  "eventData": {
    "orderId": "ord_1704362700_order1",
    "orderNumber": "PO-1704362700-456",
    "orderItemId": "item_1704362700_1",
    "productId": "prod_1704362500_xyz789",
    "name": "Premium Electronic Components Kit",
    "description": "Purchased via PO-1704362700-456",
    "quantity": 50,
    "purchasePrice": 237.50,
    "purchaseDate": "2026-01-11T14:30:00.000Z",
    "currentPrice": 237.50,
    "assetType": "PHYSICAL_ASSET",
    "category": "COMMERCE_PURCHASE",
    "buyerId": "biz_1704362600_buyer1",
    "userId": "user_buyer1",
    "sourceDomain": "commerce",
    "sourceTransactionId": "ord_1704362700_order1",
    "totalValue": 11875.00,
    "currency": "PI"
  },
  "metadata": {
    "correlationId": "ord_1704362700_order1",
    "userId": "user_buyer1",
    "targetDomain": "assets",
    "timestamp": "2026-01-11T14:30:00.000Z"
  }
}
```

**Event: commerce.insurance.recommended**
```json
{
  "eventType": "commerce.insurance.recommended",
  "eventData": {
    "orderId": "ord_1704362700_order1",
    "orderNumber": "PO-1704362700-456",
    "orderItemId": "item_1704362700_1",
    "productId": "prod_1704362500_xyz789",
    "productName": "Premium Electronic Components Kit",
    "productValue": 11875.00,
    "currency": "PI",
    "recommendationType": "PRODUCT_INSURANCE",
    "coverageAmount": 11875.00,
    "insuredItemType": "PHYSICAL_GOODS",
    "buyerId": "biz_1704362600_buyer1",
    "userId": "user_buyer1",
    "sourceDomain": "commerce",
    "sourceTransactionId": "ord_1704362700_order1",
    "purchaseDate": "2026-01-11T14:30:00.000Z"
  },
  "metadata": {
    "correlationId": "ord_1704362700_order1",
    "userId": "user_buyer1",
    "targetDomain": "insure",
    "timestamp": "2026-01-11T14:30:00.000Z"
  }
}
```

---

## 🔒 Error Handling / معالجة الأخطاء

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ORDER",
    "message": "Order must have at least one item",
    "details": {
      "field": "items",
      "constraint": "minLength"
    }
  }
}
```

### Common Error Codes

- `INVALID_INPUT` - Invalid request data
- `BUSINESS_NOT_VERIFIED` - Business not verified
- `PRODUCT_NOT_FOUND` - Product does not exist
- `INSUFFICIENT_STOCK` - Not enough stock available
- `INVALID_ORDER_STATUS` - Invalid status transition
- `PAYMENT_FAILED` - Payment processing failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions

---

## 📚 Related Documentation

- [Commerce Integration Example](./integration-example.md) - Complete integration flow
- [Commerce User Journey](./user-journey.md) - End-to-end user experience
- [Commerce README](../README.md) - Domain overview

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Active - Domain 4 Launch
