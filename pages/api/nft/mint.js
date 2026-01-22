/**
 * NFT Minting API
 * W3SA Security Enhancements Applied
 */

import crypto from "crypto";
import { prisma } from "../../../lib/db/prisma";
import { piAuth } from "../../../lib/pi-auth";
import { withCORS } from "../../../middleware/cors";
import { withBodyValidation } from "../../../lib/validations";
import { MintNFTSchema } from "../../../lib/validations/nft";
import { withErrorHandler } from "../../../lib/utils/errorHandler";
import { requirePermission } from "../../../lib/auth/permissions";
import { PERMISSIONS } from "../../../lib/roles/definitions";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use validated body from middleware
  const { domainName, certificateType, userId, metadata } = req.validatedBody;
  const paymentId = req.body.paymentId; // Optional field

  try {
    // Verify payment is completed
    if (paymentId) {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment || payment.status !== "COMPLETED") {
        return res.status(400).json({ error: "Payment not completed" });
      }
    }

    // Generate unique token ID using crypto for security
    const randomHex = crypto.randomBytes(8).toString("hex");
    const tokenId = `TEC-${domainName.toUpperCase()}-${randomHex}`;

    // Create NFT record
    const nft = await prisma.nFT.create({
      data: {
        tokenId,
        userId: userId || metadata?.userId || "unknown",
        domainName,
        certificateType,
        metadata,
        status: "MINTED",
      },
    });

    return res.status(200).json({
      success: true,
      nft: {
        id: nft.id,
        tokenId: nft.tokenId,
        domainName: nft.domainName,
        certificateType: nft.certificateType,
        metadata: nft.metadata,
        mintedAt: nft.mintedAt,
      },
      message: "NFT minted successfully",
    });
  } catch (error) {
    console.error("NFT minting error:", error);
    return res.status(500).json({
      error: "Failed to mint NFT",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Apply security middleware layers
export default withCORS(
  withErrorHandler(
    requirePermission(PERMISSIONS.NFT_MINT)(
      withBodyValidation(handler, MintNFTSchema)
    )
  )
);
