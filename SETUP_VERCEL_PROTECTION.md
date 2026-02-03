# 🚀 إعداد Vercel Deployment Protection - دليل خطوة بخطوة

## 📋 ما هو Deployment Protection؟

**Deployment Protection** في Vercel يمنع:

- ❌ نشر كود معطوب تلقائياً
- ❌ deployment بدون اجتياز tests
- ❌ production bugs

**ويضمن:**

- ✅ كل GitHub Checks تنجح قبل النشر
- ✅ جودة عالية في Production
- ✅ ثقة كاملة في كل deployment

---

## 🎯 الخطوة 1: فتح Vercel Dashboard

### 1️⃣ افتح المتصفح واذهب إلى:

```
https://vercel.com/dashboard
```

### 2️⃣ سجل دخول بحساب GitHub

### 3️⃣ اختر مشروع **tec-ecosystem**

إذا لم يكن موجود، اضغط **"Add New..."** → **"Project"** وimport من GitHub

---

## 🎯 الخطوة 2: فتح Project Settings

### 1️⃣ في صفحة المشروع:

اضغط على **"Settings"** (في أعلى الصفحة)

### 2️⃣ في Sidebar الأيسر، اختر:

```
Git
```

---

## 🎯 الخطوة 3: تفعيل Deployment Protection

### في صفحة Git Settings:

#### 1️⃣ ابحث عن قسم **"Deployment Protection"**

أو **"Checks"** أو **"Status Checks"**

#### 2️⃣ فعّل الخيار:

```
☑ Enable Deployment Protection
```

أو

```
☑ Require passing checks before deployment
```

#### 3️⃣ اختر الـ Checks المطلوبة:

```
☑ Build
☑ Lint
☑ Tests / unit-tests
☑ Tests / integration-tests
☑ Tests / e2e-tests
☑ Tests / test-summary
☑ Security / dependency-audit
☑ Security / codeql-analysis
☑ Deployment Checks / deployment-ready
```

⚠️ **ملاحظة:** Checks تظهر فقط بعد أول run في GitHub Actions!

#### 4️⃣ اضغط **"Save"**

✅ **تم!** Deployment Protection مفعّل

---

## 🎯 الخطوة 4: إعداد Production Branch

### في نفس صفحة Git Settings:

#### 1️⃣ ابحث عن **"Production Branch"**

#### 2️⃣ تأكد من أنه:

```
main
```

#### 3️⃣ فعّل:

```
☑ Auto-deploy only production branch
```

هذا يضمن أن فقط `main` branch ينشر تلقائياً

---

## 🎯 الخطوة 5: إعداد Preview Deployments

### في نفس الصفحة:

#### 1️⃣ ابحث عن **"Preview Deployments"**

#### 2️⃣ اختر:

```
● All branches (موصى به للتطوير)
```

أو

```
● Only production branch
```

#### 3️⃣ فعّل:

```
☑ Run checks on preview deployments
```

هذا يشغل Checks حتى على PRs

---

## 🎯 الخطوة 6: إعداد Environment Variables

### 1️⃣ في Sidebar، اختر:

```
Environment Variables
```

### 2️⃣ تأكد من وجود المتغيرات المطلوبة:

#### Production Environment:

```
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
NEXTAUTH_SECRET=<your_secret>
PI_API_KEY=<your_pi_key>
PI_API_SECRET=<your_pi_secret>
NEXT_PUBLIC_PI_APP_ID=<your_app_id>
DATABASE_URL=<your_database_url>
NEXT_PUBLIC_PI_SANDBOX=false
```

#### Preview Environment:

```
NEXTAUTH_URL=https://preview-tec-ecosystem.vercel.app
NEXTAUTH_SECRET=<your_secret>
PI_API_KEY=<sandbox_key>
PI_API_SECRET=<sandbox_secret>
NEXT_PUBLIC_PI_APP_ID=<sandbox_app_id>
DATABASE_URL=<test_database_url>
NEXT_PUBLIC_PI_SANDBOX=true
```

### 3️⃣ لإضافة متغير جديد:

1. اضغط **"Add New"**
2. املأ:
   ```
   Name: NEXTAUTH_SECRET
   Value: [your secret]
   Environment: Production, Preview, Development
   ```
3. اضغط **"Save"**

---

## 🎯 الخطوة 7: إعداد Ignored Build Step (اختياري)

### إذا أردت تخطي builds معينة:

#### 1️⃣ في Settings → Git:

ابحث عن **"Ignored Build Step"**

#### 2️⃣ أضف command:

```bash
# مثال: تخطي build إذا التغييرات فقط في docs
git diff HEAD^ HEAD --quiet -- docs/
```

---

## 📊 كيف يعمل النظام

### سيناريو 1: Push إلى main

```
1. Developer pushes to main
   ↓
2. GitHub Actions تشتغل:
   - Build ✅
   - Lint ✅
   - Tests ✅
   - Security ✅
   ↓
3. Vercel تنتظر النتائج ⏳
   ↓
4. إذا كل شيء نجح ✅:
   → Vercel تبدأ Deployment
   → Production يتحدث

5. إذا فشل أي check ❌:
   → Vercel تمنع Deployment
   → Production يبقى آمن
```

### سيناريو 2: Pull Request

```
1. Developer يفتح PR
   ↓
2. GitHub Actions تشتغل
   ↓
3. Vercel تنشئ Preview Deployment
   ↓
4. Preview URL يظهر في PR:
   https://tec-ecosystem-git-feature-branch.vercel.app
   ↓
5. يمكن اختبار التغييرات قبل Merge
```

---

## 🎯 الخطوة 8: اختبار Deployment Protection

### جرب الآن:

#### 1️⃣ عدل ملف بسيط:

```bash
git checkout -b test-deployment
echo "// Test deployment protection" >> pages/index.js
git add .
git commit -m "test: Deployment protection"
git push origin test-deployment
```

#### 2️⃣ افتح Pull Request في GitHub

#### 3️⃣ شاهد في PR:

```
Checks:
⏳ Build — In progress
⏳ Lint — In progress
⏳ Tests — In progress

Vercel:
⏳ Waiting for checks to pass...
```

#### 4️⃣ بعد نجاح Checks:

```
Checks:
✅ All checks passed

Vercel:
✅ Preview deployment ready
🔗 https://tec-ecosystem-git-test-deployment.vercel.app
```

#### 5️⃣ Merge PR

#### 6️⃣ شاهد Production Deployment:

```
Vercel Dashboard:
⏳ Waiting for checks...
✅ Checks passed
🚀 Deploying to production...
✅ Deployment complete!
```

---

## 🎓 Best Practices

### 1. استخدم Preview Deployments:

```
كل PR = Preview URL
→ اختبر قبل Merge
→ شارك مع الفريق
→ QA testing
```

### 2. Environment Variables منفصلة:

```
Production → Real API keys
Preview → Sandbox keys
Development → Local keys
```

### 3. راقب Deployment Logs:

```
Vercel Dashboard → Deployments → Logs
```

### 4. استخدم Deployment Hooks:

```
Settings → Git → Deploy Hooks
→ Webhook عند كل deployment
→ إشعارات Slack/Discord
```

---

## 🆘 حل المشاكل

### مشكلة: Vercel لا تنتظر Checks

**الحل:**

1. تأكد من تفعيل "Deployment Protection"
2. تحقق من ربط GitHub بشكل صحيح
3. تأكد من وجود `.github/workflows/` في repo
4. انتظر 5 دقائق وجرب مرة أخرى

### مشكلة: Deployment فشل رغم نجاح Checks

**الحل:**

1. راجع Vercel Logs
2. تحقق من Environment Variables
3. تأكد من Build Command صحيح:
   ```
   npm run build
   ```
4. تحقق من Output Directory:
   ```
   .next
   ```

### مشكلة: Preview Deployment لا يعمل

**الحل:**

1. Settings → Git → Preview Deployments
2. تأكد من "All branches" مفعّل
3. تحقق من Branch name patterns

### مشكلة: Environment Variables مفقودة

**الحل:**

1. Settings → Environment Variables
2. تأكد من اختيار Environment الصحيح:
   - Production
   - Preview
   - Development
3. أعد deploy بعد إضافة variables

---

## 📊 مثال على Deployment ناجح

### في Vercel Dashboard:

```
Deployment #123
Status: ✅ Ready

Checks:
✅ Build (2m 15s)
✅ Lint (45s)
✅ Tests (5m 30s)
✅ Security (3m 0s)
✅ Deployment Checks (30s)

Build Time: 2m 34s
Deploy Time: 45s
Total: 3m 19s

URL: https://tec-ecosystem.vercel.app
```

---

## 🔔 إعداد Notifications (اختياري)

### 1️⃣ في Settings → Notifications:

```
☑ Email notifications
☑ Deployment failed
☑ Deployment succeeded
☐ Deployment started (كثير جداً)
```

### 2️⃣ Slack Integration:

1. Settings → Integrations
2. ابحث عن "Slack"
3. اضغط "Add"
4. اختر Slack workspace
5. اختر channel
6. اختر events:
   ```
   ☑ Deployment failed
   ☑ Deployment succeeded
   ```

### 3️⃣ Discord Webhook:

1. Discord Server → Settings → Integrations → Webhooks
2. Create Webhook
3. انسخ URL
4. Vercel → Settings → Git → Deploy Hooks
5. الصق Webhook URL

---

## ✅ Checklist

- [ ] فتحت Vercel Dashboard
- [ ] اخترت مشروع tec-ecosystem
- [ ] فتحت Settings → Git
- [ ] فعّلت "Deployment Protection"
- [ ] اخترت جميع Checks المطلوبة
- [ ] تأكدت من Production Branch = main
- [ ] فعّلت Preview Deployments
- [ ] أضفت Environment Variables
- [ ] **أضفت GitHub Actions Secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID) (جديد)**
- [ ] اختبرت بـ PR تجريبي
- [ ] Deployment Protection يعمل ✅
- [ ] **Vercel check يظهر في GitHub Actions (جديد)**

---

## 🔧 GitHub Actions Integration (إضافة جديدة)

### الهدف: ظهور Vercel كـ Required Check في PRs

تم إضافة job جديد في `.github/workflows/main.yml` يستخدم `vercel-action` لنشر التطبيق مباشرة من GitHub Actions.

### الفوائد:

- ✅ Vercel يظهر كـ check في كل PR
- ✅ يمكن إضافته كـ required check في Branch Protection
- ✅ URL مؤقت يظهر مباشرة في Workflow
- ✅ توحيد كل Checks في مكان واحد

### الخطوات السريعة:

#### 1. احصل على Vercel Tokens:
```
https://vercel.com/account/tokens
→ Create Token → Full Access
```

#### 2. احصل على Project/Org IDs:
```
https://vercel.com/dashboard
→ Settings → General
→ انسخ Project ID و Org/Team ID
```

#### 3. أضف Secrets في GitHub:
```
Repository Settings → Secrets → Actions
→ New repository secret

VERCEL_TOKEN=<your_token>
VERCEL_ORG_ID=<your_org_id>
VERCEL_PROJECT_ID=<your_project_id>
```

#### 4. اختبر:
```
افتح PR جديد → Actions → شاهد vercel-deploy job
```

### 🔄 Token Rotation

**مهم للأمان - استبدل Tokens كل 90 يوم:**

1. احذف Token القديم: https://vercel.com/account/tokens
2. أنشئ Token جديد
3. حدّث في GitHub Secrets: Repository → Settings → Secrets → VERCEL_TOKEN → Update
4. اختبر بـ PR تجريبي

### 📚 المزيد من المعلومات

راجع `VERCEL_DEPLOYMENT_CHECKS.md` للدليل الكامل.

---

## 🎉 النتيجة

**الآن لديك:**

- ✅ حماية كاملة للـ Production
- ✅ لا يمكن نشر كود معطوب
- ✅ Preview لكل PR
- ✅ Environment Variables منظمة
- ✅ Notifications تلقائية
- ✅ ثقة 100% في Deployments
- ✅ **Vercel check في GitHub Actions (جديد)**

**🚀 نظام نشر احترافي!**

---

**آخر تحديث:** 3 فبراير 2026 (إضافة GitHub Actions Integration)  
**الوقت المتوقع:** 20-25 دقيقة  
**الصعوبة:** متوسط ⭐⭐
