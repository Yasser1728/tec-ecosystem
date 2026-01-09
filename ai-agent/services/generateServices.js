import fs from 'fs';
import path from 'path';
import { resolveSafePath, AI_AGENT_SERVICES_BASE } from '../../index.js';

const DOMAINS = [
    'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
    'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
    'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
    'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
];

// Security: Use pre-validated base directory from index.js
const servicesDir = AI_AGENT_SERVICES_BASE;

if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

DOMAINS.forEach(domain => {
    // Security: Use safe path resolution imported from index.js
    const filePath = resolveSafePath(servicesDir, `${domain}.js`);
    if (!fs.existsSync(filePath)) {
        const content = `import { runDomainService } from './baseService.js';\n\nexport const runDomainService = runDomainService;`;
        fs.writeFileSync(filePath, content);
        console.log(`✅ Created service module: ${domain}.js`);
    } else {
        console.log(`ℹ️ Service module already exists: ${domain}.js`);
    }
});
