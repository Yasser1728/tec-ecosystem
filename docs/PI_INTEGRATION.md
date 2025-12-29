# Pi Network Integration Guide

## Overview

This guide explains how Pi Network SDK v2.0 is integrated into the TEC Ecosystem for authentication, payments, and NFT minting.

---

## Table of Contents

1. [Setup](#setup)
2. [Authentication](#authentication)
3. [Payment Flows](#payment-flows)
4. [NFT Minting](#nft-minting)
5. [Transaction Dashboard](#transaction-dashboard)
6. [Testing](#testing)
7. [Compliance](#compliance)
8. [Troubleshooting](#troubleshooting)

---

## Setup

### Prerequisites

- Pi Browser (for production)
- Node.js 18+
- PostgreSQL database
- Pi Network API credentials

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Pi Network Configuration
PI_API_KEY=your_pi_api_key_here
PI_WALLET_PRIVATE_SEED=your_wallet_private_seed_here
NEXT_PUBLIC_PI_SANDBOX=true
PI_SANDBOX_MODE=true

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tec_ecosystem

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Application
NODE_ENV=development
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

---

## Authentication

### Pi SDK Initialization

The Pi SDK is automatically loaded via `pages/document.js`:

```javascript
<script src="https://sdk.minepi.com/pi-sdk.js" async />
```

### User Authentication Flow

1. **Import the authentication module**:

```javascript
import { piAuth } from '../lib/pi-auth';
```

2. **Authenticate user**:

```javascript
const result = await piAuth.authenticate();

if (result.success) {
  console.log('User authenticated:', result.user);
  // User data: piId, username, walletAddress, tier
} else {
  console.error('Authentication failed:', result.error);
}
```

3. **Check authentication status**:

```javascript
if (piAuth.isAuthenticated()) {
  const user = piAuth.getUser();
  console.log('Current user:', user);
}
```

### Using the Auth Button Component

```javascript
import PiAuthButton from '../components/PiAuthButton';

<PiAuthButton
  onAuthSuccess={(user) => {
    console.log('Authenticated:', user);
  }}
  onAuthError={(error) => {
    console.error('Auth error:', error);
  }}
/>
```

---

## Payment Flows

### Domain Purchase

```javascript
import { piPayments } from '../lib/pi-payments';

// Create domain purchase payment
const result = await piPayments.createDomainPurchase({
  domain: 'fundx',
  tier: 'STANDARD' // or 'PREMIUM', 'VIP'
});

if (result.success) {
  console.log('Payment created:', result.paymentId);
}
```

### Premium Notifications

```javascript
const result = await piPayments.createNotificationPayment({
  notificationType: 'premium',
  duration: 'monthly' // or 'quarterly', 'yearly'
});
```

### Ecommerce Services

```javascript
const result = await piPayments.createEcommercePayment({
  serviceId: 'service-123',
  serviceName: 'Luxury Concierge Service',
  price: 150,
  quantity: 1
});
```

### Using the Domain Purchase Button

```javascript
import DomainPurchaseButton from '../components/DomainPurchaseButton';

<DomainPurchaseButton
  domain="fundx"
  tier="STANDARD"
  onSuccess={(result) => {
    console.log('Purchase successful:', result);
  }}
  onError={(error) => {
    console.error('Purchase failed:', error);
  }}
/>
```

### Payment Pricing

| Domain | Base Price (π) | Premium (1.5x) | VIP (2x) |
|--------|---------------|----------------|----------|
| fundx  | 100           | 150            | 200      |
| assets | 150           | 225            | 300      |
| dx     | 200           | 300            | 400      |
| nx     | 180           | 270            | 360      |
| estate | 250           | 375            | 500      |
| land   | 300           | 450            | 600      |
| market | 120           | 180            | 240      |
| store  | 100           | 150            | 200      |

---

## NFT Minting

### Mint Domain Certificate

```javascript
import { nftMinting } from '../lib/nft-minting';

const result = await nftMinting.mintDomainCertificate({
  domainName: 'fundx',
  certificateType: 'ownership' // or 'premium', 'vip', 'founder'
});

if (result.success) {
  console.log('NFT minted:', result.nft);
}
```

### Certificate Types

| Type | Rarity | Minting Fee (π) | Benefits |
|------|--------|----------------|----------|
| Ownership | Standard | 50 | Domain access, Basic features, Community membership |
| Premium | Rare | 50 | Premium features, Priority support, Exclusive events, Revenue sharing |
| VIP | Epic | 50 | All premium + VIP lounge, Personal concierge, Governance rights |
| Founder | Legendary | 50 | All VIP + Lifetime access, Founder badge, Maximum governance |

### Using the NFT Minting Component

```javascript
import NFTMintingCard from '../components/NFTMintingCard';

<NFTMintingCard domainName="fundx" />
```

### Retrieve User NFTs

```javascript
const nfts = await nftMinting.getUserNFTs(userId);
console.log('User NFTs:', nfts);
```

---

## Transaction Dashboard

### Access the Dashboard

Navigate to `/dashboard/transactions` to view:

- Total spent in Pi
- Payment statistics by status
- Payment history by domain
- Real-time transaction updates

### Using the Transaction History Component

```javascript
import TransactionHistory from '../components/TransactionHistory';

<TransactionHistory />
```

### Features

- **Auto-refresh**: Updates every 10 seconds
- **Filtering**: Filter by status (All, Completed, Pending, Failed)
- **Real-time updates**: Listens for payment completion events
- **Statistics**: Total spent, payment counts by status and domain

---

## Testing

### Run Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Coverage

Current coverage targets:

- **Branches**: 85%+
- **Functions**: 85%+
- **Lines**: 85%+
- **Statements**: 85%+

### Test Files

- `tests/unit/pi-auth.test.js` - Authentication tests
- `tests/unit/pi-payments.test.js` - Payment flow tests
- `tests/integration/pi-payment-flow.test.js` - Integration tests
- `tests/e2e/pi-auth-flow.test.js` - End-to-end tests

---

## Compliance

### GDPR Compliance

- User consent management
- Data export functionality
- Right to erasure (anonymization)
- Data retention policies

See `private/COMPLIANCE.md` for full details.

### Pi Network Compliance

- Payment amount limits (0.01 - 10,000 π)
- Rate limiting (10/hour, 50/day)
- KYC requirements for large transactions
- Audit logging

### Implementation

```javascript
import { gdprCompliance } from '../private/lib/gdpr-compliance';
import { piCompliance } from '../private/lib/pi-compliance';

// Export user data
const data = await gdprCompliance.exportUserData(userId);

// Validate payment
const validation = piCompliance.validatePaymentAmount(amount);
```

---

## Troubleshooting

### Pi Browser Not Detected

**Error**: "Pi Browser required for authentication"

**Solution**: 
- Open the app in Pi Browser
- Check if Pi SDK script is loaded
- Verify `window.Pi` is available

### Payment Creation Fails

**Error**: "Failed to create payment"

**Solution**:
- Verify user is authenticated
- Check payment amount is within limits
- Ensure database connection is active
- Check API endpoint responses

### Database Connection Issues

**Error**: "Prisma client not initialized"

**Solution**:
```bash
npx prisma generate
npx prisma db push
```

### Environment Variables Not Loaded

**Error**: "Missing environment variables"

**Solution**:
- Verify `.env.local` file exists
- Check variable names match exactly
- Restart development server

### Test Failures

**Solution**:
```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## API Endpoints

### Authentication

- `POST /api/auth/pi-authenticate` - Authenticate user with Pi Network
- `POST /api/auth/session-status` - Check session status

### Payments

- `POST /api/payments/create-payment` - Create payment record
- `POST /api/payments/approve` - Approve payment
- `POST /api/payments/complete` - Complete payment
- `POST /api/payments/cancel` - Cancel payment
- `POST /api/payments/error` - Handle payment error
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/stats` - Get payment statistics

### NFTs

- `POST /api/nft/mint` - Mint NFT certificate
- `GET /api/nft/user-nfts` - Get user's NFTs
- `GET /api/nft/details` - Get NFT details

---

## Best Practices

### Security

1. Never expose Pi API keys in client-side code
2. Always validate payments on the server
3. Use HTTPS in production
4. Implement rate limiting
5. Log all payment attempts

### User Experience

1. Show clear payment confirmations
2. Handle errors gracefully
3. Provide transaction history
4. Enable auto-refresh for real-time updates
5. Display loading states

### Performance

1. Cache user data appropriately
2. Batch database queries
3. Use pagination for large datasets
4. Optimize NFT metadata generation
5. Implement proper error boundaries

---

## Support

For issues or questions:

- **Documentation**: [docs/](../docs/)
- **GitHub Issues**: [github.com/Yasser1728/tec-ecosystem/issues](https://github.com/Yasser1728/tec-ecosystem/issues)
- **Pi Network Docs**: [developers.minepi.com](https://developers.minepi.com)

---

## Changelog

### v1.0.0 (2025-01-01)

- Initial Pi Network SDK v2.0 integration
- Authentication flow implementation
- Payment flows (domain, notifications, ecommerce)
- NFT minting system
- Transaction dashboard
- Comprehensive testing suite
- GDPR and Pi compliance modules

---

**Last Updated**: 2025-01-01  
**Version**: 1.0.0
