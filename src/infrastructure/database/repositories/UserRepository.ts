/**
 * User Repository Implementation - TEC Assistant Domain
 * Prisma-based data persistence
 */

import { PrismaClient as TecPrismaClient } from ".prisma/client-tec";
import { User, UserStatus, UserRole } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";

export class UserRepository implements IUserRepository {
  constructor(private prisma: TecPrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.tecUser.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByPiUid(piUid: string): Promise<User | null> {
    const user = await this.prisma.tecUser.findUnique({ where: { piUid } });
    return user ? this.toDomain(user) : null;
  }

  async findByPiUsername(piUsername: string): Promise<User | null> {
    const user = await this.prisma.tecUser.findUnique({
      where: { piUsername },
    });
    return user ? this.toDomain(user) : null;
  }

  async create(user: User): Promise<User> {
    const data = this.toPersistence(user);
    const created = await this.prisma.tecUser.create({ data });
    return this.toDomain(created);
  }

  async update(user: User): Promise<User> {
    const data = this.toPersistence(user);
    const updated = await this.prisma.tecUser.update({
      where: { id: user.id },
      data,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tecUser.update({
      where: { id },
      data: { status: "DELETED" },
    });
  }

  async list(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      this.prisma.tecUser.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.tecUser.count(),
    ]);

    return {
      users: users.map((u) => this.toDomain(u)),
      total,
    };
  }

  private toDomain(prismaUser: any): User {
    return new User({
      id: prismaUser.id,
      piUid: prismaUser.piUid,
      piUsername: prismaUser.piUsername,
      walletAddress: prismaUser.walletAddress || undefined,
      currentStreak: prismaUser.currentStreak,
      longestStreak: prismaUser.longestStreak,
      totalXp: prismaUser.totalXp,
      level: prismaUser.level,
      status: prismaUser.status as UserStatus,
      role: prismaUser.role as UserRole,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      lastActiveAt: prismaUser.lastActiveAt || undefined,
    });
  }

  private toPersistence(user: User): any {
    return {
      piUid: user.piUid,
      piUsername: user.piUsername,
      walletAddress: user.walletAddress,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalXp: user.totalXp,
      level: user.level,
      status: user.status,
      role: user.role,
      updatedAt: user.updatedAt,
      lastActiveAt: user.lastActiveAt,
    };
  }
}
