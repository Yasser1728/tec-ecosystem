/**
 * Commerce Service - Core Business Logic for Commerce Domain
 * 
 * This service handles all business logic related to B2B commerce operations,
 * including order management, seller operations, and transaction processing.
 * 
 * @module services/commerceService
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Maximum amount limit for commercial operations
 * This ceiling ensures transactions stay within safe processing limits
 * and helps prevent fraudulent or erroneous large-value transactions
 * 
 * Value: 10,000,000,000 (10 billion)
 */
const MAX_AMOUNT_LIMIT = 1e10;

// Minimum order quantities for bulk B2B transactions
const ORDER_LIMITS = {
  MIN_BULK_ORDER: 10,
  MIN_WHOLESALE_ORDER: 100,
};

// Payment term constants (in days)
const PAYMENT_TERMS = {
  IMMEDIATE: 0,
  NET_30: 30,
  NET_60: 60,
  NET_90: 90,
};

// Transaction fee rates (as fractions for precision)
const TRANSACTION_FEES = {
  STANDARD: 1 / 100, // 1%
  PREMIUM: 0.5 / 100, // 0.5%
  ENTERPRISE: 0.25 / 100, // 0.25%
};

class CommerceService {
  /**
   * Create a new B2B order
   * 
   * @param {Object} data - Order creation data
   * @param {string} data.buyerId - Buyer ID
   * @param {string} data.sellerId - Seller ID
   * @param {Array} data.items - Array of order items
   * @param {Object} [data.metadata] - Optional metadata
   * @returns {Promise<Object>} Created order
   */
  async createOrder(data) {
    try {
      // Validate required fields
      this.validateOrderData(data);
      
      // Calculate order totals
      const totals = this.calculateOrderTotals(data.items);
      
      // Validate against maximum amount limit
      if (totals.grandTotal > MAX_AMOUNT_LIMIT) {
        throw new Error(`Order total exceeds maximum limit of ${MAX_AMOUNT_LIMIT}`);
      }
      
      // Create order in database
      const order = await prisma.order.create({
        data: {
          buyerId: data.buyerId,
          sellerId: data.sellerId,
          orderNumber: this.generateOrderNumber(),
          subtotal: totals.subtotal,
          tax: totals.tax,
          shippingCost: data.shippingCost || 0,
          total: totals.grandTotal,
          status: 'PENDING',
          paymentTerms: data.paymentTerms || 'NET_30',
          metadata: data.metadata || {},
        },
      });
      
      return order;
    } catch (error) {
      // TODO: Replace with proper logging library (e.g., Winston, Pino)
      console.error('Error creating order:', error);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
  
  /**
   * Calculate order totals including tax and fees
   * 
   * @param {Array} items - Order items
   * @returns {Object} Calculated totals
   */
  calculateOrderTotals(items) {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    // Calculate tax (simplified - would use tax service in production)
    const tax = subtotal * 0.1; // 10% tax
    
    // Calculate transaction fee based on volume
    let feeRate = TRANSACTION_FEES.STANDARD;
    if (subtotal > 100000) {
      feeRate = TRANSACTION_FEES.PREMIUM;
    } else if (subtotal > 1000000) {
      feeRate = TRANSACTION_FEES.ENTERPRISE;
    }
    
    const transactionFee = subtotal * feeRate;
    const grandTotal = subtotal + tax + transactionFee;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      transactionFee: Math.round(transactionFee * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
    };
  }
  
  /**
   * Validate order data
   * 
   * @param {Object} data - Order data to validate
   * @throws {Error} If validation fails
   */
  validateOrderData(data) {
    if (!data.buyerId) {
      throw new Error('Buyer ID is required');
    }
    
    if (!data.sellerId) {
      throw new Error('Seller ID is required');
    }
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    // Validate each item
    data.items.forEach((item, index) => {
      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      
      if (!item.unitPrice || item.unitPrice <= 0) {
        throw new Error(`Item ${index + 1}: Unit price must be greater than 0`);
      }
      
      // Validate against maximum amount limit for individual items
      const itemTotal = item.quantity * item.unitPrice;
      if (itemTotal > MAX_AMOUNT_LIMIT) {
        throw new Error(`Item ${index + 1}: Total exceeds maximum limit of ${MAX_AMOUNT_LIMIT}`);
      }
    });
  }
  
  /**
   * Generate a unique order number
   * 
   * @returns {string} Order number
   */
  generateOrderNumber() {
    const prefix = 'ORD';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `${prefix}-${timestamp}-${random}`;
  }
  
  /**
   * Get order by ID with all related data
   * 
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order with related data
   */
  async getOrderById(orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          buyer: true,
          seller: true,
          items: true,
        },
      });
      
      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }
      
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
  
  /**
   * Process a payment for an order
   * 
   * @param {string} orderId - Order ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(orderId, paymentData) {
    try {
      const order = await this.getOrderById(orderId);
      
      // Validate payment amount
      if (paymentData.amount !== order.total) {
        throw new Error('Payment amount does not match order total');
      }
      
      // Validate against maximum amount limit
      if (paymentData.amount > MAX_AMOUNT_LIMIT) {
        throw new Error(`Payment amount exceeds maximum limit of ${MAX_AMOUNT_LIMIT}`);
      }
      
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: paymentData.amount,
          currency: paymentData.currency || 'USD',
          method: paymentData.method,
          status: 'COMPLETED',
          transactionDate: new Date(),
          metadata: paymentData.metadata || {},
        },
      });
      
      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
      });
      
      return {
        success: true,
        payment,
        order,
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
  
  /**
   * Get seller statistics and performance metrics
   * 
   * @param {string} sellerId - Seller ID
   * @returns {Promise<Object>} Seller statistics
   */
  async getSellerStats(sellerId) {
    try {
      const orders = await prisma.order.findMany({
        where: { 
          sellerId,
          status: 'PAID',
        },
        select: {
          total: true,
          createdAt: true,
        },
      });
      
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const orderCount = orders.length;
      const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
      
      return {
        sellerId,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        orderCount,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        calculatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching seller stats:', error);
      throw error;
    }
  }
}

// Export class for flexibility in testing and dependency injection
module.exports = CommerceService;

// Export singleton instance as default
module.exports.default = new CommerceService();
