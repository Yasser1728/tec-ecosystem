import { prisma } from '../../../lib/db/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { paymentId, internalId } = req.body;

  if (!paymentId || !internalId)
    return res.status(400).json({ error: 'Missing payment identifiers' });

  try {
    // Update payment status to approved
    const payment = await prisma.payment.update({
      where: { id: internalId },
      data: {
        status: 'APPROVED',
        metadata: {
          piPaymentId: paymentId,
          approvedAt: new Date().toISOString()
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
    console.error('Payment approval error:', error);
    return res.status(500).json({ 
      error: 'Failed to approve payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
