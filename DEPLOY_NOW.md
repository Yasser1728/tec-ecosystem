# 🚀 دليل النشر الفوري - TEC Ecosystem

## الخطوة 1️⃣: تسجيل الدخول إلى Vercel

```bash
vercel login
```

سيفتح متصفح للمصادقة. اختر GitHub للربط التلقائي.

---

## الخطوة 2️⃣: النشر إلى الإنتاج

```bash
vercel --prod
```

**ملاحظات مهمة:**

- سيسألك عن اسم المشروع: اختر `tec-ecosystem`
- سيسألك عن الإعدادات: اضغط Enter للقبول الافتراضي
- سيستغرق البناء 2-5 دقائق

---

## الخطوة 3️⃣: الحصول على الرابط

بعد النشر، ستحصل على:

```
✅ Production: https://tec-ecosystem.vercel.app
```

---

## الخطوة 4️⃣: إعداد متغيرات البيئة

في لوحة تحكم Vercel:

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروع `tec-ecosystem`
3. Settings → Environment Variables
4. أضف المتغيرات التالية:

```env
# Pi Network Configuration
PI_API_KEY=your_pi_api_key_here
PI_API_SECRET=your_pi_api_secret_here
PI_WALLET_PRIVATE_KEY=your_wallet_private_key_here

# NextAuth Configuration
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
NEXTAUTH_SECRET=generate_random_32_char_string

# Database
DATABASE_URL=postgresql://user:password@host:5432/tec_ecosystem

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

**لتوليد NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

---

## الخطوة 5️⃣: إعداد قاعدة البيانات

### خيار A: Vercel Postgres (موصى به)

1. في لوحة Vercel → Storage → Create Database
2. اختر Postgres
3. انسخ DATABASE_URL تلقائياً
4. شغل Migrations:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### خيار B: Supabase (مجاني)

1. اذهب إلى: https://supabase.com
2. Create New Project
3. انسخ Connection String
4. أضفها كـ DATABASE_URL في Vercel

---

## الخطوة 6️⃣: إعداد الـ 24 نطاق .pi

### في Pi Developer Portal:

1. اذهب إلى: https://develop.pi
2. اختر مشروعك أو أنشئ جديد
3. في قسم Domains، أضف:

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

---

## الخطوة 7️⃣: التحقق من النشر

### اختبار الصفحة الرئيسية:

```bash
curl https://tec-ecosystem.vercel.app
```

### اختبار API:

```bash
curl https://tec-ecosystem.vercel.app/api/business-units
```

### اختبار المصادقة:

افتح في Pi Browser:

```
https://tec-ecosystem.vercel.app/auth/signin
```

---

## الخطوة 8️⃣: مراقبة الأداء

### في Vercel Dashboard:

1. **Analytics**: تتبع الزيارات والأداء
2. **Logs**: مراقبة الأخطاء
3. **Speed Insights**: قياس سرعة التحميل

### أوامر مفيدة:

```bash
# عرض السجلات المباشرة
vercel logs

# عرض قائمة النشرات
vercel ls

# فحص نشر معين
vercel inspect [deployment-url]

# إلغاء نشر
vercel remove [deployment-url]
```

---

## 🎯 قائمة التحقق النهائية

- [ ] تسجيل الدخول إلى Vercel
- [ ] نشر المشروع (`vercel --prod`)
- [ ] إضافة متغيرات البيئة
- [ ] إعداد قاعدة البيانات
- [ ] تشغيل Migrations
- [ ] إضافة الـ 24 نطاق في Pi Portal
- [ ] اختبار الصفحة الرئيسية
- [ ] اختبار المصادقة
- [ ] اختبار 3 نطاقات على الأقل
- [ ] مراجعة السجلات للتأكد من عدم وجود أخطاء

---

## 🆘 حل المشاكل الشائعة

### مشكلة: Build Failed

**الحل:**

```bash
# اختبر البناء محلياً
npm run build

# إذا نجح، أعد النشر
vercel --prod --force
```

### مشكلة: Database Connection Error

**الحل:**

- تحقق من DATABASE_URL في Environment Variables
- تأكد من تشغيل Migrations
- تحقق من IP Whitelist في قاعدة البيانات

### مشكلة: Pi Authentication Not Working

**الحل:**

- تحقق من PI_API_KEY و PI_API_SECRET
- تأكد من NEXTAUTH_URL صحيح
- راجع Pi Developer Portal للتأكد من Redirect URLs

### مشكلة: Domain Not Routing

**الحل:**

- تحقق من إعدادات النطاق في Pi Portal
- انتظر 5-10 دقائق للتحديث
- امسح Cache في Pi Browser

---

## 📞 الدعم

- **Vercel Docs**: https://vercel.com/docs
- **Pi Network Docs**: https://developers.minepi.com
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## ✅ النشر الناجح

عند اكتمال جميع الخطوات، يجب أن يكون لديك:

✅ تطبيق مباشر على Vercel  
✅ 24 نطاق .pi يعمل  
✅ نظام مصادقة Pi Network نشط  
✅ قاعدة بيانات متصلة  
✅ لوحة إدارة متاحة  
✅ جميع وحدات الأعمال قابلة للوصول

**🎉 مبروك! نظام TEC Ecosystem الآن مباشر!**
