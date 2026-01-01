/**
 * API Route: Handle Incomplete Pi Network Payments
 * This endpoint receives incomplete payment IDs and syncs them with the server.
 * Per Pi SDK v2.0, this is called when onIncompletePaymentFound is triggered.
 */

// Validate payment ID format to prevent SSRF attacks
// Pi payment IDs are alphanumeric with underscores/hyphens
function isValidPaymentId(id) {
  if (!id || typeof id !== "string") return false;
  // Only allow alphanumeric, underscores, and hyphens (max 100 chars)
  return /^[a-zA-Z0-9_-]{1,100}$/.test(id);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, txid } = req.body;
  const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

  if (!paymentId) {
    return res.status(400).json({ error: "Missing payment identifier" });
  }

  // Validate paymentId format to prevent SSRF
  if (!isValidPaymentId(paymentId)) {
    return res.status(400).json({ error: "Invalid payment identifier format" });
  }

  // Validate txid format if provided
  if (txid && !isValidPaymentId(txid)) {
    return res.status(400).json({ error: "Invalid transaction ID format" });
  }

  console.log("Handling incomplete payment:", { paymentId, txid });

  const piApiKey = process.env.PI_API_KEY;

  // In sandbox mode without API key, just acknowledge the payment
  if (!piApiKey || isSandbox) {
    console.log("✅ Acknowledging incomplete payment in sandbox mode");
    return res.status(200).json({
      success: true,
      payment: {
        piPaymentId: paymentId,
        txid: txid || null,
        status: txid ? "COMPLETED" : "PENDING",
        syncedAt: new Date().toISOString(),
      },
      message: "Incomplete payment acknowledged (sandbox mode)",
    });
  }

  // Production mode with API key - call Pi Network API
  try {
    const apiUrl = "https://api.minepi.com/v2";
    const endpoint = txid
      ? `${apiUrl}/payments/${encodeURIComponent(paymentId)}/complete`
      : `${apiUrl}/payments/${encodeURIComponent(paymentId)}/approve`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Key ${piApiKey}`,
        "Content-Type": "application/json",
      },
      body: txid ? JSON.stringify({ txid }) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pi API error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Pi API error",
        details: errorText,
      });
    }

    const data = await response.json();
    console.log("✅ Incomplete payment processed by Pi Network:", data);

    return res.status(200).json({
      success: true,
      payment: {
        piPaymentId: paymentId,
        txid: txid || null,
        status: txid ? "COMPLETED" : "APPROVED",
        syncedAt: new Date().toISOString(),
        piResponse: data,
      },
      message: txid
        ? "Incomplete payment completed successfully"
        : "Incomplete payment approved successfully",
    });
  } catch (error) {
    console.error("Incomplete payment handling error:", error);
    return res.status(500).json({
      error: "Failed to handle incomplete payment",
    });
  }
}
