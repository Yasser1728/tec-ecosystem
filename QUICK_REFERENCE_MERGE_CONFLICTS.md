# بطاقة المرجع السريع لحل مشاكل الدمج
# Quick Reference Card for Merge Conflict Resolution

---

## ⚡ الأوامر السريعة / Quick Commands

### 1️⃣ فحص التعارضات / Check Conflicts
```bash
./scripts/check-merge-conflicts.sh
```

### 2️⃣ جلب آخر تحديثات / Fetch Latest
```bash
git fetch origin main
```

### 3️⃣ دمج main في فرعك / Merge main into your branch
```bash
git checkout your-branch-name
git merge origin/main
```

### 4️⃣ عرض الملفات المتعارضة / Show Conflicted Files
```bash
git status
git diff --name-only --diff-filter=U
```

### 5️⃣ قبول التغييرات / Accept Changes
```bash
# Keep your changes / احتفظ بتغييراتك
git checkout --ours file.js

# Keep main's changes / احتفظ بتغييرات main
git checkout --theirs file.js
```

### 6️⃣ إتمام الحل / Complete Resolution
```bash
git add .
git commit -m "Merge main and resolve conflicts"
git push origin your-branch-name
```

---

## 📦 الملفات الشائعة / Common Files

### package.json
```bash
# بعد حل التعارض / After resolving conflict
npm install
git add package.json package-lock.json
```

### JavaScript Files
```bash
# افتح الملف وابحث عن / Open file and look for:
<<<<<<< HEAD
...your code...
=======
...main code...
>>>>>>> origin/main

# احذف العلامات واختر الكود الصحيح
# Delete markers and keep correct code
```

---

## ⚠️ تحذيرات / Warnings

### ❌ لا تفعل / DON'T:
- ❌ Force push (unless rebase)
- ❌ Delete tests
- ❌ Skip testing
- ❌ Ignore security updates

### ✅ افعل / DO:
- ✅ Test after resolving
- ✅ Keep security updates
- ✅ Read both versions
- ✅ Ask for help if unsure

---

## 🔍 التحقق بعد الحل / Verify After Resolution

```bash
# 1. Install dependencies
npm install

# 2. Run tests
npm test

# 3. Build project
npm run build

# 4. Check linting
npm run lint

# 5. Push changes
git push origin your-branch-name
```

---

## 📚 الملفات الحساسة / Sensitive Files

### ⚠️ Always Keep Main's Version:

1. **Security**
   - `.github/workflows/security.yml`
   - `pages/api/auth/**`
   - `pages/api/payments/**`

2. **Tests**
   - `tests/**/*.test.js`

3. **Core Services**
   - `core/**/*.js`
   - `lib/**/*.js`

---

## 🆘 المساعدة / Help

### خطوة بخطوة / Step by Step:
1. قرأ الدليل الكامل / Read full guide:
   ```bash
   cat MERGE_CONFLICT_RESOLUTION_GUIDE.md
   ```

2. استخدم الأداة / Use the tool:
   ```bash
   ./scripts/check-merge-conflicts.sh
   ```

3. اطلب المساعدة / Ask for help:
   - Comment on your PR
   - Tag: @maintainer
   - Explain the issue

---

## 🔧 أنماط الحلول / Solution Patterns

### Pattern 1: Package Dependencies
```json
// KEEP BOTH / احتفظ بالاثنين
"dependencies": {
  "package-a": "1.0.0",  // Your addition
  "package-b": "2.0.0"   // Main's addition
}
```

### Pattern 2: Array/List Addition
```javascript
// MERGE BOTH / ادمج الاثنين
const items = [
  'item-1',  // Your item
  'item-2',  // Main's item
  'item-3'   // Another item
];
```

### Pattern 3: Configuration
```javascript
// MERGE BOTH / ادمج الاثنين
module.exports = {
  feature1: true,  // Your feature
  feature2: true   // Main's feature
};
```

### Pattern 4: Function Override
```javascript
// KEEP THE BETTER ONE / احتفظ بالأفضل
// Usually keep main's version if more secure/complete
function process(data) {
  // Use main's implementation if:
  // - More security checks
  // - Better error handling
  // - More features
  return improvedImplementation(data);
}
```

---

## 📝 نموذج Commit Message

```bash
git commit -m "Merge main and resolve conflicts

- Merged package.json dependencies
- Kept security updates from main
- Combined feature additions
- All tests passing

Resolves merge conflicts in PR #XXX"
```

---

## 🎯 القاعدة الذهبية / Golden Rule

### عربي:
**"عند الشك، احتفظ بتغييرات main (خاصة ملفات الأمان) وأعد تطبيق ميزتك فوقها"**

### English:
**"When in doubt, keep main's changes (especially security files) and re-apply your feature on top"**

---

## 📞 الروابط السريعة / Quick Links

- 📖 [Full Guide](./MERGE_CONFLICT_RESOLUTION_GUIDE.md)
- 📊 [Branch Status](./BRANCH_MERGE_STATUS.md)
- 🔐 [Security Policy](./SECURITY.md)
- 🤝 [Contributing](./CONTRIBUTING.md)

---

## 🚀 الأوامر الكاملة / Complete Commands

### حل كامل من الصفر / Complete Resolution from Scratch

```bash
# 1. Go to your branch
git checkout your-branch-name

# 2. Fetch latest main
git fetch origin main

# 3. Merge main
git merge origin/main
# (You'll see conflicts here)

# 4. Check conflicted files
git status

# 5. Edit each file and resolve conflicts
# Remove markers: <<<<<<< ======= >>>>>>>
# Keep the correct code

# 6. Mark as resolved
git add file1.js
git add file2.js
# ... for each file

# 7. Complete merge
git commit -m "Merge main and resolve conflicts"

# 8. Test everything
npm install
npm test
npm run build

# 9. Push if tests pass
git push origin your-branch-name

# 10. Done! ✅
```

---

## 💡 نصائح إضافية / Extra Tips

### Tip 1: VS Code
اضغط على **"Accept Current Change"** أو **"Accept Incoming Change"** في VS Code

Click **"Accept Current Change"** or **"Accept Incoming Change"** in VS Code

### Tip 2: GitHub Web UI
للتعارضات البسيطة، استخدم زر **"Resolve conflicts"** في GitHub مباشرة

For simple conflicts, use **"Resolve conflicts"** button directly in GitHub

### Tip 3: Fresh Start
إذا كانت التعارضات كثيرة جداً:
1. أنشئ فرع جديد من main
2. انسخ تغييراتك يدوياً
3. أنشئ PR جديد

If too many conflicts:
1. Create new branch from main
2. Copy your changes manually
3. Create new PR

---

**تم إنشاؤه بواسطة Web3SecurityAgent | Created by Web3SecurityAgent**

**النسخة | Version: 1.0**
**التاريخ | Date: 2026-01-23**

---

**احفظ هذا الملف للرجوع إليه سريعاً! | Save this file for quick reference!**
