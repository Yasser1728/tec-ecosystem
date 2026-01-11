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

// Define validation schema
const assistantRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  userId: z.string().optional(),
  context: z.record(z.any()).optional(),
});

async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { message, userId, context } = req.body;

    // Use session userId or default to 'guest'
    const effectiveUserId = userId || req.session?.user?.id || 'guest';

    // Process message through AI Assistant Service
    const response = await assistantService.processMessage(
      effectiveUserId,
      message,
      context || {}
    );

    // Return successful response
    return res.status(200).json({
      success: true,
      ...response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in assistant API:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process message',
      message: 'An error occurred while processing your request. Please try again.',
      content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
    });
  }
}

// Export handler with API guard (20 requests per minute)
export default withApiGuard(handler, {
  schema: assistantRequestSchema,
  rateLimit: 20,
  maxBodySize: 1 * 1024 * 1024, // 1MB
});
