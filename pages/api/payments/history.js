import { prisma } from '../../../lib/db/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, limit = 50, offset = 0, status } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const where = {
      userId
    };

    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          user: {
            select: {
              username: true,
              tier: true
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ]);

    return res.status(200).json({
      success: true,
      payments,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Payment history error:', error);
    return res.status(500).json({
      error: 'Failed to fetch payment history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
