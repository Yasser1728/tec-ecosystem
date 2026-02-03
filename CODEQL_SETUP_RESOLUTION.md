# CodeQL Setup Resolution

## Issue

The repository encountered a conflict between two CodeQL configurations:

1. **Default CodeQL Setup**: Managed automatically by GitHub (dynamic workflow)
2. **Advanced CodeQL Configuration**: Custom workflow file at `.github/workflows/codeql.yml`

### Error Message

```
Code Scanning could not process the submitted SARIF file:
CodeQL analyses from advanced configurations cannot be processed when the default setup is enabled
```

## Resolution

**Removed the advanced CodeQL workflow file** (`.github/workflows/codeql.yml`) to resolve the conflict.

### Why This Solution?

- GitHub's default CodeQL setup provides automatic security scanning without manual configuration
- The default setup is sufficient for most repositories and is maintained by GitHub
- Having both configurations creates a conflict and prevents SARIF file processing
- The default setup path is `dynamic/github-code-scanning/codeql`

## Current Setup

The repository now uses **CodeQL Default Setup** exclusively:

- **Workflow Path**: `dynamic/github-code-scanning/codeql`
- **Management**: Automatically managed by GitHub
- **Languages**: JavaScript, TypeScript, and GitHub Actions
- **Triggers**: Automatically runs on push, pull requests, and scheduled scans

## Benefits

✅ No manual workflow maintenance required  
✅ Automatic updates to CodeQL queries and rules  
✅ Simplified security scanning configuration  
✅ No SARIF file conflicts  
✅ Consistent with GitHub's recommended practices

## If Advanced Configuration Is Needed

If you need custom CodeQL queries or advanced configuration in the future:

1. **Disable** the default CodeQL setup in repository settings:
   - Go to `Settings` → `Code security and analysis`
   - Find "Code scanning" section
   - Disable "CodeQL analysis"

2. **Re-add** the advanced configuration workflow file

⚠️ **Note**: You cannot have both default setup and advanced configuration enabled simultaneously.

## Related Documentation

- [GitHub CodeQL Documentation](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
- [Default vs Advanced Setup](https://docs.github.com/en/code-security/code-scanning/enabling-code-scanning/configuring-default-setup-for-code-scanning)

---

## Additional Notes

### MSVC Workflow - REMOVED ✅

The repository previously had a `msvc.yml` workflow for Microsoft C++ Code Analysis. This workflow has been **removed** because:
- It was designed for C++ projects and required CMakeLists.txt
- This is a JavaScript/TypeScript/Node.js project with no C++ code
- The workflow was failing with error: "The source directory does not appear to contain CMakeLists.txt"
- Workflow run: https://github.com/Yasser1728/tec-ecosystem/actions/runs/21631111947/job/62343922037

**Status**: ✅ Removed in this PR (not applicable to this project)

### Verification

After merging this PR, verify that:
1. The default CodeQL setup continues to run successfully
2. Security scanning results appear in the Security tab
3. No SARIF processing errors occur

---

**Date**: 2026-02-03  
**Action**: Removed `.github/workflows/codeql.yml` to resolve configuration conflict  
**Status**: ✅ Resolved
