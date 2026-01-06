// index.js
const fs = require('fs'); // مكتبة قراءة الملفات

async function askAI(modelName, prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, //
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": modelName,
        "messages": [{ "role": "user", "content": prompt }]
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "لا يوجد رد.";
  } catch (error) {
    return `خطأ في الاتصال بـ ${modelName}: ${error.message}`;
  }
}

async function runAnalysis() {
  // 1. قراءة محتوى ملف الـ YAML أو أي ملف كود تريد فحصه
  // هنا سنقرأ ملف الـ Workflow نفسه كمثال
  let codeSnippet = "";
  try {
    codeSnippet = fs.readFileSync('.github/workflows/main.yml', 'utf8');
  } catch (e) {
    codeSnippet = "لم يتم العثور على الملف المحدد لفحصه.";
  }

  const prompt = `أنا مبرمج محترف، حلل هذا الكود واكتشف أي أخطاء أو تحسينات ممكنة:\n\n${codeSnippet}`;

  console.log("⏳ جاري قراءة ملفاتك واستشارة العمالقة...");

  // تشغيل الاستشارة المزدوجة
  const [claudeReply, geminiReply] = await Promise.all([
    askAI(process.env.CLAUDE_MODEL, prompt),
    askAI(process.env.GEMINI_MODEL, prompt)
  ]);

  console.log("\n--- 🤖 تحليل Claude 3.5 (خبير المنطق) ---");
  console.log(claudeReply);

  console.log("\n--- 🤖 تحليل Gemini 1.5 (خبير السياق) ---");
  console.log(geminiReply);
}

runAnalysis();
