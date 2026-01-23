/**
 * SLO/SLA Monitoring and Management
 * Defines and monitors Service Level Objectives and Agreements
 * 
 * Standards:
 * - Per-domain SLO definitions
 * - Real-time monitoring
 * - Alerting and reporting
 * - Compliance tracking
 * 
 * @module slo/manager
 */

/**
 * SLO Manager
 * Manages Service Level Objectives and Agreements across all domains
 */
export class SLOManager {
  constructor(config = {}) {
    this.config = {
      alertThresholds: config.alertThresholds || {
        warning: 0.95, // 95% of SLO
        critical: 0.90 // 90% of SLO
      },
      reportingInterval: config.reportingInterval || 3600000, // 1 hour
      ...config
    };

    this.slos = new Map();
    this.metrics = new Map();
    this.violations = [];
    this.reports = [];
  }

  /**
   * Define SLO for a domain
   * 
   * @param {string} domain - Domain name
   * @param {Object} sloDefinition - SLO definition
   */
  defineSLO(domain, sloDefinition) {
    this.slos.set(domain, {
      domain,
      ...sloDefinition,
      definedAt: Date.now()
    });

    // Initialize metrics tracking
    if (!this.metrics.has(domain)) {
      this.metrics.set(domain, {
        measurements: [],
        currentPeriod: {
          startTime: Date.now(),
          requests: 0,
          errors: 0,
          totalLatency: 0,
          p95Latency: 0,
          p99Latency: 0
        }
      });
    }
  }

  /**
   * Record a request measurement
   * 
   * @param {string} domain - Domain name
   * @param {Object} measurement - Request measurement
   */
  recordMeasurement(domain, measurement) {
    const metrics = this.metrics.get(domain);
    if (!metrics) {
      console.warn(`No metrics tracking for domain ${domain}`);
      return;
    }

    const { currentPeriod, measurements } = metrics;

    // Update current period metrics
    currentPeriod.requests++;
    if (measurement.error) {
      currentPeriod.errors++;
    }
    if (measurement.latency) {
      currentPeriod.totalLatency += measurement.latency;
      measurements.push({
        latency: measurement.latency,
        timestamp: Date.now()
      });
    }

    // Keep only last 1000 measurements for percentile calculation
    if (measurements.length > 1000) {
      measurements.shift();
    }

    // Calculate percentiles
    this.calculatePercentiles(domain);

    // Check SLO compliance
    this.checkCompliance(domain);
  }

  /**
   * Calculate latency percentiles
   * 
   * @param {string} domain - Domain name
   */
  calculatePercentiles(domain) {
    const metrics = this.metrics.get(domain);
    if (!metrics || metrics.measurements.length === 0) return;

    const latencies = metrics.measurements
      .map(m => m.latency)
      .sort((a, b) => a - b);

    const p95Index = Math.floor(latencies.length * 0.95);
    const p99Index = Math.floor(latencies.length * 0.99);

    metrics.currentPeriod.p95Latency = latencies[p95Index] || 0;
    metrics.currentPeriod.p99Latency = latencies[p99Index] || 0;
  }

  /**
   * Check SLO compliance for a domain
   * 
   * @param {string} domain - Domain name
   * @returns {Object} Compliance status
   */
  checkCompliance(domain) {
    const slo = this.slos.get(domain);
    const metrics = this.metrics.get(domain);

    if (!slo || !metrics) {
      return { compliant: true, reason: 'NO_SLO_DEFINED' };
    }

    const { currentPeriod } = metrics;
    const violations = [];

    // Check availability SLO
    if (slo.availability) {
      const currentAvailability = currentPeriod.requests > 0
        ? ((currentPeriod.requests - currentPeriod.errors) / currentPeriod.requests) * 100
        : 100;

      if (currentAvailability < slo.availability) {
        violations.push({
          type: 'AVAILABILITY',
          expected: slo.availability,
          actual: currentAvailability,
          severity: currentAvailability < (slo.availability * this.config.alertThresholds.critical)
            ? 'CRITICAL'
            : 'WARNING'
        });
      }
    }

    // Check latency SLO (p95)
    if (slo.latencyP95) {
      if (currentPeriod.p95Latency > slo.latencyP95) {
        violations.push({
          type: 'LATENCY_P95',
          expected: slo.latencyP95,
          actual: currentPeriod.p95Latency,
          severity: currentPeriod.p95Latency > (slo.latencyP95 * 1.5)
            ? 'CRITICAL'
            : 'WARNING'
        });
      }
    }

    // Check latency SLO (p99)
    if (slo.latencyP99) {
      if (currentPeriod.p99Latency > slo.latencyP99) {
        violations.push({
          type: 'LATENCY_P99',
          expected: slo.latencyP99,
          actual: currentPeriod.p99Latency,
          severity: currentPeriod.p99Latency > (slo.latencyP99 * 1.5)
            ? 'CRITICAL'
            : 'WARNING'
        });
      }
    }

    // Check error rate SLO
    if (slo.errorRate) {
      const currentErrorRate = currentPeriod.requests > 0
        ? (currentPeriod.errors / currentPeriod.requests) * 100
        : 0;

      if (currentErrorRate > slo.errorRate) {
        violations.push({
          type: 'ERROR_RATE',
          expected: slo.errorRate,
          actual: currentErrorRate,
          severity: currentErrorRate > (slo.errorRate * 2)
            ? 'CRITICAL'
            : 'WARNING'
        });
      }
    }

    // Record violations
    if (violations.length > 0) {
      this.recordViolation(domain, violations);
    }

    return {
      compliant: violations.length === 0,
      violations,
      timestamp: Date.now()
    };
  }

  /**
   * Record SLO violation
   * 
   * @param {string} domain - Domain name
   * @param {Array} violations - List of violations
   */
  recordViolation(domain, violations) {
    const violation = {
      domain,
      violations,
      timestamp: Date.now(),
      acknowledged: false
    };

    this.violations.push(violation);

    // Keep only last 1000 violations
    if (this.violations.length > 1000) {
      this.violations.shift();
    }

    // Trigger alerts for critical violations
    const criticalViolations = violations.filter(v => v.severity === 'CRITICAL');
    if (criticalViolations.length > 0) {
      this.triggerAlert(domain, criticalViolations);
    }
  }

  /**
   * Trigger alert for SLO violation
   * 
   * @param {string} domain - Domain name
   * @param {Array} violations - Critical violations
   */
  triggerAlert(domain, violations) {
    // In production, integrate with alerting system (PagerDuty, Slack, etc.)
    console.error(`[SLO ALERT] Critical violations detected in ${domain}:`, violations);
  }

  /**
   * Generate SLO report for a domain
   * 
   * @param {string} domain - Domain name
   * @param {Object} options - Report options
   * @returns {Object} SLO report
   */
  generateReport(domain, options = {}) {
    const slo = this.slos.get(domain);
    const metrics = this.metrics.get(domain);

    if (!slo || !metrics) {
      return {
        domain,
        error: 'NO_DATA_AVAILABLE',
        timestamp: Date.now()
      };
    }

    const { currentPeriod } = metrics;
    const currentAvailability = currentPeriod.requests > 0
      ? ((currentPeriod.requests - currentPeriod.errors) / currentPeriod.requests) * 100
      : 100;

    const currentErrorRate = currentPeriod.requests > 0
      ? (currentPeriod.errors / currentPeriod.requests) * 100
      : 0;

    const avgLatency = currentPeriod.requests > 0
      ? currentPeriod.totalLatency / currentPeriod.requests
      : 0;

    const domainViolations = this.violations.filter(v => v.domain === domain);

    const report = {
      domain,
      period: {
        startTime: currentPeriod.startTime,
        endTime: Date.now(),
        duration: Date.now() - currentPeriod.startTime
      },
      slo: {
        availability: slo.availability,
        latencyP95: slo.latencyP95,
        latencyP99: slo.latencyP99,
        errorRate: slo.errorRate
      },
      actual: {
        availability: currentAvailability,
        latencyP95: currentPeriod.p95Latency,
        latencyP99: currentPeriod.p99Latency,
        latencyAvg: avgLatency,
        errorRate: currentErrorRate
      },
      metrics: {
        totalRequests: currentPeriod.requests,
        totalErrors: currentPeriod.errors,
        successRate: currentAvailability
      },
      compliance: {
        availability: currentAvailability >= (slo.availability || 100),
        latencyP95: currentPeriod.p95Latency <= (slo.latencyP95 || Infinity),
        latencyP99: currentPeriod.p99Latency <= (slo.latencyP99 || Infinity),
        errorRate: currentErrorRate <= (slo.errorRate || 100)
      },
      violations: domainViolations.length,
      criticalViolations: domainViolations.filter(v =>
        v.violations.some(viol => viol.severity === 'CRITICAL')
      ).length,
      timestamp: Date.now()
    };

    this.reports.push(report);
    return report;
  }

  /**
   * Get all defined SLOs
   * 
   * @returns {Array} List of SLOs
   */
  getAllSLOs() {
    return Array.from(this.slos.values());
  }

  /**
   * Get compliance status for all domains
   * 
   * @returns {Object} Compliance status
   */
  getOverallCompliance() {
    const domains = Array.from(this.slos.keys());
    const compliance = {};

    for (const domain of domains) {
      compliance[domain] = this.checkCompliance(domain);
    }

    const allCompliant = Object.values(compliance).every(c => c.compliant);
    const totalViolations = Object.values(compliance).reduce(
      (sum, c) => sum + (c.violations?.length || 0), 0
    );

    return {
      compliant: allCompliant,
      domains: compliance,
      totalViolations,
      timestamp: Date.now()
    };
  }

  /**
   * Reset metrics for a domain
   * 
   * @param {string} domain - Domain name
   */
  resetMetrics(domain) {
    const metrics = this.metrics.get(domain);
    if (metrics) {
      metrics.currentPeriod = {
        startTime: Date.now(),
        requests: 0,
        errors: 0,
        totalLatency: 0,
        p95Latency: 0,
        p99Latency: 0
      };
      metrics.measurements = [];
    }
  }

  /**
   * Get statistics
   * 
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      totalSLOs: this.slos.size,
      totalViolations: this.violations.length,
      criticalViolations: this.violations.filter(v =>
        v.violations.some(viol => viol.severity === 'CRITICAL')
      ).length,
      reportsGenerated: this.reports.length
    };
  }
}

// Default SLO definitions for TEC domains
export const defaultSLOs = {
  // Critical financial domains
  assets: {
    availability: 99.99, // 4 nines
    latencyP95: 100, // 100ms
    latencyP99: 500, // 500ms
    errorRate: 0.01 // 0.01%
  },
  fundx: {
    availability: 99.99,
    latencyP95: 100,
    latencyP99: 500,
    errorRate: 0.01
  },
  nbf: {
    availability: 99.99,
    latencyP95: 100,
    latencyP99: 500,
    errorRate: 0.01
  },
  commerce: {
    availability: 99.95,
    latencyP95: 200,
    latencyP99: 1000,
    errorRate: 0.1
  },
  // Standard domains
  system: {
    availability: 99.9,
    latencyP95: 150,
    latencyP99: 750,
    errorRate: 0.1
  },
  nexus: {
    availability: 99.95,
    latencyP95: 50,
    latencyP99: 200,
    errorRate: 0.05
  },
  analytics: {
    availability: 99.5,
    latencyP95: 500,
    latencyP99: 2000,
    errorRate: 0.5
  }
};

// Export singleton instance with default SLOs
export const sloManager = new SLOManager();

// Initialize default SLOs
Object.entries(defaultSLOs).forEach(([domain, slo]) => {
  sloManager.defineSLO(domain, slo);
});

export default SLOManager;
