// ============================================
// Sovereign Agent 2026 - TEC Ecosystem
// Secure Filesystem Operations with Codacy Guards
// ============================================

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ============================================
// Stable Filesystem Roots (Codacy-compliant)
// ============================================
const PROJECT_ROOT = path.resolve(process.cwd());
const DOMAINS_BASE = path.resolve(PROJECT_ROOT, 'domains');
const LEDGER_PATH = path.resolve(PROJECT_ROOT, 'agents/sovereign-agent/ledger.json');

// ============================================
// Canonical Containment Resolver (Security Guard)
// ============================================
/**
 * Resolves a path and ensures it's contained within the base directory.
 * This prevents path traversal attacks by checking canonical paths.
 * Uses fs.realpathSync.native to resolve symlinks and ensure canonical paths.
 * 
 * @param {string} baseDir - The base directory that must contain the target
 * @param {string} targetPath - The target path to resolve
 * @returns {string} The safe resolved path
 * @throws {Error} If the resolved path escapes the base directory
 */
function resolveSafePath(baseDir, targetPath) {
    // Resolve base to canonical form (follow symlinks)
    let resolvedBase;
    try {
        resolvedBase = fs.realpathSync.native(baseDir);
    } catch (error) {
        // If base doesn't exist yet, use path.resolve
        resolvedBase = path.resolve(baseDir);
    }
    
    // Resolve target path relative to base
    const resolvedTarget = path.resolve(baseDir, targetPath);
    
    // For paths that don't exist yet, we can't use realpathSync
    // But we can check if parent exists and resolve that
    let canonicalTarget;
    try {
        canonicalTarget = fs.realpathSync.native(resolvedTarget);
    } catch (error) {
        // Target doesn't exist yet, use resolved path
        // But check if any parent directories exist and resolve them
        let checkPath = resolvedTarget;
        let pathParts = [];
        
        while (checkPath !== path.dirname(checkPath)) {
            if (fs.existsSync(checkPath)) {
                try {
                    const canonical = fs.realpathSync.native(checkPath);
                    // Reconstruct the full path
                    canonicalTarget = pathParts.length > 0 
                        ? path.join(canonical, ...pathParts.reverse())
                        : canonical;
                    break;
                } catch (e) {
                    // Continue up the tree
                }
            }
            pathParts.push(path.basename(checkPath));
            checkPath = path.dirname(checkPath);
        }
        
        // If we couldn't resolve any parent, use the resolved path
        if (!canonicalTarget) {
            canonicalTarget = resolvedTarget;
        }
    }
    
    // Ensure the target is within the base directory
    // Use path.sep to ensure proper directory boundary checking
    if (!canonicalTarget.startsWith(resolvedBase + path.sep) && canonicalTarget !== resolvedBase) {
        throw new Error(`Path traversal detected: ${targetPath} escapes ${baseDir}`);
    }
    
    return canonicalTarget;
}

// ============================================
// Guarded Filesystem Operations
// ============================================

/**
 * Safely write content to a file within a guarded directory
 * @param {string} baseDir - The base directory to contain the file
 * @param {string} relativePath - The relative path within the base directory
 * @param {string} content - The content to write
 */
function safeWriteFile(baseDir, relativePath, content) {
    const safePath = resolveSafePath(baseDir, relativePath);
    
    // Ensure parent directory exists
    const parentDir = path.dirname(safePath);
    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
    }
    
    fs.writeFileSync(safePath, content, 'utf8');
    return safePath;
}

/**
 * Safely read a file within a guarded directory
 * @param {string} baseDir - The base directory to contain the file
 * @param {string} relativePath - The relative path within the base directory
 * @returns {string} The file content
 */
function safeReadFile(baseDir, relativePath) {
    const safePath = resolveSafePath(baseDir, relativePath);
    
    if (!fs.existsSync(safePath)) {
        throw new Error(`File not found: ${relativePath}`);
    }
    
    return fs.readFileSync(safePath, 'utf8');
}

/**
 * Safely check if a file exists within a guarded directory
 * @param {string} baseDir - The base directory to contain the file
 * @param {string} relativePath - The relative path within the base directory
 * @returns {boolean} True if file exists
 */
function safeFileExists(baseDir, relativePath) {
    try {
        const safePath = resolveSafePath(baseDir, relativePath);
        return fs.existsSync(safePath);
    } catch (error) {
        // Path traversal attempt or invalid path
        return false;
    }
}

/**
 * Safely create a directory within a guarded directory
 * @param {string} baseDir - The base directory to contain the new directory
 * @param {string} relativePath - The relative path within the base directory
 */
function safeMkdir(baseDir, relativePath) {
    const safePath = resolveSafePath(baseDir, relativePath);
    fs.mkdirSync(safePath, { recursive: true });
    return safePath;
}

// ============================================
// Ledger Management (Guarded)
// ============================================

/**
 * Initialize or load the ledger
 */
function loadLedger() {
    // Guard the ledger path - ensure it's within PROJECT_ROOT
    const safeLedgerPath = resolveSafePath(PROJECT_ROOT, 'agents/sovereign-agent/ledger.json');
    
    if (!fs.existsSync(safeLedgerPath)) {
        // Create ledger directory if needed
        const ledgerDir = path.dirname(safeLedgerPath);
        if (!fs.existsSync(ledgerDir)) {
            fs.mkdirSync(ledgerDir, { recursive: true });
        }
        
        const initialLedger = {
            version: '1.0.0',
            created: new Date().toISOString(),
            transactions: [],
            summary: {
                totalOperations: 0,
                successfulOperations: 0,
                failedOperations: 0
            }
        };
        fs.writeFileSync(safeLedgerPath, JSON.stringify(initialLedger, null, 2), 'utf8');
        return initialLedger;
    }
    
    const content = fs.readFileSync(safeLedgerPath, 'utf8');
    return JSON.parse(content);
}

/**
 * Save the ledger with guards
 */
function saveLedger(ledgerData) {
    // Guard the ledger path - ensure it's within PROJECT_ROOT
    const safeLedgerPath = resolveSafePath(PROJECT_ROOT, 'agents/sovereign-agent/ledger.json');
    fs.writeFileSync(safeLedgerPath, JSON.stringify(ledgerData, null, 2), 'utf8');
}

/**
 * Record a transaction in the ledger
 */
function recordTransaction(transaction) {
    const ledger = loadLedger();
    
    const entry = {
        id: `tx-${Date.now()}-${crypto.randomUUID()}`,
        timestamp: new Date().toISOString(),
        ...transaction
    };
    
    ledger.transactions.push(entry);
    ledger.summary.totalOperations++;
    
    if (transaction.success) {
        ledger.summary.successfulOperations++;
    } else {
        ledger.summary.failedOperations++;
    }
    
    saveLedger(ledger);
    return entry;
}

// ============================================
// Domain File Operations (Guarded)
// ============================================

/**
 * Write output to a domain folder (with security guards)
 * @param {string} domain - The domain name
 * @param {string} fileName - The file name to write
 * @param {string} content - The content to write
 */
function writeDomainFile(domain, fileName, content) {
    try {
        // Use the guarded path resolver for domain operations
        const relativePath = path.join(domain, fileName);
        const safePath = safeWriteFile(DOMAINS_BASE, relativePath, content);
        
        recordTransaction({
            type: 'domain_write',
            domain,
            fileName,
            path: safePath,
            success: true
        });
        
        console.log(`✅ Wrote domain file: ${domain}/${fileName}`);
        return { success: true, path: safePath };
    } catch (error) {
        recordTransaction({
            type: 'domain_write',
            domain,
            fileName,
            error: error.message,
            success: false
        });
        
        console.error(`❌ Failed to write domain file: ${domain}/${fileName}`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Read a file from a domain folder (with security guards)
 * @param {string} domain - The domain name
 * @param {string} fileName - The file name to read
 */
function readDomainFile(domain, fileName) {
    try {
        const relativePath = path.join(domain, fileName);
        const content = safeReadFile(DOMAINS_BASE, relativePath);
        
        console.log(`✅ Read domain file: ${domain}/${fileName}`);
        return { success: true, content };
    } catch (error) {
        console.error(`❌ Failed to read domain file: ${domain}/${fileName}`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Check if a domain file exists (with security guards)
 * @param {string} domain - The domain name
 * @param {string} fileName - The file name to check
 */
function domainFileExists(domain, fileName) {
    const relativePath = path.join(domain, fileName);
    return safeFileExists(DOMAINS_BASE, relativePath);
}

/**
 * Create a domain directory (with security guards)
 * @param {string} domain - The domain name
 */
function createDomainDirectory(domain) {
    try {
        const safePath = safeMkdir(DOMAINS_BASE, domain);
        
        recordTransaction({
            type: 'domain_mkdir',
            domain,
            path: safePath,
            success: true
        });
        
        console.log(`✅ Created domain directory: ${domain}`);
        return { success: true, path: safePath };
    } catch (error) {
        recordTransaction({
            type: 'domain_mkdir',
            domain,
            error: error.message,
            success: false
        });
        
        console.error(`❌ Failed to create domain directory: ${domain}`, error.message);
        return { success: false, error: error.message };
    }
}

// ============================================
// Task Execution Interface
// ============================================

/**
 * Execute a domain task with full security guards
 * @param {Object} taskConfig - Task configuration
 * @param {string} taskConfig.domain - The domain to operate on
 * @param {string} taskConfig.action - The action to perform (write, read, etc.)
 * @param {string} taskConfig.fileName - The file name (for read/write operations)
 * @param {string} taskConfig.content - The content (for write operations)
 */
async function executeDomainTask(taskConfig) {
    const { domain, action, fileName, content } = taskConfig;
    
    console.log(`\n🏗️ Executing domain task: ${action} for ${domain}`);
    
    let result;
    
    switch (action) {
        case 'write':
            result = writeDomainFile(domain, fileName, content);
            break;
            
        case 'read':
            result = readDomainFile(domain, fileName);
            break;
            
        case 'exists':
            const exists = domainFileExists(domain, fileName);
            result = { success: true, exists };
            break;
            
        case 'create_directory':
            result = createDomainDirectory(domain);
            break;
            
        default:
            result = { success: false, error: `Unknown action: ${action}` };
    }
    
    return result;
}

/**
 * Process multiple domains (batch operation)
 * @param {Array<string>} domains - Array of domain names
 * @param {Function} taskFn - Function to execute for each domain
 */
async function processDomains(domains, taskFn) {
    console.log(`\n🚀 Processing ${domains.length} domains...`);
    
    const results = [];
    
    for (const domain of domains) {
        try {
            const result = await taskFn(domain);
            results.push({ domain, ...result });
        } catch (error) {
            console.error(`💥 Error processing domain ${domain}:`, error.message);
            results.push({ domain, success: false, error: error.message });
        }
    }
    
    return results;
}

// ============================================
// Report Generation
// ============================================

/**
 * Generate a summary report from the ledger
 */
function generateReport() {
    const ledger = loadLedger();
    
    const report = {
        summary: ledger.summary,
        recentTransactions: ledger.transactions.slice(-10),
        generatedAt: new Date().toISOString()
    };
    
    return report;
}

// ============================================
// Exports
// ============================================
export {
    // Core security functions
    resolveSafePath,
    
    // Guarded filesystem operations
    safeWriteFile,
    safeReadFile,
    safeFileExists,
    safeMkdir,
    
    // Ledger management
    loadLedger,
    saveLedger,
    recordTransaction,
    
    // Domain operations
    writeDomainFile,
    readDomainFile,
    domainFileExists,
    createDomainDirectory,
    
    // Task execution
    executeDomainTask,
    processDomains,
    
    // Reporting
    generateReport,
    
    // Constants
    PROJECT_ROOT,
    DOMAINS_BASE,
    LEDGER_PATH
};

// ============================================
// CLI Entry Point (if run directly)
// ============================================
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🔐 Sovereign Agent - Secure Filesystem Operations');
    console.log(`📁 Project Root: ${PROJECT_ROOT}`);
    console.log(`📁 Domains Base: ${DOMAINS_BASE}`);
    console.log(`📁 Ledger Path: ${LEDGER_PATH}`);
    
    // Initialize ledger
    const ledger = loadLedger();
    console.log(`\n📊 Ledger Status:`);
    console.log(JSON.stringify(ledger.summary, null, 2));
}
