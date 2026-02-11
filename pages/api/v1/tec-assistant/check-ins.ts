/**
 * TEC Assistant - Check-in API
 * POST /api/v1/tec-assistant/check-ins
 */

import { PrismaClient as TecPrismaClient } from ".prisma/client-tec";
import type { NextApiRequest, NextApiResponse } from "next";
import { CheckInRepository } from "@/src/infrastructure/database/repositories/CheckInRepository";
import { UserRepository } from "@/src/infrastructure/database/repositories/UserRepository";
import { SignalRepository } from "@/src/infrastructure/database/repositories/SignalRepository";
import { ConfirmDailyCheckIn } from "@/src/domain/use-cases/check-ins/ConfirmDailyCheckIn";

const prisma = new TecPrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: { message: "Method not allowed" } });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_USER_ID", message: "User ID is required" },
      });
    }

    // Initialize dependencies
    const checkInRepository = new CheckInRepository(prisma);
    const userRepository = new UserRepository(prisma);
    const signalRepository = new SignalRepository(prisma);

    // Execute use case
    const useCase = new ConfirmDailyCheckIn(
      checkInRepository,
      userRepository,
      signalRepository,
    );
    const result = await useCase.execute({ userId });

    return res.status(201).json({
      success: true,
      data: {
        checkIn: {
          id: result.checkIn.id,
          date: result.checkIn.date.toISOString(),
          signal: result.checkIn.signal,
          xpEarned: result.xpEarned,
          streakDay: result.newStreak,
        },
        xpEarned: result.xpEarned,
        newStreak: result.newStreak,
        leveledUp: result.leveledUp,
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to confirm check-in";

    if (errorMessage === "Already checked in today") {
      return res.status(409).json({
        success: false,
        error: {
          code: "ALREADY_CHECKED_IN",
          message: "You have already checked in today",
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: "CHECKIN_ERROR",
        message: errorMessage,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
