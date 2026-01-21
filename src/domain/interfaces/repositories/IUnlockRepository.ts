/**
 * Unlock Repository Interface - TEC Assistant Domain
 * Contract for unlock data persistence
 */

import { Unlock } from "../../entities/Unlock";

export interface IUnlockRepository {
  /**
   * Find unlock by user and feature key
   */
  findByUserAndFeature(
    userId: string,
    featureKey: string,
  ): Promise<Unlock | null>;

  /**
   * Create a new unlock
   */
  create(unlock: Unlock): Promise<Unlock>;

  /**
   * Get all unlocks for a user
   */
  findByUserId(userId: string): Promise<Unlock[]>;

  /**
   * Check if user has unlocked a feature
   */
  hasUnlock(userId: string, featureKey: string): Promise<boolean>;
}
