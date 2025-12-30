# Pi Network Multi-Environment Setup

## Overview

This guide explains how to configure TEC Ecosystem for both **Testnet** and **Mainnet** Pi Network environments using Vercel.

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Vercel Deployment               │
├─────────────────────────────────────────┤
│                                         │
│  Production (main branch)               │
│  ├─ URL: tec-ecosystem.vercel.app      │
│  ├─ Pi Network: Mainnet                │
│  └─ Variables: Mainnet credentials     │
│                                         │
│  Preview (staging/dev branches)         │
│  ├─ URL: tec-ecosystem-git-*.vercel.app│
│  ├─ Pi Network: Testnet                │
│  └─ Variables: Testnet credentials     │
│                                         │
└─────────────────────────────────────────┘
```

---

## Setup Instructions

### Step 1: Create Two Pi Network Apps

Go to [Pi Developer Portal](https://develop.pi) and create:

1. **Testnet App**
   - Name: TEC Ecosystem (Testnet)
   - Network: Testnet
   - Get: App ID, API Key, Sandbox ID

2. **Mainnet App**
   - Name: TEC Ecosystem
   - Network: Mainnet
   - Get: App ID, API Key, Wallet Address

---

### Step 2: Configure Vercel Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

#### For Production (Mainnet):

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_PI_NETWORK` | `mainnet` | Production |
| `NEXT_PUBLIC_PI_APP_ID` | Your mainnet app ID | Production |
| `NEXT_PUBLIC_PI_SANDBOX` | `false` | Production |
| `PI_SANDBOX_MODE` | `false` | Production |
| `PI_API_KEY` | Your mainnet API key | Production |
| `PI_WALLET_ADDRESS` | Your mainnet wallet | Production |

#### For Preview (Testnet):

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_PI_NETWORK` | `testnet` | Preview |
| `NEXT_PUBLIC_PI_APP_ID` | Your testnet app ID | Preview |
| `NEXT_PUBLIC_PI_SANDBOX` | `true` | Preview |
| `PI_SANDBOX_MODE` | `true` | Preview |
| `PI_API_KEY` | Your testnet API key | Preview |
| `PI_SANDBOX_ID` | Your sandbox ID | Preview |

---

### Step 3: Branch Strategy

```bash
# Production (Mainnet)
git push origin main
# Deploys to: tec-ecosystem.vercel.app
# Uses: Mainnet credentials

# Testing (Testnet)
git checkout -b staging
git push origin staging
# Deploys to: tec-ecosystem-git-staging.vercel.app
# Uses: Testnet credentials
```

---

## Usage

### Testing on Testnet

1. Push to `staging` or any non-main branch
2. Vercel creates preview deployment
3. Open preview URL in Pi Browser
4. App uses testnet credentials automatically

### Production on Mainnet

1. Merge to `main` branch
2. Vercel deploys to production
3. Open production URL in Pi Browser
4. App uses mainnet credentials automatically

---

## Environment Detection

The app automatically detects the environment:

```javascript
// In lib/pi-sdk.js
const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

await window.Pi.init({
  version: "2.0",
  sandbox, // true for testnet, false for mainnet
});
```

---

## Validation Keys

Each environment needs its own validation key:

### Testnet:
```
public/validation-key-testnet.txt
```

### Mainnet:
```
public/validation-key.txt
```

Configure in `next.config.js` to serve the correct file based on environment.

---

## Troubleshooting

### Issue: Wrong credentials used

**Solution:** Check Vercel environment variables are set for correct environment (Production vs Preview)

### Issue: Sandbox mode not working

**Solution:** Ensure `NEXT_PUBLIC_PI_SANDBOX=true` for Preview environment

### Issue: Payment failures

**Solution:** Verify API keys match the app environment (testnet vs mainnet)

---

## Best Practices

1. **Always test on Testnet first** before deploying to Mainnet
2. **Use Preview deployments** for all development and testing
3. **Keep credentials secure** - never commit to git
4. **Monitor both environments** separately in Pi Developer Portal
5. **Use different databases** for testnet and mainnet if possible

---

## Quick Reference

| Aspect | Testnet | Mainnet |
|--------|---------|---------|
| Branch | staging/dev | main |
| URL | preview URL | production URL |
| Sandbox | true | false |
| Pi Network | Testnet | Mainnet |
| Testing | Safe to test | Real transactions |
| Users | Test users | Real users |

---

## Support

For issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test in Pi Browser developer mode
4. Check Pi Developer Portal for app status
