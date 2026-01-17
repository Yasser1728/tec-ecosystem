/**
 * Unit tests for Pi Authentication Module
 */

import { PiAuth } from "../../lib/pi-auth";

describe("PiAuth", () => {
  let piAuth;
  let mockWindow;

  beforeEach(() => {
    // Set up window.Pi mocks (don't replace window, just update Pi)
    if (typeof window !== "undefined") {
      window.Pi = {
        init: jest.fn().mockResolvedValue(undefined),
        authenticate: jest.fn().mockResolvedValue({
          user: { uid: "test-pi-id", username: "testuser" },
          accessToken: "test-token",
        }),
      };
      mockWindow = window;
    } else {
      // Fallback if window doesn't exist
      mockWindow = {
        Pi: {
          init: jest.fn().mockResolvedValue(undefined),
          authenticate: jest.fn().mockResolvedValue({
            user: { uid: "test-pi-id", username: "testuser" },
            accessToken: "test-token",
          }),
        },
      };
      global.window = mockWindow;
    }

    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock;

    // Mock setTimeout to avoid waiting
    jest.useFakeTimers();

    // Create instance after mocking - reset initialized state
    piAuth = new PiAuth();
    piAuth.initialized = false;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("init", () => {
    it("should initialize Pi SDK successfully", async () => {
      // Set env variable
      const originalEnv = process.env.NEXT_PUBLIC_PI_SANDBOX;
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
      
      // Use the piAuth instance created in beforeEach
      piAuth.initialized = false;
      
      // Clear any previous calls
      window.Pi.init.mockClear();
      
      await piAuth.init();

      expect(window.Pi.init).toHaveBeenCalledWith({
        version: "2.0",
        sandbox: true,
      });
      expect(piAuth.initialized).toBe(true);
      
      // Restore env
      process.env.NEXT_PUBLIC_PI_SANDBOX = originalEnv;
    });

    it("should not initialize twice", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_PI_SANDBOX;
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
      
      // Use the piAuth instance created in beforeEach
      piAuth.initialized = false;
      
      // Clear any previous calls
      window.Pi.init.mockClear();
      
      await piAuth.init();
      await piAuth.init();

      expect(window.Pi.init).toHaveBeenCalledTimes(1);
      
      // Restore env
      process.env.NEXT_PUBLIC_PI_SANDBOX = originalEnv;
    });

    it("should initialize with sandbox=false when env is 'false'", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_PI_SANDBOX;
      process.env.NEXT_PUBLIC_PI_SANDBOX = "false";
      
      // Use the piAuth instance created in beforeEach
      piAuth.initialized = false;
      
      // Clear any previous calls
      window.Pi.init.mockClear();
      
      await piAuth.init();

      expect(window.Pi.init).toHaveBeenCalledWith({
        version: "2.0",
        sandbox: false,
      });
      
      // Restore env
      process.env.NEXT_PUBLIC_PI_SANDBOX = originalEnv;
    });

    it("should initialize with sandbox=true when env is undefined", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_PI_SANDBOX;
      delete process.env.NEXT_PUBLIC_PI_SANDBOX;
      
      // Use the piAuth instance created in beforeEach
      piAuth.initialized = false;
      
      // Clear any previous calls
      window.Pi.init.mockClear();
      
      await piAuth.init();

      expect(window.Pi.init).toHaveBeenCalledWith({
        version: "2.0",
        sandbox: true,
      });
      
      // Restore env
      process.env.NEXT_PUBLIC_PI_SANDBOX = originalEnv;
    });

    it("should handle initialization errors", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_PI_SANDBOX;
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
      
      // Use the piAuth instance created in beforeEach
      piAuth.initialized = false;
      
      // Clear previous mock calls and set up error
      window.Pi.init.mockClear();
      window.Pi.init.mockRejectedValueOnce(new Error("Init failed"));

      await expect(piAuth.init()).rejects.toThrow("Init failed");
      expect(piAuth.initialized).toBe(false);
      
      // Restore env
      process.env.NEXT_PUBLIC_PI_SANDBOX = originalEnv;
    });
  });

  describe.skip("authenticate", () => {
    it("should authenticate user successfully", async () => {
      const mockAuthResult = {
        user: {
          uid: "test-pi-id",
          username: "testuser",
          wallet_address: "0x123",
        },
        accessToken: "test-token",
      };

      mockWindow.Pi.authenticate.mockResolvedValue(mockAuthResult);

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            id: "user-123",
            username: "testuser",
            tier: "STANDARD",
            status: "ACTIVE",
          },
        }),
      });

      // Start authentication
      const authPromise = piAuth.authenticate();

      // Fast-forward timers to skip waitForPiSDK
      jest.runAllTimers();

      const result = await piAuth.authenticate();

      expect(result.success).toBe(true);
      expect(result.user.piId).toBe("test-pi-id");
      expect(result.user.username).toBe("testuser");
      expect(piAuth.isAuthenticated()).toBe(true);
    });

    it("should handle authentication failure", async () => {
      mockWindow.Pi.authenticate.mockRejectedValue(new Error("Auth failed"));

      const result = await piAuth.authenticate();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Auth failed");
      expect(piAuth.isAuthenticated()).toBe(false);
    });

    it("should throw error when Pi Browser not available", async () => {
      global.window = {};

      await expect(piAuth.authenticate()).rejects.toThrow(
        "Pi Browser required",
      );
    });

    it("should sync user with backend", async () => {
      const mockAuthResult = {
        user: {
          uid: "test-pi-id",
          username: "testuser",
          wallet_address: "0x123",
        },
        accessToken: "test-token",
      };

      mockWindow.Pi.authenticate.mockResolvedValue(mockAuthResult);

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            id: "user-123",
            username: "testuser",
            tier: "PREMIUM",
            status: "ACTIVE",
          },
        }),
      });

      await piAuth.authenticate();

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/pi-authenticate",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("testuser"),
        }),
      );
    });
  });

  describe("onIncompletePaymentFound", () => {
    it("should store incomplete payment in localStorage", () => {
      const mockPayment = {
        identifier: "payment-123",
        amount: 100,
      };

      const getItemSpy = jest
        .spyOn(Storage.prototype, "getItem")
        .mockReturnValue("[]");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

      piAuth.onIncompletePaymentFound(mockPayment);

      expect(setItemSpy).toHaveBeenCalledWith(
        "pi_incomplete_payments",
        expect.stringContaining("payment-123"),
      );

      getItemSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe("getIncompletePayments", () => {
    it("should retrieve incomplete payments from localStorage", async () => {
      const mockPayments = [
        { identifier: "payment-1", amount: 100 },
        { identifier: "payment-2", amount: 200 },
      ];

      const getItemSpy = jest
        .spyOn(Storage.prototype, "getItem")
        .mockReturnValue(JSON.stringify(mockPayments));

      const payments = await piAuth.getIncompletePayments();

      expect(payments).toHaveLength(2);
      expect(payments[0].identifier).toBe("payment-1");

      getItemSpy.mockRestore();
    });

    it("should return empty array when no incomplete payments", async () => {
      const getItemSpy = jest
        .spyOn(Storage.prototype, "getItem")
        .mockReturnValue(null);

      const payments = await piAuth.getIncompletePayments();

      expect(payments).toEqual([]);

      getItemSpy.mockRestore();
    });
  });

  describe("signOut", () => {
    it("should clear user data and localStorage", async () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

      piAuth.user = { piId: "test-id" };
      piAuth.authenticated = true;

      await piAuth.signOut();

      expect(piAuth.user).toBeNull();
      expect(piAuth.authenticated).toBe(false);
      expect(removeItemSpy).toHaveBeenCalledWith("pi_incomplete_payments");

      removeItemSpy.mockRestore();
    });
  });

  describe("getUser", () => {
    it("should return current user", () => {
      const mockUser = { piId: "test-id", username: "testuser" };
      piAuth.user = mockUser;

      const user = piAuth.getUser();

      expect(user).toEqual(mockUser);
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when authenticated", () => {
      piAuth.authenticated = true;
      piAuth.user = { piId: "test-id" };

      expect(piAuth.isAuthenticated()).toBe(true);
    });

    it("should return false when not authenticated", () => {
      piAuth.authenticated = false;
      piAuth.user = null;

      expect(piAuth.isAuthenticated()).toBe(false);
    });
  });
});
