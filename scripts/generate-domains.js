const fs = require('fs');
const path = require('path');
const { sanitizeName, safeResolveFile } = require('../lib/safe-paths');

// List of 24 domains as specified
const domains = [
  'Life',
  'Insure',
  'Commerce',
  'Ecommerce',
  'Assets',
  'Fundx',
  'Dx',
  'Analytics',
  'Nbf',
  'Epic',
  'Legend',
  'Connection',
  'System',
  'Alert',
  'Tec',
  'Estate',
  'Nx',
  'Explorer',
  'Nexus',
  'Brookfield',
  'Vip',
  'Titan',
  'Zone',
  'Elite'
];

function generateDomains() {
  const baseDir = path.resolve(__dirname, '../apps');
  
  // Create apps directory if it doesn't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  console.log('Generating domain folders under apps/...');

  for (const domain of domains) {
    try {
      // Sanitize the domain name
      const sanitizedName = sanitizeName(domain.toLowerCase());
      
      // Use safe path resolution
      const domainPath = safeResolveFile(baseDir, sanitizedName);
      
      // Create the domain directory
      if (!fs.existsSync(domainPath)) {
        fs.mkdirSync(domainPath, { recursive: true });
        console.log(`✓ Created: ${sanitizedName}`);
      } else {
        console.log(`✓ Already exists: ${sanitizedName}`);
      }
      
      // Create a placeholder index file
      const indexPath = path.join(domainPath, 'index.js');
      if (!fs.existsSync(indexPath)) {
        fs.writeFileSync(
          indexPath,
          `// ${domain} Domain\nexport default function ${domain}Page() {\n  return <div>${domain} Domain</div>;\n}\n`
        );
      }
    } catch (error) {
      console.error(`✗ Failed to create domain '${domain}': ${error.message}`);
      process.exit(1);
    }
  }

  console.log('\n✓ All domains generated successfully!');
  console.log(`Total domains: ${domains.length}`);
}

// Run the script
if (require.main === module) {
  generateDomains();
}

module.exports = { generateDomains, domains };
