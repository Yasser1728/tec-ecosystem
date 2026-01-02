const fs = require('fs');
const path = require('path');
const { sanitizeName, safeResolveFile } = require('../lib/safe-paths');

// List of 24 business domains
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
  const projectRoot = path.resolve(__dirname, '..');
  const appsDir = path.resolve(projectRoot, 'apps');

  try {
    // Create apps directory if it doesn't exist
    if (!fs.existsSync(appsDir)) {
      fs.mkdirSync(appsDir, { recursive: true });
      console.log('✓ Created apps/ directory');
    }

    // Generate directories for each domain
    domains.forEach(domain => {
      try {
        // Sanitize domain name
        const sanitizedName = sanitizeName(domain.toLowerCase());
        
        // Use safe path resolution
        const domainPath = safeResolveFile(appsDir, sanitizedName);
        
        // Create domain directory
        if (!fs.existsSync(domainPath)) {
          fs.mkdirSync(domainPath, { recursive: true });
          console.log(`✓ Created domain: ${sanitizedName}`);
        } else {
          console.log(`  Domain already exists: ${sanitizedName}`);
        }
        
        // Create a basic README for each domain using safe path resolution
        const readmePath = safeResolveFile(domainPath, 'README.md');
        if (!fs.existsSync(readmePath)) {
          const readmeContent = `# ${domain}\n\nBusiness domain for ${domain}.\n`;
          fs.writeFileSync(readmePath, readmeContent, 'utf8');
          console.log(`  ✓ Created README for ${sanitizedName}`);
        }
      } catch (err) {
        console.error(`✗ Failed to create domain ${domain}: ${err.message}`);
        process.exit(1);
      }
    });

    console.log('\n✓ All domains generated successfully!');
    process.exit(0);
  } catch (err) {
    console.error(`✗ Fatal error: ${err.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateDomains();
}

module.exports = { generateDomains, domains };
