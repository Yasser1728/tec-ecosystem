import crypto from "crypto";
import { prisma } from "../../../lib/db/prisma";
import { piAuth } from "../../../lib/pi-auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { domainName, certificateType, metadata, paymentId } = req.body;

  if (!domainName || !certificateType || !metadata) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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
        userId:
          metadata.attributes.find((a) => a.trait_type === "Owner")?.value ||
          "unknown",
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
