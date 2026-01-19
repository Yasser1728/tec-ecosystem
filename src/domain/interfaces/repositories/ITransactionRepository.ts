/**
 * Transaction Repository Interface - TEC Assistant Domain
 * Contract for transaction data persistence
 */

import { Transaction } from '../../entities/Transaction';

export interface ITransactionRepository {
  /**
   * Find transaction by ID
   */
  findById(id: string): Promise<Transaction | null>;

  /**
   * Find transaction by Pi payment ID
   */
  findByPiPaymentId(piPaymentId: string): Promise<Transaction | null>;

  /**
   * Create a new transaction
   */
  create(transaction: Transaction): Promise<Transaction>;

  /**
   * Update an existing transaction
   */
  update(transaction: Transaction): Promise<Transaction>;

  /**
   * Get user transactions with pagination
   */
  findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: Transaction[]; total: number }>;
}
