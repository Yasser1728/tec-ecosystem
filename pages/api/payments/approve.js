import crypto from "crypto";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Payment ID is required" });
  }

  try {
    console.log("Approving payment:", paymentId);

    // Check if in sandbox mode
    const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true" || 
                      process.env.PI_SANDBOX_MODE === "true";

    if (isSandbox) {
      // Sandbox mode: auto-approve without calling Pi API
      const auditLogId = `audit-${Date.now()}-${crypto.randomUUID()}`;
      
      return res.status(200).json({
        success: true,
        approved: true,
        paymentId,
        auditLogId,
        message: "Payment approved successfully",
      });
    }

    // Production mode: Call Pi Network API to approve the payment
    const piApiKey = process.env.PI_API_KEY;
    
    if (!piApiKey) {
      console.error("PI_API_KEY not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const approveResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${piApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!approveResponse.ok) {
      const errorText = await approveResponse.text();
      console.error("Pi API approve error:", approveResponse.status, errorText);
      return res.status(approveResponse.status).json({
        error: "Failed to approve payment with Pi Network",
        details: errorText,
      });
    }

    const approveData = await approveResponse.json();
    console.log("Payment approved successfully:", approveData);

    // Generate audit log
    const auditLogId = `audit-${Date.now()}-${crypto.randomUUID()}`;

    return res.status(200).json({
      success: true,
      approved: true,
      paymentId,
      auditLogId,
      message: "Payment approved successfully",
    });
  } catch (error) {
    console.error("Payment approval error:", error);
    return res.status(500).json({
      error: "Failed to approve payment",
      message: error.message,
    });
  }
}
