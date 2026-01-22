/**
 * Payment Validation Schemas - W3SA-INPUT-001 Fix
 * 
 * Comprehensive input validation for payment operations
 * Security Level: HIGH
 * 
 * @see W3SA_REMEDIATION_PLAN.md - Phase 1
 */

import { z } from 'zod';

/**
 * Create Payment Schema
 * Validates payment creation requests
 */
export const CreatePaymentSchema = z.object({
  amount: z.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  })
    .positive('Amount must be positive')
    .max(1000000, 'Amount exceeds maximum limit of 1,000,000 PI')
    .finite('Amount must be a finite number'),
  
  memo: z.string()
    .max(500, 'Memo exceeds 500 characters')
    .optional(),
  
  domain: z.string({
    required_error: 'Domain is required',
  })
    .regex(/^[a-z]+$/, 'Domain must contain only lowercase letters')
    .min(2, 'Domain name too short')
    .max(20, 'Domain name too long'),
  
  userId: z.string({
    required_error: 'User ID is required',
  })
    .min(1, 'User ID cannot be empty'),
  
  category: z.enum([
    'general',
    'domain',
    'nft',
    'subscription',
    'ecommerce'
  ], {
    errorMap: () => ({ message: 'Invalid payment category' })
  }),
  
  metadata: z.record(z.any())
    .optional(),
});

/**
 * Approve Payment Schema
 * Validates payment approval requests
 */
export const ApprovePaymentSchema = z.object({
  paymentId: z.string({
    required_error: 'Payment ID is required',
  })
    .min(1, 'Payment ID cannot be empty'),
  
  internalId: z.string()
    .optional(),
  
  amount: z.number()
    .positive('Amount must be positive')
    .optional(),
  
  domain: z.string()
    .regex(/^[a-z]+$/, 'Domain must contain only lowercase letters')
    .optional(),
});

/**
 * Complete Payment Schema
 * Validates payment completion requests
 */
export const CompletePaymentSchema = z.object({
  paymentId: z.string({
    required_error: 'Payment ID is required',
  })
    .min(1, 'Payment ID cannot be empty'),
  
  txid: z.string()
    .optional(),
});

/**
 * Cancel Payment Schema
 * Validates payment cancellation requests
 */
export const CancelPaymentSchema = z.object({
  paymentId: z.string({
    required_error: 'Payment ID is required',
  })
    .min(1, 'Payment ID cannot be empty'),
  
  reason: z.string()
    .max(500, 'Reason exceeds 500 characters')
    .optional(),
});

/**
 * Payment History Query Schema
 * Validates payment history query parameters
 */
export const PaymentHistoryQuerySchema = z.object({
  limit: z.coerce.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
  
  offset: z.coerce.number()
    .int('Offset must be an integer')
    .min(0, 'Offset cannot be negative')
    .default(0),
  
  status: z.enum(['pending', 'approved', 'completed', 'cancelled'])
    .optional(),
  
  domain: z.string()
    .regex(/^[a-z]+$/)
    .optional(),
});

/**
 * Transfer Schema
 * Validates transfer operations
 */
export const TransferSchema = z.object({
  fromUserId: z.string({
    required_error: 'From user ID is required',
  })
    .min(1, 'From user ID cannot be empty'),
  
  toUserId: z.string({
    required_error: 'To user ID is required',
  })
    .min(1, 'To user ID cannot be empty'),
  
  amount: z.number({
    required_error: 'Amount is required',
  })
    .positive('Amount must be positive')
    .max(1000000, 'Amount exceeds maximum limit')
    .finite('Amount must be a finite number'),
  
  memo: z.string()
    .max(500, 'Memo exceeds 500 characters')
    .optional(),
  
  type: z.enum(['internal', 'external'])
    .default('internal'),
});

export default {
  CreatePaymentSchema,
  ApprovePaymentSchema,
  CompletePaymentSchema,
  CancelPaymentSchema,
  PaymentHistoryQuerySchema,
  TransferSchema,
};
