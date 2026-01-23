/**
 * Analytics Dashboard API Endpoint
 * Provides comprehensive analytics data
 * 
 * @route GET /api/analytics/dashboard
 */

import { analyticsDashboard } from '../../../lib/monitoring/analytics-dashboard.js';
import { zeroTrust } from '../../../lib/security/zero-trust.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    // Zero-Trust verification for analytics access
    const verification = await zeroTrust.verifyRequest({
      sessionId: req.cookies?.sessionId,
      userId: req.session?.user?.id,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      headers: req.headers,
      endpoint: '/api/analytics/dashboard',
      resource: 'analytics',
      action: 'read',
      domain: 'analytics'
    });

    if (!verification.passed) {
      return res.status(403).json({
        error: 'Access denied',
        reason: verification.results.find(r => !r.passed)?.reason
      });
    }

    const { dashboardId, timeRange, refresh } = req.query;

    if (!dashboardId) {
      // Return list of available dashboards
      const dashboards = analyticsDashboard.getAvailableDashboards();
      return res.status(200).json({
        success: true,
        dashboards
      });
    }

    // Get dashboard data
    const data = await analyticsDashboard.getDashboardData(dashboardId, {
      timeRange: timeRange || '24h',
      refresh: refresh === 'true'
    });

    return res.status(200).json({
      success: true,
      dashboard: data
    });

  } catch (error) {
    console.error('Analytics Dashboard API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics data',
      message: error.message
    });
  }
}
