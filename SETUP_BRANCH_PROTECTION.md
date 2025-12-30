# 🛡️ إعداد Branch Protection - دليل خطوة بخطوة

## 📋 ما هو Branch Protection؟

**Branch Protection** يمنع:

- ❌ Push مباشر إلى `main` بدون مراجعة
- ❌ Merge كود معطوب
- ❌ حذف Branch بالخطأ
- ❌ Force push

**ويضمن:**

- ✅ كل الـ Checks تنجح قبل Merge
- ✅ Code Review إجباري
- ✅ جودة الكود عالية

---

## 🎯 الخطوة 1: فتح Branch Protection Settings

### 1️⃣ افتح GitHub Repository:

```
https://github.com/Yasser1728/tec-ecosystem
```

### 2️⃣ اضغط على **Settings** (في أعلى الصفحة)

⚠️ **ملاحظة:** إذا لم تجد Settings، تأكد من أنك:

- مالك الـ Repository
- أو لديك Admin access

### 3️⃣ في Sidebar الأيسر، اختر:

```
Code and automation → Branches
```

أو اذهب مباشرة إلى:

```
https://github.com/Yasser1728/tec-ecosystem/settings/branches
```

---

## 🎯 الخطوة 2: إضافة Branch Protection Rule

### 1️⃣ في صفحة Branches:

اضغط على **"Add branch protection rule"** أو **"Add rule"**

### 2️⃣ في حقل **"Branch name pattern"**:

اكتب:

```
main
```

هذا يحمي الـ `main` branch

---

## 🎯 الخطوة 3: تفعيل Protection Rules

### ✅ القسم 1: Protect matching branches

#### 1. **Require a pull request before merging** ☑️

فعّل هذا الخيار، ثم:

```
☑ Require approvals
  Number of approvals: 1 (أو أكثر إذا كان فريق)

☐ Dismiss stale pull request approvals (اختياري)
☐ Require review from Code Owners (اختياري)
☐ Restrict who can dismiss pull request reviews (اختياري)
☑ Allow specified actors to bypass (اختياري - لك فقط)
☐ Require approval of the most recent reviewable push
```

---

#### 2. **Require status checks to pass before merging** ☑️ (مهم جداً!)

فعّل هذا الخيار، ثم:

```
☑ Require branches to be up to date before merging
```

**ثم اختر Status Checks المطلوبة:**

اكتب في Search box واختر:

```
☑ Build
☑ Lint / lint
☑ Tests / unit-tests
☑ Tests / integration-tests
☑ Tests / e2e-tests
☑ Tests / test-summary
☑ Security / dependency-audit
☑ Security / codeql-analysis
☑ Security / security-summary
☑ Deployment Checks / deployment-ready
```

⚠️ **ملاحظة:** Status checks تظهر فقط بعد أول run للـ workflows!

---

#### 3. **Require conversation resolution before merging** ☑️

يضمن حل جميع التعليقات في PR قبل Merge

---

#### 4. **Require signed commits** ☐ (اختياري)

للأمان الإضافي - يتطلب GPG signing

---

#### 5. **Require linear history** ☐ (اختياري)

يمنع merge commits - يفرض rebase

---

#### 6. **Require deployments to succeed** ☐ (اختياري)

ينتظر نجاح deployment قبل merge

---

### ✅ القسم 2: Rules applied to everyone

#### 1. **Allow force pushes** ☐ (اتركه مغلق)

Force push خطير - يمكن أن يحذف history

```
☐ Allow force pushes
```

---

#### 2. **Allow deletions** ☐ (اتركه مغلق)

يمنع حذف الـ branch بالخطأ

```
☐ Allow deletions
```

---

### ✅ القسم 3: Additional settings

#### 1. **Do not allow bypassing the above settings** ☑️

حتى Admins يجب أن يتبعوا القواعد

```
☑ Do not allow bypassing the above settings
```

أو إذا أردت استثناء لنفسك:

```
☐ Do not allow bypassing
☑ Allow specified actors to bypass
  → أضف username الخاص بك
```

---

## 🎯 الخطوة 4: حفظ الإعدادات

### في أسفل الصفحة:

اضغط **"Create"** أو **"Save changes"**

✅ **تم!** Branch Protection مفعّل

---

## 📊 كيف يبدو بعد التفعيل

### عند محاولة Push مباشر إلى main:

```bash
git push origin main

# النتيجة:
❌ remote: error: GH006: Protected branch update failed
❌ To https://github.com/Yasser1728/tec-ecosystem.git
❌  ! [remote rejected] main -> main (protected branch hook declined)
```

### الطريقة الصحيحة:

```bash
# 1. أنشئ branch جديد
git checkout -b feature/new-feature

# 2. اعمل تغييراتك
git add .
git commit -m "feat: Add new feature"

# 3. Push للـ branch
git push origin feature/new-feature

# 4. افتح Pull Request في GitHub

# 5. انتظر Checks تنجح

# 6. اطلب Review (إذا مطلوب)

# 7. Merge بعد الموافقة
```

---

## 🎯 الخطوة 5: اختبار Branch Protection

### جرب الآن:

#### 1️⃣ أنشئ branch جديد:

```bash
git checkout -b test-branch-protection
```

#### 2️⃣ عدل ملف بسيط:

```bash
echo "// Test branch protection" >> README.md
git add README.md
git commit -m "test: Branch protection"
git push origin test-branch-protection
```

#### 3️⃣ افتح Pull Request:

1. اذهب إلى GitHub Repository
2. ستظهر رسالة: **"Compare & pull request"**
3. اضغط عليها
4. اكتب عنوان ووصف
5. اضغط **"Create pull request"**

#### 4️⃣ شاهد Checks تعمل:

```
⏳ Build — In progress
⏳ Lint — In progress
⏳ Tests — In progress
⏳ Security — In progress
```

#### 5️⃣ بعد نجاح كل الـ Checks:

```
✅ All checks have passed

[Merge pull request] ← الزر يصبح أخضر
```

#### 6️⃣ اضغط **"Merge pull request"**

✅ **نجح!** Branch Protection يعمل

---

## 📋 الإعدادات الموصى بها

### للمشاريع الصغيرة (1-2 developers):

```
☑ Require pull request (0 approvals)
☑ Require status checks
☑ Require conversation resolution
☐ Require signed commits
☐ Include administrators (يمكنك bypass)
```

### للمشاريع المتوسطة (3-5 developers):

```
☑ Require pull request (1 approval)
☑ Require status checks
☑ Require conversation resolution
☐ Require signed commits
☑ Include administrators
```

### للمشاريع الكبيرة (6+ developers):

```
☑ Require pull request (2 approvals)
☑ Require status checks
☑ Require conversation resolution
☑ Require signed commits
☑ Require Code Owners review
☑ Include administrators
☑ Require linear history
```

---

## 🎓 Best Practices

### 1. حماية branches مهمة أخرى:

```
main → Production
develop → Staging
staging → Pre-production
```

أضف rules لكل واحد

### 2. استخدم CODEOWNERS:

أنشئ ملف `.github/CODEOWNERS`:

```
# Global owners
* @Yasser1728

# Specific paths
/pages/api/ @backend-team
/components/ @frontend-team
/prisma/ @database-team
```

### 3. Status Checks الأساسية:

```
✅ Build (إجباري)
✅ Lint (إجباري)
✅ Tests (إجباري)
✅ Security (موصى به)
```

### 4. راجع Rules بانتظام:

- كل 3 أشهر
- عند إضافة team members جدد
- عند تغيير workflow

---

## 🆘 حل المشاكل

### مشكلة: Status Checks لا تظهر

**الحل:**

1. شغل workflows مرة واحدة على الأقل
2. انتظر 5 دقائق
3. Refresh الصفحة
4. ابحث عن اسم الـ check بالضبط

### مشكلة: لا يمكن Merge رغم نجاح Checks

**الحل:**

- تحقق من "Require branches to be up to date"
- اعمل rebase أو merge من main:
  ```bash
  git checkout feature-branch
  git pull origin main
  git push
  ```

### مشكلة: Admin يريد bypass

**الحل:**

1. Settings → Branches → Edit rule
2. فعّل "Allow specified actors to bypass"
3. أضف username

---

## 📊 مثال على PR محمي

```
Pull Request #123: Add payment feature

Status:
✅ Build (2m 15s)
✅ Lint (45s)
✅ Tests / unit-tests (1m 10s)
✅ Tests / integration-tests (2m 30s)
✅ Tests / e2e-tests (3m 15s)
✅ Security / dependency-audit (1m 0s)
✅ Security / codeql-analysis (4m 0s)
✅ Deployment Checks (30s)

Reviews:
✅ Approved by @reviewer1

Conversations:
✅ All resolved

[Merge pull request] ← أخضر وجاهز
```

---

## ✅ Checklist

- [ ] فتحت Branch Protection Settings
- [ ] أضفت rule لـ `main` branch
- [ ] فعّلت "Require pull request"
- [ ] فعّلت "Require status checks"
- [ ] اخترت جميع Status Checks المطلوبة
- [ ] فعّلت "Require conversation resolution"
- [ ] حفظت الإعدادات
- [ ] اختبرت بـ PR تجريبي
- [ ] كل شيء يعمل ✅

---

## 🎉 النتيجة

**الآن لديك:**

- ✅ حماية كاملة لـ main branch
- ✅ لا يمكن merge كود معطوب
- ✅ Code review إجباري
- ✅ جودة عالية مضمونة
- ✅ تاريخ Git نظيف

**🚀 Repository احترافي!**

---

**آخر تحديث:** 30 ديسمبر 2024  
**الوقت المتوقع:** 10-15 دقيقة  
**الصعوبة:** متوسط ⭐⭐
