# Assets Domain - Entity Relationship Diagram (ERD)

## 📊 Visual Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ASSETS DOMAIN DATA MODEL                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   User       │          │  AssetType   │          │  Category    │
│ (External)   │          │              │          │              │
│              │          │ - id         │          │ - id         │
│ - id         │          │ - name       │          │ - userId     │
│ - email      │          │ - displayName│          │ - name       │
│ - ...        │          │ - icon       │          │ - description│
└──────┬───────┘          │ - color      │          │ - icon       │
       │                  │ - description│          │ - color      │
       │                  └──────┬───────┘          └──────┬───────┘
       │                         │                         │
       │ 1:M                     │ 1:M                     │ 1:M
       │                         │                         │
       ▼                         │                         │
┌──────────────┐                 │                         │
│  Portfolio   │                 │                         │
│              │                 │                         │
│ - id         │◄────────────────┼─────────────────────────┘
│ - userId     │                 │
│ - name       │                 │
│ - description│                 │
│ - isDefault  │                 │
│ - currency   │                 │
│ - totalValue │                 │
└──────┬───────┘                 │
       │                         │
       │ 1:M                     │
       │                         │
       ▼                         ▼
┌──────────────┐          ┌──────────────┐
│    Asset     │          │    Asset     │
│              │          │              │
│ - id         │◄─────────┤ - assetTypeId│
│ - portfolioId│          │ - categoryId │
│ - name       │          │ - symbol     │
│ - symbol     │          │ - quantity   │
│ - description│          │ - purchasePrice
│ - quantity   │          │ - currentPrice
│ - purchasePrice        │ - currentValue
│ - purchaseDate         │ - costBasis
│ - currentPrice         │ - unrealizedGainLoss
│ - currentValue         │ - status
│ - costBasis  │          │ - metadata   │
│ - status     │          └──────┬───────┘
│ - metadata   │                 │
└──────┬───────┘                 │
       │                         │
       ├─────────────────────────┼─────────────────┐
       │ 1:M                     │ 1:M             │ 1:M
       │                         │                 │
       ▼                         ▼                 ▼
┌──────────────┐          ┌──────────────┐  ┌──────────────┐
│ Transaction  │          │  Valuation   │  │  Document    │
│              │          │              │  │              │
│ - id         │          │ - id         │  │ - id         │
│ - assetId    │          │ - assetId    │  │ - assetId    │
│ - type       │          │ - portfolioId│  │ - type       │
│ - quantity   │          │ - price      │  │ - name       │
│ - price      │          │ - totalValue │  │ - url        │
│ - totalAmount│          │ - source     │  │ - fileSize   │
│ - fee        │          │ - valuationDate│ │ - mimeType   │
│ - date       │          │ - metadata   │  │ - metadata   │
│ - description│          └──────────────┘  │ - uploadedAt │
│ - relatedDomain        ┌──────────────┐  └──────────────┘
│ - relatedTxId│          │  PriceFeed   │
│ - metadata   │          │              │
└──────────────┘          │ - id         │
                          │ - symbol     │
┌──────────────┐          │ - assetType  │
│  AssetAlert  │          │ - source     │
│              │          │ - lastPrice  │
│ - id         │          │ - lastUpdate │
│ - userId     │          │ - apiEndpoint│
│ - assetId    │          │ - apiConfig  │
│ - portfolioId│          │ - isActive   │
│ - type       │          └──────────────┘
│ - condition  │
│ - isActive   │
│ - lastTriggered
│ - triggerCount
└──────────────┘
```

## 🔗 Relationship Details

### 1. User → Portfolio (1:Many)

- **Description**: A user can have multiple portfolios
- **Cardinality**: One user can have many portfolios
- **Cascade**: Deleting a user should cascade delete portfolios (handled by auth system)
- **Business Rule**: At least one portfolio must be marked as default per user

### 2. Portfolio → Asset (1:Many)

- **Description**: A portfolio contains multiple assets
- **Cardinality**: One portfolio can have many assets
- **Cascade**: DELETE CASCADE - deleting a portfolio removes all its assets
- **Business Rule**: Portfolio totalValue is calculated sum of all asset currentValues

### 3. AssetType → Asset (1:Many)

- **Description**: Each asset belongs to one asset type
- **Cardinality**: One asset type can classify many assets
- **Cascade**: RESTRICT - cannot delete asset type if assets exist
- **Business Rule**: Asset types are predefined system data

### 4. Category → Asset (1:Many, Optional)

- **Description**: Assets can be optionally categorized
- **Cardinality**: One category can include many assets
- **Cascade**: SET NULL - deleting a category removes category reference from assets
- **Business Rule**: Categories can be user-defined or system-defined

### 5. Asset → Transaction (1:Many)

- **Description**: Each asset has a transaction history
- **Cardinality**: One asset can have many transactions
- **Cascade**: DELETE CASCADE - deleting an asset removes all transactions
- **Business Rule**: First transaction is typically a BUY transaction

### 6. Asset → Valuation (1:Many)

- **Description**: Assets have historical valuation snapshots
- **Cardinality**: One asset can have many valuations
- **Cascade**: DELETE CASCADE - deleting an asset removes all valuations
- **Business Rule**: Valuations are recorded periodically for performance tracking

### 7. Asset → Document (1:Many)

- **Description**: Assets can have associated documents
- **Cardinality**: One asset can have many documents
- **Cascade**: DELETE CASCADE - deleting an asset removes all documents
- **Business Rule**: Documents are stored externally; database only stores references

### 8. Portfolio → Valuation (1:Many)

- **Description**: Portfolio-level valuations for overall performance
- **Cardinality**: One portfolio can have many valuations
- **Cascade**: DELETE CASCADE - deleting a portfolio removes valuations
- **Business Rule**: Portfolio valuations are snapshot of total portfolio value

## 📋 Entity Descriptions

### Core Entities

#### Portfolio

**Purpose**: Container for grouping related assets
**Key Attributes**:

- `totalValue`: Automatically calculated from sum of asset values
- `isDefault`: Only one default portfolio per user
- `currency`: Base currency for valuation calculations

**Constraints**:

- Unique constraint on (userId, name)
- At least one portfolio must be default per user

#### Asset

**Purpose**: Represents a single investment or holding
**Key Attributes**:

- `quantity`: Amount held (supports decimals for fractional shares)
- `purchasePrice`: Original purchase price per unit
- `currentPrice`: Latest market price per unit
- `currentValue`: Calculated as quantity × currentPrice
- `unrealizedGainLoss`: Calculated as currentValue - costBasis
- `metadata`: JSON field for type-specific data

**Calculated Fields**:

```javascript
currentValue = quantity × currentPrice
unrealizedGainLoss = currentValue - costBasis
costBasis = sum of (purchase transactions)
```

**Status Values**:

- `ACTIVE`: Currently held asset
- `SOLD`: Asset has been completely sold
- `TRANSFERRED`: Asset transferred to another portfolio/user
- `ARCHIVED`: No longer active but kept for records

#### Transaction

**Purpose**: Records all asset movements and changes
**Transaction Types**:

- `BUY`: Purchase of asset
- `SELL`: Sale of asset
- `TRANSFER`: Transfer between portfolios
- `DIVIDEND`: Dividend or interest payment
- `SPLIT`: Stock split or similar event
- `ADJUSTMENT`: Manual adjustment/correction

**Integration Fields**:

- `relatedDomain`: Source domain (fundx, commerce, estate)
- `relatedTransactionId`: Reference to originating transaction

#### Valuation

**Purpose**: Historical price snapshots for performance tracking
**Sources**:

- `API`: From external price feed APIs
- `MANUAL`: User-entered valuation
- `CALCULATED`: System-calculated based on transactions

#### Document

**Purpose**: Links to asset-related documents
**Document Types**:

- `RECEIPT`: Purchase receipts
- `CERTIFICATE`: Ownership certificates
- `LEGAL`: Legal documents
- `TAX`: Tax-related documents
- `CONTRACT`: Contracts and agreements
- `APPRAISAL`: Appraisal reports

### Supporting Entities

#### AssetType

**Purpose**: Classification of asset categories
**Standard Types**:

- CRYPTOCURRENCY
- REAL_ESTATE
- STOCK
- BOND
- DIGITAL_ASSET
- COMMODITY
- COLLECTIBLE
- BUSINESS_INTEREST

#### Category

**Purpose**: User-defined or system categorization
**Examples**:

- "Long-term Holdings"
- "Retirement Fund"
- "Speculative Investments"
- "Income Generating"

#### PriceFeed

**Purpose**: External price data integration
**Function**: Maintains connections to external APIs for automated price updates

#### AssetAlert

**Purpose**: User-configurable alerts and notifications
**Alert Types**:

- `PRICE_ABOVE`: Alert when price exceeds threshold
- `PRICE_BELOW`: Alert when price drops below threshold
- `VALUE_CHANGE`: Alert on portfolio value change %
- `REBALANCE_NEEDED`: Alert when portfolio allocation drifts

## 🔄 Data Flow Patterns

### Asset Creation Flow

```
1. User creates asset (manual or via integration)
   ↓
2. Asset record created with ACTIVE status
   ↓
3. Initial BUY transaction created
   ↓
4. Portfolio totalValue recalculated
   ↓
5. Initial valuation snapshot created
```

### Price Update Flow

```
1. Scheduled job fetches prices from PriceFeed
   ↓
2. Asset currentPrice updated
   ↓
3. Asset currentValue recalculated
   ↓
4. Asset unrealizedGainLoss recalculated
   ↓
5. Valuation snapshot created
   ↓
6. Portfolio totalValue recalculated
   ↓
7. Alerts checked and triggered if conditions met
```

### Cross-Domain Integration Flow

```
FundX Investment Created
   ↓
Event: fundx.investment.created
   ↓
Assets Service Listens
   ↓
Create Asset with metadata.sourceId = investmentId
   ↓
Create BUY Transaction with relatedDomain = 'fundx'
   ↓
Update Portfolio
```

## 🔐 Security & Privacy

### Data Access Rules

- Users can only access their own portfolios and assets
- System categories are read-only for all users
- Admin users can view aggregated analytics (anonymized)
- Price feeds are public data

### Soft Delete Strategy

- Assets: Status changed to ARCHIVED instead of hard delete
- Portfolios: Keep historical data for tax/audit purposes
- Transactions: Never deleted, only marked as voided
- Documents: Soft delete with retention period

## 📊 Performance Considerations

### Indexes

Key indexes for query performance:

- `assets(portfolioId, status)` - For active assets queries
- `transactions(assetId, date)` - For transaction history
- `valuations(assetId, valuationDate)` - For performance charts
- `portfolios(userId, isDefault)` - For user portfolio lookup

### Caching Strategy

- Cache portfolio totalValue (invalidate on asset update)
- Cache current prices (TTL: 5 minutes)
- Cache performance metrics (TTL: 1 hour)
- Cache user categories (invalidate on CRUD)

### Aggregation Queries

Use materialized views for:

- User total asset value across all portfolios
- Asset type distribution
- Performance metrics over time periods
- Portfolio allocation percentages

## 🧪 Sample Data

### Example Portfolio

```json
{
  "id": "port_123",
  "userId": "user_abc",
  "name": "Main Investment Portfolio",
  "isDefault": true,
  "currency": "PI",
  "totalValue": "125750.50"
}
```

### Example Asset

```json
{
  "id": "asset_456",
  "portfolioId": "port_123",
  "assetTypeId": "CRYPTOCURRENCY",
  "name": "Pi Network",
  "symbol": "PI",
  "quantity": "5000.00",
  "purchasePrice": "20.50",
  "currentPrice": "25.15",
  "currentValue": "125750.00",
  "costBasis": "102500.00",
  "unrealizedGainLoss": "23250.00",
  "status": "ACTIVE",
  "metadata": {
    "walletAddress": "0x123...",
    "network": "pi-mainnet"
  }
}
```

### Example Transaction

```json
{
  "id": "tx_789",
  "assetId": "asset_456",
  "type": "BUY",
  "quantity": "5000.00",
  "price": "20.50",
  "totalAmount": "102500.00",
  "fee": "25.00",
  "date": "2025-01-01T00:00:00Z",
  "relatedDomain": "fundx",
  "relatedTransactionId": "fundx_tx_999"
}
```

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Maintained By**: TEC Assets Team
