# مثال عملي لحل التعارضات - Practical Conflict Resolution Example

تاريخ: 2026-01-23

---

## السيناريو / Scenario

لديك Pull Request قديم وتريد دمجه، لكن GitHub يقول:
**"This branch has conflicts that must be resolved"**

You have an old Pull Request you want to merge, but GitHub says:
**"This branch has conflicts that must be resolved"**

---

## الخطوات العملية / Practical Steps

### 1️⃣ التحقق من التعارضات / Check for Conflicts

```bash
# Go to your branch
cd /path/to/tec-ecosystem
git checkout your-pr-branch

# Run the conflict checker
./scripts/check-merge-conflicts.sh
```

**المخرجات المتوقعة / Expected Output:**

```
==================================================
TEC Ecosystem - Merge Conflict Checker
أداة فحص تعارضات الدمج - TEC
==================================================

Checking branch: your-pr-branch
فحص الفرع: your-pr-branch

Fetching latest main branch...
جلب آخر تحديثات main...

Branch Information / معلومات الفرع:
----------------------------------------
Current branch commit / آخر commit: abc1234
Main branch commit / آخر commit في main: def5678
Common ancestor / السلف المشترك: xyz9012

Commits ahead of main / commits متقدمة عن main: 3
Commits behind main / commits متأخرة عن main: 5

Attempting test merge / محاولة دمج تجريبي...

❌ Merge conflicts detected!
❌ تم اكتشاف تعارضات دمج!

Conflicted files / الملفات المتعارضة:
----------------------------------------
  ⚠️  package.json
  ⚠️  pages/api/payments/approve.js
  ⚠️  .env.example

File types with conflicts / أنواع الملفات المتعارضة:
----------------------------------------
  📦 Package file: package.json
     Recommendation: Merge dependencies and run 'npm install'
     توصية: دمج ال dependencies وتشغيل 'npm install'
  
  📜 Code file: pages/api/payments/approve.js
     Recommendation: Review both versions carefully
     توصية: راجع النسختين بعناية
  
  📄 JSON file: .env.example
     Recommendation: Manually merge configurations
     توصية: دمج الإعدادات يدوياً
```

---

### 2️⃣ قراءة الدليل / Read the Guide

```bash
# Open quick reference
cat QUICK_REFERENCE_MERGE_CONFLICTS.md

# Or full guide
cat MERGE_CONFLICT_RESOLUTION_GUIDE.md
```

---

### 3️⃣ حل التعارضات / Resolve Conflicts

#### Method A: GitHub Web UI (للملفات البسيطة / For Simple Files)

1. اذهب إلى PR الخاص بك:
   ```
   https://github.com/tec-ecosystem/tec-ecosystem/pull/YOUR_NUMBER
   ```

2. اضغط على **"Resolve conflicts"**

3. ستجد الملفات المتعارضة مع علامات:
   ```javascript
   <<<<<<< your-branch-name
   // Your code
   const value = "your version";
   =======
   // Main branch code
   const value = "main version";
   >>>>>>> main
   ```

4. احذف العلامات واحتفظ بالكود الصحيح:
   ```javascript
   // Keep the better version or merge both
   const value = "combined version";
   ```

5. اضغط **"Mark as resolved"** لكل ملف

6. اضغط **"Commit merge"**

#### Method B: Command Line (للملفات المعقدة / For Complex Files)

```bash
# Step 1: Merge main into your branch
git checkout your-pr-branch
git merge origin/main
```

**ستحصل على / You'll get:**
```
Auto-merging package.json
CONFLICT (content): Merge conflict in package.json
Auto-merging pages/api/payments/approve.js
CONFLICT (content): Merge conflict in pages/api/payments/approve.js
Auto-merging .env.example
CONFLICT (content): Merge conflict in .env.example
Automatic merge failed; fix conflicts and then commit the result.
```

```bash
# Step 2: Check conflicted files
git status
```

**المخرجات / Output:**
```
On branch your-pr-branch
You have unmerged paths.

Unmerged paths:
  both modified:   package.json
  both modified:   pages/api/payments/approve.js
  both modified:   .env.example
```

---

### 4️⃣ حل كل ملف / Resolve Each File

#### ملف 1: package.json

**افتح الملف وستجد / Open file and you'll see:**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
<<<<<<< HEAD
    "your-package": "^1.0.0"
=======
    "main-package": "^2.0.0"
>>>>>>> origin/main
  }
}
```

**الحل / Solution:**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "your-package": "^1.0.0",
    "main-package": "^2.0.0"
  }
}
```

```bash
# Save the file, then:
npm install
git add package.json package-lock.json
```

---

#### ملف 2: pages/api/payments/approve.js

**الملف المتعارض / Conflicted File:**

```javascript
<<<<<<< HEAD
// Your implementation
export default async function handler(req, res) {
  const { paymentId } = req.body;
  
  // Your approval logic
  const result = await processPayment(paymentId);
  
  res.json({ success: true, result });
}
=======
// Main branch implementation
export default async function handler(req, res) {
  const { paymentId } = req.body;
  
  // Added security check
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // Approval logic
  const result = await processPayment(paymentId);
  
  res.json({ success: true, result });
}
>>>>>>> origin/main
```

**الحل / Solution (Keep main's security check + your logic):**

```javascript
export default async function handler(req, res) {
  const { paymentId } = req.body;
  
  // Keep security check from main (IMPORTANT!)
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // Your approval logic
  const result = await processPayment(paymentId);
  
  res.json({ success: true, result });
}
```

```bash
# Save the file, then:
git add pages/api/payments/approve.js
```

---

#### ملف 3: .env.example

**الملف المتعارض / Conflicted File:**

```
# Database
DATABASE_URL=postgresql://localhost/tec
<<<<<<< HEAD
# Your additions
YOUR_API_KEY=your_key_here
YOUR_SECRET=your_secret_here
=======
# Main additions
MAIN_API_KEY=main_key_here
MAIN_SECRET=main_secret_here
>>>>>>> origin/main
```

**الحل / Solution (Merge both):**

```
# Database
DATABASE_URL=postgresql://localhost/tec

# API Keys
YOUR_API_KEY=your_key_here
YOUR_SECRET=your_secret_here
MAIN_API_KEY=main_key_here
MAIN_SECRET=main_secret_here
```

```bash
# Save the file, then:
git add .env.example
```

---

### 5️⃣ إتمام الدمج / Complete the Merge

```bash
# Commit the merge
git commit -m "Merge main and resolve conflicts

- Merged package.json dependencies
- Combined payment approval with security checks
- Merged environment variables
- All tests passing"

# Push to your PR branch
git push origin your-pr-branch
```

---

### 6️⃣ التحقق / Verification

```bash
# Install dependencies
npm install

# Run tests
npm test

# Expected output:
# ✅ All tests pass

# Build project
npm run build

# Expected output:
# ✅ Build successful

# Run linter
npm run lint

# Expected output:
# ✅ No linting errors
```

---

## النتيجة / Result

### قبل الحل / Before Resolution

```
❌ This branch has conflicts that must be resolved
❌ هذا الفرع لديه تعارضات يجب حلها
```

### بعد الحل / After Resolution

```
✅ This branch has no conflicts with the base branch
✅ All checks passed
✅ Ready to merge

✅ هذا الفرع ليس لديه تعارضات مع الفرع الأساسي
✅ جميع الفحوصات نجحت
✅ جاهز للدمج
```

---

## نصائح من الخبرة / Tips from Experience

### ✅ Best Practices (أفضل الممارسات)

1. **Always keep security updates**
   - احتفظ دائماً بتحديثات الأمان من main
   - In the example above, we kept the admin check

2. **Test before pushing**
   - اختبر قبل الدفع
   - We ran `npm test` and `npm run build`

3. **Merge both additions when possible**
   - ادمج الإضافات من الطرفين عند الإمكان
   - package.json: kept both packages
   - .env.example: kept both variables

4. **Document complex merges**
   - وثّق الدمج المعقد في commit message
   - Explain what was merged and why

### ❌ Common Mistakes (أخطاء شائعة)

1. **Blindly accepting one side**
   - ❌ Don't just choose "Accept Current" or "Accept Incoming"
   - ✅ Review and understand both versions

2. **Forgetting to regenerate files**
   - ❌ Forgetting `npm install` after package.json merge
   - ✅ Always regenerate lock files

3. **Skipping tests**
   - ❌ Pushing without testing
   - ✅ Always test after resolving

4. **Removing security checks**
   - ❌ Deleting security code to resolve conflict
   - ✅ Keep security updates from main

---

## الأدوات المساعدة / Helper Tools

### VS Code Extensions

1. **GitLens** - Shows who changed what
2. **Git Graph** - Visual history
3. **Merge Conflict** - Better conflict UI

### Commands

```bash
# Show only conflicted files
git diff --name-only --diff-filter=U

# Show conflict details
git diff --check

# Keep their version (main's)
git checkout --theirs file.js

# Keep our version (yours)
git checkout --ours file.js
```

---

## ماذا بعد؟ / What's Next?

### بعد الدمج الناجح / After Successful Merge:

1. **Wait for CI checks**
   - انتظر فحوصات CI
   - All checks should pass

2. **Request review**
   - اطلب مراجعة
   - Tag a maintainer if needed

3. **Merge when approved**
   - ادمج عند الموافقة
   - Use "Squash and merge" or "Create merge commit"

### إذا فشل CI / If CI Fails:

```bash
# Check the error
# Fix the issue
# Push again

git add .
git commit -m "Fix CI failure"
git push origin your-pr-branch
```

---

## الخلاصة / Summary

### الخطوات المختصرة / Short Steps:

```bash
1. ./scripts/check-merge-conflicts.sh
2. git merge origin/main
3. Edit conflicted files
4. git add .
5. git commit -m "Merge main"
6. npm install && npm test
7. git push
```

### الوقت المتوقع / Expected Time:

- Simple conflicts (1-2 files): **5-10 minutes**
- Medium conflicts (3-5 files): **15-30 minutes**
- Complex conflicts (5+ files): **30-60 minutes**

---

## الدعم / Support

**Need more help?**

1. Read the full guide: `MERGE_CONFLICT_RESOLUTION_GUIDE.md`
2. Check quick reference: `QUICK_REFERENCE_MERGE_CONFLICTS.md`
3. Ask in your PR comments
4. Tag a maintainer

**تحتاج مزيد من المساعدة؟**

1. اقرأ الدليل الكامل
2. راجع المرجع السريع
3. اسأل في تعليقات PR
4. اذكر مشرف

---

**تم إنشاؤه بواسطة Web3SecurityAgent | Created by Web3SecurityAgent**

**🎯 الهدف: تسهيل عملية حل التعارضات خطوة بخطوة**
**🎯 Goal: Simplify conflict resolution step-by-step**
