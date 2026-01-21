/**
 * AI Service Interface - TEC Assistant Domain
 * Contract for AI integration (future enhancement)
 */

export interface AiSignalInput {
  userId: string;
  date: Date;
  userHistory?: {
    totalXp: number;
    currentStreak: number;
    recentCheckIns: Date[];
  };
}

export interface AiSignalResult {
  signalType: "POSITIVE" | "NEUTRAL" | "CAUTION";
  confidence: number;
  reasoning: string;
  metadata: Record<string, unknown>;
}

export interface IAiService {
  /**
   * Generate personalized signal using AI
   * This is a placeholder for future AI enhancement
   */
  generatePersonalizedSignal(input: AiSignalInput): Promise<AiSignalResult>;

  /**
   * Analyze user behavior patterns
   */
  analyzeUserBehavior(userId: string): Promise<{
    insights: string[];
    recommendations: string[];
  }>;
}
