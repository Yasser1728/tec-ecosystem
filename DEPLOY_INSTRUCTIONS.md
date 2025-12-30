# 🚀 تعليمات النشر - TEC Ecosystem

## ✅ الصفحات جاهزة

تم التأكد من وجود:

- ✅ `/pages/terms.js` - شروط الخدمة
- ✅ `/pages/privacy.js` - سياسة الخصوصية
- ✅ جميع صفحات الـ 24 وحدة عمل

---

## 📋 خطوات النشر (يدوياً)

### الطريقة 1: عبر Vercel Dashboard (الأسهل)

1. **اذهب إلى:** https://vercel.com/dashboard

2. **اضغط على:** "Add New..." → "Project"

3. **اختر:** "Import Git Repository"

4. **الصق رابط GitHub:**

   ```
   https://github.com/Yasser1728/tec-ecosystem
   ```

5. **اضغط:** "Import"

6. **الإعدادات:**
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

7. **Environment Variables - أضف:**

   ```env
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
   PI_API_KEY=your_pi_api_key
   DATABASE_URL=your_database_url
   ```

8. **اضغط:** "Deploy"

9. **انتظر 2-5 دقائق** للبناء والنشر

---

### الطريقة 2: عبر Vercel CLI

إذا كنت تريد استخدام Terminal:

```bash
# 1. تسجيل الدخول (سيفتح متصفح)
vercel login

# 2. النشر
vercel --prod

# 3. اتبع التعليمات:
# - Project name: tec-ecosystem
# - اضغط Enter للإعدادات الافتراضية
```

---

### الطريقة 3: ربط GitHub مباشرة

1. **في Vercel Dashboard:**
   - Settings → Git
   - Connect to GitHub

2. **اختر Repository:**
   - Yasser1728/tec-ecosystem

3. **تفعيل Auto-Deploy:**
   - كل push إلى main سينشر تلقائياً

---

## 🔐 متغيرات البيئة المطلوبة

### الأساسية (Required):

```env
# NextAuth
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
NEXTAUTH_SECRET=<generate_this>

# Pi Network
PI_API_KEY=<from_pi_developer_portal>
PI_API_SECRET=<from_pi_developer_portal>
NEXT_PUBLIC_PI_APP_ID=<your_pi_app_id>

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### لتوليد NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

أو استخدم: https://generate-secret.vercel.app/32

---

## 🗄️ إعداد قاعدة البيانات

### خيار A: Vercel Postgres (موصى به)

1. في Vercel Dashboard → Storage
2. Create Database → Postgres
3. سيتم إضافة DATABASE_URL تلقائياً
4. شغل Migrations:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### خيار B: Supabase (مجاني)

1. https://supabase.com → New Project
2. انسخ Connection String
3. أضفها في Vercel Environment Variables

---

## 🌐 إعداد النطاقات الـ 24

بعد النشر، في **Pi Developer Portal**:

### 1. اذهب إلى: https://develop.pi

### 2. أنشئ/اختر مشروعك

### 3. في قسم Domains، أضف كل نطاق:

```
fundx.pi → https://tec-ecosystem.vercel.app/business-units/fundx
assets.pi → https://tec-ecosystem.vercel.app/business-units/assets
nbf.pi → https://tec-ecosystem.vercel.app/business-units/nbf
insure.pi → https://tec-ecosystem.vercel.app/business-units/insure
vip.pi → https://tec-ecosystem.vercel.app/business-units/vip
elite.pi → https://tec-ecosystem.vercel.app/business-units/elite
titan.pi → https://tec-ecosystem.vercel.app/business-units/titan
epic.pi → https://tec-ecosystem.vercel.app/business-units/epic
legend.pi → https://tec-ecosystem.vercel.app/business-units/legend
commerce.pi → https://tec-ecosystem.vercel.app/business-units/commerce
ecommerce.pi → https://tec-ecosystem.vercel.app/business-units/ecommerce
estate.pi → https://tec-ecosystem.vercel.app/business-units/estate
explorer.pi → https://tec-ecosystem.vercel.app/business-units/explorer
dx.pi → https://tec-ecosystem.vercel.app/business-units/dx
nx.pi → https://tec-ecosystem.vercel.app/business-units/nx
system.pi → https://tec-ecosystem.vercel.app/business-units/system
analytics.pi → https://tec-ecosystem.vercel.app/business-units/analytics
alert.pi → https://tec-ecosystem.vercel.app/business-units/alert
nexus.pi → https://tec-ecosystem.vercel.app/business-units/nexus
life.pi → https://tec-ecosystem.vercel.app/business-units/life
connection.pi → https://tec-ecosystem.vercel.app/business-units/connection
brookfield.pi → https://tec-ecosystem.vercel.app/business-units/brookfield
zone.pi → https://tec-ecosystem.vercel.app/business-units/zone
tec.pi → https://tec-ecosystem.vercel.app
```

**ملاحظة:** استبدل `tec-ecosystem.vercel.app` برابط مشروعك الفعلي

---

## ✅ التحقق من النشر

### 1. اختبار الصفحة الرئيسية:

```
https://your-project.vercel.app
```

### 2. اختبار Terms & Privacy:

```
https://your-project.vercel.app/terms
https://your-project.vercel.app/privacy
```

### 3. اختبار API:

```
https://your-project.vercel.app/api/business-units
```

### 4. اختبار المصادقة:

```
https://your-project.vercel.app/auth/signin
```

---

## 🎯 قائمة التحقق

- [ ] نشر المشروع على Vercel
- [ ] إضافة جميع متغيرات البيئة
- [ ] إعداد قاعدة البيانات
- [ ] تشغيل Prisma Migrations
- [ ] إضافة الـ 24 نطاق في Pi Portal
- [ ] اختبار `/terms` و `/privacy`
- [ ] اختبار المصادقة
- [ ] اختبار 3 وحدات عمل على الأقل
- [ ] مراجعة Logs للتأكد من عدم وجود أخطاء

---

## 🆘 حل المشاكل

### Build Failed؟

```bash
# اختبر محلياً
npm run build

# إذا نجح، أعد النشر
vercel --prod --force
```

### Database Connection Error؟

- تحقق من DATABASE_URL
- تأكد من تشغيل Migrations
- تحقق من IP Whitelist

### Pi Authentication لا يعمل؟

- تحقق من PI_API_KEY
- راجع Redirect URLs في Pi Portal
- تأكد من NEXTAUTH_URL صحيح

---

## 📞 الدعم

- **Vercel:** https://vercel.com/docs
- **Pi Network:** https://developers.minepi.com
- **Next.js:** https://nextjs.org/docs

---

## 🎉 بعد النشر الناجح

ستحصل على:

- ✅ رابط مباشر: `https://your-project.vercel.app`
- ✅ SSL تلقائي (HTTPS)
- ✅ CDN عالمي
- ✅ Auto-scaling
- ✅ Analytics مدمج

**مبروك! 🎊**
