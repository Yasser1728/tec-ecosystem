import fs from 'fs';
import path from 'path';

// Domain allow-list for security
const ALLOWED_DOMAINS = [
    'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
    'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
    'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
    'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
];

// Check if service generation is enabled
const SERVICE_GENERATION_ENABLED = process.env.ENABLE_SERVICE_GENERATION === 'true';

if (!SERVICE_GENERATION_ENABLED) {
    console.log('[Generate Services] Service generation is disabled. Set ENABLE_SERVICE_GENERATION=true to enable.');
    process.exit(0);
}

const servicesDir = path.join(process.cwd(), 'ai-agent', 'services');

if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

// Filter only allowed domains
const validDomains = ALLOWED_DOMAINS.filter(domain => {
    if (!ALLOWED_DOMAINS.includes(domain)) {
        console.warn(`[Generate Services] Skipping unauthorized domain: ${domain}`);
        return false;
    }
    return true;
});

console.log(`[Generate Services] Processing ${validDomains.length} authorized domains...`);

validDomains.forEach(domain => {
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

console.log('[Generate Services] Service generation complete.');
