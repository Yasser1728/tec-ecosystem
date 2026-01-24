# 🔐 Pi Network Environment Variables - Complete Setup Guide

## Overview

This guide explains all Pi Network environment variables required for TEC Ecosystem, how to obtain them, and how to configure them properly.

---

## 📋 Required Environment Variables

### 1. NEXT_PUBLIC_PI_APP_ID

**Description:** Your Pi Network application identifier  
**Required:** ✅ Yes (both sandbox and production)  
**Format:** `app-name-hash` (e.g., `tec-titan-elite-commerce-04d84accdca2487c`)  
**Visibility:** Public (accessible in browser)

**How to get it:**
1. Go to [Pi Developer Portal](https://developers.minepi.com)
2. Create or select your app
3. Copy the App ID from the app dashboard

**Example:**
```env
NEXT_PUBLIC_PI_APP_ID=tec-titan-elite-commerce-04d84accdca2487c
```

---

### 2. NEXT_PUBLIC_PI_SANDBOX

**Description:** Enable/disable sandbox mode for testing  
**Required:** ✅ Yes  
**Format:** `true` or `false`  
**Visibility:** Public (accessible in browser)

**When to use:**
- `true`: Development and testing (no real Pi transactions)
- `false`: Production mode (real Pi transactions)

**Example:**
```env
# For development/testing
NEXT_PUBLIC_PI_SANDBOX=true

# For production
NEXT_PUBLIC_PI_SANDBOX=false
```

---

### 3. PI_SANDBOX_MODE

**Description:** Server-side flag for sandbox mode  
**Required:** ✅ Yes  
**Format:** `true` or `false`  
**Visibility:** Private (server-side only)

**Should match:** `NEXT_PUBLIC_PI_SANDBOX`

**Example:**
```env
PI_SANDBOX_MODE=true
```

---

### 4. PI_API_KEY

**Description:** Pi Network API key for server-side operations  
**Required:** ✅ Yes (for production), Optional (for sandbox)  
**Format:** Starts with `pi_` (production) or `sandbox_pi_` (sandbox)  
**Visibility:** Private (server-side only) - **NEVER expose to browser**

**How to get it:**
1. Go to [Pi Developer Portal](https://developers.minepi.com)
2. Select your app
3. Navigate to: **API Keys** or **Credentials**
4. Click **Generate API Key** or **Create New Key**
5. Copy the key immediately (it may only be shown once)

**Security:** 🔐 Keep this secret! Never commit to git or expose in client-side code.

**Example:**
```env
# Sandbox
PI_API_KEY=sandbox_pi_1234567890abcdef1234567890abcdef

# Production
PI_API_KEY=pi_1234567890abcdef1234567890abcdef
```

---

### 5. PI_VALIDATION_KEY

**Description:** Validation key for Pi Platform to verify your app  
**Required:** ✅ Yes (for production), Optional (for sandbox)  
**Format:** Long alphanumeric string  
**Visibility:** Public (served via `/validation-key.txt`)

**How to get it:**
1. Go to [Pi Developer Portal](https://developers.minepi.com)
2. Select your app
3. Navigate to: **Settings** → **Validation Key**
4. Copy the validation key

**What it's used for:**
- Pi Platform calls `https://your-domain.com/validation-key.txt` to verify your app
- The endpoint must return this key as plain text

**Example:**
```env
PI_VALIDATION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

### 6. PI_SANDBOX_ID

**Description:** Sandbox environment identifier  
**Required:** ✅ Yes (for sandbox), Not needed (for production)  
**Format:** Alphanumeric string  
**Visibility:** Private (server-side only)

**How to get it:**
1. Go to [Pi Developer Portal](https://developers.minepi.com)
2. Select your app
3. Enable **Sandbox Mode**
4. Navigate to: **Sandbox Settings**
5. Copy the Sandbox ID

**Example:**
```env
PI_SANDBOX_ID=sandbox_12345abcde67890
```

---

### 7. PI_API_SECRET (Optional but Recommended)

**Description:** Secret key for enhanced API security  
**Required:** ⚠️ Optional (but recommended for production)  
**Format:** Long alphanumeric string  
**Visibility:** Private (server-side only) - **NEVER expose**

**How to get it:**
1. Go to [Pi Developer Portal](https://developers.minepi.com)
2. Select your app
3. Navigate to: **API Keys** or **Credentials**
4. Copy the API Secret (generated alongside API Key)

**Security:** 🔐 Keep this secret!

**Example:**
```env
PI_API_SECRET=secret_1234567890abcdef1234567890abcdef
```

---

### 8. PI_WALLET_ADDRESS (Optional)

**Description:** Your Pi wallet address for receiving payments  
**Required:** ❌ Optional  
**Format:** Pi wallet address  
**Visibility:** Can be public or private

**How to get it:**
1. Open Pi Browser
2. Go to your Pi Wallet
3. Copy your wallet address

**Example:**
```env
PI_WALLET_ADDRESS=GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

---

### 9. NEXT_PUBLIC_PI_NETWORK (Optional)

**Description:** Which Pi Network to use  
**Required:** ❌ Optional  
**Format:** `testnet` or `mainnet`  
**Default:** `testnet`

**Example:**
```env
NEXT_PUBLIC_PI_NETWORK=testnet
```

---

## 🎯 Configuration Examples

### Local Development (.env.local)

```env
# Pi Network - Sandbox Mode
NEXT_PUBLIC_PI_APP_ID=tec-titan-elite-commerce-04d84accdca2487c
NEXT_PUBLIC_PI_SANDBOX=true
PI_SANDBOX_MODE=true
PI_SANDBOX_ID=sandbox_12345abcde67890

# Optional for sandbox
PI_API_KEY=sandbox_pi_1234567890abcdef
PI_API_SECRET=sandbox_secret_1234567890abcdef
PI_VALIDATION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Production (Vercel Environment Variables)

```env
# Pi Network - Production Mode
NEXT_PUBLIC_PI_APP_ID=tec-titan-elite-commerce-04d84accdca2487c
NEXT_PUBLIC_PI_SANDBOX=false
PI_SANDBOX_MODE=false

# Required for production
PI_API_KEY=pi_1234567890abcdef1234567890abcdef
PI_API_SECRET=secret_1234567890abcdef1234567890abcdef
PI_VALIDATION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Optional
PI_WALLET_ADDRESS=GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
NEXT_PUBLIC_PI_NETWORK=mainnet
```

---

## 🔧 Setup Instructions

### For Vercel Deployment

1. **Open Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Select your project: `tec-ecosystem`

2. **Navigate to Environment Variables:**
   - Click: **Settings** → **Environment Variables**

3. **Add Each Variable:**
   - Click **Add New**
   - Enter the name (e.g., `PI_API_KEY`)
   - Enter the value
   - Select environments:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

4. **Save and Redeploy:**
   - Click **Save**
   - Go to **Deployments**
   - Click **Redeploy** on the latest deployment

### For Local Development

1. **Create `.env.local` file:**
   ```bash
   touch .env.local
   ```

2. **Copy from `.env.example`:**
   ```bash
   cp .env.example .env.local
   ```

3. **Fill in your values:**
   - Edit `.env.local`
   - Replace placeholder values with your actual credentials

4. **Restart development server:**
   ```bash
   npm run dev
   ```

---

## ✅ Verification Checklist

### Sandbox Mode
- [ ] `NEXT_PUBLIC_PI_APP_ID` is set
- [ ] `NEXT_PUBLIC_PI_SANDBOX=true`
- [ ] `PI_SANDBOX_MODE=true`
- [ ] `PI_SANDBOX_ID` is set
- [ ] Can authenticate in Pi Browser
- [ ] Can create test payments

### Production Mode
- [ ] `NEXT_PUBLIC_PI_APP_ID` is set
- [ ] `NEXT_PUBLIC_PI_SANDBOX=false`
- [ ] `PI_SANDBOX_MODE=false`
- [ ] `PI_API_KEY` is set (production key)
- [ ] `PI_VALIDATION_KEY` is set
- [ ] Validation key is accessible at `/validation-key.txt`
- [ ] Can authenticate in Pi Browser
- [ ] Can create real payments

---

## 🆘 Troubleshooting

### Error: "Validation key not configured"

**Problem:** `PI_VALIDATION_KEY` is missing or not set

**Solution:**
1. Get key from Pi Developer Portal
2. Add to environment variables
3. Redeploy (Vercel) or restart dev server (local)

### Error: "Pi Network not configured properly"

**Problem:** One or more required environment variables are missing

**Solution:**
1. Check console logs for which variables are missing
2. Verify all required variables are set
3. Ensure values are not placeholders (e.g., `your_key_here`)

### Error: "Invalid API Key"

**Problem:** API key is incorrect or for wrong environment

**Solution:**
1. Verify you're using sandbox key for sandbox mode
2. Verify you're using production key for production mode
3. Check for typos or extra spaces
4. Regenerate key in Pi Developer Portal if needed

### Warning: "Optional Pi config missing"

**Problem:** Recommended but optional variables are missing

**Solution:**
- This is just a warning
- Add `PI_API_SECRET` and `PI_WALLET_ADDRESS` for enhanced functionality
- System will work without them

---

## 📚 Related Documentation

- [PI_SANDBOX_SETUP.md](./PI_SANDBOX_SETUP.md) - Sandbox activation guide
- [PI_NETWORK_SETUP.md](./PI_NETWORK_SETUP.md) - General Pi integration
- [docs/PI_INTEGRATION.md](./docs/PI_INTEGRATION.md) - Technical integration details
- [Pi Developer Docs](https://developers.minepi.com/docs) - Official Pi documentation

---

## 🔐 Security Best Practices

1. **Never commit secrets to git:**
   - `.env.local` is in `.gitignore`
   - Never commit production keys

2. **Use different keys for different environments:**
   - Sandbox keys for development
   - Production keys for production only

3. **Rotate keys periodically:**
   - Regenerate API keys every 3-6 months
   - Update in all environments

4. **Limit key exposure:**
   - Only `NEXT_PUBLIC_*` variables are exposed to browser
   - Server-side variables remain private

5. **Monitor usage:**
   - Check Pi Developer Portal for API usage
   - Watch for unauthorized access attempts

---

**Last Updated:** January 24, 2026  
**Status:** ✅ Complete and verified  
**Priority:** 🔴 Critical - Required for Pi payments to work
