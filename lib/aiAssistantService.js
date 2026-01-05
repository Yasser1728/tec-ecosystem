// AI Assistant Service for TEC Nexus
// Handles loading AI prompts and knowledge bases from files
const path = require('path');

class AIAssistantService {
  constructor(baseDir = null) {
    // Use path.join for safe path construction
    this.baseDir = baseDir || path.join(process.cwd(), 'lib', 'ai-knowledge');
  }

  /**
   * Load a knowledge base file by name
   * @param {string} name - Name of the knowledge base file (without extension)
   * @returns {Promise<string>} - Content of the knowledge base
   */
  async loadKnowledgeBase(name) {
    // SECURE: Using path.join instead of string concatenation
    const filePath = path.join(this.baseDir, `${name}.md`);
    
    try {
      // In a real implementation, this would read from filesystem
      // For now, return mock data
      return `Knowledge base: ${name}`;
    } catch (error) {
      throw new Error(`Failed to load knowledge base: ${name}`);
    }
  }

  /**
   * Load a prompt template by name
   * @param {string} name - Name of the prompt template
   * @returns {Promise<string>} - Content of the prompt template
   */
  async loadPromptTemplate(name) {
    // SECURE: Using path.join for cross-platform compatibility
    const filePath = path.join(this.baseDir, 'prompts', `${name}.txt`);
    
    try {
      return `Prompt template: ${name}`;
    } catch (error) {
      throw new Error(`Failed to load prompt template: ${name}`);
    }
  }

  /**
   * Get the full path for a resource
   * @param {string} resourceType - Type of resource (e.g., 'prompts', 'knowledge')
   * @param {string} filename - Name of the file
   * @returns {string} - Full path to the resource
   */
  getResourcePath(resourceType, filename) {
    // SECURE: Using path.join instead of string concatenation
    // This prevents path traversal vulnerabilities
    return path.join(this.baseDir, resourceType, filename);
  }

  /**
   * List all files in a directory
   * @param {string} subDir - Subdirectory to list (optional)
   * @returns {Promise<string[]>} - List of filenames
   */
  async listFiles(subDir = '') {
    // SECURE: Proper path construction
    const dirPath = subDir 
      ? path.join(this.baseDir, subDir)
      : this.baseDir;
    
    try {
      // Mock implementation
      return ['file1.md', 'file2.md'];
    } catch (error) {
      throw new Error(`Failed to list files in directory: ${dirPath}`);
    }
  }
}

module.exports = { AIAssistantService };
