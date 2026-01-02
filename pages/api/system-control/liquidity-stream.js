/**
 * System Control API - Liquidity Stream
 * Endpoint to get system liquidity overview and pending transfers
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { USER_TIERS } from '../../../lib/roles';
import { getSystemLiquidityStream } from '../../../lib/forensic-utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify admin authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.tier !== USER_TIERS.ADMIN) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    // Get liquidity stream data
    const liquidityData = await getSystemLiquidityStream();

    return res.status(200).json({
      success: true,
      data: liquidityData,
    });
  } catch (error) {
    console.error('[LIQUIDITY STREAM ERROR]', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
