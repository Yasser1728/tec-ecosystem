/**
 * Integration Tests for TecPi API Routes
 *
 * Tests the complete flow through API endpoints to ensure
 * proper integration with Next.js API routes and domain services.
 */

const tecPiRoutes = require("../../../domains/tecpi/routes");

// Mock request and response objects
const createMockReq = (method, body = {}, query = {}) => ({
  method,
  body,
  query,
});

const createMockRes = () => {
  const res = {
    statusCode: null,
    data: null,
  };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

describe("TecPi API Routes Integration", () => {
  describe("POST /api/tecpi/register", () => {
    test("should register a new user via API route", async () => {
      const req = createMockReq("POST", {
        username: "apiuser",
        email: "apiuser@example.com",
        password: "securePass123",
        fullName: "API User",
      });
      const res = createMockRes();

      await tecPiRoutes.registerUserRoute(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.data.success).toBe(true);
      expect(res.data.user.username).toBe("apiuser");
      expect(res.data.user.email).toBe("apiuser@example.com");
      expect(res.data.message).toBe("User registered successfully");
    });

    test("should return 400 for invalid email via API route", async () => {
      const req = createMockReq("POST", {
        username: "baduser",
        email: "invalid-email",
        password: "password123",
      });
      const res = createMockRes();

      await tecPiRoutes.registerUserRoute(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.data.success).toBe(false);
      expect(res.data.error).toContain("Invalid email format");
    });

    test("should return 405 for GET method on register route", async () => {
      const req = createMockReq("GET");
      const res = createMockRes();

      await tecPiRoutes.registerUserRoute(req, res);

      expect(res.statusCode).toBe(405);
      expect(res.data.error).toContain("Method not allowed");
    });
  });

  describe("GET /api/tecpi/user", () => {
    beforeAll(async () => {
      // Register a user for lookup tests
      const req = createMockReq("POST", {
        username: "lookupuser",
        email: "lookup@example.com",
        password: "password123",
      });
      const res = createMockRes();
      await tecPiRoutes.registerUserRoute(req, res);
    });

    test("should retrieve user via API route", async () => {
      const req = createMockReq("GET", {}, { username: "lookupuser" });
      const res = createMockRes();

      await tecPiRoutes.getUserRoute(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.user.username).toBe("lookupuser");
      expect(res.data.user.email).toBe("lookup@example.com");
    });

    test("should return 404 for non-existent user", async () => {
      const req = createMockReq("GET", {}, { username: "nonexistent" });
      const res = createMockRes();

      await tecPiRoutes.getUserRoute(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.data.success).toBe(false);
      expect(res.data.error).toBe("User not found");
    });

    test("should return 400 for missing username parameter", async () => {
      const req = createMockReq("GET", {}, {});
      const res = createMockRes();

      await tecPiRoutes.getUserRoute(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.data.error).toContain("Username parameter is required");
    });

    test("should return 405 for POST method on user route", async () => {
      const req = createMockReq("POST");
      const res = createMockRes();

      await tecPiRoutes.getUserRoute(req, res);

      expect(res.statusCode).toBe(405);
      expect(res.data.error).toContain("Method not allowed");
    });
  });

  describe("GET /api/tecpi/stats", () => {
    test("should retrieve domain statistics via API route", async () => {
      const req = createMockReq("GET");
      const res = createMockRes();

      await tecPiRoutes.getStatsRoute(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.stats).toBeDefined();
      expect(res.data.stats.totalUsers).toBeGreaterThanOrEqual(0);
      expect(res.data.stats.activeUsers).toBeGreaterThanOrEqual(0);
      expect(res.data.stats.timestamp).toBeDefined();
    });

    test("should return 405 for POST method on stats route", async () => {
      const req = createMockReq("POST");
      const res = createMockRes();

      await tecPiRoutes.getStatsRoute(req, res);

      expect(res.statusCode).toBe(405);
      expect(res.data.error).toContain("Method not allowed");
    });
  });

  describe("Complete User Registration Flow", () => {
    test("should complete full registration and lookup flow", async () => {
      // Step 1: Register a new user
      const registerReq = createMockReq("POST", {
        username: "flowuser",
        email: "flow@example.com",
        password: "flowpass123",
        fullName: "Flow User",
      });
      const registerRes = createMockRes();

      await tecPiRoutes.registerUserRoute(registerReq, registerRes);

      expect(registerRes.statusCode).toBe(201);
      expect(registerRes.data.success).toBe(true);

      const userId = registerRes.data.user.id;

      // Step 2: Lookup the registered user
      const lookupReq = createMockReq("GET", {}, { username: "flowuser" });
      const lookupRes = createMockRes();

      await tecPiRoutes.getUserRoute(lookupReq, lookupRes);

      expect(lookupRes.statusCode).toBe(200);
      expect(lookupRes.data.user.id).toBe(userId);
      expect(lookupRes.data.user.username).toBe("flowuser");

      // Step 3: Check stats
      const statsReq = createMockReq("GET");
      const statsRes = createMockRes();

      await tecPiRoutes.getStatsRoute(statsReq, statsRes);

      expect(statsRes.statusCode).toBe(200);
      expect(statsRes.data.stats.totalUsers).toBeGreaterThan(0);
    });
  });
});
