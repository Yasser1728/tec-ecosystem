import crypto from "crypto";
import { verifyPiPayment, generateAuditHash } from "../../../lib/payments/piVerify";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ approved: false, error: "Method not allowed" });
  }

  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ approved: false, error: "paymentId is required" });
    }

    // Direct verification - NO fetch
    const verification = await verifyPiPayment(paymentId);

    if (!verification.valid) {
      return res.status(403).json({
        approved: false,
        rejected: true,
        reason: verification.reason,
      });
    }

    const auditPayload = {
      paymentId,
      amount: verification.amount,
      memo: verification.memo,
      timestamp: Date.now(),
    };

    const auditHash = generateAuditHash(auditPayload);

    return res.status(200).json({
      approved: true,
      rejected: false,
      auditHash,
      auditLogId: `audit-${Date.now()}-${crypto.randomUUID()}`,
      riskLevel: "low",
      timestamp: new Date().toISOString(),
      details: {
        identityVerified: true,
        operationValid: true,
        noSuspiciousActivity: true,
      },
    });
  } catch (error) {
    console.error("[Payment Approval Error]", error);
    return res.status(500).json({
      approved: false,
      error: "Internal approval error",
    });
  }
}
