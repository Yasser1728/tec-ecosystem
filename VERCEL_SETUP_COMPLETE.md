# ✅ دليل التحقق من نشر Vercel - TEC Ecosystem

## 📋 نظرة عامة

تم إعداد نظام شامل للتحقق من جاهزية نشر Vercel يتضمن:

- ✅ ملف تكوين `vercel.json` محسّن
- ✅ GitHub Actions workflow للفحص التلقائي
- ✅ فحص بناء Next.js
- ✅ التحقق من المتغيرات البيئية
- ✅ اختبار منطق تصفية الفروع

---

## 🎯 ما تم إضافته

### 1. ملف `vercel.json`

ملف تكوين Vercel الأساسي الذي يحتوي على:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "ignoreCommand": "bash vercel-ignore.sh",
  "headers": [...],
  "rewrites": [...],
  "env": {...}
}
```

**الميزات:**
- ✅ تكوين أمني للـ headers
- ✅ إعادة توجيه `/validation-key.txt` إلى API
- ✅ متغيرات بيئة أساسية
- ✅ تكامل مع vercel-ignore.sh

### 2. GitHub Actions Workflow

ملف `.github/workflows/vercel-deployment-check.yml` الذي يفحص:

#### الفحوصات التلقائية:
1. ✅ **التحقق من vercel.json** - يتأكد من وجود الملف وصحة JSON
2. ✅ **التحقق من vercel-ignore.sh** - يتأكد من وجود السكربت وقابليته للتنفيذ
3. ✅ **اختبار البناء** - يقوم ببناء المشروع بالكامل
4. ✅ **فحص مخرجات البناء** - يتحقق من وجود `.next` والملفات المطلوبة
5. ✅ **التحقق من المتغيرات البيئية** - يفحص `.env.example`
6. ✅ **اختبار منطق الفروع** - يتأكد من أن main و staging يتم بناءهما فقط
7. ✅ **فحص next.config.js** - يتحقق من التكوين
8. ✅ **التحقق من التوثيق** - يبحث عن ملفات التوثيق

---

## 🔄 متى يعمل الـ Workflow

الـ workflow يعمل تلقائياً عند:

```yaml
on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop, staging]
  workflow_dispatch:  # يمكن تشغيله يدوياً
```

---

## ✅ كيفية التحقق من نجاح الإعداد

### في GitHub:

1. اذهب إلى: `https://github.com/tec-ecosystem/tec-ecosystem/actions`
2. ابحث عن workflow: **"Vercel Deployment Check"**
3. تأكد من ظهور علامة ✅ خضراء

### الفحص المحلي:

```bash
# 1. التحقق من vercel.json
jq empty vercel.json && echo "✅ Valid JSON"

# 2. اختبار البناء
npm run build

# 3. اختبار vercel-ignore.sh
export VERCEL_GIT_COMMIT_REF="main"
bash vercel-ignore.sh
# يجب أن يرجع exit code 1 (سيتم البناء)

export VERCEL_GIT_COMMIT_REF="feature/test"
bash vercel-ignore.sh
# يجب أن يرجع exit code 0 (لن يتم البناء)
```

---

## 🚀 خطوات النشر على Vercel

### الطريقة 1: النشر التلقائي (موصى به)

1. **ربط GitHub بـ Vercel:**
   - اذهب إلى: https://vercel.com/dashboard
   - اضغط على "Add New Project"
   - اختر `tec-ecosystem/tec-ecosystem` من GitHub
   - اضغط "Import"

2. **تكوين المشروع:**
   ```
   Framework Preset: Next.js
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

3. **إضافة Environment Variables:**
   انسخ من `.env.example` وأضف:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=...
   PI_API_KEY=...
   PI_API_SECRET=...
   ```

4. **النشر:**
   - Vercel ستبني وتنشر تلقائياً
   - كل push لـ `main` سيتم نشره تلقائياً
   - كل PR ستحصل على preview deployment

### الطريقة 2: النشر اليدوي

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# النشر للإنتاج
vercel --prod
```

---

## 🔐 المتغيرات البيئية المطلوبة في Vercel

### ضرورية للعمل:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Pi Network
NEXT_PUBLIC_PI_APP_ID=your_app_id
PI_API_KEY=your_api_key
PI_API_SECRET=your_api_secret
NEXT_PUBLIC_PI_SANDBOX=true
```

### اختيارية (موصى بها):

```env
# Email
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Forensic Audit
FORENSIC_AUDIT_SECRET=<generate-secret>
SOVEREIGN_EMAIL=yasserrr.fox17@gmail.com
```

---

## 📊 حالة الفحوصات

### الفحوصات الحالية على GitHub:

| Workflow | الحالة | الوصف |
|----------|--------|-------|
| **TEC Sovereign AI Factory & Build** | ✅ | بناء المشروع والاختبارات |
| **Lint** | ✅ | فحص جودة الكود |
| **Vercel Deployment Check** | 🆕 ✅ | التحقق من جاهزية Vercel |
| **Codacy** | ✅ | فحص الأمان والجودة |
| **Domain Policy Check** | ✅ | فحص سياسات النطاقات |
| **Sovereign Factory** | ✅ | مصنع AI السيادي |

---

## 🎯 منطق تصفية الفروع (Branch Filtering)

ملف `vercel-ignore.sh` يحدد متى يتم البناء:

```bash
# ✅ سيتم البناء:
- main branch
- staging branch

# 🚫 لن يتم البناء:
- feature branches
- development branches
- أي فرع آخر
```

هذا يوفر موارد Vercel ويمنع نشر كود غير جاهز.

---

## 🔍 استكشاف الأخطاء

### مشكلة: Build فشل في Vercel

**الحل:**

1. تحقق من logs في Vercel Dashboard
2. شغل البناء محلياً:
   ```bash
   npm run build
   ```
3. تأكد من وجود جميع المتغيرات البيئية

### مشكلة: vercel-ignore.sh لا يعمل

**الحل:**

```bash
# تأكد من أن الملف قابل للتنفيذ
chmod +x vercel-ignore.sh

# اختبر محلياً
export VERCEL_GIT_COMMIT_REF="main"
bash vercel-ignore.sh
```

### مشكلة: Prisma Client لا يعمل

**الحل:**

تأكد من إضافة `postinstall` في `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

---

## 📈 الخطوات التالية

- [x] إنشاء vercel.json
- [x] إنشاء workflow للفحص
- [x] اختبار البناء محلياً
- [ ] ربط المشروع بـ Vercel Dashboard
- [ ] إضافة Environment Variables في Vercel
- [ ] تفعيل Deployment Protection
- [ ] اختبار النشر التلقائي
- [ ] إعداد Custom Domains (24 نطاق .pi)

---

## 🎉 النتيجة

بعد إكمال الإعداد:

✅ **كل push لـ main سيتم نشره تلقائياً على Vercel**  
✅ **الفحوصات تعمل قبل النشر لضمان الجودة**  
✅ **Preview deployments لكل PR**  
✅ **منطق الفروع يوفر الموارد**  
✅ **توثيق شامل للإعداد والصيانة**

---

## 📞 الدعم

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Actions:** https://github.com/tec-ecosystem/tec-ecosystem/actions
- **Issues:** https://github.com/tec-ecosystem/tec-ecosystem/issues

---

**آخر تحديث:** 22 يناير 2026  
**الحالة:** ✅ جاهز للنشر  
**التوثيق:** كامل ومحدّث
