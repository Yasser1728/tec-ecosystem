import { prisma } from '../../../lib/db/prisma';
import { withRateLimit } from '../../../middleware/ratelimit';
import { logger } from '../../../lib/utils/logger';

/**
 * Session Status API
 * Checks if a user's session is valid and returns their current status
 * 
 * Session validity: 7 days from last login
 * If no lastLoginAt exists, uses account creation date as fallback
 */

// Session timeout configuration (7 days in milliseconds)
const SESSION_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000;

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { piId, userId } = req.body;

    if (!piId && !userId) {
      return res.status(400).json({ error: 'Missing piId or userId' });
    }

    // Find user by piId or userId
    const user = await prisma.user.findFirst({
      where: piId ? { piId } : { id: userId },
      select: {
        id: true,
        username: true,
        status: true,
        tier: true,
        lastLoginAt: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found',
        sessionValid: false
      });
    }

    // Check if session is still valid (within configured timeout period)
    // Uses lastLoginAt if available, otherwise falls back to account creation date
    const lastLogin = user.lastLoginAt || user.createdAt;
    const sessionValid = (Date.now() - new Date(lastLogin).getTime()) < SESSION_TIMEOUT_MS;

    const sessionStatus = {
      success: true,
      sessionValid,
      user: {
        id: user.id,
        username: user.username,
        status: user.status,
        tier: user.tier,
        lastLoginAt: lastLogin
      },
      message: sessionValid ? 'Session is active' : 'Session expired'
    };

    logger.info('Session status checked', { 
      userId: user.id, 
      sessionValid,
      username: user.username 
    });

    return res.status(200).json(sessionStatus);

  } catch (error) {
    logger.error('Session status check error', { error: error.message });
    return res.status(500).json({ 
      success: false,
      error: 'Failed to check session status',
      sessionValid: false
    });
  }
}

export default withRateLimit(handler, { maxRequests: 20, windowMs: 60000 });
