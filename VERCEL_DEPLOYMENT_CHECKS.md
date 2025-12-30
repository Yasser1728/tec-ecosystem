# 🚀 Vercel Deployment Checks - دليل كامل

## 📋 نظرة عامة

تم إعداد نظام شامل لفحص الكود قبل النشر على Vercel، يضمن:
- ✅ جودة الكود (Linting)
- ✅ نجاح الاختبارات (Tests)
- ✅ أمان التطبيق (Security)
- ✅ جاهزية البناء (Build)

---

## 🔧 GitHub Actions Workflows المُعدة

### 1️⃣ Build Workflow (`.github/workflows/main.yml`)

**الغرض:** بناء التطبيق والتحقق من نجاح الـ build

**يعمل عند:**
- Push إلى `main` أو `develop`
- Pull Request إلى `main` أو `develop`

**الخطوات:**
- ✅ تثبيت Dependencies
- ✅ توليد Prisma Client
- ✅ بناء Next.js
- ✅ رفع Build Artifacts

---

### 2️⃣ Lint Workflow (`.github/workflows/lint.yml`)

**الغرض:** فحص جودة الكود

**الفحوصات:**
- ✅ ESLint - فحص أخطاء JavaScript/TypeScript
- ✅ Prettier - فحص التنسيق

**الأوامر:**
```bash
npm run lint
npm run format:check
```

---

### 3️⃣ Test Workflow (`.github/workflows/test.yml`)

**الغرض:** تشغيل جميع الاختبارات

**أنواع الاختبارات:**

#### A. Unit Tests (اختبارات الوحدة)
```bash
npm run test:unit
```
- اختبار Functions منفصلة
- اختبار Components
- سريعة جداً

#### B. Integration Tests (اختبارات التكامل)
```bash
npm run test:integration
```
- اختبار APIs
- اختبار Database
- تحتاج PostgreSQL

#### C. E2E Tests (اختبارات شاملة)
```bash
npm run test:playwright
```
- اختبار التطبيق كاملاً
- محاكاة المستخدم
- Playwright

---

### 4️⃣ Security Workflow (`.github/workflows/security.yml`)

**الغرض:** فحص الأمان والثغرات

**الفحوصات:**

#### A. Dependency Audit
```bash
npm audit --audit-level=moderate
```
- فحص ثغرات في npm packages
- تقرير يومي

#### B. Snyk Scan
- فحص متقدم للثغرات
- يحتاج `SNYK_TOKEN` في GitHub Secrets

#### C. CodeQL Analysis
- تحليل الكود من GitHub
- يكتشف ثغرات أمنية محتملة

#### D. Secret Scanning
- TruffleHog للبحث عن API Keys مكشوفة
- يفحص Git history

#### E. License Compliance
- فحص تراخيص المكتبات
- تجنب مشاكل قانونية

---

### 5️⃣ Deployment Checks Workflow (`.github/workflows/deployment-checks.yml`)

**الغرض:** التحقق النهائي قبل النشر

**الخطوات:**
1. ⏳ انتظار جميع الفحوصات
2. ✅ التحقق من package.json
3. ✅ التحقق من Prisma schema
4. ✅ فحص Bundle size
5. ✅ البحث عن TODOs حرجة
6. 🚀 إعطاء إذن النشر أو منعه

---

## 🔐 إعداد GitHub Secrets

### المطلوب في GitHub Repository Settings → Secrets:

```
SNYK_TOKEN=<your_snyk_token>
```

**للحصول على Snyk Token:**
1. اذهب إلى: https://snyk.io
2. أنشئ حساب مجاني
3. Account Settings → API Token
4. انسخ Token
5. أضفه في GitHub Secrets

---

## ⚙️ إعداد Vercel Deployment Checks

### الخطوة 1: ربط GitHub بـ Vercel

1. **Vercel Dashboard** → **Settings** → **Git**
2. تأكد من ربط GitHub Repository

### الخطوة 2: تفعيل Deployment Protection

1. **Vercel Dashboard** → **Settings** → **Deployment Protection**
2. فعّل: **"Require passing checks before deployment"**

### الخطوة 3: اختيار الـ Checks المطلوبة

في Vercel Settings → Deployment Protection:

```
☑ Build
☑ Lint
☑ Tests
☑ Security
☑ Deployment Checks
```

### الخطوة 4: إعداد Branch Protection في GitHub

1. **GitHub Repository** → **Settings** → **Branches**
2. **Add rule** لـ `main` branch:

```
☑ Require status checks to pass before merging
  ☑ Build
  ☑ Lint
  ☑ Tests / unit-tests
  ☑ Tests / integration-tests
  ☑ Tests / e2e-tests
  ☑ Security / dependency-audit
  ☑ Security / codeql-analysis
  ☑ Deployment Checks / deployment-ready

☑ Require branches to be up to date before merging
☑ Require conversation resolution before merging
☐ Require signed commits (اختياري)
☑ Include administrators
```

---

## 🎯 كيف يعمل النظام

### سيناريو 1: Push إلى main

```
1. Developer pushes code to main
   ↓
2. GitHub Actions تشغل:
   - Build ✅
   - Lint ✅
   - Tests ✅
   - Security ✅
   ↓
3. Deployment Checks تنتظر النتائج
   ↓
4. إذا كل شيء نجح ✅:
   → Vercel تبدأ النشر تلقائياً
   
5. إذا فشل أي check ❌:
   → Vercel تمنع النشر
   → Developer يصلح المشكلة
```

### سيناريو 2: Pull Request

```
1. Developer يفتح PR
   ↓
2. GitHub Actions تشغل جميع الفحوصات
   ↓
3. النتائج تظهر في PR:
   ✅ All checks passed
   أو
   ❌ Some checks failed
   ↓
4. لا يمكن Merge إلا بعد نجاح كل الفحوصات
   ↓
5. بعد Merge → النشر التلقائي (إذا نجحت الفحوصات)
```

---

## 📊 مثال على PR مع Checks

```
Pull Request #123: Add new payment feature

Checks:
✅ Build (2m 34s)
✅ Lint (45s)
✅ Tests / unit-tests (1m 12s)
✅ Tests / integration-tests (2m 45s)
✅ Tests / e2e-tests (3m 20s)
✅ Security / dependency-audit (1m 5s)
✅ Security / codeql-analysis (4m 10s)
⚠️ Security / snyk-scan (1 warning)
✅ Deployment Checks / deployment-ready (30s)

Status: Ready to merge ✅
```

---

## 🛠️ الأوامر المحلية (Local Development)

### قبل Push، شغل هذه الأوامر محلياً:

```bash
# 1. Lint
npm run lint
npm run format:check

# 2. Fix linting issues
npm run lint:fix
npm run format

# 3. Tests
npm run test:unit
npm run test:integration
npm run test:playwright

# 4. Security
npm audit
npm audit fix

# 5. Build
npm run build

# 6. All checks
npm run test:all
```

---

## 🚨 حل المشاكل الشائعة

### مشكلة: Build فشل

**الحل:**
```bash
# محلياً
npm run build

# إذا نجح محلياً لكن فشل في CI:
# تحقق من Environment Variables في GitHub Actions
```

### مشكلة: Tests فشلت

**الحل:**
```bash
# شغل Tests محلياً
npm test

# شوف الأخطاء وصلحها
# تأكد من Database متاحة للـ integration tests
```

### مشكلة: Security Audit فشل

**الحل:**
```bash
# شوف الثغرات
npm audit

# حاول الإصلاح التلقائي
npm audit fix

# إذا لم ينفع، حدّث الحزم يدوياً
npm update <package-name>
```

### مشكلة: Vercel لا تنتظر Checks

**الحل:**
1. تأكد من تفعيل "Deployment Protection" في Vercel
2. تحقق من ربط GitHub بشكل صحيح
3. تأكد من وجود `.github/workflows/` في الـ repo

---

## 📈 الفوائد

### للأمان:
- 🔒 منع نشر كود به ثغرات
- 🔐 كشف API Keys مكشوفة
- 🛡️ فحص تراخيص المكتبات

### للجودة:
- ✅ كود نظيف ومنسق
- ✅ اختبارات شاملة
- ✅ بناء ناجح دائماً

### للربحية:
- 💰 تجنب Downtime (تكلفة عالية في Fintech)
- 💰 تقليل Bugs في Production
- 💰 ثقة أكبر من المستخدمين

---

## 🎓 Best Practices

### 1. اكتب Tests لكل Feature جديدة
```javascript
// tests/unit/payment.test.js
describe('Payment', () => {
  it('should process payment successfully', () => {
    // test code
  });
});
```

### 2. استخدم Pre-commit Hooks
```bash
# في package.json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "pre-push": "npm test"
  }
}
```

### 3. راجع Security Reports بانتظام
- يومياً: npm audit
- أسبوعياً: Snyk reports
- شهرياً: CodeQL findings

### 4. حافظ على Dependencies محدثة
```bash
# كل أسبوع
npm outdated
npm update
```

---

## 📞 الدعم

### إذا واجهت مشاكل:

1. **GitHub Actions Logs:**
   - Repository → Actions → اختر Workflow → شوف Logs

2. **Vercel Logs:**
   - Vercel Dashboard → Deployments → اختر Deployment → Logs

3. **Community:**
   - GitHub Discussions
   - Vercel Discord
   - Stack Overflow

---

## ✅ Checklist: هل النظام جاهز؟

- [ ] جميع Workflows موجودة في `.github/workflows/`
- [ ] SNYK_TOKEN مضاف في GitHub Secrets
- [ ] Vercel مربوط بـ GitHub
- [ ] Deployment Protection مفعّل في Vercel
- [ ] Branch Protection مفعّل في GitHub
- [ ] جميع Tests تعمل محلياً
- [ ] npm audit نظيف (أو warnings مقبولة)
- [ ] Build ينجح محلياً
- [ ] Lint يمر بدون أخطاء

---

## 🎉 النتيجة النهائية

بعد إعداد كل شيء:

✅ **لا يمكن نشر كود معطوب**  
✅ **الأمان مضمون**  
✅ **الجودة عالية**  
✅ **الثقة في Production**  
✅ **تقليل التكاليف**  

**🚀 تطبيق احترافي جاهز للإنتاج!**

---

**آخر تحديث:** 29 ديسمبر 2024  
**الحالة:** جاهز للتطبيق  
**الأولوية:** عالية جداً (Fintech/Web3 Apps)
