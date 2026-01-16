import { prisma } from "../../../lib/db/prisma";
import { logger } from '../../../lib/utils/logger.js';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const [totalSpent, paymentsByStatus, paymentsByDomain, recentPayments] =
      await Promise.all([
        // Total spent
        prisma.payment.aggregate({
          where: {
            userId,
            status: "COMPLETED",
          },
          _sum: {
            amount: true,
          },
        }),

        // Payments by status
        prisma.payment.groupBy({
          by: ["status"],
          where: { userId },
          _count: true,
        }),

        // Payments by domain
        prisma.payment.groupBy({
          by: ["domain"],
          where: { userId },
          _count: true,
          _sum: {
            amount: true,
          },
        }),

        // Recent payments
        prisma.payment.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalSpent: totalSpent._sum.amount || 0,
        byStatus: paymentsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {}),
        byDomain: paymentsByDomain.map((item) => ({
          domain: item.domain,
          count: item._count,
          totalAmount: item._sum.amount,
        })),
        recentPayments,
      },
    });
  } catch (error) {
    console.error("Payment stats error:", error);
    return res.status(500).json({
      error: "Failed to fetch payment stats",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
