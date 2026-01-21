# Assets Domain - Portfolio Management & Asset Tracking

# دومين الأصول - إدارة المحفظة وتتبع الأصول

---

## 🌐 Language / اللغة

- [English Version](#english-version)
- [النسخة العربية](#النسخة-العربية)

---

# English Version

## 🎯 Domain Mission

The Assets domain (assets.pi) serves as the central portfolio management and asset tracking system within the TEC Ecosystem. It enables users to track, manage, and optimize their diverse asset holdings across multiple categories including cryptocurrencies, real estate, investments, and digital assets.

**Vision**: To provide users with complete financial sovereignty by offering professional-grade portfolio management tools accessible through Pi Network's decentralized infrastructure.

**Core Values**:

- **Transparency**: Complete visibility into asset holdings and performance
- **Security**: Bank-grade security for asset data and documents
- **Independence**: User owns and controls all asset data
- **Integration**: Seamless connection with all TEC ecosystem domains

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
eventBus.on("fundx.investment.created", async (data) => {
  const asset = await assetService.createAsset({
    portfolioId: data.portfolioId,
    assetTypeId: "INVESTMENT",
    name: data.strategyName,
    quantity: data.amount,
    purchasePrice: data.pricePerUnit,
    purchaseDate: data.date,
    metadata: {
      sourceId: data.investmentId,
      sourceDomain: "fundx",
      strategy: data.strategy,
    },
  });

  await transactionService.createTransaction({
    assetId: asset.id,
    type: "BUY",
    quantity: data.amount,
    price: data.pricePerUnit,
    relatedDomain: "fundx",
    relatedTransactionId: data.investmentId,
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
describe("AssetService", () => {
  describe("calculateAssetValue", () => {
    test("should calculate value correctly for stocks", async () => {
      const asset = {
        quantity: 100,
        currentPrice: 50.25,
      };
      const value = await assetService.calculateAssetValue(asset);
      expect(value).toBe(5025);
    });

    test("should handle cryptocurrency decimals", async () => {
      const asset = {
        quantity: 1.5,
        currentPrice: 45000.5,
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

## 📚 Additional Documentation

### For Developers

- **[TypeScript Types](./types/index.ts)** - Complete type definitions for all entities and operations
- **[Integration Service](./services/integrationService.js)** - Event bus integration and cross-domain communication
- **[Integration Example](./integration-example.md)** - Real-world example: FundX → Assets → Analytics
- **[Unit Tests](./tests/unit/assetService.test.js)** - Comprehensive unit test suite
- **[Integration Tests](./tests/integration/eventBus.test.js)** - Event bus integration tests

### For Users

- **[User Journey](./user-journey.md)** - Complete journey from registration to financial sovereignty
- **[API Examples](./api/examples.md)** - Request/response examples for all endpoints
- **[ERD Documentation](./data-model/erd.md)** - Detailed entity relationship diagrams

### For New Team Members

- **[Collaboration Guide](/COLLABORATION_GUIDE.md)** - How to develop and expand domains (uses Assets as reference)
- **[Event Bus Documentation](/lib/eventBus.js)** - Central event management system

---

## 🎓 Assets Domain as Reference Implementation

The Assets domain serves as the **reference implementation** for all TEC domains, demonstrating:

✅ **Complete Service Layer**

- Full CRUD operations with validation
- Advanced analytics (price trends, risk metrics, investment insights)
- Cross-domain integration via Event Bus
- Comprehensive error handling

✅ **Event-Driven Architecture**

- Publishes events for downstream consumers
- Listens to events from FundX, Estate, Commerce, Insure domains
- Correlation ID tracking for distributed tracing
- Error handling and retry logic

✅ **Type Safety**

- Complete TypeScript type definitions
- Enums for constants and status values
- Input/output types for all operations
- Event type definitions

✅ **Testing Excellence**

- Unit tests for all service methods (80%+ coverage)
- Integration tests for event flows
- Mock strategies and fixtures
- Testing best practices documented

✅ **Documentation Quality**

- Comprehensive README with examples
- API documentation with request/response samples
- User journey documentation
- Real-world integration examples
- Code comments and JSDoc

Use this domain as a template when creating new domains in the TEC Ecosystem.

---

**Last Updated**: January 2026
**Version**: 1.1.0 - Event Bus Integration & Advanced Analytics
**Status**: Active - Reference Implementation

---

# النسخة العربية

## 🎯 مهمة الدومين

دومين الأصول (assets.pi) هو النظام المركزي لإدارة المحفظة الاستثمارية وتتبع الأصول داخل نظام TEC البيئي. يُمكّن المستخدمين من تتبع وإدارة وتحسين ممتلكاتهم المتنوعة من الأصول عبر فئات متعددة تشمل العملات المشفرة والعقارات والاستثمارات والأصول الرقمية.

**الرؤية**: توفير السيادة المالية الكاملة للمستخدمين من خلال تقديم أدوات إدارة محفظة احترافية يمكن الوصول إليها عبر البنية التحتية اللامركزية لشبكة Pi.

**القيم الأساسية**:

- **الشفافية**: رؤية كاملة لحيازات الأصول والأداء
- **الأمان**: أمان بمستوى البنوك لبيانات الأصول والمستندات
- **الاستقلالية**: المستخدم يمتلك ويتحكم في جميع بيانات أصوله
- **التكامل**: اتصال سلس مع جميع دومينات نظام TEC البيئي

## 📋 الميزات الأساسية

### 1. إدارة محفظة الأصول

- **دعم متعدد للأصول**: تتبع أنواع متنوعة من الأصول (العملات المشفرة، العقارات، الأسهم، الأصول الرقمية)
- **التقييم الفوري**: تدفقات الأسعار المباشرة والتقييم التلقائي للمحفظة
- **تحليلات الأداء**: تتبع العائد على الاستثمار والأرباح/الخسائر والأداء التاريخي
- **توزيع الأصول**: تصور وتحسين توزيع الأصول

### 2. تتبع الأصول

- **تسجيل الاستحواذ**: توثيق تفاصيل الشراء والتواريخ والتكاليف
- **إدارة دورة الحياة**: تتبع حالة الأصل من الاستحواذ إلى التصرف
- **تخزين المستندات**: تخزين الإيصالات والشهادات والمستندات القانونية
- **العلامات والفئات**: تنظيم الأصول بتصنيفات مخصصة

### 3. التقارير والتحليلات

- **لوحة المحفظة**: نظرة عامة شاملة على جميع الحيازات
- **تقارير الأداء**: تحليل تفصيلي لعوائد الاستثمار
- **مستندات الضرائب**: إنشاء تقارير جاهزة للضرائب
- **مسارات التدقيق**: تاريخ كامل لجميع المعاملات

### 4. ميزات التكامل

- **المزامنة عبر الدومينات**: تحديثات تلقائية من دومينات FundX و Commerce و Estate
- **تدفقات الأسعار**: التكامل مع واجهات برمجة تطبيقات التسعير الخارجية
- **التنبيهات والإشعارات**: تنبيهات الأسعار واقتراحات إعادة التوازن
- **قدرات التصدير**: تصدير CSV و PDF و API

## 🏗️ هندسة البيانات

### نظرة عامة على علاقات الكيانات

```
المستخدم (1) ──────< (متعدد) المحفظة (1) ──────< (متعدد) الأصل
                                                    │
                                                    ├──< المعاملة
                                                    ├──< التقييم
                                                    └──< المستند

الفئة (1) ──────< (متعدد) الأصل
نوع الأصل (1) ──────< (متعدد) الأصل
```

### الكيانات الأساسية

#### 1. المحفظة (Portfolio)

المحفظة تمثل مجموعة من الأصول المملوكة للمستخدم.

**السمات**:

- `id`: معرف فريد (UUID)
- `userId`: مرجع المالك
- `name`: اسم المحفظة (مثل "المحفظة الرئيسية"، "صندوق التقاعد")
- `description`: وصف المحفظة
- `isDefault`: علامة منطقية للمحفظة الافتراضية
- `currency`: العملة الأساسية للتقييم (PI، USD، EUR)
- `totalValue`: القيمة الإجمالية الحالية للمحفظة
- `createdAt`: طابع زمني للإنشاء
- `updatedAt`: طابع زمني لآخر تحديث

#### 2. الأصل (Asset)

يمثل أصلًا فرديًا ضمن المحفظة.

**السمات**:

- `id`: معرف فريد (UUID)
- `portfolioId`: مرجع المحفظة الأم
- `assetTypeId`: مرجع تصنيف النوع
- `categoryId`: مرجع الفئة
- `name`: اسم/عنوان الأصل
- `symbol`: رمز/مؤشر الأصل (إن وجد)
- `description`: وصف مفصل
- `quantity`: الكمية/الأسهم المحتفظ بها
- `purchasePrice`: سعر الشراء الأولي
- `purchaseDate`: تاريخ الاستحواذ
- `currentPrice`: آخر سعر في السوق
- `currentValue`: القيمة الحالية المحسوبة
- `costBasis`: التكلفة الإجمالية للاستحواذ
- `unrealizedGainLoss`: الربح/الخسارة الحالية
- `status`: حالة الأصل (نشط، مُباع، محول)
- `metadata`: حقل JSON لبيانات خاصة بالنوع
- `createdAt`: طابع زمني للإنشاء
- `updatedAt`: طابع زمني لآخر تحديث

#### 3. نوع الأصل (AssetType)

تصنيف أنواع الأصول.

**السمات**:

- `id`: معرف فريد
- `name`: اسم النوع (عملة مشفرة، عقار، سهم، أصل رقمي، إلخ)
- `icon`: أيقونة العرض
- `color`: رمز اللون في واجهة المستخدم
- `description`: وصف النوع

#### 4. الفئة (Category)

فئات محددة من قبل المستخدم أو النظام لتنظيم الأصول.

**السمات**:

- `id`: معرف فريد
- `userId`: مرجع المالك (فارغ للفئات النظامية)
- `name`: اسم الفئة
- `description`: وصف الفئة
- `color`: رمز اللون في واجهة المستخدم
- `icon`: أيقونة العرض

#### 5. المعاملة (Transaction)

تسجل جميع المعاملات المتعلقة بأصل.

**السمات**:

- `id`: معرف فريد
- `assetId`: مرجع الأصل الأم
- `type`: نوع المعاملة (شراء، بيع، تحويل، توزيع أرباح، تقسيم)
- `quantity`: مبلغ المعاملة
- `price`: سعر الوحدة في وقت المعاملة
- `totalAmount`: القيمة الإجمالية للمعاملة
- `fee`: رسوم المعاملة
- `date`: تاريخ المعاملة
- `description`: ملاحظات المعاملة
- `relatedDomain`: دومين المصدر (fundx، commerce، estate)
- `relatedTransactionId`: مرجع المعاملة الأصلية
- `metadata`: بيانات معاملة إضافية
- `createdAt`: طابع زمني للإنشاء

#### 6. التقييم (Valuation)

لقطات تقييم تاريخية لتتبع الأداء.

**السمات**:

- `id`: معرف فريد
- `assetId`: مرجع الأصل الأم
- `portfolioId`: مرجع المحفظة الأم
- `price`: سعر الوحدة في وقت التقييم
- `totalValue`: القيمة الإجمالية في وقت التقييم
- `source`: مصدر التقييم (API، يدوي، محسوب)
- `valuationDate`: تاريخ التقييم
- `metadata`: بيانات تقييم إضافية
- `createdAt`: طابع زمني للإنشاء

#### 7. المستند (Document)

يخزن مراجع المستندات المتعلقة بالأصل.

**السمات**:

- `id`: معرف فريد
- `assetId`: مرجع الأصل الأم
- `type`: نوع المستند (إيصال، شهادة، قانوني، ضريبي)
- `name`: اسم المستند
- `url`: عنوان URL للتخزين
- `fileSize`: حجم الملف بالبايت
- `mimeType`: نوع MIME للملف
- `uploadedAt`: طابع زمني للرفع
- `metadata`: بيانات مستند إضافية

## 🔌 مرجع الواجهة البرمجية (API)

### نقاط النهاية الأساسية

#### إدارة المحفظة

**GET /api/assets/portfolios**

- الوصف: عرض جميع محافظ المستخدم
- المصادقة: مطلوبة
- الاستجابة: مصفوفة من كائنات المحفظة مع إحصائيات موجزة

**POST /api/assets/portfolios**

- الوصف: إنشاء محفظة جديدة
- المصادقة: مطلوبة
- نص الطلب: `{ name, description, currency, isDefault }`
- الاستجابة: كائن المحفظة المُنشأة

**GET /api/assets/portfolios/:id**

- الوصف: الحصول على تفاصيل المحفظة مع الأصول
- المصادقة: مطلوبة
- الاستجابة: كائن المحفظة مع الأصول المدمجة

**PUT /api/assets/portfolios/:id**

- الوصف: تحديث المحفظة
- المصادقة: مطلوبة
- نص الطلب: حقول المحفظة المراد تحديثها
- الاستجابة: كائن المحفظة المحدثة

**DELETE /api/assets/portfolios/:id**

- الوصف: حذف المحفظة (حذف ناعم)
- المصادقة: مطلوبة
- الاستجابة: تأكيد النجاح

#### إدارة الأصول

**GET /api/assets**

- الوصف: عرض جميع أصول المستخدم عبر المحافظ
- المصادقة: مطلوبة
- معاملات الاستعلام: `portfolioId`, `categoryId`, `assetTypeId`, `status`
- الاستجابة: مصفوفة من كائنات الأصول

**POST /api/assets**

- الوصف: إضافة أصل جديد إلى المحفظة
- المصادقة: مطلوبة
- نص الطلب: تفاصيل الأصل
- الاستجابة: كائن الأصل المُنشأ

**GET /api/assets/:id**

- الوصف: الحصول على تفاصيل الأصل مع المعاملات والتقييمات
- المصادقة: مطلوبة
- الاستجابة: كائن أصل كامل مع السجل

**PUT /api/assets/:id**

- الوصف: تحديث تفاصيل الأصل
- المصادقة: مطلوبة
- نص الطلب: حقول الأصل المراد تحديثها
- الاستجابة: كائن الأصل المحدث

**DELETE /api/assets/:id**

- الوصف: حذف/أرشفة الأصل
- المصادقة: مطلوبة
- الاستجابة: تأكيد النجاح

#### المعاملات

**POST /api/assets/:assetId/transactions**

- الوصف: تسجيل معاملة جديدة
- المصادقة: مطلوبة
- نص الطلب: تفاصيل المعاملة
- الاستجابة: كائن المعاملة المُنشأة

**GET /api/assets/:assetId/transactions**

- الوصف: الحصول على سجل معاملات الأصل
- المصادقة: مطلوبة
- الاستجابة: مصفوفة من كائنات المعاملات

#### التحليلات

**GET /api/assets/analytics/portfolio/:portfolioId**

- الوصف: الحصول على تحليلات المحفظة والأداء
- المصادقة: مطلوبة
- الاستجابة: كائن التحليلات مع المقاييس

**GET /api/assets/analytics/performance**

- الوصف: الحصول على الأداء العام عبر جميع المحافظ
- المصادقة: مطلوبة
- معاملات الاستعلام: `startDate`, `endDate`, `groupBy`
- الاستجابة: بيانات الأداء والرسوم البيانية

## 🔗 سيناريوهات التكامل

### 1. التكامل مع استثمارات FundX

**السيناريو**: يقوم المستخدم باستثمار عبر دومين FundX

**التدفق**:

1. يكمل المستخدم معاملة الاستثمار في FundX
2. ينشر FundX حدث `investment.created`
3. خدمة الأصول تستمع للحدث
4. خدمة الأصول تُنشئ سجل أصل جديد
5. يتم تسجيل المعاملة مع الإشارة إلى FundX
6. يتم إعادة حساب قيمة المحفظة

### 2. التكامل مع شراء العقارات

**السيناريو**: يقوم المستخدم بشراء عقار عبر دومين Estate

**التدفق**:

1. يكمل المستخدم شراء العقار في Estate
2. ينشر Estate حدث `property.purchased`
3. خدمة الأصول تُنشئ أصل عقاري
4. تُخزن تفاصيل العقار في البيانات الوصفية
5. تُربط المستندات بالأصل
6. يتم تحديث المحفظة

### 3. التكامل مع شراء منتجات Commerce

**السيناريو**: يقوم المستخدم بشراء عناصر قيمة عبر Commerce

**التدفق**:

1. يشتري المستخدم منتجًا عالي القيمة (مثل السلع الفاخرة، المقتنيات)
2. ينشر Commerce حدث `product.purchased` مع علامة trackAsset
3. خدمة الأصول تُنشئ سجل أصل رقمي/مادي
4. يتم تخزين إيصال الشراء كمستند
5. يظهر الأصل في محفظة المستخدم

### 4. التكامل مع تحديث الأسعار

**السيناريو**: تحديثات دورية للأسعار من واجهات برمجة التطبيقات الخارجية

**التدفق**:

1. تجلب المهمة المجدولة آخر الأسعار
2. تقوم خدمة الأصول بتحديث الأسعار الحالية لجميع الأصول المتتبعة
3. يتم تسجيل التقييمات للتتبع التاريخي
4. يتم إعادة حساب قيم المحفظة
5. يتم تشغيل التنبيهات إذا تم الوصول إلى عتبات الأسعار

## 💼 منطق الأعمال (الخدمات)

### AssetService (خدمة الأصول)

منطق الأعمال الأساسي لإدارة الأصول.

**الطرق الرئيسية**:

- `createAsset(data)`: إنشاء أصل جديد مع التحقق
- `updateAsset(id, data)`: تحديث تفاصيل الأصل
- `deleteAsset(id)`: حذف ناعم للأصل
- `getAssetById(id)`: استرجاع الأصل مع البيانات ذات الصلة
- `getUserAssets(userId, filters)`: الحصول على أصول المستخدم مع التصفية
- `calculateAssetValue(asset)`: حساب القيمة الحالية للأصل
- `updateAssetPrices(assetIds)`: تحديث دفعي لأسعار الأصول

### PortfolioService (خدمة المحفظة)

منطق إدارة المحفظة والتجميع.

**الطرق الرئيسية**:

- `createPortfolio(userId, data)`: إنشاء محفظة جديدة
- `updatePortfolio(id, data)`: تحديث تفاصيل المحفظة
- `deletePortfolio(id)`: حذف المحفظة (مع معالجة الأصول)
- `calculatePortfolioValue(portfolioId)`: حساب القيمة الإجمالية للمحفظة
- `getPortfolioPerformance(portfolioId, period)`: حساب مقاييس الأداء
- `rebalancePortfolio(portfolioId, targets)`: اقتراح إجراءات إعادة التوازن

### TransactionService (خدمة المعاملات)

تسجيل المعاملات وإدارة السجل.

**الطرق الرئيسية**:

- `recordTransaction(assetId, data)`: تسجيل معاملة جديدة
- `getTransactionHistory(assetId)`: الحصول على سجل معاملات الأصل
- `updateAssetFromTransaction(transaction)`: تحديث الأصل بناءً على المعاملة
- `calculateGainLoss(assetId)`: حساب الأرباح/الخسائر المحققة/غير المحققة

### ValuationService (خدمة التقييم)

تتبع الأسعار وإدارة التقييم.

**الطرق الرئيسية**:

- `recordValuation(assetId, price, source)`: تسجيل لقطة السعر
- `getHistoricalPrices(assetId, period)`: الحصول على سجل الأسعار
- `updatePricesFromAPI(assetType)`: جلب وتحديث الأسعار من واجهات برمجة التطبيقات الخارجية
- `calculatePerformanceMetrics(assetId)`: حساب العائد على الاستثمار، IRR، إلخ

## 🚀 اعتبارات النشر

### تحسين الأداء

- فهرسة الحقول المستعلم عنها بشكل متكرر (userId، portfolioId، assetId)
- تخزين مؤقت لتقييمات المحفظة (إبطال عند تحديثات الأصول)
- دفعات تحديثات الأسعار لتقليل استدعاءات API
- استخدام نسخ القراءة للاستعلامات التحليلية

### قابلية التوسع

- تقسيم البيانات حسب المستخدم/المحفظة للنشر واسع النطاق
- تنفيذ ترقيم الصفحات لقوائم الأصول
- استخدام وظائف خلفية لتحديثات الأسعار
- النظر في NoSQL لتخزين البيانات الوصفية المرنة

### المراقبة

- تتبع أوقات استجابة API
- مراقبة معدلات نجاح وظائف تحديث الأسعار
- التنبيه عند فشل التكاملات
- تتبع أداء حسابات المحفظة

## 📈 التحسينات المستقبلية

1. **تحليلات متقدمة**
   - تحليل المخاطر واختبار ضغط المحفظة
   - تحليلات تنبؤية باستخدام التعلم الآلي
   - مقارنات المعايير
   - تحليل الارتباط

2. **ميزات اجتماعية**
   - مشاركة المحفظة (مع ضوابط الخصوصية)
   - لوحات المتصدرين والإنجازات
   - رؤى المجتمع

3. **الأتمتة**
   - إعادة التوازن التلقائي
   - حصاد الخسائر الضريبية
   - استثمارات متكررة
   - تنبيهات ذكية

4. **تكاملات موسعة**
   - المزيد من تدفقات الأسعار الخارجية
   - اتصالات الحسابات المصرفية
   - تكاملات الوساطة
   - اتصالات بروتوكول DeFi

## 📞 الدعم والصيانة

- **مالك الدومين**: فريق الأصول
- **القائد التقني**: سيتم تعيينه
- **التوثيق**: هذا README والموارد المرتبطة
- **تتبع المشكلات**: GitHub Issues مع علامة `domain:assets`

---

## 📚 توثيق إضافي

### للمطورين

- **[أنواع TypeScript](./types/index.ts)** - تعريفات أنواع كاملة لجميع الكيانات والعمليات
- **[خدمة التكامل](./services/integrationService.js)** - تكامل ناقل الأحداث والاتصال عبر الدومينات
- **[مثال التكامل](./integration-example.md)** - مثال من العالم الحقيقي: FundX → Assets → Analytics
- **[اختبارات الوحدة](./tests/unit/assetService.test.js)** - مجموعة اختبارات وحدة شاملة
- **[اختبارات التكامل](./tests/integration/eventBus.test.js)** - اختبارات تكامل ناقل الأحداث

### للمستخدمين

- **[رحلة المستخدم](./user-journey.md)** - رحلة كاملة من التسجيل إلى السيادة المالية
- **[أمثلة API](./api/examples.md)** - أمثلة الطلب/الاستجابة لجميع نقاط النهاية
- **[توثيق ERD](./data-model/erd.md)** - رسوم بيانية تفصيلية لعلاقات الكيانات

### لأعضاء الفريق الجدد

- **[دليل التعاون](/COLLABORATION_GUIDE.md)** - كيفية تطوير وتوسيع الدومينات (يستخدم الأصول كمرجع)
- **[توثيق ناقل الأحداث](/lib/eventBus.js)** - نظام إدارة الأحداث المركزي

---

## 🎓 دومين الأصول كتطبيق مرجعي

يُعد دومين الأصول **التطبيق المرجعي** لجميع دومينات TEC، مما يُظهر:

✅ **طبقة خدمة كاملة**

- عمليات CRUD كاملة مع التحقق
- تحليلات متقدمة (اتجاهات الأسعار، مقاييس المخاطر، رؤى الاستثمار)
- التكامل عبر الدومينات عبر ناقل الأحداث
- معالجة شاملة للأخطاء

✅ **بنية موجهة بالأحداث**

- ينشر أحداثًا للمستهلكين اللاحقين
- يستمع للأحداث من دومينات FundX و Estate و Commerce و Insure
- تتبع معرف الارتباط للتتبع الموزع
- معالجة الأخطاء ومنطق إعادة المحاولة

✅ **أمان النوع**

- تعريفات أنواع TypeScript كاملة
- تعدادات للثوابت وقيم الحالة
- أنواع الإدخال/الإخراج لجميع العمليات
- تعريفات أنواع الأحداث

✅ **تميز الاختبار**

- اختبارات وحدة لجميع طرق الخدمة (تغطية أكثر من 80%)
- اختبارات تكامل لتدفقات الأحداث
- استراتيجيات الوهم والتركيبات
- أفضل ممارسات الاختبار الموثقة

✅ **جودة التوثيق**

- README شامل مع أمثلة
- توثيق API مع عينات الطلب/الاستجابة
- توثيق رحلة المستخدم
- أمثلة تكامل من العالم الحقيقي
- تعليقات الكود و JSDoc

استخدم هذا الدومين كقالب عند إنشاء دومينات جديدة في نظام TEC البيئي.

---

**آخر تحديث**: يناير 2026
**الإصدار**: 1.1.0 - تكامل ناقل الأحداث والتحليلات المتقدمة
**الحالة**: نشط - تطبيق مرجعي

---

© 2024-2026 نظام TEC البيئي - جميع الحقوق محفوظة
