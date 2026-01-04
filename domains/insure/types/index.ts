/**
 * TypeScript Type Definitions for Insure Domain
 * 
 * @module domains/insure/types
 */

// ==================== Enums ====================

export enum PolicyType {
  LIFE = 'LIFE',
  HEALTH = 'HEALTH',
  PROPERTY = 'PROPERTY',
  AUTO = 'AUTO',
  TRAVEL = 'TRAVEL',
  TRANSACTION = 'TRANSACTION',
  ASSET = 'ASSET',
}

export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  LAPSED = 'LAPSED',
}

export enum PremiumFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  ANNUAL = 'ANNUAL',
}

export enum ClaimStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
  CLOSED = 'CLOSED',
}

export enum PremiumPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  WAIVED = 'WAIVED',
}

// ==================== Core Interfaces ====================

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  userId: string;
  assetId?: string | null;
  
  // Policy details
  policyType: PolicyType;
  productName: string;
  coverageAmount: number;
  premium: number;
  premiumFrequency: PremiumFrequency;
  deductible: number;
  
  // Policy period
  startDate: Date;
  endDate: Date;
  term: number;
  
  // Status
  status: PolicyStatus;
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  userId: string;
  
  // Claim details
  claimAmount: number;
  approvedAmount?: number | null;
  incidentDate: Date;
  incidentType: string;
  description: string;
  
  // Documents
  documents?: any;
  
  // Processing
  status: ClaimStatus;
  reviewNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  
  // Payout
  paidAmount?: number | null;
  paidAt?: Date | null;
  paymentReference?: string | null;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface PremiumPayment {
  id: string;
  policyId: string;
  
  // Payment details
  amount: number;
  dueDate: Date;
  paidDate?: Date | null;
  status: PremiumPaymentStatus;
  
  // Payment method
  paymentMethod?: string | null;
  transactionId?: string | null;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Input Types ====================

export interface CreatePolicyInput {
  userId: string;
  assetId?: string;
  policyType: PolicyType;
  productName: string;
  coverageAmount: number;
  premium: number;
  premiumFrequency?: PremiumFrequency;
  deductible?: number;
  startDate: Date;
  term: number;
  metadata?: Record<string, any>;
}

export interface UpdatePolicyInput {
  coverageAmount?: number;
  premium?: number;
  premiumFrequency?: PremiumFrequency;
  status?: PolicyStatus;
  metadata?: Record<string, any>;
}

export interface CreateClaimInput {
  policyId: string;
  userId: string;
  claimAmount: number;
  incidentDate: Date;
  incidentType: string;
  description: string;
  documents?: any;
}

export interface ReviewClaimInput {
  status: ClaimStatus;
  approvedAmount?: number;
  reviewNotes?: string;
  reviewedBy: string;
}

export interface ProcessClaimPayoutInput {
  claimId: string;
  paidAmount: number;
  paymentReference: string;
}

// ==================== Event Types ====================

export interface PolicyCreatedEvent {
  policyId: string;
  policyNumber: string;
  userId: string;
  assetId?: string;
  policyType: PolicyType;
  coverageAmount: number;
  premium: number;
  startDate: Date;
  endDate: Date;
  timestamp: Date;
}

export interface ClaimSubmittedEvent {
  claimId: string;
  claimNumber: string;
  policyId: string;
  userId: string;
  claimAmount: number;
  incidentDate: Date;
  incidentType: string;
  timestamp: Date;
}

export interface ClaimApprovedEvent {
  claimId: string;
  claimNumber: string;
  policyId: string;
  userId: string;
  assetId?: string;
  approvedAmount: number;
  timestamp: Date;
}

export interface ClaimRejectedEvent {
  claimId: string;
  claimNumber: string;
  policyId: string;
  userId: string;
  assetId?: string;
  rejectionReason: string;
  timestamp: Date;
}

export interface ClaimPaidEvent {
  claimId: string;
  claimNumber: string;
  policyId: string;
  userId: string;
  paidAmount: number;
  paymentReference: string;
  timestamp: Date;
}

export interface InsuranceRecommendationEvent {
  userId: string;
  assetId: string;
  assetType: string;
  assetValue: number;
  recommendedPolicyType: PolicyType;
  estimatedPremium: number;
  coverageAmount: number;
  timestamp: Date;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Filter Types ====================

export interface PolicyFilters {
  userId?: string;
  policyType?: PolicyType;
  status?: PolicyStatus;
  assetId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
}

export interface ClaimFilters {
  userId?: string;
  policyId?: string;
  status?: ClaimStatus;
  incidentDateFrom?: Date;
  incidentDateTo?: Date;
}

// ==================== Premium Calculation Types ====================

export interface PremiumCalculationInput {
  policyType: PolicyType;
  coverageAmount: number;
  term: number;
  assetValue?: number;
  userAge?: number;
  riskFactors?: Record<string, any>;
}

export interface PremiumCalculationResult {
  basePremium: number;
  adjustedPremium: number;
  finalPremium: number;
  riskScore: number;
  factors: {
    coverageMultiplier: number;
    termMultiplier: number;
    riskMultiplier: number;
    discounts: number;
  };
}

// ==================== Risk Assessment Types ====================

export interface RiskAssessment {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: {
    assetType?: string;
    assetAge?: number;
    location?: string;
    userHistory?: string;
  };
  recommendations: string[];
}
