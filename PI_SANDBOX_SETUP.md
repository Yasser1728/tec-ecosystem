# 🧪 تفعيل Pi Sandbox Mode - دليل كامل

## 📍 ما هو Sandbox Mode؟

**Sandbox Mode** هو بيئة اختبار من Pi Network تسمح لك بـ:

- ✅ اختبار التطبيق بدون Pi حقيقي
- ✅ محاكاة المدفوعات
- ✅ اختبار المصادقة
- ✅ تطوير بدون مخاطر

---

## 🎯 الخطوة 6: تفعيل Sandbox في Pi Developer Portal

### 1️⃣ الدخول إلى Pi Developer Portal

**افتح Pi Browser وانتقل إلى:**

```
https://develop.pi
```

أو:

```
https://developers.minepi.com
```

---

### 2️⃣ اختيار/إنشاء التطبيق

1. **إذا كان لديك تطبيق:**
   - اذهب إلى **"My Apps"**
   - اختر **"TEC Ecosystem"** (أو اسم تطبيقك)

2. **إذا لم يكن لديك تطبيق:**
   - اضغط **"Create New App"**
   - املأ المعلومات:
     ```
     App Name: TEC Ecosystem
     App Type: Web Application
     Category: Business & Finance
     ```

---

### 3️⃣ تفعيل Sandbox Mode

#### في صفحة التطبيق:

**الطريقة A: من Settings**

1. اذهب إلى **"Settings"** أو **"App Settings"**
2. ابحث عن قسم **"Development Mode"** أو **"Sandbox"**
3. ستجد خيار:
   ```
   ☐ Enable Sandbox Mode
   ```
4. **فعّل الخيار:** ✅ Enable Sandbox Mode
5. اضغط **"Save"** أو **"Update"**

**الطريقة B: من Dashboard**

1. في لوحة التحكم الرئيسية للتطبيق
2. ابحث عن **"Environment"** أو **"Mode"**
3. اختر:
   ```
   ○ Production
   ● Sandbox (Development)
   ```
4. احفظ التغييرات

---

### 4️⃣ الحصول على Sandbox Credentials

بعد تفعيل Sandbox، ستحصل على:

```
Sandbox API Key: sandbox_pi_xxxxxxxxxxxxxxxxxx
Sandbox API Secret: sandbox_secret_xxxxxxxxxxxxxxxxxx
Sandbox App ID: sandbox_app_xxxxxxxxxxxxxxxxxx
```

⚠️ **مهم:** هذه مختلفة عن Production credentials!

---

### 5️⃣ إضافة Sandbox Credentials في Vercel

#### في Vercel Dashboard:

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروع **tec-ecosystem**
3. اذهب إلى: **Settings** → **Environment Variables**
4. أضف/حدّث المتغيرات:

```env
# Pi Network Sandbox Configuration
NEXT_PUBLIC_PI_SANDBOX=true
PI_SANDBOX_MODE=true

# Sandbox API Credentials
PI_API_KEY=sandbox_pi_xxxxxxxxxxxxxxxxxx
PI_API_SECRET=sandbox_secret_xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_PI_APP_ID=sandbox_app_xxxxxxxxxxxxxxxxxx

# Sandbox URLs (اختياري)
PI_API_URL=https://api.minepi.com/v2
PI_SANDBOX_API_URL=https://sandbox-api.minepi.com/v2
```

5. اضغط **"Save"**
6. **أعد نشر التطبيق** (Redeploy)

---

### 6️⃣ تحديث الكود للـ Sandbox

#### تحقق من ملف `pages/api/auth/[...nextauth].js`:

```javascript
const isPiSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

export default NextAuth({
  providers: [
    {
      id: "pi",
      name: "Pi Network",
      type: "oauth",
      authorization: {
        url: isPiSandbox
          ? "https://sandbox-api.minepi.com/v2/oauth/authorize"
          : "https://api.minepi.com/v2/oauth/authorize",
        params: {
          scope: "username payments",
          client_id: process.env.NEXT_PUBLIC_PI_APP_ID,
        },
      },
      token: {
        url: isPiSandbox
          ? "https://sandbox-api.minepi.com/v2/oauth/token"
          : "https://api.minepi.com/v2/oauth/token",
      },
      // ... باقي الإعدادات
    },
  ],
});
```

---

### 7️⃣ اختبار Sandbox Mode

#### A. اختبار المصادقة:

1. افتح في Pi Browser:

   ```
   https://tec-ecosystem.vercel.app/auth/signin
   ```

2. اضغط **"Sign in with Pi Network"**

3. **في Sandbox Mode:**
   - ستظهر شاشة محاكاة
   - يمكنك استخدام حساب اختبار
   - لن يُخصم Pi حقيقي

#### B. اختبار الدفع:

```javascript
// في الكود
const payment = await Pi.createPayment({
  amount: 1,
  memo: "Test Payment",
  metadata: { test: true },
});

// في Sandbox:
// - سيظهر نافذة دفع وهمية
// - يمكنك "الدفع" بدون Pi حقيقي
// - ستحصل على payment ID للاختبار
```

---

## 🔄 التبديل بين Sandbox و Production

### للتطوير (Sandbox):

```env
NEXT_PUBLIC_PI_SANDBOX=true
PI_API_KEY=sandbox_pi_xxx
```

### للإنتاج (Production):

```env
NEXT_PUBLIC_PI_SANDBOX=false
PI_API_KEY=pi_xxx (production key)
```

---

## 📋 Checklist: تفعيل Sandbox

### في Pi Developer Portal:

- [ ] تسجيل الدخول إلى https://develop.pi
- [ ] فتح/إنشاء تطبيق TEC Ecosystem
- [ ] الذهاب إلى Settings
- [ ] تفعيل "Enable Sandbox Mode" ✅
- [ ] حفظ التغييرات
- [ ] نسخ Sandbox API Key
- [ ] نسخ Sandbox API Secret
- [ ] نسخ Sandbox App ID

### في Vercel:

- [ ] فتح Settings → Environment Variables
- [ ] إضافة `NEXT_PUBLIC_PI_SANDBOX=true`
- [ ] إضافة `PI_SANDBOX_MODE=true`
- [ ] إضافة Sandbox API Key
- [ ] إضافة Sandbox API Secret
- [ ] إضافة Sandbox App ID
- [ ] حفظ المتغيرات
- [ ] إعادة النشر (Redeploy)

### الاختبار:

- [ ] فتح التطبيق في Pi Browser
- [ ] اختبار تسجيل الدخول
- [ ] اختبار دفعة وهمية
- [ ] التحقق من Logs
- [ ] التأكد من عدم خصم Pi حقيقي

---

## 🎯 مثال: كيف يبدو Sandbox في Pi Portal

### قبل التفعيل:

```
┌─────────────────────────────────┐
│ TEC Ecosystem                   │
├─────────────────────────────────┤
│ Status: Production              │
│ Mode: Live                      │
│ Sandbox: ☐ Disabled             │
└─────────────────────────────────┘
```

### بعد التفعيل:

```
┌─────────────────────────────────┐
│ TEC Ecosystem                   │
├─────────────────────────────────┤
│ Status: Development             │
│ Mode: Sandbox                   │
│ Sandbox: ☑ Enabled              │
│                                 │
│ Sandbox Credentials:            │
│ API Key: sandbox_pi_xxx         │
│ App ID: sandbox_app_xxx         │
└─────────────────────────────────┘
```

---

## 🆘 حل المشاكل

### مشكلة: لا أجد خيار Sandbox

**الحل:**

1. تأكد من أنك في صفحة التطبيق الصحيحة
2. ابحث في:
   - Settings
   - Configuration
   - Development Settings
   - App Mode
3. إذا لم تجده، قد يكون باسم:
   - "Test Mode"
   - "Development Mode"
   - "Sandbox Environment"

### مشكلة: Sandbox لا يعمل

**الحل:**

1. تحقق من `NEXT_PUBLIC_PI_SANDBOX=true` في Vercel
2. تأكد من استخدام Sandbox API Keys
3. أعد نشر التطبيق بعد تغيير المتغيرات
4. امسح Cache في Pi Browser

### مشكلة: "Invalid API Key" في Sandbox

**الحل:**

1. تأكد من نسخ Sandbox API Key (وليس Production)
2. تحقق من عدم وجود مسافات زائدة
3. تأكد من أن Sandbox مفعّل في Pi Portal
4. جرب إعادة توليد API Keys

---

## 📊 الفرق بين Sandbox و Production

| الميزة        | Sandbox | Production |
| ------------- | ------- | ---------- |
| Pi حقيقي      | ❌ لا   | ✅ نعم     |
| اختبار آمن    | ✅ نعم  | ❌ لا      |
| مدفوعات وهمية | ✅ نعم  | ❌ لا      |
| بيانات حقيقية | ❌ لا   | ✅ نعم     |
| للتطوير       | ✅ نعم  | ❌ لا      |
| للمستخدمين    | ❌ لا   | ✅ نعم     |

---

## 🎓 نصائح مهمة

### 1. استخدم Sandbox دائماً للتطوير

```bash
# في .env.local (للتطوير المحلي)
NEXT_PUBLIC_PI_SANDBOX=true
```

### 2. لا تخلط بين Credentials

```
❌ خطأ: استخدام Production Key مع Sandbox Mode
✅ صح: استخدام Sandbox Key مع Sandbox Mode
```

### 3. اختبر كل شيء في Sandbox أولاً

- المصادقة
- المدفوعات
- Webhooks
- النطاقات

### 4. انتقل إلى Production فقط عند الجاهزية

```
✅ كل الاختبارات نجحت في Sandbox
✅ لا توجد أخطاء
✅ المستخدمون جاهزون
→ الآن يمكن التبديل إلى Production
```

---

## 📞 الدعم

### Pi Network Sandbox Support:

- **Docs:** https://developers.minepi.com/docs/sandbox
- **Email:** support@minepi.com
- **Community:** Pi Developer Forum

### TEC Ecosystem:

- **GitHub:** https://github.com/Yasser1728/tec-ecosystem
- **Issues:** Report bugs in GitHub Issues

---

## ✅ الخلاصة

بعد تفعيل Sandbox Mode:

✅ يمكنك اختبار التطبيق بأمان  
✅ لن يُخصم Pi حقيقي  
✅ يمكنك محاكاة جميع العمليات  
✅ بيئة آمنة للتطوير  
✅ جاهز للانتقال إلى Production لاحقاً

**🎉 الآن يمكنك التطوير والاختبار بحرية!**

---

**آخر تحديث:** 6 فبراير 2026  
**الحالة:** جاهز للتطبيق  
**الأولوية:** عالية جداً (مطلوب قبل الإطلاق)

---

## 📝 Testnet Environment Configuration (English)

### Required Environment Variables for Testnet

When deploying to testnet/sandbox environment, ensure the following environment variables are configured:

#### Required Variables:

```env
# Pi Network Sandbox/Testnet Mode
NEXT_PUBLIC_PI_SANDBOX=true
PI_SANDBOX_MODE=true

# Pi Network API URLs
PI_SANDBOX_API_URL=https://sandbox-api.minepi.com/v2
PI_API_URL=https://api.minepi.com/v2

# Pi Network Credentials
NEXT_PUBLIC_PI_APP_ID=tec-titan-elite-commerce-04d84accdca2487c
PI_API_KEY=your_sandbox_pi_api_key_here

# App URL (Production/Testnet)
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
```

### How Environment Variables are Used:

1. **`NEXT_PUBLIC_PI_SANDBOX=true`** and **`PI_SANDBOX_MODE=true`**:
   - These flags enable sandbox/testnet mode
   - When enabled, the app uses sandbox API URLs instead of production
   - Both should be set to `true` for testnet deployment

2. **`PI_SANDBOX_API_URL`** and **`PI_API_URL`**:
   - Define the base URLs for Pi Network API calls
   - `PI_SANDBOX_API_URL`: Used when sandbox mode is enabled
   - `PI_API_URL`: Used for production/mainnet mode
   - The payment system automatically selects the correct URL

3. **`NEXTAUTH_URL`**:
   - Must be set to your deployed app URL: `https://tec-ecosystem.vercel.app`
   - **Critical**: This must match the URL configured in Pi Developer Portal
   - Incorrect URL will cause authentication and payment failures

### Testnet vs Production:

| Configuration | Testnet/Sandbox | Production/Mainnet |
|--------------|-----------------|-------------------|
| `NEXT_PUBLIC_PI_SANDBOX` | `true` | `false` |
| `PI_SANDBOX_MODE` | `true` | `false` |
| API Base URL | `https://sandbox-api.minepi.com/v2` | `https://api.minepi.com/v2` |
| App URL | `https://tec-ecosystem.vercel.app` | `https://tec-ecosystem.vercel.app` |
| Real Pi Tokens | ❌ No (simulated) | ✅ Yes (real) |
| Payment Testing | ✅ Safe testing | ⚠️ Real transactions |

### Important Notes:

1. **URL Consistency**: The app URL configured in Vercel environment variables **must exactly match** the URL in Pi Developer Portal settings.

2. **API Key**: Use the sandbox API key from Pi Developer Portal when in testnet mode.

3. **Redeployment**: After changing environment variables in Vercel, always redeploy the application for changes to take effect.

4. **Local Development**: For local development, use `http://localhost:3000` and set `NEXT_PUBLIC_PI_SANDBOX=true` in your `.env.local` file.

### Verification Checklist:

- [ ] `NEXT_PUBLIC_PI_SANDBOX=true` set in Vercel
- [ ] `PI_SANDBOX_MODE=true` set in Vercel
- [ ] `PI_SANDBOX_API_URL=https://sandbox-api.minepi.com/v2` set in Vercel
- [ ] `PI_API_URL=https://api.minepi.com/v2` set in Vercel
- [ ] `NEXTAUTH_URL=https://tec-ecosystem.vercel.app` set in Vercel
- [ ] App URL in Pi Developer Portal matches Vercel deployment URL
- [ ] Application redeployed after environment variable changes
- [ ] Sandbox mode enabled in Pi Developer Portal
