/**
 * Domain Health Configuration
 * Health check and monitoring settings for all 24 domains
 * 
 * @module config/domain-health
 * @version 1.0.0
 * @governance TEC Council Approved
 * @compliance ISO27001, SOC2, GDPR
 */

/**
 * Global health check settings
 * Applied to all domains unless overridden
 */
export const domainHealthConfig = {
  // ========================================
  // GLOBAL SETTINGS
  // ========================================
  globalSettings: {
    checkInterval: 30, // seconds
    timeout: 5000, // milliseconds
    retries: 3,
    alertThreshold: 2, // consecutive failures
  },

  // ========================================
  // HEALTH CHECK ENDPOINTS
  // ========================================
  endpoints: {
    health: "/api/health",
    ready: "/api/ready",
    metrics: "/api/metrics",
  },

  // ========================================
  // HEALTH THRESHOLDS
  // ========================================
  thresholds: {
    responseTime: {
      healthy: 200,
      warning: 500,
      critical: 1000,
    },
    errorRate: {
      healthy: 0.1,
      warning: 1,
      critical: 5,
    },
  },

  // ========================================
  // DOMAIN-SPECIFIC OVERRIDES
  // ========================================
  domainOverrides: {
    // Tier 1 domains (critical infrastructure)
    "fundx.pi": {
      checkInterval: 15, // More frequent checks
      alertThreshold: 1, // Immediate alerts
    },
    "commerce.pi": {
      checkInterval: 15,
      alertThreshold: 1,
    },
    "explorer.pi": {
      checkInterval: 15,
      alertThreshold: 1,
    },
    "nexus.pi": {
      checkInterval: 15,
      alertThreshold: 1,
    },
    "tec.pi": {
      checkInterval: 10, // Most frequent checks
      alertThreshold: 1,
    },

    // Tier 2 domains (strategic)
    "assets.pi": {
      checkInterval: 20,
    },
    "nbf.pi": {
      checkInterval: 20,
    },
    "vip.pi": {
      checkInterval: 20,
    },
    "elite.pi": {
      checkInterval: 20,
    },
    "titan.pi": {
      checkInterval: 20,
    },

    // Tier 3 domains use default settings
  },

  // ========================================
  // ALERT CONFIGURATION
  // ========================================
  alerts: {
    enabled: true,
    channels: ["email", "slack", "pagerduty"],
    escalation: {
      level1: {
        threshold: 1, // failures
        channels: ["slack"],
        recipients: ["ops-team"],
      },
      level2: {
        threshold: 3,
        channels: ["email", "slack"],
        recipients: ["ops-team", "engineering"],
      },
      level3: {
        threshold: 5,
        channels: ["email", "slack", "pagerduty"],
        recipients: ["ops-team", "engineering", "management"],
      },
    },
  },

  // ========================================
  // MONITORING METRICS
  // ========================================
  metrics: {
    collect: true,
    retention: 90, // days
    aggregation: "minute",
    tracked: [
      "response_time",
      "error_rate",
      "uptime",
      "request_count",
      "cpu_usage",
      "memory_usage",
      "disk_usage",
    ],
  },

  // ========================================
  // RECOVERY ACTIONS
  // ========================================
  recovery: {
    autoRestart: {
      enabled: true,
      maxAttempts: 3,
      cooldownPeriod: 300, // seconds
    },
    failover: {
      enabled: true,
      automaticFailover: true,
      failbackDelay: 600, // seconds
    },
    circuitBreaker: {
      enabled: true,
      threshold: 5,
      timeout: 60,
      halfOpenRequests: 3,
    },
  },

  // ========================================
  // REPORTING
  // ========================================
  reporting: {
    dailyReport: {
      enabled: true,
      time: "09:00",
      recipients: ["ops-team"],
    },
    weeklyReport: {
      enabled: true,
      day: "monday",
      time: "10:00",
      recipients: ["engineering", "management"],
    },
    monthlyReport: {
      enabled: true,
      day: 1,
      time: "10:00",
      recipients: ["engineering", "management", "governance"],
    },
  },
};

/**
 * High priority domain check interval threshold (seconds)
 * Domains with check intervals at or below this value are considered high priority
 */
const HIGH_PRIORITY_THRESHOLD = 15;

/**
 * Get health check interval for a specific domain
 * @param {string} domain - The .pi domain name
 * @returns {number} Check interval in seconds
 */
export function getCheckInterval(domain) {
  return (
    domainHealthConfig.domainOverrides[domain]?.checkInterval ||
    domainHealthConfig.globalSettings.checkInterval
  );
}

/**
 * Get alert threshold for a specific domain
 * @param {string} domain - The .pi domain name
 * @returns {number} Alert threshold (consecutive failures)
 */
export function getAlertThreshold(domain) {
  return (
    domainHealthConfig.domainOverrides[domain]?.alertThreshold ||
    domainHealthConfig.globalSettings.alertThreshold
  );
}

/**
 * Determine health status based on response time
 * @param {number} responseTime - Response time in milliseconds
 * @returns {string} Health status: "healthy", "warning", or "critical"
 */
export function getHealthStatus(responseTime) {
  const thresholds = domainHealthConfig.thresholds.responseTime;
  if (responseTime <= thresholds.healthy) return "healthy";
  if (responseTime <= thresholds.warning) return "warning";
  return "critical";
}

/**
 * Check if domain requires immediate alerting
 * @param {string} domain - The .pi domain name
 * @returns {boolean} Whether immediate alerting is enabled
 */
export function requiresImmediateAlert(domain) {
  return getAlertThreshold(domain) === 1;
}

/**
 * Get all domains requiring frequent health checks
 * @returns {Array<string>} Array of domain names
 */
export function getHighPriorityDomains() {
  return Object.entries(domainHealthConfig.domainOverrides)
    .filter(([_, config]) => config.checkInterval <= HIGH_PRIORITY_THRESHOLD)
    .map(([domain]) => domain);
}

export default domainHealthConfig;
