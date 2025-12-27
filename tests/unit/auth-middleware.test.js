/**
 * Unit Tests for Authentication Middleware
 */

import { authMiddleware, requireRole, validateSession } from '../../lib/auth-middleware';

describe('Auth Middleware', () => {
  describe('authMiddleware', () => {
    it('should return 401 for unauthenticated requests', async () => {
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
    it('should return 401 for unauthenticated requests', async () => {
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
