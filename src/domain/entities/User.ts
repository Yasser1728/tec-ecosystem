/**
 * User Entity - TEC Assistant Domain
 * Pure domain model with no external dependencies
 */

import { TEC_ASSISTANT_CONFIG } from '../../shared/config/features';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum UserRole {
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  id: string;
  piUid: string;
  piUsername: string;
  walletAddress?: string;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get piUid(): string {
    return this.props.piUid;
  }

  get piUsername(): string {
    return this.props.piUsername;
  }

  get walletAddress(): string | undefined {
    return this.props.walletAddress;
  }

  get currentStreak(): number {
    return this.props.currentStreak;
  }

  get longestStreak(): number {
    return this.props.longestStreak;
  }

  get totalXp(): number {
    return this.props.totalXp;
  }

  get level(): number {
    return this.props.level;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get lastActiveAt(): Date | undefined {
    return this.props.lastActiveAt;
  }

  /**
   * Updates the user's streak based on check-in
   */
  updateStreak(newStreak: number): void {
    this.props.currentStreak = newStreak;
    if (newStreak > this.props.longestStreak) {
      this.props.longestStreak = newStreak;
    }
    this.props.updatedAt = new Date();
  }

  /**
   * Adds XP to the user and handles level progression
   */
  addXp(xp: number): void {
    this.props.totalXp += xp;
    
    // Level calculation: level = floor(sqrt(totalXp / XP_PER_LEVEL))
    const newLevel = Math.floor(Math.sqrt(this.props.totalXp / TEC_ASSISTANT_CONFIG.XP_PER_LEVEL));
    if (newLevel > this.props.level) {
      this.props.level = newLevel;
    }
    
    this.props.updatedAt = new Date();
  }

  /**
   * Resets the user's streak to zero
   */
  resetStreak(): void {
    this.props.currentStreak = 0;
    this.props.updatedAt = new Date();
  }

  /**
   * Updates last active timestamp
   */
  updateLastActive(): void {
    this.props.lastActiveAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Upgrades user to premium role
   */
  upgradeToPremium(): void {
    this.props.role = UserRole.PREMIUM;
    this.props.updatedAt = new Date();
  }

  /**
   * Changes user status
   */
  updateStatus(status: UserStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  /**
   * Returns a plain object representation
   */
  toObject(): UserProps {
    return { ...this.props };
  }
}
