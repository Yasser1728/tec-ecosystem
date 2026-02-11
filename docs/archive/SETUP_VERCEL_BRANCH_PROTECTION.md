# 🛡️ Branch Protection Setup for Vercel Checks

## Quick Setup Guide

This is a condensed guide for setting up branch protection to require Vercel checks.

---

## ⚡ Quick Steps

### 1. Add GitHub Secrets (5 minutes)

Go to: **Repository Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these three secrets:

```
VERCEL_TOKEN         = <your-vercel-api-token>
VERCEL_ORG_ID        = <your-vercel-org-id>
VERCEL_PROJECT_ID    = <your-vercel-project-id>
```

**How to get these values:** See [VERCEL_BUILD_CHECK_SETUP.md](./VERCEL_BUILD_CHECK_SETUP.md#-step-1-get-vercel-credentials)

---

### 2. Test the Check (2 minutes)

Create a test PR to register the check:

```bash
git checkout -b test/vercel-check
echo "test" >> .gitignore
git add .gitignore
git commit -m "test: trigger vercel check"
git push origin test/vercel-check
```

Open a PR, wait for checks to complete, then you can close it.

---

### 3. Enable Branch Protection (3 minutes)

Go to: **Repository Settings** → **Branches** → **Add rule**

**Branch name pattern:** `main`

#### Required Settings:

```
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  
  Status checks that are required:
  ☑ Vercel Production/Preview Deploy
  ☑ build-and-sovereign
```

#### Recommended Settings:

```
☑ Require a pull request before merging
  ☑ Require approvals: 1
  ☐ Dismiss stale pull request approvals when new commits are pushed
  
☑ Require conversation resolution before merging
☑ Do not allow bypassing the above settings
☑ Include administrators
```

Click **Create** to save the rule.

---

### 4. Repeat for develop branch (Optional)

If you use a `develop` branch, repeat step 3 with pattern: `develop`

---

## ✅ Verification

After setup, create a new PR and verify:

1. **Check appears in PR:**
   - Look for "Vercel Production/Preview Deploy" in the checks section

2. **Check creates preview:**
   - Click "Details" on the check to see preview URL

3. **Merge is blocked until checks pass:**
   - Try to merge before checks complete - should be blocked
   - After checks pass - merge button becomes available

4. **Production deployment after merge:**
   - After merging to main, check Vercel dashboard
   - Should see new production deployment

---

## 🎯 Expected Check Names

In your PRs, you should now see these checks:

```
Checks:
├─ ✅ Vercel Production/Preview Deploy    ← NEW!
├─ ✅ TEC Sovereign AI Factory & Build 2026
├─ ✅ domain-policy-check
└─ ✅ (other existing checks)
```

---

## 🚨 Common Issues

### "Vercel Production/Preview Deploy" doesn't appear in status checks list

**Fix:** The check must run at least once before GitHub recognizes it.
1. Create a test PR to trigger the workflow
2. Wait for it to complete (pass or fail)
3. Close the test PR
4. Now it will appear in the branch protection settings

### Secrets are added but workflow fails with "Invalid token"

**Fix:** Check for extra spaces or newlines in secret values
1. Delete the secret
2. Re-add it, ensuring no spaces before/after the value
3. Trigger the workflow again

### Check runs but doesn't show preview URL

**Fix:** Check the workflow logs
1. Go to Actions tab → Select the workflow run
2. Look for errors in the "Deploy to Vercel" step
3. Verify all three secrets are correct

---

## 📝 What Gets Protected

With these settings:

| Action | Allowed? | Notes |
|--------|----------|-------|
| Direct push to main | ❌ No | Must use PR |
| Merge PR without checks passing | ❌ No | Checks must be green |
| Merge PR with failed Vercel check | ❌ No | Deployment must succeed |
| Merge PR with unresolved comments | ❌ No | All discussions must resolve |
| Merge PR with approvals + passing checks | ✅ Yes | Safe to merge |

---

## 🔄 Testing the Protection

### Test 1: Try to merge with failing check

1. Create a PR with a build error
2. Watch Vercel check fail
3. Verify merge is blocked
4. Fix the error
5. Verify check passes and merge is allowed

### Test 2: Preview deployment works

1. Create a PR with a visible change
2. Wait for Vercel check to complete
3. Click "Details" on the check
4. Open preview URL
5. Verify your changes are visible

### Test 3: Production deployment after merge

1. Merge a PR to main
2. Go to Vercel dashboard
3. Verify production deployment starts
4. Check your production URL shows the changes

---

## 📋 Complete Setup Checklist

- [ ] `VERCEL_TOKEN` added to GitHub secrets
- [ ] `VERCEL_ORG_ID` added to GitHub secrets  
- [ ] `VERCEL_PROJECT_ID` added to GitHub secrets
- [ ] Test PR created to register the check
- [ ] Branch protection rule created for `main`
- [ ] "Vercel Production/Preview Deploy" added to required checks
- [ ] "Require status checks to pass" is enabled
- [ ] "Require pull request" is enabled (recommended)
- [ ] Test PR shows Vercel check running
- [ ] Preview URL is accessible
- [ ] Merge is blocked until checks pass
- [ ] Production deployment works after merge to main

---

## 🎓 Understanding the Setup

### What You're Protecting

**Before this setup:**
- Code could be merged without deployment validation
- Broken builds might reach production
- No preview deployments for PRs

**After this setup:**
- Every PR gets a preview deployment
- Merge is blocked if deployment fails
- Production automatically updates on merge
- Team can review changes on preview URL

### The Check Flow

```
Developer opens PR
  ↓
GitHub Actions triggers
  ↓
Builds Next.js app
  ↓
Deploys to Vercel Preview
  ↓
Check status updates (✅ or ❌)
  ↓
If ✅: Merge allowed
If ❌: Merge blocked
```

---

## 🆘 Need More Help?

See the complete guide: [VERCEL_BUILD_CHECK_SETUP.md](./VERCEL_BUILD_CHECK_SETUP.md)

---

**Quick Setup Time:** ~10 minutes  
**Status:** Production Ready  
**Last Updated:** February 2026
