/**
 * API Response Types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface User {
  id: string;
  walletAddress?: string;
  membershipTier: 'FREE' | 'PREMIUM' | 'VIP';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRequest {
  amount: number;
  memo: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResponse {
  identifier: string;
  status: 'pending' | 'completed' | 'cancelled' | 'error';
  txid?: string;
}
