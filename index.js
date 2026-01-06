// index.js
const fs = require('fs');

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

async function smartFileCreator() {
  const newFileName = "api-handler.js"; // اسم الملف الجديد الذي تريد إنشاؤه
  const filePurpose = "إنشاء وظيفة لإرسال البيانات إلى قاعدة البيانات باستخدام Prisma";

  // 1. طلب كتابة الكود وفحصه من Claude (الأفضل في منع الأخطاء المنطقية)
  const prompt = `بصفتك مهندس برمجيات محترف، قم بإنشاء ملف باسم [${newFileName}] لغرض: ${filePurpose}.
  شروط صارمة:
  1. امنع أي "بج" (Bugs) أو تعارض مع ملفات Prisma الحالية.
  2. تأكد من أن الكود نظيف ويتبع معايير النظافة البرمجية (Clean Code).
  3. قدم لي الكود فقط داخل وسم الكود لسهولة استخراجه.`;

  console.log(`⏳ جاري تصميم وفحص الملف [${newFileName}] بواسطة Claude...`);
  const aiCode = await askAI(process.env.CLAUDE_MODEL, prompt);

  // 2. تنظيف الرد واستخراج الكود فقط
  const finalCode = aiCode.replace(/```javascript|```/g, "").trim();

  // 3. منع الأخطاء في إنشاء الملفات (تأكد من عدم وجود الملف مسبقاً لمنع الكتابة فوقه بالخطأ)
  if (!fs.existsSync(newFileName)) {
    fs.writeFileSync(newFileName, finalCode);
    console.log(`✅ تم إنشاء الملف [${newFileName}] بنجاح وبدون أخطاء منطقية.`);
  } else {
    console.log(`⚠️ تنبيه: الملف [${newFileName}] موجود بالفعل. تم منع الكتابة فوقه لحماية مشروعك.`);
  }

  // 4. رفع الملف كـ Artifact لتنزيله ومراجعته
  console.log("\n--- تم تجهيز الملف، يمكنك العثور عليه في قسم Artifacts في GitHub ---");
}

smartFileCreator();
