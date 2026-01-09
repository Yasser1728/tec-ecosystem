import fs from 'fs';
import path from 'path';

const DOMAINS = [
    'tec.pi', 'finance.pi', 'market.pi', 'wallet.pi', 'commerce.pi', 'analytics.pi',
    'security.pi', 'crm.pi', 'payments.pi', 'tokens.pi', 'nft.pi', 'exchange.pi',
    'staking.pi', 'governance.pi', 'insurance.pi', 'tax.pi', 'legal.pi', 'audit.pi',
    'research.pi', 'marketing.pi', 'support.pi', 'hr.pi', 'devops.pi', 'infra.pi'
];

const servicesDir = path.join(process.cwd(), 'ai-agent', 'services');

if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

DOMAINS.forEach(domain => {
    const filePath = path.join(servicesDir, `${domain}.js`);
    if (!fs.existsSync(filePath)) {
        const content = `import { runDomainService } from './baseService.js';\n\nexport const runDomainService = runDomainService;`;
        fs.writeFileSync(filePath, content);
        console.log(`✅ Created service module: ${domain}.js`);
    } else {
        console.log(`ℹ️ Service module already exists: ${domain}.js`);
    }
});
