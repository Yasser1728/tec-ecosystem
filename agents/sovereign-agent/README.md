# Sovereign Agent - Security Documentation

## Overview
The Sovereign Agent implements a secure filesystem access pattern that prevents path traversal vulnerabilities and constrains all file operations to a designated allowlist directory.

## Security Features

### 1. Filesystem Allowlist Guard
All file outputs are constrained to the `domains/` directory through the `resolveSafeDomainPath()` function.

**Implementation:**
```javascript
const DOMAINS_BASE = path.resolve('domains');

function resolveSafeDomainPath(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    throw new Error('Invalid relative path');
  }

  // Reject absolute paths explicitly
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Absolute paths not allowed: ${relativePath}`);
  }

  // Use path.join to prevent absolute path override
  const fullPath = path.join(DOMAINS_BASE, relativePath);

  // Normalize to handle different path separators (Windows/Unix)
  const normalizedFull = path.normalize(fullPath);
  const normalizedBase = path.normalize(DOMAINS_BASE);

  // Use path.relative to detect traversal attempts
  const relative = path.relative(normalizedBase, normalizedFull);
  
  // If the relative path starts with '..', it's trying to escape
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Blocked path traversal attempt: ${relativePath}`);
  }

  return normalizedFull;
}
```

### 2. Path Traversal Protection
The guard function implements multiple layers of protection:

**Layer 1: Absolute Path Detection**
- Uses `path.isAbsolute()` to explicitly reject absolute paths
- Prevents paths like `/etc/passwd` or `C:\Windows\System32`

**Layer 2: Path Join Protection**
- Uses `path.join()` instead of `path.resolve()` to prevent absolute path override
- Ensures the base directory is always respected

**Layer 3: Cross-Platform Normalization**
- Normalizes paths to handle different separators (Windows `\` vs Unix `/`)
- Works consistently across operating systems

**Layer 4: Relative Path Analysis**
- Uses `path.relative()` to detect if the resolved path escapes the base
- Blocks any path where the relative result starts with `..`

**Blocked Attack Vectors:**
- Absolute paths: `/etc/passwd`, `C:\Windows\...`
- Parent directory traversal: `../../../etc/passwd`
- Relative paths that escape: `tec/../../agents/index.js`
- Invalid inputs: `null`, `undefined`, empty strings

### 3. Addressed Codacy Findings
This implementation fixes Codacy Static Code Analysis warnings related to:
- Dynamic file/path construction
- Potential user input in `path.join`/`path.resolve`
- Path traversal vulnerabilities

**Fixed Warning Patterns:**
- Lines that previously used `path.join()` or `path.resolve()` with user input now use the `resolveSafeDomainPath()` guard
- All file operations are constrained to the `domains/` directory
- No absolute paths or directory traversal is possible

## Usage

### Running the Agent
```bash
node agents/sovereign-agent/index.js
```

### Task Configuration
Tasks are defined in `task-map.js`:
```javascript
const TASK_MAP = [
  {
    domain: 'tec',
    prompt: 'Generate core TEC services documentation',
    output: 'README.md'
  }
];
```

### Ledger
All operations are logged to `agents/sovereign-agent/ledger.json` with:
- Domain
- Task name
- Model used
- Token usage
- Output path
- Timestamp

## Architecture

```
agents/sovereign-agent/
├── index.js              # Main orchestrator with security guard
├── openrouter.client.js  # LLM API client
├── task-map.js          # Task definitions
└── ledger.json          # Append-only operation log
```

## Security Testing

The implementation has been validated against multiple attack vectors:

**✅ Valid Path Tests:**
1. `tec/README.md` → Resolves to `domains/tec/README.md`
2. `finance/integration.md` → Resolves to `domains/finance/integration.md`

**✅ Attack Prevention Tests:**
1. **Absolute paths:** `/etc/passwd` → ❌ Blocked
2. **Windows absolute:** `C:\Windows\System32` → ❌ Blocked (platform-specific)
3. **Parent traversal:** `../etc/passwd` → ❌ Blocked
4. **Complex traversal:** `../../agents/sovereign-agent/index.js` → ❌ Blocked
5. **Mid-path traversal:** `tec/../../etc/passwd` → ❌ Blocked
6. **Null input:** `null` → ❌ Rejected
7. **Empty string:** `''` → ❌ Rejected

All tests pass successfully, confirming the security boundaries are enforced across platforms.

## Compliance

This implementation addresses the security requirements by:
1. ✅ Implementing filesystem allowlist
2. ✅ Blocking path traversal attempts
3. ✅ Constraining outputs to `domains/` directory
4. ✅ Using ESM-compatible import syntax
5. ✅ Maintaining append-only ledger
6. ✅ Preventing absolute path access
