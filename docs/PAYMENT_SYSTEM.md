# Payment System Documentation

## Overview

The TEC Ecosystem payment system is built on Pi Network integration with enhanced reliability, monitoring, and bilingual error handling. This document describes the centralized timeout management, alerting system, and error handling mechanisms.

## Architecture

### Core Components

1. **Centralized Timeout Configuration** (`/lib/config/payment-timeouts.js`)
2. **Payment Alert Logger** (`/lib/monitoring/payment-alerts.js`)
3. **Bilingual Error Handler** (`/lib/errors/payment-errors.js`)
4. **Payment API Endpoints** (`/pages/api/payments/`)
5. **Client Payment Module** (`/lib/pi-payments.js`)

## Timeout Configuration

### Environment Variables

All timeout values can be customized via environment variables:

```env
# Pi Network API Timeouts (milliseconds)
PI_API_APPROVE_TIMEOUT=15000          # Default: 15s
PI_API_COMPLETE_TIMEOUT=15000         # Default: 15s
PI_API_VERIFY_TIMEOUT=10000           # Default: 10s

# Client-Side Timeouts
CLIENT_CREATE_PAYMENT_TIMEOUT=10000   # Default: 10s
CLIENT_APPROVE_TIMEOUT=20000          # Default: 20s
CLIENT_COMPLETE_TIMEOUT=20000         # Default: 20s
CLIENT_CANCEL_TIMEOUT=8000            # Default: 8s
CLIENT_ERROR_TIMEOUT=5000             # Default: 5s

# Retry Configuration
PAYMENT_RETRY_DELAY=2000              # Default: 2s
PAYMENT_MAX_RETRIES=3                 # Default: 3 attempts

# Database & External Services
DB_QUERY_TIMEOUT=5000                 # Default: 5s
EXTERNAL_SERVICE_TIMEOUT=30000        # Default: 30s
```

### Timeout Utilities

#### `withTimeout(promise, timeout, operationName)`
Wraps any promise with a timeout:

```javascript
import { withTimeout, PAYMENT_TIMEOUTS } from './lib/config/payment-timeouts.js';

const result = await withTimeout(
  someAsyncOperation(),
  PAYMENT_TIMEOUTS.DB_QUERY_TIMEOUT,
  'Database Query'
);
```

#### `fetchWithTimeout(url, options, timeout)`
Fetch wrapper with automatic timeout and abort:

```javascript
import { fetchWithTimeout, PAYMENT_TIMEOUTS } from './lib/config/payment-timeouts.js';

const response = await fetchWithTimeout(
  'https://api.minepi.com/v2/payments/123/approve',
  { method: 'POST', headers: {...} },
  PAYMENT_TIMEOUTS.PI_API_APPROVE
);
```

#### `withRetry(fn, maxRetries, baseDelay, operationName)`
Retry wrapper with exponential backoff:

```javascript
import { withRetry, PAYMENT_TIMEOUTS } from './lib/config/payment-timeouts.js';

const result = await withRetry(
  async () => await callPiAPI(),
  PAYMENT_TIMEOUTS.MAX_RETRIES,
  PAYMENT_TIMEOUTS.RETRY_DELAY,
  'Pi API Call'
);
```

## Alerting & Monitoring

### Alert Levels

- **INFO**: Informational messages
- **WARNING**: Non-critical issues (e.g., timeouts, validation failures)
- **ERROR**: Operation failures that need attention
- **CRITICAL**: Severe failures requiring immediate action

### Alert Categories

- **timeout**: Operation exceeded configured timeout
- **failure**: General operation failure
- **validation**: Input validation errors
- **external_service**: Third-party service errors (Pi Network API)
- **database**: Database operation errors
- **security**: Security-related alerts

### Usage Examples

```javascript
import { paymentAlertLogger } from './lib/monitoring/payment-alerts.js';

// Log timeout
paymentAlertLogger.timeout('approve-payment', 15000, { paymentId: '123' });

// Log failure
paymentAlertLogger.failure('complete-payment', error, { paymentId: '123' });

// Log critical error
paymentAlertLogger.critical('process-payment', error, { userId: 'user123' });

// Log external service error
paymentAlertLogger.externalService('Pi Network API', 'approve', error, { paymentId: '123' });

// Log database error
paymentAlertLogger.database('create-payment', error, { userId: 'user123' });

// Log security alert
paymentAlertLogger.security('payment-verification', 'Suspicious activity detected', { userId: 'user123' });
```

### Sentry Integration

The alert logger is Sentry-ready. To enable Sentry:

1. Set `NEXT_PUBLIC_SENTRY_DSN` or `SENTRY_DSN` environment variable
2. Install `@sentry/nextjs` package
3. Alerts will automatically be sent to Sentry

### Custom Monitoring Endpoint

Set `MONITORING_ENDPOINT` environment variable to send alerts to a custom monitoring service:

```env
MONITORING_ENDPOINT=https://monitoring.example.com/api/alerts
```

## Bilingual Error Handling

### Error Codes

All payment errors use standardized error codes:

- `PAYMENT_TIMEOUT`
- `PAYMENT_UNAUTHORIZED`
- `PAYMENT_VALIDATION_FAILED`
- `PAYMENT_INSUFFICIENT_FUNDS`
- `PAYMENT_NETWORK_ERROR`
- `PAYMENT_EXTERNAL_SERVICE_ERROR`
- `PAYMENT_DATABASE_ERROR`
- `PAYMENT_UNKNOWN_ERROR`
- `PAYMENT_NOT_FOUND`
- `PAYMENT_ALREADY_PROCESSED`
- `PAYMENT_APPROVAL_FAILED`
- `PAYMENT_COMPLETION_FAILED`
- `PAYMENT_CANCELLATION_FAILED`
- `PI_SDK_NOT_AVAILABLE`
- `USER_NOT_AUTHENTICATED`

### Creating Payment Errors

```javascript
import { createPaymentError, PAYMENT_ERROR_CODES } from './lib/errors/payment-errors.js';

// Create error with automatic logging
const error = createPaymentError(
  PAYMENT_ERROR_CODES.TIMEOUT,
  { operation: 'approve-payment', paymentId: '123' },
  'ar' // Locale: 'en' or 'ar'
);

throw error;
```

### Handling Errors in API Routes

```javascript
import { handlePaymentError, getLocaleFromRequest } from './lib/errors/payment-errors.js';

async function handler(req, res) {
  const locale = getLocaleFromRequest(req);
  
  try {
    // ... payment logic
  } catch (error) {
    const errorResponse = handlePaymentError(
      error,
      'operation-name',
      locale,
      process.env.NODE_ENV === 'development'
    );
    
    return res.status(500).json(errorResponse);
  }
}
```

### Error Response Format

**User Response (Production):**
```json
{
  "error": true,
  "code": "PAYMENT_TIMEOUT",
  "message": "The payment operation timed out. Please try again.",
  "timestamp": "2026-01-24T20:00:00.000Z"
}
```

**Developer Response (Development):**
```json
{
  "error": true,
  "code": "PAYMENT_TIMEOUT",
  "messages": {
    "en": "The payment operation timed out. Please try again.",
    "ar": "انتهت مهلة عملية الدفع. يرجى المحاولة مرة أخرى."
  },
  "details": {
    "operation": "approve-payment",
    "paymentId": "123"
  },
  "timestamp": "2026-01-24T20:00:00.000Z",
  "stack": "Error: Operation timed out\n    at ..."
}
```

## Payment Flow

### 1. Create Payment

**Endpoint:** `POST /api/payments/create-payment`

**Timeouts:**
- Verification: 10s (`PI_API_VERIFY_TIMEOUT`)
- Database: 5s (`DB_QUERY_TIMEOUT`)

**Alerts:**
- Validation failures
- Verification timeouts
- Database errors

### 2. Approve Payment

**Endpoint:** `POST /api/payments/approve`

**Timeouts:**
- Pi API call: 15s (`PI_API_APPROVE_TIMEOUT`)
- Retry delay: 2s (`PAYMENT_RETRY_DELAY`)
- Max retries: 3 (`PAYMENT_MAX_RETRIES`)

**Alerts:**
- Pi Network API errors
- Timeout after all retries
- Payment not found (404) after retries

### 3. Complete Payment

**Endpoint:** `POST /api/payments/complete`

**Timeouts:**
- Pi API call: 15s (`PI_API_COMPLETE_TIMEOUT`)

**Alerts:**
- Pi Network API errors
- Timeout failures
- Completion errors

### 4. Client-Side Operations

**Timeouts:**
- Create payment: 10s
- Approve: 20s
- Complete: 20s
- Cancel: 8s
- Error reporting: 5s

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run payment tests specifically
npm test tests/unit/pi-payments.test.js

# Run timeout tests
npm test tests/unit/payment-timeouts.test.js
```

### Integration Tests

```bash
# Run integration tests
npm test tests/integration/pi-payment-flow.test.js
```

### Testing Timeouts

To test timeout behavior in development:

1. Set lower timeout values in `.env.local`:
   ```env
   PI_API_APPROVE_TIMEOUT=1000  # 1 second
   ```

2. Use network throttling in browser DevTools

3. Check console for timeout alerts and error messages

## Troubleshooting

### Common Issues

#### 1. Timeouts in Production

**Symptoms:** Payment operations timing out frequently

**Solutions:**
- Increase timeout values via environment variables
- Check Pi Network API status
- Review alert logs for patterns
- Consider increasing `MAX_RETRIES`

#### 2. Missing Error Translations

**Symptoms:** Error messages not showing in correct language

**Solutions:**
- Verify `/public/locales/[locale]/payment.json` files exist
- Check `getLocaleFromRequest()` is properly detecting user locale
- Ensure `Accept-Language` header or `locale` cookie is set

#### 3. Alerts Not Appearing in Sentry

**Symptoms:** Errors not visible in Sentry dashboard

**Solutions:**
- Verify `NEXT_PUBLIC_SENTRY_DSN` is set correctly
- Install `@sentry/nextjs` package
- Check Sentry configuration in `sentry.client.config.js`

## Best Practices

1. **Always use centralized timeout utilities** - Don't create custom timeout logic
2. **Log all payment failures** - Use `paymentAlertLogger` for consistent monitoring
3. **Use bilingual errors** - Call `handlePaymentError()` in all API routes
4. **Test timeout scenarios** - Include timeout tests for critical payment flows
5. **Monitor alert patterns** - Review alert logs regularly for systemic issues
6. **Set reasonable timeouts** - Balance user experience with reliability
7. **Handle retries gracefully** - Use exponential backoff for transient failures

## Environment Setup

### Development

```env
NODE_ENV=development
PI_API_KEY=your_sandbox_key
PI_SANDBOX_MODE=true
NEXT_PUBLIC_PI_SANDBOX=true
PI_SANDBOX_API_URL=https://sandbox-api.minepi.com/v2
PI_API_URL=https://api.minepi.com/v2
NEXTAUTH_URL=http://localhost:3000
```

### Production/Testnet

**Required Environment Variables for Testnet:**

```env
NODE_ENV=production
PI_API_KEY=your_production_or_sandbox_key

# Testnet/Sandbox Configuration (both required)
PI_SANDBOX_MODE=true
NEXT_PUBLIC_PI_SANDBOX=true

# Pi API URLs (both required for proper testnet operation)
PI_SANDBOX_API_URL=https://sandbox-api.minepi.com/v2
PI_API_URL=https://api.minepi.com/v2

# App URL - Must match Pi Developer Portal
NEXTAUTH_URL=https://tec-ecosystem.vercel.app

# Optional: Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
MONITORING_ENDPOINT=https://your-monitoring-service.com/api/alerts

# Optional: Custom Timeouts
PI_API_APPROVE_TIMEOUT=20000
PI_API_COMPLETE_TIMEOUT=20000
PAYMENT_MAX_RETRIES=5
```

**Important Notes for Testnet:**
- Both `PI_SANDBOX_MODE` and `NEXT_PUBLIC_PI_SANDBOX` must be set to `true`
- Both `PI_SANDBOX_API_URL` and `PI_API_URL` should be configured
- `NEXTAUTH_URL` must match the App URL in Pi Developer Portal (`https://tec-ecosystem.vercel.app`)
- The app will automatically use the sandbox API URL when sandbox mode is enabled

## API Reference

### Payment Endpoints

- `POST /api/payments/create-payment` - Create a new payment
- `POST /api/payments/approve` - Approve a payment
- `POST /api/payments/complete` - Complete a payment
- `POST /api/payments/cancel` - Cancel a payment
- `POST /api/payments/error` - Log payment error

### Payment States

- `PENDING` - Payment created, awaiting approval
- `APPROVED` - Payment approved by Pi Network
- `COMPLETED` - Payment completed and verified
- `FAILED` - Payment failed
- `CANCELLED` - Payment cancelled by user

## Security Considerations

1. **API Key Protection** - Never expose `PI_API_KEY` in client-side code
2. **Input Validation** - All payment inputs are validated using Zod schemas
3. **Audit Logging** - All payment operations are logged with forensic hashes
4. **Error Sanitization** - Production errors don't expose sensitive details
5. **Timeout Protection** - Prevents hanging requests from external services

## Support

For issues or questions:
- Review alert logs in monitoring system
- Check Sentry for error patterns
- Consult Pi Network documentation: https://github.com/pi-apps/pi-platform-docs
- Contact TEC support team

## Changelog

### v2.0.0 (2026-01-24)
- Added centralized timeout configuration
- Implemented Sentry-ready alerting system
- Added bilingual error messages (Arabic/English)
- Integrated timeout protection in all payment handlers
- Added automatic retry logic with exponential backoff
- Improved monitoring and observability

### v1.0.0 (Previous)
- Initial Pi Network integration
- Basic payment flows
- Forensic audit logging
