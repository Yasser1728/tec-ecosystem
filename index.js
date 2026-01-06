// index.js
const fs = require('fs');

async function askAI(modelName, prompt) {
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
}

async function fixMyErrors() {
  // قراءة ملف الـ workflow أو أي ملف برمجي تريد إصلاحه
  const filePath = '.github/workflows/main.yml'; 
  const code = fs.readFileSync(filePath, 'utf8');

  // إرسال أمر الإصلاح لـ Claude (الأفضل في المنطق)
  const prompt = `أنا مبرمج، لدي هذا الملف [${filePath}] وبه أخطاء محتملة.
  1. حدد الأخطاء بدقة.
  2. قدم لي الكود كاملاً بعد الإصلاح.
  3. اشرح لماذا هذا الحل أفضل.
  
  الكود الحالي:
  \n\n${code}`;

  console.log("🛠️ جاري تحليل وإصلاح الأخطاء بواسطة Claude 3.5 Sonnet...");
  
  const fixResult = await askAI(process.env.CLAUDE_MODEL, prompt);
  
  console.log("\n========================================");
  console.log("✅ تقرير الإصلاح والكود الجديد:");
  console.log("========================================\n");
  console.log(fixResult);
}

fixMyErrors();
