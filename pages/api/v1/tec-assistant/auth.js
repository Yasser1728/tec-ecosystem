/**
 * TEC Assistant - Auth API
 * POST /api/v1/tec-assistant/auth
 */

import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../../../../src/infrastructure/database/repositories/UserRepository';
import { PiNetworkService } from '../../../../../src/infrastructure/pi-network/PiNetworkService';
import { AuthenticateWithPi } from '../../../../../src/domain/use-cases/auth/AuthenticateWithPi';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_TOKEN', message: 'Access token is required' },
      });
    }

    // Initialize dependencies
    const userRepository = new UserRepository(prisma);
    const piNetworkService = new PiNetworkService(
      process.env.PI_API_KEY || '',
      process.env.NEXT_PUBLIC_PI_SANDBOX === 'true'
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
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_FAILED',
        message: error.message || 'Authentication failed',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
