/**
 * End-to-End tests for Pi Authentication Flow
 */

describe.skip('Pi Authentication Flow E2E', () => {
  beforeEach(() => {
    // Mock window.Pi for E2E tests
    global.window = {
      Pi: {
        init: jest.fn().mockResolvedValue(true),
        authenticate: jest.fn()
      },
      dispatchEvent: jest.fn()
    };

    global.fetch = jest.fn();
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full authentication flow', async () => {
    // Step 1: User clicks authenticate button
    const mockAuthResult = {
      user: {
        uid: 'test-pi-id',
        username: 'testuser',
        wallet_address: '0x123'
      },
      accessToken: 'test-token'
    };

    window.Pi.authenticate.mockResolvedValue(mockAuthResult);

    // Step 2: Backend syncs user
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

    // Import and execute auth
    const { PiAuth } = require('../../lib/pi-auth');
    const piAuth = new PiAuth();

    const result = await piAuth.authenticate();

    // Verify authentication succeeded
    expect(result.success).toBe(true);
    expect(result.user.piId).toBe('test-pi-id');
    expect(result.user.username).toBe('testuser');

    // Verify backend sync was called
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/pi-authenticate',
      expect.objectContaining({
        method: 'POST'
      })
    );

    // Verify user is authenticated
    expect(piAuth.isAuthenticated()).toBe(true);
  });

  it('should handle authentication failure gracefully', async () => {
    window.Pi.authenticate.mockRejectedValue(new Error('User cancelled'));

    const { PiAuth } = require('../../lib/pi-auth');
    const piAuth = new PiAuth();

    const result = await piAuth.authenticate();

    expect(result.success).toBe(false);
    expect(result.error).toBe('User cancelled');
    expect(piAuth.isAuthenticated()).toBe(false);
  });

  it('should handle incomplete payments during authentication', async () => {
    const mockIncompletePayment = {
      identifier: 'incomplete-payment-123',
      amount: 100
    };

    const mockAuthResult = {
      user: {
        uid: 'test-pi-id',
        username: 'testuser',
        wallet_address: '0x123'
      },
      accessToken: 'test-token'
    };

    // Simulate incomplete payment callback
    window.Pi.authenticate.mockImplementation((scopes, onIncompletePayment) => {
      onIncompletePayment(mockIncompletePayment);
      return Promise.resolve(mockAuthResult);
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: 'user-123', username: 'testuser', tier: 'STANDARD', status: 'ACTIVE' }
      })
    });

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('[]');
    jest.spyOn(Storage.prototype, 'setItem');

    const { PiAuth } = require('../../lib/pi-auth');
    const piAuth = new PiAuth();

    await piAuth.authenticate();

    // Verify incomplete payment was stored
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pi_incomplete_payments',
      expect.stringContaining('incomplete-payment-123')
    );
  });

  it('should complete full payment flow after authentication', async () => {
    // Step 1: Authenticate
    const mockAuthResult = {
      user: {
        uid: 'test-pi-id',
        username: 'testuser',
        wallet_address: '0x123'
      },
      accessToken: 'test-token'
    };

    window.Pi.authenticate.mockResolvedValue(mockAuthResult);
    window.Pi.createPayment = jest.fn();

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { id: 'user-123', username: 'testuser', tier: 'STANDARD', status: 'ACTIVE' }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: 'payment-123', amount: 100, domain: 'fundx' }
        })
      });

    const { PiAuth } = require('../../lib/pi-auth');
    const { PiPayments } = require('../../lib/pi-payments');
    
    const piAuth = new PiAuth();
    const piPayments = new PiPayments();

    // Authenticate
    await piAuth.authenticate();

    // Step 2: Create payment
    window.Pi.createPayment.mockResolvedValue({
      identifier: 'pi-payment-123'
    });

    const paymentResult = await piPayments.createDomainPurchase({
      domain: 'fundx',
      tier: 'STANDARD'
    });

    expect(paymentResult.success).toBe(true);
    expect(paymentResult.paymentId).toBe('pi-payment-123');
  });
});
