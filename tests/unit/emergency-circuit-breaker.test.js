/**
 * Tests for Emergency Circuit Breaker and Dual Forensic Check
 */

import {
  SYSTEM_INTEGRITY_LEVEL,
  emergencyCircuitBreaker,
  checkSystemIntegrity,
  updateSystemIntegrity,
  dualForensicCheck,
  toggleCircuitBreaker,
  getSystemLiquidityStream,
} from '../../lib/forensic-utils';

// Mock Prisma client
jest.mock('../../lib/db/prisma', () => ({
  prisma: {
    systemControl: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      count: jest.fn(),
      create: jest.fn(),
    },
    transfer: {
      create: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import { prisma } from '../../lib/db/prisma';

describe('System Integrity Levels', () => {
  it('should have all required integrity levels', () => {
    expect(SYSTEM_INTEGRITY_LEVEL.NORMAL).toBe('NORMAL');
    expect(SYSTEM_INTEGRITY_LEVEL.WARNING).toBe('WARNING');
    expect(SYSTEM_INTEGRITY_LEVEL.CRITICAL).toBe('CRITICAL');
    expect(SYSTEM_INTEGRITY_LEVEL.LOCKED).toBe('LOCKED');
  });
});

describe('Emergency Circuit Breaker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow operations when circuit breaker is inactive', async () => {
    prisma.systemControl.findFirst.mockResolvedValue({
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.NORMAL,
      circuitBreakerActive: false,
    });

    const result = await emergencyCircuitBreaker();

    expect(result.blocked).toBe(false);
    expect(result.integrityLevel).toBe(SYSTEM_INTEGRITY_LEVEL.NORMAL);
  });

  it('should block operations when circuit breaker is active', async () => {
    prisma.systemControl.findFirst.mockResolvedValue({
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.LOCKED,
      circuitBreakerActive: true,
      lockReason: 'Manual activation for testing',
    });

    const result = await emergencyCircuitBreaker();

    expect(result.blocked).toBe(true);
    expect(result.status).toBe(403);
    expect(result.message).toBe('System Lock: Integrity Breach Detected');
    expect(result.integrityLevel).toBe(SYSTEM_INTEGRITY_LEVEL.LOCKED);
  });

  it('should block when system is in LOCKED state', async () => {
    prisma.systemControl.findFirst.mockResolvedValue({
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.LOCKED,
      circuitBreakerActive: false,
      lockReason: 'System integrity compromised',
    });

    const result = await emergencyCircuitBreaker();

    expect(result.blocked).toBe(true);
    expect(result.status).toBe(403);
  });

  it('should handle database errors and default to blocking with critical state', async () => {
    // When checkSystemIntegrity fails, it returns a fail-safe object with CRITICAL state
    // This causes emergencyCircuitBreaker to block with 403
    prisma.systemControl.findFirst.mockRejectedValue(new Error('Database error'));

    const result = await emergencyCircuitBreaker();

    expect(result.blocked).toBe(true);
    expect(result.status).toBe(403);
    expect(result.message).toBe('System Lock: Integrity Breach Detected');
    expect(result.details).toContain('System integrity check failed');
  });
});

describe('Check System Integrity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return existing system control', async () => {
    const mockSystemControl = {
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.NORMAL,
      circuitBreakerActive: false,
    };

    prisma.systemControl.findFirst.mockResolvedValue(mockSystemControl);

    const result = await checkSystemIntegrity();

    expect(result).toEqual(mockSystemControl);
    expect(prisma.systemControl.findFirst).toHaveBeenCalled();
  });

  it('should create system control if not exists', async () => {
    const mockNewSystemControl = {
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.NORMAL,
      circuitBreakerActive: false,
    };

    prisma.systemControl.findFirst.mockResolvedValue(null);
    prisma.systemControl.create.mockResolvedValue(mockNewSystemControl);

    const result = await checkSystemIntegrity();

    expect(result).toEqual(mockNewSystemControl);
    expect(prisma.systemControl.create).toHaveBeenCalledWith({
      data: {
        integrityLevel: SYSTEM_INTEGRITY_LEVEL.NORMAL,
        circuitBreakerActive: false,
      },
    });
  });

  it('should default to CRITICAL on error', async () => {
    prisma.systemControl.findFirst.mockRejectedValue(new Error('Database error'));

    const result = await checkSystemIntegrity();

    expect(result.integrityLevel).toBe(SYSTEM_INTEGRITY_LEVEL.CRITICAL);
    expect(result.circuitBreakerActive).toBe(true);
  });
});

describe('Toggle Circuit Breaker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should activate circuit breaker and freeze pending transfers', async () => {
    const mockSystemControl = {
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.NORMAL,
      circuitBreakerActive: false,
    };

    const mockUpdatedControl = {
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.LOCKED,
      circuitBreakerActive: true,
      lockReason: 'Manual activation',
      lockedBy: 'admin123',
    };

    prisma.systemControl.findFirst.mockResolvedValue(mockSystemControl);
    prisma.systemControl.update.mockResolvedValue(mockUpdatedControl);
    prisma.transfer.updateMany.mockResolvedValue({ count: 5 });

    const result = await toggleCircuitBreaker('admin123', true, 'Manual activation');

    expect(result.success).toBe(true);
    expect(result.systemControl.circuitBreakerActive).toBe(true);
    expect(prisma.transfer.updateMany).toHaveBeenCalledWith({
      where: { status: 'PENDING' },
      data: {
        status: 'FROZEN',
        frozenAt: expect.any(Date),
      },
    });
  });

  it('should deactivate circuit breaker', async () => {
    const mockSystemControl = {
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.LOCKED,
      circuitBreakerActive: true,
    };

    const mockUpdatedControl = {
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.NORMAL,
      circuitBreakerActive: false,
      lockReason: null,
      lockedBy: null,
    };

    prisma.systemControl.findFirst.mockResolvedValue(mockSystemControl);
    prisma.systemControl.update.mockResolvedValue(mockUpdatedControl);

    const result = await toggleCircuitBreaker('admin123', false, 'Manual deactivation');

    expect(result.success).toBe(true);
    expect(result.systemControl.circuitBreakerActive).toBe(false);
    expect(result.systemControl.integrityLevel).toBe(SYSTEM_INTEGRITY_LEVEL.NORMAL);
  });
});

describe('Dual Forensic Check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should block transfer when circuit breaker is active', async () => {
    prisma.systemControl.findFirst.mockResolvedValue({
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.LOCKED,
      circuitBreakerActive: true,
      lockReason: 'System locked',
    });

    const sourceUser = { id: 'user1', email: 'source@test.com', piId: 'pi1' };
    const targetUser = { id: 'user2', email: 'target@test.com', piId: 'pi2' };

    const result = await dualForensicCheck({
      sourceUser,
      targetUser,
      transferData: { amount: 100, sourceDomain: 'fundx', targetDomain: 'commerce' },
      request: {},
    });

    expect(result.approved).toBe(false);
    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('System Lock');
  });

  it('should perform dual audit and approve valid transfer', async () => {
    // Mock normal system state
    prisma.systemControl.findFirst.mockResolvedValue({
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.NORMAL,
      circuitBreakerActive: false,
    });

    // Mock audit log count for integrity check
    prisma.auditLog.count.mockResolvedValue(0);

    // Mock audit log creation
    prisma.auditLog.create.mockResolvedValue({
      id: 'audit123',
      hash: 'hash123',
    });

    // Mock system control update
    prisma.systemControl.update.mockResolvedValue({
      id: 'sys1',
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.NORMAL,
      circuitBreakerActive: false,
    });

    const sourceUser = { id: 'user1', email: 'source@test.com', piId: 'pi1' };
    const targetUser = { id: 'user2', email: 'target@test.com', piId: 'pi2' };

    const result = await dualForensicCheck({
      sourceUser,
      targetUser,
      transferData: { amount: 100, sourceDomain: 'fundx', targetDomain: 'commerce' },
      request: {},
    });

    expect(result.blocked).toBe(false);
    expect(result.sourceAuditId).toBeDefined();
    expect(result.targetAuditId).toBeDefined();
  });
});

describe('Get System Liquidity Stream', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return liquidity data with pending transfers', async () => {
    const mockTransfers = [
      {
        id: 'transfer1',
        amount: 100,
        currency: 'PI',
        status: 'PENDING',
        sourceDomain: 'fundx',
        targetDomain: 'commerce',
        createdAt: new Date(),
        frozenAt: null,
      },
      {
        id: 'transfer2',
        amount: 200,
        currency: 'PI',
        status: 'FROZEN',
        sourceDomain: 'estate',
        targetDomain: 'commerce',
        createdAt: new Date(),
        frozenAt: new Date(),
      },
    ];

    prisma.transfer.findMany.mockResolvedValue(mockTransfers);
    prisma.systemControl.findFirst.mockResolvedValue({
      integrityLevel: SYSTEM_INTEGRITY_LEVEL.WARNING,
      circuitBreakerActive: false,
      lockReason: 'Monitoring anomalies',
    });
    prisma.transfer.count.mockResolvedValue(10);

    const result = await getSystemLiquidityStream();

    expect(result.totalPendingTransfers).toBe(2);
    expect(result.totalFrozenValue).toBe(300);
    expect(result.pendingTransfers).toHaveLength(2);
    expect(result.systemIntegrity.level).toBe(SYSTEM_INTEGRITY_LEVEL.WARNING);
    expect(result.recentVolume.last24Hours).toBe(10);
  });

  it('should handle errors and return safe defaults', async () => {
    prisma.transfer.findMany.mockRejectedValue(new Error('Database error'));

    const result = await getSystemLiquidityStream();

    expect(result.totalPendingTransfers).toBe(0);
    expect(result.totalFrozenValue).toBe(0);
    expect(result.pendingTransfers).toEqual([]);
    expect(result.systemIntegrity.level).toBe(SYSTEM_INTEGRITY_LEVEL.CRITICAL);
    expect(result.systemIntegrity.circuitBreakerActive).toBe(true);
  });
});
