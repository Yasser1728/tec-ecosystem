# Repository Cleanup Instructions

## Overview
This document provides instructions for completing the repository cleanup process. The cleanup involves closing open pull requests and deleting unnecessary branches.

## Completed Tasks ✅

### GitHub Actions Workflows Deleted
The following unnecessary workflow files have been removed:
- ✅ `.github/workflows/test.yml` - Disabled workflow
- ✅ `.github/workflows/deploy-ready.yml` - Disabled workflow  
- ✅ `.github/workflows/security.yml` - Manually disabled, redundant with dynamic CodeQL
- ✅ `.github/workflows/codeql.yml` - Manually disabled, redundant with dynamic CodeQL

### Active Workflows Retained
The following essential workflows remain active:
- `codacy.yml` - Code quality scanning
- `domain-policy-check.yml` - Domain policy enforcement
- `lint.yml` - Code linting
- `main.yml` - TEC Sovereign AI Factory & Build
- `sovereign-factory.yml` - TEC Sovereign AI Factory & Pi Network
- Dynamic workflows: Dependabot, Pages, Copilot agents, CodeQL

## Manual Tasks Required ⚠️

### 1. Close Open Pull Requests

**Total Open PRs: 30**

The following pull requests should be reviewed and closed manually:

#### Dependabot PRs (Can be closed if not needed)
- PR #312 - bump lodash from 4.17.21 to 4.17.23
- PR #299 - bump eslint-config-next from 15.5.9 to 16.1.4
- PR #298 - bump tailwindcss from 3.4.19 to 4.1.18
- PR #297 - bump @commitlint/config-conventional from 18.6.3 to 20.3.1
- PR #296 - bump @commitlint/cli from 18.6.1 to 20.3.1
- PR #295 - bump eslint from 8.57.1 to 9.39.2
- PR #294 - bump production-dependencies group
- PR #293 - bump github-actions group
- PR #292 - bump development-dependencies group

#### Work in Progress / Feature PRs
- PR #313 - [WIP] Remove unnecessary actions and close open pull requests (THIS PR)
- PR #285 - [WIP] Add AI layer to TEC Assistant with bilingual support
- PR #268 - Fix all Codacy code quality violations
- PR #266 - Add safe path resolution and domain validation
- PR #260 - Fix CodeQL Action v3 deprecation
- PR #255 - Fix Codacy issues in PR #240: Critical cleanup logic
- PR #254 - Fix Codacy issues in PR #240: critical test bug
- PR #253 - Fix 18 Codacy issues in PR #240
- PR #252 - Fix 7 Codacy issues in PR #240
- PR #251 - Fix critical logic error in PR #240
- PR #250 - Fix beforeEach cleanup logic in governance tests
- PR #240 - Add sovereign domain task map with path-safe runner
- PR #239 - Add API protection with rate limiting
- PR #238 - Implement API hardening with rate limiting
- PR #237 - Add API protection, cost guard
- PR #236 - Enhance Codacy configuration
- PR #230 - Enhance Codacy configuration with comprehensive exclusions
- PR #226 - Configure Codacy exclusions
- PR #219 - Update AI agent config
- PR #215 - Stabilize quickstart Jest suites
- PR #213 - Restore Option C orchestrator

**How to close PRs:**
```bash
# Using GitHub CLI
gh pr close <PR_NUMBER> --comment "Closing as part of repository cleanup"

# Or via GitHub web interface:
# 1. Navigate to https://github.com/tec-ecosystem/tec-ecosystem/pulls
# 2. Click on each PR
# 3. Click "Close pull request" button
```

### 2. Delete Unnecessary Branches

**Total Branches: ~60+ (excluding main and staging)**

#### Branch Categories to Delete:

**Patch Branches:**
- `Yasser1728-patch-1`
- `Yasser1728-patch-2`
- `Yasser1728-patch-3`

**Alert/Fix Branches:**
- `alert-autofix-38`

**Copilot Feature Branches (after reviewing associated PRs):**
- `copilot/add-ai-layer-bilingual-support`
- `copilot/add-api-guard-rate-limiting`
- `copilot/add-api-protection-updates`
- `copilot/add-comment-for-codacy-warning`
- `copilot/add-complete-configuration-system`
- `copilot/add-error-handling-system`
- `copilot/add-performance-optimization-system`
- `copilot/add-rate-limiting-security-system`
- `copilot/add-security-configuration-to-tec-ecosystem`
- `copilot/add-sovereign-ai-agent-layer`
- `copilot/add-tecpi-domain`
- `copilot/add-vercel-configuration`
- `copilot/analyze-django-security-issues`
- `copilot/build-4-commerce-structure`
- `copilot/choredocs-architecture-api-mapping`
- `copilot/create-api-routes-prisma-integration`
- `copilot/create-complete-api-system`
- `copilot/create-complete-domain-seeder`
- `copilot/create-css-styling-system`
- `copilot/create-documentation-system`
- `copilot/create-domain-data-hub`
- `copilot/create-env-config-system`
- `copilot/create-env-example-file`
- `copilot/create-insure-domain-structure`
- `copilot/create-prisma-database-schema`
- `copilot/create-rate-limiting-system`
- `copilot/remove-unused-actions-and-branches` (after merging PR #313)

**Dependabot Branches:**
- `dependabot/npm_and_yarn/development-dependencies-d47aee0d8c`
- `dependabot/npm_and_yarn/eslint-9.39.2`
- `dependabot/npm_and_yarn/eslint-config-next-16.1.4`
- `dependabot/npm_and_yarn/lodash-4.17.23`
- `dependabot/npm_and_yarn/production-dependencies-d7d8757dda`
- `dependabot/npm_and_yarn/tailwindcss-4.1.18`

**Feature Branches (review before deletion):**
- `feature/architecture-map-seed`
- `feature/domains-readme-refactor`

**Fix Branches:**
- `fix/ai-agent-module`
- `fix/restore-domain-task-map`

**Branches to KEEP:**
- ✅ `main` (protected)
- ✅ `staging` (active development)

**How to delete branches:**
```bash
# Using GitHub CLI (delete multiple branches)
gh api repos/tec-ecosystem/tec-ecosystem/git/refs/heads/BRANCH_NAME -X DELETE

# Or via GitHub web interface:
# 1. Navigate to https://github.com/tec-ecosystem/tec-ecosystem/branches
# 2. Click the delete icon (trash) next to each branch
# 3. Confirm deletion

# Or using git commands (after closing PRs):
git push origin --delete BRANCH_NAME
```

### 3. Recommended Cleanup Script

Save this as `cleanup-branches.sh` and run it after closing all PRs:

```bash
#!/bin/bash

# Array of branches to delete
BRANCHES=(
  "Yasser1728-patch-1"
  "Yasser1728-patch-2"
  "Yasser1728-patch-3"
  "alert-autofix-38"
  "copilot/add-ai-layer-bilingual-support"
  "copilot/add-api-guard-rate-limiting"
  "copilot/add-api-protection-updates"
  "copilot/add-comment-for-codacy-warning"
  "copilot/add-complete-configuration-system"
  "copilot/add-error-handling-system"
  "copilot/add-performance-optimization-system"
  "copilot/add-rate-limiting-security-system"
  "copilot/add-security-configuration-to-tec-ecosystem"
  "copilot/add-sovereign-ai-agent-layer"
  "copilot/add-tecpi-domain"
  "copilot/add-vercel-configuration"
  "copilot/analyze-django-security-issues"
  "copilot/build-4-commerce-structure"
  "copilot/choredocs-architecture-api-mapping"
  "copilot/create-api-routes-prisma-integration"
  "copilot/create-complete-api-system"
  "copilot/create-complete-domain-seeder"
  "copilot/create-css-styling-system"
  "copilot/create-documentation-system"
  "copilot/create-domain-data-hub"
  "copilot/create-env-config-system"
  "copilot/create-env-example-file"
  "copilot/create-insure-domain-structure"
  "copilot/create-prisma-database-schema"
  "copilot/create-rate-limiting-system"
  "dependabot/npm_and_yarn/development-dependencies-d47aee0d8c"
  "dependabot/npm_and_yarn/eslint-9.39.2"
  "dependabot/npm_and_yarn/eslint-config-next-16.1.4"
  "dependabot/npm_and_yarn/lodash-4.17.23"
  "dependabot/npm_and_yarn/production-dependencies-d7d8757dda"
  "dependabot/npm_and_yarn/tailwindcss-4.1.18"
  "feature/architecture-map-seed"
  "feature/domains-readme-refactor"
  "fix/ai-agent-module"
  "fix/restore-domain-task-map"
)

# Delete each branch
for branch in "${BRANCHES[@]}"; do
  echo "Deleting branch: $branch"
  git push origin --delete "$branch" 2>/dev/null || echo "  - Failed or already deleted"
done

echo "Cleanup complete!"
```

## Verification

After completing the manual tasks:

1. Verify no unnecessary workflows remain:
   ```bash
   ls -la .github/workflows/
   ```

2. Verify PR count:
   ```bash
   gh pr list --state open --limit 100
   ```

3. Verify branch count:
   ```bash
   git branch -r | wc -l
   ```

## Notes

- The `main` branch is protected and should not be deleted
- The `staging` branch is active and should be retained
- Before deleting feature branches, ensure their work is either merged or no longer needed
- Dependabot branches can be deleted if the corresponding PRs are closed
- Copilot branches can be deleted after their PRs are closed

## Security Considerations

✅ All disabled workflows contained comprehensive security scanning but were redundant with:
- Dynamic CodeQL workflow (active)
- Codacy security scanning (active)
- Domain policy checks (active)

No security capabilities were lost by removing the disabled workflows.

---

**Last Updated:** 2026-01-22
**Status:** Workflow cleanup complete, manual tasks pending
