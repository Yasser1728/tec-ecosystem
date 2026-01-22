# Workaround Guide: GitHub Copilot Autovalidate Failures

## Quick Summary

If you encounter errors in the GitHub Copilot Pull Request Reviewer's autovalidate step, this is likely due to known bugs in GitHub's infrastructure. This guide provides practical workarounds.

## Common Error Patterns

### Pattern 1: Slice Bounds Panic (PR #310)
- ❌ Error message: `panic: runtime error: slice bounds out of range`
- Other checks (ESLint, CodeQL) pass successfully
- The failing job is "Run PMD on example"

### Pattern 2: Path/File Not Found (PR #313+)
- ❌ Error message: `failed to delete file .github/workflows/test.yml: no such file or directory`
- Error path includes: `/repo/.github/workflows/...`
- Root cause: Wrong `--source-root ./repo` configuration
- See detailed fix: [AUTOVALIDATE_PATH_ERROR_FIX.md](../AUTOVALIDATE_PATH_ERROR_FIX.md)

## Immediate Workarounds

### Option 1: Retry the Workflow ⚡ (Recommended First Step)

GitHub Actions workflows can sometimes have transient issues. Simply retry:

```bash
# Via GitHub CLI
gh run rerun <run-id> --failed

# Via GitHub UI
# 1. Go to the failed workflow run
# 2. Click "Re-run failed jobs"
```

### Option 2: Manual Code Review and Merge 👤

If the autovalidate continues to fail but all other checks pass:

1. **Verify Code Quality Locally**:
   ```bash
   npm run lint          # Should pass
   npm test             # Should pass
   npm run build        # Should build successfully
   ```

2. **Manual Review Checklist**:
   - [ ] Code follows project conventions
   - [ ] No security vulnerabilities
   - [ ] Tests are included and pass
   - [ ] Documentation is updated
   - [ ] No secrets in code

3. **Merge with Override**:
   - If you have admin permissions and branch protection allows
   - Document why autovalidate was bypassed in the merge commit

### Option 3: Disable Copilot PR Review (Temporary) 🔧

If this becomes a recurring blocker:

1. Contact your repository administrator
2. Request temporary disabling of GitHub Copilot Pull Request Reviewer
3. Use manual code review process
4. Re-enable after GitHub fixes the tool

### Option 4: Adjust PR to Avoid Trigger 🎯

Sometimes specific file patterns trigger the bug:

1. **Split Large PRs**: 
   - Break into smaller, focused PRs
   - Helps isolate the problematic file

2. **Check for Special Characters**:
   - Files with heavy multi-byte UTF-8 (Arabic, Chinese, emoji)
   - Consider ASCII-only commit messages
   - Ensure consistent line endings (LF)

3. **Avoid Tiny Files**:
   - The bug often occurs with files < 500 bytes
   - Consider consolidating very small modules

## Verification Steps

Before requesting a merge override, verify:

```bash
# 1. Lint the code
npm run lint
# Expected: ✓ No errors

# 2. Run tests
npm test
# Expected: ✓ All tests pass

# 3. Build the project
npm run build
# Expected: ✓ Build succeeds

# 4. Check for TypeScript errors
npx tsc --noEmit
# Expected: ✓ No errors

# 5. Security scan (if available)
npm audit --audit-level=moderate
# Expected: ✓ No vulnerabilities above moderate
```

## When to Use Each Option

| Situation | Recommended Option | Why |
|-----------|--------------------|--------------------|
| First occurrence | Option 1 (Retry) | Quick, often works |
| Urgent fix needed | Option 2 (Manual merge) | Unblocks deployment |
| Recurring issue | Option 3 (Disable) | Prevents wasted time |
| Specific file pattern | Option 4 (Adjust PR) | Avoids bug trigger |

## Escalation Path

If workarounds don't help:

1. **Document the Failure**:
   - Workflow run URL
   - Job ID
   - PR number
   - Screenshot of error

2. **Open GitHub Support Ticket**:
   - Reference: Known issue with autovalidate tool
   - Provide: Workflow run URL
   - Request: Engineering team review

3. **Track the Issue**:
   - Monitor GitHub's status page
   - Check for autovalidate updates
   - Test periodically after updates

## Prevention Tips

While we wait for GitHub to fix the tool:

### For PR Authors

- ✅ Keep PRs focused and reasonably sized
- ✅ Run local linting before pushing
- ✅ Use consistent text encoding (UTF-8)
- ✅ Maintain consistent line endings (LF)
- ✅ Test builds locally

### For Maintainers

- ✅ Document known autovalidate issues
- ✅ Have clear manual review criteria
- ✅ Maintain local CI/CD as backup
- ✅ Keep team informed of workarounds

## Additional Resources

- [Full Bug Report](../GITHUB_COPILOT_AUTOVALIDATE_BUG_REPORT.md)
- [Quick Reference](../COPILOT_AUTOVALIDATE_ISSUE.md)
- [GitHub Support](https://support.github.com/)

## Questions?

If you encounter a new pattern of this issue:

1. Document it in this repository's issues
2. Share the workflow run URL
3. Update this guide with your findings

---

**Last Updated**: 2026-01-22  
**Status**: Known issue with GitHub's infrastructure  
**ETA for Fix**: Pending GitHub Engineering response
