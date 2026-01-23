/**
 * TEC Assistant Governance Layer
 * Implements sovereign AI governance with domain independence
 * 
 * Core Principles:
 * - Advise, analyze, recommend only - never execute irreversibly
 * - Domain sovereignty - no cross-domain access without governance
 * - Zero-Trust assumptions
 * - Event-based, non-intrusive signaling
 * - Decision Dashboard output (not raw analytics)
 * 
 * @module lib/assistant/governance
 */

import { zeroTrust } from '../security/zero-trust.js';
import { sloManager } from '../slo/manager.js';
import { analyticsDashboard } from '../monitoring/analytics-dashboard.js';

/**
 * TEC Assistant Governance Manager
 * Ensures AI operates within governed boundaries
 */
export class TECAssistantGovernance {
  constructor(config = {}) {
    this.config = {
      languageDetectionEnabled: config.languageDetectionEnabled !== false,
      domainSovereigntyEnabled: config.domainSovereigntyEnabled !== false,
      behaviorTrackingEnabled: config.behaviorTrackingEnabled || false, // Disabled by default
      marketingAnalyticsEnabled: config.marketingAnalyticsEnabled || false, // Disabled by default
      ...config
    };

    this.approvedInsights = new Map();
    this.governanceLog = [];
  }

  /**
   * Process user request through governance layer
   * 
   * @param {string} userId - User identifier
   * @param {string} message - User message
   * @param {Object} context - Request context
   * @returns {Promise<Object>} Governed response
   */
  async processGovernedRequest(userId, message, context = {}) {
    // Step 1: Detect language
    const language = this.detectLanguage(message);

    // Step 2: Zero-Trust verification
    const securityCheck = await this.verifySecurityContext(userId, context);
    if (!securityCheck.passed) {
      return this.createSecurityDenialResponse(language, securityCheck);
    }

    // Step 3: Analyze intent with domain sovereignty
    const intentAnalysis = await this.analyzeIntent(message, context);

    // Step 4: Check domain governance approval
    const governanceApproval = await this.checkDomainGovernance(
      userId,
      intentAnalysis.targetDomains,
      context
    );

    if (!governanceApproval.approved) {
      return this.createGovernanceDenialResponse(language, governanceApproval);
    }

    // Step 5: Generate governed insights
    const insights = await this.generateGovernedInsights(
      userId,
      intentAnalysis,
      context
    );

    // Step 6: Format for Decision Dashboard (not raw analytics)
    const decisionDashboard = this.formatForDecisionDashboard(insights, language);

    // Step 7: Log governance action
    this.logGovernanceAction({
      userId,
      message,
      language,
      intentAnalysis,
      governanceApproval,
      timestamp: Date.now()
    });

    return {
      success: true,
      language,
      responseType: 'advisory', // Always advisory, never executable
      dashboard: decisionDashboard,
      insights,
      governance: {
        approved: true,
        domains: governanceApproval.approvedDomains,
        restrictions: governanceApproval.restrictions
      }
    };
  }

  /**
   * Detect message language (Arabic or English)
   * 
   * @param {string} message - User message
   * @returns {string} Detected language ('ar' or 'en')
   */
  detectLanguage(message) {
    if (!this.config.languageDetectionEnabled) {
      return 'en'; // Default to English
    }

    // Arabic character detection (Unicode ranges)
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const hasArabic = arabicPattern.test(message);
    
    // Count Arabic vs English characters
    const arabicChars = (message.match(arabicPattern) || []).length;
    const totalChars = message.replace(/\s/g, '').length;
    
    // If more than 30% Arabic characters, consider it Arabic
    return (arabicChars / totalChars) > 0.3 ? 'ar' : 'en';
  }

  /**
   * Verify security context with Zero-Trust
   * 
   * @param {string} userId - User identifier
   * @param {Object} context - Request context
   * @returns {Promise<Object>} Security verification result
   */
  async verifySecurityContext(userId, context) {
    try {
      const verification = await zeroTrust.verifyRequest({
        userId,
        sessionId: context.sessionId,
        ip: context.ip,
        headers: context.headers,
        endpoint: '/api/tec/assistant',
        resource: 'assistant',
        action: 'query',
        domain: 'tec'
      });

      return {
        passed: verification.passed,
        riskScore: verification.riskScore,
        issues: verification.results.filter(r => !r.passed)
      };
    } catch (error) {
      return {
        passed: false,
        riskScore: 100,
        issues: [{ reason: 'VERIFICATION_FAILED', message: error.message }]
      };
    }
  }

  /**
   * Analyze user intent and identify target domains
   * 
   * @param {string} message - User message
   * @param {Object} context - Request context
   * @returns {Promise<Object>} Intent analysis
   */
  async analyzeIntent(message, context) {
    const lowerMessage = message.toLowerCase();
    const targetDomains = [];
    const intent = {
      type: 'inquiry',
      requiresData: false,
      requiresAction: false
    };

    // Domain keyword mapping
    const domainKeywords = {
      assets: ['portfolio', 'asset', 'investment', 'holdings'],
      fundx: ['fund', 'strategy', 'returns', 'invest'],
      commerce: ['order', 'purchase', 'buy', 'seller'],
      nbf: ['bank', 'account', 'transfer', 'payment'],
      estate: ['property', 'real estate', 'villa', 'apartment'],
      analytics: ['analytics', 'dashboard', 'metrics', 'report']
    };

    // Identify target domains
    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        targetDomains.push(domain);
      }
    }

    // Determine intent type
    if (lowerMessage.includes('show') || lowerMessage.includes('view') || 
        lowerMessage.includes('display') || lowerMessage.includes('see')) {
      intent.type = 'data_request';
      intent.requiresData = true;
    } else if (lowerMessage.includes('create') || lowerMessage.includes('update') ||
               lowerMessage.includes('delete') || lowerMessage.includes('buy')) {
      intent.type = 'action_request';
      intent.requiresAction = true;
    }

    return {
      originalMessage: message,
      intent,
      targetDomains: targetDomains.length > 0 ? targetDomains : ['system'],
      confidence: targetDomains.length > 0 ? 0.8 : 0.5
    };
  }

  /**
   * Check domain governance approval
   * 
   * @param {string} userId - User identifier
   * @param {Array} targetDomains - Domains to access
   * @param {Object} context - Request context
   * @returns {Promise<Object>} Governance approval result
   */
  async checkDomainGovernance(userId, targetDomains, context) {
    if (!this.config.domainSovereigntyEnabled) {
      return {
        approved: true,
        approvedDomains: targetDomains,
        restrictions: []
      };
    }

    const approvedDomains = [];
    const deniedDomains = [];
    const restrictions = [];

    for (const domain of targetDomains) {
      // Check if user has permission for this domain
      const hasPermission = await zeroTrust.checkPermission(
        context.userRole || 'STANDARD',
        `${domain}:*:read`
      );

      if (hasPermission) {
        // Check domain SLO compliance
        const sloCompliance = sloManager.checkCompliance(domain);
        
        if (sloCompliance.compliant) {
          approvedDomains.push(domain);
        } else {
          deniedDomains.push(domain);
          restrictions.push({
            domain,
            reason: 'SLO_VIOLATION',
            message: `Domain ${domain} is not meeting SLO requirements`
          });
        }
      } else {
        deniedDomains.push(domain);
        restrictions.push({
          domain,
          reason: 'PERMISSION_DENIED',
          message: `Insufficient permissions for domain ${domain}`
        });
      }
    }

    return {
      approved: approvedDomains.length > 0,
      approvedDomains,
      deniedDomains,
      restrictions
    };
  }

  /**
   * Generate governed insights (only approved data)
   * 
   * @param {string} userId - User identifier
   * @param {Object} intentAnalysis - Intent analysis
   * @param {Object} context - Request context
   * @returns {Promise<Object>} Governed insights
   */
  async generateGovernedInsights(userId, intentAnalysis, context) {
    const insights = {
      type: 'advisory',
      domains: [],
      recommendations: [],
      warnings: []
    };

    // Only provide insights for approved domains
    for (const domain of intentAnalysis.targetDomains) {
      try {
        // Check if insights are governance-approved
        const approved = this.isInsightApproved(domain, intentAnalysis.intent.type);
        
        if (approved) {
          const domainInsight = await this.getDomainInsight(domain, userId, context);
          insights.domains.push(domainInsight);
        } else {
          insights.warnings.push({
            domain,
            message: 'Insight not governance-approved for this domain'
          });
        }
      } catch (error) {
        insights.warnings.push({
          domain,
          message: `Unable to retrieve insights: ${error.message}`
        });
      }
    }

    return insights;
  }

  /**
   * Check if insight is governance-approved
   * 
   * @param {string} domain - Domain name
   * @param {string} insightType - Type of insight
   * @returns {boolean} Is approved
   */
  isInsightApproved(domain, insightType) {
    // By default, only 'inquiry' and 'data_request' are approved
    // 'action_request' requires explicit governance approval
    if (insightType === 'action_request') {
      const key = `${domain}:${insightType}`;
      return this.approvedInsights.has(key);
    }
    return true; // Inquiry and data requests are approved by default
  }

  /**
   * Get domain-specific insight
   * 
   * @param {string} domain - Domain name
   * @param {string} userId - User identifier
   * @param {Object} context - Request context
   * @returns {Promise<Object>} Domain insight
   */
  async getDomainInsight(domain, userId, context) {
    // Get SLO status
    const sloStatus = sloManager.checkCompliance(domain);
    
    // Get relevant dashboard data (if available)
    let dashboardData = null;
    try {
      const dashboard = await analyticsDashboard.getDashboardData(domain, {
        timeRange: '24h'
      });
      dashboardData = dashboard;
    } catch (error) {
      // Dashboard not available for this domain
    }

    return {
      domain,
      status: sloStatus.compliant ? 'healthy' : 'degraded',
      slo: {
        compliant: sloStatus.compliant,
        violations: sloStatus.violations || []
      },
      summary: dashboardData ? this.summarizeDashboard(dashboardData) : null
    };
  }

  /**
   * Summarize dashboard data (no behavioral tracking)
   * 
   * @param {Object} dashboardData - Dashboard data
   * @returns {Object} Summary
   */
  summarizeDashboard(dashboardData) {
    // Only return governance-approved metrics
    // NO behavioral tracking or marketing analytics
    return {
      availability: dashboardData.summary?.healthStatus || 'unknown',
      criticalIssues: dashboardData.summary?.criticalIssues || 0,
      lastUpdated: dashboardData.generatedAt
    };
  }

  /**
   * Format insights for Decision Dashboard
   * 
   * @param {Object} insights - Generated insights
   * @param {string} language - Response language
   * @returns {Object} Formatted dashboard
   */
  formatForDecisionDashboard(insights, language) {
    const dashboard = {
      type: 'decision_support',
      language,
      sections: []
    };

    // Domain status section
    if (insights.domains.length > 0) {
      dashboard.sections.push({
        title: language === 'ar' ? 'حالة النطاقات' : 'Domain Status',
        type: 'status',
        items: insights.domains.map(d => ({
          domain: d.domain,
          status: d.status,
          compliant: d.slo.compliant
        }))
      });
    }

    // Recommendations section (advisory only)
    if (insights.recommendations.length > 0) {
      dashboard.sections.push({
        title: language === 'ar' ? 'التوصيات' : 'Recommendations',
        type: 'advisory',
        items: insights.recommendations
      });
    }

    // Warnings section
    if (insights.warnings.length > 0) {
      dashboard.sections.push({
        title: language === 'ar' ? 'تحذيرات' : 'Warnings',
        type: 'warning',
        items: insights.warnings
      });
    }

    return dashboard;
  }

  /**
   * Create security denial response
   * 
   * @param {string} language - Response language
   * @param {Object} securityCheck - Security check result
   * @returns {Object} Denial response
   */
  createSecurityDenialResponse(language, securityCheck) {
    const message = language === 'ar'
      ? 'تم رفض الوصول لأسباب أمنية. يرجى التحقق من صلاحياتك.'
      : 'Access denied for security reasons. Please verify your credentials.';

    return {
      success: false,
      language,
      responseType: 'security_denial',
      message,
      riskScore: securityCheck.riskScore,
      issues: securityCheck.issues
    };
  }

  /**
   * Create governance denial response
   * 
   * @param {string} language - Response language
   * @param {Object} governanceApproval - Governance approval result
   * @returns {Object} Denial response
   */
  createGovernanceDenialResponse(language, governanceApproval) {
    const message = language === 'ar'
      ? 'تم رفض الطلب بسبب قيود الحوكمة. بعض النطاقات غير متاحة حالياً.'
      : 'Request denied due to governance restrictions. Some domains are currently unavailable.';

    return {
      success: false,
      language,
      responseType: 'governance_denial',
      message,
      restrictions: governanceApproval.restrictions,
      deniedDomains: governanceApproval.deniedDomains
    };
  }

  /**
   * Log governance action
   * 
   * @param {Object} action - Action details
   */
  logGovernanceAction(action) {
    this.governanceLog.push({
      ...action,
      timestamp: Date.now()
    });

    // Keep only last 1000 logs
    if (this.governanceLog.length > 1000) {
      this.governanceLog.shift();
    }
  }

  /**
   * Approve insight type for domain
   * 
   * @param {string} domain - Domain name
   * @param {string} insightType - Insight type
   */
  approveInsight(domain, insightType) {
    const key = `${domain}:${insightType}`;
    this.approvedInsights.set(key, {
      domain,
      insightType,
      approvedAt: Date.now()
    });
  }

  /**
   * Get governance statistics
   * 
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      totalRequests: this.governanceLog.length,
      approvedInsights: this.approvedInsights.size,
      domainSovereigntyEnabled: this.config.domainSovereigntyEnabled,
      behaviorTrackingEnabled: this.config.behaviorTrackingEnabled
    };
  }
}

// Export singleton instance with production configuration
export const tecAssistantGovernance = new TECAssistantGovernance({
  languageDetectionEnabled: true,
  domainSovereigntyEnabled: true,
  behaviorTrackingEnabled: false, // Disabled - respects privacy
  marketingAnalyticsEnabled: false // Disabled - no marketing tracking
});

export default TECAssistantGovernance;
