/**
 * Unit tests for Pi Authentication Module
 */

import { PiAuth } from '../../lib/pi-auth';

describe('PiAuth', () => {
  let piAuth;
  let mockWindow;

  beforeEach(() => {
    piAuth = new PiAuth();
    
    // Mock window.Pi
    mockWindow = {
      Pi: {
        authenticate: jest.fn()
      }
    };
    global.window = mockWindow;
    
    // Mock fetch
    global.fetch = jest.fn();
    
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate user successfully', async () => {
      const mockAuthResult = {
        user: {
          uid: 'test-pi-id',
          username: 'testuser',
          wallet_address: '0x123'
        },
        accessToken: 'test-token'
      };

      mockWindow.Pi.authenticate.mockResolvedValue(mockAuthResult);
      
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            id: 'user-123',
            username: 'testuser',
            tier: 'STANDARD',
            status: 'ACTIVE'
          }
        })
      });

      const result = await piAuth.authenticate();

      expect(result.success).toBe(true);
      expect(result.user.piId).toBe('test-pi-id');
      expect(result.user.username).toBe('testuser');
      expect(piAuth.isAuthenticated()).toBe(true);
    });

    it('should handle authentication failure', async () => {
      mockWindow.Pi.authenticate.mockRejectedValue(new Error('Auth failed'));

      const result = await piAuth.authenticate();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Auth failed');
      expect(piAuth.isAuthenticated()).toBe(false);
    });

    it('should throw error when Pi Browser not available', async () => {
      global.window = {};

      await expect(piAuth.authenticate()).rejects.toThrow('Pi Browser required');
    });

    it('should sync user with backend', async () => {
      const mockAuthResult = {
        user: {
          uid: 'test-pi-id',
          username: 'testuser',
          wallet_address: '0x123'
        },
        accessToken: 'test-token'
      };

      mockWindow.Pi.authenticate.mockResolvedValue(mockAuthResult);
      
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            id: 'user-123',
            username: 'testuser',
            tier: 'PREMIUM',
            status: 'ACTIVE'
          }
        })
      });

      await piAuth.authenticate();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/pi-authenticate',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('testuser')
        })
      );
    });
  });

  describe('onIncompletePaymentFound', () => {
    it('should store incomplete payment in localStorage', () => {
      const mockPayment = {
        identifier: 'payment-123',
        amount: 100
      };

      localStorage.getItem.mockReturnValue('[]');

      piAuth.onIncompletePaymentFound(mockPayment);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pi_incomplete_payments',
        expect.stringContaining('payment-123')
      );
    });
  });

  describe('getIncompletePayments', () => {
    it('should retrieve incomplete payments from localStorage', async () => {
      const mockPayments = [
        { identifier: 'payment-1', amount: 100 },
        { identifier: 'payment-2', amount: 200 }
      ];

      localStorage.getItem.mockReturnValue(JSON.stringify(mockPayments));

      const payments = await piAuth.getIncompletePayments();

      expect(payments).toHaveLength(2);
      expect(payments[0].identifier).toBe('payment-1');
    });

    it('should return empty array when no incomplete payments', async () => {
      localStorage.getItem.mockReturnValue(null);

      const payments = await piAuth.getIncompletePayments();

      expect(payments).toEqual([]);
    });
  });

  describe('signOut', () => {
    it('should clear user data and localStorage', async () => {
      piAuth.user = { piId: 'test-id' };
      piAuth.authenticated = true;

      await piAuth.signOut();

      expect(piAuth.user).toBeNull();
      expect(piAuth.authenticated).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('pi_incomplete_payments');
    });
  });

  describe('getUser', () => {
    it('should return current user', () => {
      const mockUser = { piId: 'test-id', username: 'testuser' };
      piAuth.user = mockUser;

      const user = piAuth.getUser();

      expect(user).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when authenticated', () => {
      piAuth.authenticated = true;
      piAuth.user = { piId: 'test-id' };

      expect(piAuth.isAuthenticated()).toBe(true);
    });

    it('should return false when not authenticated', () => {
      piAuth.authenticated = false;
      piAuth.user = null;

      expect(piAuth.isAuthenticated()).toBe(false);
    });
  });
});
