# دليل حل مشاكل الدمج - Merge Conflict Resolution Guide

تاريخ: 2026-01-23

---

## الملخص التنفيذي / Executive Summary

هذا الدليل يشرح كيفية حل مشاكل الدمج (Merge Conflicts) في Pull Requests المفتوحة.

**This guide explains how to resolve merge conflicts in open Pull Requests.**

---

## المشكلة / The Problem

عندما يكون لديك Pull Request قديم والـ main branch تم تحديثه، قد تحصل على رسالة:
**"This branch has conflicts that must be resolved"**

When you have an old Pull Request and the main branch has been updated, you might get:
**"This branch has conflicts that must be resolved"**

---

## الحل / The Solution

### الطريقة 1: عبر GitHub Web Interface (الأسهل)

#### For Simple Conflicts (أبسط للملفات البسيطة)

1. **اذهب إلى PR الخاص بك / Go to your PR**
   ```
   https://github.com/tec-ecosystem/tec-ecosystem/pull/[YOUR_PR_NUMBER]
   ```

2. **اضغط على "Resolve conflicts" / Click "Resolve conflicts"**
   - GitHub سيفتح محرر نصي
   - GitHub will open a text editor

3. **احذف علامات الـ conflict / Delete conflict markers:**
   ```
   <<<<<<< your-branch-name
   your changes
   =======
   main branch changes
   >>>>>>> main
   ```

4. **احتفظ بالكود الصحيح / Keep the correct code**
   - اختر التغييرات الخاصة بك أو من main
   - Choose your changes or main's changes
   - أو ادمجهم معاً إذا كان ممكناً
   - Or merge them together if possible

5. **اضغط "Mark as resolved" / Click "Mark as resolved"**

6. **اضغط "Commit merge" / Click "Commit merge"**

---

### الطريقة 2: عبر Git Command Line (للملفات المعقدة)

#### Step 1: Update your local repository

```bash
# Fetch latest changes from main
git fetch origin main

# Switch to your PR branch
git checkout your-branch-name

# Try to merge main into your branch
git merge origin/main
```

#### Step 2: If you get conflicts (إذا حصلت على conflicts)

```bash
# Check which files have conflicts
git status

# You'll see:
# both modified:   path/to/file.js
```

#### Step 3: Resolve each conflict

Open the conflicted file and look for:

```javascript
<<<<<<< HEAD
// Your changes
const value = "your code";
=======
// Main branch changes
const value = "main code";
>>>>>>> origin/main
```

**Choose one:**

**Option A: Keep your changes**
```javascript
const value = "your code";
```

**Option B: Keep main's changes**
```javascript
const value = "main code";
```

**Option C: Merge both (الأفضل / Best)**
```javascript
// Combine if both changes are needed
const value = "combined code";
```

#### Step 4: Mark as resolved

```bash
# After fixing all conflicts in a file
git add path/to/file.js

# Repeat for all conflicted files
```

#### Step 5: Complete the merge

```bash
# Commit the merge
git commit -m "Merge main and resolve conflicts"

# Push to your PR branch
git push origin your-branch-name
```

---

## الملفات الأكثر عرضة للـ Conflicts / Most Conflict-Prone Files

### 1. Package Files (الأكثر شيوعاً / Most Common)

**Files:**
- `package.json`
- `package-lock.json`

**الحل / Solution:**
```bash
# If package.json conflicts:
# 1. Keep both dependency additions
# 2. Merge the dependencies sections
# 3. Then regenerate package-lock.json:

npm install
git add package.json package-lock.json
git commit -m "Merge package dependencies and regenerate lock file"
```

### 2. Configuration Files

**Files:**
- `.env.example`
- `next.config.js`
- `.github/workflows/*.yml`

**الحل / Solution:**
- Usually keep both changes
- Merge configuration options
- Test after merging

### 3. API Routes

**Files:**
- `pages/api/**/*.js`
- `domains/*/services/*.js`

**الحل / Solution:**
- Review both implementations
- Keep the more recent/secure version
- Test the API after merging

### 4. Documentation Files

**Files:**
- `README.md`
- `*.md` documentation

**الحل / Solution:**
- Usually safe to keep both changes
- Merge sections logically
- Ensure Arabic and English are both updated

---

## أمثلة شائعة / Common Examples

### Example 1: package.json Conflict

```json
<<<<<<< HEAD
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "your-new-package": "^1.0.0"
  }
=======
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "main-new-package": "^2.0.0"
  }
>>>>>>> origin/main
```

**الحل / Solution:**
```json
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "your-new-package": "^1.0.0",
    "main-new-package": "^2.0.0"
  }
```

Then run: `npm install`

---

### Example 2: JavaScript Code Conflict

```javascript
<<<<<<< HEAD
// Your feature
function calculatePrice(amount) {
  return amount * 1.1; // Your tax calculation
}
=======
// Main branch update
function calculatePrice(amount, tax = 0.15) {
  return amount * (1 + tax); // Improved tax handling
}
>>>>>>> origin/main
```

**الحل / Solution (Keep the better implementation):**
```javascript
// Keep main's improved version if it's more flexible
function calculatePrice(amount, tax = 0.15) {
  return amount * (1 + tax);
}

// Or combine if needed
function calculatePrice(amount, tax = 0.15) {
  // Your additional logic if needed
  const basePrice = amount * (1 + tax);
  return basePrice;
}
```

---

## التحقق بعد الحل / Verification After Resolution

### 1. Run Tests (مهم جداً / Very Important)

```bash
# Run all tests
npm test

# If specific tests exist
npm run test:unit
npm run test:integration
```

### 2. Build the Project

```bash
# Ensure no build errors
npm run build
```

### 3. Check Linting

```bash
# Run linter if available
npm run lint
```

---

## الملفات التي يجب عدم حذف تغييراتها / Files to Never Delete Changes

### ⚠️ Critical Files (ملفات حرجة)

1. **Security Files**
   - `.github/workflows/security.yml`
   - Any file with security patches
   - **الحل:** Always keep security updates from main

2. **Test Files**
   - `tests/**/*.test.js`
   - **الحل:** Keep all tests, merge if needed

3. **Core Services**
   - `core/**/*.js`
   - `lib/**/*.js`
   - **الحل:** Review carefully, prefer main's version if uncertain

---

## نصائح مهمة / Important Tips

### ✅ Do (افعل)

1. **Read both versions carefully**
   - فهم التغييرات في كلا النسختين
   - Understand changes in both versions

2. **Test after resolving**
   - دائماً اختبر بعد الحل
   - Always test after resolution

3. **Keep security updates**
   - احتفظ بتحديثات الأمان من main
   - Keep security updates from main

4. **Document complex resolutions**
   - وثّق الحلول المعقدة في commit message
   - Document complex resolutions in commit message

### ❌ Don't (لا تفعل)

1. **Don't blindly accept all changes**
   - لا تقبل جميع التغييرات بدون فهم
   - Don't accept all changes without understanding

2. **Don't delete tests**
   - لا تحذف الاختبارات
   - Don't delete tests

3. **Don't skip testing**
   - لا تتخطى الاختبار
   - Don't skip testing

4. **Don't force push after merge**
   - لا تستخدم force push بعد الدمج
   - Don't use force push after merging

---

## حالات خاصة / Special Cases

### Case 1: Too Many Conflicts (conflicts كثيرة جداً)

**الحل / Solution:**

```bash
# Option A: Rebase instead of merge (advanced)
git fetch origin main
git rebase origin/main

# Then resolve conflicts one by one
# Push with force (only if you're sure)
git push --force-with-lease origin your-branch-name
```

**Or:**

```bash
# Option B: Create a fresh PR
# 1. Create a new branch from main
git checkout origin/main
git checkout -b your-feature-v2

# 2. Cherry-pick your commits
git cherry-pick <your-commit-hash>

# 3. Create new PR
git push origin your-feature-v2
```

---

### Case 2: Binary File Conflicts

**Files like:**
- Images (.png, .jpg)
- Lock files sometimes

**الحل / Solution:**

```bash
# Keep your version
git checkout --ours path/to/file

# Or keep main's version
git checkout --theirs path/to/file

# Then
git add path/to/file
```

---

## أدوات مساعدة / Helpful Tools

### 1. VS Code

**Install Extensions:**
- GitLens
- Git Graph
- Merge Conflict

**Usage:**
1. Open the conflicted file
2. VS Code will highlight conflicts
3. Click "Accept Current Change" or "Accept Incoming Change"
4. Or manually edit

### 2. GitHub Desktop

- Easier visual interface
- Shows conflicts clearly
- Good for beginners

### 3. Command Line Tools

```bash
# Show conflict summary
git diff --name-only --diff-filter=U

# Show detailed conflicts
git diff --check
```

---

## الحصول على مساعدة / Getting Help

### إذا كنت غير متأكد / If You're Unsure:

1. **Ask in the PR comments**
   ```
   @maintainer Can you help with this conflict?
   Describe the files and what you're unsure about
   ```

2. **Check similar PRs**
   - Look for recently merged PRs
   - See how they resolved similar conflicts

3. **Review the documentation**
   - Check README.md
   - Look for contributing guidelines

---

## Security Considerations (اعتبارات الأمان)

### ⚠️ Security Review Required

When resolving conflicts in:

1. **Authentication/Authorization Files**
   ```
   pages/api/auth/**
   middleware/**
   ```
   **Action:** Always keep main's security updates

2. **Payment/Financial Files**
   ```
   pages/api/payments/**
   domains/fundx/**
   ```
   **Action:** Never weaken security checks

3. **Data Validation**
   ```
   Any file with input validation
   ```
   **Action:** Merge all validation rules

---

## الخلاصة / Summary

### الخطوات الأساسية / Basic Steps:

1. ✅ Fetch latest main
2. ✅ Merge or rebase
3. ✅ Resolve conflicts carefully
4. ✅ Test thoroughly
5. ✅ Push and verify CI passes

### القاعدة الذهبية / Golden Rule:

**"When in doubt, keep main's changes and re-apply your feature on top"**

**"عند الشك، احتفظ بتغييرات main وأعد تطبيق ميزتك فوقها"**

---

## الموارد / Resources

### Internal Documentation
- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [All PRs Issues](ALL_PRS_ISSUES_DETAILED.md)

### External Resources
- [GitHub Docs - Resolving Conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts)
- [Git Documentation](https://git-scm.com/docs)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts)

---

## Contact (للمساعدة / For Help)

**Repository:** https://github.com/tec-ecosystem/tec-ecosystem

**Issues:** https://github.com/tec-ecosystem/tec-ecosystem/issues

---

**تم إنشاء هذا الدليل بواسطة Web3SecurityAgent**
**Created by Web3SecurityAgent**

**🎯 الهدف: مساعدتك في حل مشاكل الدمج بأمان وفعالية**
**🎯 Goal: Help you resolve merge conflicts safely and effectively**
