/**
 * TEC AI Assistant API Endpoint
 * Handles chat interactions with the TEC AI Assistant
 * 
 * @route POST /api/tec/assistant
 */

const AiAssistantService = require('../../../domains/tec/services/aiAssistantService');

// Singleton instance to maintain conversation history across requests
const assistantService = new AiAssistantService();

// Rate limiting configuration
const RATE_LIMIT = { maxRequests: 30, windowMs: 60 * 1000 }; // 30 requests per minute
const COST_LIMIT = { maxCostPerHour: 3.0 };
const BODY_SIZE_LIMIT = { maxSize: 15 * 1024 }; // 15KB

// Schema validation
const ASSISTANT_SCHEMA = {
  message: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 1000
  },
  userId: {
    required: false,
    type: 'string'
  },
  context: {
    required: false,
    type: 'object'
  }
};

// Middleware runner helper
async function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Apply guards
    const { rateLimit, costLimit, bodySizeGuard, validateSchema, sanitizeInput } = await import('../../../lib/api-guard');
    
    await runMiddleware(req, res, rateLimit(RATE_LIMIT));
    await runMiddleware(req, res, costLimit(COST_LIMIT));
    await runMiddleware(req, res, bodySizeGuard(BODY_SIZE_LIMIT));
    await runMiddleware(req, res, validateSchema(ASSISTANT_SCHEMA));
  } catch (error) {
    // Middleware already sent response
    return;
  }

  try {
    const { sanitizeInput, recordCost } = await import('../../../lib/api-guard');
    const { message, userId, context } = req.body;

    // Sanitize message
    const sanitizedMessage = sanitizeInput(message);

    // Use session userId or default to 'guest'
    const effectiveUserId = userId || req.session?.user?.id || 'guest';

    // Process message through AI Assistant Service
    const response = await assistantService.processMessage(
      effectiveUserId,
      sanitizedMessage,
      context || {}
    );
    
    // Record minimal cost (mock service, minimal cost)
    recordCost(req, 0.001);

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

export default handler;
