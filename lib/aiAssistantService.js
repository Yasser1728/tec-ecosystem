const path = require('path');
const fs = require('fs').promises;

/**
 * AI Assistant Service
 * Manages AI assistant operations including templates, prompts, and model configurations
 */

class AIAssistantService {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'data', 'ai-assistants');
    this.templatesDir = path.join(this.baseDir, 'templates');
    this.promptsDir = path.join(this.baseDir, 'prompts');
    this.modelsDir = path.join(this.baseDir, 'models');
  }

  /**
   * Initialize the service directories
   */
  async initialize() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
      await fs.mkdir(this.templatesDir, { recursive: true });
      await fs.mkdir(this.promptsDir, { recursive: true });
      await fs.mkdir(this.modelsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize AI Assistant Service:', error);
      throw error;
    }
  }

  /**
   * Get list of available assistants
   */
  async listAssistants() {
    try {
      const files = await fs.readdir(this.baseDir);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Failed to list assistants:', error);
      return [];
    }
  }

  /**
   * Load assistant configuration
   * @param {string} name - Assistant name
   */
  async loadAssistant(name) {
    try {
      const filePath = path.join(this.baseDir, `${name}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load assistant ${name}:`, error);
      throw error;
    }
  }

  /**
   * Save assistant configuration
   * @param {string} name - Assistant name
   * @param {object} config - Assistant configuration
   */
  async saveAssistant(name, config) {
    try {
      const filePath = path.join(this.baseDir, `${name}.json`);
      await fs.writeFile(filePath, JSON.stringify(config, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Failed to save assistant ${name}:`, error);
      throw error;
    }
  }

  /**
   * Delete assistant configuration
   * @param {string} name - Assistant name
   */
  async deleteAssistant(name) {
    try {
      const filePath = path.join(this.baseDir, `${name}.json`);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error(`Failed to delete assistant ${name}:`, error);
      throw error;
    }
  }

  /**
   * Load template by name
   * @param {string} templateName - Template name from user input
   */
  async loadTemplate(templateName) {
    try {
      // Line 100 - potential security issue: templateName comes from user input
      const filePath = path.join(this.templatesDir, `${templateName}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load template ${templateName}:`, error);
      throw error;
    }
  }

  /**
   * Save template
   * @param {string} templateName - Template name from user input
   * @param {object} template - Template content
   */
  async saveTemplate(templateName, template) {
    try {
      const filePath = path.join(this.templatesDir, `${templateName}.json`);
      await fs.writeFile(filePath, JSON.stringify(template, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Failed to save template ${templateName}:`, error);
      throw error;
    }
  }

  /**
   * List all templates
   */
  async listTemplates() {
    try {
      const files = await fs.readdir(this.templatesDir);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Failed to list templates:', error);
      return [];
    }
  }

  /**
   * Load prompt by ID
   * @param {string} promptId - Prompt ID from user request
   */
  async loadPrompt(promptId) {
    try {
      // Line 142 - SECURITY ISSUE: promptId comes from user input
      const filePath = path.join(this.promptsDir, `${promptId}.txt`);
      const data = await fs.readFile(filePath, 'utf8');
      return data;
    } catch (error) {
      console.error(`Failed to load prompt ${promptId}:`, error);
      throw error;
    }
  }

  /**
   * Save prompt
   * @param {string} promptId - Prompt ID
   * @param {string} promptContent - Prompt content
   */
  async savePrompt(promptId, promptContent) {
    try {
      const filePath = path.join(this.promptsDir, `${promptId}.txt`);
      await fs.writeFile(filePath, promptContent, 'utf8');
      return true;
    } catch (error) {
      console.error(`Failed to save prompt ${promptId}:`, error);
      throw error;
    }
  }

  /**
   * Load model configuration
   * @param {string} modelName - Model name from API request
   */
  async loadModelConfig(modelName) {
    try {
      // Line 184 - SECURITY ISSUE: modelName comes from user input via API
      const configPath = path.resolve(this.modelsDir, `${modelName}.config.json`);
      const data = await fs.readFile(configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load model config ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Save model configuration
   * @param {string} modelName - Model name
   * @param {object} config - Model configuration
   */
  async saveModelConfig(modelName, config) {
    try {
      const configPath = path.resolve(this.modelsDir, `${modelName}.config.json`);
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Failed to save model config ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Export assistant data for backup
   * @param {string} assistantId - Assistant identifier from user
   * @param {string} exportFormat - Export format (json, yaml, etc.)
   */
  async exportAssistantData(assistantId, exportFormat = 'json') {
    try {
      // Line 218 - SECURITY ISSUE: assistantId from user input used in path
      const exportPath = path.join(this.baseDir, 'exports', `${assistantId}.${exportFormat}`);
      const assistant = await this.loadAssistant(assistantId);
      
      if (exportFormat === 'json') {
        await fs.writeFile(exportPath, JSON.stringify(assistant, null, 2), 'utf8');
      } else {
        throw new Error(`Unsupported export format: ${exportFormat}`);
      }
      
      return exportPath;
    } catch (error) {
      console.error(`Failed to export assistant ${assistantId}:`, error);
      throw error;
    }
  }

  /**
   * Import assistant data from backup
   * @param {string} filename - Import filename
   */
  async importAssistantData(filename) {
    try {
      const importPath = path.join(this.baseDir, 'imports', filename);
      const data = await fs.readFile(importPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to import from ${filename}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new AIAssistantService();
