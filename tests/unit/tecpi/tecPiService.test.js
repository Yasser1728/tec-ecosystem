/**
 * Unit Tests for TecPi Service
 *
 * Tests for user registration, retrieval, and management functions
 */

const { TecPiService } = require("../../../domains/tecpi/index");

describe("TecPi Service", () => {
  let tecPiService;

  beforeEach(() => {
    // Create a fresh instance for each test
    tecPiService = new TecPiService();
  });

  describe("registerUser", () => {
    test("should register a valid user successfully", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      };

      const result = await tecPiService.registerUser(userData);

      expect(result.success).toBe(true);
      expect(result.user.username).toBe("testuser");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user.fullName).toBe("Test User");
      expect(result.user.status).toBe("ACTIVE");
      expect(result.user.tier).toBe("STANDARD");
      expect(result.user.id).toBeDefined();
      expect(result.user.createdAt).toBeDefined();
      expect(result.message).toBe("User registered successfully");
    });

    test("should register user without fullName", async () => {
      const userData = {
        username: "simpleuser",
        email: "simple@example.com",
        password: "password123",
      };

      const result = await tecPiService.registerUser(userData);

      expect(result.success).toBe(true);
      expect(result.user.fullName).toBe("");
    });

    test("should reject registration with missing username", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      await expect(tecPiService.registerUser(userData)).rejects.toThrow(
        "Missing required fields: username, email, and password are required",
      );
    });

    test("should reject registration with missing email", async () => {
      const userData = {
        username: "testuser",
        password: "password123",
      };

      await expect(tecPiService.registerUser(userData)).rejects.toThrow(
        "Missing required fields: username, email, and password are required",
      );
    });

    test("should reject registration with missing password", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
      };

      await expect(tecPiService.registerUser(userData)).rejects.toThrow(
        "Missing required fields: username, email, and password are required",
      );
    });

    test("should reject invalid email format", async () => {
      const userData = {
        username: "testuser",
        email: "invalid-email",
        password: "password123",
      };

      await expect(tecPiService.registerUser(userData)).rejects.toThrow(
        "Invalid email format",
      );
    });

    test("should reject invalid username with special characters", async () => {
      const userData = {
        username: "test@user!",
        email: "test@example.com",
        password: "password123",
      };

      await expect(tecPiService.registerUser(userData)).rejects.toThrow(
        "Username must be 3-20 characters and contain only letters, numbers, and underscores",
      );
    });

    test("should reject username that is too short", async () => {
      const userData = {
        username: "ab",
        email: "test@example.com",
        password: "password123",
      };

      await expect(tecPiService.registerUser(userData)).rejects.toThrow(
        "Username must be 3-20 characters and contain only letters, numbers, and underscores",
      );
    });

    test("should reject username that is too long", async () => {
      const userData = {
        username: "a".repeat(21),
        email: "test@example.com",
        password: "password123",
      };

      await expect(tecPiService.registerUser(userData)).rejects.toThrow(
        "Username must be 3-20 characters and contain only letters, numbers, and underscores",
      );
    });

    test("should reject duplicate username", async () => {
      const userData = {
        username: "duplicate",
        email: "user1@example.com",
        password: "password123",
      };

      await tecPiService.registerUser(userData);

      const duplicateData = {
        username: "duplicate",
        email: "user2@example.com",
        password: "password123",
      };

      await expect(tecPiService.registerUser(duplicateData)).rejects.toThrow(
        "Username already exists",
      );
    });

    test("should reject duplicate email", async () => {
      const userData = {
        username: "user1",
        email: "duplicate@example.com",
        password: "password123",
      };

      await tecPiService.registerUser(userData);

      const duplicateData = {
        username: "user2",
        email: "duplicate@example.com",
        password: "password123",
      };

      await expect(tecPiService.registerUser(duplicateData)).rejects.toThrow(
        "Email already registered",
      );
    });
  });

  describe("getUserByUsername", () => {
    test("should retrieve user by username", async () => {
      const userData = {
        username: "findme",
        email: "findme@example.com",
        password: "password123",
        fullName: "Find Me",
      };

      await tecPiService.registerUser(userData);
      const user = await tecPiService.getUserByUsername("findme");

      expect(user).not.toBeNull();
      expect(user.username).toBe("findme");
      expect(user.email).toBe("findme@example.com");
      expect(user.fullName).toBe("Find Me");
    });

    test("should return null for non-existent username", async () => {
      const user = await tecPiService.getUserByUsername("nonexistent");
      expect(user).toBeNull();
    });

    test("should not include sensitive data in response", async () => {
      const userData = {
        username: "secure",
        email: "secure@example.com",
        password: "password123",
      };

      await tecPiService.registerUser(userData);
      const user = await tecPiService.getUserByUsername("secure");

      expect(user.password).toBeUndefined();
    });
  });

  describe("getUserById", () => {
    test("should retrieve user by ID", async () => {
      const userData = {
        username: "userbyid",
        email: "byid@example.com",
        password: "password123",
      };

      const registrationResult = await tecPiService.registerUser(userData);
      const userId = registrationResult.user.id;

      const user = await tecPiService.getUserById(userId);

      expect(user).not.toBeNull();
      expect(user.id).toBe(userId);
      expect(user.username).toBe("userbyid");
    });

    test("should return null for non-existent ID", async () => {
      const user = await tecPiService.getUserById("nonexistent_id");
      expect(user).toBeNull();
    });
  });

  describe("updateUser", () => {
    test("should update user fullName", async () => {
      const userData = {
        username: "updateme",
        email: "update@example.com",
        password: "password123",
        fullName: "Old Name",
      };

      const registrationResult = await tecPiService.registerUser(userData);
      const userId = registrationResult.user.id;

      const updateResult = await tecPiService.updateUser(userId, {
        fullName: "New Name",
      });

      expect(updateResult.success).toBe(true);
      expect(updateResult.user.fullName).toBe("New Name");
      expect(updateResult.message).toBe("User updated successfully");
    });

    test("should update user email", async () => {
      const userData = {
        username: "emailupdate",
        email: "old@example.com",
        password: "password123",
      };

      const registrationResult = await tecPiService.registerUser(userData);
      const userId = registrationResult.user.id;

      const updateResult = await tecPiService.updateUser(userId, {
        email: "new@example.com",
      });

      expect(updateResult.success).toBe(true);
      expect(updateResult.user.email).toBe("new@example.com");
    });

    test("should reject update for non-existent user", async () => {
      await expect(
        tecPiService.updateUser("nonexistent_id", { fullName: "Test" }),
      ).rejects.toThrow("User not found");
    });

    test("should update updatedAt timestamp", async () => {
      const userData = {
        username: "timestamp",
        email: "timestamp@example.com",
        password: "password123",
      };

      const registrationResult = await tecPiService.registerUser(userData);
      const userId = registrationResult.user.id;
      const originalCreatedAt = registrationResult.user.createdAt;

      // Note: In a real implementation, updatedAt would be managed by the database
      // This test verifies the timestamp is properly updated by the service
      const updateResult = await tecPiService.updateUser(userId, {
        fullName: "Updated",
      });

      // updatedAt should be defined and be a valid ISO string
      expect(updateResult.user.updatedAt).toBeDefined();
      expect(
        new Date(updateResult.user.updatedAt).getTime(),
      ).toBeGreaterThanOrEqual(new Date(originalCreatedAt).getTime());
    });
  });

  describe("getDomainStats", () => {
    test("should return correct statistics for empty domain", async () => {
      const stats = await tecPiService.getDomainStats();

      expect(stats.totalUsers).toBe(0);
      expect(stats.activeUsers).toBe(0);
      expect(stats.timestamp).toBeDefined();
    });

    test("should return correct statistics after registrations", async () => {
      await tecPiService.registerUser({
        username: "user1",
        email: "user1@example.com",
        password: "password123",
      });

      await tecPiService.registerUser({
        username: "user2",
        email: "user2@example.com",
        password: "password123",
      });

      const stats = await tecPiService.getDomainStats();

      expect(stats.totalUsers).toBe(2);
      expect(stats.activeUsers).toBe(2);
    });
  });
});
