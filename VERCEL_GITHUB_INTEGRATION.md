# 🔗 Vercel GitHub Integration - دليل الربط الكامل

## 📋 نظرة عامة

هذا الدليل يشرح كيفية ربط Vercel بـ GitHub لضمان deployment تلقائي وآمن للـ TEC Ecosystem.

---

## ✅ التحقق من الاتصال الحالي

### الخطوة 1: افحص الـ Repository Settings

```bash
# تحقق من الـ remote
git remote -v
```

يجب أن تشاهد:
```
origin  https://github.com/tec-ecosystem/tec-ecosystem (fetch)
origin  https://github.com/tec-ecosystem/tec-ecosystem (push)
```

### الخطوة 2: تحقق من Vercel Dashboard

1. اذهب إلى: https://vercel.com/dashboard
2. سجل دخول بحساب GitHub
3. ابحث عن مشروع `tec-ecosystem`

---

## 🔧 ربط Vercel بـ GitHub (إذا لم يكن مربوطاً)

### الطريقة 1: من Vercel Dashboard

#### 1️⃣ أضف مشروع جديد:

```
Dashboard → Add New... → Project
```

#### 2️⃣ اختر GitHub Repository:

- اضغط على **"Import Git Repository"**
- ابحث عن `tec-ecosystem/tec-ecosystem`
- اضغط **"Import"**

#### 3️⃣ ضبط الإعدادات:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### 4️⃣ أضف Environment Variables:

**Required Variables:**
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://tec-ecosystem.vercel.app
NEXTAUTH_SECRET=<generate-random-secret>
NEXT_PUBLIC_PI_APP_ID=tec-titan-elite-commerce-04d84accdca2487c
NEXT_PUBLIC_PI_NETWORK=mainnet
NEXT_PUBLIC_PI_SANDBOX=false
PI_API_KEY=<your-pi-api-key>
SOVEREIGN_EMAIL=yasserrr.fox17@gmail.com
FORENSIC_LOGGING_ENABLED=true
APPROVAL_CENTER_ENABLED=true
CIRCUIT_BREAKER_ENABLED=true
```

#### 5️⃣ اضغط **"Deploy"**

---

### الطريقة 2: من GitHub

#### 1️⃣ افتح Repository على GitHub:

```
https://github.com/tec-ecosystem/tec-ecosystem
```

#### 2️⃣ اذهب إلى Settings → Integrations:

```
Settings → Integrations & Services
```

#### 3️⃣ أضف Vercel:

- ابحث عن **"Vercel"**
- اضغط **"Configure"**
- اختر المستودعات التي تريد ربطها
- اضغط **"Save"**

---

## 🎯 تفعيل Deployment Protection

### في Vercel Dashboard:

#### 1️⃣ اذهب إلى Project Settings:

```
Project → Settings → Git
```

#### 2️⃣ فعّل Deployment Protection:

```
☑ Enable Deployment Protection
☑ Require passing checks before deployment
```

#### 3️⃣ اختر Required Checks:

```
☑ Build
☑ Lint
☑ Tests
☑ Security Checks
```

#### 4️⃣ فعّل Auto-deployment:

```
☑ Deploy when changes are pushed to:
  • main (Production)
  • staging (Preview)
  • All other branches (Preview)
```

---

## 🔐 إعداد Environment Variables

### في Vercel Dashboard:

#### 1️⃣ اذهب إلى:

```
Project → Settings → Environment Variables
```

#### 2️⃣ أضف المتغيرات:

**Production:**
```
DATABASE_URL (Secret)
NEXTAUTH_SECRET (Secret)
PI_API_KEY (Secret)
```

**Preview & Development:**
```
Same as Production but with test/sandbox values
```

---

## 🧪 اختبار الاتصال

### 1️⃣ عمل Push جديد:

```bash
# عمل تغيير بسيط
echo "# Test deployment" >> README.md
git add README.md
git commit -m "test: Vercel deployment"
git push origin main
```

### 2️⃣ مراقبة Deployment:

```
Vercel Dashboard → Deployments
```

يجب أن تشاهد:
- ✅ Building
- ✅ Checks Passing
- ✅ Deployment Complete

### 3️⃣ فحص الموقع:

```
https://tec-ecosystem.vercel.app
```

---

## 🚨 حل المشاكل الشائعة

### ❌ المشكلة: "Build Failed"

**الحل:**
```bash
# اختبر البناء محلياً أولاً
npm run build

# إذا نجح محلياً، تحقق من Environment Variables في Vercel
```

---

### ❌ المشكلة: "Database Connection Failed"

**الحل:**
```
1. تحقق من DATABASE_URL في Vercel Environment Variables
2. تأكد من أن قاعدة البيانات تقبل اتصالات من Vercel IPs
3. استخدم Connection Pooling (Prisma Data Proxy أو PgBouncer)
```

---

### ❌ المشكلة: "Pi Network Integration Failed"

**الحل:**
```
1. تأكد من NEXT_PUBLIC_PI_APP_ID صحيح
2. فعّل NEXT_PUBLIC_PI_SANDBOX=false للـ production
3. تأكد من PI_API_KEY موجود وصحيح
```

---

## 📊 مراقبة Deployments

### GitHub Actions:

```bash
# شاهد الـ workflows
https://github.com/tec-ecosystem/tec-ecosystem/actions
```

### Vercel Analytics:

```bash
# شاهد الإحصائيات
Vercel Dashboard → Analytics
```

---

## 🎯 Best Practices

### ✅ استخدم Branch Protection:

```
GitHub → Settings → Branches → Branch protection rules
☑ Require status checks to pass before merging
☑ Require branches to be up to date before merging
```

### ✅ استخدم Preview Deployments:

- كل PR يحصل على preview URL
- اختبر التغييرات قبل الدمج
- شارك الـ preview مع الفريق

### ✅ استخدم Automatic Rollback:

```
Vercel Dashboard → Settings → Git
☑ Enable Instant Rollback
```

---

## 📝 Checklist

- [ ] Vercel مربوط بـ GitHub
- [ ] Environment Variables مضبوطة
- [ ] Deployment Protection مفعّل
- [ ] Auto-deployment شغال
- [ ] Branch Protection مفعّل
- [ ] Preview Deployments تشتغل
- [ ] Production deployment نجح
- [ ] الموقع يفتح على https://tec-ecosystem.vercel.app
- [ ] TEC Assistant شغال
- [ ] Signals API شغال
- [ ] Pi Network Integration شغال

---

## 🆘 الدعم

### إذا واجهت مشكلة:

1. **Vercel Support:** https://vercel.com/support
2. **GitHub Issues:** https://github.com/tec-ecosystem/tec-ecosystem/issues
3. **Documentation:** https://vercel.com/docs

---

**تم التحديث:** 2026-01-22  
**الإصدار:** 1.0  
**الحالة:** ✅ Production Ready
