/**
 * Signal Repository Interface - TEC Assistant Domain
 * Contract for signal data persistence
 */

import { Signal } from "../../entities/Signal";

export interface ISignalRepository {
  /**
   * Find signal by ID
   */
  findById(id: string): Promise<Signal | null>;

  /**
   * Find signal by date
   */
  findByDate(date: Date): Promise<Signal | null>;

  /**
   * Create a new signal
   */
  create(signal: Signal): Promise<Signal>;

  /**
   * Get signal history with pagination
   */
  getHistory(
    page: number,
    limit: number,
  ): Promise<{ signals: Signal[]; total: number }>;
}
