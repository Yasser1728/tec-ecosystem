/**
 * Commerce Domain - Type Definitions
 * 
 * Complete TypeScript type definitions for the Commerce domain.
 * Defines all entities, enums, and interfaces for B2B trading operations.
 * 
 * @module domains/commerce/types
 */

// ==================== ENUMS ====================

/**
 * Business types in the B2B marketplace
 */
export enum BusinessType {
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  WHOLESALER = 'WHOLESALER',
  RETAILER = 'RETAILER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

/**
 * Business verification status
 */
export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Product categories
 */
export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  FASHION = 'FASHION',
  FOOD_BEVERAGE = 'FOOD_BEVERAGE',
  INDUSTRIAL = 'INDUSTRIAL',
  HEALTHCARE = 'HEALTHCARE',
  AUTOMOTIVE = 'AUTOMOTIVE',
  CONSTRUCTION = 'CONSTRUCTION',
  LUXURY_GOODS = 'LUXURY_GOODS',
  OTHER = 'OTHER',
}

/**
 * Order status lifecycle
 */
export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/**
 * Payment terms
 */
export enum PaymentTerms {
  NET_0 = 'NET_0', // Immediate payment
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
  ADVANCE = 'ADVANCE', // 100% advance
  PARTIAL_ADVANCE = 'PARTIAL_ADVANCE', // Partial advance
}

/**
 * Shipment status
 */
export enum ShipmentStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

/**
 * Product availability status
 */
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}

// ==================== CORE ENTITIES ====================

/**
 * Business entity for B2B operations
 */
export interface Business {
  id: string;
  name: string;
  tradeName?: string;
  type: BusinessType;
  taxId: string;
  registrationNumber: string;
  address: Address;
  contactInfo: ContactInfo;
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  rating?: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Address structure
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Contact information
 */
export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
  contactPerson?: string;
}

/**
 * Product entity
 */
export interface Product {
  id: string;
  sellerId: string;
  seller?: Business;
  name: string;
  description: string;
  category: ProductCategory;
  sku: string;
  images: string[];
  specifications: Record<string, any>;
  
  // Pricing
  unitPrice: number;
  currency: string;
  moq: number; // Minimum Order Quantity
  bulkPricing: BulkPricing[];
  
  // Inventory
  stockQuantity: number;
  status: ProductStatus;
  
  // Metadata
  tags: string[];
  weight?: number;
  dimensions?: Dimensions;
  trackAsAsset: boolean; // Whether to track as asset in Assets domain
  requiresInsurance: boolean; // Whether to recommend insurance
  
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Bulk pricing tiers
 */
export interface BulkPricing {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  discount: number; // Percentage
}

/**
 * Product dimensions
 */
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'inch';
}

/**
 * Order entity
 */
export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyer?: Business;
  sellerId: string;
  seller?: Business;
  
  // Order items
  items: OrderItem[];
  
  // Financial
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  
  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentTerms: PaymentTerms;
  
  // Shipping
  shippingAddress: Address;
  billingAddress?: Address;
  shipment?: Shipment;
  
  // Dates
  orderDate: Date;
  expectedDeliveryDate?: Date;
  deliveredAt?: Date;
  
  // Integration
  notes?: string;
  metadata?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order item
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  
  // Asset tracking
  trackAsAsset: boolean;
  assetId?: string; // Reference to asset in Assets domain
  insuranceRequired: boolean;
  insurancePolicyId?: string; // Reference to policy in Insure domain
  
  metadata?: Record<string, any>;
}

/**
 * Payment entity
 */
export interface Payment {
  id: string;
  orderId: string;
  order?: Order;
  
  amount: number;
  currency: string;
  method: string; // PI, CREDIT_CARD, BANK_TRANSFER, etc.
  
  status: PaymentStatus;
  transactionId?: string;
  
  paidAt?: Date;
  dueDate?: Date;
  
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Shipment entity
 */
export interface Shipment {
  id: string;
  orderId: string;
  order?: Order;
  
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  
  origin: Address;
  destination: Address;
  
  shippedAt?: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  
  trackingHistory: TrackingEvent[];
  
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tracking event
 */
export interface TrackingEvent {
  timestamp: Date;
  status: ShipmentStatus;
  location: string;
  description: string;
}

/**
 * Quote/RFQ entity
 */
export interface Quote {
  id: string;
  quoteNumber: string;
  buyerId: string;
  sellerId: string;
  
  items: QuoteItem[];
  
  totalAmount: number;
  currency: string;
  validUntil: Date;
  
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  
  notes?: string;
  termsAndConditions?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quote item
 */
export interface QuoteItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

/**
 * Review entity
 */
export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string; // Seller being reviewed
  
  rating: number; // 1-5
  title?: string;
  comment?: string;
  
  verified: boolean; // Verified purchase
  
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SERVICE INTERFACES ====================

/**
 * Product creation input
 */
export interface CreateProductInput {
  sellerId: string;
  name: string;
  description: string;
  category: ProductCategory;
  sku: string;
  images?: string[];
  specifications?: Record<string, any>;
  unitPrice: number;
  currency?: string;
  moq: number;
  bulkPricing?: BulkPricing[];
  stockQuantity: number;
  tags?: string[];
  weight?: number;
  dimensions?: Dimensions;
  trackAsAsset?: boolean;
  requiresInsurance?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Order creation input
 */
export interface CreateOrderInput {
  buyerId: string;
  sellerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentTerms: PaymentTerms;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
}

/**
 * Business registration input
 */
export interface RegisterBusinessInput {
  name: string;
  tradeName?: string;
  type: BusinessType;
  taxId: string;
  registrationNumber: string;
  address: Address;
  contactInfo: ContactInfo;
  documents?: string[]; // URLs to verification documents
}

// ==================== EVENT TYPES ====================

/**
 * Events published by Commerce domain
 */
export interface CommerceEvents {
  'commerce.product.created': ProductCreatedEvent;
  'commerce.product.updated': ProductUpdatedEvent;
  'commerce.order.created': OrderCreatedEvent;
  'commerce.order.confirmed': OrderConfirmedEvent;
  'commerce.order.shipped': OrderShippedEvent;
  'commerce.order.delivered': OrderDeliveredEvent;
  'commerce.payment.completed': PaymentCompletedEvent;
  'commerce.business.verified': BusinessVerifiedEvent;
}

export interface ProductCreatedEvent {
  productId: string;
  sellerId: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  trackAsAsset: boolean;
  requiresInsurance: boolean;
  timestamp: Date;
}

export interface ProductUpdatedEvent {
  productId: string;
  sellerId: string;
  changes: Partial<Product>;
  timestamp: Date;
}

export interface OrderCreatedEvent {
  orderId: string;
  orderNumber: string;
  buyerId: string;
  sellerId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    trackAsAsset: boolean;
    insuranceRequired: boolean;
  }>;
  totalAmount: number;
  currency: string;
  timestamp: Date;
}

export interface OrderConfirmedEvent {
  orderId: string;
  orderNumber: string;
  buyerId: string;
  sellerId: string;
  confirmedAt: Date;
}

export interface OrderShippedEvent {
  orderId: string;
  shipmentId: string;
  trackingNumber: string;
  carrier: string;
  shippedAt: Date;
}

export interface OrderDeliveredEvent {
  orderId: string;
  orderNumber: string;
  buyerId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    trackAsAsset: boolean;
    insuranceRequired: boolean;
  }>;
  deliveredAt: Date;
  totalValue: number;
}

export interface PaymentCompletedEvent {
  paymentId: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  method: string;
  paidAt: Date;
}

export interface BusinessVerifiedEvent {
  businessId: string;
  name: string;
  type: BusinessType;
  verifiedAt: Date;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// ==================== FILTER TYPES ====================

export interface ProductFilters {
  category?: ProductCategory;
  sellerId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  tags?: string[];
}

export interface OrderFilters {
  buyerId?: string;
  sellerId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
}
