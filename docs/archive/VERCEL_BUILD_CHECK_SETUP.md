# 🔐 Vercel Deployment Check Setup Guide

## Overview

This guide explains how to set up the Vercel deployment check that appears in GitHub PRs and ensures proper deployment validation.

## 📋 Prerequisites

1. A Vercel account with the project already imported
2. GitHub repository with admin access
3. Vercel CLI installed (optional, for testing): `npm i -g vercel`

---

## 🔑 Step 1: Get Vercel Credentials

### 1.1 Get Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name it: `GitHub Actions - TEC Ecosystem`
4. Set scope: **Full Account**
5. Copy the token (you won't see it again!)

### 1.2 Get Vercel Organization ID

**Method 1: From Vercel CLI**
```bash
vercel link
# Follow prompts to link your project
# This creates .vercel/project.json

cat .vercel/project.json
# Copy the "orgId" value
```

**Method 2: From Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your team/account name
3. Go to **Settings** → **General**
4. Copy the **Team ID** (this is your Org ID)

### 1.3 Get Vercel Project ID

**Method 1: From .vercel/project.json**
```bash
cat .vercel/project.json
# Copy the "projectId" value
```

**Method 2: From Vercel Dashboard**
1. Go to your project in Vercel Dashboard
2. Click **Settings**
3. Copy the **Project ID** (near the top of settings page)

---

## 🔧 Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add each of these:

### Required Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `VERCEL_TOKEN` | Vercel API token | `vrc_abc123...` |
| `VERCEL_ORG_ID` | Your Vercel organization/team ID | `team_abc123xyz` or `prj_abc123` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | `prj_xyz789abc` |

### How to Add Each Secret

```bash
# For each secret:
# 1. Click "New repository secret"
# 2. Name: VERCEL_TOKEN
# 3. Value: <paste your token>
# 4. Click "Add secret"
# 
# Repeat for VERCEL_ORG_ID and VERCEL_PROJECT_ID
```

---

## 🛡️ Step 3: Configure Branch Protection

To require the Vercel check before merging PRs:

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Click **"Add rule"** (or edit existing rule for `main`)
3. Branch name pattern: `main`
4. Enable these settings:

### Required Settings

```
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  
  Search for and select these checks:
  ☑ Vercel Production/Preview Deploy
  ☑ build-and-sovereign (existing check)
  
☑ Require conversation resolution before merging
☑ Do not allow bypassing the above settings
```

### Optional but Recommended

```
☑ Require a pull request before merging
  ☑ Require approvals: 1
☑ Require linear history
☐ Require signed commits (if your team uses GPG signing)
```

---

## ✅ Step 4: Verify the Setup

### 4.1 Test with a Pull Request

1. Create a test branch:
```bash
git checkout -b test/vercel-check
echo "# Test Vercel Check" >> TEST_VERCEL.md
git add TEST_VERCEL.md
git commit -m "test: verify Vercel deployment check"
git push origin test/vercel-check
```

2. Open a Pull Request to `main` or `develop`
3. Watch the checks in the PR - you should see:
   - ✅ **Vercel Production/Preview Deploy** (new!)
   - ✅ TEC Sovereign AI Factory & Build 2026
   - ✅ Other existing checks

### 4.2 Expected Behavior

#### For Pull Requests:
- Creates a **Preview Deployment** on Vercel
- Shows preview URL in the PR check details
- Check must pass before merging (if branch protection is enabled)

#### For Push to main:
- Creates a **Production Deployment** on Vercel
- Deploys to your production domain
- Updates the deployment status

---

## 🚨 Troubleshooting

### Issue 1: "Invalid token" error

**Solution:**
- Verify your `VERCEL_TOKEN` is correct
- Check token hasn't expired
- Ensure token has correct scopes (Full Account)
- Regenerate token if needed

### Issue 2: "Project not found" error

**Solution:**
- Verify `VERCEL_PROJECT_ID` matches your project
- Ensure `VERCEL_ORG_ID` is correct
- Run `vercel link` locally to verify IDs

### Issue 3: Check doesn't appear in PR

**Solution:**
1. Verify the workflow file exists: `.github/workflows/vercel.yml`
2. Check GitHub Actions tab for error messages
3. Ensure secrets are added correctly (no extra spaces)
4. Verify workflow is enabled in Actions settings

### Issue 4: "Build failed" in workflow

**Solution:**
- Check if `npm run build` works locally
- Verify all environment variables are set
- Look at the detailed logs in GitHub Actions
- Ensure Prisma generates correctly

### Issue 5: Branch protection doesn't show Vercel check

**Solution:**
1. The check must run at least once before it appears in the list
2. Create a test PR to trigger the check first
3. Then add it to branch protection rules
4. Wait a few minutes for GitHub to register the new check

---

## 🔍 Verification Checklist

Before going to production, verify:

- [ ] All three secrets are added to GitHub repository secrets
- [ ] Workflow file exists at `.github/workflows/vercel.yml`
- [ ] Workflow is enabled in Actions settings
- [ ] Test PR shows Vercel check in the checks list
- [ ] Vercel check creates a preview deployment
- [ ] Preview URL is accessible and shows the correct content
- [ ] Branch protection rule includes Vercel check
- [ ] Merging is blocked until Vercel check passes
- [ ] Push to main triggers production deployment
- [ ] Production deployment succeeds and updates live site

---

## 📊 Understanding the Workflow

### What the Workflow Does

1. **Triggers on:**
   - Push to `main` or `develop` branches
   - Pull requests targeting `main` or `develop`

2. **Steps:**
   - Checks out code
   - Installs dependencies
   - Generates Prisma client
   - Builds Next.js (verification step)
   - Deploys to Vercel (Production or Preview)
   - Reports deployment URL

3. **Creates:**
   - Status check visible in PRs
   - Deployment preview for PRs
   - Production deployment for main branch

### Workflow Permissions

The workflow needs these permissions:
- `contents: read` - Read repository content
- `deployments: write` - Create GitHub deployments
- `statuses: write` - Update commit statuses
- `checks: write` - Create check runs
- `pull-requests: write` - Comment on PRs

---

## 🎯 Benefits

### For Development
- ✅ Preview deployments for every PR
- ✅ Test changes before merging
- ✅ Verify builds succeed before deployment
- ✅ Catch deployment issues early

### For Production
- ✅ Automated production deployments
- ✅ Consistent deployment process
- ✅ Deployment status visible in GitHub
- ✅ Audit trail of all deployments

### For Team
- ✅ Required check prevents broken deployments
- ✅ Preview URLs for stakeholder review
- ✅ Confidence in merge safety
- ✅ Reduced manual deployment work

---

## 📚 Related Documentation

- [VERCEL_CONFIG_GUIDE.md](./VERCEL_CONFIG_GUIDE.md) - Complete Vercel configuration
- [VERCEL_DEPLOYMENT_CHECKS.md](./VERCEL_DEPLOYMENT_CHECKS.md) - All deployment checks
- [vercel.json](../vercel.json) - Vercel configuration file
- [Official Vercel GitHub Action](https://github.com/amondnet/vercel-action)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check GitHub Actions logs:** Repository → Actions → Select failed workflow
2. **Check Vercel logs:** Vercel Dashboard → Deployments → Select deployment → Logs
3. **Verify secrets:** Ensure no typos or extra spaces in secret values
4. **Test locally:** Run `npm run build` to verify the build works
5. **Community help:** 
   - Vercel Discord: https://vercel.com/discord
   - GitHub Discussions in this repo

---

## 🔄 Updating the Setup

### To Update Vercel Token

1. Generate new token in Vercel
2. Update `VERCEL_TOKEN` secret in GitHub
3. Next workflow run will use new token

### To Change Deployment Behavior

Edit `.github/workflows/vercel.yml`:
- Add environment variables
- Change trigger conditions
- Modify deployment arguments
- Add post-deployment steps

---

**Last Updated:** February 2026  
**Status:** ✅ Ready for Production  
**Maintained by:** TEC DevOps Team
