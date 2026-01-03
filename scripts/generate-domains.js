#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { sanitizeName, safeResolveFile } = require('../lib/safe-paths');

// 24 domain names based on TEC business units
const domains = [
  'fundx',
  'assets',
  'nbf',
  'insure',
  'vip',
  'life',
  'commerce',
  'ecommerce',
  'connection',
  'elite',
  'explorer',
  'brookfield',
  'zone',
  'dx',
  'nx',
  'system',
  'analytics',
  'alert',
  'titan',
  'epic',
  'legend',
  'nexus',
  'tec',
  'estate',
];

// Base directory for apps
const baseDir = path.join(__dirname, '..', 'apps');

// Ensure apps directory exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

console.log('🚀 Generating domain folders with Sovereign Security protection...\n');

let exitCode = 0;

domains.forEach((domain) => {
  try {
    // Sanitize the domain name
    const sanitizedName = sanitizeName(domain);
    
    // Use safe path resolution
    const domainPath = safeResolveFile(baseDir, sanitizedName);
    
    // Create the domain folder
    if (!fs.existsSync(domainPath)) {
      fs.mkdirSync(domainPath, { recursive: true });
      console.log(`✅ Created: ${domainPath}`);
    } else {
      console.log(`⚠️  Already exists: ${domainPath}`);
    }
    
    // Create a placeholder index file
    const indexPath = path.join(domainPath, 'index.js');
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(
        indexPath,
        `// ${sanitizedName}.pi domain entry point\nmodule.exports = { domain: '${sanitizedName}' };\n`
      );
      console.log(`   📄 Created: ${indexPath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing domain '${domain}': ${error.message}`);
    exitCode = 1;
  }
});

console.log('\n✨ Domain generation complete!');

// Exit with code 1 if any validation failed
process.exit(exitCode);
