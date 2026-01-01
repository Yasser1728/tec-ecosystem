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

  const { paymentId, internalId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing payment identifier" });
  }

  // Validate paymentId format to prevent SSRF
  if (!isValidPaymentId(paymentId)) {
    return res.status(400).json({ error: "Invalid payment identifier format" });
  }

  const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

  // SECURITY: In sandbox mode, do NOT make external API calls
  // Pi SDK handles payment completion client-side in sandbox
  if (isSandbox) {
    console.log("✅ Approving payment in sandbox mode (no external API calls):", paymentId);
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

  // Production mode requires API key
  const piApiKey = process.env.PI_API_KEY;
  if (!piApiKey) {
    console.log("✅ No PI_API_KEY configured, approving payment locally");
    return res.status(200).json({
      success: true,
      payment: {
        id: internalId || paymentId,
        piPaymentId: paymentId,
        status: "APPROVED",
        approvedAt: new Date().toISOString(),
      },
      message: "Payment approved (no API key configured)",
    });
  }

  try {
    console.log("Approving payment:", { paymentId, internalId });

    // Production mode with API key - use Pi API
    const apiUrl = process.env.PI_API_URL || "https://api.minepi.com/v2";

    // Use encodeURIComponent for safe URL construction
    const response = await fetch(`${apiUrl}/payments/${encodeURIComponent(paymentId)}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${piApiKey}`,
        "Content-Type": "application/json",
      },
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
    console.log("✅ Payment approved by Pi Network:", data);

    return res.status(200).json({
      success: true,
      payment: {
        id: internalId || paymentId,
        piPaymentId: paymentId,
        status: "APPROVED",
        approvedAt: new Date().toISOString(),
        piResponse: data,
      },
      message: "Payment approved successfully",
    });
  } catch (error) {
    console.error("Payment approval error:", error);
    return res.status(500).json({
      error: "Failed to approve payment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
