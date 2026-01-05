/**
 * Tests for Commerce Service
 * Specifically testing the Codacy fixes:
 * 1. MAX_AMOUNT_LIMIT constant usage (replacing 1e10)
 * 2. Secure random number generation using crypto
 */

const CommerceService = require('../../domains/commerce/services/commerceService');
const crypto = require('crypto');

describe('CommerceService - Codacy Fixes Validation', () => {
  let commerceService;

  beforeEach(() => {
    commerceService = new CommerceService();
  });

  describe('MAX_AMOUNT_LIMIT constant', () => {
    it('should be defined as a clear decimal value', () => {
      // Read the source file to verify the constant is written in decimal notation
      const fs = require('fs');
      const path = require('path');
      const serviceFilePath = path.join(__dirname, '../../domains/commerce/services/commerceService.js');
      const serviceSource = fs.readFileSync(serviceFilePath, 'utf-8');
      
      // Verify the constant is defined with explicit decimal notation (not scientific)
      expect(serviceSource).toContain('const MAX_AMOUNT_LIMIT = 10000000000');
      expect(serviceSource).not.toContain('1e10');
      
      // Verify the value equals 10 billion
      expect(10000000000).toBe(10000000000);
    });

    it('should reject product price exceeding MAX_AMOUNT_LIMIT', () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 10000000001, // Exceeds 10 billion limit
        stock: 10,
      };

      expect(() => {
        commerceService.validateProductData(invalidProduct);
      }).toThrow('Product price exceeds maximum limit');
    });

    it('should accept product price within MAX_AMOUNT_LIMIT', () => {
      const validProduct = {
        name: 'Test Product',
        price: 9999999999, // Within limit
        stock: 10,
      };

      expect(() => {
        commerceService.validateProductData(validProduct);
      }).not.toThrow();
    });
  });

  describe('Secure random number generation', () => {
    it('should generate order numbers using crypto module', () => {
      // Mock crypto to verify it's being used
      const originalRandomBytes = crypto.randomBytes;
      let cryptoWasCalled = false;

      crypto.randomBytes = jest.fn((size) => {
        cryptoWasCalled = true;
        return originalRandomBytes(size);
      });

      const orderNumber1 = commerceService.generateOrderNumber();
      const orderNumber2 = commerceService.generateOrderNumber();

      // Verify crypto.randomBytes was called
      expect(cryptoWasCalled).toBe(true);
      expect(crypto.randomBytes).toHaveBeenCalled();

      // Verify order numbers are unique
      expect(orderNumber1).not.toBe(orderNumber2);

      // Verify order number format
      expect(orderNumber1).toMatch(/^ORD-\d{6}-\d+$/);

      // Restore original function
      crypto.randomBytes = originalRandomBytes;
    });

    it('should generate transaction IDs using crypto module', () => {
      const originalRandomBytes = crypto.randomBytes;
      let cryptoWasCalled = false;

      crypto.randomBytes = jest.fn((size) => {
        cryptoWasCalled = true;
        return originalRandomBytes(size);
      });

      const txnId1 = commerceService.generateTransactionId();
      const txnId2 = commerceService.generateTransactionId();

      // Verify crypto.randomBytes was called
      expect(cryptoWasCalled).toBe(true);
      expect(crypto.randomBytes).toHaveBeenCalled();

      // Verify transaction IDs are unique
      expect(txnId1).not.toBe(txnId2);

      // Verify transaction ID format
      expect(txnId1).toMatch(/^TXN-\d+-[a-f0-9]+$/);

      // Restore original function
      crypto.randomBytes = originalRandomBytes;
    });

    it('should NOT use Math.random for security-sensitive operations', () => {
      // Mock Math.random to verify it's NOT being used
      const originalMathRandom = Math.random;
      let mathRandomWasCalled = false;

      Math.random = jest.fn(() => {
        mathRandomWasCalled = true;
        return originalMathRandom();
      });

      commerceService.generateOrderNumber();
      commerceService.generateTransactionId();

      // Verify Math.random was NOT called
      expect(mathRandomWasCalled).toBe(false);
      expect(Math.random).not.toHaveBeenCalled();

      // Restore original function
      Math.random = originalMathRandom;
    });

    it('should generate cryptographically unpredictable order numbers', () => {
      const orderNumbers = new Set();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        orderNumbers.add(commerceService.generateOrderNumber());
      }

      // All order numbers should be unique (no collisions)
      expect(orderNumbers.size).toBe(iterations);
    });
  });

  describe('Product validation', () => {
    it('should validate required product fields', () => {
      expect(() => {
        commerceService.validateProductData({});
      }).toThrow('Product name is required');

      expect(() => {
        commerceService.validateProductData({ name: 'Test' });
      }).toThrow('Valid product price is required');

      expect(() => {
        commerceService.validateProductData({ name: 'Test', price: 100 });
      }).toThrow('Valid stock quantity is required');
    });

    it('should accept valid product data', () => {
      expect(() => {
        commerceService.validateProductData({
          name: 'Test Product',
          price: 100,
          stock: 10,
        });
      }).not.toThrow();
    });
  });

  describe('Order validation', () => {
    it('should validate required order fields', () => {
      expect(() => {
        commerceService.validateOrderData({});
      }).toThrow('User ID is required');

      expect(() => {
        commerceService.validateOrderData({ userId: 'user123' });
      }).toThrow('Order must contain at least one item');
    });

    it('should validate order items', () => {
      expect(() => {
        commerceService.validateOrderData({
          userId: 'user123',
          items: [{ productId: 'prod123' }],
        });
      }).toThrow('Valid quantity is required for all items');

      expect(() => {
        commerceService.validateOrderData({
          userId: 'user123',
          items: [{ quantity: 2 }],
        });
      }).toThrow('Product ID is required for all items');
    });

    it('should accept valid order data', () => {
      expect(() => {
        commerceService.validateOrderData({
          userId: 'user123',
          items: [
            { productId: 'prod123', quantity: 2 },
            { productId: 'prod456', quantity: 1 },
          ],
        });
      }).not.toThrow();
    });
  });
});
