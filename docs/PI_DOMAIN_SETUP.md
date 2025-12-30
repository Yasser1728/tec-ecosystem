# Pi Domain Setup Guide

## 🎯 Overview

This guide explains how to connect your 24 .pi domains to the TEC Ecosystem application.

---

## 📋 How It Works

### User Experience:

```
User types in Pi Browser:
life.pi
  ↓
Pi Network DNS resolves:
life.pi → tec-ecosystem.vercel.app
  ↓
Middleware detects domain:
hostname = "life.pi"
  ↓
Redirects to:
/life route
  ↓
User sees:
Life.pi business unit page
```

---

## 🔧 Setup Steps

### Step 1: Pi Developer Portal Configuration

1. **Go to:** https://develop.pi
2. **Login** with your Pi account
3. **Navigate to:** Apps → Your App
4. **Add Domains:**

```
For each of the 24 domains:

Domain: life.pi
App URL: https://tec-ecosystem.vercel.app
Redirect Path: /life

Domain: fundx.pi
App URL: https://tec-ecosystem.vercel.app
Redirect Path: /fundx

Domain: explorer.pi
App URL: https://tec-ecosystem.vercel.app
Redirect Path: /explorer

... (repeat for all 24 domains)
```

---

### Step 2: Domain List

Copy-paste this configuration for all 24 domains:

#### Financial Services

```
life.pi → /life
insure.pi → /insure
assets.pi → /assets
fundx.pi → /fundx
nbf.pi → /nbf
```

#### Premium Services

```
vip.pi → /vip
elite.pi → /elite
titan.pi → /titan
epic.pi → /epic
legend.pi → /legend
```

#### Commerce

```
commerce.pi → /commerce
ecommerce.pi → /ecommerce
estate.pi → /estate
```

#### Technology

```
explorer.pi → /explorer
dx.pi → /dx
nx.pi → /nx
system.pi → /system
analytics.pi → /analytics
alert.pi → /alert
nexus.pi → /nexus
```

#### Specialized

```
connection.pi → /connection
brookfield.pi → /brookfield
zone.pi → /zone
```

#### Hub

```
tec.pi → /tec
```

---

### Step 3: Verify Configuration

After adding all domains in Pi Developer Portal:

1. **Open Pi Browser**
2. **Type:** `life.pi`
3. **Expected:** Opens TEC Ecosystem → Life page
4. **Repeat** for all 24 domains

---

## 🎨 User Flow Examples

### Example 1: Direct Domain Access

```
User action: Types "fundx.pi" in Pi Browser
Result: Opens FundX investment page directly
URL shown: fundx.pi
Actual page: /fundx route in TEC Ecosystem
```

### Example 2: Navigation Within Domain

```
User action: On fundx.pi, clicks "Calculator"
Result: Opens /fundx/calculator
URL shown: fundx.pi/calculator
Actual page: /fundx/calculator route
```

### Example 3: Cross-Domain Navigation

```
User action: On fundx.pi, clicks "Explore Other Units"
Result: Opens /ecosystem page
URL shown: fundx.pi/ecosystem
User can: Navigate to other business units
```

---

## 🔍 Technical Details

### Middleware Logic

The application uses Next.js middleware to detect .pi domains:

```javascript
// middleware.js
export async function middleware(request) {
  const hostname = request.headers.get("host");

  // Check if it's a .pi domain
  if (hostname.endsWith(".pi")) {
    // Get the target route
    const route = getDomainRoute(hostname);

    // Rewrite to the correct route
    if (pathname === "/") {
      url.pathname = route;
      return NextResponse.rewrite(url);
    }
  }
}
```

### Domain Mapping

All domains are mapped in `lib/domainMapping.js`:

```javascript
export const domainMapping = {
  "life.pi": {
    route: "/life",
    businessUnit: "life",
    name: "Life",
    category: "Specialized",
  },
  // ... 23 more domains
};
```

---

## 🧪 Testing

### Local Testing

Since .pi domains only work in Pi Browser, for local testing:

1. **Use regular routes:**

   ```
   http://localhost:3000/life
   http://localhost:3000/fundx
   ```

2. **Simulate domain in code:**
   ```javascript
   // In your component
   const domain = "life.pi"; // Simulate
   const info = getDomainInfo(domain);
   ```

### Production Testing

1. **Deploy to Vercel**
2. **Configure domains in Pi Developer Portal**
3. **Test in Pi Browser:**
   ```
   life.pi
   fundx.pi
   explorer.pi
   ... (all 24)
   ```

---

## 📊 Domain Status Dashboard

Visit `/domains` to see all 24 domains with:

- ✅ Status indicators
- 🎯 Priority tiers
- 📂 Categories
- 🔗 Direct links

---

## 🎯 Benefits

### For Users:

```
✅ Easy to remember (life.pi vs tec-ecosystem.com/life)
✅ Direct access to specific services
✅ Professional branding
✅ Native Pi Network experience
```

### For You:

```
✅ Premium domain portfolio
✅ Strong brand identity
✅ Increased domain value
✅ Better SEO in Pi ecosystem
✅ Competitive advantage
```

---

## 🔐 Security

### Domain Verification

Pi Network verifies domain ownership through:

1. **Pi Account:** Must own the domain in Pi Network
2. **App Verification:** App must be verified by Pi
3. **DNS Configuration:** Proper DNS setup required

### Protection Measures

- ✅ Enable 2FA on Pi account
- ✅ Keep domain ownership certificates
- ✅ Monitor domain status regularly
- ✅ Backup configuration settings

---

## 🚀 Next Steps

### Immediate:

- [ ] Configure all 24 domains in Pi Developer Portal
- [ ] Test each domain in Pi Browser
- [ ] Verify routing works correctly

### Short Term:

- [ ] Add domain-specific branding
- [ ] Optimize each business unit page
- [ ] Add analytics tracking per domain

### Long Term:

- [ ] Consider separate apps for Tier 1 domains
- [ ] Implement domain-specific features
- [ ] Explore domain leasing opportunities

---

## 📞 Support

### Pi Network Support:

- **Developer Portal:** https://develop.pi
- **Documentation:** https://developers.minepi.com
- **Community:** Pi Developer Community

### TEC Ecosystem:

- **Technical:** tech@tec-ecosystem.com
- **Business:** business@tec-ecosystem.com

---

## 📝 Notes

- Domain configuration may take 24-48 hours to propagate
- Test thoroughly in Pi Browser before announcing
- Keep backup of all configuration settings
- Document any issues for Pi Network support

---

**Last Updated:** December 2024  
**Status:** Ready for Configuration  
**Domains:** 24/24 Owned
