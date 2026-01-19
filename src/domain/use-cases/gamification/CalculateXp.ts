/**
 * Calculate XP Use Case - TEC Assistant Domain
 * Calculates XP based on streak and other factors
 */

import { TEC_ASSISTANT_CONFIG } from '../../../shared/config/features';

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
  execute(input: CalculateXpInput): CalculateXpOutput {
    const baseXp = TEC_ASSISTANT_CONFIG.BASE_XP;
    const streakBonus = input.streakDay * TEC_ASSISTANT_CONFIG.STREAK_MULTIPLIER;
    const premiumBonus = input.additionalFactors?.premiumBonus
      ? Math.floor((baseXp + streakBonus) * (TEC_ASSISTANT_CONFIG.PREMIUM_MULTIPLIER - 1))
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
