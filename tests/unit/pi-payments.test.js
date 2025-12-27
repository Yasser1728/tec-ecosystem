/**
 * Unit tests for Pi Payments Module
 */

import { PiPayments, DOMAIN_PRICES, PAYMENT_TYPES } from '../../lib/pi-payments';
import { piAuth } from '../../lib/pi-auth';

jest.mock('../../lib/pi-auth');

describe('PiPayments', () => {
  let piPayments;
  let mockWindow;

  beforeEach(() => {
    piPayments = new PiPayments();
    
    // Mock window.Pi
    mockWindow = {
      Pi: {
        createPayment: jest.fn()
      }
    };
    global.window = mockWindow;
    
    // Mock fetch
    global.fetch = jest.fn();
    
    // Mock piAuth
    piAuth.getUser.mockReturnValue({
      id: 'user-123',
      piId: 'pi-123',
      username: 'testuser'
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDomainPurchase', () => {
    it('should create domain purchase payment', async () => {
      const mockPaymentRecord = {
        id: 'payment-123',
        amount: 100,
        domain: 'fundx'
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: mockPaymentRecord
        })
      });

      mockWindow.Pi.createPayment.mockResolvedValue({
        identifier: 'pi-payment-123'
      });

      const result = await piPayments.createDomainPurchase({
        domain: 'fundx',
        tier: 'STANDARD'
      });

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('pi-payment-123');
    });

    it('should apply tier multiplier for premium tier', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: 'payment-123' }
        })
      });

      mockWindow.Pi.createPayment.mockResolvedValue({
        identifier: 'pi-payment-123'
      });

      await piPayments.createDomainPurchase({
        domain: 'fundx',
        tier: 'PREMIUM'
      });

      const expectedAmount = DOMAIN_PRICES.fundx * 1.5;
      
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/create-payment',
        expect.objectContaining({
          body: expect.stringContaining(expectedAmount.toString())
        })
      );
    });

    it('should throw error when user not authenticated', async () => {
      piAuth.getUser.mockReturnValue(null);

      await expect(
        piPayments.createDomainPurchase({ domain: 'fundx' })
      ).rejects.toThrow('User must be authenticated');
    });
  });

  describe('createNotificationPayment', () => {
    it('should create notification payment with monthly duration', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: 'payment-123' }
        })
      });

      mockWindow.Pi.createPayment.mockResolvedValue({
        identifier: 'pi-payment-123'
      });

      const result = await piPayments.createNotificationPayment({
        notificationType: 'premium',
        duration: 'monthly'
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/create-payment',
        expect.objectContaining({
          body: expect.stringContaining('"amount":10')
        })
      );
    });

    it('should apply correct pricing for yearly duration', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: 'payment-123' }
        })
      });

      mockWindow.Pi.createPayment.mockResolvedValue({
        identifier: 'pi-payment-123'
      });

      await piPayments.createNotificationPayment({
        notificationType: 'premium',
        duration: 'yearly'
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/create-payment',
        expect.objectContaining({
          body: expect.stringContaining('"amount":80')
        })
      );
    });
  });

  describe('createEcommercePayment', () => {
    it('should create ecommerce payment with quantity', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: 'payment-123' }
        })
      });

      mockWindow.Pi.createPayment.mockResolvedValue({
        identifier: 'pi-payment-123'
      });

      const result = await piPayments.createEcommercePayment({
        serviceId: 'service-1',
        serviceName: 'Luxury Service',
        price: 50,
        quantity: 3
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/create-payment',
        expect.objectContaining({
          body: expect.stringContaining('"amount":150')
        })
      );
    });
  });

  describe('createNFTMintingPayment', () => {
    it('should create NFT minting payment', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: 'payment-123' }
        })
      });

      mockWindow.Pi.createPayment.mockResolvedValue({
        identifier: 'pi-payment-123'
      });

      const result = await piPayments.createNFTMintingPayment({
        domainName: 'fundx',
        certificateType: 'ownership'
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/create-payment',
        expect.objectContaining({
          body: expect.stringContaining('"amount":50')
        })
      );
    });
  });

  describe('handleApproval', () => {
    it('should call approval API endpoint', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await piPayments.handleApproval('pi-payment-123', 'internal-123');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/approve',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('pi-payment-123')
        })
      );
    });
  });

  describe('handleCompletion', () => {
    it('should call completion API and dispatch event', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

      await piPayments.handleCompletion('pi-payment-123', 'txid-123', 'internal-123');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/complete',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('txid-123')
        })
      );

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pi-payment-completed'
        })
      );
    });
  });

  describe('handleCancel', () => {
    it('should call cancel API endpoint', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await piPayments.handleCancel('pi-payment-123', 'internal-123');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/cancel',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  describe('getActivePayments', () => {
    it('should return array of active payments', () => {
      piPayments.activePayments.set('payment-1', { amount: 100 });
      piPayments.activePayments.set('payment-2', { amount: 200 });

      const payments = piPayments.getActivePayments();

      expect(payments).toHaveLength(2);
    });
  });
});
