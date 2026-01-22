/**
 * Validation Schemas Unit Tests
 * Testing Zod validation schemas for security compliance
 */

import { z } from 'zod';
import {
  CreatePaymentSchema,
  ApprovePaymentSchema,
  CompletePaymentSchema,
  CancelPaymentSchema,
  PaymentHistoryQuerySchema,
  TransferSchema,
} from '../../../lib/validations/payment';

describe('Payment Validation Schemas', () => {
  describe('CreatePaymentSchema', () => {
    test('should accept valid payment data', () => {
      const valid = {
        amount: 100,
        memo: 'Test payment',
        domain: 'commerce',
        userId: 'user123',
        category: 'general',
      };
      
      expect(() => CreatePaymentSchema.parse(valid)).not.toThrow();
    });
    
    test('should reject negative amount', () => {
      const invalid = {
        amount: -100,
        domain: 'commerce',
        userId: 'user123',
        category: 'general',
      };
      
      expect(() => CreatePaymentSchema.parse(invalid)).toThrow('Amount must be positive');
    });
    
    test('should reject amount exceeding maximum limit', () => {
      const invalid = {
        amount: 2000000,
        domain: 'commerce',
        userId: 'user123',
        category: 'general',
      };
      
      expect(() => CreatePaymentSchema.parse(invalid)).toThrow('Amount exceeds maximum limit');
    });
    
    test('should reject invalid domain format', () => {
      const invalid = {
        amount: 100,
        domain: 'Commerce123',  // uppercase and numbers
        userId: 'user123',
        category: 'general',
      };
      
      expect(() => CreatePaymentSchema.parse(invalid)).toThrow('Domain must contain only lowercase');
    });
    
    test('should reject memo exceeding 500 characters', () => {
      const invalid = {
        amount: 100,
        domain: 'commerce',
        userId: 'user123',
        category: 'general',
        memo: 'a'.repeat(501),
      };
      
      expect(() => CreatePaymentSchema.parse(invalid)).toThrow('Memo exceeds 500 characters');
    });
    
    test('should reject invalid category', () => {
      const invalid = {
        amount: 100,
        domain: 'commerce',
        userId: 'user123',
        category: 'invalid_category',
      };
      
      expect(() => CreatePaymentSchema.parse(invalid)).toThrow();
    });
  });

  describe('ApprovePaymentSchema', () => {
    test('should accept valid approval data', () => {
      const valid = {
        paymentId: 'payment123',
      };
      
      expect(() => ApprovePaymentSchema.parse(valid)).not.toThrow();
    });
    
    test('should reject empty payment ID', () => {
      const invalid = {
        paymentId: '',
      };
      
      expect(() => ApprovePaymentSchema.parse(invalid)).toThrow('Payment ID cannot be empty');
    });
  });

  describe('TransferSchema', () => {
    test('should accept valid transfer data', () => {
      const valid = {
        fromUserId: 'user1',
        toUserId: 'user2',
        amount: 500,
        type: 'internal',
      };
      
      expect(() => TransferSchema.parse(valid)).not.toThrow();
    });
    
    test('should reject negative transfer amount', () => {
      const invalid = {
        fromUserId: 'user1',
        toUserId: 'user2',
        amount: -100,
      };
      
      expect(() => TransferSchema.parse(invalid)).toThrow('Amount must be positive');
    });
    
    test('should use default type when not provided', () => {
      const data = {
        fromUserId: 'user1',
        toUserId: 'user2',
        amount: 500,
      };
      
      const result = TransferSchema.parse(data);
      expect(result.type).toBe('internal');
    });
  });

  describe('PaymentHistoryQuerySchema', () => {
    test('should accept valid query parameters', () => {
      const valid = {
        limit: '10',
        offset: '0',
        status: 'completed',
        domain: 'commerce',
      };
      
      const result = PaymentHistoryQuerySchema.parse(valid);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });
    
    test('should reject limit exceeding maximum', () => {
      const invalid = {
        limit: '150',
      };
      
      expect(() => PaymentHistoryQuerySchema.parse(invalid)).toThrow('Limit cannot exceed 100');
    });
    
    test('should reject negative offset', () => {
      const invalid = {
        offset: '-5',
      };
      
      expect(() => PaymentHistoryQuerySchema.parse(invalid)).toThrow('Offset cannot be negative');
    });
    
    test('should use default values when not provided', () => {
      const result = PaymentHistoryQuerySchema.parse({});
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });
  });
});
