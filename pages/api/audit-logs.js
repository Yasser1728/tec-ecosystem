/**
 * Audit Logs API Endpoint
 * 
 * Provides access to audit logs for authorized users
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { fetchAuditLogs, getAuditLogCount } from '../../lib/forensic-utils';

export default async function handler(req, res) {
  // Only accept GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts GET requests',
    });
  }

  try {
    // Get user session for authentication
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to view audit logs',
      });
    }

    // Extract query parameters
    const {
      limit = 50,
      offset = 0,
      operationType,
      approved,
      domain,
      userId,
    } = req.query;

    // Build query options
    const options = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    };

    // Only allow users to see their own logs unless they are admin
    // For now, we'll allow users to see only their own logs
    options.userId = session.user.id;

    // Add optional filters
    if (operationType) options.operationType = operationType;
    if (approved !== undefined) options.approved = approved === 'true';
    if (domain) options.domain = domain;

    // Fetch audit logs and count
    const [auditLogs, totalCount] = await Promise.all([
      fetchAuditLogs(options),
      getAuditLogCount(options),
    ]);

    // Return audit logs
    return res.status(200).json({
      success: true,
      data: auditLogs,
      pagination: {
        limit: options.limit,
        offset: options.offset,
        total: totalCount,
        hasMore: options.offset + options.limit < totalCount,
      },
    });
  } catch (error) {
    console.error('[AUDIT LOGS API ERROR]', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching audit logs',
      ...(process.env.NODE_ENV === 'development' && {
        errorDetails: error.message,
      }),
    });
  }
}
