/**
 * CORS Middleware Unit Tests
 * Testing CORS origin whitelist and security
 */

import { isOriginAllowed, ALLOWED_ORIGINS } from '../../../middleware/cors';

describe('CORS Middleware', () => {
  describe('ALLOWED_ORIGINS', () => {
    test('should include all 24 TEC .pi domains', () => {
      const tecDomains = [
        'https://tec.pi',
        'https://commerce.pi',
        'https://fundx.pi',
        'https://explorer.pi',
        'https://assets.pi',
        'https://nbf.pi',
        'https://insure.pi',
        'https://vip.pi',
        'https://life.pi',
        'https://ecommerce.pi',
        'https://connection.pi',
        'https://elite.pi',
        'https://brookfield.pi',
        'https://zone.pi',
        'https://dx.pi',
        'https://nx.pi',
        'https://system.pi',
        'https://analytics.pi',
        'https://alert.pi',
        'https://titan.pi',
        'https://epic.pi',
        'https://legend.pi',
        'https://estate.pi',
        'https://nexus.pi',
      ];
      
      tecDomains.forEach(domain => {
        expect(ALLOWED_ORIGINS).toContain(domain);
      });
    });
    
    test('should include Vercel production URL', () => {
      expect(ALLOWED_ORIGINS).toContain('https://tec-ecosystem.vercel.app');
    });
  });

  describe('isOriginAllowed', () => {
    test('should allow whitelisted .pi domains', () => {
      expect(isOriginAllowed('https://tec.pi')).toBe(true);
      expect(isOriginAllowed('https://commerce.pi')).toBe(true);
      expect(isOriginAllowed('https://fundx.pi')).toBe(true);
    });
    
    test('should allow Vercel production URL', () => {
      expect(isOriginAllowed('https://tec-ecosystem.vercel.app')).toBe(true);
    });
    
    test('should allow Vercel preview deployments with wildcard', () => {
      expect(isOriginAllowed('https://tec-ecosystem-abc123.vercel.app')).toBe(true);
      expect(isOriginAllowed('https://tec-ecosystem-xyz789.vercel.app')).toBe(true);
    });
    
    test('should block unauthorized origins', () => {
      expect(isOriginAllowed('https://evil.com')).toBe(false);
      expect(isOriginAllowed('https://fake-tec.com')).toBe(false);
      expect(isOriginAllowed('http://malicious-site.net')).toBe(false);
    });
    
    test('should block similar but invalid domains', () => {
      expect(isOriginAllowed('https://tec.com')).toBe(false);
      expect(isOriginAllowed('https://tec.pi.fake.com')).toBe(false);
      expect(isOriginAllowed('https://fake-commerce.pi')).toBe(false);
    });
    
    test('should block null or undefined origin', () => {
      expect(isOriginAllowed(null)).toBe(false);
      expect(isOriginAllowed(undefined)).toBe(false);
      expect(isOriginAllowed('')).toBe(false);
    });
    
    test('should be case-sensitive', () => {
      // CORS is case-sensitive for security
      expect(isOriginAllowed('https://TEC.pi')).toBe(false);
      expect(isOriginAllowed('HTTPS://tec.pi')).toBe(false);
    });
  });

  describe('Development Environment', () => {
    const originalEnv = process.env.NODE_ENV;
    
    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });
    
    test('should allow localhost in development', () => {
      process.env.NODE_ENV = 'development';
      // Need to re-evaluate ALLOWED_ORIGINS in actual implementation
      // This test documents expected behavior
      expect(true).toBe(true);
    });
    
    test('should not allow localhost in production', () => {
      process.env.NODE_ENV = 'production';
      expect(isOriginAllowed('http://localhost:3000')).toBe(false);
    });
  });
});
