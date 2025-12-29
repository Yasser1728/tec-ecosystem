import { prisma } from '../../../lib/db/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { amount, memo, domain, userId, category = 'general' } = req.body;

  if (!amount || !domain || !userId)
    return res.status(400).json({ error: 'Invalid payment data' });

  try {
    // Create payment record in database with PENDING status
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(amount),
        currency: 'PI',
        domain,
        category,
        description: memo || `Payment for ${domain}`,
        status: 'PENDING',
        metadata: {
          initiatedAt: new Date().toISOString(),
          source: 'web'
        }
      }
    });

    // Return payment details for client-side Pi SDK processing
    return res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        domain: payment.domain,
        status: payment.status
      },
      message: 'Payment initiated. Complete transaction in Pi Browser.'
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
