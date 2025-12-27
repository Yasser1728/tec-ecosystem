/**
 * Unit Tests for Authentication Middleware
 */

import { authMiddleware, requireRole, validateSession } from '../../lib/auth-middleware';

// Mock next-auth/react with virtual flag
jest.mock(
  'next-auth/react',
  () => ({
    getSession: jest.fn(),
  }),
  { virtual: true }
);

// Get the mocked function
const { getSession } = require('next-auth/react');

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should return 401 for unauthenticated requests', async () => {
      // Mock getSession to return null (unauthenticated)
      getSession.mockResolvedValue(null);

      const req = {
        url: '/private/test',
        headers: {},
        connection: { remoteAddress: '127.0.0.1' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const result = await authMiddleware(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Authentication required to access this resource',
      });
    });
  });

  describe('validateSession', () => {
    it('should return false for null session', () => {
      expect(validateSession(null)).toBe(false);
    });

    it('should return false for expired session', () => {
      const expiredSession = {
        user: { email: 'test@test.com' },
        expires: new Date(Date.now() - 1000).toISOString(),
      };

      expect(validateSession(expiredSession)).toBe(false);
    });

    it('should return true for valid session', () => {
      const validSession = {
        user: { email: 'test@test.com' },
        expires: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
      };

      expect(validateSession(validSession)).toBe(true);
    });
  });

  describe('requireRole', () => {
    it('should return 403 for insufficient permissions', async () => {
      // Mock getSession to return a user with insufficient role
      getSession.mockResolvedValue({
        user: { email: 'user@test.com', role: 'user' }
      });

      const req = {
        url: '/admin/test',
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const middleware = requireRole(['admin']);
      await middleware(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Forbidden',
        message: 'Insufficient permissions to access this resource',
      });
    });

    it('should return 401 for unauthenticated requests', async () => {
      // Mock getSession to return null
      getSession.mockResolvedValue(null);

      const req = {
        url: '/admin/test',
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const middleware = requireRole(['admin']);
      await middleware(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
