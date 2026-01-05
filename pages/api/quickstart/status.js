/**
 * Quick Start Status API
 * 
 * GET /api/quickstart/status - Get user's Quick Start workflow progress
 * 
 * Returns the current status and progress of the user's Quick Start journey,
 * including completed steps, next recommended action, and progress percentage.
 */

const quickStartService = require('../../../lib/services/quickStartService');
const { getSession } = require('next-auth/react');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Get user session
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Please authenticate first'
      });
    }

    const userId = session.user.id;

    // Get Quick Start status
    const status = await quickStartService.getQuickStartStatus(userId);

    if (!status) {
      // User hasn't started Quick Start yet
      return res.status(200).json({
        success: true,
        status: 'NOT_STARTED',
        message: 'Quick Start workflow not yet initiated',
        nextStep: await quickStartService.getNextStep(userId),
        progressPercentage: 0
      });
    }

    // Get next recommended step
    const nextStep = await quickStartService.getNextStep(userId);

    // Get progress percentage
    const progressPercentage = await quickStartService.getProgressPercentage(userId);

    // Return complete status
    return res.status(200).json({
      success: true,
      status: status.status,
      steps: status.steps,
      progressPercentage,
      nextStep,
      startedAt: status.startedAt,
      completedAt: status.completedAt,
      completed: status.status === 'COMPLETED'
    });

  } catch (error) {
    // console.error('[QuickStart Status API] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve Quick Start status',
      message: error.message
    });
  }
}
