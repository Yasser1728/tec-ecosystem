/**
 * TEC Assistant Configuration
 */

export const TEC_ASSISTANT_CONFIG = {
  // Gamification
  BASE_XP: 10,
  STREAK_MULTIPLIER: 2,
  PREMIUM_MULTIPLIER: 1.5,
  XP_PER_LEVEL: 100,

  // Features
  FEATURES: {
    ADVANCED_SIGNALS: {
      key: "advanced_signals",
      name: "Advanced Signals",
      description: "Get AI-powered personalized daily signals",
      price: 10,
      currency: "PI",
    },
    SIGNAL_HISTORY: {
      key: "signal_history",
      name: "Signal History",
      description: "Access your complete signal history",
      price: 5,
      currency: "PI",
    },
    PREMIUM_INSIGHTS: {
      key: "premium_insights",
      name: "Premium Insights",
      description: "Unlock AI-powered behavioral insights",
      price: 15,
      currency: "PI",
    },
  },

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
};

export const getFeatureByKey = (key: string) => {
  return Object.values(TEC_ASSISTANT_CONFIG.FEATURES).find(
    (f) => f.key === key,
  );
};
