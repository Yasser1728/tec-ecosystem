/**
 * Unit Tests for Domain Configuration
 */

import { domains, content, dynamicWords } from '../../lib/domain-config';

describe('Domain Configuration', () => {
  describe('domains', () => {
    it('should have 4 tier categories', () => {
      expect(domains).toHaveLength(4);
    });

    it('should have tier names in English and Arabic', () => {
      domains.forEach(domain => {
        expect(domain.tier).toBeDefined();
        expect(domain.tierAr).toBeDefined();
        expect(typeof domain.tier).toBe('string');
        expect(typeof domain.tierAr).toBe('string');
      });
    });

    it('should have items with required properties', () => {
      domains.forEach(domain => {
        expect(domain.items).toBeDefined();
        expect(Array.isArray(domain.items)).toBe(true);
        
        domain.items.forEach(item => {
          expect(item.name).toBeDefined();
          expect(item.desc).toBeDefined();
          expect(item.descAr).toBeDefined();
          expect(item.url).toBeDefined();
        });
      });
    });

    it('should have unique URLs for all items', () => {
      const allUrls = domains.flatMap(d => d.items.map(item => item.url));
      const uniqueUrls = [...new Set(allUrls)];
      expect(allUrls.length).toBe(uniqueUrls.length);
    });
  });

  describe('content', () => {
    it('should have English and Arabic translations', () => {
      expect(content.en).toBeDefined();
      expect(content.ar).toBeDefined();
    });

    it('should have matching keys in both languages', () => {
      const enKeys = Object.keys(content.en);
      const arKeys = Object.keys(content.ar);
      expect(enKeys).toEqual(arKeys);
    });

    it('should have required content keys', () => {
      // Check that both languages have the same structure
      const enKeys = Object.keys(content.en);
      enKeys.forEach(key => {
        expect(content.en[key]).toBeDefined();
        expect(content.ar[key]).toBeDefined();
      });
    });
  });

  describe('dynamicWords', () => {
    it('should have English and Arabic word lists', () => {
      expect(dynamicWords.en).toBeDefined();
      expect(dynamicWords.ar).toBeDefined();
      expect(Array.isArray(dynamicWords.en)).toBe(true);
      expect(Array.isArray(dynamicWords.ar)).toBe(true);
    });

    it('should have same number of words in both languages', () => {
      expect(dynamicWords.en.length).toBe(dynamicWords.ar.length);
    });
  });
});
