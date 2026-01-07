/**
 * TecPi Domain - Main Entry Point
 *
 * A fully sovereign domain for user management within the TEC Ecosystem.
 * All integrations happen exclusively through nexus/gateway.
 * No direct dependencies on other domains.
 *
 * @module domains/tecpi
 */

/**
 * TecPi Service Class
 * Handles core user management operations with full sovereignty
 */
class TecPiService {
  constructor() {
    // TODO: CRITICAL - Replace with proper database (Prisma) before production
    // This in-memory storage is ONLY for development and testing
    this.users = new Map();
  }

  /**
   * Register a new user in the TecPi domain
   *
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Unique username
   * @param {string} userData.email - User email address
   * @param {string} userData.password - User password (will be hashed)
   * @param {string} [userData.fullName] - User's full name
   * @returns {Promise<Object>} Registration result
   * @throws {Error} If validation fails
   */
  async registerUser(userData) {
    try {
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error(
          "Missing required fields: username, email, and password are required",
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Invalid email format");
      }

      // Validate username (alphanumeric and underscores only)
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(userData.username)) {
        throw new Error(
          "Username must be 3-20 characters and contain only letters, numbers, and underscores",
        );
      }

      // Check if user already exists
      if (this.users.has(userData.username)) {
        throw new Error("Username already exists");
      }

      // Check if email already exists
      const existingUser = Array.from(this.users.values()).find(
        (user) => user.email === userData.email,
      );
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Create user object
      // TODO: Use uuid or nanoid library for production-grade ID generation
      const user = {
        id: `tecpi_user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName || "",
        status: "ACTIVE",
        tier: "STANDARD",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // SECURITY WARNING: Password handling is intentionally incomplete in this demo
      // Production implementation should:
      // 1. Hash passwords with bcrypt: passwordHash = await bcrypt.hash(password, 10)
      // 2. Store the hash, never the plain password
      // 3. Implement authentication with password verification
      // 4. Add password strength requirements
      // The password parameter is accepted for API completeness but not stored
      this.users.set(userData.username, user);

      // Return user data (without sensitive information)
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          status: user.status,
          tier: user.tier,
          createdAt: user.createdAt,
        },
        message: "User registered successfully",
      };
    } catch (error) {
      console.error("[TecPi] Registration error:", error);
      throw error;
    }
  }

  /**
   * Get user information by username
   *
   * @param {string} username - Username to lookup
   * @returns {Promise<Object|null>} User data or null if not found
   */
  async getUserByUsername(username) {
    try {
      const user = this.users.get(username);
      if (!user) {
        return null;
      }

      // Return user without sensitive data
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        tier: user.tier,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error("[TecPi] Error fetching user:", error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Get user information by ID
   *
   * @param {string} userId - User ID to lookup
   * @returns {Promise<Object|null>} User data or null if not found
   */
  async getUserById(userId) {
    try {
      const user = Array.from(this.users.values()).find((u) => u.id === userId);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        tier: user.tier,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error("[TecPi] Error fetching user:", error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Update user information
   *
   * @param {string} userId - User ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateUser(userId, updates) {
    try {
      const user = Array.from(this.users.values()).find((u) => u.id === userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Update allowed fields
      const allowedUpdates = ["fullName", "email"];
      allowedUpdates.forEach((field) => {
        if (updates[field] !== undefined) {
          user[field] = updates[field];
        }
      });

      user.updatedAt = new Date().toISOString();

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          status: user.status,
          tier: user.tier,
          updatedAt: user.updatedAt,
        },
        message: "User updated successfully",
      };
    } catch (error) {
      console.error("[TecPi] Error updating user:", error);
      throw error;
    }
  }

  /**
   * Get domain statistics
   *
   * @returns {Promise<Object>} Domain statistics
   */
  async getDomainStats() {
    try {
      return {
        totalUsers: this.users.size,
        activeUsers: Array.from(this.users.values()).filter(
          (u) => u.status === "ACTIVE",
        ).length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[TecPi] Error fetching stats:", error);
      throw new Error(`Failed to fetch domain stats: ${error.message}`);
    }
  }
}

// Export singleton instance
const tecPiService = new TecPiService();

module.exports = tecPiService;
module.exports.TecPiService = TecPiService;
