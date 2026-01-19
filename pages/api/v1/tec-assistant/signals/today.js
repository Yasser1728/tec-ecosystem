/**
 * TEC Assistant - Today's Signal API
 * GET /api/v1/tec-assistant/signals/today
 */

import { PrismaClient } from '@prisma/client';
import { SignalRepository } from '../../../../../../src/infrastructure/database/repositories/SignalRepository';
import { GetTodaySignal } from '../../../../../../src/domain/use-cases/signals/GetTodaySignal';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    // Initialize dependencies
    const signalRepository = new SignalRepository(prisma);

    // Execute use case
    const useCase = new GetTodaySignal(signalRepository);
    const result = await useCase.execute();

    const displayInfo = result.signal.getDisplayInfo();

    return res.status(200).json({
      success: true,
      data: {
        signal: {
          id: result.signal.id,
          date: result.signal.date.toISOString(),
          type: result.signal.type,
          ...displayInfo,
          generatedAt: result.signal.generatedAt.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Get signal error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SIGNAL_ERROR',
        message: error.message || 'Failed to get today\'s signal',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
