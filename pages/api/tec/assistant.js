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

// Singleton instance to maintain conversation history across requests
const assistantService = new AiAssistantService();

// Lazy-loaded governance module with fallback for resilience
let tecAssistantGovernance = null;
let governanceLoadAttempted = false;

/**
 * Lazy load governance module on first request
 * This avoids race conditions and allows the app to start even if governance fails
 */
async function getGovernance() {
  if (governanceLoadAttempted) {
    return tecAssistantGovernance;
  }
  
  governanceLoadAttempted = true;
  try {
    const governanceModule = await import("../../../lib/assistant/governance.js");
    tecAssistantGovernance = governanceModule.tecAssistantGovernance;
    return tecAssistantGovernance;
  } catch (e) {
    console.warn("Governance module failed to load, using fallback mode:", e.message);
    return null;
  }
}

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

    // Try to process through Governance Layer, with fallback
    let governedResponse = null;
    try {
      const governance = await getGovernance();
      if (governance) {
        governedResponse = await governance.processGovernedRequest(
          effectiveUserId,
          message,
          governanceContext
        );
        
        // If governance denied access, return denial
        if (!governedResponse.success) {
          return res.status(403).json(governedResponse);
        }
      } else {
        console.warn("Governance not available, using fallback mode");
      }
    } catch (govError) {
      console.warn("Governance processing failed, bypassing:", govError.message);
      // Fall through to return assistant response without governance
    }

    // If governance succeeded, merge insights with assistant response
    if (governedResponse && governedResponse.success) {
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
    }

    // Fallback: Return basic response without governance
    return res.status(200).json({
      success: true,
      ...assistantResponse,
      language: 'en',
      responseType: 'advisory',
      governance: {
        approved: true,
        domains: ['system'],
        restrictions: [],
        mode: 'fallback_no_governance'
      },
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
