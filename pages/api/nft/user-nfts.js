import { prisma } from '../../../lib/db/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const nfts = await prisma.nFT.findMany({
      where: { userId },
      orderBy: { mintedAt: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            tier: true
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      nfts,
      count: nfts.length
    });
  } catch (error) {
    console.error('Failed to fetch user NFTs:', error);
    return res.status(500).json({
      error: 'Failed to fetch NFTs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
