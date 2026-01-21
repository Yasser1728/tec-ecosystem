/**
 * Unlock Repository Implementation - TEC Assistant Domain
 */

import { PrismaClient } from "@prisma/client";
import { Unlock } from "../../../domain/entities/Unlock";
import { IUnlockRepository } from "../../../domain/interfaces/repositories/IUnlockRepository";

export class UnlockRepository implements IUnlockRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserAndFeature(
    userId: string,
    featureKey: string,
  ): Promise<Unlock | null> {
    const unlock = await this.prisma.tecUnlock.findUnique({
      where: { userId_featureKey: { userId, featureKey } },
    });
    return unlock ? this.toDomain(unlock) : null;
  }

  async create(unlock: Unlock): Promise<Unlock> {
    const data = this.toPersistence(unlock);
    const created = await this.prisma.tecUnlock.create({ data });
    return this.toDomain(created);
  }

  async findByUserId(userId: string): Promise<Unlock[]> {
    const unlocks = await this.prisma.tecUnlock.findMany({
      where: { userId },
      orderBy: { unlockedAt: "desc" },
    });
    return unlocks.map((u) => this.toDomain(u));
  }

  async hasUnlock(userId: string, featureKey: string): Promise<boolean> {
    const unlock = await this.findByUserAndFeature(userId, featureKey);
    return unlock !== null && unlock.isValid();
  }

  private toDomain(prismaUnlock: any): Unlock {
    return new Unlock({
      id: prismaUnlock.id,
      userId: prismaUnlock.userId,
      featureKey: prismaUnlock.featureKey,
      transactionId: prismaUnlock.transactionId || undefined,
      unlockedAt: prismaUnlock.unlockedAt,
      expiresAt: prismaUnlock.expiresAt || undefined,
    });
  }

  private toPersistence(unlock: Unlock): any {
    return {
      userId: unlock.userId,
      featureKey: unlock.featureKey,
      transactionId: unlock.transactionId,
      unlockedAt: unlock.unlockedAt,
      expiresAt: unlock.expiresAt,
    };
  }
}
