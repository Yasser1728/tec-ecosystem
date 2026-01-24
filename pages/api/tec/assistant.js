/**
 * TEC AI Assistant API Endpoint
 * Handles chat interactions with the TEC AI Assistant
 * 
 * Integrates with Governance Layer for:
 * - Language detection (Arabic/English)
 * - Domain sovereignty enforcement
 * - Zero-Trust security verification
 * - Decision Dashboard output (not raw analytics)
 * - No behavioral tracking or marketing analytics
 *
 * @route POST /api/tec/assistant
 */

import AiAssistantService from "../../../apps/tec/services/aiAssistantService.js";
import { tecAssistantGovernance } from "../../../lib/assistant/governance.js";

// Singleton instance to maintain conversation history across requests
const assistantService = new AiAssistantService();

// Development/Sandbox mode - bypass governance for faster testing
const BYPASS_GOVERNANCE = process.env.NEXT_PUBLIC_PI_SANDBOX === "true" || 
                          process.env.PI_SANDBOX_MODE === "true" ||
                          process.env.NODE_ENV === "development";

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
    const assistantResponse = await assistantService.processMessage(
      effectiveUserId,
      message,
      context || {},
    );

    // In development/sandbox mode, bypass governance
    if (BYPASS_GOVERNANCE) {
      return res.status(200).json({
        success: true,
        ...assistantResponse,
        language: 'en',
        responseType: 'advisory',
        governance: {
          approved: true,
          domains: ['system'],
          restrictions: [],
          mode: 'sandbox_bypass'
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Build governance context
    const governanceContext = {
      sessionId: req.cookies?.sessionId,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      headers: req.headers,
      userRole: req.session?.user?.tier || 'STANDARD',
      ...context
    };

    // Process through Governance Layer
    const governedResponse = await tecAssistantGovernance.processGovernedRequest(
      effectiveUserId,
      message,
      governanceContext
    );

    // If governance denied access, return denial
    if (!governedResponse.success) {
      return res.status(403).json(governedResponse);
    }

    // Merge governed insights with assistant response
    const finalResponse = {
      success: true,
      language: governedResponse.language,
      responseType: 'advisory', // Always advisory, never executable
      ...assistantResponse,
      governance: {
        approved: true,
        domains: governedResponse.governance.domains,
        restrictions: governedResponse.governance.restrictions
      },
      decisionDashboard: governedResponse.dashboard,
      insights: governedResponse.insights,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(finalResponse);
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
