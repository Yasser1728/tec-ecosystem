# 🔗 GraphQL Federation Gateway

## Overview

Federated GraphQL gateway that provides a unified API interface across all 24 TEC domains. Enables complex queries spanning multiple services with a single request.

## Architecture

```
┌─────────────────────────────────────────────┐
│         GraphQL Federation Gateway          │
│              (Nexus Domain)                 │
├─────────────────────────────────────────────┤
│  • Schema Stitching                         │
│  • Query Planning & Optimization            │
│  • Response Merging                         │
│  • Caching Layer                            │
│  • Circuit Breaking                         │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼───┐          ┌───▼───┐
│Assets │          │FundX  │          ... (22 more domains)
│Domain │          │Domain │
└───────┘          └───────┘
```

## Key Features

### 1. Unified Schema
- Single GraphQL endpoint for all domains
- Type-safe queries across services
- Automatic schema merging

### 2. Intelligent Query Planning
- Parallel execution where possible
- Dependency resolution
- Optimal domain routing

### 3. Performance Optimization
- Response caching (5-minute TTL)
- Query complexity limiting
- Depth limiting (max 5 levels)
- DataLoader pattern for batching

### 4. Resilience
- Circuit breaker per domain
- Graceful degradation
- Error isolation

## Usage

### Basic Query

```graphql
query UserDashboard {
  user(id: "user_123") {
    id
    name
    email
  }
}
```

### Cross-Domain Query

```graphql
query CompleteUserProfile($userId: ID!) {
  # System domain
  user(id: $userId) {
    id
    name
    email
    tier
  }
  
  # Assets domain
  portfolio(userId: $userId) {
    totalValue
    assets {
      id
      name
      currentValue
      performance {
        day
        month
        year
      }
    }
  }
  
  # FundX domain
  investments(userId: $userId) {
    id
    strategy
    amount
    returns {
      total
      annualized
    }
  }
  
  # Commerce domain
  orders(userId: $userId, limit: 5) {
    id
    total
    status
    createdAt
  }
}
```

### With Variables

```graphql
query InvestmentAnalysis($userId: ID!, $timeframe: String!) {
  investments(userId: $userId) {
    strategy
    performance(timeframe: $timeframe) {
      returns
      volatility
      sharpeRatio
    }
  }
  
  portfolio(userId: $userId) {
    value(timeframe: $timeframe)
    allocation
  }
}
```

Variables:
```json
{
  "userId": "user_123",
  "timeframe": "1Y"
}
```

## Domain Schema Mapping

### System Domain
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  tier: UserTier!
  status: UserStatus!
  createdAt: DateTime!
}

enum UserTier {
  GUEST
  STANDARD
  PREMIUM
  ENTERPRISE
  ADMIN
}
```

### Assets Domain
```graphql
type Portfolio {
  userId: ID!
  totalValue: Float!
  currency: String!
  assets: [Asset!]!
  performance: PortfolioPerformance!
}

type Asset {
  id: ID!
  name: String!
  type: AssetType!
  currentValue: Float!
  quantity: Float!
  performance: AssetPerformance!
}
```

### FundX Domain
```graphql
type Investment {
  id: ID!
  userId: ID!
  strategy: String!
  amount: Float!
  startDate: DateTime!
  returns: InvestmentReturns!
}

type InvestmentReturns {
  total: Float!
  annualized: Float!
  timeWeighted: Float!
}
```

### Commerce Domain
```graphql
type Order {
  id: ID!
  userId: ID!
  total: Float!
  status: OrderStatus!
  items: [OrderItem!]!
  createdAt: DateTime!
}
```

## API Integration

### JavaScript/TypeScript

```javascript
const query = `
  query GetUserData($userId: ID!) {
    user(id: $userId) {
      name
      email
    }
    portfolio(userId: $userId) {
      totalValue
    }
  }
`;

const variables = { userId: 'user_123' };

const response = await fetch('/api/graphql/federated', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ query, variables })
});

const result = await response.json();
```

### cURL

```bash
curl -X POST https://api.tec.pi/api/graphql/federated \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "query { user(id: \"user_123\") { name email } }",
    "variables": {}
  }'
```

## Performance

### Query Complexity

Calculated based on:
- Number of fields: 10 points each
- Nested fields: 5 points each
- Maximum: 1000 points

```javascript
// Simple query: ~30 points
query { user { id name email } }

// Complex query: ~150 points
query {
  user {
    id
    portfolio {
      assets {
        name
        value
      }
    }
  }
}
```

### Caching

- **Default TTL**: 5 minutes
- **Cache Key**: Query + Variables hash
- **Cache Size**: Max 1000 entries
- **Cache Strategy**: LRU (Least Recently Used)

```javascript
// Cache configuration
const federation = new GraphQLFederation({
  cacheEnabled: true,
  cacheTTL: 300000, // 5 minutes
  maxCacheSize: 1000
});
```

### Query Depth Limiting

Maximum depth: 5 levels

```graphql
# Valid (depth 3)
query {
  user {              # Level 1
    portfolio {       # Level 2
      assets {        # Level 3
        name
      }
    }
  }
}

# Invalid (depth 6) - will be rejected
query {
  user {              # Level 1
    portfolio {       # Level 2
      assets {        # Level 3
        transactions { # Level 4
          details {   # Level 5
            metadata { # Level 6 - TOO DEEP
              ...
            }
          }
        }
      }
    }
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "data": null,
  "errors": [
    {
      "message": "Domain assets returned 500",
      "extensions": {
        "code": "DOMAIN_ERROR",
        "domain": "assets"
      }
    }
  ]
}
```

### Partial Success

```json
{
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "portfolio": null
  },
  "errors": [
    {
      "message": "Failed to fetch portfolio",
      "extensions": {
        "code": "TIMEOUT",
        "domain": "assets"
      }
    }
  ]
}
```

## Security

### Authentication

All queries require valid authentication:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

### Authorization

Queries respect domain-level permissions:

```graphql
# User with 'STANDARD' tier
query {
  user { name }           # ✅ Allowed
  portfolio { value }     # ✅ Allowed
  adminUsers { ... }      # ❌ Forbidden
}
```

### Rate Limiting

- **Per User**: 1000 requests/hour
- **Per IP**: 5000 requests/hour
- **Complex Queries**: Count as 2x-5x

## Best Practices

1. **Use Aliases for Multiple Queries**
```graphql
query {
  mainUser: user(id: "123") { name }
  secondUser: user(id: "456") { name }
}
```

2. **Request Only Needed Fields**
```graphql
# ❌ Bad - requests everything
query { user { * } }

# ✅ Good - specific fields
query { user { id name email } }
```

3. **Use Fragments for Reusability**
```graphql
fragment UserBasics on User {
  id
  name
  email
}

query {
  user1: user(id: "123") { ...UserBasics }
  user2: user(id: "456") { ...UserBasics }
}
```

4. **Leverage Caching**
```javascript
// Add cache control hint
query {
  user(id: "123") @cacheControl(maxAge: 300) {
    name
  }
}
```

## Monitoring

### Metrics

- Query execution time
- Cache hit/miss ratio
- Domain-specific errors
- Query complexity distribution

### Logging

All queries are logged with:
- Query string
- Variables
- Execution time
- User ID
- Domain calls
- Errors

## Troubleshooting

### Common Issues

**Issue**: Query timeout
- **Cause**: Complex query or slow domain
- **Solution**: Reduce query complexity or add pagination

**Issue**: High error rate
- **Cause**: Domain unavailable
- **Solution**: Check domain health, circuit breaker active

**Issue**: Slow response
- **Cause**: No caching, complex joins
- **Solution**: Enable caching, optimize query

## Future Enhancements

- [ ] Subscriptions support (real-time updates)
- [ ] Persisted queries
- [ ] Automatic pagination
- [ ] Field-level caching
- [ ] Query cost analysis
- [ ] GraphQL playground UI

## Resources

- GraphQL Spec: https://spec.graphql.org/
- Best Practices: https://graphql.org/learn/best-practices/
- TEC Schema: https://api.tec.pi/graphql/schema

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Maintained By**: TEC API Team
