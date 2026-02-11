#!/usr/bin/env node

/**
 * Migrate All Domain Databases
 * Runs Prisma migrations for all 24 domains
 * 
 * Usage:
 *   npm run migrate:all
 *   node scripts/migrate-all-domains.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DOMAINS = [
  'life', 'insure', 'commerce', 'ecommerce', 'assets', 'fundx',
  'dx', 'analytics', 'nbf', 'epic', 'legend', 'connection',
  'system', 'alert', 'tec', 'estate', 'nx', 'explorer',
  'nexus', 'brookfield', 'vip', 'titan', 'zone', 'elite'
];

console.log('🚀 Starting migration for all domains...\n');
console.log('📊 Total domains:', DOMAINS.length);
console.log('─'.repeat(60));

let successCount = 0;
let errorCount = 0;
let skippedCount = 0;
const errors = [];

DOMAINS.forEach((domain, index) => {
  const schemaPath = path.join(__dirname, '..', 'apps', domain, 'prisma', 'schema.prisma');
  
  console.log(`\n[${index + 1}/${DOMAINS.length}] Processing ${domain}...`);
  
  if (!fs.existsSync(schemaPath)) {
    console.log(`⚠️  Skipping ${domain}: schema not found at ${schemaPath}`);
    skippedCount++;
    return;
  }

  try {
    console.log(`📦 Migrating ${domain}...`);
    
    // Run migration without generating client (we'll generate all clients at the end)
    execSync(`npx prisma migrate dev --schema=${schemaPath} --skip-generate`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        // Override database URL if domain-specific URL exists
        DATABASE_URL: process.env[`${domain.toUpperCase()}_DATABASE_URL`] || process.env.DATABASE_URL
      }
    });
    
    console.log(`✅ ${domain} migrated successfully`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${domain} migration failed`);
    errors.push({ domain, error: error.message });
    errorCount++;
  }
  
  console.log('─'.repeat(60));
});

// Summary
console.log('\n📊 Migration Summary:');
console.log('═'.repeat(60));
console.log(`✅ Successful: ${successCount}`);
console.log(`❌ Failed: ${errorCount}`);
console.log(`⚠️  Skipped: ${skippedCount}`);
console.log(`📝 Total: ${DOMAINS.length}`);

if (errors.length > 0) {
  console.log('\n❌ Failed Domains:');
  errors.forEach(({ domain, error }) => {
    console.log(`  - ${domain}: ${error}`);
  });
}

// Generate all Prisma clients
console.log('\n🔧 Generating Prisma clients for all domains...');
try {
  DOMAINS.forEach((domain) => {
    const schemaPath = path.join(__dirname, '..', 'apps', domain, 'prisma', 'schema.prisma');
    if (fs.existsSync(schemaPath)) {
      console.log(`  Generating client for ${domain}...`);
      execSync(`npx prisma generate --schema=${schemaPath}`, {
        stdio: 'inherit'
      });
    }
  });
  console.log('✅ All Prisma clients generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma clients:', error.message);
}

console.log('\n✨ Migration process complete!\n');

// Exit with error code if any migrations failed
process.exit(errorCount > 0 ? 1 : 0);
