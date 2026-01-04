# Insure Domain - Data Model Documentation

## Entity Relationship Diagram (Text-Based)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User (System)                              │
│  - id: String (PK)                                                  │
│  - piUserId: String (Unique)                                        │
│  - username: String                                                 │
│  - role: Role                                                       │
└─────────────┬───────────────────────────────────────────────────────┘
              │ 1:N
              │
              ├──────────────┐
              │              │
              │              │
┌─────────────▼─────────────────────────────────────┐
│            InsurancePolicy                        │
│  - id: String (PK)                                │
│  - policyNumber: String (Unique, Indexed)         │
│  - userId: String (FK → User, Indexed)            │
│  - assetId: String (Optional FK → Asset, Indexed) │
│                                                   │
│  Policy Details:                                  │
│  - policyType: PolicyType (Enum)                  │
│  - productName: String                            │
│  - coverageAmount: Float                          │
│  - premium: Float                                 │
│  - premiumFrequency: PremiumFrequency (Enum)      │
│  - deductible: Float                              │
│                                                   │
│  Policy Period:                                   │
│  - startDate: DateTime                            │
│  - endDate: DateTime                              │
│  - term: Int (years)                              │
│                                                   │
│  Status & Metadata:                               │
│  - status: PolicyStatus (Enum, Indexed)           │
│  - metadata: Json                                 │
│                                                   │
│  Timestamps:                                      │
│  - createdAt: DateTime                            │
│  - updatedAt: DateTime                            │
└───────┬────────────────┬──────────────────────────┘
        │ 1:N            │ 1:N
        │                │
┌───────▼────────┐  ┌────▼──────────────────────────┐
│     Claim      │  │      PremiumPayment            │
│                │  │                                │
│  - id: PK      │  │  - id: PK                      │
│  - claimNumber │  │  - policyId: FK (Indexed)      │
│  - policyId: FK│  │  - amount: Float               │
│  - userId: FK  │  │  - dueDate: DateTime (Indexed) │
│                │  │  - paidDate: DateTime          │
│  Claim Details:│  │  - status: Status (Indexed)    │
│  - claimAmount │  │  - paymentMethod: String       │
│  - approved    │  │  - transactionId: String       │
│    Amount      │  │  - metadata: Json              │
│  - incidentDate│  │  - createdAt: DateTime         │
│  - incidentType│  │  - updatedAt: DateTime         │
│  - description │  │                                │
│  - documents   │  └────────────────────────────────┘
│                │
│  Processing:   │
│  - status      │
│  - reviewNotes │
│  - reviewedBy  │
│  - reviewedAt  │
│                │
│  Payout:       │
│  - paidAmount  │
│  - paidAt      │
│  - payment     │
│    Reference   │
└────────────────┘
```

## Detailed Entity Specifications

### InsurancePolicy

**Purpose**: Represents an insurance contract between the user and the system.

**Attributes:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique policy identifier |
| policyNumber | String | Unique, Indexed | Human-readable policy number (INS-{timestamp}-{random}) |
| userId | String | FK → User, Indexed, Required | Policy owner |
| assetId | String | FK → Asset, Indexed, Optional | Linked asset being insured |
| policyType | PolicyType | Enum, Required | Type of insurance (LIFE, HEALTH, PROPERTY, AUTO, TRAVEL, TRANSACTION, ASSET) |
| productName | String | Required | Name of insurance product |
| coverageAmount | Float | Required, > 0 | Maximum coverage limit in PI |
| premium | Float | Required, > 0 | Payment amount per frequency |
| premiumFrequency | PremiumFrequency | Enum, Default: MONTHLY | Payment frequency (MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL) |
| deductible | Float | Default: 0 | Amount user pays before insurance covers |
| startDate | DateTime | Required | Policy start date |
| endDate | DateTime | Required | Policy end date (calculated from term) |
| term | Int | Required, > 0 | Policy duration in years |
| status | PolicyStatus | Enum, Indexed, Default: ACTIVE | Policy status (ACTIVE, PENDING, EXPIRED, CANCELLED, LAPSED) |
| metadata | Json | Optional | Flexible storage for additional policy details |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

**Relationships:**
- Belongs to one User (Many-to-One)
- Has many Claims (One-to-Many)
- Has many PremiumPayments (One-to-Many)
- Optionally links to one Asset (Many-to-One)

**Indexes:**
- Primary: id
- Unique: policyNumber
- Indexed: userId, policyNumber, status, assetId

**Business Rules:**
1. Policy number must be unique across all policies
2. Coverage amount must be positive
3. Premium must be positive
4. End date is calculated as: startDate + (term × 365 days)
5. Deductible cannot exceed coverage amount
6. Only ACTIVE policies can have new claims submitted
7. EXPIRED policies cannot be renewed after 90 days
8. CANCELLED policies cannot be reactivated

### Claim

**Purpose**: Represents a user's insurance claim request for a covered incident.

**Attributes:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique claim identifier |
| claimNumber | String | Unique, Indexed | Human-readable claim number (CLM-{year}-{timestamp}-{random}) |
| policyId | String | FK → InsurancePolicy, Indexed, Required | Associated policy |
| userId | String | FK → User, Indexed, Required | Claim submitter (must match policy user) |
| claimAmount | Float | Required, > 0 | Requested claim amount in PI |
| approvedAmount | Float | Optional | Approved payout amount (if approved) |
| incidentDate | DateTime | Required | When incident occurred |
| incidentType | String | Required | Type of incident (e.g., ACCIDENT, THEFT, NATURAL_DISASTER) |
| description | String | Required | Detailed incident description |
| documents | Json | Optional | Array of document references (photos, reports, invoices) |
| status | ClaimStatus | Enum, Indexed, Default: SUBMITTED | Claim status (SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, PAID, CLOSED) |
| reviewNotes | String | Optional | Adjuster's review comments |
| reviewedBy | String | Optional | Adjuster identifier |
| reviewedAt | DateTime | Optional | Review completion timestamp |
| paidAmount | Float | Optional | Actual payout amount |
| paidAt | DateTime | Optional | Payout timestamp |
| paymentReference | String | Optional | Payment transaction reference |
| createdAt | DateTime | Auto | Submission timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

**Relationships:**
- Belongs to one InsurancePolicy (Many-to-One)
- Belongs to one User (Many-to-One)

**Indexes:**
- Primary: id
- Unique: claimNumber
- Indexed: userId, policyId, claimNumber, status

**Business Rules:**
1. Claim number must be unique across all claims
2. Claim amount must be positive and cannot exceed policy coverage
3. User must match policy user
4. Policy must be ACTIVE to submit claim
5. Incident date cannot be in the future
6. Incident date must be within policy coverage period
7. Approved amount cannot exceed claim amount or coverage limit
8. Status transitions:
   - SUBMITTED → UNDER_REVIEW → APPROVED/REJECTED
   - APPROVED → PAID → CLOSED
9. Only APPROVED claims can be paid
10. Claim amount minus deductible = maximum approved amount

### PremiumPayment

**Purpose**: Tracks scheduled and completed premium payments for policies.

**Attributes:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique payment identifier |
| policyId | String | FK → InsurancePolicy, Indexed, Required | Associated policy |
| amount | Float | Required, > 0 | Payment amount in PI |
| dueDate | DateTime | Required, Indexed | Payment due date |
| paidDate | DateTime | Optional | Actual payment date |
| status | PremiumPaymentStatus | Enum, Indexed, Default: PENDING | Payment status (PENDING, PAID, OVERDUE, WAIVED) |
| paymentMethod | String | Optional | Payment method used |
| transactionId | String | Optional | Payment transaction reference |
| metadata | Json | Optional | Additional payment details |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

**Relationships:**
- Belongs to one InsurancePolicy (Many-to-One)

**Indexes:**
- Primary: id
- Indexed: policyId, status, dueDate

**Business Rules:**
1. Amount must match policy premium
2. Due dates are calculated based on premium frequency:
   - MONTHLY: Every month from start date
   - QUARTERLY: Every 3 months
   - SEMI_ANNUAL: Every 6 months
   - ANNUAL: Every year
3. Payments become OVERDUE if not paid within 30 days of due date
4. Policy becomes LAPSED if 2 consecutive payments are OVERDUE
5. PAID payments cannot be modified
6. Payment schedule is created automatically on policy creation
7. First 12 payments (1 year ahead) are created initially

## Enumerations

### PolicyType

Defines the type of insurance coverage:

```typescript
enum PolicyType {
  LIFE = 'LIFE',              // Life insurance
  HEALTH = 'HEALTH',          // Health/medical insurance
  PROPERTY = 'PROPERTY',      // Real estate/property insurance
  AUTO = 'AUTO',              // Vehicle/auto insurance
  TRAVEL = 'TRAVEL',          // Travel insurance
  TRANSACTION = 'TRANSACTION', // Purchase/transaction insurance
  ASSET = 'ASSET'             // General asset insurance
}
```

### PolicyStatus

Defines the current state of an insurance policy:

```typescript
enum PolicyStatus {
  ACTIVE = 'ACTIVE',         // Policy is active and claims can be filed
  PENDING = 'PENDING',       // Policy awaiting activation (payment processing)
  EXPIRED = 'EXPIRED',       // Policy term has ended
  CANCELLED = 'CANCELLED',   // Policy cancelled by user or system
  LAPSED = 'LAPSED'          // Policy lapsed due to non-payment
}
```

### PremiumFrequency

Defines how often premiums are paid:

```typescript
enum PremiumFrequency {
  MONTHLY = 'MONTHLY',           // 12 payments per year
  QUARTERLY = 'QUARTERLY',       // 4 payments per year
  SEMI_ANNUAL = 'SEMI_ANNUAL',   // 2 payments per year
  ANNUAL = 'ANNUAL'              // 1 payment per year
}
```

### ClaimStatus

Defines the current state of an insurance claim:

```typescript
enum ClaimStatus {
  SUBMITTED = 'SUBMITTED',       // Claim submitted, awaiting review
  UNDER_REVIEW = 'UNDER_REVIEW', // Claim being reviewed by adjuster
  APPROVED = 'APPROVED',         // Claim approved, awaiting payout
  REJECTED = 'REJECTED',         // Claim rejected
  PAID = 'PAID',                 // Claim paid out
  CLOSED = 'CLOSED'              // Claim closed (final state)
}
```

### PremiumPaymentStatus

Defines the current state of a premium payment:

```typescript
enum PremiumPaymentStatus {
  PENDING = 'PENDING',   // Payment due, not yet processed
  PAID = 'PAID',         // Payment completed successfully
  OVERDUE = 'OVERDUE',   // Payment past due date
  WAIVED = 'WAIVED'      // Payment waived (e.g., grace period, promotion)
}
```

## Sample Data

### Sample InsurancePolicy

```json
{
  "id": "policy_clh3k4j5l0000qwer1234567",
  "policyNumber": "INS-1736068800-3421",
  "userId": "user_clh3k4j5l0000qwer1234567",
  "assetId": "asset_clh3k4j5l0000qwer1234567",
  "policyType": "PROPERTY",
  "productName": "Comprehensive Property Insurance",
  "coverageAmount": 500000.00,
  "premium": 166.67,
  "premiumFrequency": "MONTHLY",
  "deductible": 1000.00,
  "startDate": "2026-01-15T00:00:00Z",
  "endDate": "2036-01-15T00:00:00Z",
  "term": 10,
  "status": "ACTIVE",
  "metadata": {
    "propertyType": "RESIDENTIAL",
    "buildingAge": 5,
    "securityFeatures": ["alarm", "fireExtinguisher"],
    "location": {
      "country": "USA",
      "state": "CA",
      "riskZone": "LOW"
    }
  },
  "createdAt": "2026-01-10T10:30:00Z",
  "updatedAt": "2026-01-10T10:30:00Z"
}
```

### Sample Claim

```json
{
  "id": "claim_clh3k4j5l0000qwer7654321",
  "claimNumber": "CLM-2026-1718409600-842",
  "policyId": "policy_clh3k4j5l0000qwer1234567",
  "userId": "user_clh3k4j5l0000qwer1234567",
  "claimAmount": 25000.00,
  "approvedAmount": 24000.00,
  "incidentDate": "2026-06-15T14:30:00Z",
  "incidentType": "NATURAL_DISASTER",
  "description": "Severe storm caused roof damage. Multiple shingles torn off, water damage in attic.",
  "documents": [
    {
      "type": "PHOTO",
      "name": "roof_damage_1.jpg",
      "url": "https://storage.tec.pi/claims/claim_xxx/roof_damage_1.jpg",
      "uploadedAt": "2026-06-15T16:00:00Z"
    },
    {
      "type": "DAMAGE_REPORT",
      "name": "contractor_estimate.pdf",
      "url": "https://storage.tec.pi/claims/claim_xxx/contractor_estimate.pdf",
      "uploadedAt": "2026-06-16T09:00:00Z"
    },
    {
      "type": "WEATHER_REPORT",
      "name": "storm_verification.pdf",
      "url": "https://storage.tec.pi/claims/claim_xxx/storm_verification.pdf",
      "uploadedAt": "2026-06-16T10:00:00Z"
    }
  ],
  "status": "PAID",
  "reviewNotes": "Claim validated. Damage consistent with reported storm event. Deductible of 1,000 PI applied. Approved for repair costs.",
  "reviewedBy": "adjuster_clh3k4j5l0000qwer9999999",
  "reviewedAt": "2026-06-18T15:45:00Z",
  "paidAmount": 24000.00,
  "paidAt": "2026-06-20T14:30:00Z",
  "paymentReference": "PAY-INS-CLM-2026-001234",
  "createdAt": "2026-06-15T15:30:00Z",
  "updatedAt": "2026-06-20T14:30:00Z"
}
```

### Sample PremiumPayment

```json
{
  "id": "payment_clh3k4j5l0000qwer5555555",
  "policyId": "policy_clh3k4j5l0000qwer1234567",
  "amount": 166.67,
  "dueDate": "2026-02-15T00:00:00Z",
  "paidDate": "2026-02-14T18:22:00Z",
  "status": "PAID",
  "paymentMethod": "AUTO_DEBIT",
  "transactionId": "txn_clh3k4j5l0000qwer8888888",
  "metadata": {
    "paymentProcessor": "NBF",
    "accountId": "nbf_account_123",
    "confirmationEmail": true
  },
  "createdAt": "2026-01-15T00:00:00Z",
  "updatedAt": "2026-02-14T18:22:00Z"
}
```

## Database Migrations

### Initial Migration

When deploying the insure domain, run:

```bash
npx prisma migrate dev --name add_insure_domain
```

This creates:
- insurance_policies table
- insurance_claims table
- premium_payments table
- All necessary indexes
- All enum types

### Rollback Strategy

If issues arise, rollback with:

```bash
npx prisma migrate resolve --rolled-back {migration_id}
```

## Performance Considerations

### Indexes

All frequently queried fields are indexed:
- `userId` on all tables (user-centric queries)
- `policyNumber`, `claimNumber` (unique lookups)
- `status` fields (filtering by status)
- `assetId` on policies (asset-policy linking)
- `dueDate` on payments (payment scheduling)

### Query Optimization

**Good:**
```javascript
// Fetch policy with related data in one query
const policy = await prisma.insurancePolicy.findUnique({
  where: { id: policyId },
  include: {
    claims: {
      where: { status: 'SUBMITTED' },
      orderBy: { createdAt: 'desc' }
    },
    premiumPayments: {
      where: { status: 'PENDING' },
      take: 1
    }
  }
});
```

**Bad:**
```javascript
// Multiple queries (N+1 problem)
const policy = await prisma.insurancePolicy.findUnique({ where: { id } });
const claims = await prisma.claim.findMany({ where: { policyId: id } });
const payments = await prisma.premiumPayment.findMany({ where: { policyId: id } });
```

---

**Last Updated**: January 2026  
**Version**: 1.0
