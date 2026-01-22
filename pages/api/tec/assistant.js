/**
 * TEC AI Assistant API Endpoint
 * Handles chat interactions with the TEC AI Assistant
 *
 * @route POST /api/tec/assistant
 */

const AiAssistantService = require("../../../apps/tec/services/aiAssistantService");

// Singleton instance to maintain conversation history across requests
const assistantService = new AiAssistantService();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const { message, userId, context } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string",
      });
    }

    // Use session userId or default to 'guest'
    const effectiveUserId = userId || req.session?.user?.id || "guest";

    // Process message through AI Assistant Service
    const response = await assistantService.processMessage(
      effectiveUserId,
      message,
      context || {},
    );

    // Return successful response
    return res.status(200).json({
      success: true,
      ...response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in assistant API:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to process message",
      message:
        "An error occurred while processing your request. Please try again.",
      content:
        "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
    });
  }
}
