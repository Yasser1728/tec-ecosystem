/**
 * Commerce Service - Unit Tests
 * 
 * Tests for core commerce business logic
 */

const CommerceService = require('../../../services/commerceService');

describe('CommerceService', () => {
  let commerceService;
  
  beforeEach(() => {
    commerceService = new CommerceService();
  });
  
  describe('createProduct', () => {
    test('should create product with valid data', async () => {
      const productData = {
        sellerId: 'biz_seller_123',
        name: 'Test Product',
        description: 'Test description',
        category: 'ELECTRONICS',
        sku: 'TEST-SKU-001',
        unitPrice: 100,
        moq: 10,
        stockQuantity: 500,
      };
      
      const product = await commerceService.createProduct(productData);
      
      expect(product).toBeDefined();
      expect(product.id).toMatch(/^prod_/);
      expect(product.name).toBe('Test Product');
      expect(product.unitPrice).toBe(100);
      expect(product.status).toBe('ACTIVE');
    });
    
    test('should throw error when seller ID is missing', async () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test description',
      };
      
      await expect(commerceService.createProduct(invalidData))
        .rejects
        .toThrow('Seller ID is required');
    });
    
    test('should throw error when unit price is invalid', async () => {
      const invalidData = {
        sellerId: 'biz_seller_123',
        name: 'Test Product',
        description: 'Test description',
        category: 'ELECTRONICS',
        sku: 'TEST-SKU-001',
        unitPrice: -10,
        moq: 10,
        stockQuantity: 500,
      };
      
      await expect(commerceService.createProduct(invalidData))
        .rejects
        .toThrow('Valid unit price is required');
    });
  });
  
  describe('createOrder', () => {
    test('should create order with valid data', async () => {
      const orderData = {
        buyerId: 'biz_buyer_123',
        sellerId: 'biz_seller_123',
        items: [
          {
            productId: 'prod_123',
            quantity: 50,
            unitPrice: 100,
          }
        ],
        paymentTerms: 'NET_30',
        shippingAddress: {
          street: '123 Test St',
          city: 'Dubai',
          state: 'Dubai',
          country: 'UAE',
          postalCode: '12345',
        },
      };
      
      const order = await commerceService.createOrder(orderData);
      
      expect(order).toBeDefined();
      expect(order.id).toMatch(/^ord_/);
      expect(order.orderNumber).toMatch(/^PO-/);
      expect(order.status).toBe('PENDING_APPROVAL');
      expect(order.paymentStatus).toBe('PENDING');
      expect(order.items).toHaveLength(1);
    });
    
    test('should throw error when buyer ID is missing', async () => {
      const invalidData = {
        sellerId: 'biz_seller_123',
        items: [],
        paymentTerms: 'NET_30',
      };
      
      await expect(commerceService.createOrder(invalidData))
        .rejects
        .toThrow('Buyer ID is required');
    });
    
    test('should throw error when items array is empty', async () => {
      const invalidData = {
        buyerId: 'biz_buyer_123',
        sellerId: 'biz_seller_123',
        items: [],
        paymentTerms: 'NET_30',
        shippingAddress: {},
      };
      
      await expect(commerceService.createOrder(invalidData))
        .rejects
        .toThrow('Order must have at least one item');
    });
  });
  
  describe('calculateOrderFinancials', () => {
    test('should calculate correct totals', () => {
      const items = [
        { subtotal: 1000 },
        { subtotal: 2000 },
      ];
      
      const financials = commerceService.calculateOrderFinancials(items);
      
      expect(financials.subtotal).toBe(3000);
      expect(financials.tax).toBe(300); // 10% tax
      expect(financials.total).toBe(3300);
    });
    
    test('should handle empty items array', () => {
      const items = [];
      
      const financials = commerceService.calculateOrderFinancials(items);
      
      expect(financials.subtotal).toBe(0);
      expect(financials.tax).toBe(0);
      expect(financials.total).toBe(0);
    });
  });
  
  describe('calculateDueDate', () => {
    test('should calculate NET_30 due date correctly', () => {
      const dueDate = commerceService.calculateDueDate('NET_30');
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 30);
      
      expect(dueDate.getDate()).toBe(expectedDate.getDate());
      expect(dueDate.getMonth()).toBe(expectedDate.getMonth());
    });
    
    test('should calculate NET_0 due date correctly', () => {
      const dueDate = commerceService.calculateDueDate('NET_0');
      const today = new Date();
      
      expect(dueDate.getDate()).toBe(today.getDate());
    });
    
    test('should default to 30 days for unknown terms', () => {
      const dueDate = commerceService.calculateDueDate('UNKNOWN_TERMS');
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 30);
      
      expect(dueDate.getDate()).toBe(expectedDate.getDate());
    });
  });
  
  describe('registerBusiness', () => {
    test('should register business with valid data', async () => {
      const businessData = {
        name: 'Test Business Inc.',
        type: 'WHOLESALER',
        taxId: 'TAX-123456',
        registrationNumber: 'REG-789012',
        address: {
          street: '123 Business St',
          city: 'Dubai',
          state: 'Dubai',
          country: 'UAE',
          postalCode: '12345',
        },
        contactInfo: {
          email: 'contact@testbusiness.pi',
          phone: '+971-50-1234567',
        },
      };
      
      const business = await commerceService.registerBusiness(businessData);
      
      expect(business).toBeDefined();
      expect(business.id).toMatch(/^biz_/);
      expect(business.name).toBe('Test Business Inc.');
      expect(business.verificationStatus).toBe('PENDING');
      expect(business.rating).toBe(0);
      expect(business.totalOrders).toBe(0);
    });
    
    test('should throw error when business name is missing', async () => {
      const invalidData = {
        type: 'WHOLESALER',
        taxId: 'TAX-123456',
      };
      
      await expect(commerceService.registerBusiness(invalidData))
        .rejects
        .toThrow('Business name is required');
    });
  });
  
  describe('generateOrderNumber', () => {
    test('should generate unique order numbers', () => {
      const orderNumber1 = commerceService.generateOrderNumber();
      const orderNumber2 = commerceService.generateOrderNumber();
      
      expect(orderNumber1).toMatch(/^PO-\d+-\d+$/);
      expect(orderNumber2).toMatch(/^PO-\d+-\d+$/);
      expect(orderNumber1).not.toBe(orderNumber2);
    });
  });
  
  describe('generateTransactionId', () => {
    test('should generate unique transaction IDs', () => {
      const txn1 = commerceService.generateTransactionId();
      const txn2 = commerceService.generateTransactionId();
      
      expect(txn1).toMatch(/^TXN-\d+-[a-z0-9]+$/);
      expect(txn2).toMatch(/^TXN-\d+-[a-z0-9]+$/);
      expect(txn1).not.toBe(txn2);
    });
  });
});
