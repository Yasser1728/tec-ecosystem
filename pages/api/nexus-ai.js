import { z } from 'zod';
import { withApiGuard } from "../../lib/api-guard.js";
import { TEC_KNOWLEDGE, SYSTEM_PROMPT } from "../../lib/nexus-ai-knowledge";

// Request validation schema
const nexusRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).optional().default([]),
});

async function handler(req, res) {
  const requestId = req.requestId;

  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method not allowed",
      requestId,
    });
  }

  // Validate request body with zod
  const validationResult = nexusRequestSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    return res.status(400).json({ 
      error: "Invalid request payload",
      details: validationResult.error.errors,
      requestId,
    });
  }

  const { message, history } = validationResult.data;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OpenAI API key not configured",
      response:
        "TEC Nexus AI is currently being configured. Please try again later.",
      requestId,
    });
  }

  try {
    // Dynamic import to avoid build-time issues
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\nKnowledge Base:\n${TEC_KNOWLEDGE}`,
      },
      ...history.slice(-10), // Keep last 10 messages for context
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;

    res.status(200).json({ 
      response,
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[Nexus AI] Error (requestId: ${requestId}):`, error.message);

    // Fallback response if OpenAI fails
    const fallbackResponse =
      message.includes("عربي") || message.includes("العربية")
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
      response: fallbackResponse,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}

// Apply API guard with rate limiting (15 req/min) and body size limit (64 KB)
export default withApiGuard(handler, {
  maxRequests: 15,
  maxBodySize: 64 * 1024,
});
