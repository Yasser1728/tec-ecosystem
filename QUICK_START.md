# 🚀 Quick Start - TEC Ecosystem Complete User Journey
# دليل البدء السريع - رحلة المستخدم الكاملة في نظام TEC البيئي

---

## 🌐 Language / اللغة
- [English Version](#english-version)
- [النسخة العربية](#النسخة-العربية)

---

# English Version

## 🎯 Overview

This guide walks you through the complete Quick Start workflow for new users, demonstrating the integrated experience across three core domains: **Assets**, **Insure**, and **FundX**. The workflow showcases how TEC Ecosystem domains work together seamlessly to provide a comprehensive financial management experience.

## 📊 Quick Start Workflow

The Quick Start workflow consists of four integrated steps:

1. **User Registration/Login** - Create account or sign in with Pi Network
2. **Asset Portfolio Creation** - Set up your first portfolio via assets.pi
3. **Insurance Recommendation** - Receive and activate automatic asset insurance via insure.pi
4. **Investment Opportunity** - Discover and activate your first investment via fundx.pi

---

## 🚀 Step 1: User Registration & Authentication

### For New Users

**Endpoint:** `POST /api/auth/pi-authenticate`

**Request:**
```json
{
  "piToken": "your-pi-access-token",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_abc123",
    "piId": "pi_user_xyz",
    "username": "JohnDoe",
    "email": "john@example.com",
    "tier": "STANDARD",
    "quickStartStatus": "NOT_STARTED"
  },
  "session": {
    "token": "session_token_xyz"
  }
}
```

### For Existing Users

Simply authenticate with your existing Pi Network credentials. The system will detect your account and continue from where you left off.

---

## 💼 Step 2: Create Asset Portfolio

After authentication, create your first asset portfolio to start tracking your wealth.

**Endpoint:** `POST /api/assets/portfolios`

**Request:**
```json
{
  "name": "My Main Portfolio",
  "description": "Primary investment and asset portfolio",
  "currency": "PI",
  "isDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "portfolio": {
    "id": "portfolio_xyz123",
    "userId": "user_abc123",
    "name": "My Main Portfolio",
    "description": "Primary investment and asset portfolio",
    "currency": "PI",
    "totalValue": 0,
    "isDefault": true,
    "createdAt": "2026-01-04T12:00:00Z"
  },
  "nextStep": {
    "action": "ADD_ASSET",
    "endpoint": "/api/assets",
    "description": "Add your first asset to the portfolio"
  }
}
```

### Add Initial Asset (Optional)

**Endpoint:** `POST /api/assets`

**Request:**
```json
{
  "portfolioId": "portfolio_xyz123",
  "name": "Bitcoin Holdings",
  "assetType": "CRYPTOCURRENCY",
  "quantity": 0.5,
  "purchasePrice": 45000,
  "purchaseDate": "2026-01-01",
  "currentPrice": 47000
}
```

**Event Published:** `assets.asset.created`
```javascript
{
  eventType: 'assets.asset.created',
  eventData: {
    assetId: 'asset_abc123',
    userId: 'user_abc123',
    portfolioId: 'portfolio_xyz123',
    assetType: 'CRYPTOCURRENCY',
    value: 23500,
    name: 'Bitcoin Holdings'
  },
  metadata: {
    timestamp: '2026-01-04T12:05:00Z',
    eventId: 'evt_xyz789',
    source: 'assets-service'
  }
}
```

---

## 🛡️ Step 3: Insurance Recommendation & Activation

When you add a high-value asset (value > 10,000 PI), the Insure domain automatically receives an event and generates an insurance recommendation.

**Automatic Process:**
1. Assets domain publishes `assets.asset.created` event
2. Insure service listens and evaluates asset value
3. If value exceeds threshold, insurance recommendation is generated
4. User receives notification with quote

**Endpoint:** `GET /api/insure/recommendations`

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "rec_ins_001",
      "assetId": "asset_abc123",
      "assetName": "Bitcoin Holdings",
      "assetValue": 23500,
      "recommendedCoverage": 23500,
      "policyType": "ASSET_PROTECTION",
      "estimatedPremium": 235,
      "premiumFrequency": "MONTHLY",
      "coverageDetails": {
        "theft": true,
        "loss": true,
        "damage": false
      },
      "reason": "High-value cryptocurrency asset recommended for protection"
    }
  ]
}
```

### Activate Insurance

**Endpoint:** `POST /api/insure/policies`

**Request:**
```json
{
  "recommendationId": "rec_ins_001",
  "assetId": "asset_abc123",
  "coverageAmount": 23500,
  "term": 12,
  "paymentMethod": "PI_WALLET"
}
```

**Response:**
```json
{
  "success": true,
  "policy": {
    "id": "policy_ins_001",
    "policyNumber": "INS-ASSET-2026-001",
    "userId": "user_abc123",
    "assetId": "asset_abc123",
    "type": "ASSET_PROTECTION",
    "coverageAmount": 23500,
    "premium": 235,
    "premiumFrequency": "MONTHLY",
    "status": "ACTIVE",
    "startDate": "2026-01-04",
    "endDate": "2027-01-04"
  },
  "nextPaymentDue": "2026-02-04"
}
```

**Event Published:** `insure.policy.created`
```javascript
{
  eventType: 'insure.policy.created',
  eventData: {
    policyId: 'policy_ins_001',
    userId: 'user_abc123',
    assetId: 'asset_abc123',
    coverageAmount: 23500,
    premium: 235
  }
}
```

---

## 📈 Step 4: First Investment Opportunity

Based on your portfolio and risk profile, FundX recommends suitable investment opportunities.

**Endpoint:** `GET /api/fundx/opportunities/recommended`

**Query Parameters:**
- `portfolioId`: Your portfolio ID
- `riskProfile`: "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE"

**Response:**
```json
{
  "success": true,
  "opportunities": [
    {
      "id": "opp_fundx_001",
      "strategyId": "strategy_balanced_growth",
      "name": "Balanced Growth Portfolio",
      "description": "Diversified portfolio with 60% stocks, 30% crypto, 10% bonds",
      "riskLevel": "MODERATE",
      "minInvestment": 1000,
      "targetReturn": 15.5,
      "historicalPerformance": {
        "ytd": 12.8,
        "oneYear": 18.5,
        "threeYear": 45.2
      },
      "recommended": true,
      "reason": "Matches your moderate risk profile and investment goals"
    }
  ]
}
```

### Activate Investment

**Endpoint:** `POST /api/fundx/investments`

**Request:**
```json
{
  "strategyId": "strategy_balanced_growth",
  "amount": 5000,
  "portfolioId": "portfolio_xyz123",
  "paymentMethod": "PI_WALLET"
}
```

**Response:**
```json
{
  "success": true,
  "investment": {
    "id": "inv_fundx_001",
    "userId": "user_abc123",
    "strategyId": "strategy_balanced_growth",
    "strategyName": "Balanced Growth Portfolio",
    "amount": 5000,
    "shares": 39.84,
    "entryPrice": 125.50,
    "status": "ACTIVE",
    "createdAt": "2026-01-04T12:15:00Z"
  },
  "assetCreated": {
    "id": "asset_investment_001",
    "portfolioId": "portfolio_xyz123",
    "name": "Balanced Growth Portfolio Investment",
    "type": "INVESTMENT",
    "value": 5000
  }
}
```

**Event Published:** `fundx.investment.created`
```javascript
{
  eventType: 'fundx.investment.created',
  eventData: {
    investmentId: 'inv_fundx_001',
    userId: 'user_abc123',
    portfolioId: 'portfolio_xyz123',
    strategyId: 'strategy_balanced_growth',
    amount: 5000,
    shares: 39.84
  }
}
```

---

## 🔄 Integration Flow Summary

```
User Registration
      ↓
Create Portfolio (assets.pi)
      ↓
Add High-Value Asset
      ↓
Event: assets.asset.created →→→ Insure Service Listens
      ↓                               ↓
Update Portfolio Value         Generate Insurance Recommendation
      ↓                               ↓
                              User Activates Insurance (insure.pi)
                                      ↓
                              Event: insure.policy.created
      ↓
Analyze Portfolio & Risk Profile
      ↓
FundX Recommends Investment (fundx.pi)
      ↓
User Makes Investment
      ↓
Event: fundx.investment.created →→→ Assets Service Listens
      ↓                                    ↓
Update Investment Performance      Create Investment Asset in Portfolio
      ↓
Complete Quick Start Journey ✅
```

---

## 🧪 Testing the Complete Workflow

### End-to-End Test

**Test File:** `tests/e2e/quickstart-workflow.test.js`

```javascript
describe('Quick Start Complete Workflow', () => {
  test('should complete full user journey', async () => {
    // 1. Register/Login
    const authResponse = await request(app)
      .post('/api/auth/pi-authenticate')
      .send({ piToken: 'test_token', language: 'en' });
    
    expect(authResponse.status).toBe(200);
    const userId = authResponse.body.user.id;
    
    // 2. Create Portfolio
    const portfolioResponse = await request(app)
      .post('/api/assets/portfolios')
      .set('Authorization', `Bearer ${authResponse.body.session.token}`)
      .send({
        name: 'Test Portfolio',
        currency: 'PI',
        isDefault: true
      });
    
    expect(portfolioResponse.status).toBe(201);
    const portfolioId = portfolioResponse.body.portfolio.id;
    
    // 3. Add High-Value Asset
    const assetResponse = await request(app)
      .post('/api/assets')
      .set('Authorization', `Bearer ${authResponse.body.session.token}`)
      .send({
        portfolioId,
        name: 'Bitcoin Holdings',
        assetType: 'CRYPTOCURRENCY',
        quantity: 1,
        purchasePrice: 45000,
        currentPrice: 47000
      });
    
    expect(assetResponse.status).toBe(201);
    
    // Wait for insurance recommendation event processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 4. Check Insurance Recommendations
    const insuranceResponse = await request(app)
      .get('/api/insure/recommendations')
      .set('Authorization', `Bearer ${authResponse.body.session.token}`);
    
    expect(insuranceResponse.status).toBe(200);
    expect(insuranceResponse.body.recommendations.length).toBeGreaterThan(0);
    
    // 5. Activate Insurance
    const policyResponse = await request(app)
      .post('/api/insure/policies')
      .set('Authorization', `Bearer ${authResponse.body.session.token}`)
      .send({
        recommendationId: insuranceResponse.body.recommendations[0].id,
        assetId: assetResponse.body.asset.id,
        coverageAmount: 47000,
        term: 12,
        paymentMethod: 'PI_WALLET'
      });
    
    expect(policyResponse.status).toBe(201);
    
    // 6. Get Investment Opportunities
    const opportunitiesResponse = await request(app)
      .get('/api/fundx/opportunities/recommended')
      .query({ portfolioId, riskProfile: 'MODERATE' })
      .set('Authorization', `Bearer ${authResponse.body.session.token}`);
    
    expect(opportunitiesResponse.status).toBe(200);
    expect(opportunitiesResponse.body.opportunities.length).toBeGreaterThan(0);
    
    // 7. Make Investment
    const investmentResponse = await request(app)
      .post('/api/fundx/investments')
      .set('Authorization', `Bearer ${authResponse.body.session.token}`)
      .send({
        strategyId: opportunitiesResponse.body.opportunities[0].strategyId,
        amount: 5000,
        portfolioId,
        paymentMethod: 'PI_WALLET'
      });
    
    expect(investmentResponse.status).toBe(201);
    
    // Verify Quick Start completion
    const statusResponse = await request(app)
      .get('/api/quickstart/status')
      .set('Authorization', `Bearer ${authResponse.body.session.token}`);
    
    expect(statusResponse.body.completed).toBe(true);
    expect(statusResponse.body.steps).toMatchObject({
      authentication: true,
      portfolioCreation: true,
      insuranceActivation: true,
      firstInvestment: true
    });
  });
});
```

---

## 📚 API Reference Summary

### Authentication
- `POST /api/auth/pi-authenticate` - Authenticate with Pi Network

### Assets Domain (assets.pi)
- `POST /api/assets/portfolios` - Create portfolio
- `GET /api/assets/portfolios` - List portfolios
- `POST /api/assets` - Add asset to portfolio
- `GET /api/assets` - List assets

### Insure Domain (insure.pi)
- `GET /api/insure/recommendations` - Get insurance recommendations
- `POST /api/insure/policies` - Purchase insurance policy
- `GET /api/insure/policies` - List user policies

### FundX Domain (fundx.pi)
- `GET /api/fundx/opportunities/recommended` - Get recommended investments
- `POST /api/fundx/investments` - Create investment
- `GET /api/fundx/investments` - List user investments

### Quick Start Tracking
- `GET /api/quickstart/status` - Get workflow completion status
- `POST /api/quickstart/complete` - Mark workflow as complete

---

## 🎯 For Developers

### Event Bus Integration

The three domains communicate through a centralized event bus (`lib/eventBus.js`):

```javascript
const eventBus = require('@/lib/eventBus');

// Assets domain publishes events
eventBus.publish('assets.asset.created', {
  assetId: 'asset_123',
  userId: 'user_abc',
  value: 50000,
  type: 'CRYPTOCURRENCY'
});

// Insure domain listens for events
eventBus.on('assets.asset.created', async (eventData) => {
  if (eventData.value > 10000) {
    await generateInsuranceRecommendation(eventData);
  }
});

// FundX domain listens for portfolio updates
eventBus.on('assets.portfolio.updated', async (eventData) => {
  await updateInvestmentRecommendations(eventData.userId);
});
```

### Adding New Steps to Quick Start

1. Create new API endpoint in appropriate domain
2. Add event publisher/subscriber as needed
3. Update Quick Start status tracking
4. Add integration test
5. Update this documentation

---

## 🚀 Deployment (For Administrators)

### Deploy to Production

```bash
# Push to GitHub (auto-deploys to Vercel)
git push origin main

# Or use Vercel CLI
vercel --prod
```

### Configure Pi Network Domains

1. Go to: https://develop.pi
2. Login with your Pi account
3. Configure domains:
   - `assets.pi` → `/assets`
   - `insure.pi` → `/insure`
   - `fundx.pi` → `/fundx`

### Environment Variables

```bash
DATABASE_URL=postgresql://...
PI_API_KEY=your_pi_api_key
PI_WALLET_PRIVATE_KEY=your_wallet_key
INSURANCE_THRESHOLD=10000
NEXT_PUBLIC_APP_URL=https://tec-ecosystem.vercel.app
```

---

## 🎉 Success!

You now have a complete understanding of the TEC Ecosystem Quick Start workflow. Users can seamlessly:
- Create accounts and authenticate
- Set up asset portfolios
- Receive intelligent insurance recommendations
- Discover investment opportunities
- Track everything in one integrated platform

**Next Steps:**
- Explore individual domain documentation
- Try the API endpoints
- Review the example code
- Build your own integrations

---

# النسخة العربية

## 🎯 نظرة عامة

يرشدك هذا الدليل خلال مسار البدء السريع الكامل للمستخدمين الجدد، مما يوضح التجربة المتكاملة عبر ثلاثة دومينات أساسية: **الأصول (Assets)**، **التأمين (Insure)**، و**الاستثمار (FundX)**. يعرض المسار كيف تعمل دومينات نظام TEC البيئي معًا بسلاسة لتوفير تجربة إدارة مالية شاملة.

## 📊 مسار البدء السريع

يتكون مسار البدء السريع من أربع خطوات متكاملة:

1. **تسجيل المستخدم/تسجيل الدخول** - إنشاء حساب أو تسجيل الدخول باستخدام شبكة Pi
2. **إنشاء محفظة الأصول** - إعداد محفظتك الأولى عبر assets.pi
3. **توصية التأمين** - استلام وتفعيل التأمين التلقائي للأصول عبر insure.pi
4. **فرصة الاستثمار** - اكتشاف وتفعيل أول استثمار لك عبر fundx.pi

---

## 🚀 الخطوة 1: تسجيل المستخدم والمصادقة

### للمستخدمين الجدد

**نقطة النهاية:** `POST /api/auth/pi-authenticate`

**الطلب:**
```json
{
  "piToken": "your-pi-access-token",
  "language": "ar"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "user": {
    "id": "user_abc123",
    "piId": "pi_user_xyz",
    "username": "محمد أحمد",
    "email": "mohammed@example.com",
    "tier": "STANDARD",
    "quickStartStatus": "NOT_STARTED"
  },
  "session": {
    "token": "session_token_xyz"
  }
}
```

### للمستخدمين الحاليين

ما عليك سوى المصادقة باستخدام بيانات اعتماد شبكة Pi الحالية. سيكتشف النظام حسابك ويستمر من حيث توقفت.

---

## 💼 الخطوة 2: إنشاء محفظة الأصول

بعد المصادقة، قم بإنشاء محفظة الأصول الأولى لبدء تتبع ثروتك.

**نقطة النهاية:** `POST /api/assets/portfolios`

**الطلب:**
```json
{
  "name": "محفظتي الرئيسية",
  "description": "محفظة الاستثمار والأصول الأساسية",
  "currency": "PI",
  "isDefault": true
}
```

**الاستجابة:**
```json
{
  "success": true,
  "portfolio": {
    "id": "portfolio_xyz123",
    "userId": "user_abc123",
    "name": "محفظتي الرئيسية",
    "description": "محفظة الاستثمار والأصول الأساسية",
    "currency": "PI",
    "totalValue": 0,
    "isDefault": true,
    "createdAt": "2026-01-04T12:00:00Z"
  },
  "nextStep": {
    "action": "ADD_ASSET",
    "endpoint": "/api/assets",
    "description": "أضف أول أصل إلى المحفظة"
  }
}
```

### إضافة أصل أولي (اختياري)

**نقطة النهاية:** `POST /api/assets`

**الطلب:**
```json
{
  "portfolioId": "portfolio_xyz123",
  "name": "ممتلكات البيتكوين",
  "assetType": "CRYPTOCURRENCY",
  "quantity": 0.5,
  "purchasePrice": 45000,
  "purchaseDate": "2026-01-01",
  "currentPrice": 47000
}
```

**الحدث المنشور:** `assets.asset.created`

---

## 🛡️ الخطوة 3: توصية التأمين والتفعيل

عندما تضيف أصلًا عالي القيمة (القيمة > 10,000 PI)، يستقبل دومين التأمين الحدث تلقائيًا ويُنشئ توصية تأمين.

**العملية التلقائية:**
1. دومين الأصول ينشر حدث `assets.asset.created`
2. خدمة التأمين تستمع وتقيّم قيمة الأصل
3. إذا تجاوزت القيمة الحد الأدنى، يتم إنشاء توصية تأمين
4. يتلقى المستخدم إشعارًا مع عرض السعر

**نقطة النهاية:** `GET /api/insure/recommendations`

**الاستجابة:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "rec_ins_001",
      "assetId": "asset_abc123",
      "assetName": "ممتلكات البيتكوين",
      "assetValue": 23500,
      "recommendedCoverage": 23500,
      "policyType": "ASSET_PROTECTION",
      "estimatedPremium": 235,
      "premiumFrequency": "MONTHLY",
      "coverageDetails": {
        "theft": true,
        "loss": true,
        "damage": false
      },
      "reason": "أصل عملة مشفرة عالي القيمة موصى بحمايته"
    }
  ]
}
```

### تفعيل التأمين

**نقطة النهاية:** `POST /api/insure/policies`

---

## 📈 الخطوة 4: أول فرصة استثمار

بناءً على محفظتك وملف المخاطر الخاص بك، يوصي FundX بفرص استثمار مناسبة.

**نقطة النهاية:** `GET /api/fundx/opportunities/recommended`

---

## 🔄 ملخص تدفق التكامل

```
تسجيل المستخدم
      ↓
إنشاء المحفظة (assets.pi)
      ↓
إضافة أصل عالي القيمة
      ↓
حدث: assets.asset.created →→→ خدمة التأمين تستمع
      ↓                               ↓
تحديث قيمة المحفظة           إنشاء توصية تأمين
      ↓                               ↓
                              المستخدم يفعّل التأمين (insure.pi)
                                      ↓
                              حدث: insure.policy.created
      ↓
تحليل المحفظة وملف المخاطر
      ↓
FundX يوصي باستثمار (fundx.pi)
      ↓
المستخدم يقوم بالاستثمار
      ↓
حدث: fundx.investment.created →→→ خدمة الأصول تستمع
      ↓                                    ↓
تحديث أداء الاستثمار          إنشاء أصل استثماري في المحفظة
      ↓
اكتمال رحلة البدء السريع ✅
```

---

## 📚 ملخص مرجع API

### المصادقة
- `POST /api/auth/pi-authenticate` - المصادقة مع شبكة Pi

### دومين الأصول (assets.pi)
- `POST /api/assets/portfolios` - إنشاء محفظة
- `GET /api/assets/portfolios` - عرض المحافظ
- `POST /api/assets` - إضافة أصل إلى المحفظة
- `GET /api/assets` - عرض الأصول

### دومين التأمين (insure.pi)
- `GET /api/insure/recommendations` - الحصول على توصيات التأمين
- `POST /api/insure/policies` - شراء وثيقة تأمين
- `GET /api/insure/policies` - عرض وثائق المستخدم

### دومين الاستثمار (fundx.pi)
- `GET /api/fundx/opportunities/recommended` - الحصول على استثمارات موصى بها
- `POST /api/fundx/investments` - إنشاء استثمار
- `GET /api/fundx/investments` - عرض استثمارات المستخدم

### تتبع البدء السريع
- `GET /api/quickstart/status` - الحصول على حالة اكتمال المسار
- `POST /api/quickstart/complete` - وضع علامة على المسار كمكتمل

---

## 🎉 نجاح!

لديك الآن فهم كامل لمسار البدء السريع في نظام TEC البيئي. يمكن للمستخدمين بسلاسة:
- إنشاء حسابات والمصادقة
- إعداد محافظ الأصول
- استلام توصيات تأمين ذكية
- اكتشاف فرص الاستثمار
- تتبع كل شيء في منصة متكاملة واحدة

**الخطوات التالية:**
- استكشف توثيق الدومينات الفردية
- جرب نقاط نهاية API
- راجع أمثلة التعليمات البرمجية
- قم ببناء تكاملاتك الخاصة

---

**آخر تحديث:** يناير 2026  
**الإصدار:** 2.0.0 - مسار البدء السريع المتكامل  
**الحالة:** نشط ومكتمل التنفيذ

---

© 2024-2026 نظام TEC البيئي - جميع الحقوق محفوظة
