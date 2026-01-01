/**
 * API Route: Handle Incomplete Pi Network Payments
 * This endpoint receives incomplete payment IDs and syncs them with the server.
 * Per Pi SDK v2.0, this is called when onIncompletePaymentFound is triggered.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, txid } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing payment identifier" });
  }

  try {
    console.log("Handling incomplete payment:", { paymentId, txid });

    const piApiKey = process.env.PI_API_KEY;
    const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";
    const apiUrl = "https://api.minepi.com/v2";

    // In sandbox mode without API key, just acknowledge the payment
    if (!piApiKey) {
      console.log("⚠️ PI_API_KEY not configured - acknowledging in sandbox mode");
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

    // If we have a txid, complete the payment
    if (txid) {
      const response = await fetch(`${apiUrl}/payments/${paymentId}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Key ${piApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Pi API complete error:", response.status, errorText);

        // In sandbox, return success even on error
        if (isSandbox) {
          return res.status(200).json({
            success: true,
            payment: {
              piPaymentId: paymentId,
              txid: txid,
              status: "COMPLETED",
              syncedAt: new Date().toISOString(),
            },
            message: "Incomplete payment completed (sandbox fallback)",
            warning: "Pi API call failed but completed locally",
          });
        }

        return res.status(response.status).json({
          error: "Pi API error",
          details: errorText,
        });
      }

      const data = await response.json();
      console.log("✅ Incomplete payment completed by Pi Network:", data);

      return res.status(200).json({
        success: true,
        payment: {
          piPaymentId: paymentId,
          txid: txid,
          status: "COMPLETED",
          syncedAt: new Date().toISOString(),
          piResponse: data,
        },
        message: "Incomplete payment completed successfully",
      });
    }

    // If no txid, just approve the payment to allow it to proceed
    const response = await fetch(`${apiUrl}/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${piApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pi API approve error:", response.status, errorText);

      // In sandbox, return success even on error
      if (isSandbox) {
        return res.status(200).json({
          success: true,
          payment: {
            piPaymentId: paymentId,
            status: "APPROVED",
            syncedAt: new Date().toISOString(),
          },
          message: "Incomplete payment approved (sandbox fallback)",
          warning: "Pi API call failed but approved locally",
        });
      }

      return res.status(response.status).json({
        error: "Pi API error",
        details: errorText,
      });
    }

    const data = await response.json();
    console.log("✅ Incomplete payment approved by Pi Network:", data);

    return res.status(200).json({
      success: true,
      payment: {
        piPaymentId: paymentId,
        status: "APPROVED",
        syncedAt: new Date().toISOString(),
        piResponse: data,
      },
      message: "Incomplete payment approved successfully",
    });
  } catch (error) {
    console.error("Incomplete payment handling error:", error);

    // In sandbox, return success even on error
    if (isSandbox) {
      return res.status(200).json({
        success: true,
        payment: {
          piPaymentId: paymentId,
          txid: txid || null,
          status: txid ? "COMPLETED" : "PENDING",
          syncedAt: new Date().toISOString(),
        },
        message: "Incomplete payment synced (sandbox mode)",
        warning: error.message,
      });
    }

    return res.status(500).json({
      error: "Failed to handle incomplete payment",
      details:
        process.env.NODE_ENV === "development" ? String(error.message || "Unknown error").slice(0, 200) : undefined,
    });
  }
}
