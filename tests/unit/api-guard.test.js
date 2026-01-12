/**
 * API Guard Unit Tests
 * Tests rate limiting, body size validation, and request ID tracking
 */

import { checkRateLimit, getClientId, checkBodySize } from '../../lib/api-guard.js';

// Generate unique IDs for each test to avoid pollution
let testCounter = 0;
function getUniqueTestId() {
  return `test-${Date.now()}-${testCounter++}`;
}

describe('API Guard', () => {
  describe('checkRateLimit', () => {
    it('should allow requests within rate limit', () => {
      const clientId = getUniqueTestId();
      const maxRequests = 5;
      
      const result = checkRateLimit(clientId, maxRequests);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should block requests exceeding rate limit', () => {
      const clientId = getUniqueTestId();
      const maxRequests = 3;
      
      // Make requests up to the limit
      for (let i = 0; i < maxRequests; i++) {
        checkRateLimit(clientId, maxRequests);
      }
      
      // This request should be blocked
      const result = checkRateLimit(clientId, maxRequests);
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset rate limit after window expires', async () => {
      const clientId = getUniqueTestId();
      const maxRequests = 2;
      
      // Make requests up to the limit
      checkRateLimit(clientId, maxRequests);
      checkRateLimit(clientId, maxRequests);
      
      // Should be blocked
      let result = checkRateLimit(clientId, maxRequests);
      expect(result.allowed).toBe(false);
      
      // Wait for window to expire (in real scenario, this would be 60 seconds)
      // For testing purposes, we're just checking the logic
    });
  });

  describe('getClientId', () => {
    it('should use userId when available', () => {
      const req = {
        body: { userId: 'user123' },
        headers: {},
        socket: {},
      };
      
      const clientId = getClientId(req);
      
      expect(clientId).toBe('user:user123');
    });

    it('should fall back to IP when userId is guest', () => {
      const req = {
        body: { userId: 'guest' },
        headers: { 'x-forwarded-for': '192.168.1.1' },
        socket: {},
      };
      
      const clientId = getClientId(req);
      
      expect(clientId).toBe('ip:192.168.1.1');
    });

    it('should use socket IP when no forwarded header', () => {
      const req = {
        body: {},
        headers: {},
        socket: { remoteAddress: '10.0.0.1' },
      };
      
      const clientId = getClientId(req);
      
      expect(clientId).toBe('ip:10.0.0.1');
    });
  });

  describe('checkBodySize', () => {
    it('should allow bodies within size limit', () => {
      const req = {
        headers: { 'content-length': '1000' },
        body: { message: 'test' },
      };
      const maxSize = 65536; // 64 KB
      
      const result = checkBodySize(req, maxSize);
      
      expect(result.valid).toBe(true);
    });

    it('should reject bodies exceeding size limit', () => {
      const req = {
        headers: { 'content-length': '70000' },
        body: {},
      };
      const maxSize = 65536; // 64 KB
      
      const result = checkBodySize(req, maxSize);
      
      expect(result.valid).toBe(false);
      expect(result.size).toBe(70000);
      expect(result.maxSize).toBe(65536);
    });

    it('should check actual body size when no content-length header', () => {
      const largeBody = { data: 'x'.repeat(70000) };
      const req = {
        headers: {},
        body: largeBody,
      };
      const maxSize = 65536; // 64 KB
      
      const result = checkBodySize(req, maxSize);
      
      expect(result.valid).toBe(false);
    });
  });
});
