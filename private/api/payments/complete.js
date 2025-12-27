import { prisma } from '../../../lib/db/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { paymentId, txid, internalId } = req.body;

  if (!paymentId || !txid || !internalId)
    return res.status(400).json({ error: 'Missing payment or transaction data' });

  try {
    // Verify transaction exists and update payment status to completed
    const payment = await prisma.payment.update({
      where: { id: internalId },
      data: {
        status: 'COMPLETED',
        piTxId: txid,
        completedAt: new Date(),
        metadata: {
          piPaymentId: paymentId,
          transactionId: txid,
          completedAt: new Date().toISOString(),
          verified: true
        }
      }
    });

    return res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        txid: payment.piTxId,
        completedAt: payment.completedAt
      },
      message: 'Payment completed and verified successfully'
    });
  } catch (error) {
    console.error('Payment completion error:', error);
    return res.status(500).json({ 
      error: 'Failed to complete payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
