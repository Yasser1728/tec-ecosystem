# API Documentation

## Overview

This document provides comprehensive API documentation for the TEC Ecosystem platform.

---

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://tec-ecosystem.com/api`

---

## Authentication

All private API endpoints require authentication using NextAuth.js sessions.

### Authentication Flow

1. User signs in via `/api/auth/signin`
2. Session token is stored in HTTP-only cookie
3. Subsequent requests include session cookie automatically
4. API validates session on each request

### Headers

```
Cookie: next-auth.session-token=<token>
Content-Type: application/json
```

---

## Public Endpoints

### Health Check

**GET** `/api/health`

Check API health status.

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## Private Endpoints

### Session Status

**GET** `/api/auth/session-status`

Get current user session status.

**Authentication**: Required

**Response** (200 OK):
```json
{
  "authenticated": true,
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "role": "premium"
  },
  "expires": "2025-01-02T00:00:00.000Z"
}
```

**Response** (401 Unauthorized):
```json
{
  "authenticated": false,
  "error": "Not authenticated"
}
```

---

### Pi Network Authentication

**POST** `/api/auth/pi-authenticate`

Authenticate user with Pi Network credentials.

**Authentication**: Required

**Request Body**:
```json
{
  "piToken": "pi-token-here",
  "userId": "pi-user-id"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "session": {
    "user": { ... },
    "expires": "..."
  }
}
```

**Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid Pi Network credentials"
}
```

---

## Payment Endpoints

### Create Payment

**POST** `/api/payments/create-payment`

Create a new payment transaction.

**Authentication**: Required

**Request Body**:
```json
{
  "amount": 100.00,
  "currency": "USD",
  "description": "Product purchase",
  "metadata": {
    "orderId": "12345",
    "productId": "prod-abc"
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "paymentId": "pay_123abc",
  "amount": 100.00,
  "status": "pending",
  "approvalUrl": "https://..."
}
```

---

### Approve Payment

**POST** `/api/payments/approve`

Approve a pending payment.

**Authentication**: Required

**Request Body**:
```json
{
  "paymentId": "pay_123abc",
  "approvalCode": "abc123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "paymentId": "pay_123abc",
  "status": "approved"
}
```

---

### Complete Payment

**POST** `/api/payments/complete`

Complete an approved payment.

**Authentication**: Required

**Request Body**:
```json
{
  "paymentId": "pay_123abc"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "paymentId": "pay_123abc",
  "status": "completed",
  "completedAt": "2025-01-01T00:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "details": {
    "field": "amount",
    "issue": "must be a positive number"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user
- **Payment endpoints**: 10 requests per minute per user

**Rate Limit Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## Webhooks

### Payment Status Updates

TEC Ecosystem can send webhooks for payment status changes.

**URL**: Configure in admin dashboard

**Method**: POST

**Payload**:
```json
{
  "event": "payment.completed",
  "data": {
    "paymentId": "pay_123abc",
    "status": "completed",
    "amount": 100.00,
    "timestamp": "2025-01-01T00:00:00.000Z"
  },
  "signature": "sha256-signature-here"
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Fetch session status
const response = await fetch('/api/auth/session-status', {
  credentials: 'include'
});
const session = await response.json();

// Create payment
const payment = await fetch('/api/payments/create-payment', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 100.00,
    currency: 'USD',
    description: 'Product purchase'
  })
});
```

---

## Support

For API support:
- **Email**: api-support@tec-ecosystem.com
- **Documentation**: https://docs.tec-ecosystem.com
- **Status Page**: https://status.tec-ecosystem.com

---

**Last Updated**: 2025-01-01
