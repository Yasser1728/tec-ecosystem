/**
 * Pi Payment Completion API - Sandbox & Production Implementation
 *
 * For Sandbox/Testnet: No external fetch calls are made. Payment is completed locally.
 * For Production/Mainnet: Calls Pi Platform API to complete payment.
 * See: https://github.com/pi-apps/pi-platform-docs
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, txid, internalId } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: "Missing paymentId or txid" });
  }

  try {
    // Check if running in sandbox mode
    const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true" || 
                      process.env.PI_SANDBOX_MODE === "true";
    
    if (isSandbox) {
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

    // Production mode - call Pi Platform API
    const PI_API_KEY = process.env.PI_API_KEY;
    
    if (!PI_API_KEY) {
      console.error("❌ PI_API_KEY not configured");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    const piCompleteResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      }
    );

    if (!piCompleteResponse.ok) {
      const errorData = await piCompleteResponse.json().catch(() => ({}));
      console.error("❌ Pi API complete failed:", errorData);
      return res.status(piCompleteResponse.status).json({
        success: false,
        error: "Failed to complete payment with Pi Network",
        details: errorData,
      });
    }

    const piCompleteData = await piCompleteResponse.json();
    console.log("✅ Payment completed via Pi API:", piCompleteData);

    return res.status(200).json({
      success: true,
      payment: {
        id: internalId || paymentId,
        piPaymentId: paymentId,
        status: "COMPLETED",
        txid: txid,
        completedAt: new Date().toISOString(),
        verified: true,
        // Include only safe fields from Pi API response
        ...(piCompleteData.identifier && { piIdentifier: piCompleteData.identifier }),
        ...(piCompleteData.amount && { verifiedAmount: piCompleteData.amount }),
      },
      message: "Payment completed successfully",
    });
  } catch (error) {
    console.error("Payment completion error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to complete payment",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
