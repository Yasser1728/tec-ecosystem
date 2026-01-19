/**
 * CheckIn Repository Implementation - TEC Assistant Domain
 */

import { PrismaClient } from '@prisma/client';
import { CheckIn } from '../../../domain/entities/CheckIn';
import { SignalType } from '../../../domain/entities/Signal';
import { ICheckInRepository } from '../../../domain/interfaces/repositories/ICheckInRepository';

export class CheckInRepository implements ICheckInRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserAndDate(userId: string, date: Date): Promise<CheckIn | null> {
    const checkIn = await this.prisma.tecCheckIn.findUnique({
      where: { userId_date: { userId, date } },
    });
    return checkIn ? this.toDomain(checkIn) : null;
  }

  async create(checkIn: CheckIn): Promise<CheckIn> {
    const data = this.toPersistence(checkIn);
    const created = await this.prisma.tecCheckIn.create({ data });
    return this.toDomain(created);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ checkIns: CheckIn[]; total: number }> {
    const [checkIns, total] = await Promise.all([
      this.prisma.tecCheckIn.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.tecCheckIn.count({ where: { userId } }),
    ]);

    return {
      checkIns: checkIns.map((c) => this.toDomain(c)),
      total,
    };
  }

  async findLatestByUserId(userId: string): Promise<CheckIn | null> {
    const checkIn = await this.prisma.tecCheckIn.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return checkIn ? this.toDomain(checkIn) : null;
  }

  private toDomain(prismaCheckIn: any): CheckIn {
    return new CheckIn({
      id: prismaCheckIn.id,
      userId: prismaCheckIn.userId,
      date: prismaCheckIn.date,
      signal: prismaCheckIn.signal as SignalType,
      xpEarned: prismaCheckIn.xpEarned,
      streakDay: prismaCheckIn.streakDay,
      createdAt: prismaCheckIn.createdAt,
    });
  }

  private toPersistence(checkIn: CheckIn): any {
    return {
      userId: checkIn.userId,
      date: checkIn.date,
      signal: checkIn.signal,
      xpEarned: checkIn.xpEarned,
      streakDay: checkIn.streakDay,
      createdAt: checkIn.createdAt,
    };
  }
}
