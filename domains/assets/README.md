# Assets Domain - Portfolio Management & Asset Tracking

## 🎯 Domain Mission

The Assets domain (assets.pi) serves as the central portfolio management and asset tracking system within the TEC Ecosystem. It enables users to track, manage, and optimize their diverse asset holdings across multiple categories including cryptocurrencies, real estate, investments, and digital assets.

## 📋 Core Features

### 1. Asset Portfolio Management
- **Multi-Asset Support**: Track diverse asset types (crypto, real estate, stocks, digital assets)
- **Real-Time Valuation**: Live price feeds and automatic portfolio valuation
- **Performance Analytics**: Track ROI, gains/losses, and historical performance
- **Asset Allocation**: Visualize and optimize asset distribution

### 2. Asset Tracking
- **Acquisition Recording**: Document purchase details, dates, and costs
- **Lifecycle Management**: Track asset status from acquisition to disposal
- **Document Storage**: Store receipts, certificates, and legal documents
- **Tags & Categories**: Organize assets with custom taxonomies

### 3. Reporting & Analytics
- **Portfolio Dashboard**: Comprehensive overview of all holdings
- **Performance Reports**: Detailed analysis of investment returns
- **Tax Documents**: Generate tax-ready reports
- **Audit Trails**: Complete history of all transactions

### 4. Integration Features
- **Cross-Domain Sync**: Automatic updates from FundX, Commerce, Estate domains
- **Price Feeds**: Integration with external pricing APIs
- **Alerts & Notifications**: Price alerts, rebalancing suggestions
- **Export Capabilities**: CSV, PDF, and API exports

## 🏗️ Data Architecture

### Entity Relationship Overview

```
User (1) ──────< (M) Portfolio (1) ──────< (M) Asset
                                                   │
                                                   ├──< Transaction
                                                   ├──< Valuation
                                                   └──< Document

Category (1) ──────< (M) Asset
AssetType (1) ──────< (M) Asset
```

### Core Entities

#### 1. Portfolio
A portfolio represents a collection of assets owned by a user.

**Attributes:**
- `id`: Unique identifier (UUID)
- `userId`: Owner reference
- `name`: Portfolio name (e.g., "Main Portfolio", "Retirement Fund")
- `description`: Portfolio description
- `isDefault`: Boolean flag for default portfolio
- `currency`: Base currency for valuation (PI, USD, EUR)
- `totalValue`: Current total portfolio value
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

#### 2. Asset
Represents an individual asset within a portfolio.

**Attributes:**
- `id`: Unique identifier (UUID)
- `portfolioId`: Parent portfolio reference
- `assetTypeId`: Type classification reference
- `categoryId`: Category reference
- `name`: Asset name/title
- `symbol`: Asset symbol/ticker (if applicable)
- `description`: Detailed description
- `quantity`: Amount/shares held
- `purchasePrice`: Initial purchase price
- `purchaseDate`: Acquisition date
- `currentPrice`: Latest market price
- `currentValue`: Calculated current value
- `costBasis`: Total cost of acquisition
- `unrealizedGainLoss`: Current profit/loss
- `status`: Asset status (ACTIVE, SOLD, TRANSFERRED)
- `metadata`: JSON field for type-specific data
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

#### 3. AssetType
Classification of asset types.

**Attributes:**
- `id`: Unique identifier
- `name`: Type name (CRYPTOCURRENCY, REAL_ESTATE, STOCK, DIGITAL_ASSET, etc.)
- `icon`: Display icon
- `color`: UI color code
- `description`: Type description

#### 4. Category
User-defined or system categories for organizing assets.

**Attributes:**
- `id`: Unique identifier
- `userId`: Owner reference (null for system categories)
- `name`: Category name
- `description`: Category description
- `color`: UI color code
- `icon`: Display icon

#### 5. Transaction
Records all transactions related to an asset.

**Attributes:**
- `id`: Unique identifier
- `assetId`: Parent asset reference
- `type`: Transaction type (BUY, SELL, TRANSFER, DIVIDEND, SPLIT)
- `quantity`: Transaction amount
- `price`: Unit price at transaction time
- `totalAmount`: Total transaction value
- `fee`: Transaction fee
- `date`: Transaction date
- `description`: Transaction notes
- `relatedDomain`: Source domain (fundx, commerce, estate)
- `relatedTransactionId`: Reference to originating transaction
- `metadata`: Additional transaction data
- `createdAt`: Creation timestamp

#### 6. Valuation
Historical valuation snapshots for tracking performance.

**Attributes:**
- `id`: Unique identifier
- `assetId`: Parent asset reference
- `portfolioId`: Parent portfolio reference
- `price`: Unit price at valuation time
- `totalValue`: Total value at valuation time
- `source`: Valuation source (API, MANUAL, CALCULATED)
- `valuationDate`: Date of valuation
- `metadata`: Additional valuation data
- `createdAt`: Creation timestamp

#### 7. Document
Stores references to asset-related documents.

**Attributes:**
- `id`: Unique identifier
- `assetId`: Parent asset reference
- `type`: Document type (RECEIPT, CERTIFICATE, LEGAL, TAX)
- `name`: Document name
- `url`: Storage URL
- `fileSize`: File size in bytes
- `mimeType`: File MIME type
- `uploadedAt`: Upload timestamp
- `metadata`: Additional document data

## 📊 Data Model (Prisma Schema)

See [data-model/schema.prisma](./data-model/schema.prisma) for the complete Prisma schema definition.

## 🔌 API Reference

### Core Endpoints

#### Portfolio Management

**GET /api/assets/portfolios**
- Description: List all user portfolios
- Authentication: Required
- Response: Array of portfolio objects with summary statistics

**POST /api/assets/portfolios**
- Description: Create new portfolio
- Authentication: Required
- Request Body: `{ name, description, currency, isDefault }`
- Response: Created portfolio object

**GET /api/assets/portfolios/:id**
- Description: Get portfolio details with assets
- Authentication: Required
- Response: Portfolio object with nested assets

**PUT /api/assets/portfolios/:id**
- Description: Update portfolio
- Authentication: Required
- Request Body: Portfolio fields to update
- Response: Updated portfolio object

**DELETE /api/assets/portfolios/:id**
- Description: Delete portfolio (soft delete)
- Authentication: Required
- Response: Success confirmation

#### Asset Management

**GET /api/assets**
- Description: List all user assets across portfolios
- Authentication: Required
- Query Params: `portfolioId`, `categoryId`, `assetTypeId`, `status`
- Response: Array of asset objects

**POST /api/assets**
- Description: Add new asset to portfolio
- Authentication: Required
- Request Body: Asset details
- Response: Created asset object

**GET /api/assets/:id**
- Description: Get asset details with transactions and valuations
- Authentication: Required
- Response: Complete asset object with history

**PUT /api/assets/:id**
- Description: Update asset details
- Authentication: Required
- Request Body: Asset fields to update
- Response: Updated asset object

**DELETE /api/assets/:id**
- Description: Delete/archive asset
- Authentication: Required
- Response: Success confirmation

#### Transactions

**POST /api/assets/:assetId/transactions**
- Description: Record new transaction
- Authentication: Required
- Request Body: Transaction details
- Response: Created transaction object

**GET /api/assets/:assetId/transactions**
- Description: Get asset transaction history
- Authentication: Required
- Response: Array of transaction objects

#### Analytics

**GET /api/assets/analytics/portfolio/:portfolioId**
- Description: Get portfolio analytics and performance
- Authentication: Required
- Response: Analytics object with metrics

**GET /api/assets/analytics/performance**
- Description: Get overall performance across all portfolios
- Authentication: Required
- Query Params: `startDate`, `endDate`, `groupBy`
- Response: Performance data and charts

For detailed API examples, see [api/examples.md](./api/examples.md)

## 🔗 Integration Scenarios

### 1. FundX Investment Integration

**Scenario**: User makes an investment through FundX domain

**Flow**:
1. User completes investment transaction in FundX
2. FundX emits `investment.created` event
3. Assets service listens to event
4. Assets service creates new asset record
5. Transaction is recorded with reference to FundX
6. Portfolio value is recalculated

**Implementation**:
```javascript
// Event handler in Assets service
eventBus.on('fundx.investment.created', async (data) => {
  const asset = await assetService.createAsset({
    portfolioId: data.portfolioId,
    assetTypeId: 'INVESTMENT',
    name: data.strategyName,
    quantity: data.amount,
    purchasePrice: data.pricePerUnit,
    purchaseDate: data.date,
    metadata: {
      sourceId: data.investmentId,
      sourceDomain: 'fundx',
      strategy: data.strategy
    }
  });
  
  await transactionService.createTransaction({
    assetId: asset.id,
    type: 'BUY',
    quantity: data.amount,
    price: data.pricePerUnit,
    relatedDomain: 'fundx',
    relatedTransactionId: data.investmentId
  });
});
```

### 2. Real Estate Purchase Integration

**Scenario**: User purchases property through Estate domain

**Flow**:
1. User completes property purchase in Estate
2. Estate emits `property.purchased` event
3. Assets service creates real estate asset
4. Property details are stored in metadata
5. Documents are linked to asset
6. Portfolio is updated

### 3. Commerce Product Purchase Integration

**Scenario**: User purchases valuable items through Commerce

**Flow**:
1. User buys high-value product (e.g., luxury goods, collectibles)
2. Commerce emits `product.purchased` event with trackAsset flag
3. Assets service creates digital/physical asset record
4. Purchase receipt is stored as document
5. Asset appears in user portfolio

### 4. Price Update Integration

**Scenario**: Periodic price updates from external APIs

**Flow**:
1. Scheduled job fetches latest prices
2. Assets service updates current prices for all tracked assets
3. Valuations are recorded for historical tracking
4. Portfolio values are recalculated
5. Alerts are triggered if price thresholds are met

## 💼 Business Logic (Services)

### AssetService

Core business logic for asset management. See [services/assetService.js](./services/assetService.js) for implementation.

**Key Methods:**
- `createAsset(data)`: Create new asset with validation
- `updateAsset(id, data)`: Update asset details
- `deleteAsset(id)`: Soft delete asset
- `getAssetById(id)`: Retrieve asset with related data
- `getUserAssets(userId, filters)`: Get user's assets with filtering
- `calculateAssetValue(asset)`: Calculate current asset value
- `updateAssetPrices(assetIds)`: Batch update asset prices

### PortfolioService

Portfolio management and aggregation logic.

**Key Methods:**
- `createPortfolio(userId, data)`: Create new portfolio
- `updatePortfolio(id, data)`: Update portfolio details
- `deletePortfolio(id)`: Delete portfolio (with asset handling)
- `calculatePortfolioValue(portfolioId)`: Calculate total portfolio value
- `getPortfolioPerformance(portfolioId, period)`: Calculate performance metrics
- `rebalancePortfolio(portfolioId, targets)`: Suggest rebalancing actions

### TransactionService

Transaction recording and history management.

**Key Methods:**
- `recordTransaction(assetId, data)`: Record new transaction
- `getTransactionHistory(assetId)`: Get asset transaction history
- `updateAssetFromTransaction(transaction)`: Update asset based on transaction
- `calculateGainLoss(assetId)`: Calculate realized/unrealized gains

### ValuationService

Price tracking and valuation management.

**Key Methods:**
- `recordValuation(assetId, price, source)`: Record price snapshot
- `getHistoricalPrices(assetId, period)`: Get price history
- `updatePricesFromAPI(assetType)`: Fetch and update prices from external APIs
- `calculatePerformanceMetrics(assetId)`: Calculate ROI, IRR, etc.

## 🧪 Testing Strategy

### Unit Tests
- Test business logic in services
- Test data validation
- Test calculations (valuations, gains/losses)
- Mock external dependencies

### Integration Tests
- Test API endpoints
- Test database operations
- Test event handling
- Test cross-domain integrations

### Example Test:
```javascript
describe('AssetService', () => {
  describe('calculateAssetValue', () => {
    test('should calculate value correctly for stocks', async () => {
      const asset = {
        quantity: 100,
        currentPrice: 50.25
      };
      const value = await assetService.calculateAssetValue(asset);
      expect(value).toBe(5025);
    });
    
    test('should handle cryptocurrency decimals', async () => {
      const asset = {
        quantity: 1.5,
        // Intentional high-precision decimal value to test calculation accuracy with cryptocurrency prices
        currentPrice: 45000.50
      };
      const value = await assetService.calculateAssetValue(asset);
      expect(value).toBe(67500.75);
    });
  });
});
```

## 🚀 Deployment Considerations

### Performance Optimization
- Index frequently queried fields (userId, portfolioId, assetId)
- Cache portfolio valuations (invalidate on asset updates)
- Batch price updates to reduce API calls
- Use read replicas for analytics queries

### Scalability
- Partition data by user/portfolio for large-scale deployment
- Implement pagination for asset listings
- Use background jobs for price updates
- Consider NoSQL for flexible metadata storage

### Monitoring
- Track API response times
- Monitor price update job success rates
- Alert on failed integrations
- Track portfolio calculation performance

## 📈 Future Enhancements

1. **Advanced Analytics**
   - Risk analysis and portfolio stress testing
   - Predictive analytics using ML
   - Benchmark comparisons
   - Correlation analysis

2. **Social Features**
   - Portfolio sharing (with privacy controls)
   - Leaderboards and achievements
   - Community insights

3. **Automation**
   - Auto-rebalancing
   - Tax-loss harvesting
   - Recurring investments
   - Smart alerts

4. **Extended Integrations**
   - More external price feeds
   - Bank account connections
   - Brokerage integrations
   - DeFi protocol connections

## 📞 Support & Maintenance

- **Domain Owner**: Assets Team
- **Technical Lead**: To be assigned
- **Documentation**: This README and linked resources
- **Issue Tracking**: GitHub Issues with `domain:assets` label

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Active Development
