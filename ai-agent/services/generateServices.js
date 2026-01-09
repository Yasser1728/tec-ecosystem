import fs from 'fs';
import path from 'path';

const DOMAINS = [
    'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
    'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
    'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
    'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
];

// Security: Define canonical base directory for services
const PROJECT_ROOT = path.resolve(process.cwd());
const servicesDir = path.resolve(PROJECT_ROOT, 'ai-agent', 'services');

/**
 * Security Guard: Validate service file path stays within services directory
 * @param {string} filename - The service filename (e.g., 'tec.pi.js')
 * @returns {string} - Safe resolved absolute path
 * @throws {Error} - If path traversal is detected
 */
function resolveSafeServicePath(filename) {
    const resolvedPath = path.resolve(servicesDir, filename);
    // Security: Check containment within services directory
    if (!resolvedPath.startsWith(servicesDir + path.sep)) {
        throw new Error(`Security: Path traversal blocked for filename "${filename}"`);
    }
    return resolvedPath;
}

if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

DOMAINS.forEach(domain => {
    // Security: Use validated safe path
    const filePath = resolveSafeServicePath(`${domain}.js`);
    if (!fs.existsSync(filePath)) {
        const content = `import { runDomainService } from './baseService.js';\n\nexport const runDomainService = runDomainService;`;
        fs.writeFileSync(filePath, content);
        console.log(`✅ Created service module: ${domain}.js`);
    } else {
        console.log(`ℹ️ Service module already exists: ${domain}.js`);
    }
});
