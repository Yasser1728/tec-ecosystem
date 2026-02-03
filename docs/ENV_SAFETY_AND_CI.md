# Environment Safety and CI Best Practices

## Overview

This document outlines best practices for environment variable management, testing, and continuous integration in the TEC Ecosystem project.

---

## Environment Variable Safety

### Critical Environment Variables

The following environment variables contain sensitive information and must be protected:

| Variable | Purpose | Scope | Required |
|----------|---------|-------|----------|
| `PI_API_KEY` | Pi Network API authentication | Server-side only | Production/Testnet |
| `PI_WALLET_ADDRESS` | Pi Network wallet for payments | Server-side only | Production |
| `PI_SANDBOX_ID` | Testnet sandbox identifier | Server-side only | Testnet |
| `NEXTAUTH_SECRET` | Session encryption key | Server-side only | All |
| `DATABASE_URL` | Database connection string | Server-side only | All |

### Public Environment Variables

These variables are safe to expose to the client:

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_PI_NETWORK` | Pi Network environment (mainnet/testnet) | `testnet` |
| `NEXT_PUBLIC_PI_APP_ID` | Pi App identifier | Required |
| `NEXT_PUBLIC_PI_SANDBOX` | Enable sandbox mode | `true` in development |
| `NODE_ENV` | Node environment | `development` |

### Security Best Practices

1. **Never commit secrets to git**
   - Use `.env.local` for local development (git-ignored)
   - Use `.env.example` as a template (no actual values)
   - Rotate keys if accidentally committed

2. **Environment-specific configuration**
   ```javascript
   // ✅ Good: Runtime environment check
   const isDevelopment = process.env.NODE_ENV === 'development';
   
   // ❌ Bad: Build-time check that can't change
   const ALLOWED_ORIGINS = ['http://localhost:3000'];
   ```

3. **Use Vercel Environment Variables**
   - Production: Only mainnet credentials
   - Preview: Only testnet credentials
   - Development: Local `.env.local`

4. **Validation and fallbacks**
   ```javascript
   const PI_API_KEY = process.env.PI_API_KEY;
   if (!PI_API_KEY && !isSandbox) {
     throw new Error('PI_API_KEY is required in production');
   }
   ```

---

## CI/CD Configuration

### GitHub Actions Workflows

#### Build and Test Workflow

Location: `.github/workflows/build-and-test.yml`

This workflow runs on every pull request to ensure code quality:

```yaml
name: build-and-test
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

#### CI Pipeline

Location: `.github/workflows/ci.yml`

Runs linting, security checks, and tests:

```yaml
name: CI Pipeline
on:
  pull_request:
  push:
    branches: [main]

jobs:
  lint:
    - run: npm run lint
  
  test:
    - run: npm test
    
  security:
    - run: npm audit
```

### Test Environment Configuration

#### Required Environment Variables for Tests

Tests use mock authentication and sandbox mode:

```bash
# .env.test (used by Jest)
NODE_ENV=test
NEXT_PUBLIC_PI_SANDBOX=true
PI_SANDBOX_MODE=true
NEXTAUTH_URL=http://localhost:3000
```

#### Mock Authentication in Tests

Always mock next-auth in test files:

```javascript
jest.mock("next-auth", () => jest.fn());
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: { id: "test-user", role: "admin" }
  })),
}));
```

#### Test Request Structure

Include all required properties:

```javascript
const req = {
  method: "POST",
  body: { /* payload */ },
  headers: { "user-agent": "test" },
  socket: { remoteAddress: "127.0.0.1" },
  url: "/api/endpoint",
};
```

---

## CORS Configuration

### Runtime Environment Checks

CORS origins are checked at request time, not module load time:

```javascript
function isOriginAllowed(origin) {
  // ✅ Runtime check - respects NODE_ENV changes
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && isLocalhost(origin)) {
    return true;
  }
  
  return ALLOWED_ORIGINS.includes(origin);
}
```

### Allowed Origins

- **Production**: Only .pi domains and Vercel URLs
- **Development/Test**: Localhost URLs (127.0.0.1, localhost:3000-3002)
- **Security**: Blocks unauthorized origins with 403

---

## Testing Strategy

### Test Categories

1. **Unit Tests** (`tests/unit/**`)
   - Test individual functions and modules
   - Mock all external dependencies
   - Fast execution (<1s per test)

2. **Integration Tests** (`tests/integration/**`)
   - Test API endpoints with middleware
   - Mock external services (Pi Network, database)
   - Medium execution (1-5s per test)

3. **E2E Tests** (`tests/e2e/**`)
   - Test complete user flows
   - Real browser interaction
   - Slow execution (5-30s per test)

### Running Tests

```bash
# All tests
npm test

# Specific category
npm run test:unit
npm run test:integration
npm run test:e2e

# With coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Best Practices

1. **Isolate tests**: Each test should be independent
2. **Mock external services**: Don't call real APIs in tests
3. **Clean up**: Restore environment and mocks in `afterEach`
4. **Descriptive names**: Test names should explain what they test
5. **Fast tests**: Unit tests should complete in milliseconds

---

## Payment API Testing

### Sandbox Mode

All payment tests use sandbox mode to avoid real transactions:

```javascript
beforeEach(() => {
  process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
  process.env.PI_SANDBOX_MODE = "true";
});
```

### Retry Logic Testing

Payment approval retries on 404 errors (payment not yet registered):

```javascript
// Test successful retry
global.fetch
  .mockResolvedValueOnce({ ok: false, status: 404 })
  .mockResolvedValueOnce({ ok: true, json: async () => ({...}) });

// Expect 2 total calls
expect(global.fetch).toHaveBeenCalledTimes(2);
```

### Error Handling

Tests verify localized error messages:

```javascript
// Localized 404 error after retries
expect(res.json).toHaveBeenCalledWith(
  expect.objectContaining({
    error: "Failed to approve payment",
    message: "Payment not found. Please try again later.",
  })
);
```

---

## Security Scanning

### Automated Security Checks

1. **Codacy**: Automated code quality and security scanning
2. **npm audit**: Dependency vulnerability checking
3. **CodeQL**: Advanced code analysis for security issues

### Running Security Checks

```bash
# Check for known vulnerabilities
npm audit

# Fix non-breaking vulnerabilities
npm audit fix

# Check all dependencies
npm audit --production
```

---

## Troubleshooting

### Common Issues

#### Tests failing with "Internal server error"

**Cause**: Middleware catching errors before handlers can return specific errors

**Solution**: Ensure all test requests include:
- `headers` with `user-agent`
- `socket` with `remoteAddress`
- `url` property
- Proper authentication mocks

#### CORS errors in production

**Cause**: Localhost allowed due to build-time environment check

**Solution**: Use runtime environment checks:
```javascript
const isDevelopment = process.env.NODE_ENV === 'development';
```

#### Environment variables not loading

**Cause**: Missing `.env.local` or incorrect variable names

**Solution**: 
1. Copy `.env.example` to `.env.local`
2. Check variable names match `process.env.VARIABLE_NAME`
3. Restart dev server after changes

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Security audit clean (`npm audit`)
- [ ] Environment variables set in Vercel
- [ ] Secrets rotated if needed
- [ ] CORS origins updated
- [ ] Pi Network app configured for mainnet
- [ ] Database migrations run
- [ ] Monitoring enabled

---

## Continuous Improvement

### Monitoring Test Health

1. **Track test execution time**: Optimize slow tests
2. **Monitor flaky tests**: Fix non-deterministic failures
3. **Coverage metrics**: Aim for >80% code coverage
4. **Security alerts**: Address immediately

### Updating Documentation

When adding new features:
1. Update relevant documentation
2. Add environment variable examples
3. Document testing approach
4. Update security considerations

---

## References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Pi Network API Documentation](https://pi-network.readme.io/)
- [Jest Testing Best Practices](https://jestjs.io/docs/getting-started)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## Support

For questions or issues:
1. Check this documentation first
2. Review test output and logs
3. Verify environment configuration
4. Check GitHub Actions workflow logs
5. Open an issue with detailed information
