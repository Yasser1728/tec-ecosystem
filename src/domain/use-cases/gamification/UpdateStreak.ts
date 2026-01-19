/**
 * Update Streak Use Case - TEC Assistant Domain
 * Updates user streak based on check-in history
 */

import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { ICheckInRepository } from '../../interfaces/repositories/ICheckInRepository';

export interface UpdateStreakInput {
  userId: string;
}

export interface UpdateStreakOutput {
  currentStreak: number;
  longestStreak: number;
  streakBroken: boolean;
}

export class UpdateStreak {
  constructor(
    private userRepository: IUserRepository,
    private checkInRepository: ICheckInRepository
  ) {}

  async execute(input: UpdateStreakInput): Promise<UpdateStreakOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const today = this.getStartOfDay(new Date());
    const latestCheckIn = await this.checkInRepository.findLatestByUserId(input.userId);

    let streakBroken = false;

    if (!latestCheckIn) {
      // No check-ins yet
      return {
        currentStreak: 0,
        longestStreak: user.longestStreak,
        streakBroken: false,
      };
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.getStartOfDay(yesterday).toISOString();
    const latestCheckInStr = this.getStartOfDay(latestCheckIn.date).toISOString();
    const todayStr = today.toISOString();

    // Check if streak should be maintained or broken
    if (latestCheckInStr === todayStr) {
      // Already checked in today, streak maintained
      return {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        streakBroken: false,
      };
    } else if (latestCheckInStr === yesterdayStr) {
      // Last check-in was yesterday, streak maintained
      return {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        streakBroken: false,
      };
    } else {
      // Streak broken
      user.resetStreak();
      await this.userRepository.update(user);
      streakBroken = true;

      return {
        currentStreak: 0,
        longestStreak: user.longestStreak,
        streakBroken: true,
      };
    }
  }

  /**
   * Get start of day (midnight)
   */
  private getStartOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
}
