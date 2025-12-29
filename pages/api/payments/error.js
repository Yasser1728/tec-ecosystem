import { prisma } from '../../../lib/db/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId, internalId, error } = req.body;

  if (!internalId) {
    return res.status(400).json({ error: 'Missing internalId' });
  }

  try {
    const payment = await prisma.payment.update({
      where: { id: internalId },
      data: {
        status: 'FAILED',
        metadata: {
          piPaymentId: paymentId,
          error,
          failedAt: new Date().toISOString()
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
  } catch (err) {
    console.error('Payment error handling failed:', err);
    return res.status(500).json({
      error: 'Failed to handle payment error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
