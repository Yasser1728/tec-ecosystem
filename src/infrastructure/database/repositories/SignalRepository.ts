/**
 * Signal Repository Implementation - TEC Assistant Domain
 */

import { PrismaClient } from "@prisma/client";
import { Signal, SignalType } from "../../../domain/entities/Signal";
import { ISignalRepository } from "../../../domain/interfaces/repositories/ISignalRepository";

export class SignalRepository implements ISignalRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Signal | null> {
    const signal = await this.prisma.tecSignal.findUnique({ where: { id } });
    return signal ? this.toDomain(signal) : null;
  }

  async findByDate(date: Date): Promise<Signal | null> {
    const signal = await this.prisma.tecSignal.findUnique({ where: { date } });
    return signal ? this.toDomain(signal) : null;
  }

  async create(signal: Signal): Promise<Signal> {
    const data = this.toPersistence(signal);
    const created = await this.prisma.tecSignal.create({ data });
    return this.toDomain(created);
  }

  async getHistory(
    page: number,
    limit: number,
  ): Promise<{ signals: Signal[]; total: number }> {
    const [signals, total] = await Promise.all([
      this.prisma.tecSignal.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
      this.prisma.tecSignal.count(),
    ]);

    return {
      signals: signals.map((s) => this.toDomain(s)),
      total,
    };
  }

  private toDomain(prismaSignal: any): Signal {
    return new Signal({
      id: prismaSignal.id,
      date: prismaSignal.date,
      type: prismaSignal.type as SignalType,
      confidence: prismaSignal.confidence || undefined,
      metadata: prismaSignal.metadata || undefined,
      generatedAt: prismaSignal.generatedAt,
    });
  }

  private toPersistence(signal: Signal): any {
    return {
      date: signal.date,
      type: signal.type,
      confidence: signal.confidence,
      metadata: signal.metadata,
      generatedAt: signal.generatedAt,
    };
  }
}
