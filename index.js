// index.js

async function askAI(modelName, prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        // يستخدم المفتاح الموحد من GitHub Secrets
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": modelName,
        "messages": [{ "role": "user", "content": prompt }]
      })
    });
    const data = await response.json();
    
    // التحقق من وجود رد صحيح
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    } else {
      return `لم يتم استلام رد من ${modelName}. تأكد من صحة المفتاح والنموذج.`;
    }
  } catch (error) {
    return `خطأ في الاتصال بـ ${modelName}: ${error.message}`;
  }
}

async function runDualAnalysis() {
  // السؤال الموجه للنماذج
  const prompt = "هل كل دومين يحتفظ بقيمته؟ وما هي أفضل طريقة لحل أخطاء الأكواد المعقدة؟";

  console.log("⏳ جاري استشارة العمالقة (Claude & Gemini)...");

  // تشغيل الطلبين في وقت واحد لسرعة التنفيذ
  const [claudeReply, geminiReply] = await Promise.all([
    askAI(process.env.CLAUDE_MODEL || "anthropic/claude-3.5-sonnet", prompt),
    askAI(process.env.GEMINI_MODEL || "google/gemini-pro-1.5", prompt)
  ]);

  console.log("\n========================================");
  console.log("🤖 رد CLAUDE (للمنطق والبرمجة):");
  console.log("========================================\n");
  console.log(claudeReply);

  console.log("\n========================================");
  console.log("🤖 رد GEMINI (للسياق الشامل):");
  console.log("========================================\n");
  console.log(geminiReply);
}

runDualAnalysis();
