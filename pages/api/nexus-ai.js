import { TEC_KNOWLEDGE, SYSTEM_PROMPT } from "../../lib/nexus-ai-knowledge";
import { sanitizeInput, recordCost } from "../../lib/api-guard";

// Rate limiting configuration
const RATE_LIMIT = { maxRequests: 20, windowMs: 60 * 1000 }; // 20 requests per minute
const COST_LIMIT = { maxCostPerHour: 5.0 };
const BODY_SIZE_LIMIT = { maxSize: 20 * 1024 }; // 20KB

// Schema validation
const MESSAGE_SCHEMA = {
  message: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 2000
  },
  history: {
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
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false,
      error: "Method not allowed" 
    });
  }

  try {
    // Apply guards
    const { rateLimit, costLimit, bodySizeGuard, validateSchema } = await import("../../lib/api-guard");
    
    await runMiddleware(req, res, rateLimit(RATE_LIMIT));
    await runMiddleware(req, res, costLimit(COST_LIMIT));
    await runMiddleware(req, res, bodySizeGuard(BODY_SIZE_LIMIT));
    await runMiddleware(req, res, validateSchema(MESSAGE_SCHEMA));
  } catch (error) {
    // Middleware already sent response
    return;
  }

  const { message, history = [] } = req.body;

  // Sanitize input
  const sanitizedMessage = sanitizeInput(message);

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      success: false,
      error: "OpenAI API key not configured",
      response:
        "TEC Nexus AI is currently being configured. Please try again later.",
    });
  }

  try {
    // Dynamic import to avoid build-time issues
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Sanitize history
    const sanitizedHistory = Array.isArray(history) 
      ? history.slice(-10)
          .filter(msg => msg && typeof msg === 'object' && msg.role)
          .map(msg => ({
            role: msg.role,
            content: sanitizeInput(msg.content || '')
          }))
      : [];

    const messages = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\nKnowledge Base:\n${TEC_KNOWLEDGE}`,
      },
      ...sanitizedHistory,
      {
        role: "user",
        content: sanitizedMessage,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    
    // Record estimated cost (approximate: $0.01 per request)
    recordCost(req, 0.01);

    res.status(200).json({ 
      success: true,
      response 
    });
  } catch (error) {
    console.error("TEC Nexus AI Error:", error);

    // Fallback response if OpenAI fails
    const fallbackResponse =
      sanitizedMessage.includes("عربي") || sanitizedMessage.includes("العربية")
        ? `مرحباً بك في TEC Nexus AI! 🌟

أنا هنا لمساعدتك في استكشاف 24 دومين فاخر في TEC. يمكنني مساعدتك في:

📊 **الاستثمار**: FundX, Assets, NBF
🏠 **العقارات**: Estate, Brookfield, Zone
✈️ **السفر الفاخر**: Explorer
🤝 **التواصل النخبوي**: Connection, Nexus, Elite

كيف يمكنني مساعدتك اليوم؟`
        : `Welcome to TEC Nexus AI! 🌟

I'm here to help you explore TEC's 24 elite business services. I can assist you with:

📊 **Investments**: FundX, Assets, NBF
🏠 **Real Estate**: Estate, Brookfield, Zone
✈️ **Luxury Travel**: Explorer
🤝 **Elite Networking**: Connection, Nexus, Elite

How can I help you today?`;

    res.status(200).json({ 
      success: true,
      response: fallbackResponse 
    });
  }
}

export default handler;
