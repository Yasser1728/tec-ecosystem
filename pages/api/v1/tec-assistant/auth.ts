/**
 * TEC Assistant - Auth API
 * POST /api/v1/tec-assistant/auth
 */

import { PrismaClient as TecPrismaClient } from "@prisma/client-tec";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserRepository } from "@/src/infrastructure/database/repositories/UserRepository";
import { PiNetworkService } from "@/src/infrastructure/pi-network/PiNetworkService";
import { AuthenticateWithPi } from "@/src/domain/use-cases/auth/AuthenticateWithPi";

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
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_TOKEN", message: "Access token is required" },
      });
    }

    // Initialize dependencies
    const userRepository = new UserRepository(prisma);
    const piNetworkService = new PiNetworkService(
      process.env.PI_API_KEY || "",
      process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
    );

    // Execute use case
    const useCase = new AuthenticateWithPi(userRepository, piNetworkService);
    const result = await useCase.execute({ accessToken });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          piUsername: result.user.piUsername,
          walletAddress: result.user.walletAddress,
          currentStreak: result.user.currentStreak,
          totalXp: result.user.totalXp,
          level: result.user.level,
          role: result.user.role,
        },
        isNewUser: result.isNewUser,
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";
    return res.status(500).json({
      success: false,
      error: {
        code: "AUTH_FAILED",
        message: errorMessage,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
