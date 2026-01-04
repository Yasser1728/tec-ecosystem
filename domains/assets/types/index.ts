/**
 * TypeScript Type Definitions for Assets Domain
 * 
 * This file provides comprehensive type definitions for all entities
 * and operations within the Assets domain.
 * 
 * @module domains/assets/types
 */

// =====================================================
// CORE ENTITY TYPES
// =====================================================

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isDefault: boolean;
  currency: string;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  assets?: Asset[];
  valuations?: Valuation[];
}

export interface Asset {
  id: string;
  portfolioId: string;
  assetTypeId: string;
  categoryId?: string;
  
  // Basic Info
  name: string;
  symbol?: string;
  description?: string;
  
  // Quantity & Pricing
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  unrealizedGainLoss: number;
  
  // Status
  status: AssetStatus;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  portfolio?: Portfolio;
  assetType?: AssetType;
  category?: Category;
  transactions?: Transaction[];
  valuations?: Valuation[];
  documents?: Document[];
}

export interface AssetType {
  id: string;
  name: string;
  displayName: string;
  icon?: string;
  color?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  assets?: Asset[];
}

export interface Category {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  assets?: Asset[];
}

export interface Transaction {
  id: string;
  assetId: string;
  
  // Transaction Details
  type: TransactionType;
  quantity: number;
  price: number;
  totalAmount: number;
  fee: number;
  date: Date;
  description?: string;
  
  // Integration
  relatedDomain?: string;
  relatedTransactionId?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  
  // Relations
  asset?: Asset;
}

export interface Valuation {
  id: string;
  assetId?: string;
  portfolioId?: string;
  
  // Valuation Details
  price: number;
  totalValue: number;
  source: ValuationSource;
  valuationDate: Date;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  
  // Relations
  asset?: Asset;
  portfolio?: Portfolio;
}

export interface Document {
  id: string;
  assetId: string;
  
  // Document Details
  type: DocumentType;
  name: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  uploadedAt: Date;
  
  // Relations
  asset?: Asset;
}

export interface PriceFeed {
  id: string;
  symbol: string;
  assetType: string;
  source: string;
  lastPrice: number;
  lastUpdate: Date;
  
  // API Details
  apiEndpoint?: string;
  apiConfig?: Record<string, any>;
  
  // Status
  isActive: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetAlert {
  id: string;
  userId: string;
  assetId?: string;
  portfolioId?: string;
  
  // Alert Configuration
  type: AlertType;
  condition: Record<string, any>;
  isActive: boolean;
  
  // Notification
  lastTriggered?: Date;
  triggerCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// ENUMS AND CONSTANTS
// =====================================================

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  TRANSFERRED = 'TRANSFERRED',
  ARCHIVED = 'ARCHIVED',
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  TRANSFER = 'TRANSFER',
  DIVIDEND = 'DIVIDEND',
  SPLIT = 'SPLIT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum ValuationSource {
  API = 'API',
  MANUAL = 'MANUAL',
  CALCULATED = 'CALCULATED',
}

export enum DocumentType {
  RECEIPT = 'RECEIPT',
  CERTIFICATE = 'CERTIFICATE',
  LEGAL = 'LEGAL',
  TAX = 'TAX',
  CONTRACT = 'CONTRACT',
  APPRAISAL = 'APPRAISAL',
}

export enum AlertType {
  PRICE_ABOVE = 'PRICE_ABOVE',
  PRICE_BELOW = 'PRICE_BELOW',
  VALUE_CHANGE = 'VALUE_CHANGE',
  REBALANCE_NEEDED = 'REBALANCE_NEEDED',
}

// =====================================================
// SERVICE INPUT/OUTPUT TYPES
// =====================================================

export interface CreateAssetInput {
  portfolioId: string;
  assetTypeId: string;
  categoryId?: string;
  name: string;
  symbol?: string;
  description?: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice?: number;
  fee?: number;
  metadata?: Record<string, any>;
  relatedDomain?: string;
  relatedTransactionId?: string;
}

export interface UpdateAssetInput {
  name?: string;
  symbol?: string;
  description?: string;
  quantity?: number;
  currentPrice?: number;
  categoryId?: string;
  status?: AssetStatus;
  metadata?: Record<string, any>;
}

export interface AssetFilters {
  portfolioId?: string;
  assetTypeId?: string;
  categoryId?: string;
  status?: AssetStatus;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface CreateTransactionInput {
  assetId: string;
  type: TransactionType;
  quantity: number;
  price: number;
  totalAmount?: number;
  fee?: number;
  date?: Date;
  description?: string;
  relatedDomain?: string;
  relatedTransactionId?: string;
  metadata?: Record<string, any>;
}

export interface CreateValuationInput {
  assetId?: string;
  portfolioId?: string;
  price: number;
  totalValue: number;
  source?: ValuationSource;
  valuationDate?: Date;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  assetId: string;
  assetName: string;
  totalInvested: number;
  currentValue: number;
  absoluteGain: number;
  percentageGain: number;
  holdingDays: number;
  annualizedReturn: number;
  transactionCount: number;
}

export interface PortfolioAnalytics {
  portfolioId: string;
  name: string;
  summary: {
    totalValue: number;
    totalInvested: number;
    totalGainLoss: number;
    percentageReturn: number;
    assetCount: number;
  };
  assetAllocation: Array<{
    assetType: string;
    value: number;
    percentage: number;
    count: number;
  }>;
  topPerformers: Array<{
    assetId: string;
    name: string;
    value: number;
    gainLoss: number;
    percentageGain: number;
  }>;
  performanceHistory: Array<{
    date: string;
    value: number;
  }>;
}

// =====================================================
// EVENT TYPES
// =====================================================

export interface AssetCreatedEvent {
  assetId: string;
  portfolioId: string;
  userId: string;
  assetType: string;
  name: string;
  value: number;
  sourceDomain?: string;
  timestamp: Date;
}

export interface AssetUpdatedEvent {
  assetId: string;
  portfolioId: string;
  userId: string;
  changes: Record<string, any>;
  oldValue: number;
  newValue: number;
  timestamp: Date;
}

export interface TransactionCreatedEvent {
  transactionId: string;
  assetId: string;
  portfolioId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  timestamp: Date;
}

export interface PortfolioValueUpdatedEvent {
  portfolioId: string;
  userId: string;
  oldValue: number;
  newValue: number;
  change: number;
  changePercentage: number;
  timestamp: Date;
}

// =====================================================
// INTEGRATION EVENT TYPES
// =====================================================

export interface FundXInvestmentEvent {
  investmentId: string;
  portfolioId: string;
  userId: string;
  strategyName: string;
  symbol?: string;
  amount: number;
  shares?: number;
  pricePerUnit: number;
  date: Date;
  strategy: string;
  riskLevel: string;
}

export interface EstatePropertyEvent {
  propertyId: string;
  portfolioId: string;
  userId: string;
  propertyName: string;
  price: number;
  purchaseDate: Date;
  description?: string;
  address: string;
  propertyType: string;
  sqm: number;
  transactionId: string;
}

export interface CommerceProductEvent {
  productId: string;
  portfolioId: string;
  userId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  purchaseDate: Date;
  trackAsAsset: boolean;
  assetType?: string;
  orderId: string;
  category: string;
}

export interface InsurancePolicyEvent {
  policyId: string;
  portfolioId: string;
  userId: string;
  policyType: string;
  provider: string;
  coverage: number;
  premium: number;
  startDate: Date;
  endDate: Date;
  assetId?: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
