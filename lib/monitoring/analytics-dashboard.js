/**
 * Comprehensive Analytics Dashboard Service
 * Provides real-time analytics across all TEC domains
 * 
 * Features:
 * - Real-time metrics aggregation
 * - Business intelligence analytics
 * - Performance monitoring
 * - User behavior tracking
 * - Financial metrics
 * 
 * @module monitoring/analytics-dashboard
 */

/**
 * Analytics Dashboard Manager
 * Aggregates and provides analytics data across all domains
 */
export class AnalyticsDashboard {
  constructor(config = {}) {
    this.config = {
      aggregationInterval: config.aggregationInterval || 60000, // 1 minute
      retentionPeriod: config.retentionPeriod || 2592000000, // 30 days
      realTimeEnabled: config.realTimeEnabled !== false,
      ...config
    };

    this.metrics = new Map();
    this.aggregatedData = new Map();
    this.alerts = [];
    this.dashboards = new Map();
    
    // Initialize default dashboards
    this.initializeDefaultDashboards();
  }

  /**
   * Initialize default dashboard configurations
   */
  initializeDefaultDashboards() {
    // Executive Dashboard
    this.registerDashboard('executive', {
      name: 'Executive Overview',
      widgets: [
        { type: 'revenue', title: 'Total Revenue', domains: ['all'] },
        { type: 'users', title: 'Active Users', domains: ['system'] },
        { type: 'transactions', title: 'Transaction Volume', domains: ['nbf', 'commerce'] },
        { type: 'growth', title: 'Growth Rate', domains: ['all'] }
      ]
    });

    // Operations Dashboard
    this.registerDashboard('operations', {
      name: 'Operations Monitoring',
      widgets: [
        { type: 'availability', title: 'System Availability', domains: ['all'] },
        { type: 'latency', title: 'Response Times', domains: ['all'] },
        { type: 'errors', title: 'Error Rates', domains: ['all'] },
        { type: 'throughput', title: 'Request Throughput', domains: ['all'] }
      ]
    });

    // Financial Dashboard
    this.registerDashboard('financial', {
      name: 'Financial Analytics',
      widgets: [
        { type: 'portfolio', title: 'Portfolio Value', domains: ['assets', 'fundx'] },
        { type: 'investments', title: 'Investment Performance', domains: ['fundx'] },
        { type: 'revenue', title: 'Revenue Streams', domains: ['commerce', 'nbf'] },
        { type: 'roi', title: 'Return on Investment', domains: ['fundx'] }
      ]
    });

    // Domain-Specific Dashboards
    this.registerDashboard('assets', {
      name: 'Assets Management',
      widgets: [
        { type: 'totalValue', title: 'Total Assets Under Management' },
        { type: 'assetAllocation', title: 'Asset Allocation' },
        { type: 'performance', title: 'Portfolio Performance' },
        { type: 'transactions', title: 'Recent Transactions' }
      ]
    });

    this.registerDashboard('fundx', {
      name: 'FundX Investment Platform',
      widgets: [
        { type: 'aum', title: 'Assets Under Management' },
        { type: 'strategies', title: 'Active Strategies' },
        { type: 'returns', title: 'Investment Returns' },
        { type: 'investors', title: 'Active Investors' }
      ]
    });

    this.registerDashboard('commerce', {
      name: 'Commerce Analytics',
      widgets: [
        { type: 'sales', title: 'Total Sales' },
        { type: 'orders', title: 'Order Volume' },
        { type: 'conversion', title: 'Conversion Rate' },
        { type: 'topProducts', title: 'Top Products' }
      ]
    });
  }

  /**
   * Register a custom dashboard
   * 
   * @param {string} dashboardId - Dashboard identifier
   * @param {Object} config - Dashboard configuration
   */
  registerDashboard(dashboardId, config) {
    this.dashboards.set(dashboardId, {
      id: dashboardId,
      ...config,
      createdAt: Date.now()
    });
  }

  /**
   * Record metric data point
   * 
   * @param {string} domain - Domain name
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   * @param {Object} metadata - Additional metadata
   */
  recordMetric(domain, metric, value, metadata = {}) {
    const key = `${domain}:${metric}`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        domain,
        metric,
        dataPoints: []
      });
    }

    const metricData = this.metrics.get(key);
    metricData.dataPoints.push({
      value,
      timestamp: Date.now(),
      metadata
    });

    // Limit data points per metric
    if (metricData.dataPoints.length > 10000) {
      metricData.dataPoints.shift();
    }

    // Trigger real-time update
    if (this.config.realTimeEnabled) {
      this.emitRealTimeUpdate(domain, metric, value);
    }
  }

  /**
   * Get dashboard data
   * 
   * @param {string} dashboardId - Dashboard identifier
   * @param {Object} options - Query options
   * @returns {Object} Dashboard data
   */
  async getDashboardData(dashboardId, options = {}) {
    const dashboard = this.dashboards.get(dashboardId);
    
    if (!dashboard) {
      return {
        error: 'DASHBOARD_NOT_FOUND',
        dashboardId
      };
    }

    const { timeRange = '24h', refresh = false } = options;

    // Check cache unless refresh is requested
    if (!refresh) {
      const cached = this.getCachedDashboard(dashboardId, timeRange);
      if (cached) {
        return { ...cached, fromCache: true };
      }
    }

    // Build dashboard data
    const data = {
      id: dashboardId,
      name: dashboard.name,
      timeRange,
      widgets: [],
      generatedAt: Date.now()
    };

    // Populate each widget
    for (const widget of dashboard.widgets) {
      const widgetData = await this.getWidgetData(
        widget,
        dashboard.domains || widget.domains,
        timeRange
      );
      data.widgets.push(widgetData);
    }

    // Calculate overall metrics
    data.summary = this.calculateDashboardSummary(data.widgets);

    // Cache the result
    this.cacheDashboard(dashboardId, timeRange, data);

    return data;
  }

  /**
   * Get widget data
   * 
   * @param {Object} widget - Widget configuration
   * @param {Array} domains - Domains to query
   * @param {string} timeRange - Time range
   * @returns {Promise<Object>} Widget data
   */
  async getWidgetData(widget, domains, timeRange) {
    const { type, title } = widget;
    const timeRangeMs = this.parseTimeRange(timeRange);
    const startTime = Date.now() - timeRangeMs;

    const data = {
      type,
      title,
      domains,
      data: null,
      trend: null
    };

    switch (type) {
      case 'revenue':
        data.data = await this.calculateRevenue(domains, startTime);
        data.trend = await this.calculateTrend(domains, 'revenue', timeRangeMs);
        break;

      case 'users':
        data.data = await this.calculateActiveUsers(domains, startTime);
        data.trend = await this.calculateTrend(domains, 'users', timeRangeMs);
        break;

      case 'transactions':
        data.data = await this.calculateTransactions(domains, startTime);
        data.trend = await this.calculateTrend(domains, 'transactions', timeRangeMs);
        break;

      case 'availability':
        data.data = await this.calculateAvailability(domains, startTime);
        break;

      case 'latency':
        data.data = await this.calculateLatency(domains, startTime);
        break;

      case 'errors':
        data.data = await this.calculateErrors(domains, startTime);
        break;

      case 'portfolio':
        data.data = await this.calculatePortfolioValue(domains, startTime);
        data.trend = await this.calculateTrend(domains, 'portfolio', timeRangeMs);
        break;

      default:
        data.data = await this.getGenericMetric(domains, type, startTime);
    }

    return data;
  }

  /**
   * Calculate revenue across domains
   * 
   * @param {Array} domains - Domains to calculate
   * @param {number} startTime - Start timestamp
   * @returns {Promise<Object>} Revenue data
   */
  async calculateRevenue(domains, startTime) {
    // Mock implementation - replace with actual database queries
    const total = 1250000; // $1.25M
    const breakdown = {
      commerce: 450000,
      fundx: 350000,
      nbf: 250000,
      others: 200000
    };

    return {
      total,
      breakdown,
      currency: 'USD',
      period: {
        start: startTime,
        end: Date.now()
      }
    };
  }

  /**
   * Calculate active users
   * 
   * @param {Array} domains - Domains to calculate
   * @param {number} startTime - Start timestamp
   * @returns {Promise<Object>} User data
   */
  async calculateActiveUsers(domains, startTime) {
    // Mock implementation
    return {
      total: 15420,
      new: 342,
      returning: 15078,
      breakdown: {
        daily: 8500,
        weekly: 12000,
        monthly: 15420
      }
    };
  }

  /**
   * Calculate transaction volume
   * 
   * @param {Array} domains - Domains to calculate
   * @param {number} startTime - Start timestamp
   * @returns {Promise<Object>} Transaction data
   */
  async calculateTransactions(domains, startTime) {
    // Mock implementation
    return {
      total: 45320,
      successful: 44890,
      failed: 430,
      successRate: 99.05,
      averageValue: 275.50,
      totalValue: 12485060
    };
  }

  /**
   * Calculate system availability
   * 
   * @param {Array} domains - Domains to calculate
   * @param {number} startTime - Start timestamp
   * @returns {Promise<Object>} Availability data
   */
  async calculateAvailability(domains, startTime) {
    const domainAvailability = {};
    let totalAvailability = 0;
    let domainCount = 0;

    for (const domain of domains === 'all' ? ['assets', 'fundx', 'commerce', 'nbf'] : domains) {
      // Mock calculation - replace with actual uptime data
      const availability = 99.95 + (Math.random() * 0.1 - 0.05);
      domainAvailability[domain] = availability;
      totalAvailability += availability;
      domainCount++;
    }

    return {
      overall: totalAvailability / domainCount,
      byDomain: domainAvailability,
      sloTarget: 99.9
    };
  }

  /**
   * Calculate latency metrics
   * 
   * @param {Array} domains - Domains to calculate
   * @param {number} startTime - Start timestamp
   * @returns {Promise<Object>} Latency data
   */
  async calculateLatency(domains, startTime) {
    // Mock implementation
    return {
      p50: 45,
      p95: 120,
      p99: 380,
      average: 75,
      byDomain: {
        assets: { p50: 40, p95: 95, p99: 250 },
        fundx: { p50: 42, p95: 110, p99: 320 },
        commerce: { p50: 55, p95: 150, p99: 450 },
        nbf: { p50: 38, p95: 85, p99: 200 }
      }
    };
  }

  /**
   * Calculate error rates
   * 
   * @param {Array} domains - Domains to calculate
   * @param {number} startTime - Start timestamp
   * @returns {Promise<Object>} Error data
   */
  async calculateErrors(domains, startTime) {
    // Mock implementation
    return {
      total: 235,
      rate: 0.52, // 0.52%
      byType: {
        '4xx': 180,
        '5xx': 55
      },
      byDomain: {
        assets: 45,
        fundx: 38,
        commerce: 95,
        nbf: 32,
        others: 25
      }
    };
  }

  /**
   * Calculate portfolio value
   * 
   * @param {Array} domains - Domains to calculate
   * @param {number} startTime - Start timestamp
   * @returns {Promise<Object>} Portfolio data
   */
  async calculatePortfolioValue(domains, startTime) {
    // Mock implementation
    return {
      totalValue: 45000000, // $45M
      breakdown: {
        stocks: 25000000,
        bonds: 10000000,
        crypto: 5000000,
        realEstate: 5000000
      },
      performance: {
        day: 1.2,
        week: 3.5,
        month: 8.7,
        year: 24.3
      }
    };
  }

  /**
   * Calculate trend for a metric
   * 
   * @param {Array} domains - Domains to analyze
   * @param {string} metric - Metric name
   * @param {number} timeRange - Time range in ms
   * @returns {Promise<Object>} Trend data
   */
  async calculateTrend(domains, metric, timeRange) {
    // Mock implementation - replace with actual trend calculation
    const change = Math.random() * 20 - 5; // -5% to +15%
    
    return {
      percentage: change,
      direction: change >= 0 ? 'up' : 'down',
      comparison: 'previous_period'
    };
  }

  /**
   * Get generic metric data
   * 
   * @param {Array} domains - Domains to query
   * @param {string} metric - Metric type
   * @param {number} startTime - Start timestamp
   * @returns {Promise<Object>} Metric data
   */
  async getGenericMetric(domains, metric, startTime) {
    const data = {
      value: 0,
      count: 0,
      average: 0
    };

    for (const domain of domains === 'all' ? Array.from(this.metrics.keys()).map(k => k.split(':')[0]) : domains) {
      const key = `${domain}:${metric}`;
      const metricData = this.metrics.get(key);
      
      if (metricData) {
        const relevantPoints = metricData.dataPoints.filter(
          dp => dp.timestamp >= startTime
        );
        
        if (relevantPoints.length > 0) {
          const sum = relevantPoints.reduce((acc, dp) => acc + dp.value, 0);
          data.value += sum;
          data.count += relevantPoints.length;
        }
      }
    }

    if (data.count > 0) {
      data.average = data.value / data.count;
    }

    return data;
  }

  /**
   * Calculate dashboard summary
   * 
   * @param {Array} widgets - Widget data
   * @returns {Object} Summary
   */
  calculateDashboardSummary(widgets) {
    const summary = {
      totalWidgets: widgets.length,
      healthStatus: 'healthy',
      criticalIssues: 0,
      warnings: 0
    };

    for (const widget of widgets) {
      // Check for critical issues
      if (widget.type === 'availability' && widget.data?.overall < 99.0) {
        summary.criticalIssues++;
        summary.healthStatus = 'critical';
      }
      
      if (widget.type === 'errors' && widget.data?.rate > 1.0) {
        summary.warnings++;
        if (summary.healthStatus === 'healthy') {
          summary.healthStatus = 'warning';
        }
      }
    }

    return summary;
  }

  /**
   * Parse time range string to milliseconds
   * 
   * @param {string} timeRange - Time range (e.g., '24h', '7d', '30d')
   * @returns {number} Time range in milliseconds
   */
  parseTimeRange(timeRange) {
    const match = timeRange.match(/^(\d+)([hdwm])$/);
    if (!match) return 86400000; // Default 24h

    const [, value, unit] = match;
    const multipliers = {
      h: 3600000, // hours
      d: 86400000, // days
      w: 604800000, // weeks
      m: 2592000000 // months (30 days)
    };

    return parseInt(value) * (multipliers[unit] || 86400000);
  }

  /**
   * Cache dashboard data
   * 
   * @param {string} dashboardId - Dashboard identifier
   * @param {string} timeRange - Time range
   * @param {Object} data - Dashboard data
   */
  cacheDashboard(dashboardId, timeRange, data) {
    const key = `${dashboardId}:${timeRange}`;
    this.aggregatedData.set(key, {
      data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + this.config.aggregationInterval
    });
  }

  /**
   * Get cached dashboard data
   * 
   * @param {string} dashboardId - Dashboard identifier
   * @param {string} timeRange - Time range
   * @returns {Object|null} Cached data
   */
  getCachedDashboard(dashboardId, timeRange) {
    const key = `${dashboardId}:${timeRange}`;
    const cached = this.aggregatedData.get(key);
    
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
      this.aggregatedData.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Emit real-time update
   * 
   * @param {string} domain - Domain name
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   */
  emitRealTimeUpdate(domain, metric, value) {
    // In production, use WebSocket or Server-Sent Events
    console.log(`[REALTIME] ${domain}:${metric} = ${value}`);
  }

  /**
   * Get list of available dashboards
   * 
   * @returns {Array} Dashboard list
   */
  getAvailableDashboards() {
    return Array.from(this.dashboards.values()).map(dashboard => ({
      id: dashboard.id,
      name: dashboard.name,
      widgetCount: dashboard.widgets.length
    }));
  }

  /**
   * Get analytics statistics
   * 
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      totalMetrics: this.metrics.size,
      totalDashboards: this.dashboards.size,
      cachedDashboards: this.aggregatedData.size,
      alerts: this.alerts.length
    };
  }
}

// Export singleton instance
export const analyticsDashboard = new AnalyticsDashboard({
  aggregationInterval: 60000,
  retentionPeriod: 2592000000,
  realTimeEnabled: true
});

export default AnalyticsDashboard;
