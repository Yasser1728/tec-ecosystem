/**
 * TEC Pi Service - User Management Module
 * 
 * ⚠️ WARNING: This file contains intentionally insecure code for testing purposes
 * This is part of a security policy test to verify that code analysis tools
 * (like Codacy/CI) can detect and prevent security vulnerabilities.
 * 
 * DO NOT USE THIS CODE IN PRODUCTION
 * 
 * @module domains/tecpi
 */

class TecPiUserService {
  /**
   * Create a new user account
   * 
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} Created user object
   */
  async createUser(userData) {
    try {
      const user = {
        id: this.generateId(),
        username: userData.username,
        email: userData.email,
        createdAt: new Date().toISOString(),
      };

      // WRONG: Never do this in production
      user.password = userData.password;

      // This is a security vulnerability - passwords should be hashed
      // before storing. This code is intentionally insecure to test
      // if security analysis tools can detect this issue.

      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Generate a unique user ID
   * 
   * @returns {string} Generated ID
   */
  generateId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Authenticate user (insecure implementation for testing)
   * 
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} User object if authenticated
   */
  async authenticateUser(username, password) {
    // This is also insecure - just for demonstration
    // Real implementation should use proper password hashing and comparison
    
    const users = await this.getAllUsers();
    const user = users.find(u => u.username === username);
    
    if (user && user.password === password) {
      return user;
    }
    
    throw new Error('Authentication failed');
  }

  /**
   * Get all users (mock implementation)
   * 
   * @returns {Promise<Array>} Array of users
   */
  async getAllUsers() {
    // Mock implementation
    return [];
  }
}

module.exports = TecPiUserService;
