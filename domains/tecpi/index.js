/**
 * TEC Pi Network Integration Service
 * 
 * SECURITY ENHANCEMENTS (January 2026):
 * =====================================
 * This module has been hardened with industry-standard security practices:
 * 
 * 1. PASSWORD SECURITY:
 *    - All passwords are hashed using bcrypt (cost factor: 12)
 *    - NO plaintext password storage or comparison
 *    - Passwords are salted automatically by bcrypt
 * 
 * 2. SECURE ID GENERATION:
 *    - Uses crypto.randomBytes() for cryptographically secure random IDs
 *    - NO use of Math.random() which is predictable and insecure
 *    - Generated IDs are converted to hexadecimal strings
 * 
 * 3. SECURITY POLICY:
 *    ⚠️ WARNING: Insecure code practices are strictly prohibited in all future versions
 *    ⚠️ Any code using Math.random() or plaintext passwords will be rejected
 *    ⚠️ All authentication must use bcrypt or stronger algorithms
 * 
 * @module domains/tecpi
 * @requires bcrypt - For secure password hashing
 * @requires crypto - For cryptographically secure random generation
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Security configuration
const BCRYPT_SALT_ROUNDS = 12; // Industry standard for strong security
const ID_BYTE_LENGTH = 16; // 128-bit IDs (32 hex characters)

/**
 * TecPi Service - Secure Pi Network Integration
 * 
 * Handles user authentication, registration, and Pi Network integration
 * with enterprise-grade security standards.
 */
class TecPiService {
  constructor() {
    // In-memory storage for demo purposes
    // In production, this should be replaced with a secure database
    this.users = new Map();
    this.sessions = new Map();
  }

  /**
   * Generate a cryptographically secure random ID
   * 
   * SECURITY: Uses crypto.randomBytes() instead of Math.random()
   * Math.random() is NOT cryptographically secure and should NEVER be used
   * for security-sensitive operations like ID generation.
   * 
   * @returns {string} Hexadecimal string of random bytes
   */
  generateSecureId() {
    // Generate random bytes and convert to hex string
    const buffer = crypto.randomBytes(ID_BYTE_LENGTH);
    return buffer.toString('hex');
  }

  /**
   * Hash a password securely using bcrypt
   * 
   * SECURITY: Bcrypt automatically handles salting and uses adaptive hashing
   * that can be scaled up as hardware improves, making it resistant to
   * brute-force attacks.
   * 
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   * @throws {Error} If password is invalid
   */
  async hashPassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Bcrypt handles salting automatically
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    return hashedPassword;
  }

  /**
   * Verify a password against a stored hash
   * 
   * SECURITY: Uses constant-time comparison via bcrypt.compare()
   * to prevent timing attacks. NEVER compare passwords directly.
   * 
   * @param {string} password - Plain text password to verify
   * @param {string} hashedPassword - Stored hashed password
   * @returns {Promise<boolean>} True if password matches
   */
  async verifyPassword(password, hashedPassword) {
    if (!password || !hashedPassword) {
      return false;
    }

    try {
      const isValid = await bcrypt.compare(password, hashedPassword);
      return isValid;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Register a new user with secure password hashing
   * 
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Unique username
   * @param {string} userData.email - User email
   * @param {string} userData.password - Plain text password (will be hashed)
   * @param {string} userData.piNetworkId - Pi Network user ID (optional)
   * @returns {Promise<Object>} Created user object (without password)
   * @throws {Error} If registration fails
   */
  async registerUser(userData) {
    const { username, email, password, piNetworkId } = userData;

    // Validation
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    if (this.users.has(username)) {
      throw new Error('Username already exists');
    }

    // Generate secure user ID
    const userId = this.generateSecureId();

    // Hash password securely - NEVER store plaintext passwords
    const hashedPassword = await this.hashPassword(password);

    // Create user object
    const user = {
      id: userId,
      username,
      email,
      hashedPassword, // Stored hashed, not plaintext
      piNetworkId: piNetworkId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tier: 'STANDARD',
      status: 'active',
    };

    // Store user
    this.users.set(username, user);

    // Return user data WITHOUT password
    const { hashedPassword: _, ...userResponse } = user;
    return userResponse;
  }

  /**
   * Authenticate a user with secure password verification
   * 
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Plain text password
   * @returns {Promise<Object>} Authentication result with session token
   * @throws {Error} If authentication fails
   */
  async authenticateUser(credentials) {
    const { username, password } = credentials;

    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Retrieve user
    const user = this.users.get(username);
    if (!user) {
      // Use generic error message to prevent username enumeration
      throw new Error('Invalid credentials');
    }

    // Verify password using secure comparison
    const isPasswordValid = await this.verifyPassword(password, user.hashedPassword);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate secure session token
    const sessionToken = this.generateSecureId();
    const sessionId = this.generateSecureId();

    // Store session
    const session = {
      id: sessionId,
      userId: user.id,
      token: sessionToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    this.sessions.set(sessionToken, session);

    // Return authentication result WITHOUT password
    const { hashedPassword: _, ...userResponse } = user;
    return {
      success: true,
      user: userResponse,
      sessionToken,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Validate a session token
   * 
   * @param {string} sessionToken - Session token to validate
   * @returns {Promise<Object|null>} User object if session is valid, null otherwise
   */
  async validateSession(sessionToken) {
    if (!sessionToken) {
      return null;
    }

    const session = this.sessions.get(sessionToken);
    if (!session) {
      return null;
    }

    // Check if session has expired
    const expiresAt = new Date(session.expiresAt);
    if (expiresAt < new Date()) {
      this.sessions.delete(sessionToken);
      return null;
    }

    // Get user data
    const user = Array.from(this.users.values()).find(u => u.id === session.userId);
    if (!user) {
      return null;
    }

    // Return user WITHOUT password
    const { hashedPassword: _, ...userResponse } = user;
    return userResponse;
  }

  /**
   * Integrate with Pi Network authentication
   * 
   * @param {Object} piAuthData - Pi Network authentication data
   * @param {string} piAuthData.piNetworkId - Pi Network user ID
   * @param {string} piAuthData.accessToken - Pi Network access token
   * @returns {Promise<Object>} User object with session
   */
  async authenticateWithPiNetwork(piAuthData) {
    const { piNetworkId, accessToken } = piAuthData;

    if (!piNetworkId || !accessToken) {
      throw new Error('Pi Network ID and access token are required');
    }

    // In production, validate the access token with Pi Network API
    // For now, this is a mock implementation

    // Check if user exists with this Pi Network ID
    let user = Array.from(this.users.values()).find(u => u.piNetworkId === piNetworkId);

    if (!user) {
      // Create new user for Pi Network authentication
      const userId = this.generateSecureId();
      user = {
        id: userId,
        username: `pi_${piNetworkId}`,
        email: `${piNetworkId}@pi.network`,
        hashedPassword: null, // No password for Pi Network auth
        piNetworkId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tier: 'STANDARD',
        status: 'active',
      };
      this.users.set(user.username, user);
    }

    // Generate session
    const sessionToken = this.generateSecureId();
    const sessionId = this.generateSecureId();

    const session = {
      id: sessionId,
      userId: user.id,
      token: sessionToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    this.sessions.set(sessionToken, session);

    // Return user WITHOUT password
    const { hashedPassword: _, ...userResponse } = user;
    return {
      success: true,
      user: userResponse,
      sessionToken,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Change user password with secure hashing
   * 
   * @param {string} username - Username
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} True if password was changed successfully
   */
  async changePassword(username, oldPassword, newPassword) {
    const user = this.users.get(username);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.hashedPassword) {
      throw new Error('User authenticated via Pi Network cannot change password');
    }

    // Verify old password
    const isOldPasswordValid = await this.verifyPassword(oldPassword, user.hashedPassword);
    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newHashedPassword = await this.hashPassword(newPassword);

    // Update user
    user.hashedPassword = newHashedPassword;
    user.updatedAt = new Date().toISOString();

    return true;
  }

  /**
   * Logout user by invalidating session
   * 
   * @param {string} sessionToken - Session token to invalidate
   * @returns {Promise<boolean>} True if logout was successful
   */
  async logout(sessionToken) {
    if (!sessionToken) {
      return false;
    }

    const deleted = this.sessions.delete(sessionToken);
    return deleted;
  }
}

// Export the service class
module.exports = TecPiService;

// Export singleton instance as default
module.exports.default = new TecPiService();

// Export security constants for testing
module.exports.BCRYPT_SALT_ROUNDS = BCRYPT_SALT_ROUNDS;
module.exports.ID_BYTE_LENGTH = ID_BYTE_LENGTH;
