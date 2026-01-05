/**
 * Unit Tests for TEC Service
 * 
 * @module tests/unit/tecService.test
 */

const TecService = require('../../services/tecService');

describe('TecService', () => {
  let tecService;

  beforeEach(() => {
    tecService = new TecService();
  });

  describe('getDashboardData', () => {
    it('should return dashboard data for a user', async () => {
      const userId = 'test-user-123';
      const data = await tecService.getDashboardData(userId);

      expect(data).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe(userId);
      expect(data.stats).toBeDefined();
      expect(data.recentActivity).toBeInstanceOf(Array);
      expect(data.quickActions).toBeInstanceOf(Array);
    });
  });

  describe('getAllDomains', () => {
    it('should return list of domains', async () => {
      const domains = await tecService.getAllDomains();

      expect(domains).toBeInstanceOf(Array);
      expect(domains.length).toBeGreaterThan(0);
      expect(domains[0]).toHaveProperty('id');
      expect(domains[0]).toHaveProperty('name');
      expect(domains[0]).toHaveProperty('category');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const credentials = {
        username: 'testuser',
        password: 'testpass',
      };

      const result = await tecService.authenticateUser(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should throw error for missing credentials', async () => {
      const credentials = { username: 'testuser' };

      await expect(tecService.authenticateUser(credentials)).rejects.toThrow();
    });
  });

  describe('getEcosystemHealth', () => {
    it('should return ecosystem health status', async () => {
      const health = await tecService.getEcosystemHealth();

      expect(health).toBeDefined();
      expect(health.status).toBeDefined();
      expect(health.services).toBeDefined();
    });
  });
});
