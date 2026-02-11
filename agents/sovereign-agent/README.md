# Sovereign Agent - Secure Filesystem Operations

## Overview

The Sovereign Agent is a secure filesystem management module for the TEC ecosystem. It implements Codacy-compliant security guards to prevent path traversal attacks and ensure all file operations are contained within designated directories.

## Security Features

### 1. Canonical Containment Resolver with Symlink Protection

The core security function `resolveSafePath(baseDir, targetPath)` implements a canonical containment pattern with enhanced symlink protection:

```javascript
const safePath = resolveSafePath(DOMAINS_BASE, userInputPath);
```

**How it works:**
- Uses `fs.realpathSync.native()` to resolve the base directory to its canonical form (following symlinks)
- Resolves the target path and attempts to get its canonical form
- For non-existent paths, checks if parent directories exist and resolves them canonically
- Checks that the resolved target starts with the base directory + path separator
- Throws an error if path traversal is detected
- Prevents attacks using `../`, absolute paths, or symbolic links
- Protects against symlink-based directory escapes

### 2. Guarded Filesystem Operations

All Node.js `fs` operations are wrapped with security guards:

| Unsafe Operation | Safe Wrapper | Security Guard |
|-----------------|--------------|----------------|
| `fs.writeFileSync()` | `safeWriteFile()` | ✅ Uses `resolveSafePath()` |
| `fs.readFileSync()` | `safeReadFile()` | ✅ Uses `resolveSafePath()` |
| `fs.existsSync()` | `safeFileExists()` | ✅ Uses `resolveSafePath()` |
| `fs.mkdirSync()` | `safeMkdir()` | ✅ Uses `resolveSafePath()` |

### 3. Stable Filesystem Roots

Three stable roots are defined at module initialization:

```javascript
const PROJECT_ROOT = path.resolve(process.cwd());
const DOMAINS_BASE = path.resolve(PROJECT_ROOT, 'domains');
const LEDGER_PATH = path.resolve(PROJECT_ROOT, 'agents/sovereign-agent/ledger.json');
```

These roots are:
- Absolute paths
- Resolved at startup
- Immutable during runtime
- Used as base directories for all file operations

## Usage

### Domain File Operations

```javascript
import { writeDomainFile, readDomainFile, domainFileExists } from './agents/sovereign-agent/index.js';

// Write a file to a domain
const result = writeDomainFile('tec.pi', 'config.json', JSON.stringify(config));

// Read a file from a domain
const data = readDomainFile('tec.pi', 'config.json');

// Check if a file exists
const exists = domainFileExists('tec.pi', 'config.json');
```

### Ledger Management

```javascript
import { loadLedger, recordTransaction } from './agents/sovereign-agent/index.js';

// Load the ledger
const ledger = loadLedger();

// Record a transaction
recordTransaction({
  type: 'domain_operation',
  domain: 'tec.pi',
  action: 'update',
  success: true
});
```

### Direct Safe Operations

```javascript
import { safeWriteFile, safeReadFile, DOMAINS_BASE } from './agents/sovereign-agent/index.js';

// Write with explicit base directory
const path = safeWriteFile(DOMAINS_BASE, 'custom/path/file.txt', 'content');

// Read with explicit base directory
const content = safeReadFile(DOMAINS_BASE, 'custom/path/file.txt');
```

## API Reference

### Security Functions

#### `resolveSafePath(baseDir, targetPath)`
Resolves a path and ensures it's contained within the base directory.
- **Parameters:**
  - `baseDir` (string): The base directory that must contain the target
  - `targetPath` (string): The target path to resolve
- **Returns:** The safe resolved path (string)
- **Throws:** Error if the resolved path escapes the base directory

### Filesystem Operations

#### `safeWriteFile(baseDir, relativePath, content)`
Safely write content to a file within a guarded directory.

#### `safeReadFile(baseDir, relativePath)`
Safely read a file within a guarded directory.

#### `safeFileExists(baseDir, relativePath)`
Safely check if a file exists within a guarded directory.

#### `safeMkdir(baseDir, relativePath)`
Safely create a directory within a guarded directory.

### Domain Operations

#### `writeDomainFile(domain, fileName, content)`
Write output to a domain folder with security guards.

#### `readDomainFile(domain, fileName)`
Read a file from a domain folder with security guards.

#### `domainFileExists(domain, fileName)`
Check if a domain file exists with security guards.

#### `createDomainDirectory(domain)`
Create a domain directory with security guards.

### Ledger Operations

#### `loadLedger()`
Initialize or load the ledger with security guards.

#### `saveLedger(ledgerData)`
Save the ledger with security guards.

#### `recordTransaction(transaction)`
Record a transaction in the ledger. Transaction IDs are generated using `crypto.randomUUID()` for secure, cryptographically random identifiers.

### Task Execution

#### `executeDomainTask(taskConfig)`
Execute a domain task with full security guards.

#### `processDomains(domains, taskFn)`
Process multiple domains in batch.

#### `generateReport()`
Generate a summary report from the ledger.

## Constants

### `PROJECT_ROOT`
The absolute path to the project root directory.

### `DOMAINS_BASE`
The absolute path to the domains directory (`PROJECT_ROOT/domains`).

### `LEDGER_PATH`
The absolute path to the ledger file (`PROJECT_ROOT/agents/sovereign-agent/ledger.json`).

## Security Guarantees

✅ **Path Traversal Protection**: All `../` sequences are blocked  
✅ **Absolute Path Injection**: All absolute paths outside base are blocked  
✅ **Symbolic Link Safety**: Canonical path resolution prevents symlink attacks  
✅ **Directory Containment**: All operations are strictly contained within base directories  
✅ **Audit Trail**: All operations are logged in the ledger  
✅ **Error Handling**: Graceful handling of security violations  

## Testing

Run the security tests:

```bash
npm test tests/unit/sovereign-agent-security.test.js
```

Or run manual validation:

```bash
node agents/sovereign-agent/index.js
```

## Codacy Compliance

This implementation addresses all Codacy critical security findings:

1. ✅ **Stable Roots**: PROJECT_ROOT, DOMAINS_BASE, LEDGER_PATH defined
2. ✅ **Canonical Resolver with Symlink Protection**: resolveSafePath() uses fs.realpathSync.native() + startsWith()
3. ✅ **All Operations Guarded**: Every fs operation goes through resolveSafePath()
4. ✅ **Ledger Security**: Ledger path validated against PROJECT_ROOT
5. ✅ **Domain Security**: Domain paths validated against DOMAINS_BASE
6. ✅ **Cryptographically Secure RNG**: Transaction IDs use crypto.randomUUID() instead of Math.random()
7. ✅ **Test File Security**: Tests use guarded operations and mkdtempSync for cleanup
8. ✅ **ESM Preserved**: Full ES module structure maintained
9. ✅ **Architecture Preserved**: Compatible with existing TEC ecosystem

**Expected Codacy Status: 0 CRITICAL issues**

## License

Part of the TEC Ecosystem - see root LICENSE file.
