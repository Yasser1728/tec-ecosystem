/**
 * TEC AI Assistant API Endpoint
 * Handles chat interactions with the TEC AI Assistant
 * 
 * @route POST /api/tec/assistant
 */

import { z } from 'zod';
import { withApiGuard } from '../../../lib/api-guard.js';

const AiAssistantService = require('../../../domains/tec/services/aiAssistantService');

// Singleton instance to maintain conversation history across requests
const assistantService = new AiAssistantService();

// Request validation schema
const assistantRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  userId: z.string().optional(),
  context: z.record(z.unknown()).optional(),
});

async function handler(req, res) {
  const requestId = req.requestId;

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.',
      requestId,
    });
  }

  try {
    // Validate request body with zod
    const validationResult = assistantRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request payload',
        // Only include validation details in development
        ...(process.env.NODE_ENV === 'development' && { details: validationResult.error.errors }),
        requestId,
      });
    }

    const { message, userId, context } = validationResult.data;

    // Use session userId or default to 'guest'
    const effectiveUserId = userId || req.session?.user?.id || 'guest';

    // Process message through AI Assistant Service
    const response = await assistantService.processMessage(
      effectiveUserId,
      message,
      context || {}
    );

    // Return successful response with structured format
    return res.status(200).json({
      success: true,
      ...response,
      requestId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(`[TEC Assistant] Error (requestId: ${requestId}):`, error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process message',
      message: 'An error occurred while processing your request. Please try again.',
      content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
      requestId,
    });
  }
}

// Apply API guard with rate limiting (20 req/min) and body size limit (64 KB)
export default withApiGuard(handler, {
  maxRequests: 20,
  maxBodySize: 64 * 1024,
});
