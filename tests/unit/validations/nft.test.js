/**
 * NFT Validation Schemas Unit Tests
 */

import {
  MintNFTSchema,
  TransferNFTSchema,
  BurnNFTSchema,
} from '../../../lib/validations/nft';

describe('NFT Validation Schemas', () => {
  describe('MintNFTSchema', () => {
    test('should accept valid NFT minting data', () => {
      const valid = {
        domainName: 'my-domain',
        certificateType: 'ownership',
        userId: 'user123',
      };
      
      expect(() => MintNFTSchema.parse(valid)).not.toThrow();
    });
    
    test('should reject invalid domain name format', () => {
      const invalid = {
        domainName: 'My Domain!',  // uppercase and special chars
        certificateType: 'ownership',
        userId: 'user123',
      };
      
      expect(() => MintNFTSchema.parse(invalid)).toThrow('Invalid domain name format');
    });
    
    test('should reject domain name too short', () => {
      const invalid = {
        domainName: 'a',
        certificateType: 'ownership',
        userId: 'user123',
      };
      
      expect(() => MintNFTSchema.parse(invalid)).toThrow('Domain name too short');
    });
    
    test('should reject domain name too long', () => {
      const invalid = {
        domainName: 'a'.repeat(51),
        certificateType: 'ownership',
        userId: 'user123',
      };
      
      expect(() => MintNFTSchema.parse(invalid)).toThrow('Domain name too long');
    });
    
    test('should reject invalid certificate type', () => {
      const invalid = {
        domainName: 'my-domain',
        certificateType: 'invalid',
        userId: 'user123',
      };
      
      expect(() => MintNFTSchema.parse(invalid)).toThrow();
    });
  });

  describe('TransferNFTSchema', () => {
    test('should accept valid NFT transfer data', () => {
      const valid = {
        tokenId: 'TEC-DOMAIN-123abc',
        fromUserId: 'user1',
        toUserId: 'user2',
      };
      
      expect(() => TransferNFTSchema.parse(valid)).not.toThrow();
    });
    
    test('should reject empty token ID', () => {
      const invalid = {
        tokenId: '',
        fromUserId: 'user1',
        toUserId: 'user2',
      };
      
      expect(() => TransferNFTSchema.parse(invalid)).toThrow('Token ID cannot be empty');
    });
    
    test('should reject memo exceeding 200 characters', () => {
      const invalid = {
        tokenId: 'TEC-DOMAIN-123abc',
        fromUserId: 'user1',
        toUserId: 'user2',
        memo: 'a'.repeat(201),
      };
      
      expect(() => TransferNFTSchema.parse(invalid)).toThrow('Memo exceeds 200 characters');
    });
  });

  describe('BurnNFTSchema', () => {
    test('should accept valid NFT burn data', () => {
      const valid = {
        tokenId: 'TEC-DOMAIN-123abc',
        userId: 'user123',
      };
      
      expect(() => BurnNFTSchema.parse(valid)).not.toThrow();
    });
    
    test('should accept burn with reason', () => {
      const valid = {
        tokenId: 'TEC-DOMAIN-123abc',
        userId: 'user123',
        reason: 'Domain expired',
      };
      
      expect(() => BurnNFTSchema.parse(valid)).not.toThrow();
    });
    
    test('should reject reason exceeding 500 characters', () => {
      const invalid = {
        tokenId: 'TEC-DOMAIN-123abc',
        userId: 'user123',
        reason: 'a'.repeat(501),
      };
      
      expect(() => BurnNFTSchema.parse(invalid)).toThrow();
    });
  });
});
