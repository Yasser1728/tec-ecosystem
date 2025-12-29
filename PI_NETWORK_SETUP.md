# 🌐 Pi Network Integration Guide

## خطوات ربط TEC مع Pi Network Sandbox

### 1️⃣ التسجيل في Pi Developer Portal

1. **افتح Pi Developer Portal:**
   - رابط: https://developers.minepi.com
   - سجل دخول بحساب Pi Network بتاعك

2. **أنشئ App جديد:**
   - اضغط "Create New App"
   - App Name: `Tec` أو `Titan Elite Commerce`
   - App URL: `https://tec-ecosystem.vercel.app`
   - Description: `24 luxury business domains powered by Pi Network`

3. **فعّل Sandbox Mode:**
   - ✅ Enable Sandbox Mode
   - ده هيخليك تجرب بدون Pi حقيقي

4. **احصل على App ID:**
   - بعد إنشاء الـ App، هتلاقي `App ID`
   - App ID الحالي: `tec-titan-elite-commerce-04d84accdca2487c`
   - Sandbox URL: https://sandbox.minepi.com/app/tec-titan-elite-commerce-04d84accdca2487c

---

### 2️⃣ إضافة Environment Variables

#### في Vercel:

1. **افتح Vercel Dashboard:**
   - https://vercel.com/dashboard
   - اختار مشروع `tec-ecosystem`

2. **روح Settings → Environment Variables:**
   - اضغط "Add New"

3. **أضف المتغيرات دي:**

```bash
# Pi Network App ID (من Developer Portal)
NEXT_PUBLIC_PI_APP_ID=tec-titan-elite-commerce-04d84accdca2487c

# Sandbox Mode (للتجربة)
NEXT_PUBLIC_PI_SANDBOX=true

# Pi API Key (اختياري - للـ backend)
PI_API_KEY=your_api_key_here
```

4. **اختار Environment:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **احفظ واعمل Redeploy:**
   - اضغط "Save"
   - روح Deployments → اضغط "Redeploy"

---

### 3️⃣ التجربة المحلية (Local Development)

1. **أنشئ ملف `.env.local`:**

```bash
# في مجلد المشروع
touch .env.local
```

2. **أضف المتغيرات:**

```bash
# .env.local
NEXT_PUBLIC_PI_APP_ID=tec-titan-elite-commerce-04d84accdca2487c
NEXT_PUBLIC_PI_SANDBOX=true
PI_API_KEY=your_api_key_here

# Database (للتطوير المحلي)
DATABASE_URL=postgresql://user:password@localhost:5432/tec_ecosystem
```

3. **شغّل المشروع:**

```bash
npm run dev
```

4. **افتح في المتصفح:**
   - http://localhost:3000
   - هتشوف Pi Integration section

---

### 4️⃣ اختبار Pi Authentication

#### في Sandbox Mode:

1. **افتح الموقع في أي browser**
2. **اضغط "Authenticate with Pi Network"**
3. **Sandbox هيعمل mock authentication:**
   - Username: `sandbox_user`
   - UID: `sandbox_uid_123`

#### في Pi Browser (Production):

1. **افتح Pi Browser في موبايلك**
2. **اكتب URL: `https://tec-ecosystem.vercel.app`**
3. **اضغط "Authenticate with Pi Network"**
4. **وافق على الـ permissions**

---

### 5️⃣ اختبار Pi Payment

#### في Sandbox Mode:

```javascript
// Payment هيشتغل تلقائياً في sandbox
// مش محتاج Pi حقيقي
```

1. **اضغط "Pay 1 Pi - Demo Payment"**
2. **Sandbox هيعمل simulate للـ payment flow:**
   - ✅ Payment Created
   - ✅ Ready for Approval
   - ✅ Payment Completed

#### في Pi Browser (Production):

1. **اضغط "Pay 1 Pi - Demo Payment"**
2. **Pi Browser هيفتح payment dialog**
3. **أكد الدفع**
4. **انتظر التأكيد من الـ blockchain**

---

### 6️⃣ Backend API Setup (اختياري)

إذا عايز تعمل server-side verification:

1. **أنشئ API endpoint:**

```javascript
// pages/api/pi/verify-payment.js
export default async function handler(req, res) {
  const { paymentId } = req.body;
  
  // Verify with Pi Network API
  const response = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}`,
    {
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`
      }
    }
  );
  
  const payment = await response.json();
  res.json(payment);
}
```

2. **احصل على API Key:**
   - من Pi Developer Portal
   - Settings → API Keys
   - انسخ الـ key

---

### 7️⃣ Testing Checklist

#### ✅ Sandbox Mode:
- [ ] Pi SDK loaded (check browser console)
- [ ] Authentication works
- [ ] Payment dialog appears
- [ ] Payment status updates
- [ ] No real Pi deducted

#### ✅ Production Mode:
- [ ] App registered in Pi Developer Portal
- [ ] Environment variables set in Vercel
- [ ] Works in Pi Browser
- [ ] Real authentication
- [ ] Real payments (test with small amounts)

---

### 8️⃣ Troubleshooting

#### Problem: "Pi SDK not loaded"
**Solution:**
```javascript
// Check if Pi SDK is loaded
if (typeof window !== 'undefined' && window.Pi) {
  console.log('✅ Pi SDK loaded');
} else {
  console.log('❌ Pi SDK not loaded');
}
```

#### Problem: "Invalid App ID"
**Solution:**
- تأكد إن الـ App ID صحيح
- تأكد إن Environment Variables محفوظة في Vercel
- اعمل Redeploy

#### Problem: "Payment not working"
**Solution:**
- تأكد إن Sandbox Mode مفعّل
- تأكد إن الـ payment callbacks موجودة
- شوف الـ browser console للـ errors

---

### 9️⃣ Useful Links

- **Pi Developer Portal:** https://developers.minepi.com
- **Pi SDK Documentation:** https://developers.minepi.com/doc/javascript-sdk
- **Pi Network:** https://minepi.com
- **TEC Ecosystem:** https://tec-ecosystem.vercel.app

---

### 🔟 Environment Variables Summary

```bash
# Required
NEXT_PUBLIC_PI_APP_ID=your_app_id        # من Pi Developer Portal
NEXT_PUBLIC_PI_SANDBOX=true              # للتجربة

# Optional
PI_API_KEY=your_api_key                  # للـ backend verification
NEXT_PUBLIC_PI_API_URL=https://api.minepi.com/v2
```

---

## 🎉 Done!

بعد ما تعمل الخطوات دي، التطبيق هيكون متصل بـ Pi Network وجاهز للاستخدام!

**للتجربة السريعة:**
1. افتح https://tec-ecosystem.vercel.app
2. اضغط "Authenticate with Pi Network"
3. اضغط "Pay 1 Pi - Demo Payment"
4. شوف الـ payment flow

**Sandbox Mode بيخليك تجرب كل حاجة بدون Pi حقيقي!** 🚀
