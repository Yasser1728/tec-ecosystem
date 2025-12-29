import { prisma } from '../../../lib/db/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId, internalId } = req.body;

  if (!internalId) {
    return res.status(400).json({ error: 'Missing internalId' });
  }

  try {
    const payment = await prisma.payment.update({
      where: { id: internalId },
      data: {
        status: 'CANCELLED',
        metadata: {
          piPaymentId: paymentId,
          cancelledAt: new Date().toISOString()
        }
      }
    });

    return res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status
      }
    });
  } catch (error) {
    console.error('Payment cancellation error:', error);
    return res.status(500).json({
      error: 'Failed to cancel payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
