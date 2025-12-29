export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId, txid, internalId } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing payment or transaction data' });
  }

  try {
    console.log('✅ Payment completed:', { paymentId, txid, internalId });
    
    // In sandbox mode, just return success
    // In production, this would verify on Pi blockchain and update database
    return res.status(200).json({
      success: true,
      payment: {
        id: internalId || paymentId,
        piPaymentId: paymentId,
        status: 'COMPLETED',
        txid: txid,
        completedAt: new Date().toISOString(),
        verified: true
      },
      message: 'Payment completed and verified successfully (sandbox mode)'
    });
  } catch (error) {
    console.error('Payment completion error:', error);
    return res.status(500).json({ 
      error: 'Failed to complete payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
