/**
 * SLO/SLA Monitoring API Endpoint
 * Provides SLO compliance and monitoring data
 * 
 * @route GET /api/slo/status
 */

import { sloManager } from '../../../lib/slo/manager.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    const { domain } = req.query;

    // Get overall compliance if no specific domain requested
    if (!domain) {
      const compliance = sloManager.getOverallCompliance();
      const stats = sloManager.getStats();

      return res.status(200).json({
        success: true,
        compliance,
        statistics: stats,
        timestamp: Date.now()
      });
    }

    // Get specific domain report
    const report = sloManager.generateReport(domain);

    return res.status(200).json({
      success: true,
      report,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('SLO API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve SLO data',
      message: error.message
    });
  }
}
