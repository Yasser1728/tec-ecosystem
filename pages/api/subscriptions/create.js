import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import { logger } from '../../../lib/utils/logger.js';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { paymentId, tier, userId } = req.body;

  if (!paymentId || !tier) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Verify payment with Pi Network (placeholder)
    // In production, verify with Pi API

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        businessUnit: "tec-ecosystem",
        plan: tier,
        status: "ACTIVE",
        piTxId: paymentId,
        amount: tier === "PREMIUM" ? 100 : 1000,
        currency: "PI",
      },
    });

    // Update user tier
    await prisma.user.update({
      where: { id: session.user.id },
      data: { tier },
    });

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Subscription Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
