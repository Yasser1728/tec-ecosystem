# 🧪 Vercel Build Check Testing Guide

## Overview

This guide provides step-by-step instructions for testing the Vercel build check integration after setup is complete.

---

## 📋 Prerequisites

Before testing, ensure:
- [ ] All three secrets added to GitHub (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [ ] The Vercel workflow file exists at `.github/workflows/vercel.yml`
- [ ] This PR has been merged to main
- [ ] Branch protection is configured (optional for testing, required for production)

---

## 🧪 Test Suite

### Test 1: Verify Workflow File Exists

**Purpose:** Confirm the workflow file is present and syntactically correct

```bash
# Check file exists
ls -la .github/workflows/vercel.yml

# Validate YAML syntax
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/vercel.yml'))" && echo "✅ Valid YAML"

# Check workflow is recognized by GitHub
gh workflow list | grep -i vercel
```

**Expected Result:** 
- ✅ File exists
- ✅ YAML is valid
- ✅ Workflow appears in GitHub Actions list

---

### Test 2: Manual Workflow Trigger

**Purpose:** Test the workflow runs successfully with current configuration

**Steps:**
1. Go to GitHub repository → **Actions** tab
2. Select **"Vercel Deployment Check"** workflow
3. Click **"Run workflow"** dropdown
4. Select branch: `main` or `develop`
5. Click **"Run workflow"**

**Watch for:**
- ✅ Workflow starts running
- ✅ All steps complete successfully
- ✅ Build step succeeds
- ✅ Deploy step completes (may fail if secrets not configured)

**Expected Result:**
- If secrets configured: ✅ Full workflow succeeds
- If secrets missing: ⚠️ Deploy step fails with "Invalid token" or similar

---

### Test 3: Create Test Pull Request

**Purpose:** Verify the check appears in PRs and creates preview deployments

**Steps:**

```bash
# 1. Create test branch
git checkout -b test/vercel-check-validation
```

```bash
# 2. Make a simple change
echo "# Vercel Check Test" >> VERCEL_TEST.md
git add VERCEL_TEST.md
git commit -m "test: validate Vercel deployment check"
```

```bash
# 3. Push to GitHub
git push origin test/vercel-check-validation
```

```bash
# 4. Open PR via GitHub CLI or web interface
gh pr create --title "Test: Vercel Deployment Check" \
  --body "Testing the new Vercel build check integration" \
  --base main \
  --head test/vercel-check-validation
```

**Observe:**
1. PR page shows checks section
2. "Vercel Production/Preview Deploy" appears in checks list
3. Check starts running automatically
4. After ~3-5 minutes, check completes

**Expected Checks:**
```
Checks:
├─ ✅ Vercel Production/Preview Deploy    ← NEW CHECK
├─ ✅ TEC Sovereign AI Factory & Build 2026
├─ ✅ domain-policy-check
└─ ✅ (other existing checks)
```

**Expected Result:**
- ✅ Vercel check appears
- ✅ Build step succeeds
- ✅ Preview deployment creates (if secrets configured)
- ✅ Preview URL is available (click "Details" on check)

---

### Test 4: Verify Preview Deployment

**Purpose:** Confirm preview deployments work and are accessible

**Steps:**
1. On the test PR, find the "Vercel Production/Preview Deploy" check
2. Click **"Details"** next to the check
3. Look for preview URL in the workflow logs or GitHub deployment
4. Open the preview URL in browser

**Expected Result:**
- ✅ Preview URL is generated
- ✅ URL is accessible
- ✅ Site loads correctly
- ✅ Changes from PR are visible

**Preview URL Format:**
```
https://tec-ecosystem-<random-hash>.vercel.app
```

---

### Test 5: Test Branch Protection (if enabled)

**Purpose:** Verify merge is blocked until checks pass

**Steps:**
1. On test PR, try clicking "Merge pull request" before checks complete
2. Observe the merge button state
3. Wait for checks to complete
4. Try merge button again

**Expected Behavior:**
- ⏸️ **Before checks complete:** Merge button disabled or shows "Required checks have not passed"
- ✅ **After checks pass:** Merge button enabled

---

### Test 6: Test Production Deployment

**Purpose:** Verify production deployment works on merge to main

**Steps:**
1. Merge a PR to main (use test PR or real PR)
2. Go to Actions tab
3. Watch for "Vercel Deployment Check" workflow to run
4. Check Vercel dashboard for new production deployment

**Expected Result:**
- ✅ Workflow triggers automatically on merge
- ✅ Production deployment flag is used (`--prod`)
- ✅ Production site updates
- ✅ Deployment visible in Vercel dashboard

---

### Test 7: Verify Vercel Ignore Logic

**Purpose:** Confirm that only specified branches trigger Vercel builds

**Test Script:**
```bash
cd /home/runner/work/tec-ecosystem/tec-ecosystem

# Test main branch (should build)
export VERCEL_GIT_COMMIT_REF="main"
bash vercel-ignore.sh
echo "Exit code: $? (0 = build, 1 = skip)"

# Test develop branch (should build)
export VERCEL_GIT_COMMIT_REF="develop"
bash vercel-ignore.sh
echo "Exit code: $? (0 = build, 1 = skip)"

# Test staging branch (should build)
export VERCEL_GIT_COMMIT_REF="staging"
bash vercel-ignore.sh
echo "Exit code: $? (0 = build, 1 = skip)"

# Test feature branch (should skip)
export VERCEL_GIT_COMMIT_REF="feature/test"
bash vercel-ignore.sh
echo "Exit code: $? (0 = build, 1 = skip)"
```

**Expected Results:**
- `main`: Exit 0 (build) ✅
- `develop`: Exit 0 (build) ✅
- `staging`: Exit 0 (build) ✅
- `feature/*`: Exit 1 (skip) ✅

---

### Test 8: Verify Build Without Secrets (Dry Run)

**Purpose:** Confirm build works even without Vercel deployment

**Steps:**
```bash
# Set dummy environment variables
export SKIP_ENV_VALIDATION=true
export DATABASE_URL="postgresql://dummy:user@dummy:5432/dummy?schema=public"
export NEXT_PUBLIC_PI_APP_ID="dummy_app_id"
export NEXT_PUBLIC_PI_SANDBOX="true"
export NEXT_PUBLIC_API_URL="http://localhost:3000"

# Run build
npm ci
npm run build
```

**Expected Result:**
- ✅ Dependencies install successfully
- ✅ Prisma client generates
- ✅ Next.js build completes
- ✅ No errors in build output

---

### Test 9: Secret Validation Test

**Purpose:** Verify correct error messages when secrets are invalid

**This test should be done in GitHub Actions, not locally**

**Create test scenarios:**

1. **Missing VERCEL_TOKEN:**
   - Temporarily remove secret
   - Trigger workflow
   - Expected: "Invalid token" or "Unauthorized" error

2. **Wrong VERCEL_ORG_ID:**
   - Set incorrect value
   - Trigger workflow
   - Expected: "Organization not found" error

3. **Wrong VERCEL_PROJECT_ID:**
   - Set incorrect value
   - Trigger workflow
   - Expected: "Project not found" error

**Note:** Only perform these tests if you can easily restore correct values

---

### Test 10: End-to-End Integration Test

**Purpose:** Complete workflow from PR creation to production deployment

**Full Workflow:**

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/e2e-test

# 2. Make meaningful change
echo "export const TEST_FEATURE = true;" >> lib/test-feature.js
git add lib/test-feature.js
git commit -m "feat: add test feature"

# 3. Push and create PR
git push origin feature/e2e-test
gh pr create --title "feat: E2E test feature" \
  --body "Testing complete Vercel integration flow" \
  --base main

# 4. Wait for checks
# Watch PR page for all checks to complete

# 5. Review preview deployment
# Click "Details" on Vercel check
# Open preview URL and verify changes

# 6. Get approval (if required)
# Request review from team member

# 7. Merge PR
gh pr merge --squash

# 8. Verify production deployment
# Check Vercel dashboard
# Visit production URL
# Confirm changes are live
```

**Expected Result:**
- ✅ All steps complete successfully
- ✅ Preview deployment works
- ✅ Production deployment succeeds
- ✅ Changes visible on production site

---

## 📊 Test Results Template

Use this template to record test results:

```markdown
## Vercel Build Check Test Results

**Date:** YYYY-MM-DD
**Tester:** Your Name
**Branch:** test/vercel-check-validation

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| 1. Workflow file exists | ⏳ | |
| 2. Manual workflow trigger | ⏳ | |
| 3. Test PR created | ⏳ | |
| 4. Preview deployment | ⏳ | |
| 5. Branch protection | ⏳ | |
| 6. Production deployment | ⏳ | |
| 7. Vercel ignore logic | ⏳ | |
| 8. Build without secrets | ⏳ | |
| 9. Secret validation | ⏳ | |
| 10. E2E integration | ⏳ | |

**Overall Status:** ⏳ In Progress / ✅ Passed / ❌ Failed

### Issues Found:
- None / List issues here

### Recommendations:
- None / List recommendations here
```

---

## 🚨 Troubleshooting Test Failures

### Issue: Workflow doesn't appear in Actions

**Solution:**
- Verify `.github/workflows/vercel.yml` is committed to main
- Check GitHub Actions are enabled for repository
- Wait 1-2 minutes for GitHub to detect new workflow

### Issue: Check doesn't appear in PR

**Solution:**
- Verify workflow file is on the branch being merged
- Check workflow triggers match PR base branch
- Look for errors in Actions tab
- Ensure secrets are configured

### Issue: Build fails in workflow but works locally

**Solution:**
- Check environment variables in workflow
- Verify Node.js version matches (v20)
- Look for missing dependencies
- Check for file path issues (case sensitivity)

### Issue: Deployment fails with "Invalid token"

**Solution:**
- Verify VERCEL_TOKEN is correct (no spaces)
- Check token hasn't expired
- Regenerate token if needed
- Ensure token has correct permissions

### Issue: Preview URL not accessible

**Solution:**
- Wait 2-3 minutes for deployment to complete
- Check Vercel dashboard for deployment status
- Verify domain settings in Vercel
- Check for build errors in Vercel logs

---

## ✅ Test Completion Checklist

After completing all tests, verify:

- [ ] Workflow file validated and committed
- [ ] Workflow appears in GitHub Actions
- [ ] Test PR shows Vercel check
- [ ] Preview deployment succeeds
- [ ] Preview URL accessible
- [ ] Production deployment works
- [ ] Branch ignore logic correct
- [ ] Build works without deployment
- [ ] Error messages appropriate
- [ ] Documentation is accurate

---

## 🎓 Understanding Test Results

### Green Tests (All Passing)
```
✅ All checks passed
✅ Preview deployments work
✅ Production deployments succeed
→ Safe to enable branch protection
→ Ready for team use
```

### Yellow Tests (Warnings)
```
⚠️ Some non-critical issues
⚠️ Deployments work but slow
⚠️ Secrets need rotation
→ Can proceed with caution
→ Address warnings when possible
```

### Red Tests (Failures)
```
❌ Critical failures
❌ Deployments fail
❌ Build errors
→ Do not enable branch protection
→ Fix issues before proceeding
```

---

## 📞 Getting Help

If tests fail:
1. Check the detailed error messages in Actions logs
2. Review Vercel deployment logs
3. Consult [VERCEL_BUILD_CHECK_SETUP.md](./VERCEL_BUILD_CHECK_SETUP.md#-troubleshooting)
4. Check Vercel and GitHub Actions documentation
5. Open an issue with test results

---

**Test Duration:** ~30-45 minutes for complete suite  
**Minimum Required:** Tests 1, 3, 4, 6 (core functionality)  
**Recommended:** All tests before production use  
**Last Updated:** February 2026
