import { prisma } from "../../../lib/db/prisma";
import { withRateLimit } from "../../../middleware/ratelimit";
import { logger } from "../../../lib/utils/logger";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { piId, username, walletAddress } = req.body;

    if (!piId || !username) {
      return res.status(400).json({ error: "Missing piId or username" });
    }

    const user = await prisma.user.upsert({
      where: { piId },
      update: {
        username,
        walletAddress,
        lastLoginAt: new Date(),
      },
      create: {
        piId,
        username,
        walletAddress,
      },
    });

    logger.info("User authenticated", { userId: user.id, username });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        tier: user.tier,
        status: user.status,
      },
    });
  } catch (error) {
    logger.error("Auth error", { error: error.message });
    return res.status(500).json({ error: "Authentication failed" });
  }
}

export default withRateLimit(handler, { maxRequests: 10, windowMs: 60000 });
