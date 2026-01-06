// index.js
const fs = require('fs');
const { execSync } = require('child_process');

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

async function runSelfHealingDev() {
    const fileName = "generated-api.js";
    let prompt = "اكتب كود Node.js لإنشاء API بسيطة، تأكد من خلوه من الأخطاء.";
    let attempts = 0;
    const maxAttempts = 3; // محاولة التصحيح حتى 3 مرات
    let success = false;

    console.log("🚀 بدء عملية التطوير الذاتي...");

    while (attempts < maxAttempts && !success) {
        attempts++;
        console.log(`📡 محاولة رقم ${attempts}: جاري طلب الك code...`);
        
        const rawCode = await askAI(process.env.CLAUDE_MODEL, prompt);
        const cleanCode = rawCode.replace(/```javascript|```/g, "").trim();

        try {
            fs.writeFileSync('temp-test.js', cleanCode);
            // اختبار الـ Syntax
            execSync('node --check temp-test.js');
            
            // إذا نجح الاختبار
            fs.writeFileSync(fileName, cleanCode);
            console.log(`✅ نجح الاختبار في المحاولة رقم ${attempts}!`);
            success = true;
            if (fs.existsSync('temp-test.js')) fs.unlinkSync('temp-test.js');
        } catch (error) {
            console.error(`❌ فشل الاختبار في المحاولة ${attempts}. جاري إرسال الخطأ للتصحيح...`);
            // إخبار الذكاء الاصطناعي بالخطأ الذي حدث تحديداً ليقوم بإصلاحه
            prompt = `الكود الذي قدمته سابقاً يحتوي على خطأ: [${error.message}]. 
                      يرجى إعادة كتابة الكود وإصلاح هذا الخطأ تحديداً. 
                      تذكر أن تقدم الكود فقط.`;
        }
    }

    if (!success) {
        console.error("🚫 فشل التصحيح التلقائي بعد عدة محاولات.");
        process.exit(1);
    }
}

runSelfHealingDev();
