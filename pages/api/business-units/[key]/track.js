import { PrismaClient } from "@prisma/client";
import { logger } from '../../../../lib/utils/logger.js';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { key } = req.query;
  const { userId, page, action, metadata } = req.body;

  try {
    // Verify business unit exists
    const businessUnit = await prisma.businessUnit.findUnique({
      where: { key },
    });

    if (!businessUnit) {
      return res.status(404).json({ error: "Business Unit not found" });
    }

    // Track user activity
    const activity = await prisma.userActivity.create({
      data: {
        userId: userId || "anonymous",
        businessUnit: key,
        page: page || "/",
        action: action || "VIEW",
        metadata: metadata || {},
      },
    });

    // Update business unit visits
    await prisma.businessUnit.update({
      where: { key },
      data: { visits: { increment: 1 } },
    });

    // Update page views if page is specified
    if (page) {
      await prisma.businessUnitPage.updateMany({
        where: {
          businessUnitId: businessUnit.id,
          path: page,
        },
        data: {
          views: { increment: 1 },
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Tracking Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
