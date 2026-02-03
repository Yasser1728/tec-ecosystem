# CI/CD Setup and Environment Safety Guide

## Overview

This document provides comprehensive guidance for CI/CD workflows and environment configuration for the TEC Ecosystem payment system.

## CI/CD Workflows

### build-and-test Workflow

**Purpose:** Deterministic build and test workflow that prevents hanging PR checks.

**Location:** `.github/workflows/build-and-test.yml`

**Triggers:**
- Pull requests to `main` and `develop` branches
- Pushes to `main` and `develop` branches
- Manual dispatch

**Features:**
- **Timeout Protection:** 15-minute maximum workflow timeout
- **Step-level Timeouts:** Each step has individual timeout to prevent hangs
- **Fail-fast:** Tests must pass; failures block merge

**Steps:**
1. Checkout code (2 min timeout)
2. Setup Node.js 20 with npm cache (2 min timeout)
3. Install dependencies with `npm ci` (5 min timeout)
4. Generate Prisma client (2 min timeout)
5. Build Next.js application (5 min timeout)
6. Run all tests (5 min timeout)

**Environment Variables:**
```yaml
NODE_ENV: test
DATABASE_URL: postgresql://test:test@localhost:5432/test
NEXT_PUBLIC_PI_SANDBOX: true
SKIP_ENV_VALIDATION: true
```

### Main Workflow (TEC Sovereign AI Factory)

**Purpose:** Full build, test, and AI factory execution for production deployments.

**Location:** `.github/workflows/main.yml`

**Additional Features:**
- Sovereign governance tests
- AI self-healing system
- Artifact upload (build output, ledger)
- Continues on AI failure but reports it

## Environment Configuration

### Required Environment Variables

#### Production/Mainnet Mode
```bash
# Pi Network API (REQUIRED for production)
PI_API_KEY=your_production_api_key_here
NEXT_PUBLIC_PI_APP_ID=your_app_id_here
NEXT_PUBLIC_PI_SANDBOX=false
PI_SANDBOX_MODE=false

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com
```

#### Development/Sandbox Mode
```bash
# Pi Network Sandbox (safe for development)
NEXT_PUBLIC_PI_APP_ID=sandbox_app_id
NEXT_PUBLIC_PI_SANDBOX=true
PI_SANDBOX_MODE=true

# No PI_API_KEY needed in sandbox mode

# Local development
DATABASE_URL=postgresql://localhost:5432/dev_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Payment Timeout Configuration (Optional)

All timeouts are in milliseconds. If not specified, safe defaults are used.

```bash
# Pi Network API timeouts
PI_API_CREATE_TIMEOUT=10000       # Default: 10s
PI_API_APPROVE_TIMEOUT=15000      # Default: 15s
PI_API_COMPLETE_TIMEOUT=15000     # Default: 15s
PI_API_CANCEL_TIMEOUT=10000       # Default: 10s
PI_API_GET_TIMEOUT=8000           # Default: 8s

# Database timeouts
DB_QUERY_TIMEOUT=5000             # Default: 5s
DB_TRANSACTION_TIMEOUT=10000      # Default: 10s

# Retry configuration
PAYMENT_MAX_RETRIES=3             # Default: 3
PAYMENT_RETRY_DELAY=2000          # Default: 2s (2000ms)
PAYMENT_RETRY_BACKOFF=1.5         # Default: 1.5x multiplier

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

### Environment Safety Checklist

#### ✅ Safe Practices

1. **Use Sandbox Mode for Development:**
   ```bash
   NEXT_PUBLIC_PI_SANDBOX=true
   ```
   - No external API calls
   - No real Pi Network charges
   - Fast local testing

2. **Never Commit Secrets:**
   - Use `.env.local` for local development
   - Use GitHub Secrets for CI/CD
   - Add `.env.local` to `.gitignore`

3. **Validate Environment Variables:**
   - Use schema validation (Zod)
   - Check required vars on startup
   - Fail early if misconfigured

4. **Set Appropriate Timeouts:**
   - Prevents hanging requests
   - Protects against DoS
   - Provides better error messages

#### ❌ Unsafe Practices

1. **Never hardcode API keys in source code**
2. **Never use production credentials in tests**
3. **Never expose secret environment variables in logs**
4. **Never deploy without timeout protection**
5. **Never skip sandbox testing before production**

## Payment System Architecture

### Timeout Infrastructure

**Module:** `lib/config/payment-timeouts.js`

**Features:**
- Centralized timeout configuration
- Environment-configurable with safe defaults
- Utilities: `withTimeout`, `fetchWithTimeout`, `withRetry`
- Exponential backoff for retries
- Retryable error detection

**Usage Example:**
```javascript
import { fetchWithTimeout, PAYMENT_TIMEOUTS } from '@/lib/config/payment-timeouts';

// Fetch with automatic timeout
const response = await fetchWithTimeout(
  url,
  options,
  PAYMENT_TIMEOUTS.PI_API_APPROVE
);
```

### Monitoring & Alerts

**Module:** `lib/monitoring/payment-alerts.js`

**Features:**
- Structured logging with levels (INFO, WARNING, ERROR, CRITICAL)
- Categories: timeout, failure, validation, external_service, database, security
- Automatic sensitive data sanitization
- Sentry integration ready

**Usage Example:**
```javascript
import { logPaymentTimeout } from '@/lib/monitoring/payment-alerts';

logPaymentTimeout({
  operation: 'approve',
  timeoutMs: 15000,
  paymentId: 'pi-123',
  data: { attempt: 2 }
});
```

### Error Handling

**Module:** `lib/errors/payment-errors.js`

**Features:**
- Bilingual support (English/Arabic)
- Standardized error codes
- Automatic locale detection
- Development vs production error details
- Secure error sanitization

**Usage Example:**
```javascript
import { handlePaymentError } from '@/lib/errors/payment-errors';

try {
  // Payment operation
} catch (error) {
  return handlePaymentError(error, req, res, 'approve');
}
```

## Testing

### Running Tests Locally

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- tests/unit/payment-timeouts.test.js
npm test -- tests/unit/payment-alerts.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Environment

Tests automatically run in sandbox mode with mocked external services. No real Pi Network API calls are made during testing.

**Test Configuration:**
- `NODE_ENV=test`
- `NEXT_PUBLIC_PI_SANDBOX=true`
- Mocked fetch calls
- Isolated test database

## Troubleshooting

### CI Hanging or Timing Out

**Symptoms:**
- PR checks never complete
- Workflow runs for hours without progress
- "Waiting for status checks" message

**Solutions:**
1. Check workflow has timeout set: `timeout-minutes: 15`
2. Check each step has appropriate timeout
3. Verify no infinite loops in code
4. Check for missing environment variables
5. Review logs for stuck processes

### Payment Timeouts in Production

**Symptoms:**
- "Payment operation timed out" errors
- 504 Gateway Timeout responses
- Slow payment processing

**Solutions:**
1. Check Pi Network API status
2. Increase timeout via environment variables:
   ```bash
   PI_API_APPROVE_TIMEOUT=20000
   ```
3. Review monitoring logs for patterns
4. Check network connectivity
5. Verify retry logic is working

### Test Failures

**Symptoms:**
- Tests fail locally or in CI
- Middleware errors (401, 403, 500)
- Mock assertion failures

**Solutions:**
1. Check environment variables are set
2. Verify mocks are properly configured
3. Clear jest cache: `npm test -- --clearCache`
4. Check test isolation (beforeEach/afterEach)
5. Review test logs for details

## Security Considerations

### Secret Management

**DO:**
- ✅ Store secrets in GitHub Secrets
- ✅ Use `.env.local` for local development
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/staging/prod
- ✅ Sanitize errors before client response

**DON'T:**
- ❌ Commit secrets to git
- ❌ Log sensitive data
- ❌ Expose API keys in error messages
- ❌ Use production keys in development
- ❌ Share secrets via insecure channels

### API Security

**Implemented Protections:**
- CORS middleware with origin whitelist
- Request validation (Zod schemas)
- Rate limiting via timeouts
- Error sanitization
- Audit logging
- Permission checks

## Deployment

### Pre-deployment Checklist

- [ ] All tests passing locally
- [ ] CI/CD pipeline passing
- [ ] Environment variables configured
- [ ] Secrets properly set in hosting platform
- [ ] Sandbox mode tested thoroughly
- [ ] Production credentials verified
- [ ] Monitoring/alerting configured
- [ ] Documentation updated
- [ ] Security scan completed

### Production Deployment

1. **Verify Configuration:**
   ```bash
   # Ensure production mode
   NEXT_PUBLIC_PI_SANDBOX=false
   PI_SANDBOX_MODE=false
   PI_API_KEY=<production_key>
   ```

2. **Deploy:**
   ```bash
   npm run build
   npm start
   ```

3. **Monitor:**
   - Check application logs
   - Monitor Sentry for errors
   - Verify payment flows working
   - Check timeout alerts

4. **Rollback Plan:**
   - Keep previous deployment available
   - Have rollback procedure documented
   - Monitor for issues in first 24 hours

## Support

For issues or questions:
- Review this documentation
- Check GitHub Issues
- Review workflow logs
- Contact repository maintainers

## Changelog

### 2026-02-03
- Added build-and-test workflow with timeout protection
- Added payment timeout infrastructure
- Added monitoring and alerting system
- Added bilingual error handling
- Updated payment endpoints with timeout handling
- Created comprehensive test suites
- Created this documentation
