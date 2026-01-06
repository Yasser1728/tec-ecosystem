// index.js

async function callOpenRouter() {
    // يقرأ اسم النموذج من Secret في GitHub أو يستخدم Gemini كافتراضي
    const modelName = process.env.MY_MODEL_NAME || "google/gemini-pro-1.5";
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                // يستخدم المفتاح العام الذي ربطناه بـ GitHub Secrets
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": modelName,
                "messages": [
                    { "role": "user", "content": "هل كل دومين يحتفظ بقيمته؟" }
                ]
            })
        });

        const data = await response.json();
        
        console.log("--- معلومات التشغيل ---");
        console.log(`النموذج المستخدم: ${modelName}`);
        console.log("الرد:", data.choices[0].message.content);

    } catch (error) {
        console.error("فشل الاتصال بـ OpenRouter:", error);
    }
}

callOpenRouter();
