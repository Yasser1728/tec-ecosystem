# Guide to Merging Multiple Pull Requests - Solving Merge Issues

Created: 2026-01-23

---

## 📋 Executive Summary

This guide explains how to solve common problems when merging multiple Pull Requests (PRs) simultaneously, and provides strategies to avoid conflicts and issues.

---

## 🎯 The Core Problem

When working on multiple Pull Requests at the same time, you may face:

- ❌ **Merge Conflicts** - Conflicts in the same files
- ❌ **Branch Out of Date** - Branch not updated from main
- ❌ **Failed Checks** - Test or check failures
- ❌ **Blocked Merges** - Unable to merge

---

## 🔍 Diagnosing the Problem

### Step 1: Check PR Status

#### Check a single PR:

```bash
# Go to GitHub Repository
https://github.com/Yasser1728/tec-ecosystem/pulls

# For each PR, verify:
1. ✅ Are all checks passing?
2. ✅ Is the PR updated from main?
3. ✅ Are there merge conflicts?
4. ✅ Has it been reviewed and approved?
```

### Step 2: Understand Problem Types

#### 1. Merge Conflicts 🔴

**Symptoms:**
```
❌ This branch has conflicts that must be resolved
```

**Cause:**
- Multiple PRs modify the same lines in the same files
- First PR was merged, second became conflicted

**Example:**
```
PR #1: Modifies line 10 in file.js
PR #2: Modifies same line 10 in file.js
→ After merging PR #1, PR #2 becomes conflicted
```

#### 2. Branch Out of Date 🟡

**Symptoms:**
```
⚠️ This branch is out-of-date with the base branch
```

**Cause:**
- Other PRs were merged into main after creating this PR
- Branch doesn't contain latest changes

#### 3. Failed Checks 🔴

**Symptoms:**
```
❌ Some checks were not successful
❌ Build failed
❌ Tests failed
```

**Cause:**
- New code breaks tests
- Unresolved conflicts
- Build issues

---

## 🛠️ Solution Strategies

### Strategy 1: Sequential Merging (Recommended) ✅

**Concept:** Merge one PR at a time in priority order

#### Steps:

```bash
# 1. Sort PRs by priority
   Highest priority:
   - Security fixes
   - Critical bug fixes
   - Core features
   - Improvements
   - Documentation

# 2. Merge first PR
   - Open PR #1 in GitHub
   - Verify all checks pass
   - Click "Merge pull request"
   - Delete branch after merge

# 3. Update remaining PRs
   - For each remaining PR:
     git checkout PR-branch
     git pull origin main
     git push

# 4. Repeat the process
   - Merge PR #2
   - Update remaining PRs
   - Continue until done
```

#### Practical Example:

```bash
# You have 3 PRs:
# PR #170 - TEC.PI Domain ✅
# PR #160 - Quick Start ✅  
# PR #129 - Micro OS ⚠️ (conflicts)

# Correct order:
1. Merge PR #170 (most mature, no issues)
2. Merge PR #160 (already fixed)
3. Resolve conflicts in PR #129
4. Merge PR #129
```

---

### Strategy 2: Update All PRs First

**Concept:** Update all PRs from main before any merging

#### Steps:

```bash
# 1. For each PR, update:

# PR #1
git checkout feature-branch-1
git pull origin main
git push --force-with-lease

# PR #2
git checkout feature-branch-2
git pull origin main
git push --force-with-lease

# PR #3
git checkout feature-branch-3
git pull origin main
git push --force-with-lease

# 2. Wait for all checks to pass

# 3. Merge PRs in order
```

**⚠️ Warning:** This method may cause more conflicts!

---

### Strategy 3: Resolve Conflicts Locally

**Concept:** Resolve all conflicts on local machine before pushing

#### Steps:

```bash
# 1. Clone repository (if not already)
git clone https://github.com/Yasser1728/tec-ecosystem
cd tec-ecosystem

# 2. For each PR with conflicts:

# Update main
git checkout main
git pull origin main

# Switch to branch
git checkout feature-branch-with-conflicts

# Merge main into branch
git merge main

# Resolve conflicts manually
# Open conflicted files in text editor

# Example conflict:
<<<<<<< HEAD
const value = "old value";
=======
const value = "new value";
>>>>>>> main

# Choose correct code:
const value = "new value";

# After resolving all conflicts:
git add .
git commit -m "Resolve merge conflicts with main"
git push

# 3. Wait for checks and merge
```

---

## 📝 Best Practices to Avoid Issues

### 1. Coordinate Between PRs ✅

```markdown
**Before opening new PR:**
- [ ] Check existing open PRs
- [ ] Avoid modifying same files
- [ ] Coordinate with team
- [ ] Use separate branches for each feature
```

### 2. Update Branches Regularly ✅

```bash
# Every day or two, update branch:
git checkout feature-branch
git pull origin main
git push --force-with-lease
```

### 3. Small, Focused PRs ✅

```markdown
**Good PR:**
- Solves one problem
- Modifies few files (< 10)
- Easy to review
- Can be merged quickly

**Bad PR:**
- Solves multiple problems
- Modifies many files (> 20)
- Hard to review
- Takes long to merge
```

### 4. Use Draft PRs for Work in Progress ✅

```bash
# When opening PR:
1. Choose "Create Draft Pull Request"
2. Work on code
3. When ready: "Ready for review"
```

---

## 🚨 Solving Common Problems

### Problem 1: "This branch has conflicts"

**Solution:**

```bash
# Method 1: Via GitHub (easy)
1. Open PR in GitHub
2. Click "Resolve conflicts"
3. Select correct code
4. Click "Mark as resolved"
5. Click "Commit merge"

# Method 2: Locally (advanced)
git checkout feature-branch
git merge main
# Resolve conflicts in editor
git add .
git commit -m "Resolve conflicts"
git push
```

### Problem 2: "This branch is out-of-date"

**Solution:**

```bash
# Method 1: Update Branch (button in GitHub)
Click "Update branch" in PR page

# Method 2: Locally
git checkout feature-branch
git pull origin main
git push
```

### Problem 3: "Some checks were not successful"

**Solution:**

```bash
# 1. Check which check failed
Click "Details" next to failed check

# 2. Fix the issue
# Example: ESLint error
npm run lint:fix
git add .
git commit -m "Fix linting errors"
git push

# 3. Wait for checks to re-run
```

### Problem 4: Cannot merge - blocked

**Possible Causes:**

1. **Branch Protection Rules:**
   - All checks must pass
   - Must be reviewed and approved
   - All comments must be resolved

2. **Solution:**
   ```bash
   # Verify:
   - [ ] All Checks ✅
   - [ ] Reviewed ✅
   - [ ] No Conflicts ✅
   - [ ] Branch Updated ✅
   ```

---

## 📊 Recommended Workflow

### For Small Projects (1-2 developers)

```
1. Open PR
2. Check passing
3. Self-merge immediately
4. Delete branch
```

### For Medium Projects (3-5 developers)

```
1. Open PR
2. Request review
3. Address comments
4. Wait for approval
5. Update from main
6. Merge
7. Delete branch
```

### For Large Projects (6+ developers)

```
1. Open Draft PR
2. Work on code
3. Ready for review
4. Request review from 2+ reviewers
5. Address all comments
6. Update from main daily
7. Wait for 2 approvals
8. Merge
9. Monitor production
10. Delete branch
```

---

## 🔄 Step-by-Step Merge Process

### To merge a single PR:

```bash
# ✅ Pre-merge checklist
- [ ] All checks passed
- [ ] Reviewed
- [ ] No conflicts
- [ ] Branch updated from main
- [ ] All comments resolved

# Merge via GitHub:
1. Open PR in browser
2. Click "Merge pull request"
3. Choose merge type:
   - Merge commit (default)
   - Squash and merge (compress all commits)
   - Rebase and merge (linear history)
4. Click "Confirm merge"
5. Click "Delete branch"
```

### To merge multiple PRs:

```bash
# Order:
1. Most mature PR first
2. Least complex PR
3. Highest priority PR

# For each PR:
1. Merge PR
2. Wait for CI/CD
3. Update remaining PRs:
   
   git checkout next-pr-branch
   git pull origin main
   git push --force-with-lease
   
4. Wait for checks to pass
5. Merge next PR
6. Repeat process
```

---

## 🧪 Pre-Merge Testing

### Basic Tests:

```bash
# 1. Build
npm run build
# Must succeed without errors

# 2. Lint
npm run lint
# No errors

# 3. Tests
npm test
# All tests pass

# 4. Type Check (if TypeScript)
npm run type-check
```

### Advanced Tests:

```bash
# 5. Integration Tests
npm run test:integration

# 6. E2E Tests
npm run test:e2e

# 7. Security Scan
npm audit
npm run security-check

# 8. Performance Test
npm run test:performance
```

---

## 🎯 Real Examples from TEC Ecosystem

### Example 1: PR #170, #160, #129

**Initial Situation:**
```
PR #170: TEC.PI Domain ✅ Ready
PR #160: Quick Start ✅ Ready
PR #129: Micro OS ⚠️ conflicts
```

**Solution:**

```bash
# Step 1: Merge PR #170
- Open PR #170 in GitHub
- Verify: All checks ✅
- Click "Merge pull request"
- Delete branch

# Step 2: Update PR #160 & #129
# PR #160
git checkout copilot/implement-quick-start-path
git pull origin main
git push --force-with-lease

# PR #129
git checkout copilot/setup-micro-os-structure
git pull origin main
# Resolve conflicts if any
git push --force-with-lease

# Step 3: Merge PR #160
- Open PR #160
- Wait for checks ✅
- Merge

# Step 4: Resolve conflicts in PR #129
git checkout copilot/setup-micro-os-structure
git merge main
# Resolve conflicts
git push

# Step 5: Merge PR #129
- Open PR #129
- Wait for checks ✅
- Merge
```

### Example 2: 18 Duplicate PRs

**Problem:**
- 18 PRs solving same issues
- Path Traversal (8 PRs)
- Math.random() (2 PRs)
- Magic Numbers (4 PRs)

**Solution:**
```bash
# 1. Identify best PR for each issue
Path Traversal: PR #174 ✅
Math.random(): PR #161 ✅
Magic Numbers: PR #169 ✅

# 2. Merge selected PRs
# 3. Close duplicate PRs
# 4. Add comment explaining:

"This issue was resolved in PR #XXX"
```

---

## 📱 Helper Tools

### 1. GitHub CLI

```bash
# Install GitHub CLI
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Linux
sudo apt install gh

# Usage:
gh pr list                    # List all PRs
gh pr view 170                # View PR details
gh pr checks 170              # View checks
gh pr merge 170               # Merge PR
gh pr close 129               # Close PR
```

### 2. Helper Script

```bash
# check-pr-status.sh
#!/bin/bash

echo "📊 Checking PR status..."

PRs=(170 160 129)

for pr in "${PRs[@]}"; do
    echo "
PR #$pr:"
    gh pr view $pr --json state,mergeable,statusCheckRollup
done
```

### 3. Git Aliases

```bash
# Add useful aliases
git config --global alias.sync '!git fetch origin && git merge origin/main'
git config --global alias.update-pr '!git pull origin main && git push --force-with-lease'

# Usage:
git sync         # Fetch latest updates
git update-pr    # Update PR from main
```

---

## ⚠️ Important Warnings

### ❌ Don't Do:

1. **Force Push Without Verification:**
   ```bash
   # Dangerous! May delete changes
   git push --force
   
   # Safe: Checks before deleting
   git push --force-with-lease
   ```

2. **Merge PR Without Checks:**
   ```
   ❌ "I'll merge now and fix issues later"
   ✅ Wait for all checks to pass
   ```

3. **Ignore Conflicts:**
   ```
   ❌ "I'll merge and resolve conflicts later"
   ✅ Resolve conflicts before merging
   ```

4. **Merge Very Large PRs:**
   ```
   ❌ PR modifying 50+ files
   ✅ Split into smaller PRs
   ```

---

## 📚 Additional Resources

### TEC Ecosystem Documentation:

- [SETUP_BRANCH_PROTECTION.md](../SETUP_BRANCH_PROTECTION.md)
- [COLLABORATION_GUIDE.md](../COLLABORATION_GUIDE.md)
- [PR_CHECKS_STATUS.md](../PR_CHECKS_STATUS.md)
- [CLOSED_PRS_SUMMARY.md](../CLOSED_PRS_SUMMARY.md)

### GitHub Documentation:

- [About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
- [Resolving merge conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts)
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

### Git Documentation:

- [Git Merge](https://git-scm.com/docs/git-merge)
- [Git Rebase](https://git-scm.com/docs/git-rebase)
- [Git Conflicts](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)

---

## ✅ Final Checklist

### Before merging any PR:

- [ ] All CI/CD checks passed ✅
- [ ] Code reviewed and approved
- [ ] No merge conflicts
- [ ] Branch updated from main
- [ ] All comments resolved
- [ ] Tested locally
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] No secrets in code
- [ ] Code follows project standards

### After merge:

- [ ] Delete branch
- [ ] Update other PRs
- [ ] Monitor production
- [ ] Update documentation
- [ ] Close related issues

---

## 📞 Getting Help

### If you encounter problems:

1. **Review this guide first**
2. **Search closed issues**
3. **Ask in Slack** (#tec-dev)
4. **Open new issue** with:
   - Problem description
   - Reproduction steps
   - Screenshots
   - Full error message

---

## 🎉 Conclusion

**Merging multiple PRs requires:**

✅ **Organization:** Order by priority  
✅ **Communication:** Coordinate with team  
✅ **Patience:** Wait for checks to pass  
✅ **Precision:** Resolve all conflicts  
✅ **Monitoring:** Watch after merge

**Remember:**
- Small PR = Quick merge
- Large PR = Many problems
- Regular updates = Fewer conflicts
- Team coordination = Greater success

---

**Last Updated:** 2026-01-23  
**Author:** TEC Ecosystem Team  
**Version:** 1.0.0

---

© 2024-2026 TEC Ecosystem - All Rights Reserved
