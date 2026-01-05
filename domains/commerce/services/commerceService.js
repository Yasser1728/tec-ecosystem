/**
 * Commerce Service - Core Business Logic for Commerce Domain
 * 
 * This service handles all business logic related to commerce operations,
 * including product management, order processing, payment handling, and transactions.
 * 
 * @module services/commerceService
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Business transaction limits
// Maximum allowed transaction amount for commerce operations
// Set to 10 billion units to prevent overflow and ensure proper validation
// This limit applies to all commercial transactions and serves as a safety threshold
/**
 * Maximum transaction amount limit for commerce operations (10 billion)
 * This constant defines the upper bound for any commercial transaction
 * to prevent processing errors and ensure proper business rule enforcement
 */
const MAX_AMOUNT_LIMIT = 10000000000;

// Pricing constants
const PRICING = {
  TAX_RATE: 0.15, // 15% tax rate
  DISCOUNT_THRESHOLD: 1000, // Minimum order for bulk discount
  BULK_DISCOUNT: 0.10, // 10% discount for bulk orders
};

// Order status constants
const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

class CommerceService {
  /**
   * Create a new product
   * 
   * @param {Object} data - Product creation data
   * @param {string} data.name - Product name
   * @param {string} data.description - Product description
   * @param {number} data.price - Product price
   * @param {number} data.stock - Available stock
   * @param {Object} [data.metadata] - Optional metadata
   * @returns {Promise<Object>} Created product
   */
  async createProduct(data) {
    try {
      // Validate required fields
      this.validateProductData(data);
      
      // Create product in database
      const product = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category || null,
          status: 'ACTIVE',
          metadata: data.metadata || {},
        },
      });
      
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }
  
  /**
   * Get product by ID
   * 
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(productId) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }
      
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
  
  /**
   * Create a new order
   * 
   * @param {Object} data - Order creation data
   * @param {string} data.userId - User ID
   * @param {Array} data.items - Order items
   * @param {Object} [data.metadata] - Optional metadata
   * @returns {Promise<Object>} Created order
   */
  async createOrder(data) {
    try {
      // Validate order data
      this.validateOrderData(data);
      
      // Calculate order totals
      const totals = await this.calculateOrderTotals(data.items);
      
      // Validate transaction amount against MAX_AMOUNT_LIMIT
      if (totals.total > MAX_AMOUNT_LIMIT) {
        throw new Error(`Order total exceeds maximum allowed amount of ${MAX_AMOUNT_LIMIT}`);
      }
      
      // Generate order number
      const orderNumber = this.generateOrderNumber();
      
      // Create order in database
      const order = await prisma.order.create({
        data: {
          userId: data.userId,
          orderNumber: orderNumber,
          subtotal: totals.subtotal,
          tax: totals.tax,
          discount: totals.discount,
          total: totals.total,
          status: ORDER_STATUS.PENDING,
          items: data.items,
          metadata: data.metadata || {},
        },
      });
      
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  /**
   * Calculate order totals including tax and discounts
   * 
   * @param {Array} items - Order items
   * @returns {Promise<Object>} Calculated totals
   */
  async calculateOrderTotals(items) {
    let subtotal = 0;
    
    for (const item of items) {
      const product = await this.getProductById(item.productId);
      subtotal += product.price * item.quantity;
    }
    
    // Apply bulk discount if applicable
    let discount = 0;
    if (subtotal >= PRICING.DISCOUNT_THRESHOLD) {
      discount = subtotal * PRICING.BULK_DISCOUNT;
    }
    
    // Calculate tax
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * PRICING.TAX_RATE;
    
    // Calculate total
    const total = taxableAmount + tax;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }
  
  /**
   * Generate a unique order number
   * Uses cryptographically secure random number generation for security
   * This is critical for order tracking and prevents predictable order numbers
   * that could be exploited for unauthorized access or fraud
   * 
   * @returns {string} Order number
   */
  generateOrderNumber() {
    const prefix = 'ORD';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    // Use crypto.randomBytes() for cryptographically secure random number generation
    // This replaces Math.random() which is not suitable for security-sensitive operations
    // Math.random() uses a predictable pseudo-random algorithm that can be exploited
    // crypto.randomBytes() provides cryptographic-quality randomness from the OS
    const random = crypto.randomBytes(4).readUInt32LE().toString().padStart(10, '0');
    
    return `${prefix}-${year}${month}-${random}`;
  }
  
  /**
   * Process order payment
   * 
   * @param {string} orderId - Order ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(orderId, paymentData) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
      
      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }
      
      // Validate payment amount matches order total
      if (paymentData.amount !== order.total) {
        throw new Error('Payment amount does not match order total');
      }
      
      // Process payment (simplified)
      const payment = await prisma.payment.create({
        data: {
          orderId: orderId,
          amount: paymentData.amount,
          method: paymentData.method,
          status: 'COMPLETED',
          transactionId: this.generateTransactionId(),
          metadata: paymentData.metadata || {},
        },
      });
      
      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: ORDER_STATUS.PROCESSING },
      });
      
      return payment;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
  
  /**
   * Generate a unique transaction ID
   * Uses secure random generation for payment security
   * 
   * @returns {string} Transaction ID
   */
  generateTransactionId() {
    const prefix = 'TXN';
    const timestamp = Date.now();
    // Use crypto for secure random generation in financial transactions
    const random = crypto.randomBytes(4).readUInt32LE().toString(16).padStart(8, '0');
    
    return `${prefix}-${timestamp}-${random}`;
  }
  
  /**
   * Validate product data
   * 
   * @param {Object} data - Product data to validate
   * @throws {Error} If validation fails
   */
  validateProductData(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Product name is required');
    }
    
    if (!data.price || data.price <= 0) {
      throw new Error('Valid product price is required');
    }
    
    if (data.price > MAX_AMOUNT_LIMIT) {
      throw new Error(`Product price exceeds maximum limit of ${MAX_AMOUNT_LIMIT}`);
    }
    
    if (data.stock === undefined || data.stock < 0) {
      throw new Error('Valid stock quantity is required');
    }
  }
  
  /**
   * Validate order data
   * 
   * @param {Object} data - Order data to validate
   * @throws {Error} If validation fails
   */
  validateOrderData(data) {
    if (!data.userId) {
      throw new Error('User ID is required');
    }
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    for (const item of data.items) {
      if (!item.productId) {
        throw new Error('Product ID is required for all items');
      }
      
      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Valid quantity is required for all items');
      }
    }
  }
  
  /**
   * Update order status
   * 
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, status) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
      
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
  
  /**
   * Get user orders
   * 
   * @param {string} userId - User ID
   * @param {Object} [filters] - Filter options
   * @returns {Promise<Array>} Array of orders
   */
  async getUserOrders(userId, filters = {}) {
    try {
      const where = { userId };
      
      if (filters.status) {
        where.status = filters.status;
      }
      
      const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }
}

// Export class for flexibility in testing and dependency injection
module.exports = CommerceService;

// Export singleton instance as default
module.exports.default = new CommerceService();
