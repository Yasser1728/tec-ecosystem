# 🚀 دليل سريع لدمج Pull Requests - Quick Reference

## 📋 الأوامر السريعة / Quick Commands

### فحص حالة PRs / Check PR Status
```bash
# باستخدام السكريبت المساعد
npm run pr:check

# أو باستخدام GitHub CLI مباشرة
gh pr list
gh pr status
```

### تحديث Branch من Main / Update Branch from Main
```bash
git checkout <branch-name>
git pull origin main
git push --force-with-lease
```

### حل Conflicts / Resolve Conflicts
```bash
git checkout <branch-name>
git merge main
# حل التعارضات في المحرر
git add .
git commit -m "Resolve merge conflicts"
git push
```

---

## ✅ Checklist قبل الدمج / Pre-Merge Checklist

```markdown
- [ ] ✅ All CI/CD checks passed
- [ ] ✅ Code reviewed and approved
- [ ] ✅ No merge conflicts
- [ ] ✅ Branch updated from main
- [ ] ✅ All comments resolved
- [ ] ✅ Tests passing locally
- [ ] ✅ Documentation updated
```

---

## 🎯 استراتيجية الدمج الموصى بها / Recommended Merge Strategy

### 1. رتب PRs حسب الأولوية / Sort by Priority
```
1. Security fixes       (أمان)
2. Critical bug fixes   (إصلاحات حرجة)
3. Core features        (ميزات أساسية)
4. Improvements         (تحسينات)
5. Documentation        (توثيق)
```

### 2. ادمج واحد في كل مرة / Merge One at a Time
```bash
# PR #1
1. Merge PR #1 in GitHub
2. Delete branch

# Update other PRs
git checkout pr-2-branch
git pull origin main
git push --force-with-lease

git checkout pr-3-branch
git pull origin main
git push --force-with-lease

# PR #2
3. Wait for checks ✅
4. Merge PR #2
5. Delete branch

# Update PR #3
git checkout pr-3-branch
git pull origin main
git push --force-with-lease

# PR #3
6. Wait for checks ✅
7. Merge PR #3
8. Delete branch
```

---

## 🚨 حل المشاكل الشائعة / Common Problems

### ❌ Merge Conflicts
```bash
# الحل / Solution:
git checkout <branch>
git merge main
# Fix conflicts in editor
git add .
git commit -m "Resolve conflicts"
git push
```

### ⚠️ Branch Out of Date
```bash
# الحل / Solution:
git checkout <branch>
git pull origin main
git push
```

### ❌ Failed Checks
```bash
# الحل / Solution:
# 1. Check which test failed
npm run lint        # Fix linting
npm run test        # Fix tests
npm run build       # Fix build

# 2. Commit fixes
git add .
git commit -m "Fix failing checks"
git push
```

---

## 📱 أوامر GitHub CLI المفيدة / Useful GitHub CLI Commands

```bash
# List all PRs
gh pr list

# View PR details
gh pr view 123

# Check PR status
gh pr checks 123

# View PR diff
gh pr diff 123

# Merge PR
gh pr merge 123

# Close PR
gh pr close 123

# Reopen PR
gh pr reopen 123
```

---

## 🔧 Git Aliases المفيدة / Useful Git Aliases

### إضافة Aliases / Add Aliases:
```bash
git config --global alias.sync '!git fetch origin && git merge origin/main'
git config --global alias.update-pr '!git pull origin main && git push --force-with-lease'
git config --global alias.pr-status 'log --oneline --graph --decorate -10'
```

### الاستخدام / Usage:
```bash
git sync           # Sync with main
git update-pr      # Update PR from main
git pr-status      # View recent commits
```

---

## 📊 أمثلة سريعة / Quick Examples

### مثال 1: دمج 3 PRs / Example 1: Merge 3 PRs
```bash
# الوضع / Situation:
PR #100 ✅ Ready
PR #101 ✅ Ready
PR #102 ⚠️ Conflicts

# الحل / Solution:
1. Merge PR #100
2. Update PR #101 & #102
3. Merge PR #101
4. Resolve conflicts in PR #102
5. Merge PR #102
```

### مثال 2: PR به Conflicts / Example 2: PR with Conflicts
```bash
# الخطوات / Steps:
git checkout feature-branch
git merge main
# Resolve conflicts in files
git add .
git commit -m "Resolve merge conflicts with main"
git push
# Wait for checks ✅
# Merge in GitHub
```

---

## 📖 الوثائق الكاملة / Full Documentation

### عربي:
- [دليل دمج PRs المتعددة](./MERGE_MULTIPLE_PRS_GUIDE_AR.md)
- [إعداد Branch Protection](../SETUP_BRANCH_PROTECTION.md)

### English:
- [Merge Multiple PRs Guide](./MERGE_MULTIPLE_PRS_GUIDE.md)
- [Collaboration Guide](../COLLABORATION_GUIDE.md)

---

## 🎯 نصائح سريعة / Quick Tips

### ✅ Do / افعل:
- ✅ Merge PRs one at a time
- ✅ Update branches regularly
- ✅ Keep PRs small and focused
- ✅ Wait for all checks to pass
- ✅ Resolve conflicts immediately

### ❌ Don't / لا تفعل:
- ❌ Force push without `--force-with-lease`
- ❌ Merge without passing checks
- ❌ Ignore merge conflicts
- ❌ Create very large PRs
- ❌ Merge multiple PRs simultaneously

---

## 🆘 الحصول على المساعدة / Get Help

```bash
# Check PR status
npm run pr:check

# View guides
cat docs/MERGE_MULTIPLE_PRS_GUIDE.md
cat docs/MERGE_MULTIPLE_PRS_GUIDE_AR.md

# Ask in Slack
#tec-dev channel

# Open issue on GitHub
https://github.com/Yasser1728/tec-ecosystem/issues
```

---

## 🔗 روابط مفيدة / Useful Links

- 📖 [GitHub PR Guide](https://docs.github.com/en/pull-requests)
- 📖 [Git Merge Guide](https://git-scm.com/docs/git-merge)
- 📖 [GitHub CLI Docs](https://cli.github.com/manual/)
- 🏠 [TEC Repository](https://github.com/Yasser1728/tec-ecosystem)

---

**آخر تحديث / Last Updated:** 2026-01-23  
**النسخة / Version:** 1.0.0

---

© 2024-2026 TEC Ecosystem - جميع الحقوق محفوظة / All Rights Reserved
