# Insure Domain - API Documentation

## Authentication

All endpoints require JWT authentication unless otherwise specified.

```http
Authorization: Bearer {jwt_token}
```

The JWT token should be obtained through the TEC authentication system using Pi Network credentials.

---

## Base URL

```
Production: https://api.tec.pi
Staging: https://staging-api.tec.pi
Development: http://localhost:3000
```

All insurance endpoints are prefixed with `/api/insure`.

---

## API Endpoints

### Policies

#### Get Insurance Quote

Calculate insurance premium for given parameters.

```http
POST /api/insure/quote
```

**Request Body:**
```json
{
  "policyType": "PROPERTY",
  "coverageAmount": 500000,
  "term": 10,
  "premiumFrequency": "MONTHLY",
  "assetId": "asset_123",
  "riskFactors": {
    "assetAge": 5,
    "location": "LOW_RISK",
    "securityFeatures": ["alarm", "fireExtinguisher"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "basePremium": 2000,
    "adjustedPremium": 1900,
    "finalPremium": 158.33,
    "riskScore": 42,
    "riskLevel": "MEDIUM",
    "factors": {
      "coverageMultiplier": 0.004,
      "termMultiplier": 0.95,
      "riskMultiplier": 1.0,
      "frequencyMultiplier": 12
    },
    "recommendations": [
      "Regular maintenance recommended",
      "Review coverage annually"
    ]
  }
}
```

#### Create Insurance Policy

Purchase a new insurance policy.

```http
POST /api/insure/policies
```

**Request Body:**
```json
{
  "userId": "user_123",
  "assetId": "asset_456",
  "policyType": "PROPERTY",
  "productName": "Comprehensive Property Insurance",
  "coverageAmount": 500000,
  "premium": 166.67,
  "premiumFrequency": "MONTHLY",
  "deductible": 1000,
  "startDate": "2026-01-15T00:00:00Z",
  "term": 10,
  "metadata": {
    "propertyType": "RESIDENTIAL",
    "securityFeatures": ["alarm"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "policy_789",
    "policyNumber": "INS-1736068800-3421",
    "userId": "user_123",
    "assetId": "asset_456",
    "policyType": "PROPERTY",
    "productName": "Comprehensive Property Insurance",
    "coverageAmount": 500000,
    "premium": 166.67,
    "premiumFrequency": "MONTHLY",
    "deductible": 1000,
    "startDate": "2026-01-15T00:00:00Z",
    "endDate": "2036-01-15T00:00:00Z",
    "term": 10,
    "status": "ACTIVE",
    "createdAt": "2026-01-10T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid authentication
- `409 Conflict` - User already has active policy for this asset

#### Get User's Policies

Retrieve all insurance policies for the authenticated user.

```http
GET /api/insure/policies
```

**Query Parameters:**
- `status` (optional) - Filter by policy status (ACTIVE, PENDING, EXPIRED, CANCELLED, LAPSED)
- `policyType` (optional) - Filter by policy type
- `assetId` (optional) - Filter by asset ID

**Example:**
```http
GET /api/insure/policies?status=ACTIVE&policyType=PROPERTY
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "policy_789",
      "policyNumber": "INS-1736068800-3421",
      "policyType": "PROPERTY",
      "productName": "Comprehensive Property Insurance",
      "coverageAmount": 500000,
      "premium": 166.67,
      "status": "ACTIVE",
      "startDate": "2026-01-15T00:00:00Z",
      "endDate": "2036-01-15T00:00:00Z",
      "nextPaymentDue": "2026-02-15T00:00:00Z",
      "activeClaims": 0
    }
  ]
}
```

#### Get Policy Details

Retrieve detailed information about a specific policy.

```http
GET /api/insure/policies/:policyId
```

**Query Parameters:**
- `include` (optional) - Comma-separated list of relations to include (claims, premiumPayments)

**Example:**
```http
GET /api/insure/policies/policy_789?include=claims,premiumPayments
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "policy_789",
    "policyNumber": "INS-1736068800-3421",
    "userId": "user_123",
    "assetId": "asset_456",
    "policyType": "PROPERTY",
    "productName": "Comprehensive Property Insurance",
    "coverageAmount": 500000,
    "premium": 166.67,
    "premiumFrequency": "MONTHLY",
    "deductible": 1000,
    "startDate": "2026-01-15T00:00:00Z",
    "endDate": "2036-01-15T00:00:00Z",
    "term": 10,
    "status": "ACTIVE",
    "metadata": {},
    "createdAt": "2026-01-10T10:30:00Z",
    "updatedAt": "2026-01-10T10:30:00Z",
    "claims": [],
    "premiumPayments": [
      {
        "id": "payment_001",
        "amount": 166.67,
        "dueDate": "2026-02-15T00:00:00Z",
        "status": "PENDING"
      }
    ]
  }
}
```

#### Update Policy

Update policy details (limited fields).

```http
PATCH /api/insure/policies/:policyId
```

**Request Body:**
```json
{
  "status": "CANCELLED",
  "metadata": {
    "cancellationReason": "User request",
    "cancelledAt": "2026-06-01T00:00:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "policy_789",
    "status": "CANCELLED",
    "updatedAt": "2026-06-01T12:00:00Z"
  }
}
```

---

### Claims

#### Submit Insurance Claim

File a new insurance claim.

```http
POST /api/insure/claims
```

**Request Body:**
```json
{
  "policyId": "policy_789",
  "userId": "user_123",
  "claimAmount": 25000,
  "incidentDate": "2026-06-15T14:30:00Z",
  "incidentType": "NATURAL_DISASTER",
  "description": "Severe storm caused roof damage. Multiple shingles torn off, water damage in attic.",
  "documents": [
    {
      "type": "PHOTO",
      "name": "roof_damage_1.jpg",
      "url": "https://storage.tec.pi/claims/roof_damage_1.jpg"
    },
    {
      "type": "DAMAGE_REPORT",
      "name": "contractor_estimate.pdf",
      "url": "https://storage.tec.pi/claims/contractor_estimate.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "claim_456",
    "claimNumber": "CLM-2026-1718409600-842",
    "policyId": "policy_789",
    "userId": "user_123",
    "claimAmount": 25000,
    "incidentDate": "2026-06-15T14:30:00Z",
    "incidentType": "NATURAL_DISASTER",
    "status": "SUBMITTED",
    "createdAt": "2026-06-15T15:30:00Z",
    "estimatedProcessingTime": "3-5 business days"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or policy not active
- `403 Forbidden` - Claim amount exceeds coverage
- `404 Not Found` - Policy not found

#### Get User's Claims

Retrieve all claims for the authenticated user.

```http
GET /api/insure/claims
```

**Query Parameters:**
- `status` (optional) - Filter by claim status
- `policyId` (optional) - Filter by policy ID

**Example:**
```http
GET /api/insure/claims?status=SUBMITTED&policyId=policy_789
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "claim_456",
      "claimNumber": "CLM-2026-1718409600-842",
      "policyId": "policy_789",
      "policyNumber": "INS-1736068800-3421",
      "claimAmount": 25000,
      "incidentDate": "2026-06-15T14:30:00Z",
      "incidentType": "NATURAL_DISASTER",
      "status": "SUBMITTED",
      "createdAt": "2026-06-15T15:30:00Z"
    }
  ]
}
```

#### Get Claim Details

Retrieve detailed information about a specific claim.

```http
GET /api/insure/claims/:claimId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "claim_456",
    "claimNumber": "CLM-2026-1718409600-842",
    "policyId": "policy_789",
    "userId": "user_123",
    "claimAmount": 25000,
    "approvedAmount": null,
    "incidentDate": "2026-06-15T14:30:00Z",
    "incidentType": "NATURAL_DISASTER",
    "description": "Severe storm caused roof damage...",
    "documents": [...],
    "status": "UNDER_REVIEW",
    "reviewNotes": null,
    "reviewedBy": null,
    "reviewedAt": null,
    "createdAt": "2026-06-15T15:30:00Z",
    "updatedAt": "2026-06-16T09:00:00Z",
    "policy": {
      "policyNumber": "INS-1736068800-3421",
      "coverageAmount": 500000,
      "deductible": 1000
    }
  }
}
```

#### Review Claim (Admin Only)

Review and decide on an insurance claim.

```http
PUT /api/insure/claims/:claimId/review
```

**Required Role:** ADMIN or Claims Adjuster

**Request Body (Approval):**
```json
{
  "status": "APPROVED",
  "approvedAmount": 24000,
  "reviewNotes": "Claim validated. Damage consistent with storm event. Deductible of 1,000 PI applied.",
  "reviewedBy": "adjuster_123"
}
```

**Request Body (Rejection):**
```json
{
  "status": "REJECTED",
  "reviewNotes": "Damage not covered under policy terms. Pre-existing condition identified.",
  "reviewedBy": "adjuster_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "claim_456",
    "claimNumber": "CLM-2026-1718409600-842",
    "status": "APPROVED",
    "approvedAmount": 24000,
    "reviewNotes": "Claim validated...",
    "reviewedBy": "adjuster_123",
    "reviewedAt": "2026-06-18T15:45:00Z",
    "updatedAt": "2026-06-18T15:45:00Z"
  }
}
```

#### Process Claim Payout (Admin Only)

Process payout for an approved claim.

```http
POST /api/insure/claims/:claimId/payout
```

**Required Role:** ADMIN or Finance

**Request Body:**
```json
{
  "paidAmount": 24000,
  "paymentReference": "PAY-INS-CLM-2026-001234"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "claim_456",
    "claimNumber": "CLM-2026-1718409600-842",
    "status": "PAID",
    "paidAmount": 24000,
    "paidAt": "2026-06-20T14:30:00Z",
    "paymentReference": "PAY-INS-CLM-2026-001234"
  }
}
```

---

### Premium Payments

#### Get Premium Payments

Retrieve premium payment schedule for a policy.

```http
GET /api/insure/policies/:policyId/payments
```

**Query Parameters:**
- `status` (optional) - Filter by payment status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "payment_001",
      "policyId": "policy_789",
      "amount": 166.67,
      "dueDate": "2026-02-15T00:00:00Z",
      "paidDate": null,
      "status": "PENDING"
    },
    {
      "id": "payment_002",
      "policyId": "policy_789",
      "amount": 166.67,
      "dueDate": "2026-03-15T00:00:00Z",
      "paidDate": null,
      "status": "PENDING"
    }
  ]
}
```

#### Process Premium Payment

Process a premium payment (typically automated via NBF).

```http
POST /api/insure/payments/:paymentId/pay
```

**Request Body:**
```json
{
  "paymentMethod": "AUTO_DEBIT",
  "transactionId": "txn_nbf_123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "payment_001",
    "policyId": "policy_789",
    "amount": 166.67,
    "dueDate": "2026-02-15T00:00:00Z",
    "paidDate": "2026-02-14T18:22:00Z",
    "status": "PAID",
    "paymentMethod": "AUTO_DEBIT",
    "transactionId": "txn_nbf_123456"
  }
}
```

---

### Recommendations

#### Get Insurance Recommendations

Get personalized insurance recommendations based on user's assets.

```http
GET /api/insure/recommendations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "assetId": "asset_456",
      "assetType": "REAL_ESTATE",
      "assetValue": 500000,
      "recommendedPolicyType": "PROPERTY",
      "coverageAmount": 500000,
      "estimatedPremium": 166.67,
      "annualPremium": 2000,
      "riskScore": 42,
      "recommendation": "We recommend PROPERTY insurance for this asset with coverage of 500000 PI at 166.67 PI/month."
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details (optional)
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_INPUT` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `POLICY_INACTIVE` | 400 | Policy is not active |
| `COVERAGE_EXCEEDED` | 403 | Claim amount exceeds coverage |
| `INVALID_STATUS_TRANSITION` | 400 | Invalid status change |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- **Standard Users**: 100 requests per minute
- **Premium Users**: 200 requests per minute
- **Admin Users**: 500 requests per minute

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1736072400
```

---

## Webhooks

Subscribe to insurance events via webhooks:

### Available Events

- `insure.policy.created` - New policy created
- `insure.policy.updated` - Policy updated
- `insure.claim.submitted` - Claim submitted
- `insure.claim.approved` - Claim approved
- `insure.claim.rejected` - Claim rejected
- `insure.claim.paid` - Claim payout completed

### Webhook Payload Format

```json
{
  "eventType": "insure.claim.approved",
  "eventId": "evt_123456",
  "timestamp": "2026-06-18T15:45:00Z",
  "data": {
    "claimId": "claim_456",
    "claimNumber": "CLM-2026-1718409600-842",
    "policyId": "policy_789",
    "userId": "user_123",
    "approvedAmount": 24000
  }
}
```

---

**Last Updated**: January 2026  
**API Version**: v1
