#!/usr/bin/env node

/**
 * Secure Domain Generator Script
 * Generates domain configuration files with proper path security
 */

const path = require('path');
const fs = require('fs');
const {
  sanitizeName,
  safeResolveFile,
  safeCreateDirectory,
  safeWriteFile
} = require('../lib/utils/path-security');

// Base directories (absolute paths)
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DOMAINS_DIR = path.join(PROJECT_ROOT, 'domains');
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');

/**
 * Validates domain configuration
 * @param {object} config - Domain configuration
 * @returns {boolean} - True if valid
 */
function validateDomainConfig(config) {
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  const required = ['name', 'domain', 'category'];
  return required.every(field => 
    config[field] && typeof config[field] === 'string'
  );
}

/**
 * Generates a domain configuration file
 * @param {object} config - Domain configuration
 */
function generateDomain(config) {
  try {
    // Validate configuration
    if (!validateDomainConfig(config)) {
      throw new Error('Invalid domain configuration');
    }
    
    // Sanitize the domain name
    const sanitizedName = sanitizeName(config.name);
    
    console.log(`Generating domain: ${sanitizedName}`);
    
    // Create domain directory safely
    const domainDir = safeCreateDirectory(DOMAINS_DIR, sanitizedName);
    console.log(`✓ Created directory: ${domainDir}`);
    
    // Generate domain config file
    const configContent = JSON.stringify(config, null, 2);
    const configFile = path.join(domainDir, 'config.json');
    
    // Use safeResolveFile to ensure the path is within domainDir
    const safeConfigPath = safeResolveFile(domainDir, 'config.json');
    fs.writeFileSync(safeConfigPath, configContent, 'utf8');
    console.log(`✓ Created config: ${safeConfigPath}`);
    
    // Generate index page template
    const indexTemplate = generateIndexTemplate(config);
    const indexFile = safeResolveFile(domainDir, 'index.js');
    fs.writeFileSync(indexFile, indexTemplate, 'utf8');
    console.log(`✓ Created index: ${indexFile}`);
    
    console.log(`✅ Domain "${sanitizedName}" generated successfully\n`);
    return domainDir;
    
  } catch (error) {
    console.error(`❌ Error generating domain: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Generates an index template for the domain
 * @param {object} config - Domain configuration
 * @returns {string} - Template content
 */
function generateIndexTemplate(config) {
  return `/**
 * ${config.name} Domain
 * Category: ${config.category}
 * Domain: ${config.domain}
 */

import React from 'react';

export default function ${config.name}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">${config.name}</h1>
      <p className="text-xl text-gray-600">Welcome to ${config.domain}</p>
      <p className="mt-4">Category: ${config.category}</p>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      domain: '${config.domain}',
      name: '${config.name}',
      category: '${config.category}'
    }
  };
}
`;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  if (args.length === 0) {
    console.error('Usage: node generate-domains.js <domain-name> [options]');
    console.error('Example: node generate-domains.js fundx --domain=fundx.pi --category=Financial');
    process.exit(1);
  }
  
  // Parse arguments
  const name = args[0];
  const options = {};
  
  args.slice(1).forEach(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    options[key] = value;
  });
  
  // Create domain configuration
  const config = {
    name: name,
    domain: options.domain || `${name}.pi`,
    category: options.category || 'General',
    priority: options.priority || 'Tier 3',
    status: options.status || 'active',
    description: options.description || `${name} domain configuration`
  };
  
  // Ensure base directories exist
  try {
    if (!fs.existsSync(DOMAINS_DIR)) {
      fs.mkdirSync(DOMAINS_DIR, { recursive: true });
    }
  } catch (error) {
    console.error(`Failed to create base directories: ${error.message}`);
    process.exit(1);
  }
  
  // Generate the domain
  generateDomain(config);
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for testing
module.exports = {
  generateDomain,
  validateDomainConfig,
  generateIndexTemplate
};
