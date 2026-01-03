#!/usr/bin/env node

/**
 * Micro OS CLI Generator
 * 
 * Contact: yasserrr.fox17@gmail.com
 * Purpose: Generate new sovereign domains/applications linked to the core
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SOVEREIGN_CONTACT = 'yasserrr.fox17@gmail.com';

/**
 * Sanitize and validate path to prevent directory traversal attacks
 * @param {string} basePath - Base directory path
 * @param {string} userInput - User-provided path component
 * @returns {string} Safe path
 */
function sanitizePath(basePath, userInput) {
  // Remove any path traversal attempts
  const sanitized = userInput.replace(/\.\./g, '').replace(/[\/\\]/g, '');
  
  // Join with base path
  const fullPath = path.join(basePath, sanitized);
  
  // Resolve to absolute path
  const resolvedPath = path.resolve(fullPath);
  const resolvedBase = path.resolve(basePath);
  
  // Ensure the resolved path is within the base directory
  if (!resolvedPath.startsWith(resolvedBase)) {
    throw new Error('Sovereign Security Breach: Path Traversal Attempted!');
  }
  
  return resolvedPath;
}

/**
 * Prompt user for input
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Generate app directory structure
 */
function createAppStructure(appName, appPath) {
  const dirs = [
    appPath,
    path.join(appPath, 'models'),
    path.join(appPath, 'services'),
    path.join(appPath, 'controllers')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Created directory: ${dir}`);
    }
  });
}

/**
 * Generate model template
 */
function generateModelTemplate(appName, modelName) {
  return `/**
 * ${modelName} Model - Part of ${appName} Micro-App
 * 
 * Contact: ${SOVEREIGN_CONTACT}
 * Purpose: [Describe the purpose of this model]
 */

const crypto = require('crypto');

class ${modelName} {
  constructor(core) {
    this.core = core;
    this.contactEmail = '${SOVEREIGN_CONTACT}';
    this.entities = new Map();
  }

  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @returns {Object} Created entity
   */
  async create(data) {
    const id = this.generateId();

    const entity = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      forensicTrail: [],
      sovereignContact: this.contactEmail
    };

    this.entities.set(id, entity);

    // Log to forensic system
    this.core.forensicLogger.log({
      type: '${modelName.toUpperCase()}_CREATED',
      data: { id, ...data },
      actor: data.createdBy || 'SYSTEM',
      critical: false
    });

    // Publish event
    await this.core.eventBus.publish({
      type: '${modelName.toUpperCase()}_CREATED',
      source: '${appName.toUpperCase()}_APP',
      data: { id },
      critical: false
    });

    return entity;
  }

  /**
   * Get entity by ID
   * @param {string} id - Entity ID
   */
  get(id) {
    return this.entities.get(id);
  }

  /**
   * Update entity
   * @param {string} id - Entity ID
   * @param {Object} updates - Updates to apply
   */
  async update(id, updates) {
    const entity = this.entities.get(id);

    if (!entity) {
      throw new Error('Entity not found');
    }

    Object.assign(entity, updates);
    entity.updatedAt = new Date().toISOString();

    // Log update
    this.core.forensicLogger.log({
      type: '${modelName.toUpperCase()}_UPDATED',
      data: { id, updates },
      actor: updates.updatedBy || 'SYSTEM',
      critical: false
    });

    return entity;
  }

  /**
   * Generate unique ID using cryptographically secure random
   */
  generateId() {
    const secureRandom = crypto.randomBytes(8).toString('hex');
    return \`${modelName.toUpperCase()}-\${Date.now()}-\${secureRandom}\`;
  }
}

module.exports = ${modelName};
`;
}

/**
 * Generate service template
 */
function generateServiceTemplate(appName, modelName) {
  return `/**
 * ${appName} Service - Business Logic
 * Part of ${appName} Micro-App
 * 
 * Contact: ${SOVEREIGN_CONTACT}
 * Purpose: Orchestrates ${appName} operations with core systems integration
 */

const ${modelName} = require('../models/${modelName}');

class ${appName}Service {
  constructor(core) {
    this.core = core;
    this.contactEmail = '${SOVEREIGN_CONTACT}';
    this.${modelName.toLowerCase()} = new ${modelName}(core);
    
    // Setup event handlers
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for ${appName} operations
   */
  setupEventHandlers() {
    this.core.eventBus.subscribe('${modelName.toUpperCase()}_CREATED', async (event) => {
      console.log('[${appName.toUpperCase()} SERVICE] Entity created:', event.data.id);
    });
  }

  /**
   * Create entity with approval if needed
   * @param {Object} data - Entity data
   * @param {boolean} requiresApproval - Whether approval is needed
   */
  async createEntity(data, requiresApproval = false) {
    const entity = await this.${modelName.toLowerCase()}.create(data);

    if (requiresApproval) {
      const approval = await this.core.approvalCenter.requestApproval({
        type: '${modelName.toUpperCase()}_CREATION',
        data: { entityId: entity.id, ...data },
        requestedBy: data.createdBy || 'SYSTEM',
        priority: 'NORMAL'
      });

      return {
        entity,
        approval,
        message: \`Creation pending approval from \${this.contactEmail}\`
      };
    }

    return { entity };
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      totalEntities: this.${modelName.toLowerCase()}.entities.size,
      sovereignContact: this.contactEmail
    };
  }
}

module.exports = ${appName}Service;
`;
}

/**
 * Generate app index template
 */
function generateAppIndexTemplate(appName) {
  return `/**
 * ${appName} App Entry Point
 * Part of ${appName} Micro-App
 * 
 * Contact: ${SOVEREIGN_CONTACT}
 * Purpose: Main entry point for the ${appName} micro-app
 */

const ${appName}Service = require('./services/${appName}Service');

class ${appName}App {
  constructor(core) {
    this.name = '${appName} Micro-App';
    this.version = '1.0.0';
    this.contactEmail = '${SOVEREIGN_CONTACT}';
    this.core = core;
    
    // Initialize service
    this.service = new ${appName}Service(core);
    
    // Log app initialization
    this.core.forensicLogger.log({
      type: 'APP_INITIALIZED',
      data: {
        appName: this.name,
        version: this.version,
        timestamp: new Date().toISOString()
      },
      actor: 'SYSTEM',
      critical: false
    });
  }

  /**
   * Get app information
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      description: '${appName} application with sovereign oversight',
      sovereignContact: this.contactEmail,
      statistics: this.service.getStatistics()
    };
  }

  /**
   * Get service
   */
  getService() {
    return this.service;
  }

  /**
   * Health check
   */
  healthCheck() {
    return {
      status: 'HEALTHY',
      app: this.name,
      version: this.version,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ${appName}App;
`;
}

/**
 * Main generator function
 */
async function generateApp() {
  console.log('\n========================================');
  console.log('   Micro OS Sovereign App Generator');
  console.log('========================================');
  console.log(\`Sovereign Contact: \${SOVEREIGN_CONTACT}\n\`);

  const appName = await prompt('Enter app name (e.g., Healthcare, Finance): ');
  const modelName = await prompt('Enter main model name (e.g., Patient, Transaction): ');

  if (!appName || !modelName) {
    console.error('App name and model name are required!');
    rl.close();
    return;
  }

  // Sanitize inputs to prevent path traversal
  const appsDir = path.join(process.cwd(), 'apps');
  const appPath = sanitizePath(appsDir, appName.toLowerCase());

  console.log(\`\nGenerating \${appName} app at: \${appPath}\n\`);

  // Create directory structure
  createAppStructure(appName, appPath);

  // Generate files
  const modelContent = generateModelTemplate(appName, modelName);
  const serviceContent = generateServiceTemplate(appName, modelName);
  const indexContent = generateAppIndexTemplate(appName);

  fs.writeFileSync(
    path.join(appPath, 'models', \`\${modelName}.js\`),
    modelContent
  );
  console.log(\`✓ Created model: \${modelName}.js\`);

  fs.writeFileSync(
    path.join(appPath, 'services', \`\${appName}Service.js\`),
    serviceContent
  );
  console.log(\`✓ Created service: \${appName}Service.js\`);

  fs.writeFileSync(
    path.join(appPath, 'index.js'),
    indexContent
  );
  console.log(\`✓ Created app entry: index.js\`);

  console.log(\`\n✅ Successfully generated \${appName} micro-app!\`);
  console.log(\`\nTo use this app:\`);
  console.log(\`  1. Import: const { MicroOSCore } = require('./core');\`);
  console.log(\`  2. Import: const \${appName}App = require('./apps/\${appName.toLowerCase()}');\`);
  console.log(\`  3. Initialize: const core = new MicroOSCore();\`);
  console.log(\`  4. Create app: const app = new \${appName}App(core);\`);
  console.log(\`\nAll operations will be monitored by: \${SOVEREIGN_CONTACT}\n\`);

  rl.close();
}

// Run generator if called directly
if (require.main === module) {
  generateApp().catch(console.error);
}

module.exports = { generateApp };
`;
