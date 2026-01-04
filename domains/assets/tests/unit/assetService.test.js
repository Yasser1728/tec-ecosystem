/**
 * Unit Tests for Asset Service
 * 
 * These tests verify the core functionality of the AssetService class,
 * including asset creation, updates, calculations, and analysis.
 * 
 * @module domains/assets/tests/unit/assetService.test
 */

const AssetService = require('../../services/assetService');

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    asset: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    valuation: {
      create: jest.fn(),
    },
    portfolio: {
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('AssetService', () => {
  let assetService;
  let mockPrisma;

  beforeEach(() => {
    assetService = new AssetService();
    const { PrismaClient } = require('@prisma/client');
    mockPrisma = new PrismaClient();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('calculateValue', () => {
    it('should calculate value correctly for whole numbers', () => {
      const value = assetService.calculateValue(100, 50.25);
      expect(value).toBe(5025);
    });

    it('should calculate value correctly for decimals', () => {
      const value = assetService.calculateValue(1.5, 45000.50);
      expect(value).toBe(67500.75);
    });

    it('should handle zero quantity', () => {
      const value = assetService.calculateValue(0, 100);
      expect(value).toBe(0);
    });

    it('should handle zero price', () => {
      const value = assetService.calculateValue(100, 0);
      expect(value).toBe(0);
    });

    it('should round to 8 decimal places', () => {
      const value = assetService.calculateValue(1/3, 100);
      expect(value).toBeCloseTo(33.33333333, 8);
    });
  });

  describe('validateAssetData', () => {
    it('should pass validation for valid data', () => {
      const validData = {
        portfolioId: 'port_123',
        assetTypeId: 'CRYPTOCURRENCY',
        name: 'Bitcoin',
        quantity: 1.5,
        purchasePrice: 45000,
        purchaseDate: new Date(),
      };

      expect(() => assetService.validateAssetData(validData)).not.toThrow();
    });

    it('should throw error for missing portfolioId', () => {
      const invalidData = {
        assetTypeId: 'CRYPTOCURRENCY',
        name: 'Bitcoin',
        quantity: 1.5,
        purchasePrice: 45000,
        purchaseDate: new Date(),
      };

      expect(() => assetService.validateAssetData(invalidData))
        .toThrow('Portfolio ID is required');
    });

    it('should throw error for missing assetTypeId', () => {
      const invalidData = {
        portfolioId: 'port_123',
        name: 'Bitcoin',
        quantity: 1.5,
        purchasePrice: 45000,
        purchaseDate: new Date(),
      };

      expect(() => assetService.validateAssetData(invalidData))
        .toThrow('Asset type ID is required');
    });

    it('should throw error for empty name', () => {
      const invalidData = {
        portfolioId: 'port_123',
        assetTypeId: 'CRYPTOCURRENCY',
        name: '   ',
        quantity: 1.5,
        purchasePrice: 45000,
        purchaseDate: new Date(),
      };

      expect(() => assetService.validateAssetData(invalidData))
        .toThrow('Asset name is required');
    });

    it('should throw error for zero quantity', () => {
      const invalidData = {
        portfolioId: 'port_123',
        assetTypeId: 'CRYPTOCURRENCY',
        name: 'Bitcoin',
        quantity: 0,
        purchasePrice: 45000,
        purchaseDate: new Date(),
      };

      expect(() => assetService.validateAssetData(invalidData))
        .toThrow('Quantity must be greater than 0');
    });

    it('should throw error for negative quantity', () => {
      const invalidData = {
        portfolioId: 'port_123',
        assetTypeId: 'CRYPTOCURRENCY',
        name: 'Bitcoin',
        quantity: -5,
        purchasePrice: 45000,
        purchaseDate: new Date(),
      };

      expect(() => assetService.validateAssetData(invalidData))
        .toThrow('Quantity must be greater than 0');
    });

    it('should throw error for zero purchase price', () => {
      const invalidData = {
        portfolioId: 'port_123',
        assetTypeId: 'CRYPTOCURRENCY',
        name: 'Bitcoin',
        quantity: 1.5,
        purchasePrice: 0,
        purchaseDate: new Date(),
      };

      expect(() => assetService.validateAssetData(invalidData))
        .toThrow('Purchase price must be greater than 0');
    });

    it('should throw error for missing purchase date', () => {
      const invalidData = {
        portfolioId: 'port_123',
        assetTypeId: 'CRYPTOCURRENCY',
        name: 'Bitcoin',
        quantity: 1.5,
        purchasePrice: 45000,
      };

      expect(() => assetService.validateAssetData(invalidData))
        .toThrow('Purchase date is required');
    });
  });

  describe('analyzePriceTrends', () => {
    it('should return insufficient data for less than 2 valuations', () => {
      const result = assetService.analyzePriceTrends([]);
      expect(result.trend).toBe('INSUFFICIENT_DATA');
    });

    it('should detect upward trend', () => {
      const valuations = [
        { price: 100, valuationDate: '2026-01-01' },
        { price: 105, valuationDate: '2026-01-02' },
        { price: 110, valuationDate: '2026-01-03' },
        { price: 120, valuationDate: '2026-01-04' },
      ];

      const result = assetService.analyzePriceTrends(valuations);
      expect(result.trend).toBe('UPWARD');
      expect(result.priceChangePercent).toBeGreaterThan(5);
    });

    it('should detect downward trend', () => {
      const valuations = [
        { price: 120, valuationDate: '2026-01-01' },
        { price: 110, valuationDate: '2026-01-02' },
        { price: 105, valuationDate: '2026-01-03' },
        { price: 100, valuationDate: '2026-01-04' },
      ];

      const result = assetService.analyzePriceTrends(valuations);
      expect(result.trend).toBe('DOWNWARD');
      expect(result.priceChangePercent).toBeLessThan(-5);
    });

    it('should detect stable trend', () => {
      const valuations = [
        { price: 100, valuationDate: '2026-01-01' },
        { price: 101, valuationDate: '2026-01-02' },
        { price: 102, valuationDate: '2026-01-03' },
        { price: 103, valuationDate: '2026-01-04' },
      ];

      const result = assetService.analyzePriceTrends(valuations);
      expect(result.trend).toBe('STABLE');
      expect(Math.abs(result.priceChangePercent)).toBeLessThanOrEqual(5);
    });

    it('should calculate high and low prices correctly', () => {
      const valuations = [
        { price: 100, valuationDate: '2026-01-01' },
        { price: 150, valuationDate: '2026-01-02' },
        { price: 80, valuationDate: '2026-01-03' },
        { price: 120, valuationDate: '2026-01-04' },
      ];

      const result = assetService.analyzePriceTrends(valuations);
      expect(result.highPrice).toBe(150);
      expect(result.lowPrice).toBe(80);
    });

    it('should calculate volatility', () => {
      const valuations = [
        { price: 100, valuationDate: '2026-01-01' },
        { price: 200, valuationDate: '2026-01-02' },
        { price: 50, valuationDate: '2026-01-03' },
        { price: 150, valuationDate: '2026-01-04' },
      ];

      const result = assetService.analyzePriceTrends(valuations);
      expect(result.volatilityPercent).toBeGreaterThan(0);
    });

    it('should calculate 7-day moving average when enough data', () => {
      const valuations = [];
      for (let i = 1; i <= 10; i++) {
        valuations.push({
          price: 100 + i,
          valuationDate: `2026-01-${i.toString().padStart(2, '0')}`,
        });
      }

      const result = assetService.analyzePriceTrends(valuations);
      expect(result.sma7).toBeTruthy();
      expect(typeof result.sma7).toBe('number');
    });
  });

  describe('analyzeTransactionPatterns', () => {
    it('should return message for no transactions', () => {
      const result = assetService.analyzeTransactionPatterns([]);
      expect(result.message).toBe('No transactions to analyze');
    });

    it('should analyze buy transactions', () => {
      const transactions = [
        { type: 'BUY', quantity: 10, price: 100, totalAmount: 1000 },
        { type: 'BUY', quantity: 5, price: 110, totalAmount: 550 },
      ];

      const result = assetService.analyzeTransactionPatterns(transactions);
      expect(result.breakdown.buys).toBe(2);
      expect(result.quantities.totalBought).toBe(15);
      expect(result.prices.averageBuyPrice).toBe(105);
    });

    it('should analyze sell transactions', () => {
      const transactions = [
        { type: 'BUY', quantity: 10, price: 100, totalAmount: 1000 },
        { type: 'SELL', quantity: 3, price: 120, totalAmount: 360 },
      ];

      const result = assetService.analyzeTransactionPatterns(transactions);
      expect(result.breakdown.sells).toBe(1);
      expect(result.quantities.totalSold).toBe(3);
      expect(result.quantities.netPosition).toBe(7);
    });

    it('should analyze dividend transactions', () => {
      const transactions = [
        { type: 'BUY', quantity: 10, price: 100, totalAmount: 1000 },
        { type: 'DIVIDEND', quantity: 0, price: 0, totalAmount: 50 },
        { type: 'DIVIDEND', quantity: 0, price: 0, totalAmount: 50 },
      ];

      const result = assetService.analyzeTransactionPatterns(transactions);
      expect(result.breakdown.dividends).toBe(2);
      expect(result.dividends.total).toBe(100);
      expect(result.dividends.count).toBe(2);
    });
  });

  describe('calculateRiskMetrics', () => {
    it('should return unknown risk for insufficient data', () => {
      const valuations = [
        { price: 100, valuationDate: '2026-01-01' },
        { price: 105, valuationDate: '2026-01-02' },
      ];

      const result = assetService.calculateRiskMetrics(valuations, {});
      expect(result.riskLevel).toBe('UNKNOWN');
    });

    it('should calculate risk level for sufficient data', () => {
      const valuations = [];
      for (let i = 1; i <= 30; i++) {
        // Low volatility prices
        valuations.push({
          price: 100 + Math.sin(i) * 2, // Small variations
          valuationDate: `2026-01-${i.toString().padStart(2, '0')}`,
        });
      }

      const result = assetService.calculateRiskMetrics(valuations, {});
      expect(result.riskLevel).toBeDefined();
      expect(['LOW', 'MEDIUM', 'HIGH'].includes(result.riskLevel)).toBe(true);
    });

    it('should classify low volatility as low risk', () => {
      const valuations = [];
      for (let i = 1; i <= 30; i++) {
        // Very stable prices
        valuations.push({
          price: 100 + (i % 2 === 0 ? 1 : 0),
          valuationDate: `2026-01-${i.toString().padStart(2, '0')}`,
        });
      }

      const result = assetService.calculateRiskMetrics(valuations, {});
      expect(result.riskLevel).toBe('LOW');
    });

    it('should calculate max drawdown', () => {
      const valuations = [
        { price: 100, valuationDate: '2026-01-01' },
        { price: 150, valuationDate: '2026-01-02' },
        { price: 120, valuationDate: '2026-01-03' },
        { price: 80, valuationDate: '2026-01-04' },
        { price: 100, valuationDate: '2026-01-05' },
      ];

      // Add more data points to meet minimum requirement
      for (let i = 6; i <= 30; i++) {
        valuations.push({
          price: 100,
          valuationDate: `2026-01-${i.toString().padStart(2, '0')}`,
        });
      }

      const result = assetService.calculateRiskMetrics(valuations, {});
      expect(result.maxDrawdown).toBeGreaterThan(0);
      expect(result.maxDrawdownPercent).toBeGreaterThan(0);
    });
  });

  describe('generateInvestmentInsights', () => {
    it('should generate positive insight for strong performance', () => {
      const asset = { name: 'Test Asset' };
      const performance = {
        percentageGain: 25,
        holdingDays: 100,
        annualizedReturn: 91.25,
      };
      const priceAnalysis = {
        trend: 'UPWARD',
        volatilityPercent: 10,
      };

      const insights = assetService.generateInvestmentInsights(
        asset,
        performance,
        priceAnalysis
      );

      expect(insights.length).toBeGreaterThan(0);
      const performanceInsight = insights.find(i => i.category === 'PERFORMANCE');
      expect(performanceInsight).toBeDefined();
      expect(performanceInsight.type).toBe('POSITIVE');
    });

    it('should generate warning for poor performance', () => {
      const asset = { name: 'Test Asset' };
      const performance = {
        percentageGain: -15,
        holdingDays: 100,
        annualizedReturn: -54.75,
      };
      const priceAnalysis = {
        trend: 'DOWNWARD',
        volatilityPercent: 10,
      };

      const insights = assetService.generateInvestmentInsights(
        asset,
        performance,
        priceAnalysis
      );

      const performanceInsight = insights.find(i => i.category === 'PERFORMANCE');
      expect(performanceInsight).toBeDefined();
      expect(performanceInsight.type).toBe('WARNING');
    });

    it('should generate trend insights', () => {
      const asset = { name: 'Test Asset' };
      const performance = {
        percentageGain: 5,
        holdingDays: 100,
      };
      const priceAnalysis = {
        trend: 'UPWARD',
        volatilityPercent: 10,
      };

      const insights = assetService.generateInvestmentInsights(
        asset,
        performance,
        priceAnalysis
      );

      const trendInsight = insights.find(i => i.category === 'TREND');
      expect(trendInsight).toBeDefined();
      expect(trendInsight.message).toContain('positive');
    });

    it('should generate volatility insights for high volatility', () => {
      const asset = { name: 'Test Asset' };
      const performance = {
        percentageGain: 5,
        holdingDays: 100,
      };
      const priceAnalysis = {
        trend: 'STABLE',
        volatilityPercent: 25,
      };

      const insights = assetService.generateInvestmentInsights(
        asset,
        performance,
        priceAnalysis
      );

      const riskInsight = insights.find(i => i.category === 'RISK');
      expect(riskInsight).toBeDefined();
      expect(riskInsight.message).toContain('High volatility');
    });

    it('should generate holding period insights', () => {
      const asset = { name: 'Test Asset' };
      const performance = {
        percentageGain: 5,
        holdingDays: 15,
      };
      const priceAnalysis = {
        trend: 'STABLE',
        volatilityPercent: 10,
      };

      const insights = assetService.generateInvestmentInsights(
        asset,
        performance,
        priceAnalysis
      );

      const strategyInsight = insights.find(i => i.category === 'STRATEGY');
      expect(strategyInsight).toBeDefined();
      expect(strategyInsight.message).toContain('Recent investment');
    });
  });

  describe('Integration Event Handlers', () => {
    it('should handle FundX investment event', async () => {
      const mockAsset = {
        id: 'asset_123',
        name: 'Growth Strategy',
        currentValue: 10000,
      };

      assetService.createAsset = jest.fn().mockResolvedValue(mockAsset);

      const eventData = {
        investmentId: 'inv_123',
        portfolioId: 'port_123',
        strategyName: 'Growth Strategy',
        amount: 10000,
        shares: 400,
        pricePerUnit: 25,
        date: new Date(),
        strategy: 'GROWTH',
        riskLevel: 'MEDIUM',
      };

      const result = await assetService.handleFundXInvestment(eventData);

      expect(result).toBeDefined();
      expect(result.id).toBe('asset_123');
      expect(assetService.createAsset).toHaveBeenCalled();
    });

    it('should handle Estate property event', async () => {
      const mockAsset = {
        id: 'asset_456',
        name: 'Luxury Villa',
        currentValue: 500000,
      };

      assetService.createAsset = jest.fn().mockResolvedValue(mockAsset);

      const eventData = {
        propertyId: 'prop_123',
        portfolioId: 'port_123',
        propertyName: 'Luxury Villa',
        price: 500000,
        purchaseDate: new Date(),
        address: '123 Main St',
        propertyType: 'VILLA',
        sqm: 300,
        transactionId: 'tx_123',
      };

      const result = await assetService.handleEstateProperty(eventData);

      expect(result).toBeDefined();
      expect(result.id).toBe('asset_456');
      expect(assetService.createAsset).toHaveBeenCalled();
    });

    it('should skip Commerce product if not marked for tracking', async () => {
      const eventData = {
        productId: 'prod_123',
        portfolioId: 'port_123',
        productName: 'Test Product',
        quantity: 1,
        unitPrice: 100,
        purchaseDate: new Date(),
        trackAsAsset: false,
        orderId: 'order_123',
        category: 'electronics',
      };

      const result = await assetService.handleCommerceProduct(eventData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('not marked for asset tracking');
    });
  });
});
