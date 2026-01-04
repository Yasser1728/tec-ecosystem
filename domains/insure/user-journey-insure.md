# User Journey - Insurance Domain (Insure)

## 🎯 Overview

This document outlines the complete user journey through the Insurance (Insure) domain within the TEC Ecosystem, from discovering insurance options to filing and receiving claim payouts. It demonstrates how insurance integrates seamlessly with other domains, especially assets and financial services.

---

## 📍 Journey Stages

### Stage 1: Insurance Discovery (Day 1)

**Trigger**: User acquires a new high-value asset

#### Actions:

1. **Asset Creation** (`Assets Domain`)
   - User purchases property worth 500,000 PI
   - Asset automatically recorded in Assets domain
   - Event published: `assets.asset.created`

2. **Automatic Insurance Recommendation** (`Insure Domain`)
   - Insure domain receives asset creation event
   - Generates insurance recommendation
   - Calculates estimated premium: 166.67 PI/month
   - Event published: `insure.recommendation.generated`

3. **User Notification** (`Alert Domain`)
   - User receives push notification
   - "Insurance Recommendation Available"
   - "Protect your new property with comprehensive coverage starting at 166.67 PI/month"

**Technical Flow:**
```
User → Assets Domain (Create Asset)
     → Event Bus: assets.asset.created
     → Insure Domain (Listens)
     → Generate Recommendation
     → Event Bus: insure.recommendation.generated
     → Alert Domain (Notify User)
```

**Domains Involved**: `Assets`, `Insure`, `Alert`, `Event Bus`

**Events:**
- `assets.asset.created` (published by Assets)
- `insure.recommendation.generated` (published by Insure)
- `alert.notification.create` (published by Insure)

---

### Stage 2: Policy Purchase (Day 1-2)

**Goal**: User decides to purchase insurance policy

#### Phase 2.1: Quote Request

1. **View Recommendation**
   - User opens notification
   - Reviews insurance recommendation
   - Views coverage details and premium breakdown

2. **Customize Coverage** (`Insure Domain`)
   - User adjusts coverage amount
   - Selects premium frequency (Monthly/Quarterly/Annual)
   - Adds deductible preference
   - Reviews risk assessment

3. **Premium Calculation**
   - System calculates personalized premium
   - Factors considered:
     - Asset value and type
     - Coverage amount
     - Policy term
     - Risk assessment
     - User's claim history

**Request:**
```http
GET /api/insure/quote
{
  "assetId": "asset_456",
  "coverageAmount": 500000,
  "policyType": "PROPERTY",
  "term": 10,
  "premiumFrequency": "MONTHLY"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estimatedPremium": 166.67,
    "annualPremium": 2000,
    "coverageAmount": 500000,
    "term": 10,
    "riskScore": 45,
    "riskLevel": "MEDIUM",
    "recommendations": [
      "Regular maintenance recommended",
      "Review coverage annually"
    ]
  }
}
```

#### Phase 2.2: Policy Purchase

1. **Confirm Policy**
   - User reviews final quote
   - Accepts terms and conditions
   - Confirms purchase

2. **Create Policy** (`Insure Domain`)
   - Generate unique policy number
   - Calculate policy period (start/end dates)
   - Create policy record in database
   - Generate premium payment schedule

3. **Process Initial Payment** (`NBF Domain`)
   - Deduct first premium payment
   - Create payment record
   - Update policy status to ACTIVE

4. **Policy Issuance**
   - Generate policy document
   - Send confirmation email
   - Update user dashboard

**Request:**
```http
POST /api/insure/policies
{
  "userId": "user_123",
  "assetId": "asset_456",
  "policyType": "PROPERTY",
  "productName": "Comprehensive Property Insurance",
  "coverageAmount": 500000,
  "premium": 166.67,
  "premiumFrequency": "MONTHLY",
  "term": 10,
  "startDate": "2026-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "policy_789",
    "policyNumber": "INS-1736068800-3421",
    "status": "ACTIVE",
    "startDate": "2026-01-15",
    "endDate": "2036-01-15",
    "nextPaymentDue": "2026-02-15",
    "message": "Policy created successfully"
  }
}
```

**Technical Flow:**
```
User → Insure Domain (Create Policy)
     → Validate Data
     → Generate Policy Number
     → Create Premium Schedule
     → Event Bus: insure.policy.created
     → NBF Domain (Process Payment)
     → Alert Domain (Send Confirmation)
```

**Events Published:**
- `insure.policy.created`
- `nbf.payment.request`
- `alert.notification.create`

---

### Stage 3: Policy Management (Ongoing)

**Goal**: Maintain active insurance coverage

#### Phase 3.1: Premium Payments

1. **Automatic Payment Processing**
   - NBF domain charges monthly premium
   - Payment recorded in premium_payments table
   - Status updated to PAID
   - Receipt sent to user

2. **Payment Reminders**
   - 3 days before due date: Reminder notification
   - On due date: Payment processed
   - If failed: Alert user with retry option

**Technical Flow:**
```
Scheduled Job → Check Due Payments
             → NBF Domain (Charge Account)
             → Update Payment Status
             → Alert Domain (Send Receipt)
```

#### Phase 3.2: Policy Updates

1. **Asset Value Changes**
   - Asset value increases by 30%
   - Assets domain publishes update event
   - Insure domain detects significant change
   - Recommends coverage adjustment

**Event Flow:**
```
Assets Domain: assets.asset.updated
             → Insure Domain (Detects Change)
             → Check Existing Policy
             → Calculate Coverage Gap
             → Notify User: "Coverage Update Recommended"
```

2. **Coverage Adjustment**
   - User requests coverage increase
   - Premium recalculated
   - Policy updated
   - New premium schedule created

---

### Stage 4: Claim Submission (When Incident Occurs)

**Goal**: User files insurance claim for covered incident

#### Phase 4.1: Incident Occurs

**Scenario**: Property damage due to natural disaster

1. **Assess Damage**
   - User evaluates damage
   - Estimates repair cost: 25,000 PI
   - Gathers documentation (photos, reports)

#### Phase 4.2: Submit Claim

1. **File Claim** (`Insure Domain`)
   - User navigates to policy details
   - Clicks "File Claim"
   - Fills claim form
   - Uploads supporting documents

**Request:**
```http
POST /api/insure/claims
{
  "policyId": "policy_789",
  "userId": "user_123",
  "claimAmount": 25000,
  "incidentDate": "2026-06-15",
  "incidentType": "NATURAL_DISASTER",
  "description": "Roof damage from severe storm",
  "documents": [
    {
      "type": "PHOTO",
      "url": "https://storage/claim_doc_001.jpg"
    },
    {
      "type": "DAMAGE_REPORT",
      "url": "https://storage/claim_doc_002.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "claim_123",
    "claimNumber": "CLM-2026-1718409600-842",
    "status": "SUBMITTED",
    "estimatedProcessingTime": "3-5 business days",
    "message": "Claim submitted successfully"
  }
}
```

2. **Automatic Validation**
   - Verify policy is active
   - Check coverage limits
   - Validate claim amount
   - Generate claim number

3. **Claim Submission Event**
   - Event published: `insure.claim.submitted`
   - User receives confirmation
   - Claim enters review queue

**Technical Flow:**
```
User → Insure Domain (Submit Claim)
     → Validate Policy Status
     → Check Coverage Limits
     → Generate Claim Number
     → Create Claim Record
     → Event Bus: insure.claim.submitted
     → Alert Domain (Confirm Submission)
```

**Events Published:**
- `insure.claim.submitted`
- `alert.notification.create`

---

### Stage 5: Claim Processing (Days 1-5)

**Goal**: Review and assess claim validity

#### Phase 5.1: Initial Review

1. **Automated Checks**
   - Fraud detection algorithms
   - Document verification
   - Policy coverage verification
   - Historical claim check

2. **Status Update**
   - Claim status: `SUBMITTED` → `UNDER_REVIEW`
   - User notified of review start
   - Estimated completion time provided

#### Phase 5.2: Manual Review

1. **Claims Adjuster Review**
   - Review submitted documents
   - Assess damage extent
   - Verify incident details
   - Calculate appropriate payout

2. **Additional Information Request**
   - If needed, request more documents
   - User uploads additional evidence
   - Review continues

#### Phase 5.3: Claim Decision

**Scenario A: Claim Approved**

1. **Approval Process**
   - Claims adjuster approves claim
   - Approved amount: 24,000 PI (deductible applied)
   - Review notes added

**Request:**
```http
PUT /api/insure/claims/claim_123/review
{
  "status": "APPROVED",
  "approvedAmount": 24000,
  "reviewNotes": "Claim validated. Damage consistent with storm event. Deductible of 1,000 PI applied.",
  "reviewedBy": "adjuster_456"
}
```

2. **Event Publishing**
   - Event: `insure.claim.approved`
   - Notify Assets domain (update asset status)
   - Request payout from NBF domain
   - Send approval notification to user

**Technical Flow:**
```
Adjuster → Review Claim
         → Approve Claim
         → Event Bus: insure.claim.approved
         → Assets Domain (Update Asset Status)
         → NBF Domain (Process Payout)
         → Alert Domain (Notify User)
```

**Events Published:**
- `insure.claim.approved`
- `assets.insurance.claim.approved`
- `nbf.payment.request`
- `alert.notification.create`

**Scenario B: Claim Rejected**

1. **Rejection Process**
   - Claim rejected due to policy exclusion
   - Detailed rejection reason provided

**Request:**
```http
PUT /api/insure/claims/claim_123/review
{
  "status": "REJECTED",
  "reviewNotes": "Damage not covered under policy terms. Pre-existing condition identified.",
  "reviewedBy": "adjuster_456"
}
```

2. **Event Publishing**
   - Event: `insure.claim.rejected`
   - Notify Assets domain
   - Send rejection notification with explanation
   - Provide appeal process information

**Events Published:**
- `insure.claim.rejected`
- `assets.insurance.claim.rejected`
- `alert.notification.create`

---

### Stage 6: Claim Payout (Days 5-7)

**Goal**: Transfer approved claim amount to user

#### Phase 6.1: Payout Processing

1. **NBF Payment Processing**
   - NBF receives payment request
   - Verifies claim approval
   - Processes payout: 24,000 PI
   - Updates user account balance

2. **Update Claim Status**
   - Claim status: `APPROVED` → `PAID`
   - Record payout details
   - Generate payment reference

**Request:**
```http
POST /api/insure/claims/claim_123/payout
{
  "paidAmount": 24000,
  "paymentReference": "PAY-INS-CLM-2026-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "claimId": "claim_123",
    "claimNumber": "CLM-2026-1718409600-842",
    "status": "PAID",
    "paidAmount": 24000,
    "paidAt": "2026-06-20T14:30:00Z",
    "paymentReference": "PAY-INS-CLM-2026-001"
  }
}
```

3. **Confirmation**
   - User receives payout confirmation
   - Detailed receipt provided
   - Claim closure notification

**Technical Flow:**
```
NBF Domain → Process Payout
           → Update User Balance
           → Insure Domain (Update Claim)
           → Event Bus: insure.claim.paid
           → Alert Domain (Send Confirmation)
           → Assets Domain (Update Asset)
```

**Events Published:**
- `insure.claim.paid`
- `alert.notification.create`

---

## 🔄 Cross-Domain Integration Examples

### Example 1: Real Estate Purchase → Insurance

```
User → Estate Domain (Purchase Property)
     → Event: estate.property.purchased
     → Insure Domain (Generate Recommendation)
     → Event: insure.recommendation.generated
     → Alert Domain (Notify User)
     → User → Insure Domain (Purchase Policy)
```

### Example 2: High-Value Order → Transaction Insurance

```
User → Commerce Domain (Place Order > 5000 PI)
     → Event: commerce.order.created
     → Insure Domain (Offer Transaction Insurance)
     → Event: alert.notification.create
     → User (Optional: Add Insurance)
```

### Example 3: Claim Approval → Asset Update

```
Adjuster → Insure Domain (Approve Claim)
         → Event: insure.claim.approved
         → Assets Domain (Update Asset Status)
         → NBF Domain (Process Payout)
         → Alert Domain (Notify User)
```

---

## 📊 Key Metrics & Analytics

### User Engagement Metrics
- **Policy Conversion Rate**: 35% of recommendations → purchases
- **Average Time to Purchase**: 2.3 days after recommendation
- **Policy Retention Rate**: 94% annual renewal rate
- **Average Coverage Value**: 287,000 PI per policy

### Claim Metrics
- **Claim Approval Rate**: 87%
- **Average Processing Time**: 3.8 days
- **Average Payout**: 18,500 PI
- **Claims Per 1000 Policies**: 12.5 annually

### Financial Metrics
- **Total Coverage Issued**: 2.4 billion PI
- **Monthly Premium Revenue**: 6.2 million PI
- **Claims Payout Ratio**: 68%
- **Average Premium**: 145 PI/month

---

## 🎯 Success Stories

### Story 1: Quick Property Protection

**User**: Sarah, new homeowner
- **Day 0**: Purchased property for 450,000 PI
- **Day 0**: Received insurance recommendation (5 minutes later)
- **Day 1**: Reviewed options and purchased policy
- **Day 1**: Coverage active, peace of mind achieved
- **Outcome**: "The automatic recommendation was perfect timing. I felt protected immediately."

### Story 2: Seamless Claim Experience

**User**: Ahmed, vehicle owner
- **Month 6**: Minor accident, vehicle damage
- **Day 0**: Filed claim via mobile app in 10 minutes
- **Day 3**: Claim approved for 8,000 PI
- **Day 5**: Payout received, repairs initiated
- **Outcome**: "The process was transparent and fast. No hassle at all."

### Story 3: Coverage Optimization

**User**: Maria, investment portfolio owner
- **Month 3**: Asset value increased by 40%
- **Day 1**: Received coverage update notification
- **Day 2**: Adjusted coverage with new premium
- **Ongoing**: Portfolio always adequately insured
- **Outcome**: "The system keeps me protected as my assets grow."

---

## 🚀 Future Journey Enhancements

### Phase 1 (Q2 2026)
- [ ] AI-powered instant claims assessment
- [ ] Virtual claims adjuster (chatbot)
- [ ] Mobile app for claim photo uploads
- [ ] Real-time claim status tracking

### Phase 2 (Q3 2026)
- [ ] Parametric insurance (automatic payouts)
- [ ] Peer-to-peer insurance pools
- [ ] Dynamic premium adjustments
- [ ] Wellness program integrations

### Phase 3 (Q4 2026)
- [ ] Blockchain-based policy records
- [ ] Smart contract automatic claims
- [ ] Multi-domain bundled policies
- [ ] Predictive risk management

---

## 📝 User Feedback Integration

### What Users Love
- ✅ Automatic recommendations when acquiring assets
- ✅ Transparent premium calculations
- ✅ Fast claim processing (3-5 days)
- ✅ Seamless integration with other domains
- ✅ Clear communication throughout process

### Areas for Improvement
- 🔄 More flexible payment options
- 🔄 Additional policy customization
- 🔄 Mobile app enhancements
- 🔄 Multi-language support (expanding)

---

**Domain Owner**: Insure Team  
**Last Updated**: January 2026  
**Version**: 1.0

---

© 2024-2026 TEC Ecosystem - All Rights Reserved
