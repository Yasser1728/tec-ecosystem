export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, internalId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing payment identifier" });
  }

  try {
    console.log("Approving payment:", { paymentId, internalId });

    // Call Pi Network API to approve payment
    const piApiKey = process.env.PI_API_KEY;
    const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";
    const apiUrl = isSandbox
      ? "https://api.minepi.com/v2"
      : "https://api.minepi.com/v2";

    if (!piApiKey) {
      console.error("PI_API_KEY not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const response = await fetch(`${apiUrl}/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${piApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pi API error:", response.status, errorText);

      // Even if Pi API fails, return success for testing
      if (isSandbox) {
        console.log("⚠️ Pi API failed but continuing in sandbox mode");
        return res.status(200).json({
          success: true,
          payment: {
            id: internalId || paymentId,
            piPaymentId: paymentId,
            status: "APPROVED",
            approvedAt: new Date().toISOString(),
          },
          message: "Payment approved (sandbox fallback)",
          warning: "Pi API call failed but approved locally",
        });
      }

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

    // In sandbox, return success even on error
    if (process.env.NEXT_PUBLIC_PI_SANDBOX === "true") {
      return res.status(200).json({
        success: true,
        payment: {
          id: internalId || paymentId,
          piPaymentId: paymentId,
          status: "APPROVED",
          approvedAt: new Date().toISOString(),
        },
        message: "Payment approved (sandbox mode)",
        warning: error.message,
      });
    }

    return res.status(500).json({
      error: "Failed to approve payment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
