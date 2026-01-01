/**
 * Pi Payment Completion API - Sandbox Implementation
 *
 * For Sandbox/Testnet: No external fetch calls are made. Payment is completed locally.
 * For Mainnet (future): Use official Pi Node.js SDK for secure server-side verification.
 * See: https://github.com/pi-apps/pi-platform-docs
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, txid, internalId } = req.body;

  if (!paymentId || !txid) {
    return res
      .status(400)
      .json({ error: "Missing payment or transaction data" });
  }

  // Sandbox mode: Log payment and return success immediately
  // No external API calls to avoid SSRF vulnerabilities
  console.log("✅ [Sandbox] Completing payment:", {
    paymentId,
    txid,
    internalId,
  });

  return res.status(200).json({
    success: true,
    payment: {
      id: internalId || paymentId,
      piPaymentId: paymentId,
      status: "COMPLETED",
      txid: txid,
      completedAt: new Date().toISOString(),
      verified: true,
    },
    message: "Payment completed (sandbox mode)",
  });
}
