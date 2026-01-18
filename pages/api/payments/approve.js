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

    console.log("Approving payment:", paymentId);

    // Retry logic - try up to 3 times with delays
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds between retries
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to approve payment...`);
        
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

        // If successful, return the result
        if (approveResponse.ok) {
          const approveData = await approveResponse.json();
          console.log("✅ Payment approved successfully:", approveData);
          
          // Generate audit log
          const auditLogId = `audit-${Date.now()}-${crypto.randomUUID()}`;
          
          return res.status(200).json({
            success: true,
            approved: true,
            paymentId,
            auditLogId,
            message: "Payment approved successfully",
          });
        }

        // If 404, payment not registered yet - retry
        if (approveResponse.status === 404) {
          const errorData = await approveResponse.json();
          console.log(`⏳ Payment not found yet (attempt ${attempt}):`, errorData);
          
          if (attempt < maxRetries) {
            console.log(`Waiting ${retryDelay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
          
          // Last attempt with 404 - return the error
          return res.status(404).json({
            error: "Failed to approve payment",
            status: 404,
            details: errorData,
          });
        }

        // Other errors - don't retry
        const errorText = await approveResponse.text();
        console.error("❌ Pi API error:", approveResponse.status, errorText);
        
        return res.status(approveResponse.status).json({
          error: "Failed to approve payment",
          status: approveResponse.status,
          details: errorText,
        });

      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
        return res.status(500).json({
          error: "Failed to approve payment",
          message: error.message,
        });
      }
    }

    // Should not reach here, but just in case
    return res.status(500).json({
      error: "Failed to approve payment after all retries",
    });
  } catch (error) {
    console.error("Payment approval error:", error);
    return res.status(500).json({
      error: "Failed to approve payment",
      message: error.message,
    });
  }
}
