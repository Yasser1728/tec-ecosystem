/**
 * User Repository Interface - TEC Assistant Domain
 * Contract for user data persistence
 */

import { User } from "../../entities/User";

export interface IUserRepository {
  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by Pi UID
   */
  findByPiUid(piUid: string): Promise<User | null>;

  /**
   * Find user by Pi username
   */
  findByPiUsername(piUsername: string): Promise<User | null>;

  /**
   * Create a new user
   */
  create(user: User): Promise<User>;

  /**
   * Update an existing user
   */
  update(user: User): Promise<User>;

  /**
   * Delete a user (soft delete recommended)
   */
  delete(id: string): Promise<void>;

  /**
   * Get users with pagination
   */
  list(page: number, limit: number): Promise<{ users: User[]; total: number }>;
}
