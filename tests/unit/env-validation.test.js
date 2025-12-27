/**
 * Unit Tests for Environment Validation
 */

import { getEnvVar, isProduction, isDevelopment, validateNoSecretsExposed } from '../../lib/env-validation';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getEnvVar', () => {
    it('should return environment variable value when set', () => {
      process.env.TEST_VAR = 'test_value';
      expect(getEnvVar('TEST_VAR')).toBe('test_value');
    });

    it('should return fallback when environment variable is not set', () => {
      delete process.env.NONEXISTENT_VAR;
      expect(getEnvVar('NONEXISTENT_VAR', 'default')).toBe('default');
    });

    it('should return empty string as default fallback', () => {
      delete process.env.NONEXISTENT_VAR;
      expect(getEnvVar('NONEXISTENT_VAR')).toBe('');
    });
  });

  describe('isProduction', () => {
    it('should return true when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      expect(isProduction()).toBe(true);
    });

    it('should return false when NODE_ENV is not production', () => {
      process.env.NODE_ENV = 'development';
      expect(isProduction()).toBe(false);
    });
  });

  describe('isDevelopment', () => {
    it('should return true when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(isDevelopment()).toBe(true);
    });

    it('should return false when NODE_ENV is not development', () => {
      process.env.NODE_ENV = 'production';
      expect(isDevelopment()).toBe(false);
    });
  });

  describe('validateNoSecretsExposed', () => {
    it('should log warning for sensitive environment variables', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      validateNoSecretsExposed({
        API_KEY: 'sensitive',
        SECRET_TOKEN: 'secret'
      });
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should not log warning for safe environment variables', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      validateNoSecretsExposed({
        APP_NAME: 'My App',
        VERSION: '1.0.0'
      });
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
