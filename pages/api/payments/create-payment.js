export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { amount, memo, domain } = req.body;

  if (!amount || !domain)
    return res.status(400).json({ error: 'Invalid payment data' });

  // يسجل الدفع – لا ينفذ الصفقة تلقائيًا (Curated Only)
  return res.status(200).json({
    success: true,
    status: 'pending_approval',
    domain,
    amount
  });
}
