/**
 * Commerce Service - Core Business Logic for Commerce Domain
 * خدمة التجارة - منطق الأعمال الأساسي لدومين التجارة
 * 
 * This service handles all business logic related to B2B commerce,
 * including product management, order processing, supplier verification,
 * and payment handling.
 * 
 * Security Note: This service uses cryptographically secure random number
 * generation (crypto.randomInt) instead of Math.random() to ensure
 * security compliance and prevent predictable number generation.
 * 
 * ملاحظة أمنية: تستخدم هذه الخدمة مولدات أرقام عشوائية آمنة تشفيريًا
 * (crypto.randomInt) بدلاً من Math.random() لضمان الامتثال الأمني
 * ومنع توليد الأرقام القابلة للتنبؤ.
 * 
 * @module services/commerceService
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Constants for order processing
const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
};

const BUSINESS_TYPES = {
  MANUFACTURER: 'MANUFACTURER',
  DISTRIBUTOR: 'DISTRIBUTOR',
  WHOLESALER: 'WHOLESALER',
  RETAILER: 'RETAILER',
};

const VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  PREMIUM: 'PREMIUM',
};

// Pricing constants
const PRICING = {
  VOLUME_DISCOUNT_THRESHOLD: 1000, // Minimum quantity for volume discount
  VOLUME_DISCOUNT_RATE: 0.1, // 10% discount for bulk orders
  EARLY_PAYMENT_DISCOUNT: 0.02, // 2% discount for early payment
  MINIMUM_ORDER_VALUE: 100, // Minimum order value in Pi
};

// Random number generation ranges for ID generation
const RANDOM_RANGES = {
  PO_NUMBER: 1000000, // 6 digits
  INVOICE_NUMBER: 100000, // 5 digits
  TRANSACTION_ID: 10000000000, // 10 digits
  SKU_SUFFIX: 1000, // 3 digits
};

class CommerceService {
  /**
   * Create a new business profile
   * إنشاء ملف تعريف تجاري جديد
   * 
   * @param {Object} data - Business creation data
   * @param {string} data.name - Company legal name
   * @param {string} data.tradeName - Trading name
   * @param {string} data.type - Business type
   * @param {string} data.taxId - Tax identification number
   * @param {Object} data.address - Business address
   * @param {Object} data.contactInfo - Contact details
   * @returns {Promise<Object>} Created business
   */
  async createBusiness(data) {
    try {
      // Validate required fields
      this.validateBusinessData(data);
      
      // Create business in database
      const business = await prisma.business.create({
        data: {
          name: data.name,
          tradeName: data.tradeName || data.name,
          type: data.type,
          taxId: data.taxId,
          registrationNumber: data.registrationNumber || null,
          address: data.address,
          contactInfo: data.contactInfo,
          verificationStatus: VERIFICATION_STATUS.PENDING,
          creditLimit: 0,
          paymentTerms: data.paymentTerms || 'NET30',
          metadata: data.metadata || {},
        },
      });
      
      return business;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  /**
   * Create a new product listing
   * إنشاء قائمة منتج جديدة
   * 
   * @param {Object} data - Product creation data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(data) {
    try {
      // Validate required fields
      this.validateProductData(data);
      
      // Generate SKU if not provided
      const sku = data.sku || this.generateSKU(data.category);
      
      // Create product in database
      const product = await prisma.product.create({
        data: {
          sellerId: data.sellerId,
          sku: sku,
          name: data.name,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory || null,
          unitPrice: data.unitPrice,
          currency: data.currency || 'PI',
          moq: data.moq || 1,
          stockQuantity: data.stockQuantity,
          leadTime: data.leadTime || 7,
          specifications: data.specifications || {},
          images: data.images || [],
          certifications: data.certifications || [],
          status: 'ACTIVE',
          metadata: data.metadata || {},
        },
      });
      
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Create a new purchase order
   * إنشاء طلب شراء جديد
   * 
   * @param {Object} data - Order creation data
   * @returns {Promise<Object>} Created order
   */
  async createOrder(data) {
    try {
      // Validate required fields
      this.validateOrderData(data);
      
      // Calculate order totals
      const totals = await this.calculateOrderTotals(data.items);
      
      // Check minimum order value
      if (totals.total < PRICING.MINIMUM_ORDER_VALUE) {
        throw new Error(`Minimum order value is ${PRICING.MINIMUM_ORDER_VALUE} ${data.currency || 'PI'}`);
      }
      
      // Generate PO number
      const poNumber = this.generatePONumber();
      
      // Calculate due date based on payment terms
      const dueDate = this.calculateDueDate(data.paymentTerms);
      
      // Create order in database
      const order = await prisma.order.create({
        data: {
          poNumber: poNumber,
          buyerId: data.buyerId,
          sellerId: data.sellerId,
          orderDate: new Date(),
          status: ORDER_STATUS.SUBMITTED,
          totalAmount: totals.total,
          currency: data.currency || 'PI',
          paymentTerms: data.paymentTerms || 'NET30',
          paymentStatus: PAYMENT_STATUS.PENDING,
          shippingAddress: data.shippingAddress,
          shippingMethod: data.shippingMethod || 'STANDARD',
          notes: data.notes || '',
          dueDate: dueDate,
          metadata: data.metadata || {},
        },
        include: {
          buyer: true,
          seller: true,
        },
      });
      
      // Create order items
      for (const item of data.items) {
        await this.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          taxAmount: item.taxAmount || 0,
        });
      }
      
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Create an order item
   * إنشاء عنصر طلب
   * 
   * @param {Object} data - Order item data
   * @returns {Promise<Object>} Created order item
   */
  async createOrderItem(data) {
    const subtotal = data.quantity * data.unitPrice;
    const totalAmount = subtotal - data.discount + data.taxAmount;
    
    return await prisma.orderItem.create({
      data: {
        orderId: data.orderId,
        productId: data.productId,
        sku: data.sku,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        subtotal: subtotal,
        discount: data.discount,
        taxAmount: data.taxAmount,
        totalAmount: totalAmount,
      },
    });
  }

  /**
   * Process order payment
   * معالجة دفع الطلب
   * 
   * @param {Object} data - Payment data
   * @returns {Promise<Object>} Payment record
   */
  async processPayment(data) {
    try {
      // Validate payment data
      this.validatePaymentData(data);
      
      // Get order
      const order = await prisma.order.findUnique({
        where: { id: data.orderId },
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Generate invoice number
      const invoiceNumber = this.generateInvoiceNumber();
      
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          orderId: data.orderId,
          invoiceNumber: invoiceNumber,
          amount: data.amount,
          currency: data.currency || order.currency,
          paymentMethod: data.paymentMethod,
          paymentDate: new Date(),
          status: 'COMPLETED',
          transactionId: data.transactionId || null,
          metadata: data.metadata || {},
        },
      });
      
      // Update order payment status
      const totalPaid = await this.calculateTotalPaid(data.orderId);
      let paymentStatus = PAYMENT_STATUS.PENDING;
      
      if (totalPaid >= order.totalAmount) {
        paymentStatus = PAYMENT_STATUS.PAID;
      } else if (totalPaid > 0) {
        paymentStatus = PAYMENT_STATUS.PARTIAL;
      }
      
      await prisma.order.update({
        where: { id: data.orderId },
        data: { paymentStatus: paymentStatus },
      });
      
      // Create invoice
      await this.createInvoice({
        orderId: data.orderId,
        invoiceNumber: invoiceNumber,
        paymentId: payment.id,
      });
      
      return payment;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  /**
   * Create an invoice
   * إنشاء فاتورة
   * 
   * @param {Object} data - Invoice data
   * @returns {Promise<Object>} Created invoice
   */
  async createInvoice(data) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: data.orderId },
        include: {
          items: true,
          buyer: true,
          seller: true,
        },
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      const invoice = await prisma.invoice.create({
        data: {
          orderId: data.orderId,
          invoiceNumber: data.invoiceNumber,
          paymentId: data.paymentId || null,
          issueDate: new Date(),
          dueDate: order.dueDate,
          subtotal: order.totalAmount,
          taxAmount: 0,
          totalAmount: order.totalAmount,
          status: 'ISSUED',
          metadata: {
            buyer: {
              name: order.buyer.name,
              address: order.buyer.address,
            },
            seller: {
              name: order.seller.name,
              address: order.seller.address,
            },
            items: order.items,
          },
        },
      });
      
      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Generate a unique Purchase Order (PO) number
   * توليد رقم طلب شراء فريد
   * 
   * Uses cryptographically secure random number generation for security.
   * يستخدم توليد أرقام عشوائية آمنة تشفيريًا للأمان.
   * 
   * @returns {string} PO number (format: PO-YYYYMM-XXXXXX)
   */
  generatePONumber() {
    const prefix = 'PO';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    // SECURITY FIX: Use crypto.randomInt instead of Math.random for secure random generation
    // إصلاح أمني: استخدام crypto.randomInt بدلاً من Math.random لتوليد آمن للأرقام العشوائية
    const random = crypto.randomInt(0, RANDOM_RANGES.PO_NUMBER).toString().padStart(6, '0');
    
    return `${prefix}-${year}${month}-${random}`;
  }

  /**
   * Generate a unique invoice number
   * توليد رقم فاتورة فريد
   * 
   * Uses cryptographically secure random number generation for security.
   * يستخدم توليد أرقام عشوائية آمنة تشفيريًا للأمان.
   * 
   * @returns {string} Invoice number (format: INV-YYYYMMDD-XXXXX)
   */
  generateInvoiceNumber() {
    const prefix = 'INV';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    // SECURITY FIX: Use crypto.randomInt instead of Math.random for secure random generation
    // إصلاح أمني: استخدام crypto.randomInt بدلاً من Math.random لتوليد آمن للأرقام العشوائية
    const random = crypto.randomInt(0, RANDOM_RANGES.INVOICE_NUMBER).toString().padStart(5, '0');
    
    return `${prefix}-${year}${month}${day}-${random}`;
  }

  /**
   * Generate a unique transaction ID
   * توليد معرف معاملة فريد
   * 
   * Uses cryptographically secure random number generation for security.
   * يستخدم توليد أرقام عشوائية آمنة تشفيريًا للأمان.
   * 
   * @returns {string} Transaction ID (format: TXN-YYYYMMDD-XXXXXXXXXX)
   */
  generateTransactionId() {
    const prefix = 'TXN';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    // SECURITY FIX: Use crypto.randomInt instead of Math.random for secure random generation
    // إصلاح أمني: استخدام crypto.randomInt بدلاً من Math.random لتوليد آمن للأرقام العشوائية
    const random = crypto.randomInt(0, RANDOM_RANGES.TRANSACTION_ID).toString().padStart(10, '0');
    
    return `${prefix}-${year}${month}${day}-${random}`;
  }

  /**
   * Generate SKU for a product
   * توليد رمز SKU للمنتج
   * 
   * @param {string} category - Product category
   * @returns {string} SKU
   */
  generateSKU(category) {
    const categoryCode = category.substring(0, 3).toUpperCase();
    // SECURITY FIX: Use crypto.randomInt for both timestamp and suffix to avoid predictable patterns
    // إصلاح أمني: استخدام crypto.randomInt لكل من الطابع الزمني واللاحقة لتجنب الأنماط القابلة للتنبؤ
    const timestamp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
    const random = crypto.randomInt(0, RANDOM_RANGES.SKU_SUFFIX).toString().padStart(3, '0');
    
    return `${categoryCode}-${timestamp}-${random}`;
  }

  /**
   * Calculate order totals including discounts and taxes
   * حساب إجماليات الطلب بما في ذلك الخصومات والضرائب
   * 
   * @param {Array} items - Order items
   * @returns {Promise<Object>} Order totals
   */
  async calculateOrderTotals(items) {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    
    for (const item of items) {
      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;
      
      // Apply volume discount if applicable
      if (item.quantity >= PRICING.VOLUME_DISCOUNT_THRESHOLD) {
        const discount = itemSubtotal * PRICING.VOLUME_DISCOUNT_RATE;
        totalDiscount += discount;
      }
      
      // Add individual item discount if provided
      if (item.discount) {
        totalDiscount += item.discount;
      }
      
      // Add tax if provided
      if (item.taxAmount) {
        totalTax += item.taxAmount;
      }
    }
    
    const total = subtotal - totalDiscount + totalTax;
    
    return {
      subtotal,
      discount: totalDiscount,
      tax: totalTax,
      total,
    };
  }

  /**
   * Calculate payment due date based on terms
   * حساب تاريخ استحقاق الدفع بناءً على الشروط
   * 
   * @param {string} paymentTerms - Payment terms (NET30, NET60, etc.)
   * @returns {Date} Due date
   */
  calculateDueDate(paymentTerms) {
    const today = new Date();
    let daysToAdd = 30; // Default to NET30
    
    if (paymentTerms === 'NET60') {
      daysToAdd = 60;
    } else if (paymentTerms === 'NET90') {
      daysToAdd = 90;
    } else if (paymentTerms === 'IMMEDIATE') {
      daysToAdd = 0;
    }
    
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    
    return dueDate;
  }

  /**
   * Calculate total amount paid for an order
   * حساب المبلغ الإجمالي المدفوع للطلب
   * 
   * @param {string} orderId - Order ID
   * @returns {Promise<number>} Total paid amount
   */
  async calculateTotalPaid(orderId) {
    const payments = await prisma.payment.findMany({
      where: {
        orderId: orderId,
        status: 'COMPLETED',
      },
    });
    
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  /**
   * Update order status
   * تحديث حالة الطلب
   * 
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, status, metadata = {}) {
    try {
      // Get existing order to preserve metadata
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });
      
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: status,
          metadata: {
            ...(existingOrder?.metadata || {}),
            ...metadata,
          },
        },
      });
      
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Ship an order
   * شحن طلب
   * 
   * @param {string} orderId - Order ID
   * @param {string} trackingNumber - Shipment tracking number
   * @param {string} carrier - Shipping carrier
   * @returns {Promise<Object>} Updated order
   */
  async shipOrder(orderId, trackingNumber, carrier) {
    try {
      // Get existing order to preserve metadata
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });
      
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: ORDER_STATUS.SHIPPED,
          trackingNumber: trackingNumber,
          metadata: {
            ...(existingOrder?.metadata || {}),
            carrier: carrier,
            shippedAt: new Date(),
          },
        },
      });
      
      return order;
    } catch (error) {
      console.error('Error shipping order:', error);
      throw error;
    }
  }

  /**
   * Complete an order
   * إتمام طلب
   * 
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Updated order
   */
  async completeOrder(orderId) {
    try {
      // Get existing order to preserve metadata
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });
      
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: ORDER_STATUS.COMPLETED,
          metadata: {
            ...(existingOrder?.metadata || {}),
            completedAt: new Date(),
          },
        },
      });
      
      return order;
    } catch (error) {
      console.error('Error completing order:', error);
      throw error;
    }
  }

  /**
   * Validate business data
   * التحقق من صحة بيانات الأعمال
   * 
   * @param {Object} data - Business data
   * @throws {Error} If validation fails
   */
  validateBusinessData(data) {
    if (!data.name) {
      throw new Error('Business name is required');
    }
    
    if (!data.type || !Object.values(BUSINESS_TYPES).includes(data.type)) {
      throw new Error('Valid business type is required');
    }
    
    if (!data.taxId) {
      throw new Error('Tax ID is required');
    }
    
    if (!data.address) {
      throw new Error('Business address is required');
    }
    
    if (!data.contactInfo) {
      throw new Error('Contact information is required');
    }
  }

  /**
   * Validate product data
   * التحقق من صحة بيانات المنتج
   * 
   * @param {Object} data - Product data
   * @throws {Error} If validation fails
   */
  validateProductData(data) {
    if (!data.sellerId) {
      throw new Error('Seller ID is required');
    }
    
    if (!data.name) {
      throw new Error('Product name is required');
    }
    
    if (!data.category) {
      throw new Error('Product category is required');
    }
    
    if (!data.unitPrice || data.unitPrice <= 0) {
      throw new Error('Valid unit price is required');
    }
    
    if (data.stockQuantity == null || data.stockQuantity < 0) {
      throw new Error('Stock quantity must be 0 or greater');
    }
  }

  /**
   * Validate order data
   * التحقق من صحة بيانات الطلب
   * 
   * @param {Object} data - Order data
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
    
    if (!data.shippingAddress) {
      throw new Error('Shipping address is required');
    }
    
    // Validate each item
    for (const item of data.items) {
      if (!item.productId) {
        throw new Error('Product ID is required for each item');
      }
      
      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Valid quantity is required for each item');
      }
      
      if (!item.unitPrice || item.unitPrice <= 0) {
        throw new Error('Valid unit price is required for each item');
      }
    }
  }

  /**
   * Validate payment data
   * التحقق من صحة بيانات الدفع
   * 
   * @param {Object} data - Payment data
   * @throws {Error} If validation fails
   */
  validatePaymentData(data) {
    if (!data.orderId) {
      throw new Error('Order ID is required');
    }
    
    if (!data.amount || data.amount <= 0) {
      throw new Error('Valid payment amount is required');
    }
    
    if (!data.paymentMethod) {
      throw new Error('Payment method is required');
    }
  }

  /**
   * Get order by ID
   * الحصول على الطلب بواسطة المعرف
   * 
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrder(orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          buyer: true,
          seller: true,
          payments: true,
        },
      });
      
      return order;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  /**
   * Get orders for a business
   * الحصول على طلبات لشركة
   * 
   * @param {string} businessId - Business ID
   * @param {string} role - Role (buyer or seller)
   * @returns {Promise<Array>} List of orders
   */
  async getOrdersForBusiness(businessId, role = 'buyer') {
    try {
      const whereClause = role === 'buyer' 
        ? { buyerId: businessId }
        : { sellerId: businessId };
      
      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          items: true,
          buyer: true,
          seller: true,
        },
        orderBy: {
          orderDate: 'desc',
        },
      });
      
      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  /**
   * Search products
   * البحث عن المنتجات
   * 
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} List of products
   */
  async searchProducts(filters = {}) {
    try {
      const whereClause = {};
      
      if (filters.category) {
        whereClause.category = filters.category;
      }
      
      if (filters.subcategory) {
        whereClause.subcategory = filters.subcategory;
      }
      
      if (filters.sellerId) {
        whereClause.sellerId = filters.sellerId;
      }
      
      if (filters.status) {
        whereClause.status = filters.status;
      } else {
        whereClause.status = 'ACTIVE'; // Default to active products
      }
      
      if (filters.search) {
        whereClause.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { sku: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
      
      const products = await prisma.product.findMany({
        where: whereClause,
        include: {
          seller: true,
        },
        orderBy: filters.orderBy || { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      });
      
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

// Export both the class and singleton instance for flexibility
module.exports = new CommerceService();
module.exports.CommerceService = CommerceService;
