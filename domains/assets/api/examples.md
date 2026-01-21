# Assets Domain - API Examples

## 📘 Overview

This document provides practical examples of API calls for the Assets domain. All examples use JSON format and assume authentication headers are included.

## 🔐 Authentication

All API endpoints require authentication via JWT token:

```http
Authorization: Bearer <your-jwt-token>
```

## 📋 Portfolio Management Examples

### 1. Create Portfolio

**Request:**

```http
POST /api/assets/portfolios
Content-Type: application/json

{
  "name": "Main Investment Portfolio",
  "description": "My primary investment portfolio for long-term holdings",
  "currency": "PI",
  "isDefault": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "port_clx123abc",
    "userId": "user_abc123",
    "name": "Main Investment Portfolio",
    "description": "My primary investment portfolio for long-term holdings",
    "isDefault": true,
    "currency": "PI",
    "totalValue": "0.00",
    "createdAt": "2026-01-04T10:00:00.000Z",
    "updatedAt": "2026-01-04T10:00:00.000Z"
  }
}
```

### 2. List User Portfolios

**Request:**

```http
GET /api/assets/portfolios
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "port_clx123abc",
      "name": "Main Investment Portfolio",
      "description": "My primary investment portfolio",
      "isDefault": true,
      "currency": "PI",
      "totalValue": "125750.50",
      "assetCount": 15,
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "port_clx456def",
      "name": "Retirement Fund",
      "description": "Long-term retirement savings",
      "isDefault": false,
      "currency": "PI",
      "totalValue": "78250.00",
      "assetCount": 8,
      "createdAt": "2026-01-02T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 2,
    "totalValue": "204000.50"
  }
}
```

### 3. Get Portfolio Details

**Request:**

```http
GET /api/assets/portfolios/port_clx123abc?include=assets
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "port_clx123abc",
    "name": "Main Investment Portfolio",
    "description": "My primary investment portfolio",
    "isDefault": true,
    "currency": "PI",
    "totalValue": "125750.50",
    "assets": [
      {
        "id": "asset_xyz789",
        "name": "Pi Network",
        "symbol": "PI",
        "assetType": "CRYPTOCURRENCY",
        "quantity": "5000.00",
        "currentPrice": "25.15",
        "currentValue": "125750.00",
        "unrealizedGainLoss": "23250.00",
        "status": "ACTIVE"
      }
    ],
    "performance": {
      "totalInvested": "102500.00",
      "currentValue": "125750.50",
      "absoluteGain": "23250.50",
      "percentageGain": 22.68
    }
  }
}
```

## 💎 Asset Management Examples

### 4. Create Asset (Manual Entry)

**Request:**

```http
POST /api/assets
Content-Type: application/json

{
  "portfolioId": "port_clx123abc",
  "assetTypeId": "CRYPTOCURRENCY",
  "name": "Pi Network",
  "symbol": "PI",
  "description": "Pi cryptocurrency holdings",
  "quantity": 5000,
  "purchasePrice": 20.50,
  "purchaseDate": "2025-01-01T00:00:00.000Z",
  "categoryId": "cat_long_term",
  "metadata": {
    "walletAddress": "0x1234567890abcdef",
    "network": "pi-mainnet",
    "notes": "Initial investment"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "asset_xyz789",
    "portfolioId": "port_clx123abc",
    "name": "Pi Network",
    "symbol": "PI",
    "assetType": {
      "id": "CRYPTOCURRENCY",
      "name": "Cryptocurrency",
      "icon": "crypto-icon",
      "color": "#F7931A"
    },
    "quantity": "5000.00",
    "purchasePrice": "20.50",
    "purchaseDate": "2025-01-01T00:00:00.000Z",
    "currentPrice": "20.50",
    "currentValue": "102500.00",
    "costBasis": "102500.00",
    "unrealizedGainLoss": "0.00",
    "status": "ACTIVE",
    "category": {
      "id": "cat_long_term",
      "name": "Long-term Holdings"
    },
    "metadata": {
      "walletAddress": "0x1234567890abcdef",
      "network": "pi-mainnet",
      "notes": "Initial investment"
    },
    "createdAt": "2026-01-04T10:00:00.000Z"
  }
}
```

### 5. List User Assets

**Request:**

```http
GET /api/assets?portfolioId=port_clx123abc&status=ACTIVE
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "asset_xyz789",
      "name": "Pi Network",
      "symbol": "PI",
      "assetType": "CRYPTOCURRENCY",
      "quantity": "5000.00",
      "currentPrice": "25.15",
      "currentValue": "125750.00",
      "unrealizedGainLoss": "23250.00",
      "percentageGain": 22.68,
      "status": "ACTIVE"
    },
    {
      "id": "asset_abc456",
      "name": "Downtown Apartment",
      "assetType": "REAL_ESTATE",
      "quantity": "1.00",
      "currentPrice": "250000.00",
      "currentValue": "250000.00",
      "unrealizedGainLoss": "50000.00",
      "percentageGain": 25.0,
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "total": 2,
    "totalValue": "375750.00",
    "totalGainLoss": "73250.00"
  }
}
```

### 6. Get Asset Details with History

**Request:**

```http
GET /api/assets/asset_xyz789?include=transactions,valuations
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "asset_xyz789",
    "name": "Pi Network",
    "symbol": "PI",
    "assetType": "CRYPTOCURRENCY",
    "quantity": "5000.00",
    "purchasePrice": "20.50",
    "currentPrice": "25.15",
    "currentValue": "125750.00",
    "costBasis": "102500.00",
    "unrealizedGainLoss": "23250.00",
    "status": "ACTIVE",
    "transactions": [
      {
        "id": "tx_init",
        "type": "BUY",
        "quantity": "5000.00",
        "price": "20.50",
        "totalAmount": "102500.00",
        "date": "2025-01-01T00:00:00.000Z",
        "description": "Initial purchase"
      }
    ],
    "valuations": [
      {
        "id": "val_001",
        "price": "25.15",
        "totalValue": "125750.00",
        "source": "API",
        "valuationDate": "2026-01-04T10:00:00.000Z"
      },
      {
        "id": "val_002",
        "price": "24.80",
        "totalValue": "124000.00",
        "source": "API",
        "valuationDate": "2026-01-03T10:00:00.000Z"
      }
    ],
    "performance": {
      "absoluteGain": "23250.00",
      "percentageGain": 22.68,
      "annualizedReturn": 227.28,
      "holdingDays": 37
    }
  }
}
```

### 7. Update Asset

**Request:**

```http
PUT /api/assets/asset_xyz789
Content-Type: application/json

{
  "currentPrice": 26.50,
  "description": "Updated Pi holdings - price increased"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "asset_xyz789",
    "name": "Pi Network",
    "currentPrice": "26.50",
    "currentValue": "132500.00",
    "unrealizedGainLoss": "30000.00",
    "percentageGain": 29.27,
    "updatedAt": "2026-01-04T11:00:00.000Z"
  }
}
```

### 8. Delete/Archive Asset

**Request:**

```http
DELETE /api/assets/asset_xyz789
```

**Response:**

```json
{
  "success": true,
  "message": "Asset archived successfully",
  "data": {
    "assetId": "asset_xyz789",
    "status": "ARCHIVED",
    "archivedAt": "2026-01-04T11:00:00.000Z"
  }
}
```

## 📊 Transaction Examples

### 9. Record New Transaction

**Request:**

```http
POST /api/assets/asset_xyz789/transactions
Content-Type: application/json

{
  "type": "BUY",
  "quantity": 1000,
  "price": 25.00,
  "fee": 12.50,
  "date": "2026-01-04T00:00:00.000Z",
  "description": "Additional purchase"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "tx_new123",
    "assetId": "asset_xyz789",
    "type": "BUY",
    "quantity": "1000.00",
    "price": "25.00",
    "totalAmount": "25000.00",
    "fee": "12.50",
    "date": "2026-01-04T00:00:00.000Z",
    "description": "Additional purchase",
    "createdAt": "2026-01-04T11:00:00.000Z"
  },
  "assetUpdated": {
    "quantity": "6000.00",
    "costBasis": "127512.50",
    "currentValue": "150900.00",
    "unrealizedGainLoss": "23387.50"
  }
}
```

### 10. Get Transaction History

**Request:**

```http
GET /api/assets/asset_xyz789/transactions?limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "tx_new123",
      "type": "BUY",
      "quantity": "1000.00",
      "price": "25.00",
      "totalAmount": "25000.00",
      "fee": "12.50",
      "date": "2026-01-04T00:00:00.000Z",
      "description": "Additional purchase"
    },
    {
      "id": "tx_init",
      "type": "BUY",
      "quantity": "5000.00",
      "price": "20.50",
      "totalAmount": "102500.00",
      "fee": "0.00",
      "date": "2025-01-01T00:00:00.000Z",
      "description": "Initial purchase"
    }
  ],
  "meta": {
    "total": 2,
    "limit": 10,
    "offset": 0
  }
}
```

## 📈 Analytics Examples

### 11. Get Portfolio Analytics

**Request:**

```http
GET /api/assets/analytics/portfolio/port_clx123abc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "portfolioId": "port_clx123abc",
    "name": "Main Investment Portfolio",
    "summary": {
      "totalValue": "125750.50",
      "totalInvested": "102500.00",
      "totalGainLoss": "23250.50",
      "percentageReturn": 22.68,
      "assetCount": 15
    },
    "assetAllocation": [
      {
        "assetType": "CRYPTOCURRENCY",
        "value": "125750.00",
        "percentage": 100.0,
        "count": 1
      }
    ],
    "topPerformers": [
      {
        "assetId": "asset_xyz789",
        "name": "Pi Network",
        "value": "125750.00",
        "gainLoss": "23250.00",
        "percentageGain": 22.68
      }
    ],
    "performanceHistory": [
      {
        "date": "2026-01-01",
        "value": "102500.00"
      },
      {
        "date": "2026-01-02",
        "value": "115000.00"
      },
      {
        "date": "2026-01-04",
        "value": "125750.50"
      }
    ]
  }
}
```

### 12. Get Overall Performance

**Request:**

```http
GET /api/assets/analytics/performance?startDate=2025-01-01&endDate=2026-01-04
```

**Response:**

```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-01-01",
      "end": "2026-01-04",
      "days": 369
    },
    "summary": {
      "totalValue": "204000.50",
      "totalInvested": "158000.00",
      "totalGainLoss": "46000.50",
      "percentageReturn": 29.11,
      "annualizedReturn": 28.82
    },
    "byAssetType": [
      {
        "type": "CRYPTOCURRENCY",
        "value": "125750.00",
        "percentage": 61.62,
        "gainLoss": "23250.00",
        "return": 22.68
      },
      {
        "type": "REAL_ESTATE",
        "value": "78250.50",
        "percentage": 38.38,
        "gainLoss": "22750.50",
        "return": 41.03
      }
    ],
    "performanceChart": {
      "labels": ["Jan 2025", "Apr 2025", "Jul 2025", "Oct 2025", "Jan 2026"],
      "values": [158000, 170000, 185000, 195000, 204000.5]
    }
  }
}
```

## 🔗 Integration Examples

### 13. Create Asset from FundX Investment

**Event:**

```json
{
  "event": "fundx.investment.created",
  "data": {
    "investmentId": "fundx_inv_123",
    "portfolioId": "port_clx123abc",
    "strategyName": "Growth Portfolio - Tech Focus",
    "symbol": "TECH-001",
    "amount": 50000,
    "shares": 2000,
    "pricePerUnit": 25,
    "date": "2026-01-04T10:00:00.000Z",
    "strategy": "GROWTH",
    "riskLevel": "MEDIUM"
  }
}
```

**Automatic Asset Creation:**

```json
{
  "success": true,
  "data": {
    "id": "asset_fundx_123",
    "portfolioId": "port_clx123abc",
    "name": "Growth Portfolio - Tech Focus",
    "symbol": "TECH-001",
    "assetType": "INVESTMENT",
    "quantity": "2000.00",
    "purchasePrice": "25.00",
    "currentValue": "50000.00",
    "metadata": {
      "sourceId": "fundx_inv_123",
      "sourceDomain": "fundx",
      "strategy": "GROWTH",
      "riskLevel": "MEDIUM"
    },
    "relatedDomain": "fundx",
    "relatedTransactionId": "fundx_inv_123"
  }
}
```

### 14. Batch Update Prices

**Request:**

```http
POST /api/assets/prices/batch-update
Content-Type: application/json

{
  "prices": {
    "PI": 26.75,
    "BTC": 45000.50,
    "ETH": 2500.25
  },
  "source": "EXTERNAL_API",
  "timestamp": "2026-01-04T12:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "updated": 15,
    "failed": 0,
    "skipped": 3,
    "details": {
      "PI": {
        "assetsUpdated": 5,
        "oldPrice": "25.15",
        "newPrice": "26.75"
      },
      "BTC": {
        "assetsUpdated": 8,
        "oldPrice": "44500.00",
        "newPrice": "45000.50"
      },
      "ETH": {
        "assetsUpdated": 2,
        "oldPrice": "2450.00",
        "newPrice": "2500.25"
      }
    }
  }
}
```

## 🚨 Error Responses

### Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid asset data",
    "details": [
      {
        "field": "quantity",
        "message": "Quantity must be greater than 0"
      }
    ]
  }
}
```

### Not Found Error

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Asset not found: asset_xyz789"
  }
}
```

### Authentication Error

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please provide a valid JWT token."
  }
}
```

### Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "requestId": "req_abc123xyz"
  }
}
```

---

**Note**: All monetary values are returned as strings to preserve precision. Parse as needed in your application.

**Rate Limits**:

- General endpoints: 100 requests per minute
- Price update endpoints: 10 requests per minute
- Analytics endpoints: 20 requests per minute

**Last Updated**: January 2026
