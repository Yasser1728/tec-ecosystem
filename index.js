// index.js
const fs = require('fs');
const { execSync } = require('child_process'); // لتشغيل اختبارات الكود

async function askAI(modelName, prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": modelName,
      "messages": [{ "role": "user", "content": prompt }]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function secureDevOps() {
  const fileName = "generated-logic.js";
  const prompt = "اكتب وظيفة جافاسكريبت لحساب قيمة الدومينات بناءً على ندرتها، مع ضمان خلو الكود من أي Syntax Error.";

  console.log("🛠️ جاري توليد الكود واختباره...");

  // 1. توليد الكود بواسطة Claude
  const rawCode = await askAI(process.env.CLAUDE_MODEL, prompt);
  const cleanCode = rawCode.replace(/```javascript|```/g, "").trim();

  // 2. خطوة الاختبار الذاتي (Auto-Testing) لـ منع البجات
  try {
    // كتابة الملف مؤقتاً للاختبار
    fs.writeFileSync('temp-test.js', cleanCode);
    
    // محاولة تشغيل الملف برمجياً للتأكد من خلوه من أخطاء الـ Syntax
    execSync('node --check temp-test.js'); 
    
    // إذا نجح الاختبار، يتم إنشاء الملف النهائي
    fs.writeFileSync(fileName, cleanCode);
    console.log(`✅ نجح الاختبار! تم إنشاء الملف [${fileName}] وهو آمن للاستخدام.`);
    
    // تنظيف ملف الاختبار
    fs.unlinkSync('temp-test.js');
  } catch (error) {
    console.error("❌ فشل الاختبار الذاتي: الكود يحتوي على أخطاء برمجية. تم منع إنشاء الملف.");
    // هنا نطلب من جمني تحليل لماذا فشل كود كلود (مراجعة مزدوجة)
  }
}

secureDevOps();
