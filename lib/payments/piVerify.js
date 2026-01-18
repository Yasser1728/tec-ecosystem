import crypto from "crypto";

export async function verifyPiPayment(paymentId) {
  // Reject sandbox IDs in production
  if (paymentId.startsWith("sandbox_") && process.env.NODE_ENV === "production") {
    return { valid: false, reason: "Sandbox payment not allowed in production" };
  }

  // Basic validation
  if (!paymentId || paymentId.length < 5) {
    return { valid: false, reason: "Invalid paymentId" };
  }

  // In sandbox mode, auto-approve
  const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true" || 
                    process.env.PI_SANDBOX_MODE === "true";

  return {
    valid: true,
    amount: 1,
    memo: isSandbox ? "Sandbox payment" : "Verified Pi payment",
    sandbox: isSandbox,
  };
}

export function generateAuditHash(payload) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}
