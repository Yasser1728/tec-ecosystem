/**
 * Pi Payment Approval API - Sandbox Implementation
 *
 * For Sandbox/Testnet: No external fetch calls are made. Payment is approved locally.
 * For Mainnet (future): Use official Pi Node.js SDK for secure server-side verification.
 * See: https://github.com/pi-apps/pi-platform-docs
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, internalId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing payment identifier" });
  }

  // Sandbox mode: Log payment and return success immediately
  // No external API calls to avoid SSRF vulnerabilities
  console.log("✅ [Sandbox] Approving payment:", { paymentId, internalId });

  return res.status(200).json({
    success: true,
    payment: {
      id: internalId || paymentId,
      piPaymentId: paymentId,
      status: "APPROVED",
      approvedAt: new Date().toISOString(),
    },
    message: "Payment approved (sandbox mode)",
  });
}
