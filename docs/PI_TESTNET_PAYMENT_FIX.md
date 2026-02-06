# Pi Testnet Payment Timeout Fix

## Problem Statement

Users experienced "Payment Expired" timeout errors when attempting payments in Pi testnet environment. The payment flow would start successfully, but the backend approval and completion endpoints were never called, causing Pi Network to timeout waiting for approval.

## Root Cause

The issue was in the Pi SDK initialization logic in `pages/_document.js`:

1. **Local mock always initialized first**: A local JavaScript mock (`PiSandbox`) was always initialized immediately when the page loaded
2. **Real SDK detection failed**: The detection logic checked for `constructor.name !== 'PiSandbox'`, but the real Pi SDK might not have fully loaded yet
3. **Mock interfered with testnet**: In testnet mode, the local mock was being used instead of the real Pi SDK from Pi Network
4. **Callbacks never fired**: The local mock simulates callbacks with setTimeout, but in testnet, we need the REAL Pi SDK to trigger callbacks based on actual user actions in Pi Browser

The key insight: **In testnet, we need the REAL Pi SDK from Pi Network (with `sandbox: true`), NOT a local JavaScript mock.**

## Solution

### Environment Detection

The fix introduces hostname-based detection to determine which SDK to use:

```javascript
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
const isDeployed = window.location.hostname.includes('vercel.app') || 
                   window.location.hostname.includes('tec-ecosystem');
const shouldUseRealSDK = isDeployed || !isLocalhost;
```

### Three Modes

1. **Local Development (localhost)**
   - Uses local JavaScript mock (`PiSandbox`)
   - Callbacks triggered via setTimeout (1s for approval, 2s for completion)
   - No real Pi Network connection needed
   - Fast testing without Pi Browser

2. **Testnet (Vercel deployed with NEXT_PUBLIC_PI_SANDBOX=true)**
   - Uses REAL Pi SDK from https://sdk.minepi.com/pi-sdk.js
   - SDK initialized with `{ version: "2.0", sandbox: true }`
   - Callbacks triggered by actual Pi Network events
   - Requires testing in Pi Browser app
   - Backend uses sandbox-api.minepi.com

3. **Production (Vercel deployed with NEXT_PUBLIC_PI_SANDBOX=false)**
   - Uses REAL Pi SDK from https://sdk.minepi.com/pi-sdk.js
   - SDK initialized with `{ version: "2.0", sandbox: false }`
   - Callbacks triggered by actual Pi Network events
   - Requires testing in Pi Browser app
   - Backend uses api.minepi.com

## Changes Made

### 1. `pages/_document.js`

**Before:**
- Always initialized local mock first
- Checked for real SDK after 100ms intervals
- Detection logic unreliable
- Mock often took precedence even in testnet

**After:**
- Hostname-based detection
- Local mock ONLY for localhost
- Deployed URLs wait for real SDK (10s timeout)
- Clear error messages if SDK fails to load
- Better logging for debugging

### 2. `pages/index.js` and `pages/upgrade.js`

**Enhanced payment callback logging:**
- Added SDK mode detection logging
- Better user feedback messages
- More detailed console logs for debugging
- Consistent error handling

## Environment Configuration

### Local Development

```env
# .env.local
NEXT_PUBLIC_PI_APP_ID=your_app_id
NEXT_PUBLIC_PI_SANDBOX=true  # or false, doesn't matter for localhost
```

Access at: `http://localhost:3000`

### Testnet (Vercel)

```env
# Vercel Environment Variables
NEXT_PUBLIC_PI_APP_ID=your_testnet_app_id
NEXT_PUBLIC_PI_SANDBOX=true
PI_SANDBOX_MODE=true
PI_API_KEY=your_testnet_api_key
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
```

Deploy to: `https://tec-ecosystem.vercel.app` or preview URL

Test in: **Pi Browser app** (download from Pi Network)

### Production (Vercel)

```env
# Vercel Environment Variables  
NEXT_PUBLIC_PI_APP_ID=your_production_app_id
NEXT_PUBLIC_PI_SANDBOX=false
PI_SANDBOX_MODE=false
PI_API_KEY=your_production_api_key
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
```

Deploy to: `https://tec-ecosystem.vercel.app`

Test in: **Pi Browser app** with production credentials

## Testing Guide

### Local Development Testing

1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Console should show: `🧪 Using local mock (localhost development)`
4. Test payment flow - callbacks will fire automatically after 1s and 2s
5. No Pi Browser needed

### Testnet Testing

1. Deploy to Vercel with testnet environment variables
2. Open the deployed URL in **Pi Browser app**
3. Console should show: `✅ Real Pi SDK loaded successfully`
4. Console should show: `🔧 Sandbox mode: true`
5. Test payment flow:
   - Click "Pay with Pi"
   - Pi wallet modal opens in Pi Browser
   - Approve payment in Pi wallet
   - Callbacks fire when you approve (`onReadyForServerApproval`)
   - Callbacks fire when transaction confirms (`onReadyForServerCompletion`)
6. Backend logs should show approval and completion API calls

### Production Testing

Same as testnet, but:
- Use production environment variables
- `NEXT_PUBLIC_PI_SANDBOX=false`
- Console shows: `🔧 Sandbox mode: false`
- Real Pi cryptocurrency is used (not testnet Pi)

## Debugging

### Console Logs to Check

**SDK Initialization:**
```
🌐 Pi SDK Config: { appId: '...', sandbox: true/false }
🔍 Environment detection: { hostname: '...', shouldUseRealSDK: true/false }
```

**Local Mock Mode (localhost only):**
```
🧪 Using local mock (localhost development)
✅ Local Pi mock ready
```

**Real SDK Mode (deployed URLs):**
```
⏳ Waiting for real Pi SDK to load (testnet/production)...
✅ Real Pi SDK loaded successfully (attempt X)
📱 Initializing with App ID: ...
🔧 Sandbox mode: true/false
✅ Pi SDK initialized successfully
```

**Payment Flow:**
```
✅ Payment ready for approval: payment_xxx
🔧 SDK Mode: Real Pi SDK (or Local Mock)
📡 Calling /api/payments/approve for: payment_xxx
✅ Payment approved successfully
✅ Payment ready for completion: payment_xxx txid_xxx
📡 Calling /api/payments/complete for: payment_xxx
✅ Payment completed successfully
```

### Common Issues

**Issue: "Pi SDK failed to load after 10 seconds"**
- **Cause**: Pi SDK script not loading, network error, or not in Pi Browser
- **Solution**: Check network, ensure in Pi Browser for testnet/prod, verify script URL

**Issue: "Payment Expired" timeout**
- **Cause**: Callbacks not firing, backend not receiving approval call
- **Solution**: Check console for SDK mode, verify callbacks registered, check backend logs

**Issue: Local mock used in testnet**
- **Cause**: Hostname detection issue
- **Solution**: Verify deployed URL contains 'vercel.app' or 'tec-ecosystem'

**Issue: Callbacks fire but backend errors**
- **Cause**: Backend API key issue, wrong API URL
- **Solution**: Check PI_API_KEY, verify PI_SANDBOX_MODE matches NEXT_PUBLIC_PI_SANDBOX

## Technical Details

### Why Hostname Detection?

We use hostname detection instead of environment variables because:
1. `NEXT_PUBLIC_*` variables are embedded at build time
2. Same build can be deployed to multiple environments (preview, production)
3. Hostname is always accurate and reflects actual deployment environment
4. Simple and reliable: localhost = mock, deployed = real SDK

### Why Not Just Environment Variables?

Using only `NEXT_PUBLIC_PI_SANDBOX` was problematic because:
1. Value is fixed at build time
2. Can't change behavior after deployment
3. Preview deployments might have wrong value
4. Hard to test different modes without rebuilding

### Callback Flow

```
User Action (Pi Browser)
    ↓
Pi Network Backend
    ↓
Pi SDK (client-side)
    ↓
onReadyForServerApproval callback
    ↓
Our backend: /api/payments/approve
    ↓
Pi Network API: POST /v2/payments/{id}/approve
    ↓
User confirms transaction
    ↓
onReadyForServerCompletion callback
    ↓
Our backend: /api/payments/complete
    ↓
Pi Network API: POST /v2/payments/{id}/complete
```

## Future Improvements

1. **Better error handling**: Retry logic if SDK fails to load
2. **Fallback modes**: Graceful degradation if SDK unavailable
3. **Analytics**: Track SDK load times and success rates
4. **Testing**: Automated E2E tests with real Pi testnet
5. **Documentation**: Video guide for testnet testing in Pi Browser

## Related Files

- `pages/_document.js` - SDK initialization logic
- `pages/index.js` - Demo payment flow
- `pages/upgrade.js` - Subscription payment flow
- `lib/config/pi-api.js` - Backend API URL selection
- `pages/api/payments/approve.js` - Backend approval endpoint
- `pages/api/payments/complete.js` - Backend completion endpoint

## References

- [Pi Network Developer Portal](https://developers.minepi.com/)
- [Pi SDK Documentation](https://github.com/pi-apps/pi-platform-docs)
- [Pi Browser App](https://minepi.com/pi-browser)
