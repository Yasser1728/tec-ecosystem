/**
 * NFT Validation Schemas - W3SA-INPUT-001 Fix
 * 
 * Input validation for NFT minting operations
 * Security Level: HIGH
 * 
 * @see W3SA_REMEDIATION_PLAN.md - Phase 1
 */

import { z } from 'zod';

/**
 * Mint NFT Schema
 * Validates NFT minting requests
 */
export const MintNFTSchema = z.object({
  domainName: z.string({
    required_error: 'Domain name is required',
  })
    .regex(/^[a-z0-9-]+$/, 'Invalid domain name format - only lowercase letters, numbers, and hyphens allowed')
    .min(2, 'Domain name too short')
    .max(50, 'Domain name too long'),
  
  certificateType: z.enum(['ownership', 'access', 'premium'], {
    errorMap: () => ({ message: 'Invalid certificate type' })
  }),
  
  userId: z.string({
    required_error: 'User ID is required',
  })
    .min(1, 'User ID cannot be empty'),
  
  metadata: z.object({
    tier: z.enum(['STANDARD', 'PREMIUM', 'VIP']).optional(),
    expiresAt: z.string().datetime().optional(),
    attributes: z.record(z.any()).optional(),
  }).optional(),
});

/**
 * Transfer NFT Schema
 * Validates NFT transfer requests
 */
export const TransferNFTSchema = z.object({
  tokenId: z.string({
    required_error: 'Token ID is required',
  })
    .min(1, 'Token ID cannot be empty'),
  
  fromUserId: z.string({
    required_error: 'From user ID is required',
  })
    .min(1, 'From user ID cannot be empty'),
  
  toUserId: z.string({
    required_error: 'To user ID is required',
  })
    .min(1, 'To user ID cannot be empty'),
  
  memo: z.string()
    .max(200, 'Memo exceeds 200 characters')
    .optional(),
});

/**
 * Burn NFT Schema
 * Validates NFT burning requests
 */
export const BurnNFTSchema = z.object({
  tokenId: z.string({
    required_error: 'Token ID is required',
  })
    .min(1, 'Token ID cannot be empty'),
  
  userId: z.string({
    required_error: 'User ID is required',
  })
    .min(1, 'User ID cannot be empty'),
  
  reason: z.string()
    .max(500, 'Reason exceeds 500 characters')
    .optional(),
});

export default {
  MintNFTSchema,
  TransferNFTSchema,
  BurnNFTSchema,
};
