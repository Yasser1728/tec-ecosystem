/**
 * CheckIn Repository Interface - TEC Assistant Domain
 * Contract for check-in data persistence
 */

import { CheckIn } from "../../entities/CheckIn";

export interface ICheckInRepository {
  /**
   * Find check-in by user ID and date
   */
  findByUserAndDate(userId: string, date: Date): Promise<CheckIn | null>;

  /**
   * Create a new check-in
   */
  create(checkIn: CheckIn): Promise<CheckIn>;

  /**
   * Get user check-in history with pagination
   */
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ checkIns: CheckIn[]; total: number }>;

  /**
   * Get latest check-in for a user
   */
  findLatestByUserId(userId: string): Promise<CheckIn | null>;
}
