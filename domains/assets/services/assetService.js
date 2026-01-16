/**
 * Asset Service - Core Business Logic for Assets Domain
 * 
 * This service handles all business logic related to asset management,
 * including CRUD operations, calculations, validations, and integrations.
 * 
 * @module services/assetService
 */

const { PrismaClient } = require('@prisma/client');
const { logger } = require('../../../lib/utils/logger.js');
const prisma = new PrismaClient();

// Constants for analysis thresholds
const RISK_THRESHOLDS = {
  HIGH: 0.15,
  MEDIUM: 0.08,
};

const TREND_THRESHOLDS = {
  UPWARD: 5,
  DOWNWARD: -5,
};

class AssetService {
  /**
   * Create a new asset in a portfolio
   * 
   * @param {Object} data - Asset creation data
   * @param {string} data.portfolioId - Portfolio ID
   * @param {string} data.assetTypeId - Asset type ID
   * @param {string} data.name - Asset name
   * @param {number} data.quantity - Quantity held
   * @param {number} data.purchasePrice - Purchase price per unit
   * @param {Date} data.purchaseDate - Purchase date
   * @param {Object} [data.metadata] - Optional metadata
   * @returns {Promise<Object>} Created asset
   */
  async createAsset(data) {
    try {
      // Validate required fields
      this.validateAssetData(data);
      
      // Calculate initial values
      const currentPrice = data.currentPrice || data.purchasePrice;
      const currentValue = this.calculateValue(data.quantity, currentPrice);
      const costBasis = this.calculateValue(data.quantity, data.purchasePrice);
      const unrealizedGainLoss = currentValue - costBasis;
      
      // Create asset in database
      const asset = await prisma.asset.create({
        data: {
          portfolioId: data.portfolioId,
          assetTypeId: data.assetTypeId,
          categoryId: data.categoryId || null,
          name: data.name,
          symbol: data.symbol || null,
          description: data.description || null,
          quantity: data.quantity,
          purchasePrice: data.purchasePrice,
          purchaseDate: data.purchaseDate,
          currentPrice: currentPrice,
          currentValue: currentValue,
          costBasis: costBasis,
          unrealizedGainLoss: unrealizedGainLoss,
          status: 'ACTIVE',
          metadata: data.metadata || {},
        },
        include: {
          assetType: true,
          category: true,
          portfolio: true,
        },
      });
      
      // Create initial buy transaction
      await this.createTransaction({
        assetId: asset.id,
        type: 'BUY',
        quantity: data.quantity,
        price: data.purchasePrice,
        totalAmount: costBasis,
        fee: data.fee || 0,
        date: data.purchaseDate,
        description: 'Initial purchase',
        relatedDomain: data.relatedDomain || null,
        relatedTransactionId: data.relatedTransactionId || null,
      });
      
      // Create initial valuation snapshot
      await this.recordValuation({
        assetId: asset.id,
        price: currentPrice,
        totalValue: currentValue,
        source: 'MANUAL',
        valuationDate: data.purchaseDate,
      });
      
      // Update portfolio total value
      await this.updatePortfolioValue(data.portfolioId);
      
      return asset;
    } catch (error) {
      // Note: Using built-in logger utility (lib/utils/logger.js)
      logger.error('Error creating asset:', { error });
      throw new Error(`Failed to create asset: ${error.message}`);
    }
  }
  
  /**
   * Get asset by ID with all related data
   * 
   * @param {string} assetId - Asset ID
   * @param {Object} [options] - Query options
   * @returns {Promise<Object>} Asset with related data
   */
  async getAssetById(assetId, options = {}) {
    try {
      const asset = await prisma.asset.findUnique({
        where: { id: assetId },
        include: {
          assetType: true,
          category: true,
          portfolio: true,
          transactions: options.includeTransactions ? {
            orderBy: { date: 'desc' },
            take: options.transactionLimit || 50,
          } : false,
          valuations: options.includeValuations ? {
            orderBy: { valuationDate: 'desc' },
            take: options.valuationLimit || 30,
          } : false,
          documents: options.includeDocuments !== false,
        },
      });
      
      if (!asset) {
        throw new Error(`Asset not found: ${assetId}`);
      }
      
      return asset;
    } catch (error) {
      logger.error('Error fetching asset:', { error });
      throw error;
    }
  }
  
  /**
   * Get all assets for a user with filtering
   * 
   * @param {string} userId - User ID
   * @param {Object} [filters] - Filter options
   * @returns {Promise<Array>} Array of assets
   */
  async getUserAssets(userId, filters = {}) {
    try {
      const where = {
        portfolio: { userId },
      };
      
      if (filters.portfolioId) {
        where.portfolioId = filters.portfolioId;
      }
      
      if (filters.assetTypeId) {
        where.assetTypeId = filters.assetTypeId;
      }
      
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }
      
      if (filters.status) {
        where.status = filters.status;
      } else {
        where.status = 'ACTIVE'; // Default to active assets
      }
      
      const assets = await prisma.asset.findMany({
        where,
        include: {
          assetType: true,
          category: true,
          portfolio: true,
        },
        orderBy: filters.orderBy || { currentValue: 'desc' },
      });
      
      return assets;
    } catch (error) {
      console.error('Error fetching user assets:', error);
      throw error;
    }
  }
  
  /**
   * Update asset details
   * 
   * @param {string} assetId - Asset ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated asset
   */
  async updateAsset(assetId, updates) {
    try {
      const asset = await this.getAssetById(assetId);
      
      // Recalculate values if quantity or price changed
      if (updates.quantity !== undefined || updates.currentPrice !== undefined) {
        const quantity = updates.quantity !== undefined ? updates.quantity : asset.quantity;
        const currentPrice = updates.currentPrice !== undefined ? updates.currentPrice : asset.currentPrice;
        
        updates.currentValue = this.calculateValue(quantity, currentPrice);
        updates.unrealizedGainLoss = updates.currentValue - asset.costBasis;
      }
      
      const updatedAsset = await prisma.asset.update({
        where: { id: assetId },
        data: updates,
        include: {
          assetType: true,
          category: true,
          portfolio: true,
        },
      });
      
      // Update portfolio value
      await this.updatePortfolioValue(updatedAsset.portfolioId);
      
      return updatedAsset;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  }
  
  /**
   * Delete/archive asset
   * 
   * @param {string} assetId - Asset ID
   * @param {boolean} [hardDelete=false] - True for hard delete, false for soft delete
   * @returns {Promise<Object>} Deletion result
   */
  async deleteAsset(assetId, hardDelete = false) {
    try {
      const asset = await this.getAssetById(assetId);
      
      if (hardDelete) {
        // Hard delete (use with caution)
        await prisma.asset.delete({
          where: { id: assetId },
        });
      } else {
        // Soft delete - change status to ARCHIVED
        await this.updateAsset(assetId, { status: 'ARCHIVED' });
      }
      
      // Update portfolio value
      await this.updatePortfolioValue(asset.portfolioId);
      
      return { success: true, assetId, deleted: hardDelete ? 'HARD' : 'SOFT' };
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  }
  
  /**
   * Calculate asset value
   * 
   * @param {number} quantity - Quantity held
   * @param {number} price - Price per unit
   * @returns {number} Total value
   * 
   * @note For production, consider using a decimal library (e.g., decimal.js, big.js)
   * to avoid floating-point precision issues in financial calculations
   */
  calculateValue(quantity, price) {
    // Simple implementation - replace with decimal library for production
    return parseFloat((quantity * price).toFixed(8));
  }
  
  /**
   * Update asset prices from external source
   * 
   * @param {Array<string>} assetIds - Array of asset IDs to update
   * @param {Object} priceData - Map of symbol to price
   * @returns {Promise<Object>} Update results
   */
  async updateAssetPrices(assetIds, priceData) {
    try {
      const results = {
        updated: 0,
        failed: 0,
        errors: [],
      };
      
      for (const assetId of assetIds) {
        try {
          const asset = await this.getAssetById(assetId);
          
          if (!asset.symbol || !priceData[asset.symbol]) {
            continue;
          }
          
          const newPrice = priceData[asset.symbol];
          await this.updateAsset(assetId, {
            currentPrice: newPrice,
          });
          
          // Record valuation
          await this.recordValuation({
            assetId: asset.id,
            price: newPrice,
            totalValue: this.calculateValue(asset.quantity, newPrice),
            source: 'API',
            valuationDate: new Date(),
          });
          
          results.updated++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            assetId,
            error: error.message,
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error updating asset prices:', error);
      throw error;
    }
  }
  
  /**
   * Create a transaction record
   * 
   * @param {Object} data - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  async createTransaction(data) {
    try {
      const totalAmount = data.totalAmount || this.calculateValue(data.quantity, data.price);
      
      const transaction = await prisma.transaction.create({
        data: {
          assetId: data.assetId,
          type: data.type,
          quantity: data.quantity,
          price: data.price,
          totalAmount: totalAmount,
          fee: data.fee || 0,
          date: data.date || new Date(),
          description: data.description || null,
          relatedDomain: data.relatedDomain || null,
          relatedTransactionId: data.relatedTransactionId || null,
          metadata: data.metadata || {},
        },
      });
      
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
  
  /**
   * Record valuation snapshot
   * 
   * @param {Object} data - Valuation data
   * @returns {Promise<Object>} Created valuation
   */
  async recordValuation(data) {
    try {
      const valuation = await prisma.valuation.create({
        data: {
          assetId: data.assetId || null,
          portfolioId: data.portfolioId || null,
          price: data.price,
          totalValue: data.totalValue,
          source: data.source || 'MANUAL',
          valuationDate: data.valuationDate || new Date(),
          metadata: data.metadata || {},
        },
      });
      
      return valuation;
    } catch (error) {
      console.error('Error recording valuation:', error);
      throw error;
    }
  }
  
  /**
   * Update portfolio total value
   * 
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<number>} Updated total value
   */
  async updatePortfolioValue(portfolioId) {
    try {
      const assets = await prisma.asset.findMany({
        where: {
          portfolioId,
          status: 'ACTIVE',
        },
        select: {
          currentValue: true,
        },
      });
      
      const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.currentValue), 0);
      
      await prisma.portfolio.update({
        where: { id: portfolioId },
        data: { totalValue },
      });
      
      // Record portfolio valuation
      await this.recordValuation({
        portfolioId,
        price: 0, // Not applicable for portfolio
        totalValue,
        source: 'CALCULATED',
        valuationDate: new Date(),
      });
      
      return totalValue;
    } catch (error) {
      console.error('Error updating portfolio value:', error);
      throw error;
    }
  }
  
  /**
   * Calculate asset performance metrics
   * 
   * @param {string} assetId - Asset ID
   * @returns {Promise<Object>} Performance metrics
   */
  async calculatePerformance(assetId) {
    try {
      const asset = await this.getAssetById(assetId);
      const transactions = await prisma.transaction.findMany({
        where: { assetId },
        orderBy: { date: 'asc' },
      });
      
      // Calculate metrics
      const totalInvested = asset.costBasis;
      const currentValue = asset.currentValue;
      const absoluteGain = asset.unrealizedGainLoss;
      const percentageGain = (absoluteGain / totalInvested) * 100;
      
      // Calculate holding period
      const holdingDays = Math.floor(
        (new Date() - new Date(asset.purchaseDate)) / (1000 * 60 * 60 * 24)
      );
      
      // Annualized return (simple approximation)
      const annualizedReturn = (percentageGain / holdingDays) * 365;
      
      return {
        assetId: asset.id,
        assetName: asset.name,
        totalInvested,
        currentValue,
        absoluteGain,
        percentageGain: parseFloat(percentageGain.toFixed(2)),
        holdingDays,
        annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
        transactionCount: transactions.length,
      };
    } catch (error) {
      console.error('Error calculating performance:', error);
      throw error;
    }
  }
  
  /**
   * Validate asset data
   * 
   * @param {Object} data - Asset data to validate
   * @throws {Error} If validation fails
   */
  validateAssetData(data) {
    if (!data.portfolioId) {
      throw new Error('Portfolio ID is required');
    }
    
    if (!data.assetTypeId) {
      throw new Error('Asset type ID is required');
    }
    
    if (!data.name || data.name.trim() === '') {
      throw new Error('Asset name is required');
    }
    
    if (!data.quantity || data.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    if (!data.purchasePrice || data.purchasePrice <= 0) {
      throw new Error('Purchase price must be greater than 0');
    }
    
    if (!data.purchaseDate) {
      throw new Error('Purchase date is required');
    }
  }
  
  /**
   * Handle cross-domain integration events
   * 
   * @param {string} eventType - Event type
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Integration result
   */
  async handleIntegrationEvent(eventType, eventData) {
    try {
      switch (eventType) {
        case 'fundx.investment.created':
          return await this.handleFundXInvestment(eventData);
        
        case 'estate.property.purchased':
          return await this.handleEstateProperty(eventData);
        
        case 'commerce.product.purchased':
          return await this.handleCommerceProduct(eventData);
        
        default:
          console.warn(`Unknown event type: ${eventType}`);
          return { success: false, message: 'Unknown event type' };
      }
    } catch (error) {
      console.error('Error handling integration event:', error);
      throw error;
    }
  }
  
  /**
   * Handle FundX investment creation
   * 
   * @param {Object} data - Investment data
   * @returns {Promise<Object>} Created asset
   */
  async handleFundXInvestment(data) {
    return await this.createAsset({
      portfolioId: data.portfolioId,
      assetTypeId: 'INVESTMENT',
      name: data.strategyName,
      symbol: data.symbol || null,
      quantity: data.shares || data.amount,
      purchasePrice: data.pricePerUnit || data.amount,
      purchaseDate: new Date(data.date),
      metadata: {
        sourceId: data.investmentId,
        sourceDomain: 'fundx',
        strategy: data.strategy,
        riskLevel: data.riskLevel,
      },
      relatedDomain: 'fundx',
      relatedTransactionId: data.investmentId,
    });
  }
  
  /**
   * Handle estate property purchase
   * 
   * @param {Object} data - Property data
   * @returns {Promise<Object>} Created asset
   */
  async handleEstateProperty(data) {
    return await this.createAsset({
      portfolioId: data.portfolioId,
      assetTypeId: 'REAL_ESTATE',
      name: data.propertyName,
      quantity: 1,
      purchasePrice: data.price,
      purchaseDate: new Date(data.purchaseDate),
      description: data.description,
      metadata: {
        sourceId: data.propertyId,
        sourceDomain: 'estate',
        address: data.address,
        propertyType: data.propertyType,
        sqm: data.sqm,
      },
      relatedDomain: 'estate',
      relatedTransactionId: data.transactionId,
    });
  }
  
  /**
   * Handle commerce product purchase (for trackable assets)
   * 
   * @param {Object} data - Product data
   * @returns {Promise<Object>} Created asset
   */
  async handleCommerceProduct(data) {
    // Only create asset if product is marked as trackable
    if (!data.trackAsAsset) {
      return { success: false, message: 'Product not marked for asset tracking' };
    }
    
    return await this.createAsset({
      portfolioId: data.portfolioId,
      assetTypeId: data.assetType || 'DIGITAL_ASSET',
      name: data.productName,
      quantity: data.quantity,
      purchasePrice: data.unitPrice,
      purchaseDate: new Date(data.purchaseDate),
      metadata: {
        sourceId: data.productId,
        sourceDomain: 'commerce',
        orderId: data.orderId,
        category: data.category,
      },
      relatedDomain: 'commerce',
      relatedTransactionId: data.orderId,
    });
  }
  
  /**
   * Link asset to insurance policy
   * 
   * @param {string} assetId - Asset ID
   * @param {Object} insuranceData - Insurance policy data
   * @returns {Promise<Object>} Updated asset with insurance link
   */
  async linkToInsurance(assetId, insuranceData) {
    try {
      const asset = await this.getAssetById(assetId);
      
      // Update asset metadata with insurance information
      const updatedMetadata = {
        ...asset.metadata,
        insurance: {
          policyId: insuranceData.policyId,
          provider: insuranceData.provider,
          policyType: insuranceData.policyType,
          coverage: insuranceData.coverage,
          premium: insuranceData.premium,
          startDate: insuranceData.startDate,
          endDate: insuranceData.endDate,
          linkedAt: new Date().toISOString(),
        },
      };
      
      const updatedAsset = await this.updateAsset(assetId, {
        metadata: updatedMetadata,
      });
      
      console.log(`Asset ${assetId} linked to insurance policy ${insuranceData.policyId}`);
      
      return {
        success: true,
        asset: updatedAsset,
        insurance: updatedMetadata.insurance,
      };
    } catch (error) {
      console.error('Error linking asset to insurance:', error);
      throw error;
    }
  }
  
  /**
   * Link asset to investment
   * 
   * @param {string} assetId - Asset ID
   * @param {Object} investmentData - Investment data
   * @returns {Promise<Object>} Updated asset with investment link
   */
  async linkToInvestment(assetId, investmentData) {
    try {
      const asset = await this.getAssetById(assetId);
      
      // Update asset metadata with investment information
      const updatedMetadata = {
        ...asset.metadata,
        investment: {
          investmentId: investmentData.investmentId,
          strategy: investmentData.strategy,
          riskLevel: investmentData.riskLevel,
          targetReturn: investmentData.targetReturn,
          linkedAt: new Date().toISOString(),
        },
      };
      
      const updatedAsset = await this.updateAsset(assetId, {
        metadata: updatedMetadata,
      });
      
      console.log(`Asset ${assetId} linked to investment ${investmentData.investmentId}`);
      
      return {
        success: true,
        asset: updatedAsset,
        investment: updatedMetadata.investment,
      };
    } catch (error) {
      console.error('Error linking asset to investment:', error);
      throw error;
    }
  }
  
  /**
   * Analyze asset data - comprehensive analytics
   * 
   * @param {string} assetId - Asset ID
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Comprehensive asset analysis
   */
  async analyzeAssetData(assetId, options = {}) {
    try {
      const asset = await this.getAssetById(assetId, {
        includeTransactions: true,
        includeValuations: true,
        transactionLimit: 100,
        valuationLimit: 90,
      });
      
      // Calculate performance metrics
      const performance = await this.calculatePerformance(assetId);
      
      // Analyze price trends
      const priceAnalysis = this.analyzePriceTrends(asset.valuations || []);
      
      // Analyze transaction patterns
      const transactionAnalysis = this.analyzeTransactionPatterns(asset.transactions || []);
      
      // Risk assessment
      const riskMetrics = this.calculateRiskMetrics(asset.valuations || [], asset);
      
      // Investment insights
      const insights = this.generateInvestmentInsights(asset, performance, priceAnalysis);
      
      return {
        success: true,
        assetId: asset.id,
        assetName: asset.name,
        analysis: {
          performance,
          priceAnalysis,
          transactionAnalysis,
          riskMetrics,
          insights,
          metadata: {
            analyzedAt: new Date().toISOString(),
            dataPoints: {
              valuations: asset.valuations?.length || 0,
              transactions: asset.transactions?.length || 0,
            },
          },
        },
      };
    } catch (error) {
      console.error('Error analyzing asset data:', error);
      throw error;
    }
  }
  
  /**
   * Analyze price trends from valuations
   * 
   * @param {Array} valuations - Array of valuation records
   * @returns {Object} Price trend analysis
   */
  analyzePriceTrends(valuations) {
    if (!valuations || valuations.length < 2) {
      return { trend: 'INSUFFICIENT_DATA', message: 'Not enough data for trend analysis' };
    }
    
    const sortedValuations = [...valuations].sort((a, b) => 
      new Date(a.valuationDate) - new Date(b.valuationDate)
    );
    
    const prices = sortedValuations.map(v => parseFloat(v.price));
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);
    
    // Calculate simple moving average (if we have enough data)
    const sma7 = prices.length >= 7 ? 
      prices.slice(-7).reduce((a, b) => a + b, 0) / 7 : null;
    
    // Trend direction
    const priceChange = lastPrice - firstPrice;
    const priceChangePercent = (priceChange / firstPrice) * 100;
    
    let trend = 'STABLE';
    if (priceChangePercent > TREND_THRESHOLDS.UPWARD) trend = 'UPWARD';
    else if (priceChangePercent < TREND_THRESHOLDS.DOWNWARD) trend = 'DOWNWARD';
    
    // Volatility (standard deviation)
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);
    const volatilityPercent = (volatility / mean) * 100;
    
    return {
      trend,
      priceChange: parseFloat(priceChange.toFixed(8)),
      priceChangePercent: parseFloat(priceChangePercent.toFixed(2)),
      currentPrice: lastPrice,
      highPrice,
      lowPrice,
      averagePrice: mean,
      volatility: parseFloat(volatility.toFixed(8)),
      volatilityPercent: parseFloat(volatilityPercent.toFixed(2)),
      sma7: sma7 ? parseFloat(sma7.toFixed(8)) : null,
      dataPoints: prices.length,
    };
  }
  
  /**
   * Analyze transaction patterns
   * 
   * @param {Array} transactions - Array of transaction records
   * @returns {Object} Transaction pattern analysis
   */
  analyzeTransactionPatterns(transactions) {
    if (!transactions || transactions.length === 0) {
      return { message: 'No transactions to analyze' };
    }
    
    const buyTransactions = transactions.filter(t => t.type === 'BUY');
    const sellTransactions = transactions.filter(t => t.type === 'SELL');
    const dividendTransactions = transactions.filter(t => t.type === 'DIVIDEND');
    
    const totalBought = buyTransactions.reduce((sum, t) => sum + parseFloat(t.quantity), 0);
    const totalSold = sellTransactions.reduce((sum, t) => sum + parseFloat(t.quantity), 0);
    const totalDividends = dividendTransactions.reduce((sum, t) => sum + parseFloat(t.totalAmount), 0);
    
    const avgBuyPrice = buyTransactions.length > 0 ?
      buyTransactions.reduce((sum, t) => sum + parseFloat(t.price), 0) / buyTransactions.length : 0;
    
    const avgSellPrice = sellTransactions.length > 0 ?
      sellTransactions.reduce((sum, t) => sum + parseFloat(t.price), 0) / sellTransactions.length : 0;
    
    return {
      totalTransactions: transactions.length,
      breakdown: {
        buys: buyTransactions.length,
        sells: sellTransactions.length,
        dividends: dividendTransactions.length,
        other: transactions.length - buyTransactions.length - sellTransactions.length - dividendTransactions.length,
      },
      quantities: {
        totalBought: parseFloat(totalBought.toFixed(8)),
        totalSold: parseFloat(totalSold.toFixed(8)),
        netPosition: parseFloat((totalBought - totalSold).toFixed(8)),
      },
      prices: {
        averageBuyPrice: parseFloat(avgBuyPrice.toFixed(8)),
        averageSellPrice: avgSellPrice > 0 ? parseFloat(avgSellPrice.toFixed(8)) : null,
      },
      dividends: {
        total: parseFloat(totalDividends.toFixed(2)),
        count: dividendTransactions.length,
      },
    };
  }
  
  /**
   * Calculate risk metrics
   * 
   * @param {Array} valuations - Array of valuation records
   * @param {Object} asset - Asset object
   * @returns {Object} Risk assessment metrics
   */
  calculateRiskMetrics(valuations, asset) {
    if (!valuations || valuations.length < 10) {
      return { 
        riskLevel: 'UNKNOWN', 
        message: 'Insufficient data for risk assessment (need at least 10 valuations)' 
      };
    }
    
    const prices = valuations.map(v => parseFloat(v.price));
    
    // Calculate returns
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    
    // Standard deviation of returns (volatility)
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    // Max drawdown
    let maxDrawdown = 0;
    let peak = prices[0];
    for (const price of prices) {
      if (price > peak) peak = price;
      const drawdown = (peak - price) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    // Risk level classification
    let riskLevel = 'LOW';
    if (stdDev > RISK_THRESHOLDS.HIGH) riskLevel = 'HIGH';
    else if (stdDev > RISK_THRESHOLDS.MEDIUM) riskLevel = 'MEDIUM';
    
    return {
      riskLevel,
      volatility: parseFloat(stdDev.toFixed(4)),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(4)),
      maxDrawdownPercent: parseFloat((maxDrawdown * 100).toFixed(2)),
      sharpeRatio: meanReturn > 0 ? parseFloat((meanReturn / stdDev).toFixed(2)) : null,
      metadata: {
        dataPoints: prices.length,
        calculatedAt: new Date().toISOString(),
      },
    };
  }
  
  /**
   * Generate investment insights
   * 
   * @param {Object} asset - Asset object
   * @param {Object} performance - Performance metrics
   * @param {Object} priceAnalysis - Price trend analysis
   * @returns {Array} Array of insights
   */
  generateInvestmentInsights(asset, performance, priceAnalysis) {
    const insights = [];
    
    // Performance insights
    if (performance.percentageGain > 20) {
      insights.push({
        type: 'POSITIVE',
        category: 'PERFORMANCE',
        message: `Strong performance with ${performance.percentageGain.toFixed(2)}% gain`,
        recommendation: 'Consider taking partial profits',
      });
    } else if (performance.percentageGain < -10) {
      insights.push({
        type: 'WARNING',
        category: 'PERFORMANCE',
        message: `Asset is down ${Math.abs(performance.percentageGain).toFixed(2)}%`,
        recommendation: 'Review investment thesis and consider position',
      });
    }
    
    // Trend insights
    if (priceAnalysis.trend === 'UPWARD') {
      insights.push({
        type: 'POSITIVE',
        category: 'TREND',
        message: 'Price trend is positive',
        recommendation: 'Monitor for continued momentum',
      });
    } else if (priceAnalysis.trend === 'DOWNWARD') {
      insights.push({
        type: 'WARNING',
        category: 'TREND',
        message: 'Price trend is negative',
        recommendation: 'Consider risk management strategies',
      });
    }
    
    // Volatility insights
    if (priceAnalysis.volatilityPercent > 20) {
      insights.push({
        type: 'INFO',
        category: 'RISK',
        message: `High volatility (${priceAnalysis.volatilityPercent.toFixed(2)}%)`,
        recommendation: 'Suitable for risk-tolerant investors only',
      });
    }
    
    // Holding period insights
    if (performance.holdingDays < 30) {
      insights.push({
        type: 'INFO',
        category: 'STRATEGY',
        message: 'Recent investment - early stage',
        recommendation: 'Allow time for investment thesis to play out',
      });
    } else if (performance.holdingDays > 365) {
      insights.push({
        type: 'INFO',
        category: 'STRATEGY',
        message: 'Long-term holding (over 1 year)',
        recommendation: 'Review if still aligned with investment goals',
      });
    }
    
    return insights;
  }
}

// Export class for flexibility in testing and dependency injection
module.exports = AssetService;

// Export singleton instance as default
module.exports.default = new AssetService();
