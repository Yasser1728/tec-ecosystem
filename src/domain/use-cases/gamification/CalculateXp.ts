/**
 * Calculate XP Use Case - TEC Assistant Domain
 * Calculates XP based on streak and other factors
 */

export interface CalculateXpInput {
  streakDay: number;
  additionalFactors?: {
    premiumBonus?: boolean;
    eventBonus?: number;
  };
}

export interface CalculateXpOutput {
  baseXp: number;
  streakBonus: number;
  premiumBonus: number;
  eventBonus: number;
  totalXp: number;
}

export class CalculateXp {
  private readonly BASE_XP = 10;
  private readonly STREAK_MULTIPLIER = 2;
  private readonly PREMIUM_MULTIPLIER = 1.5;

  execute(input: CalculateXpInput): CalculateXpOutput {
    const baseXp = this.BASE_XP;
    const streakBonus = input.streakDay * this.STREAK_MULTIPLIER;
    const premiumBonus = input.additionalFactors?.premiumBonus
      ? Math.floor((baseXp + streakBonus) * (this.PREMIUM_MULTIPLIER - 1))
      : 0;
    const eventBonus = input.additionalFactors?.eventBonus || 0;

    const totalXp = baseXp + streakBonus + premiumBonus + eventBonus;

    return {
      baseXp,
      streakBonus,
      premiumBonus,
      eventBonus,
      totalXp,
    };
  }
}
