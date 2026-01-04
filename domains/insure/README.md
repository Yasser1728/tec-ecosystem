# Insure Domain - Insurance & Risk Management Solutions

## 🎯 Domain Mission

Insure (insure.pi) provides comprehensive insurance and risk management solutions within the TEC Ecosystem. It offers protection for assets, transactions, and life events, all powered by Pi Network's transparent and efficient infrastructure.

The domain operates on a philosophy of **proactive protection** - automatically generating intelligent insurance recommendations when users acquire valuable assets, and seamlessly integrating with other domains to provide comprehensive coverage across the entire financial ecosystem.

### Core Philosophy

1. **Prevention Over Reaction**: Offer insurance at the moment of asset acquisition
2. **Transparency First**: Clear premium calculations and claim processes
3. **User Empowerment**: Give users full control over their coverage
4. **Seamless Integration**: Work invisibly with other domains for unified experience
5. **Fair & Fast Claims**: Automated processing with human oversight for fairness

## 📋 Core Features

### 1. Insurance Products
- **Asset Insurance**: Protection for high-value assets (property, vehicles, collectibles)
- **Life Insurance**: Term and whole life insurance policies
- **Health Insurance**: Medical coverage and health protection
- **Travel Insurance**: Trip cancellation, medical, and baggage coverage
- **Transaction Insurance**: Protection for high-value purchases and deals

### 2. Claims Management
- **Digital Claims**: Streamlined online claim submission
- **Smart Contracts**: Automated claim processing and payouts
- **Document Management**: Secure storage of policy documents
- **Claims Tracking**: Real-time status updates

### 3. Risk Assessment
- **Risk Profiling**: Personalized risk assessment
- **Premium Calculation**: AI-powered premium pricing
- **Coverage Optimization**: Optimal coverage recommendations
- **Risk Mitigation**: Preventive risk management advice

### 4. Policy Management
- **Policy Lifecycle**: Easy policy purchase, renewal, and cancellation
- **Multi-Policy Discounts**: Bundled coverage savings
- **Payment Automation**: Automated premium payments
- **Policy Comparison**: Side-by-side policy comparison tools

## 🔗 Key Entities

### Policy
- **Types**: LIFE, HEALTH, PROPERTY, AUTO, TRAVEL, TRANSACTION
- **Attributes**: policyNumber, coverageAmount, premium, term, status
- **Coverage**: Deductibles, limits, exclusions

### Claim
- **Attributes**: policyId, amount, incidentDate, description, documents
- **Status**: SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, PAID
- **Processing**: Automated verification, manual review

### Premium Payment
- **Frequency**: MONTHLY, QUARTERLY, ANNUALLY
- **Attributes**: amount, dueDate, paymentDate, status
- **Automation**: Auto-pay from NBF accounts

## 🔌 API Endpoints

### Policies
- `GET /api/insure/products` - List insurance products
- `POST /api/insure/quote` - Get insurance quote
- `POST /api/insure/policies` - Purchase policy
- `GET /api/insure/policies` - List user policies
- `GET /api/insure/policies/:id` - Get policy details
- `PUT /api/insure/policies/:id/renew` - Renew policy

### Claims
- `POST /api/insure/claims` - Submit claim
- `GET /api/insure/claims` - List user claims
- `GET /api/insure/claims/:id` - Get claim status
- `POST /api/insure/claims/:id/documents` - Upload claim documents

### Payments
- `GET /api/insure/payments` - List premium payments
- `POST /api/insure/payments/:id/pay` - Make premium payment
- `POST /api/insure/payments/autopay` - Setup auto-payment

## 🔗 Integration with Other Domains

### Assets Domain
**Flow**: Asset Acquisition → Insurance Recommendation
- Suggest insurance for new high-value assets
- Automatic coverage for financed assets
- Asset valuation for coverage determination

### Estate Domain
**Flow**: Property Purchase → Property Insurance
- Mandatory insurance for mortgaged properties
- Integrated insurance quotes during purchase
- Coverage amount based on property value

### NBF Domain
**Flow**: Loan → Required Insurance
- Collateral insurance for loans
- Life insurance for loan protection
- Premium payment automation

### Commerce/Ecommerce Domains
**Flow**: Purchase → Transaction Insurance
- Optional purchase protection
- Warranty extensions
- Shipping insurance

## 💼 Business Logic

### Policy Purchase Flow
```javascript
1. User requests quote with details
2. Risk assessment and pricing
3. Premium calculation
4. User reviews and accepts
5. Payment processing
6. Policy issuance
7. Policy document generation
8. Notification to user
```

### Claim Processing Flow
```javascript
1. User submits claim with details
2. Initial automated validation
3. Document verification
4. Fraud detection checks
5. Coverage verification
6. Claim assessment (AI + Manual)
7. Approval/Rejection decision
8. Payout processing (if approved)
9. Notification to user
```

### Premium Calculation
```javascript
basePremium = coverageAmount × riskFactor × duration
adjustedPremium = basePremium × userRiskScore
finalPremium = adjustedPremium × (1 - discounts) + fees
```

## 📊 Sample Data Models

### Policy Example
```json
{
  "id": "policy_insure_life_001",
  "userId": "user_123",
  "policyNumber": "INS-LIFE-00123456",
  "type": "LIFE",
  "product": "Term Life Insurance",
  "coverageAmount": 500000,
  "premium": 150,
  "premiumFrequency": "MONTHLY",
  "term": 20,
  "startDate": "2025-01-01",
  "endDate": "2045-01-01",
  "beneficiaries": [
    {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "percentage": 100
    }
  ],
  "status": "ACTIVE"
}
```

### Claim Example
```json
{
  "id": "claim_insure_001",
  "policyId": "policy_insure_life_001",
  "claimNumber": "CLM-2026-00123",
  "claimAmount": 5000,
  "incidentDate": "2026-01-01",
  "incidentType": "MEDICAL_EMERGENCY",
  "description": "Emergency medical treatment",
  "documents": [
    {
      "type": "MEDICAL_REPORT",
      "url": "https://storage/claim_doc_001.pdf"
    },
    {
      "type": "INVOICE",
      "url": "https://storage/claim_doc_002.pdf"
    }
  ],
  "status": "UNDER_REVIEW",
  "submittedAt": "2026-01-04T10:00:00Z"
}
```

## 🚀 Future Enhancements

1. **Parametric Insurance**: Automated payouts based on triggers
2. **Micro-Insurance**: Small-value, short-term insurance products
3. **Peer-to-Peer Insurance**: Community-based insurance pools
4. **AI Claims Assessor**: Fully automated claim processing
5. **Wellness Programs**: Preventive health and safety programs

---

## 🏗️ Technical Implementation

### Data Models (Prisma Schema)

The insure domain uses the following data models:

#### InsurancePolicy
```prisma
model InsurancePolicy {
  id                String           @id @default(cuid())
  policyNumber      String           @unique
  userId            String
  assetId           String?          // Optional link to asset
  
  policyType        PolicyType       // LIFE, HEALTH, PROPERTY, AUTO, etc.
  productName       String
  coverageAmount    Float
  premium           Float
  premiumFrequency  PremiumFrequency @default(MONTHLY)
  deductible        Float            @default(0)
  
  startDate         DateTime
  endDate           DateTime
  term              Int              // Duration in years
  
  status            PolicyStatus     @default(ACTIVE)
  metadata          Json?
  
  // Relations
  claims            Claim[]
  premiumPayments   PremiumPayment[]
  
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
}
```

#### Claim
```prisma
model Claim {
  id                String           @id @default(cuid())
  claimNumber       String           @unique
  policyId          String
  userId            String
  
  claimAmount       Float
  approvedAmount    Float?
  incidentDate      DateTime
  incidentType      String
  description       String
  documents         Json?
  
  status            ClaimStatus      @default(SUBMITTED)
  reviewNotes       String?
  reviewedBy        String?
  reviewedAt        DateTime?
  
  paidAmount        Float?
  paidAt            DateTime?
  paymentReference  String?
  
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
}
```

#### PremiumPayment
```prisma
model PremiumPayment {
  id                String                 @id @default(cuid())
  policyId          String
  amount            Float
  dueDate           DateTime
  paidDate          DateTime?
  status            PremiumPaymentStatus   @default(PENDING)
  paymentMethod     String?
  transactionId     String?
  metadata          Json?
  
  createdAt         DateTime               @default(now())
  updatedAt         DateTime               @updatedAt
}
```

### Service Architecture

#### InsureService (`services/insureService.js`)

Core business logic service providing:

**Policy Management:**
- `createPolicy(data)` - Create new insurance policy
- `getPolicyById(policyId, options)` - Retrieve policy details
- `getUserPolicies(userId, filters)` - List user's policies
- `updatePolicy(policyId, updates)` - Update policy details
- `calculatePremium(data)` - Calculate policy premium

**Claim Processing:**
- `submitClaim(data)` - Submit insurance claim
- `reviewClaim(claimId, reviewData)` - Review and decide on claim
- `processClaimPayout(claimId, payoutData)` - Process approved claim payout
- `getClaimById(claimId)` - Retrieve claim details
- `getUserClaims(userId, filters)` - List user's claims

**Risk Assessment:**
- `assessRisk(policyType, riskFactors)` - Calculate risk score
- `generateRiskRecommendations(riskLevel)` - Generate risk mitigation advice

**Recommendations:**
- `generateInsuranceRecommendation(assetData)` - Generate insurance recommendation for assets

**Event Publishing:**
- `publishPolicyCreated(policy)` - Publish policy creation event
- `publishClaimSubmitted(claim)` - Publish claim submission event
- `publishClaimApproved(claim)` - Publish claim approval event
- `publishClaimRejected(claim, reason)` - Publish claim rejection event
- `publishClaimPaid(claim)` - Publish claim payout event

#### IntegrationService (`services/integrationService.js`)

Handles cross-domain communication via Event Bus:

**Subscriptions:**
- `assets.asset.created` → Generate insurance recommendations
- `assets.asset.updated` → Check for coverage updates needed
- `estate.property.purchased` → Offer property insurance
- `commerce.order.created` → Offer transaction insurance
- `insure.claim.approved` → Update asset status, request payout
- `insure.claim.rejected` → Update asset status, notify user

**Event Publishing:**
- Insurance recommendations
- Asset status updates
- Payment requests to NBF
- User notifications to Alert domain

### Premium Calculation Algorithm

```javascript
// Base premium calculation
basePremium = coverageAmount × riskRate × duration

// Apply term discount
termMultiplier = term > 10 ? 0.9 : term > 5 ? 0.95 : 1.0

// Risk assessment
riskScore = assessRisk(policyType, factors)
riskMultiplier = RISK_FACTORS[riskLevel]

// Final calculation
adjustedPremium = basePremium × termMultiplier × riskMultiplier
finalPremium = adjustedPremium / frequencyMultiplier
```

**Risk Factors:**
- **LOW** (1.0x): Minimal risk, standard coverage
- **MEDIUM** (1.3x): Moderate risk factors present
- **HIGH** (1.7x): Significant risk factors identified
- **CRITICAL** (2.5x): High-risk scenario requiring special attention

### Event-Driven Integration Flow

```
Asset Created (Assets Domain)
  ↓
Event: assets.asset.created
  ↓
Insure Integration Service (Listens)
  ↓
Generate Recommendation
  ↓
Event: insure.recommendation.generated
  ↓
Alert Domain (Notify User)
```

```
Claim Approved (Insure Domain)
  ↓
Event: insure.claim.approved
  ↓
Multiple Subscribers:
  ├─ Assets Domain → Update asset status
  ├─ NBF Domain → Process payout
  └─ Alert Domain → Notify user
```

### API Integration Points

**With Assets Domain:**
- Listen for asset creation/updates
- Update asset status on claim decisions
- Link policies to specific assets

**With NBF Domain:**
- Process premium payments
- Handle claim payouts
- Manage payment schedules

**With Estate Domain:**
- Receive property purchase notifications
- Offer property insurance
- Link policies to properties

**With Commerce Domain:**
- Monitor high-value transactions
- Offer transaction insurance
- Protect purchases

**With Alert Domain:**
- Send insurance recommendations
- Notify of policy updates
- Communicate claim status
- Payment reminders

---

## 🧪 Testing

### Unit Tests (`tests/unit/insureService.test.js`)

Comprehensive unit tests covering:
- Policy number generation
- Claim number generation
- Premium calculation
- Risk assessment
- Policy validation
- Claim validation
- Policy creation
- Claim submission
- Claim review and approval
- Insurance recommendation generation

**Run unit tests:**
```bash
npm run test:unit -- domains/insure/tests/unit
```

### Integration Tests (`tests/integration/eventBus.test.js`)

Event Bus integration tests covering:
- Asset creation event handling
- Property purchase event handling
- Commerce order event handling
- Claim approval event handling
- Claim rejection event handling
- Asset update event handling
- Event history tracking

**Run integration tests:**
```bash
npm run test:integration -- domains/insure/tests/integration
```

### Test Coverage

Target coverage: **80%+**

Current coverage areas:
- ✅ Service methods
- ✅ Validation logic
- ✅ Premium calculations
- ✅ Risk assessment
- ✅ Event publishing
- ✅ Event subscriptions
- ✅ Cross-domain integration

---

## 📚 Documentation

### Available Documentation

1. **README.md** (this file) - Comprehensive domain documentation
2. **user-journey-insure.md** - Complete user journey through insurance lifecycle
3. **types/index.ts** - TypeScript type definitions for all domain entities
4. **API Documentation** - See endpoints section above

### User Journey Document

The `user-journey-insure.md` file provides:
- Step-by-step user experience
- Technical flows and event sequences
- Cross-domain integration examples
- Real-world scenarios
- Success metrics and analytics
- Future enhancements roadmap

**Key Scenarios Documented:**
1. Insurance Discovery (Asset-triggered recommendation)
2. Policy Purchase (Quote to activation)
3. Policy Management (Payments and updates)
4. Claim Submission (Filing a claim)
5. Claim Processing (Review and decision)
6. Claim Payout (Receiving compensation)

---

## 🔧 Development Guide

### Setting Up Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Set up database:**
```bash
npm run db:push
```

3. **Generate Prisma client:**
```bash
npx prisma generate
```

4. **Run tests:**
```bash
npm test
```

### Creating a New Policy Type

1. Add enum value to `PolicyType` in Prisma schema
2. Update base premium rates in `insureService.js`
3. Add risk assessment logic for new type
4. Update TypeScript types in `types/index.ts`
5. Add integration tests
6. Update documentation

### Adding New Event Subscriptions

1. Open `services/integrationService.js`
2. Add new subscription method
3. Implement event handler
4. Add to `initialize()` method
5. Write integration tests
6. Document the integration

### Extending Risk Assessment

1. Locate `assessRisk()` method in `insureService.js`
2. Add new risk factors to calculation
3. Update risk score thresholds if needed
4. Add unit tests for new factors
5. Update documentation

---

## 🚀 Deployment Considerations

### Performance Optimization

1. **Database Indexes**: All frequently queried fields are indexed
   - `userId`, `policyNumber`, `status`, `assetId`
   - `claimNumber`, `policyId`

2. **Caching Strategy**:
   - Policy details: 5 minutes
   - Premium calculations: 15 minutes
   - User policies list: 1 minute

3. **Event Bus**: Asynchronous processing for all cross-domain events

### Scalability

- Stateless service design enables horizontal scaling
- Database read replicas for policy lookups
- Premium calculation can be offloaded to workers
- Claim processing queue for high volume

### Monitoring

**Key Metrics to Track:**
- Policy creation rate
- Claim submission rate
- Claim approval rate
- Average claim processing time
- Premium payment success rate
- Event processing latency

**Alerts:**
- High claim rejection rate
- Slow claim processing
- Payment processing failures
- Event processing errors

---

## 🤝 Integration with Other Domains

### Integration Matrix

| Domain | Integration Type | Events Consumed | Events Published |
|--------|-----------------|-----------------|------------------|
| Assets | Bidirectional | asset.created, asset.updated | recommendation.generated, claim.approved/rejected |
| NBF | Request-Response | - | payment.request |
| Estate | Inbound | property.purchased | recommendation.generated |
| Commerce | Inbound | order.created | recommendation.generated |
| Alert | Outbound | - | notification.create |
| Analytics | Outbound | - | data.updated |

### Event Specifications

**Published Events:**

```javascript
// insure.policy.created
{
  policyId, policyNumber, userId, assetId,
  policyType, coverageAmount, premium,
  startDate, endDate
}

// insure.claim.approved
{
  claimId, claimNumber, policyId, userId,
  assetId, approvedAmount
}

// insure.claim.rejected
{
  claimId, claimNumber, policyId, userId,
  assetId, rejectionReason
}

// insure.recommendation.generated
{
  userId, assetId, assetType, assetValue,
  recommendedPolicyType, estimatedPremium,
  coverageAmount
}
```

**Consumed Events:**

```javascript
// assets.asset.created
{
  userId, assetId, assetType, value
}

// estate.property.purchased
{
  userId, propertyId, purchasePrice
}

// commerce.order.created
{
  userId, orderId, total
}
```

---

## 💡 Best Practices

### For Developers

1. **Always validate input data** before processing
2. **Publish events** for all significant state changes
3. **Include error handling** in all service methods
4. **Write tests** before implementing new features
5. **Document** all public APIs and event contracts
6. **Use TypeScript types** for better code safety
7. **Follow existing patterns** from Assets domain

### For Product Teams

1. **User-centric design**: Focus on user needs and pain points
2. **Transparency**: Clear communication about coverage and claims
3. **Automation**: Reduce manual steps wherever possible
4. **Integration**: Ensure seamless experience across domains
5. **Trust**: Build confidence through reliable service

### For QA Teams

1. **Test critical paths**: Policy creation, claim processing
2. **Event integration**: Verify all cross-domain events work
3. **Edge cases**: Test boundary conditions and error scenarios
4. **Performance**: Monitor response times and throughput
5. **Security**: Verify proper authorization and data protection

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Policy creation fails
- Check: User ID exists
- Check: Coverage amount is positive
- Check: Premium is positive
- Check: Start date is valid

**Issue**: Claim submission rejected
- Check: Policy is ACTIVE
- Check: Claim amount doesn't exceed coverage
- Check: All required fields provided

**Issue**: Events not being processed
- Check: Integration service is initialized
- Check: Event Bus is running
- Check: No errors in service logs

**Issue**: Premium calculation seems incorrect
- Verify: Policy type is correct
- Verify: Risk factors are accurate
- Check: Premium frequency multiplier
- Review: Term discount application

---

**Domain Owner**: Insure Team
**Status**: Active Development
**Last Updated**: January 2026
