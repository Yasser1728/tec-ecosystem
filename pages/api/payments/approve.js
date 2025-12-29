export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId, internalId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'Missing payment identifier' });
  }

  try {
    console.log('✅ Payment approved:', { paymentId, internalId });
    
    // In sandbox mode, just return success
    // In production, this would update the database
    return res.status(200).json({
      success: true,
      payment: {
        id: internalId || paymentId,
        piPaymentId: paymentId,
        status: 'APPROVED',
        approvedAt: new Date().toISOString()
      },
      message: 'Payment approved successfully (sandbox mode)'
    });
  } catch (error) {
    console.error('Payment approval error:', error);
    return res.status(500).json({ 
      error: 'Failed to approve payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
