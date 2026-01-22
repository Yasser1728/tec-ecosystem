import fs from "fs";
import path from "path";

const DOMAINS = [
  "tec.pi",
  "finance.pi",
  "market.pi",
  "wallet.pi",
  "commerce.pi",
  "analytics.pi",
  "security.pi",
  "crm.pi",
  "payments.pi",
  "tokens.pi",
  "nft.pi",
  "exchange.pi",
  "staking.pi",
  "governance.pi",
  "insurance.pi",
  "tax.pi",
  "legal.pi",
  "audit.pi",
  "research.pi",
  "marketing.pi",
  "support.pi",
  "hr.pi",
  "devops.pi",
  "infra.pi",
];

const servicesDir = path.join(process.cwd(), "ai-agent", "services");

// التأكد من وجود المجلد
if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

DOMAINS.forEach((domain) => {
  const fileName = `${domain}.js`;
  const filePath = path.join(servicesDir, fileName);

  const content = `import { createService } from './baseService.js';

export const { run } = createService({
  domain: '${domain}',
  purpose: 'Sovereign operation for ${domain} within the TEC Ecosystem'
});`;

  fs.writeFileSync(filePath, content);
  console.log(`✅ Generated: ${fileName}`);
});

console.log(`\n🚀 Sovereign Factory: 24 Domain Services Created Successfully!`);
