/**
 * Transaction Repository Implementation - TEC Assistant Domain
 */

import { PrismaClient } from '@prisma/client';
import { Transaction, TransactionType, TransactionStatus } from '../../../domain/entities/Transaction';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/ITransactionRepository';

export class TransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.tecTransaction.findUnique({ where: { id } });
    return transaction ? this.toDomain(transaction) : null;
  }

  async findByPiPaymentId(piPaymentId: string): Promise<Transaction | null> {
    const transaction = await this.prisma.tecTransaction.findUnique({
      where: { piPaymentId },
    });
    return transaction ? this.toDomain(transaction) : null;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const data = this.toPersistence(transaction);
    const created = await this.prisma.tecTransaction.create({ data });
    return this.toDomain(created);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const data = this.toPersistence(transaction);
    const updated = await this.prisma.tecTransaction.update({
      where: { id: transaction.id },
      data,
    });
    return this.toDomain(updated);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      this.prisma.tecTransaction.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tecTransaction.count({ where: { userId } }),
    ]);

    return {
      transactions: transactions.map((t) => this.toDomain(t)),
      total,
    };
  }

  private toDomain(prismaTransaction: any): Transaction {
    return new Transaction({
      id: prismaTransaction.id,
      userId: prismaTransaction.userId,
      piPaymentId: prismaTransaction.piPaymentId,
      txHash: prismaTransaction.txHash || undefined,
      amount: Number(prismaTransaction.amount),
      type: prismaTransaction.type as TransactionType,
      status: prismaTransaction.status as TransactionStatus,
      itemId: prismaTransaction.itemId || undefined,
      metadata: prismaTransaction.metadata || undefined,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt,
      completedAt: prismaTransaction.completedAt || undefined,
    });
  }

  private toPersistence(transaction: Transaction): any {
    return {
      userId: transaction.userId,
      piPaymentId: transaction.piPaymentId,
      txHash: transaction.txHash,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      itemId: transaction.itemId,
      metadata: transaction.metadata,
      updatedAt: transaction.updatedAt,
      completedAt: transaction.completedAt,
    };
  }
}
