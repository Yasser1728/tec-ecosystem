#!/usr/bin/env node

/**
 * Secure App Generator Script
 * Generates application components with proper path security
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
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');

/**
 * Validates app configuration
 * @param {object} config - App configuration
 * @returns {boolean} - True if valid
 */
function validateAppConfig(config) {
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  const required = ['name', 'type'];
  return required.every(field => 
    config[field] && typeof config[field] === 'string'
  );
}

/**
 * Generates an application component
 * @param {object} config - App configuration
 */
function generateApp(config) {
  try {
    // Validate configuration
    if (!validateAppConfig(config)) {
      throw new Error('Invalid app configuration');
    }
    
    // Sanitize the app name
    const sanitizedName = sanitizeName(config.name);
    
    console.log(`Generating app: ${sanitizedName}`);
    
    // Create app directory safely
    const appDir = safeCreateDirectory(COMPONENTS_DIR, sanitizedName);
    console.log(`✓ Created directory: ${appDir}`);
    
    // Generate app component file
    const componentContent = generateComponentTemplate(config);
    const componentFile = safeResolveFile(appDir, 'index.js');
    fs.writeFileSync(componentFile, componentContent, 'utf8');
    console.log(`✓ Created component: ${componentFile}`);
    
    // Generate styles file
    const stylesContent = generateStylesTemplate(config);
    const stylesFile = safeResolveFile(appDir, 'styles.module.css');
    fs.writeFileSync(stylesFile, stylesContent, 'utf8');
    console.log(`✓ Created styles: ${stylesFile}`);
    
    // Generate README
    const readmeContent = generateReadmeTemplate(config);
    const readmeFile = safeResolveFile(appDir, 'README.md');
    fs.writeFileSync(readmeFile, readmeContent, 'utf8');
    console.log(`✓ Created README: ${readmeFile}`);
    
    console.log(`✅ App "${sanitizedName}" generated successfully\n`);
    return appDir;
    
  } catch (error) {
    console.error(`❌ Error generating app: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Generates a component template
 * @param {object} config - App configuration
 * @returns {string} - Template content
 */
function generateComponentTemplate(config) {
  const componentName = config.name.charAt(0).toUpperCase() + config.name.slice(1);
  
  return `/**
 * ${componentName} Component
 * Type: ${config.type}
 * ${config.description || ''}
 */

import React from 'react';
import styles from './styles.module.css';

export default function ${componentName}({ children, ...props }) {
  return (
    <div className={styles.container} {...props}>
      <h2 className={styles.title}>${componentName}</h2>
      {children}
    </div>
  );
}

${componentName}.displayName = '${componentName}';
`;
}

/**
 * Generates a styles template
 * @param {object} config - App configuration
 * @returns {string} - Styles content
 */
function generateStylesTemplate(config) {
  return `.container {
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}
`;
}

/**
 * Generates a README template
 * @param {object} config - App configuration
 * @returns {string} - README content
 */
function generateReadmeTemplate(config) {
  const componentName = config.name.charAt(0).toUpperCase() + config.name.slice(1);
  
  return `# ${componentName}

${config.description || 'Component description'}

## Type
${config.type}

## Usage

\`\`\`jsx
import ${componentName} from '@/components/${config.name}';

function MyPage() {
  return (
    <${componentName}>
      Your content here
    </${componentName}>
  );
}
\`\`\`

## Props

- \`children\`: React nodes to render inside the component
- Additional props are spread to the container div

## Generated
This component was generated using the secure app generator script.
`;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  if (args.length === 0) {
    console.error('Usage: node generate-app.js <app-name> [options]');
    console.error('Example: node generate-app.js my-component --type=functional --description="My component"');
    process.exit(1);
  }
  
  // Parse arguments
  const name = args[0];
  const options = {};
  
  args.slice(1).forEach(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    options[key] = value;
  });
  
  // Create app configuration
  const config = {
    name: name,
    type: options.type || 'functional',
    description: options.description || `${name} component`
  };
  
  // Ensure base directories exist
  try {
    if (!fs.existsSync(COMPONENTS_DIR)) {
      fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
    }
  } catch (error) {
    console.error(`Failed to create base directories: ${error.message}`);
    process.exit(1);
  }
  
  // Generate the app
  generateApp(config);
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for testing
module.exports = {
  generateApp,
  validateAppConfig,
  generateComponentTemplate,
  generateStylesTemplate,
  generateReadmeTemplate
};
