import fs from 'fs';
import path from 'path';

// Domain allow-list for validation
const ALLOWED_DOMAINS = [
    'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
    'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
    'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
    'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
];

// Environment flag for service generation (can be disabled in production)
const ENABLE_SERVICE_GENERATION = process.env.ENABLE_SERVICE_GENERATION !== 'false';

/**
 * Validate domain against allow-list
 * @param {string} domain - Domain to validate
 * @returns {boolean} - Whether domain is allowed
 */
function isValidDomain(domain) {
    return ALLOWED_DOMAINS.includes(domain);
}

const DOMAINS = ALLOWED_DOMAINS;

const servicesDir = path.join(process.cwd(), 'ai-agent', 'services');

if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

// Only generate services if enabled
if (!ENABLE_SERVICE_GENERATION) {
    console.log('⚠️ Service generation is disabled by environment configuration.');
    console.log('Set ENABLE_SERVICE_GENERATION=true to enable.');
    process.exit(0);
}

DOMAINS.forEach(domain => {
    // Double-check domain validation
    if (!isValidDomain(domain)) {
        console.error(`❌ Domain ${domain} is not in the allow-list. Skipping.`);
        return;
    }
    
    const filePath = path.join(servicesDir, `${domain}.js`);
    if (!fs.existsSync(filePath)) {
        const content = [
            "import { createService } from './baseService.js';",
            '',
            'let runDomainService;',
            '',
            'try {',
            '  const { run } = createService({',
            "    domain: '" + domain + "',",
            "    purpose: 'Sovereign operation for " + domain + "'",
            '  });',
            '  runDomainService = run;',
            '} catch (error) {',
            "  console.error('Failed to initialize service for " + domain + ":', error.message);",
            "  runDomainService = async () => ({ ok: false, error: error.message, usage: { total_tokens: 0 }, meta: { domain: '" + domain + "', sandbox: true } });",
            '}',
            '',
            'export { runDomainService };',
            ''
        ].join('\n');
        fs.writeFileSync(filePath, content);
        console.log(`✅ Created service module: ${domain}.js`);
    } else {
        console.log(`ℹ️ Service module already exists: ${domain}.js`);
    }
});
