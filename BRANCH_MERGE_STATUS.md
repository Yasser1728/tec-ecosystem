# حالة الفروع والدمج - Branch and Merge Status

تاريخ: 2026-01-23

---

## الملخص / Summary

هذا المستند يوضح الحالة الحالية للفرع الرئيسي (main) وكيفية التعامل مع Pull Requests التي قد تواجه مشاكل في الدمج.

This document explains the current state of the main branch and how to handle Pull Requests that may face merge issues.

---

## معلومات الفرع الرئيسي / Main Branch Information

### آخر تحديث / Last Update
- **Commit:** dfbb927
- **Message:** Merge pull request #313
- **Date:** Recent

### الملفات الأكثر تغييراً / Most Frequently Changed Files

Based on recent commits, these files are most likely to cause conflicts:

1. **Workflow Files**
   - `.github/workflows/security.yml` (10 changes)
   - `.github/workflows/codacy.yml` (6 changes)
   - `.github/workflows/sovereign-factory.yml` (4 changes)
   - `.github/workflows/main.yml` (4 changes)

2. **API Routes**
   - `pages/api/payments/approve.js` (9 changes)
   - `pages/api/payments/complete.js` (5 changes)
   - `pages/api/payments/create-payment.js` (4 changes)
   - `pages/api/transfer/create.js` (4 changes)
   - `pages/api/auth/[...nextauth].js` (4 changes)

3. **Package Files**
   - `package.json` (4 changes)
   - `package-lock.json` (5 changes)

4. **Configuration**
   - `next.config.js` (4 changes)
   - `.env.example` (4 changes)

5. **Core Services**
   - `lib/pi-payments.js` (3 changes)
   - `lib/pi-auth.js` (3 changes)

6. **Documentation**
   - `domains/tec/README.md` (6 changes)

---

## كيفية استخدام الأدوات / How to Use the Tools

### 1. فحص التعارضات / Check for Conflicts

استخدم السكريبت للتحقق من وجود تعارضات:

Use the script to check for conflicts:

```bash
# For current branch
./scripts/check-merge-conflicts.sh

# For specific branch
./scripts/check-merge-conflicts.sh your-branch-name
```

### 2. قراءة الدليل / Read the Guide

اقرأ الدليل الشامل لحل التعارضات:

Read the comprehensive guide for resolving conflicts:

```bash
cat MERGE_CONFLICT_RESOLUTION_GUIDE.md
```

Or open it in GitHub: [MERGE_CONFLICT_RESOLUTION_GUIDE.md](./MERGE_CONFLICT_RESOLUTION_GUIDE.md)

---

## خطوات حل التعارضات / Conflict Resolution Steps

### للمساهمين / For Contributors

1. **Check your PR for conflicts**
   - Go to your PR page
   - Look for "This branch has conflicts" message

2. **Use the check script**
   ```bash
   git checkout your-branch-name
   ./scripts/check-merge-conflicts.sh
   ```

3. **Follow the resolution guide**
   - Read MERGE_CONFLICT_RESOLUTION_GUIDE.md
   - Choose appropriate method (Web UI or CLI)

4. **Test after resolving**
   ```bash
   npm install
   npm test
   npm run build
   ```

5. **Push the resolution**
   ```bash
   git push origin your-branch-name
   ```

### للمشرفين / For Maintainers

1. **Review the conflict type**
   - Simple conflicts: Guide contributor to resolve
   - Complex conflicts: Offer to help or provide example

2. **Check security implications**
   - If security files are involved, review carefully
   - Ensure no security regression

3. **Verify tests pass**
   - Wait for CI to complete
   - Check all checks pass

4. **Merge when ready**
   - Use "Squash and merge" for cleaner history
   - Or "Create merge commit" to preserve history

---

## استراتيجيات الدمج / Merge Strategies

### Strategy 1: Simple Merge (الأبسط)

**متى تستخدمها / When to use:**
- Few commits
- Simple changes
- No conflicts expected

**الخطوات / Steps:**
```bash
git checkout your-branch
git merge main
# Resolve conflicts if any
git push
```

### Strategy 2: Rebase (الأنظف)

**متى تستخدمها / When to use:**
- Want linear history
- Small feature branch
- You're comfortable with rebase

**الخطوات / Steps:**
```bash
git checkout your-branch
git rebase main
# Resolve conflicts for each commit
git push --force-with-lease
```

⚠️ **Warning:** Don't force push on shared branches!

### Strategy 3: Fresh PR (للحالات المعقدة)

**متى تستخدمها / When to use:**
- Too many conflicts
- Old branch with many outdated changes
- Want a clean start

**الخطوات / Steps:**
```bash
# Create new branch from latest main
git checkout main
git pull
git checkout -b your-feature-v2

# Cherry-pick your commits
git cherry-pick <commit-hash>

# Or manually apply changes
# Then create new PR
```

---

## أنماط التعارض الشائعة / Common Conflict Patterns

### Pattern 1: Package Dependencies

**التعارض / Conflict:**
```json
<<<<<<< HEAD
"dependencies": {
  "package-a": "1.0.0"
}
=======
"dependencies": {
  "package-b": "2.0.0"
}
>>>>>>> main
```

**الحل / Solution:**
```json
"dependencies": {
  "package-a": "1.0.0",
  "package-b": "2.0.0"
}
```

Then: `npm install`

### Pattern 2: Configuration Addition

**التعارض / Conflict:**
```javascript
// In next.config.js
<<<<<<< HEAD
module.exports = {
  feature1: true
}
=======
module.exports = {
  feature2: true
}
>>>>>>> main
```

**الحل / Solution:**
```javascript
module.exports = {
  feature1: true,
  feature2: true
}
```

### Pattern 3: Function Implementation

**التعارض / Conflict:**
```javascript
<<<<<<< HEAD
function process(data) {
  return data.map(x => x * 2);
}
=======
function process(data) {
  return data.filter(x => x > 0).map(x => x * 2);
}
>>>>>>> main
```

**الحل / Solution:**
Keep the more complete implementation (main's version in this case):
```javascript
function process(data) {
  return data.filter(x => x > 0).map(x => x * 2);
}
```

---

## الملفات الحساسة / Sensitive Files

### ⚠️ Always Review Carefully

عند حل التعارضات في هذه الملفات، راجع بعناية:

When resolving conflicts in these files, review carefully:

1. **Security Files**
   - `.github/workflows/security.yml`
   - Any authentication/authorization code
   - Payment processing code

2. **Environment Configuration**
   - `.env.example`
   - Configuration files

3. **Core Services**
   - `core/**/*`
   - `lib/**/*`
   - API middleware

### القاعدة الذهبية / Golden Rule

**"عند الشك في ملف أمني، احتفظ بنسخة main"**

**"When in doubt with security files, keep main's version"**

---

## نصائح للوقاية / Prevention Tips

### لتجنب التعارضات / To Avoid Conflicts:

1. **Keep your branch up to date**
   ```bash
   # Merge main regularly
   git checkout your-branch
   git merge main
   ```

2. **Small, focused PRs**
   - One feature per PR
   - Fewer files = fewer conflicts

3. **Coordinate with team**
   - Check if others are working on same files
   - Communicate before big changes

4. **Rebase feature branches**
   ```bash
   # Before creating PR
   git rebase main
   ```

---

## موارد إضافية / Additional Resources

### داخلية / Internal
- [MERGE_CONFLICT_RESOLUTION_GUIDE.md](./MERGE_CONFLICT_RESOLUTION_GUIDE.md) - Detailed guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [ALL_PRS_ISSUES_DETAILED.md](./ALL_PRS_ISSUES_DETAILED.md) - Known PR issues

### خارجية / External
- [Pro Git Book - Merge Conflicts](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [GitHub Docs - Resolving Conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts)

---

## الأسئلة الشائعة / FAQ

### Q1: هل يجب علي استخدام merge أم rebase؟
### Q1: Should I use merge or rebase?

**A:** For shared branches (like open PRs), use **merge**. Rebase only for personal branches.

**A:** للفروع المشتركة (مثل PRs المفتوحة), استخدم **merge**. استخدم rebase فقط للفروع الشخصية.

---

### Q2: ماذا أفعل إذا كانت التعارضات كثيرة جداً؟
### Q2: What if there are too many conflicts?

**A:** Consider creating a fresh PR from the latest main branch.

**A:** فكر في إنشاء PR جديد من آخر نسخة من main.

---

### Q3: هل يمكنني استخدام force push؟
### Q3: Can I use force push?

**A:** Use `--force-with-lease` only after rebase, and only if you're sure no one else is using your branch.

**A:** استخدم `--force-with-lease` فقط بعد rebase، وفقط إذا كنت متأكداً أن لا أحد يستخدم فرعك.

---

### Q4: كيف أعرف إذا كان الحل صحيح؟
### Q4: How do I know if my resolution is correct?

**A:** Run tests! Always test after resolving:
```bash
npm install
npm test
npm run build
```

**A:** شغّل الاختبارات! دائماً اختبر بعد الحل:

---

## للمساعدة / For Help

**إذا كنت بحاجة لمساعدة / If you need help:**

1. Comment on your PR
2. Tag a maintainer: @maintainer
3. Provide details:
   - Which files have conflicts
   - What you've tried
   - Screenshots if helpful

---

## ملاحظات التحديث / Update Notes

### 2026-01-23
- ✅ Created merge conflict resolution guide
- ✅ Added conflict checking script
- ✅ Documented most conflict-prone files
- ✅ Added resolution patterns

### Future Improvements
- [ ] Add automated conflict detection in CI
- [ ] Create video tutorial
- [ ] Add more example resolutions
- [ ] Integrate with PR templates

---

**تم إنشاؤه بواسطة Web3SecurityAgent**
**Created by Web3SecurityAgent**

**🎯 الهدف: تسهيل عملية الدمج ومنع مشاكل التعارض**
**🎯 Goal: Facilitate merging and prevent conflict issues**
