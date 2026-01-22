---
name: Copilot Autovalidate Failure
about: Report a GitHub Copilot Pull Request Reviewer autovalidate failure
title: '[AUTOVALIDATE] Workflow failed on PR #'
labels: ['ci/cd', 'external-tool', 'blocked']
assignees: []

---

## Failure Information

**PR Number**: #
**Workflow Run URL**: https://github.com/tec-ecosystem/tec-ecosystem/actions/runs/
**Failed Job URL**: https://github.com/tec-ecosystem/tec-ecosystem/actions/runs//job/
**Date**: YYYY-MM-DD

## Error Details

**Error Message**:
```
[Paste the error message here]
```

**Failed Step**:
- [ ] ESLint validation
- [ ] PMD validation
- [ ] Other (specify): _____________

## Checks Status

- [ ] ✅ ESLint validation passed
- [ ] ✅ CodeQL security scan passed
- [ ] ✅ Other repository checks passed
- [ ] ❌ Autovalidate failed

## Local Verification

Have you verified the code locally?

- [ ] `npm run lint` - No errors
- [ ] `npm test` - All tests pass
- [ ] `npm run build` - Build succeeds
- [ ] Code has been manually reviewed

## PR Characteristics

**PR Size**:
- Lines added: 
- Lines deleted:
- Files changed:

**Contains**:
- [ ] Multi-byte UTF-8 characters (Arabic, Chinese, emoji, etc.)
- [ ] Very small files (< 500 bytes)
- [ ] Large architectural changes
- [ ] New dependencies

## Workarounds Attempted

- [ ] Retried the workflow
- [ ] Split PR into smaller changes
- [ ] Checked file encodings (all UTF-8)
- [ ] Verified line endings (consistent)
- [ ] None yet

## Workaround Result

Did any workaround resolve the issue?
- [ ] Yes - Which one? _____________
- [ ] No - Still blocked

## Additional Context

Add any other context, screenshots, or relevant information:

---

## For Maintainers

This appears to be a known issue with GitHub's Copilot autovalidate tool. See:
- [Full Bug Report](../GITHUB_COPILOT_AUTOVALIDATE_BUG_REPORT.md)
- [Workaround Guide](../.github/COPILOT_AUTOVALIDATE_WORKAROUND.md)
- [Quick Reference](../COPILOT_AUTOVALIDATE_ISSUE.md)

**Action**: Consider applying workarounds from the guide or escalating to GitHub Support if recurring.
