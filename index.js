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

async function runSuperAI() {
    const fileName = "final-service.js";
    const docName = "DOCUMENTATION.md";
    let task = "إنشاء نظام متطور لإدارة وحساب قيمة الدومينات بناءً على الطول والامتداد والكلمات المفتاحية";
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;

    console.log("🚀 انطلاق النظام الشامل: تطوير، تصحيح، وتوثيق...");

    while (attempts < maxAttempts && !success) {
        attempts++;
        console.log(`\n--- 🏗️ محاولة رقم ${attempts} ---`);

        // 1. كلود يكتب الكود (المنطق)
        console.log("🤖 Claude: جاري بناء المنطق...");
        const codeResponse = await askAI(process.env.CLAUDE_MODEL, `اكتب كود Node.js احترافي لـ: ${task}. قدم الكود فقط داخل وسم الكود.`);
        const code = codeResponse.replace(/```javascript|```/g, "").trim();

        // 2. جمني يراجع ويختبر المنطق (الأمان والجودة)
        console.log("🔍 Gemini: جاري المراجعة الأمنية والمنطقية...");
        const review = await askAI(process.env.GEMINI_MODEL, `حلل هذا الكود:\n${code}\nإذا كان مثالياً رد بـ "APPROVED". وإذا كان به خطأ اشرحه باختصار.`);

        if (review.includes("APPROVED")) {
            // 3. اختبار الـ Syntax العملي
            try {
                fs.writeFileSync('temp.js', code);
                execSync('node --check temp.js');
                
                // 4. نجاح! الآن نطلب التوثيق من Gemini
                console.log("📝 Gemini: جاري كتابة التوثيق الاحترافي...");
                const documentation = await askAI(process.env.GEMINI_MODEL, `اكتب توثيقاً احترافياً بصيغة Markdown لهذا الكود:\n${code}\nاشرح الغرض والوظائف وكيفية الاستخدام.`);
                
                fs.writeFileSync(fileName, code);
                fs.writeFileSync(docName, documentation);
                
                console.log(`✅ تم بنجاح! الملفات جاهزة: [${fileName}] و [${docName}]`);
                success = true;
                if (fs.existsSync('temp.js')) fs.unlinkSync('temp.js');
            } catch (error) {
                console.error("❌ فشل اختبار الـ Syntax. جاري إعادة المحاولة...");
                task = `أصلح خطأ الـ Syntax التالي: ${error.message} في هذا الكود:\n${code}`;
            }
        } else {
            console.warn(`⚠️ ملاحظة من المراجع: ${review}`);
            task = `أعد كتابة الكود وتفادى هذه المشكلة: ${review}\nالكود السابق: ${code}`;
        }
    }

    if (!success) {
        console.error("🚫 فشل النظام في الوصول لنتيجة مثالية.");
        process.exit(1);
    }
}

runSuperAI();
