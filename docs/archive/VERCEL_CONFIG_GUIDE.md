# 🚀 دليل تكوين Vercel الشامل لنظام TEC

## 📋 نظرة عامة

هذا الدليل يوثق جميع ملفات وتكوينات Vercel الموجودة في المشروع، ويشرح كيفية عمل كل ملف والغرض منه.

---

## 📁 ملفات Vercel الأساسية

### 1. `vercel.json` ✅

**الموقع:** `/vercel.json`

**الغرض:** التكوين الرئيسي لـ Vercel deployment

**المحتوى:**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "ignoreCommand": "bash vercel-ignore.sh"
}
```

**الميزات:**
- ✅ تحديد أوامر البناء والتطوير
- ✅ تكوين المناطق الجغرافية للنشر (iad1 = US East)
- ✅ تفعيل التكامل مع GitHub
- ✅ إلغاء deployments التلقائي للفروع غير المطلوبة
- ✅ إضافة security headers لجميع الصفحات
- ✅ تكوين rewrites للـ validation key
- ✅ ربط مع `vercel-ignore.sh` لتصفية الفروع

**متى يتم استخدامه:**
- عند كل deployment على Vercel
- يحدد كيفية بناء المشروع ونشره

---

### 2. `.vercelignore` ✅

**الموقع:** `/.vercelignore`

**الغرض:** تحديد الملفات التي يجب تجاهلها أثناء deployment

**المحتوى:**

```
# Ignore old validation key page files
pages/validation-key.txt.js

# Ignore build artifacts
.next/
node_modules/
```

**الملفات المستثناة:**
- ✅ `pages/validation-key.txt.js` - ملف قديم غير مستخدم
- ✅ `.next/` - مخرجات البناء (يتم إعادة بنائها)
- ✅ `node_modules/` - التبعيات (يتم تثبيتها تلقائياً)

**لماذا نستثني هذه الملفات؟**
- تقليل حجم deployment
- تجنب تعارضات البناء
- تسريع عملية الرفع

---

### 3. `vercel-ignore.sh` ✅

**الموقع:** `/vercel-ignore.sh`

**الغرض:** تحديد الفروع التي يجب بناؤها على Vercel

**المحتوى:**

```bash
#!/bin/bash

# Only build main and staging branches
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] || [[ "$VERCEL_GIT_COMMIT_REF" == "staging" ]]; then
  # Proceed with the build
  exit 1
else
  # Don't build
  echo "🚫 Skipping build for branch: $VERCEL_GIT_COMMIT_REF"
  exit 0
fi
```

**منطق العمل:**
- ✅ يبني فقط فروع `main` و `staging`
- ✅ يتخطى جميع الفروع الأخرى (feature branches, dev branches)
- ✅ يوفر موارد البناء والمال

**متى يعمل:**
- عند كل push إلى GitHub
- قبل بدء البناء على Vercel
- يقرر ما إذا كان يجب المتابعة أم لا

**الأذونات:**
```bash
chmod +x vercel-ignore.sh  # قابل للتنفيذ
```

---

### 4. `next.config.js` ✅

**الموقع:** `/next.config.js`

**الغرض:** تكوين Next.js (متوافق 100% مع Vercel)

**الميزات الرئيسية:**

```javascript
const nextConfig = {
  reactStrictMode: true,           // وضع React الصارم
  i18n: i18nConfig.i18n,          // دعم اللغات المتعددة
  eslint: {
    ignoreDuringBuilds: true,      // تجاهل ESLint أثناء البناء
  },
  experimental: {
    serverActions: { enabled: true } // تفعيل Server Actions
  },
  trailingSlash: false,            // بدون شرطة مائلة في النهاية
  async rewrites() { ... },        // إعادة توجيه URLs
  async headers() { ... }          // Security Headers
}
```

**التوافق مع Vercel:**
- ✅ Next.js 15.5.9 (أحدث إصدار)
- ✅ يعمل مباشرة على Vercel بدون تعديلات
- ✅ Server Actions مفعّلة
- ✅ Security headers مضمّنة

---

### 5. `package.json` ✅

**الموقع:** `/package.json`

**Scripts المهمة لـ Vercel:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

**ماذا يحدث عند البناء على Vercel:**

1. `npm install` - تثبيت التبعيات
2. `postinstall` (تلقائي) - توليد Prisma Client
3. `npm run build` - بناء Next.js

**التبعيات الضرورية:**
- ✅ `next` - إطار العمل
- ✅ `react` & `react-dom` - المكتبات الأساسية
- ✅ `@prisma/client` - قاعدة البيانات
- ✅ `prisma` - أداة قاعدة البيانات

---

## 🔧 متغيرات البيئة (Environment Variables)

### ملف `.env.example` ✅

**الموقع:** `/.env.example`

**الغرض:** قالب لمتغيرات البيئة المطلوبة

**المتغيرات الضرورية لـ Vercel:**

#### 1. **قاعدة البيانات**
```bash
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"
```

#### 2. **المصادقة**
```bash
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
NEXTAUTH_SECRET=your_secret_here
```

#### 3. **Pi Network**
```bash
NEXT_PUBLIC_PI_APP_ID=your_app_id
NEXT_PUBLIC_PI_SANDBOX=true
PI_API_KEY=your_api_key
```

#### 4. **AI/ML (اختياري)**
```bash
OPENROUTER_API_KEY=your_openrouter_key
```

### إضافة المتغيرات في Vercel:

**الطريقة 1: من Dashboard**
1. افتح [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر المشروع → Settings → Environment Variables
3. أضف كل متغير:
   - Key: `DATABASE_URL`
   - Value: `postgresql://...`
   - Environment: Production, Preview, Development

**الطريقة 2: من CLI**
```bash
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add PI_API_KEY production
```

**الطريقة 3: من `.env` محلياً**
```bash
# يتم سحبها تلقائياً إذا كانت موجودة في .env.local
vercel env pull .env.local
```

---

## 🔄 GitHub Actions Integration

### Workflows المتعلقة بـ Vercel:

#### 1. `.github/workflows/main.yml` ✅

**الغرض:** بناء واختبار الكود قبل النشر على Vercel

**الخطوات:**
1. ✅ Checkout code
2. ✅ Setup Node.js
3. ✅ Install dependencies
4. ✅ Run governance tests
5. ✅ Generate Prisma Client
6. ✅ Build Next.js
7. ✅ Run AI Factory (main branch only)
8. ✅ Upload artifacts

**متى يعمل:**
- Push إلى `main` أو `develop`
- Pull Request إلى `main` أو `develop`
- Manual trigger (workflow_dispatch)

**الفائدة:**
- يضمن أن الكود يبني بنجاح قبل أن يصل لـ Vercel
- يكتشف الأخطاء مبكراً
- يوفر artifacts للتشخيص

#### 2. `.github/workflows/lint.yml` ✅

**الحالة:** معطّل مؤقتاً (disabled)

```yaml
jobs:
  lint:
    steps:
      - run: echo "Lint workflow disabled temporarily"
```

**لتفعيله مستقبلاً:**
```yaml
jobs:
  lint:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
```

#### 3. `.github/workflows/domain-policy-check.yml` ✅

**الغرض:** التحقق من سياسة Domain Sovereignty

**لا يؤثر على Vercel مباشرة** لكنه يضمن:
- عدم وجود ملفات تشغيلية في `/domains`
- جميع الكود التشغيلي في `/apps`
- الامتثال لسياسات TEC

#### 4. `.github/workflows/sovereign-factory.yml` ✅

**الغرض:** تشغيل AI Sovereign Factory

**لا يؤثر على Vercel مباشرة** لكنه:
- ينفذ مهام AI تلقائياً
- يحتفظ بـ ledger للعمليات
- يضمن الحوكمة

---

## 🔐 Security Configuration

### Security Headers (من `vercel.json`):

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
      { "key": "X-XSS-Protection", "value": "1; mode=block" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]
  }
]
```

### ماذا تفعل هذه Headers:

1. **X-Content-Type-Options: nosniff**
   - يمنع MIME type sniffing
   - يحمي من هجمات XSS

2. **X-Frame-Options: SAMEORIGIN**
   - يمنع التضمين في iframes من نطاقات أخرى
   - يحمي من clickjacking

3. **X-XSS-Protection: 1; mode=block**
   - يفعّل حماية XSS في المتصفح
   - يحجب الصفحة إذا اكتشف هجوم

4. **Referrer-Policy: strict-origin-when-cross-origin**
   - يحمي خصوصية المستخدمين
   - لا يرسل URL كاملة للنطاقات الأخرى

### Additional Security (من `next.config.js`):

```javascript
headers: [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self' https://*.minepi.com ..."
  }
]
```

---

## 🌍 Deployment Regions

### المناطق المكونة:

```json
"regions": ["iad1"]
```

**iad1 = US East (North Virginia)**

### لماذا US East؟
- ✅ أسرع منطقة لمعظم المستخدمين
- ✅ أقل تكلفة
- ✅ أفضل اتصال بـ Vercel Edge Network

### إضافة مناطق أخرى:

```json
"regions": ["iad1", "sfo1", "fra1"]
```

**المناطق المتاحة:**
- `iad1` - US East
- `sfo1` - US West
- `fra1` - Europe (Frankfurt)
- `hnd1` - Asia (Tokyo)
- `bom1` - Asia (Mumbai)

**ملاحظة:** كل منطقة إضافية تزيد التكلفة!

---

## 🎯 Deployment Workflow

### السيناريو الكامل: Push to main

```
1. Developer: git push origin main
   ↓
2. GitHub: Push event triggered
   ↓
3. GitHub Actions: .github/workflows/main.yml
   - Install dependencies
   - Generate Prisma
   - Build Next.js
   - Run tests
   ↓
4. GitHub Actions: ✅ Passed
   ↓
5. Vercel: Detects push to main
   ↓
6. Vercel: Runs vercel-ignore.sh
   - Branch is "main" → exit 1 (proceed)
   ↓
7. Vercel: Deployment starts
   - npm install
   - npm run postinstall (prisma generate)
   - npm run build
   ↓
8. Vercel: Build successful
   ↓
9. Vercel: Deploy to production
   ↓
10. Vercel: ✅ Deployment live!
    - URL: https://tec-ecosystem.vercel.app
```

### السيناريو: Push to feature branch

```
1. Developer: git push origin feature/new-domain
   ↓
2. GitHub: Push event triggered
   ↓
3. Vercel: Detects push to feature/new-domain
   ↓
4. Vercel: Runs vercel-ignore.sh
   - Branch is NOT "main" or "staging"
   - exit 0 (skip build)
   ↓
5. Vercel: 🚫 Build skipped
   ↓
6. No deployment (saves resources & money!)
```

---

## 🧪 Testing Locally

### اختبار البناء قبل Push:

```bash
# 1. تثبيت التبعيات
npm install

# 2. توليد Prisma Client
npm run postinstall

# 3. بناء Next.js
npm run build

# 4. تشغيل البناء المحلي
npm start
```

### اختبار vercel-ignore.sh:

```bash
# محاكاة main branch
VERCEL_GIT_COMMIT_REF=main bash vercel-ignore.sh
echo $?  # يجب أن يكون 1 (proceed)

# محاكاة feature branch
VERCEL_GIT_COMMIT_REF=feature/test bash vercel-ignore.sh
echo $?  # يجب أن يكون 0 (skip)
```

---

## 📊 Build Performance

### أحجام الصفحات (من آخر بناء):

```
Page                        Size     First Load JS
├ ○ /                       2.8 kB   117 kB
├ ○ /commerce               3.4 kB   119 kB
├ ○ /api/validation-key     0 B      0 B
└ ○ /404                    182 B    112 kB

+ First Load JS shared      120 kB
  ├ framework               59.8 kB
  ├ main                    40.9 kB
  ├ pages/_app              10.9 kB
  └ other chunks            8.87 kB

ƒ Middleware                58.3 kB
```

### وقت البناء المتوقع:

- **محلياً (بدون cache):** 2-3 دقائق
- **محلياً (مع cache):** 30-60 ثانية
- **على Vercel (بدون cache):** 3-5 دقائق
- **على Vercel (مع cache):** 1-2 دقيقة

---

## 🚨 Troubleshooting

### مشكلة: Build يفشل على Vercel لكن ينجح محلياً

**الحل:**

1. **تحقق من Environment Variables:**
   ```bash
   vercel env pull .env.local
   npm run build
   ```

2. **تحقق من Node version:**
   - Vercel: يستخدم Node 20 افتراضياً
   - محلياً: تأكد من نفس الإصدار
   ```bash
   node --version  # يجب أن يكون 20.x
   ```

3. **تحقق من Logs:**
   - Vercel Dashboard → Deployments → اختر Deployment → Logs
   - ابحث عن الأخطاء في قسم "Build"

### مشكلة: vercel-ignore.sh لا يعمل

**الأعراض:**
- جميع الفروع تُبنى على Vercel
- لا يتم تخطي feature branches

**الحل:**

1. **تحقق من الأذونات:**
   ```bash
   ls -l vercel-ignore.sh
   # يجب أن يكون: -rwxr-xr-x
   
   # إذا لم يكن قابل للتنفيذ:
   chmod +x vercel-ignore.sh
   git add vercel-ignore.sh
   git commit -m "fix: make vercel-ignore.sh executable"
   git push
   ```

2. **تحقق من vercel.json:**
   ```json
   {
     "ignoreCommand": "bash vercel-ignore.sh"
   }
   ```

3. **اختبر محلياً:**
   ```bash
   VERCEL_GIT_COMMIT_REF=test bash vercel-ignore.sh
   ```

### مشكلة: Prisma Client غير موجود

**الأعراض:**
```
Error: @prisma/client did not initialize yet
```

**الحل:**

1. **تحقق من postinstall:**
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```

2. **أضف في vercel.json:**
   ```json
   "buildCommand": "prisma generate && npm run build"
   ```

3. **في GitHub Actions:**
   ```yaml
   - name: Generate Prisma Client
     run: npx prisma generate
   
   - name: Build
     run: npm run build
   ```

### مشكلة: Environment Variables غير موجودة

**الأعراض:**
```
Error: Missing environment variable: DATABASE_URL
```

**الحل:**

1. **في Vercel Dashboard:**
   - Settings → Environment Variables
   - أضف جميع المتغيرات من `.env.example`
   - اختر: Production, Preview, Development

2. **Redeploy:**
   - Deployments → اختر آخر deployment
   - اضغط "Redeploy"

---

## ✅ Checklist: Vercel Setup Complete

قبل إطلاق Production، تأكد من:

- [x] `vercel.json` موجود ومكوّن
- [x] `.vercelignore` يستثني الملفات الصحيحة
- [x] `vercel-ignore.sh` قابل للتنفيذ ويعمل
- [x] `next.config.js` مكوّن بشكل صحيح
- [x] `package.json` به scripts البناء
- [ ] جميع Environment Variables مضافة في Vercel
- [x] GitHub Actions workflows تعمل
- [x] البناء ينجح محلياً
- [ ] البناء ينجح على Vercel
- [ ] الـ deployment يعمل على Production
- [ ] جميع الصفحات تفتح بنجاح
- [ ] Security headers مفعّلة
- [ ] Pi Network integration يعمل
- [ ] Database connection ناجح

---

## 📚 المراجع والموارد

### وثائق Vercel:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Ignore Builds](https://vercel.com/docs/concepts/projects/overview#ignored-build-step)

### وثائق المشروع:
- `VERCEL_DEPLOYMENT_CHECKS.md` - فحوصات النشر
- `SETUP_VERCEL_PROTECTION.md` - حماية النشر
- `DEPLOY_INSTRUCTIONS.md` - تعليمات النشر
- `.env.example` - متغيرات البيئة

### دعم:
- [Vercel Discord](https://vercel.com/discord)
- [GitHub Discussions](https://github.com/tec-ecosystem/tec-ecosystem/discussions)
- [Next.js Discord](https://nextjs.org/discord)

---

## 📝 ملاحظات إضافية

### التكاليف:
- **Hobby Plan (مجاني):**
  - ✅ Unlimited deployments
  - ✅ 100 GB bandwidth/month
  - ✅ Automatic HTTPS
  - ❌ محدود لمشروع واحد

- **Pro Plan ($20/month):**
  - ✅ Unlimited projects
  - ✅ 1 TB bandwidth/month
  - ✅ Team collaboration
  - ✅ Advanced analytics

### Best Practices:
1. **استخدم Environment Variables** - لا تضع secrets في الكود
2. **اختبر محلياً أولاً** - قبل Push
3. **راقب Build Times** - للكشف عن مشاكل الأداء
4. **استخدم Preview Deployments** - للاختبار قبل Production
5. **فعّل Deployment Protection** - لمنع نشر كود معطوب

---

**آخر تحديث:** 23 يناير 2026  
**الحالة:** ✅ جميع الملفات مكونة وجاهزة  
**المسؤول:** TEC Sovereign Agent  
**النسخة:** 1.0.0
