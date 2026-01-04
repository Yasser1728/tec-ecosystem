# TEC Ecosystem - Integration Guide

## 🔗 Overview

This guide explains how the 24 domains within the TEC Ecosystem integrate and communicate with each other to create a cohesive, unified user experience.

## 🏗️ Integration Architecture

### Communication Patterns

The TEC Ecosystem uses multiple integration patterns:

1. **Synchronous APIs** - REST/GraphQL for immediate responses
2. **Asynchronous Events** - Event bus for loosely coupled operations
3. **Shared Data Views** - Read-only database views for analytics
4. **Unified Gateway** - Nexus domain as central API gateway

### Integration Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│              (User Interface & Experience)                   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Integration Layer                          │
│         Nexus (API Gateway) + Event Bus                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
│   Domain     │    │   Domain    │    │   Domain    │
│  Services    │    │  Services   │    │  Services   │
└──────┬───────┘    └─────┬───────┘    └─────┬───────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                  ┌───────▼────────┐
                  │   Data Layer   │
                  │   PostgreSQL   │
                  └────────────────┘
```

## 🔄 Cross-Domain Integration Scenarios

### 1. Investment to Asset Tracking

**Domains**: FundX → Assets → Analytics

**Scenario**: User makes investment in FundX, automatically tracked in Assets

**Flow**:
```javascript
// 1. User invests in FundX
POST /api/fundx/investments
{
  "strategyId": "growth_tech",
  "amount": 10000
}

// 2. FundX publishes event
eventBus.publish('fundx.investment.created', {
  investmentId: 'inv_123',
  userId: 'user_abc',
  amount: 10000,
  strategyName: 'Tech Growth Portfolio'
})

// 3. Assets service listens and creates asset
eventBus.on('fundx.investment.created', async (data) => {
  await assetService.createAsset({
    portfolioId: data.portfolioId,
    assetTypeId: 'INVESTMENT',
    name: data.strategyName,
    quantity: data.amount,
    purchasePrice: 1.0,
    metadata: {
      sourceId: data.investmentId,
      sourceDomain: 'fundx'
    }
  })
})

// 4. Analytics aggregates data
GET /api/analytics/portfolio/performance
```

### 2. Property Purchase Flow

**Domains**: Estate → NBF → Insure → Assets

**Scenario**: User purchases property with financing and insurance

**Flow**:
```javascript
// 1. User finds property in Estate
GET /api/estate/properties/prop_123

// 2. User applies for mortgage in NBF
POST /api/nbf/loans/apply
{
  "type": "MORTGAGE",
  "amount": 200000,
  "propertyId": "prop_123"
}

// 3. NBF approves loan and emits event
eventBus.publish('nbf.loan.approved', {
  loanId: 'loan_456',
  propertyId: 'prop_123'
})

// 4. Insure automatically offers property insurance
eventBus.on('nbf.loan.approved', async (data) => {
  await insureService.createQuote({
    type: 'PROPERTY',
    relatedId: data.propertyId
  })
})

// 5. Estate completes purchase
POST /api/estate/purchase
{
  "propertyId": "prop_123",
  "loanId": "loan_456",
  "insurancePolicyId": "policy_789"
}

// 6. Assets tracks property
eventBus.publish('estate.property.purchased', {...})
```

### 3. Travel Booking with Payment and Insurance

**Domains**: Explorer → NBF → Insure → Alert

**Scenario**: User books flight with automatic payment and insurance

**Flow**:
```javascript
// 1. User searches and selects flight
GET /api/explorer/search/flights
POST /api/explorer/bookings
{
  "flightId": "flt_123",
  "passengers": [...],
  "price": 5000
}

// 2. NBF processes payment
POST /api/nbf/transfers
{
  "amount": 5000,
  "purpose": "FLIGHT_BOOKING",
  "bookingId": "booking_123"
}

// 3. Insure offers travel insurance
GET /api/insure/quote
{
  "type": "TRAVEL",
  "tripCost": 5000,
  "destination": "Paris"
}

// 4. Alert sends confirmation
eventBus.publish('explorer.booking.confirmed', {...})
eventBus.on('explorer.booking.confirmed', async (data) => {
  await alertService.send({
    userId: data.userId,
    type: 'BOOKING_CONFIRMATION',
    message: 'Your flight is confirmed!'
  })
})
```

### 4. E-commerce Purchase with Asset Tracking

**Domains**: Ecommerce → NBF → Assets

**Scenario**: User purchases valuable collectible

**Flow**:
```javascript
// 1. User purchases item
POST /api/ecommerce/orders
{
  "productId": "prod_rare_watch",
  "quantity": 1,
  "price": 50000,
  "trackAsAsset": true
}

// 2. NBF processes payment
POST /api/nbf/transfers {...}

// 3. Ecommerce emits event
eventBus.publish('ecommerce.product.purchased', {
  productId: 'prod_rare_watch',
  trackAsAsset: true,
  value: 50000
})

// 4. Assets creates asset record
await assetService.handleCommerceProduct({
  productName: 'Rare Luxury Watch',
  assetType: 'COLLECTIBLE',
  quantity: 1,
  purchasePrice: 50000
})
```

### 5. VIP Member Cross-Domain Benefits

**Domains**: VIP → All Domains

**Scenario**: VIP member gets benefits across ecosystem

**Flow**:
```javascript
// 1. User subscribes to VIP
POST /api/vip/subscribe
{
  "tier": "PLATINUM"
}

// 2. VIP publishes event
eventBus.publish('vip.membership.activated', {
  userId: 'user_abc',
  tier: 'PLATINUM',
  benefits: [...]
})

// 3. All domains listen and apply benefits
// FundX: Lower fees
eventBus.on('vip.membership.activated', async (data) => {
  await fundxService.applyVipDiscount(data.userId, 0.5)
})

// Explorer: Priority booking
eventBus.on('vip.membership.activated', async (data) => {
  await explorerService.enablePriorityBooking(data.userId)
})

// Commerce: Exclusive deals
eventBus.on('vip.membership.activated', async (data) => {
  await commerceService.unlockExclusiveDeals(data.userId)
})
```

## 📡 Event Bus Specification

### Event Naming Convention

Format: `{domain}.{entity}.{action}`

Examples:
- `fundx.investment.created`
- `estate.property.purchased`
- `nbf.loan.approved`
- `vip.membership.activated`

### Event Structure

```javascript
{
  "event": "fundx.investment.created",
  "timestamp": "2026-01-04T10:00:00Z",
  "version": "1.0",
  "data": {
    "investmentId": "inv_123",
    "userId": "user_abc",
    "amount": 10000,
    // ... event-specific data
  },
  "metadata": {
    "correlationId": "req_xyz789",
    "source": "fundx-service",
    "triggeredBy": "user_action"
  }
}
```

### Standard Events by Domain

**FundX**:
- `fundx.investment.created`
- `fundx.investment.closed`
- `fundx.distribution.paid`

**NBF**:
- `nbf.account.created`
- `nbf.transfer.completed`
- `nbf.loan.approved`
- `nbf.loan.disbursed`

**Assets**:
- `assets.asset.created`
- `assets.asset.updated`
- `assets.valuation.recorded`

**Estate**:
- `estate.property.listed`
- `estate.property.purchased`
- `estate.offer.made`

**Explorer**:
- `explorer.booking.created`
- `explorer.booking.confirmed`
- `explorer.booking.cancelled`

**Insure**:
- `insure.policy.issued`
- `insure.claim.submitted`
- `insure.claim.approved`

## 🔌 API Gateway (Nexus)

### Unified GraphQL Interface

Access multiple domains in a single query:

```graphql
query UserDashboard {
  user(id: "user_abc") {
    id
    profile {
      name
      email
    }
    
    # Assets domain
    portfolios {
      id
      name
      totalValue
      assets {
        name
        currentValue
      }
    }
    
    # FundX domain
    investments {
      strategy
      currentValue
      return
    }
    
    # NBF domain
    accounts {
      accountNumber
      balance
    }
    
    # Explorer domain
    upcomingTrips {
      destination
      date
    }
  }
}
```

### REST API Aggregation

Nexus can aggregate multiple REST calls:

```javascript
// Single request to Nexus
GET /api/nexus/dashboard?userId=user_abc

// Nexus internally calls:
// - GET /api/assets/portfolios
// - GET /api/fundx/investments
// - GET /api/nbf/accounts
// - GET /api/explorer/bookings

// Returns aggregated response
{
  "portfolios": [...],
  "investments": [...],
  "accounts": [...],
  "upcomingTrips": [...]
}
```

## 🔐 Cross-Domain Authentication

### Single Sign-On (SSO)

Users authenticate once through TEC central hub:

```javascript
// 1. User authenticates
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "..."
}

// 2. Receives JWT token
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user_abc",
    "tier": "PREMIUM"
  }
}

// 3. Token works across all domains
// FundX
GET /api/fundx/investments
Authorization: Bearer eyJhbGc...

// Explorer
GET /api/explorer/bookings
Authorization: Bearer eyJhbGc...

// NBF
GET /api/nbf/accounts
Authorization: Bearer eyJhbGc...
```

### Permission System

JWT token contains user tier and permissions:

```javascript
{
  "userId": "user_abc",
  "tier": "PREMIUM",
  "permissions": {
    "fundx": ["read", "invest"],
    "assets": ["read", "write"],
    "vip": ["access"],
    "elite": ["book_consultations"]
  }
}
```

## 📊 Shared Data Views

### Cross-Domain Analytics

Read-only views for analytics without tight coupling:

```sql
-- View: user_financial_summary
CREATE VIEW user_financial_summary AS
SELECT 
  u.id as user_id,
  a.total_portfolio_value,
  f.total_investments,
  n.total_balance,
  (a.total_portfolio_value + f.total_investments + n.total_balance) as net_worth
FROM users u
LEFT JOIN (
  SELECT user_id, SUM(total_value) as total_portfolio_value
  FROM portfolios GROUP BY user_id
) a ON a.user_id = u.id
LEFT JOIN (
  SELECT user_id, SUM(current_value) as total_investments
  FROM fundx_investments GROUP BY user_id
) f ON f.user_id = u.id
LEFT JOIN (
  SELECT user_id, SUM(balance) as total_balance
  FROM nbf_accounts GROUP BY user_id
) n ON n.user_id = u.id;

-- Analytics domain queries this view
SELECT * FROM user_financial_summary WHERE user_id = 'user_abc';
```

## 🚀 Integration Best Practices

### 1. Idempotency

Ensure operations can be safely retried:

```javascript
// Use idempotency keys for critical operations
POST /api/fundx/investments
{
  "strategyId": "growth_tech",
  "amount": 10000,
  "idempotencyKey": "inv_20260104_abc123"
}
```

### 2. Graceful Degradation

Handle integration failures gracefully:

```javascript
try {
  // Try to create asset in Assets domain
  await assetService.createAsset(data)
} catch (error) {
  // Log error but don't fail the main operation
  logger.error('Failed to create asset', error)
  // Queue for retry
  await retryQueue.add('create_asset', data)
}
```

### 3. Circuit Breaker

Prevent cascading failures:

```javascript
const circuitBreaker = new CircuitBreaker(assetService.createAsset, {
  timeout: 5000,
  errorThreshold: 50,
  resetTimeout: 30000
})

// Calls will fail fast if Assets service is down
await circuitBreaker.fire(data)
```

### 4. Versioning

Version all APIs and events:

```javascript
// API versioning
GET /api/v1/fundx/investments
GET /api/v2/fundx/investments  // New version

// Event versioning
{
  "event": "fundx.investment.created",
  "version": "2.0",  // Indicates event schema version
  "data": {...}
}
```

## 📝 Integration Checklist

When integrating a new domain:

- [ ] Define domain boundaries and responsibilities
- [ ] Document all public APIs
- [ ] Define events published and consumed
- [ ] Implement authentication/authorization
- [ ] Add API to Nexus gateway
- [ ] Create database views if needed
- [ ] Implement error handling and retries
- [ ] Add monitoring and logging
- [ ] Write integration tests
- [ ] Update this integration guide

## 🔍 Monitoring & Debugging

### Correlation IDs

Track requests across domains:

```javascript
// Initial request
const correlationId = generateId()

// Passed to all downstream calls
headers: {
  'X-Correlation-ID': correlationId
}

// Logged in all services
logger.info('Processing investment', {
  correlationId,
  investmentId,
  // ...
})

// Query logs across all services
logs.query({
  correlationId: 'req_xyz789'
})
```

### Distributed Tracing

Use tools like OpenTelemetry to trace requests:

```javascript
const span = tracer.startSpan('create_investment')
try {
  // Main operation
  await fundxService.createInvestment(data)
  
  // Child span for asset creation
  const assetSpan = tracer.startSpan('create_asset', {
    parent: span
  })
  await assetService.createAsset(data)
  assetSpan.end()
  
  span.end()
} catch (error) {
  span.recordException(error)
  throw error
}
```

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Maintained By**: TEC Integration Team
