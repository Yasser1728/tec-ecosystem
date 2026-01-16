import { PrismaClient } from "@prisma/client";
import { logger } from '../../../../lib/utils/logger.js';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { key } = req.query;

  try {
    const businessUnit = await prisma.businessUnit.findUnique({
      where: { key },
      include: {
        pages: {
          select: {
            path: true,
            title: true,
            views: true,
          },
          orderBy: { views: "desc" },
        },
      },
    });

    if (!businessUnit) {
      return res.status(404).json({ error: "Business Unit not found" });
    }

    // Get activity stats
    const totalActivities = await prisma.userActivity.count({
      where: { businessUnit: key },
    });

    const uniqueUsers = await prisma.userActivity.findMany({
      where: { businessUnit: key },
      distinct: ["userId"],
      select: { userId: true },
    });

    // Get recent activities
    const recentActivities = await prisma.userActivity.findMany({
      where: { businessUnit: key },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get subscriptions count
    const subscriptionsCount = await prisma.subscription.count({
      where: {
        businessUnit: key,
        status: "ACTIVE",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        businessUnit: {
          key: businessUnit.key,
          name: businessUnit.name,
          views: businessUnit.views,
          visits: businessUnit.visits,
        },
        stats: {
          totalActivities,
          uniqueUsers: uniqueUsers.length,
          activeSubscriptions: subscriptionsCount,
        },
        pages: businessUnit.pages,
        recentActivities,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
