const path = require("path");
const fs = require("fs").promises;

/**
 * AI Assistant Service
 * Manages AI assistant operations including templates, prompts, and model configurations
 */

/**
 * Sanitize filename/identifier to prevent path traversal attacks
 * Only allows alphanumeric characters, hyphens, underscores, and dots
 * @param {string} input - User input to sanitize
 * @param {string} paramName - Parameter name for error messages
 * @returns {string} Sanitized input
 * @throws {Error} If input contains invalid characters
 */
function sanitizePathComponent(input, paramName = "input") {
  if (!input || typeof input !== "string") {
    throw new Error(`Invalid ${paramName}: must be a non-empty string`);
  }

  // Security: Allow only alphanumeric, hyphens, underscores, and dots
  // This prevents path traversal attacks (../, ..\, etc.)
  const sanitizedPattern = /^[\w\-.]+$/;

  if (!sanitizedPattern.test(input)) {
    throw new Error(
      `Invalid ${paramName}: contains unsafe characters. Only alphanumeric, hyphens, underscores, and dots are allowed.`,
    );
  }

  // Additional check: prevent starting with dots to block hidden files and relative paths
  if (input.startsWith(".")) {
    throw new Error(`Invalid ${paramName}: cannot start with a dot`);
  }

  return input;
}

class AIAssistantService {
  constructor() {
    this.baseDir = path.join(process.cwd(), "data", "ai-assistants");
    this.templatesDir = path.join(this.baseDir, "templates");
    this.promptsDir = path.join(this.baseDir, "prompts");
    this.modelsDir = path.join(this.baseDir, "models");
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
      await fs.mkdir(path.join(this.baseDir, "exports"), { recursive: true });
      await fs.mkdir(path.join(this.baseDir, "imports"), { recursive: true });
    } catch (error) {
      console.error("Failed to initialize AI Assistant Service:", error);
      throw error;
    }
  }

  /**
   * Get list of available assistants
   */
  async listAssistants() {
    try {
      const files = await fs.readdir(this.baseDir);
      return files.filter((file) => file.endsWith(".json"));
    } catch (error) {
      console.error("Failed to list assistants:", error);
      return [];
    }
  }

  /**
   * Load assistant configuration
   * @param {string} name - Assistant name
   */
  async loadAssistant(name) {
    try {
      // Security: sanitize 'name' before use in path.join to prevent path traversal
      const sanitizedName = sanitizePathComponent(name, "name");
      const filePath = path.join(this.baseDir, `${sanitizedName}.json`);
      const data = await fs.readFile(filePath, "utf8");
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
      // Security: sanitize 'name' before use in path.join to prevent path traversal
      const sanitizedName = sanitizePathComponent(name, "name");
      const filePath = path.join(this.baseDir, `${sanitizedName}.json`);
      await fs.writeFile(filePath, JSON.stringify(config, null, 2), "utf8");
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
      // Security: sanitize 'name' before use in path.join to prevent path traversal
      const sanitizedName = sanitizePathComponent(name, "name");
      const filePath = path.join(this.baseDir, `${sanitizedName}.json`);
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
      // Security: sanitize 'templateName' before use in path.join to prevent path traversal
      const sanitizedTemplateName = sanitizePathComponent(
        templateName,
        "templateName",
      );
      const filePath = path.join(
        this.templatesDir,
        `${sanitizedTemplateName}.json`,
      );
      const data = await fs.readFile(filePath, "utf8");
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
      // Security: sanitize 'templateName' before use in path.join to prevent path traversal
      const sanitizedTemplateName = sanitizePathComponent(
        templateName,
        "templateName",
      );
      const filePath = path.join(
        this.templatesDir,
        `${sanitizedTemplateName}.json`,
      );
      await fs.writeFile(filePath, JSON.stringify(template, null, 2), "utf8");
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
      return files.filter((file) => file.endsWith(".json"));
    } catch (error) {
      console.error("Failed to list templates:", error);
      return [];
    }
  }

  /**
   * Load prompt by ID
   * @param {string} promptId - Prompt ID from user request
   */
  async loadPrompt(promptId) {
    try {
      // Security: sanitize 'promptId' before use in path.join to prevent path traversal
      const sanitizedPromptId = sanitizePathComponent(promptId, "promptId");
      const filePath = path.join(this.promptsDir, `${sanitizedPromptId}.txt`);
      const data = await fs.readFile(filePath, "utf8");
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
      // Security: sanitize 'promptId' before use in path.join to prevent path traversal
      const sanitizedPromptId = sanitizePathComponent(promptId, "promptId");
      const filePath = path.join(this.promptsDir, `${sanitizedPromptId}.txt`);
      await fs.writeFile(filePath, promptContent, "utf8");
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
      // Security: sanitize 'modelName' before use in path.resolve to prevent path traversal
      const sanitizedModelName = sanitizePathComponent(modelName, "modelName");
      const configPath = path.resolve(
        this.modelsDir,
        `${sanitizedModelName}.config.json`,
      );
      const data = await fs.readFile(configPath, "utf8");
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
      // Security: sanitize 'modelName' before use in path.resolve to prevent path traversal
      const sanitizedModelName = sanitizePathComponent(modelName, "modelName");
      const configPath = path.resolve(
        this.modelsDir,
        `${sanitizedModelName}.config.json`,
      );
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
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
  async exportAssistantData(assistantId, exportFormat = "json") {
    try {
      // Security: sanitize 'assistantId' before use in path.join to prevent path traversal
      const sanitizedAssistantId = sanitizePathComponent(
        assistantId,
        "assistantId",
      );
      // Security: sanitize 'exportFormat' before use in path.join to prevent path traversal
      const sanitizedFormat = sanitizePathComponent(
        exportFormat,
        "exportFormat",
      );

      const exportsDir = path.join(this.baseDir, "exports");
      await fs.mkdir(exportsDir, { recursive: true });

      const exportPath = path.join(
        exportsDir,
        `${sanitizedAssistantId}.${sanitizedFormat}`,
      );
      const assistant = await this.loadAssistant(sanitizedAssistantId);

      if (sanitizedFormat === "json") {
        await fs.writeFile(
          exportPath,
          JSON.stringify(assistant, null, 2),
          "utf8",
        );
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
      // Security: sanitize 'filename' before use in path.join to prevent path traversal
      const sanitizedFilename = sanitizePathComponent(filename, "filename");
      const importsDir = path.join(this.baseDir, "imports");
      await fs.mkdir(importsDir, { recursive: true });

      const importPath = path.join(importsDir, sanitizedFilename);
      const data = await fs.readFile(importPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to import from ${filename}:`, error);
      throw error;
    }
  }
}

// Export singleton instance and sanitization function for testing
module.exports = new AIAssistantService();
module.exports.sanitizePathComponent = sanitizePathComponent;
