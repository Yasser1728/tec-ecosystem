# 🌐 دليل إعداد Pi Portal - Complete Setup Guide

## 📍 نظرة عامة

هذا الدليل يشرح كيفية إعداد الـ 24 نطاق .pi في Pi Developer Portal وربطها بتطبيق TEC Ecosystem.

---

## 🎯 المتطلبات الأساسية

### قبل البدء، تأكد من:

- ✅ حساب Pi Network نشط
- ✅ تطبيق TEC Ecosystem منشور على Vercel
- ✅ رابط النشر جاهز (مثال: `https://tec-ecosystem.vercel.app`)
- ✅ Pi API Key و Secret جاهزين

---

## 📋 الخطوة 1: الوصول إلى Pi Developer Portal

### 1.1 فتح Pi Browser

افتح **Pi Browser** على هاتفك (متوفر في تطبيق Pi Network)

### 1.2 الذهاب إلى Developer Portal

```
https://develop.pi
```

أو:

```
https://developers.minepi.com
```

### 1.3 تسجيل الدخول

- استخدم حساب Pi Network الخاص بك
- وافق على الأذونات المطلوبة

---

## 📋 الخطوة 2: إنشاء/اختيار التطبيق

### 2.1 إذا كان لديك تطبيق موجود:

1. اذهب إلى **"My Apps"**
2. اختر تطبيقك أو أنشئ جديد
3. اضغط على اسم التطبيق للدخول

### 2.2 إذا كنت تنشئ تطبيق جديد:

1. اضغط **"Create New App"**
2. املأ المعلومات:

```
App Name: TEC Ecosystem
App Type: Web Application
Category: Business & Finance
Description: 24 luxury business domains powered by Pi Network
```

3. اضغط **"Create"**

---

## 📋 الخطوة 3: إعداد App Settings

### 3.1 Basic Information

```
App Name: TEC Ecosystem
App URL: https://tec-ecosystem.vercel.app
Icon: [رفع شعار TEC]
Description: Comprehensive business ecosystem with 24 independent units
```

### 3.2 OAuth Settings

```
Redirect URIs:
- https://tec-ecosystem.vercel.app/api/auth/callback/pi
- https://tec-ecosystem.vercel.app/auth/callback

Scopes:
☑️ username
☑️ payments
☑️ wallet_address (اختياري)
```

### 3.3 Payment Settings

```
☑️ Enable Pi Payments
Payment Callback URL: https://tec-ecosystem.vercel.app/api/payments/callback
```

---

## 📋 الخطوة 4: الحصول على API Credentials

### 4.1 في قسم "API Keys":

1. اضغط **"Generate API Key"**
2. احفظ المعلومات:

```
API Key: pi_xxxxxxxxxxxxxxxxxx
API Secret: secret_xxxxxxxxxxxxxxxxxx
App ID: app_xxxxxxxxxxxxxxxxxx
```

⚠️ **مهم جداً:** احفظ هذه المعلومات في مكان آمن - لن تظهر مرة أخرى!

### 4.2 إضافتها في Vercel:

اذهب إلى Vercel Dashboard → Settings → Environment Variables:

```env
PI_API_KEY=pi_xxxxxxxxxxxxxxxxxx
PI_API_SECRET=secret_xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_PI_APP_ID=app_xxxxxxxxxxxxxxxxxx
```

---

## 📋 الخطوة 5: إضافة النطاقات الـ 24

### 5.1 الذهاب إلى قسم Domains

في Pi Developer Portal:
1. اختر تطبيقك
2. اذهب إلى **"Domains"** أو **"Pi Domains"**
3. اضغط **"Add Domain"**

### 5.2 إضافة كل نطاق

**ملاحظة:** يجب إضافة كل نطاق على حدة

#### المجموعة 1: Financial Services (الخدمات المالية)

```
Domain: fundx.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/fundx
Description: Investment & Fund Management Platform
```

```
Domain: assets.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/assets
Description: Asset Management Services
```

```
Domain: nbf.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/nbf
Description: National Bank of Finance
```

```
Domain: insure.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/insure
Description: Insurance Services Platform
```

#### المجموعة 2: Premium Tiers (المستويات المميزة)

```
Domain: vip.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/vip
Description: VIP Membership Services
```

```
Domain: elite.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/elite
Description: Elite Tier Membership
```

```
Domain: titan.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/titan
Description: Titan Level Access
```

```
Domain: epic.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/epic
Description: Epic Tier Benefits
```

```
Domain: legend.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/legend
Description: Legend Status Membership
```

#### المجموعة 3: Commerce (التجارة)

```
Domain: commerce.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/commerce
Description: General Commerce Platform
```

```
Domain: ecommerce.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/ecommerce
Description: E-commerce Marketplace
```

```
Domain: estate.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/estate
Description: Real Estate Services
```

#### المجموعة 4: Technology (التكنولوجيا)

```
Domain: explorer.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/explorer
Description: Data Explorer & Analytics
```

```
Domain: dx.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/dx
Description: Developer Experience Platform
```

```
Domain: nx.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/nx
Description: Next Generation Technology
```

```
Domain: system.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/system
Description: System Management Console
```

```
Domain: analytics.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/analytics
Description: Analytics & Insights Platform
```

```
Domain: alert.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/alert
Description: Alert & Notification System
```

```
Domain: nexus.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/nexus
Description: Integration Hub & Nexus
```

#### المجموعة 5: Specialized (المتخصصة)

```
Domain: life.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/life
Description: Lifestyle Services Platform
```

```
Domain: connection.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/connection
Description: Networking & Connections
```

```
Domain: brookfield.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/brookfield
Description: Premium Real Estate by Brookfield
```

```
Domain: zone.pi
Target URL: https://tec-ecosystem.vercel.app/business-units/zone
Description: Zone Management System
```

#### النطاق الرئيسي:

```
Domain: tec.pi
Target URL: https://tec-ecosystem.vercel.app
Description: TEC Ecosystem Main Hub
```

---

## 📋 الخطوة 6: التحقق من النطاقات

### 6.1 في Pi Developer Portal:

بعد إضافة كل نطاق، تحقق من:
- ✅ Status: Active
- ✅ Target URL صحيح
- ✅ لا توجد أخطاء

### 6.2 الاختبار في Pi Browser:

افتح كل نطاق في Pi Browser:

```
fundx.pi
assets.pi
nbf.pi
... (جميع الـ 24)
```

**المتوقع:** يجب أن يفتح كل نطاق الصفحة المخصصة له

---

## 📋 الخطوة 7: إعداد NFT Certificates (اختياري)

### 7.1 لإثبات ملكية النطاقات:

في Pi Developer Portal:
1. اذهب إلى **"NFT Certificates"**
2. اضغط **"Mint Certificate"** لكل نطاق
3. احفظ Token IDs

### 7.2 إضافة NFTs في قاعدة البيانات:

```sql
INSERT INTO "NFT" (userId, domain, tokenId, metadata)
VALUES 
  ('your_user_id', 'fundx.pi', 'token_id_1', '{"verified": true}'),
  ('your_user_id', 'assets.pi', 'token_id_2', '{"verified": true}'),
  -- ... باقي النطاقات
```

---

## 📋 الخطوة 8: إعداد Webhooks (اختياري)

### 8.1 في Pi Developer Portal → Webhooks:

```
Payment Completed:
URL: https://tec-ecosystem.vercel.app/api/webhooks/payment-completed
Events: payment.completed

Payment Cancelled:
URL: https://tec-ecosystem.vercel.app/api/webhooks/payment-cancelled
Events: payment.cancelled

User Approved:
URL: https://tec-ecosystem.vercel.app/api/webhooks/user-approved
Events: user.approved
```

---

## 🎯 قائمة التحقق النهائية

### في Pi Developer Portal:

- [ ] تطبيق TEC Ecosystem منشأ
- [ ] OAuth Settings مُعدة
- [ ] API Keys محفوظة
- [ ] جميع الـ 24 نطاق مضافة
- [ ] كل نطاق Status: Active
- [ ] Payment Settings مُفعلة
- [ ] Webhooks مُعدة (اختياري)
- [ ] NFT Certificates مُصدرة (اختياري)

### في Vercel:

- [ ] PI_API_KEY مضاف
- [ ] PI_API_SECRET مضاف
- [ ] NEXT_PUBLIC_PI_APP_ID مضاف
- [ ] NEXTAUTH_URL صحيح
- [ ] Redirect URIs متطابقة

### الاختبار:

- [ ] فتح tec.pi في Pi Browser
- [ ] اختبار تسجيل الدخول
- [ ] اختبار 3 نطاقات على الأقل
- [ ] اختبار دفعة Pi تجريبية
- [ ] التحقق من Logs

---

## 🆘 حل المشاكل الشائعة

### مشكلة: "Domain not found"

**الحل:**
1. تحقق من كتابة النطاق بشكل صحيح
2. انتظر 5-10 دقائق للتحديث
3. امسح Cache في Pi Browser
4. أعد تشغيل Pi Browser

### مشكلة: "Invalid redirect URI"

**الحل:**
1. تحقق من Redirect URIs في Pi Portal
2. تأكد من NEXTAUTH_URL في Vercel
3. يجب أن تتطابق تماماً (مع/بدون trailing slash)

### مشكلة: "Authentication failed"

**الحل:**
1. تحقق من PI_API_KEY و PI_API_SECRET
2. تأكد من Scopes صحيحة (username, payments)
3. راجع Logs في Vercel

### مشكلة: "Payment not working"

**الحل:**
1. تأكد من تفعيل Pi Payments في Portal
2. تحقق من Payment Callback URL
3. اختبر في Sandbox Mode أولاً

---

## 📊 جدول النطاقات السريع

| # | النطاق | الفئة | الأولوية |
|---|--------|-------|----------|
| 1 | fundx.pi | Financial | عالية |
| 2 | assets.pi | Financial | عالية |
| 3 | nbf.pi | Financial | عالية |
| 4 | insure.pi | Financial | عالية |
| 5 | vip.pi | Premium | عالية |
| 6 | elite.pi | Premium | عالية |
| 7 | titan.pi | Premium | عالية |
| 8 | epic.pi | Premium | متوسطة |
| 9 | legend.pi | Premium | متوسطة |
| 10 | commerce.pi | Commerce | عالية |
| 11 | ecommerce.pi | Commerce | عالية |
| 12 | estate.pi | Commerce | متوسطة |
| 13 | explorer.pi | Technology | متوسطة |
| 14 | dx.pi | Technology | متوسطة |
| 15 | nx.pi | Technology | منخفضة |
| 16 | system.pi | Technology | عالية |
| 17 | analytics.pi | Technology | متوسطة |
| 18 | alert.pi | Technology | متوسطة |
| 19 | nexus.pi | Technology | متوسطة |
| 20 | life.pi | Specialized | منخفضة |
| 21 | connection.pi | Specialized | منخفضة |
| 22 | brookfield.pi | Specialized | متوسطة |
| 23 | zone.pi | Specialized | منخفضة |
| 24 | tec.pi | Main Hub | عالية جداً |

---

## 🎓 نصائح مهمة

### 1. الأولويات:
ابدأ بالنطاقات ذات الأولوية العالية أولاً:
- tec.pi (الرئيسي)
- fundx.pi, assets.pi, nbf.pi (مالية)
- vip.pi, elite.pi (مميزة)
- commerce.pi, ecommerce.pi (تجارة)

### 2. الاختبار:
اختبر كل نطاق فور إضافته قبل الانتقال للتالي

### 3. التوثيق:
احتفظ بسجل لكل نطاق وحالته

### 4. الأمان:
لا تشارك API Keys أبداً

---

## 📞 الدعم

### Pi Network Support:
- **Email:** support@minepi.com
- **Docs:** https://developers.minepi.com/docs

### TEC Ecosystem Support:
- **Email:** support@tec-ecosystem.com
- **GitHub:** https://github.com/Yasser1728/tec-ecosystem/issues

---

## ✅ الخلاصة

بعد إكمال هذا الدليل، سيكون لديك:

✅ تطبيق TEC Ecosystem مسجل في Pi Network  
✅ 24 نطاق .pi نشط ويعمل  
✅ نظام مصادقة Pi متكامل  
✅ نظام دفع Pi جاهز  
✅ Webhooks مُعدة (اختياري)  
✅ NFT Certificates مُصدرة (اختياري)  

**🎉 مبروك! نظامك الآن مباشر على Pi Network!**

---

**آخر تحديث:** 29 ديسمبر 2024  
**الإصدار:** 1.0  
**الحالة:** جاهز للتطبيق
