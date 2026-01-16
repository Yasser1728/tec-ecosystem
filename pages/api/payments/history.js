import { prisma } from "../../../lib/db/prisma";
import { logger } from '../../../lib/utils/logger.js';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const DEFAULT_LIMIT = 50;
  const MIN_LIMIT = 1;
  const MAX_LIMIT = 100;

  /**
   * Safely parse and clamp numeric query values.
   * @param {string|number} value - Incoming value to sanitize.
   * @param {number} fallback - Default value when parsing fails.
   * @param {number} [min] - Minimum allowed value (inclusive).
   * @param {number} [max] - Maximum allowed value (inclusive).
   * @returns {number} Sanitized numeric value within the provided bounds.
   */
  const sanitizeNumber = (value, fallback, min, max) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return fallback;
    const lowerBounded = typeof min === "number" ? Math.max(parsed, min) : parsed;
    return typeof max === "number"
      ? Math.min(lowerBounded, max)
      : lowerBounded;
  };

  const { userId, limit, offset, status } = req.query;

  const limitNumber = sanitizeNumber(limit, DEFAULT_LIMIT, MIN_LIMIT, MAX_LIMIT);
  const offsetNumber = sanitizeNumber(offset, 0, 0);

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const where = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: limitNumber,
        skip: offsetNumber,
        include: {
          user: {
            select: {
              username: true,
              tier: true,
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      payments,
      pagination: {
        total,
        limit: limitNumber,
        offset: offsetNumber,
        hasMore: total > offsetNumber + limitNumber,
      },
    });
  } catch (error) {
    console.error("Payment history error:", error);
    return res.status(500).json({
      error: "Failed to fetch payment history",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
