/**
 * Unit Tests for TecPi Service
 * 
 * Tests all security-critical functionality:
 * - Secure password hashing and verification
 * - Cryptographically secure ID generation
 * - User registration and authentication
 * - Session management
 */

const TecPiService = require('../../../../domains/tecpi/index');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

describe('TecPiService Security Tests', () => {
  let tecPiService;

  beforeEach(() => {
    // Create a fresh instance for each test
    tecPiService = new TecPiService();
  });

  describe('Secure ID Generation', () => {
    test('should generate unique IDs using crypto.randomBytes', () => {
      const id1 = tecPiService.generateSecureId();
      const id2 = tecPiService.generateSecureId();
      
      // IDs should be strings
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      
      // IDs should be unique
      expect(id1).not.toBe(id2);
      
      // IDs should be 32 characters (16 bytes in hex)
      expect(id1.length).toBe(32);
      expect(id2.length).toBe(32);
      
      // IDs should only contain hexadecimal characters
      expect(/^[0-9a-f]{32}$/.test(id1)).toBe(true);
      expect(/^[0-9a-f]{32}$/.test(id2)).toBe(true);
    });

    test('should generate cryptographically random IDs', () => {
      const ids = new Set();
      const iterations = 1000;
      
      // Generate many IDs and ensure no collisions
      for (let i = 0; i < iterations; i++) {
        ids.add(tecPiService.generateSecureId());
      }
      
      // All IDs should be unique
      expect(ids.size).toBe(iterations);
    });
  });

  describe('Password Hashing Security', () => {
    test('should hash passwords using bcrypt', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await tecPiService.hashPassword(password);
      
      // Hashed password should be a string
      expect(typeof hashedPassword).toBe('string');
      
      // Hashed password should not equal plaintext
      expect(hashedPassword).not.toBe(password);
      
      // Bcrypt hashes start with $2a$ or $2b$
      expect(hashedPassword.startsWith('$2')).toBe(true);
      
      // Hash should be at least 60 characters
      expect(hashedPassword.length).toBeGreaterThanOrEqual(60);
    });

    test('should use correct bcrypt salt rounds', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await tecPiService.hashPassword(password);
      
      // Extract salt rounds from hash
      const rounds = parseInt(hashedPassword.split('$')[2]);
      
      // Should use 12 rounds as configured
      expect(rounds).toBe(TecPiService.BCRYPT_SALT_ROUNDS);
    });

    test('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await tecPiService.hashPassword(password);
      const hash2 = await tecPiService.hashPassword(password);
      
      // Hashes should be different due to different salts
      expect(hash1).not.toBe(hash2);
    });

    test('should reject invalid passwords', async () => {
      // Empty password
      await expect(tecPiService.hashPassword('')).rejects.toThrow();
      
      // Non-string password
      await expect(tecPiService.hashPassword(null)).rejects.toThrow();
      await expect(tecPiService.hashPassword(undefined)).rejects.toThrow();
      
      // Too short password
      await expect(tecPiService.hashPassword('short')).rejects.toThrow('at least 8 characters');
    });

    test('should enforce minimum password length', async () => {
      const shortPassword = '1234567'; // 7 characters
      await expect(tecPiService.hashPassword(shortPassword)).rejects.toThrow();
      
      const validPassword = '12345678'; // 8 characters
      await expect(tecPiService.hashPassword(validPassword)).resolves.toBeTruthy();
    });
  });

  describe('Password Verification Security', () => {
    test('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await tecPiService.hashPassword(password);
      
      const isValid = await tecPiService.verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hashedPassword = await tecPiService.hashPassword(password);
      
      const isValid = await tecPiService.verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    test('should handle null or undefined values safely', async () => {
      const hashedPassword = await tecPiService.hashPassword('TestPassword123!');
      
      expect(await tecPiService.verifyPassword(null, hashedPassword)).toBe(false);
      expect(await tecPiService.verifyPassword(undefined, hashedPassword)).toBe(false);
      expect(await tecPiService.verifyPassword('password', null)).toBe(false);
      expect(await tecPiService.verifyPassword('password', undefined)).toBe(false);
    });

    test('should be case-sensitive', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await tecPiService.hashPassword(password);
      
      expect(await tecPiService.verifyPassword('testpassword123!', hashedPassword)).toBe(false);
      expect(await tecPiService.verifyPassword('TESTPASSWORD123!', hashedPassword)).toBe(false);
    });
  });

  describe('User Registration', () => {
    test('should register a new user with hashed password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };
      
      const user = await tecPiService.registerUser(userData);
      
      // User should be created
      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      
      // User ID should be generated securely
      expect(user.id).toBeDefined();
      expect(user.id.length).toBe(32);
      
      // Password should NOT be in response
      expect(user.password).toBeUndefined();
      expect(user.hashedPassword).toBeUndefined();
      
      // User should have default tier
      expect(user.tier).toBe('STANDARD');
      expect(user.status).toBe('active');
    });

    test('should prevent duplicate usernames', async () => {
      const userData = {
        username: 'duplicate',
        email: 'test1@example.com',
        password: 'Password123!',
      };
      
      await tecPiService.registerUser(userData);
      
      // Try to register again with same username
      await expect(tecPiService.registerUser({
        ...userData,
        email: 'test2@example.com',
      })).rejects.toThrow('already exists');
    });

    test('should validate required fields', async () => {
      await expect(tecPiService.registerUser({
        email: 'test@example.com',
        password: 'Password123!',
      })).rejects.toThrow('required');
      
      await expect(tecPiService.registerUser({
        username: 'testuser',
        password: 'Password123!',
      })).rejects.toThrow('required');
      
      await expect(tecPiService.registerUser({
        username: 'testuser',
        email: 'test@example.com',
      })).rejects.toThrow('required');
    });

    test('should support optional Pi Network ID', async () => {
      const user = await tecPiService.registerUser({
        username: 'piuser',
        email: 'pi@example.com',
        password: 'Password123!',
        piNetworkId: 'pi_12345',
      });
      
      expect(user.piNetworkId).toBe('pi_12345');
    });
  });

  describe('User Authentication', () => {
    beforeEach(async () => {
      // Register a test user
      await tecPiService.registerUser({
        username: 'authtest',
        email: 'auth@example.com',
        password: 'AuthPassword123!',
      });
    });

    test('should authenticate user with correct credentials', async () => {
      const result = await tecPiService.authenticateUser({
        username: 'authtest',
        password: 'AuthPassword123!',
      });
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('authtest');
      expect(result.sessionToken).toBeDefined();
      expect(result.sessionToken.length).toBe(32);
      expect(result.expiresAt).toBeDefined();
      
      // Password should NOT be in response
      expect(result.user.password).toBeUndefined();
      expect(result.user.hashedPassword).toBeUndefined();
    });

    test('should reject authentication with wrong password', async () => {
      await expect(tecPiService.authenticateUser({
        username: 'authtest',
        password: 'WrongPassword123!',
      })).rejects.toThrow('Invalid credentials');
    });

    test('should reject authentication for non-existent user', async () => {
      await expect(tecPiService.authenticateUser({
        username: 'nonexistent',
        password: 'Password123!',
      })).rejects.toThrow('Invalid credentials');
    });

    test('should validate required credentials', async () => {
      await expect(tecPiService.authenticateUser({
        password: 'Password123!',
      })).rejects.toThrow('required');
      
      await expect(tecPiService.authenticateUser({
        username: 'authtest',
      })).rejects.toThrow('required');
    });

    test('should use generic error message to prevent username enumeration', async () => {
      let errorMessage1, errorMessage2;
      
      try {
        await tecPiService.authenticateUser({
          username: 'nonexistent',
          password: 'Password123!',
        });
      } catch (error) {
        errorMessage1 = error.message;
      }
      
      try {
        await tecPiService.authenticateUser({
          username: 'authtest',
          password: 'WrongPassword123!',
        });
      } catch (error) {
        errorMessage2 = error.message;
      }
      
      // Both should return the same generic error
      expect(errorMessage1).toBe('Invalid credentials');
      expect(errorMessage2).toBe('Invalid credentials');
    });
  });

  describe('Session Management', () => {
    let sessionToken;
    let userId;

    beforeEach(async () => {
      const user = await tecPiService.registerUser({
        username: 'sessiontest',
        email: 'session@example.com',
        password: 'SessionPassword123!',
      });
      userId = user.id;
      
      const authResult = await tecPiService.authenticateUser({
        username: 'sessiontest',
        password: 'SessionPassword123!',
      });
      sessionToken = authResult.sessionToken;
    });

    test('should validate valid session', async () => {
      const user = await tecPiService.validateSession(sessionToken);
      
      expect(user).toBeDefined();
      expect(user.username).toBe('sessiontest');
      expect(user.id).toBe(userId);
      
      // Password should NOT be in response
      expect(user.password).toBeUndefined();
      expect(user.hashedPassword).toBeUndefined();
    });

    test('should reject invalid session token', async () => {
      const user = await tecPiService.validateSession('invalid-token');
      expect(user).toBeNull();
    });

    test('should reject null or undefined token', async () => {
      expect(await tecPiService.validateSession(null)).toBeNull();
      expect(await tecPiService.validateSession(undefined)).toBeNull();
    });

    test('should support logout', async () => {
      const logoutResult = await tecPiService.logout(sessionToken);
      expect(logoutResult).toBe(true);
      
      // Session should now be invalid
      const user = await tecPiService.validateSession(sessionToken);
      expect(user).toBeNull();
    });
  });

  describe('Password Change', () => {
    beforeEach(async () => {
      await tecPiService.registerUser({
        username: 'pwdchange',
        email: 'pwdchange@example.com',
        password: 'OldPassword123!',
      });
    });

    test('should change password with correct old password', async () => {
      const result = await tecPiService.changePassword(
        'pwdchange',
        'OldPassword123!',
        'NewPassword456!'
      );
      
      expect(result).toBe(true);
      
      // Should be able to login with new password
      const authResult = await tecPiService.authenticateUser({
        username: 'pwdchange',
        password: 'NewPassword456!',
      });
      expect(authResult.success).toBe(true);
    });

    test('should reject password change with wrong old password', async () => {
      await expect(tecPiService.changePassword(
        'pwdchange',
        'WrongOldPassword!',
        'NewPassword456!'
      )).rejects.toThrow('incorrect');
    });

    test('should reject password change for non-existent user', async () => {
      await expect(tecPiService.changePassword(
        'nonexistent',
        'OldPassword123!',
        'NewPassword456!'
      )).rejects.toThrow('not found');
    });

    test('old password should no longer work after change', async () => {
      await tecPiService.changePassword(
        'pwdchange',
        'OldPassword123!',
        'NewPassword456!'
      );
      
      // Old password should be rejected
      await expect(tecPiService.authenticateUser({
        username: 'pwdchange',
        password: 'OldPassword123!',
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Pi Network Integration', () => {
    test('should authenticate with Pi Network credentials', async () => {
      const result = await tecPiService.authenticateWithPiNetwork({
        piNetworkId: 'pi_test_12345',
        accessToken: 'pi_access_token_abc',
      });
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.piNetworkId).toBe('pi_test_12345');
      expect(result.sessionToken).toBeDefined();
      expect(result.sessionToken.length).toBe(32);
    });

    test('should create user automatically on first Pi Network login', async () => {
      const result1 = await tecPiService.authenticateWithPiNetwork({
        piNetworkId: 'pi_new_user',
        accessToken: 'pi_token_123',
      });
      
      expect(result1.user.piNetworkId).toBe('pi_new_user');
      
      // Second login should return the same user
      const result2 = await tecPiService.authenticateWithPiNetwork({
        piNetworkId: 'pi_new_user',
        accessToken: 'pi_token_456',
      });
      
      expect(result2.user.id).toBe(result1.user.id);
    });

    test('should reject Pi Network auth without required fields', async () => {
      await expect(tecPiService.authenticateWithPiNetwork({
        piNetworkId: 'pi_test',
      })).rejects.toThrow('required');
      
      await expect(tecPiService.authenticateWithPiNetwork({
        accessToken: 'token',
      })).rejects.toThrow('required');
    });

    test('should prevent password change for Pi Network users', async () => {
      await tecPiService.authenticateWithPiNetwork({
        piNetworkId: 'pi_user_pwd',
        accessToken: 'token',
      });
      
      await expect(tecPiService.changePassword(
        'pi_pi_user_pwd',
        'anypassword',
        'newpassword'
      )).rejects.toThrow('Pi Network');
    });
  });

  describe('Security Constants', () => {
    test('should export correct security constants', () => {
      expect(TecPiService.BCRYPT_SALT_ROUNDS).toBe(12);
      expect(TecPiService.ID_BYTE_LENGTH).toBe(16);
    });

    test('should use secure salt rounds', () => {
      // Salt rounds should be at least 12 for strong security
      expect(TecPiService.BCRYPT_SALT_ROUNDS).toBeGreaterThanOrEqual(12);
    });

    test('should use sufficient entropy for IDs', () => {
      // ID byte length should be at least 16 bytes (128 bits)
      expect(TecPiService.ID_BYTE_LENGTH).toBeGreaterThanOrEqual(16);
    });
  });
});
