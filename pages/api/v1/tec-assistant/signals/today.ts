/**
 * TEC Assistant - Today's Signal API
 * GET /api/v1/tec-assistant/signals/today
 */

import type { NextApiRequest, NextApiResponse } from "next";

// Mock signal generator for development
function generateTodaySignal() {
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  
  const mod = Math.abs(hash) % 3;
  const signalTypes = ["POSITIVE", "NEUTRAL", "CAUTION"];
  const type = signalTypes[mod];
  
  const displayInfo = {
    POSITIVE: {
      color: "green",
      emoji: "🟢",
      message: "Great day ahead! Opportunities are favorable.",
    },
    NEUTRAL: {
      color: "blue",
      emoji: "🔵",
      message: "Balanced day. Proceed with normal activities.",
    },
    CAUTION: {
      color: "yellow",
      emoji: "🟡",
      message: "Exercise caution. Review decisions carefully.",
    },
  };
  
  return {
    id: `signal-${dateString}`,
    date: today.toISOString(),
    type,
    ...displayInfo[type as keyof typeof displayInfo],
    generatedAt: new Date().toISOString(),
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: { message: "Method not allowed" } });
  }

  try {
    // For development, use mock signal
    // In production, this would use database
    const signal = generateTodaySignal();

    return res.status(200).json({
      success: true,
      data: {
        signal,
      },
    });
  } catch (error) {
    console.error("Get signal error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get today's signal";
    return res.status(500).json({
      success: false,
      error: {
        code: "SIGNAL_ERROR",
        message: errorMessage,
      },
    });
  }
}
