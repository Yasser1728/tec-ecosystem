const fs = require('fs');
const { execSync } = require('child_process');

// ============================================
// Configuration
// ============================================
const CONFIG = {
    models: {
        primary: process.env.CLAUDE_MODEL || "anthropic/claude-3.5-sonnet-20250129",
        reviewer: process.env.GEMINI_MODEL || "google/gemini-2.0-flash-exp",
        budget: process.env.BUDGET_MODEL || "deepseek/deepseek-chat"
    },
    
    maxAttempts: 3,
    timeout: 30000, // 30 seconds
    
    outputFiles: {
        code: "final-service.js",
        docs: "DOCUMENTATION.md",
        logs: "build.log"
    },
    
    // Smart mode selection
    useDualModel: (task) => {
        const criticalKeywords = [
            'payment', 'auth', 'security', 'encryption', 
            'banking', 'sensitive', 'critical'
        ];
        return criticalKeywords.some(k => task.toLowerCase().includes(k));
    }
};

// ============================================
// Rate Limiter
// ============================================
class RateLimiter {
    constructor(maxCallsPerMinute = 10) {
        this.calls = 0;
        this.windowStart = Date.now();
        this.maxCallsPerMinute = maxCallsPerMinute;
    }
    
    async checkLimit() {
        const now = Date.now();
        if (now - this.windowStart > 60000) {
            this.calls = 0;
            this.windowStart = now;
        }
        
        if (this.calls >= this.maxCallsPerMinute) {
            const waitTime = 60000 - (now - this.windowStart);
            console.log(`⏳ Rate limit reached. Waiting ${Math.ceil(waitTime/1000)}s...`);
            await new Promise(r => setTimeout(r, waitTime));
            this.calls = 0;
            this.windowStart = Date.now();
        }
        
        this.calls++;
    }
}

const rateLimiter = new RateLimiter(10);

// ============================================
// Logger
// ============================================
class Logger {
    constructor(filename) {
        this.filename = filename;
        this.logs = [];
    }
    
    log(level, message, data = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...data
        };
        
        this.logs.push(entry);
        
        const emoji = {
            info: '📘',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        }[level] || '📝';
        
        console.log(`${emoji} [${level.toUpperCase()}] ${message}`);
        
        if (data.detail) {
            console.log(`   ${data.detail}`);
        }
    }
    
    save() {
        fs.writeFileSync(
            this.filename, 
            JSON.stringify(this.logs, null, 2)
        );
    }
}

const logger = new Logger(CONFIG.outputFiles.logs);

// ============================================
// AI API Handler
// ============================================
async function askAI(modelName, prompt, options = {}) {
    const { 
        temperature = 0.7,
        maxTokens = 4000,
        timeout = CONFIG.timeout 
    } = options;
    
    await rateLimiter.checkLimit();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        logger.log('info', `Calling ${modelName}...`);
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/tec-ecosystem",
                "X-Title": "TEC Ecosystem AI Builder"
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: "user", content: prompt }],
                temperature,
                max_tokens: maxTokens
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        
        logger.log('success', `Response received from ${modelName}`, {
            detail: `Length: ${content.length} chars`
        });
        
        return content;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            logger.log('error', 'Request timeout', { model: modelName });
            throw new Error(`Timeout calling ${modelName}`);
        }
        
        logger.log('error', `AI call failed: ${error.message}`, { model: modelName });
        throw error;
    }
}

// ============================================
// Code Extraction & Validation
// ============================================
function extractCode(response) {
    // Try to extract code from markdown blocks
    const codeBlockRegex = /```(?:javascript|js)?\n([\s\S]*?)```/g;
    const matches = [...response.matchAll(codeBlockRegex)];
    
    if (matches.length > 0) {
        return matches[0][1].trim();
    }
    
    // If no code blocks, return cleaned response
    return response
        .replace(/```javascript|```js|```/g, '')
        .trim();
}

function testSyntax(code) {
    try {
        const tempFile = 'temp-syntax-check.js';
        fs.writeFileSync(tempFile, code);
        execSync(`node --check ${tempFile}`, { stdio: 'ignore' });
        fs.unlinkSync(tempFile);
        
        logger.log('success', 'Syntax validation passed');
        return true;
    } catch (error) {
        logger.log('error', 'Syntax validation failed', {
            detail: error.message
        });
        return false;
    }
}

// ============================================
// Single Model Generation
// ============================================
async function generateWithSingleModel(task) {
    logger.log('info', '⚡ Using SINGLE model strategy (fast)');
    
    const prompt = `
أنت مطور محترف متخصص في Node.js. المطلوب:

${task}

المتطلبات:
- كود نظيف وموثق (JSDoc comments)
- Error handling شامل
- Async/await best practices
- Security considerations
- Performance optimization
- اتبع naming conventions

قدم الكود الكامل فقط داخل \`\`\`javascript
لا تضع أي شرح خارج الكود.
    `;
    
    const response = await askAI(CONFIG.models.primary, prompt, {
        temperature: 0.3, // Lower for more deterministic code
        maxTokens: 6000
    });
    
    const code = extractCode(response);
    
    if (!testSyntax(code)) {
        throw new Error('Generated code has syntax errors');
    }
    
    return code;
}

// ============================================
// Dual Model Generation (with Review)
// ============================================
async function generateWithDualModel(task) {
    logger.log('info', '🔐 Using DUAL model strategy (high quality)');
    
    // Step 1: Generate with Claude
    logger.log('info', 'Step 1/3: Generating code...');
    const codePrompt = `
أنت مطور محترف. اكتب كود Node.js احترافي لـ:

${task}

المتطلبات:
- Security-first approach
- Comprehensive error handling
- Input validation
- Best practices
- Production-ready code

قدم الكود فقط داخل \`\`\`javascript
    `;
    
    const codeResponse = await askAI(CONFIG.models.primary, codePrompt);
    const code = extractCode(codeResponse);
    
    // Step 2: Review with Gemini
    logger.log('info', 'Step 2/3: Security review...');
    const reviewPrompt = `
حلل هذا الكود من ناحية:
1. Security vulnerabilities (SQL injection, XSS, etc.)
2. Error handling completeness
3. Input validation
4. Best practices compliance
5. Performance issues

الكود:
\`\`\`javascript
${code}
\`\`\`

إذا كان الكود آمن ومثالي، رد فقط بـ "APPROVED"
وإلا، اذكر المشاكل بوضوح وباختصار.
    `;
    
    const review = await askAI(CONFIG.models.reviewer, reviewPrompt);
    
    if (review.includes("APPROVED")) {
        logger.log('success', 'Code approved by reviewer');
        
        if (!testSyntax(code)) {
            throw new Error('Approved code has syntax errors');
        }
        
        return code;
    }
    
    // Step 3: Fix issues
    logger.log('warning', 'Issues found, fixing...', {
        detail: review.substring(0, 100) + '...'
    });
    
    const fixPrompt = `
أصلح المشاكل التالية في الكود:

المشاكل:
${review}

الكود الحالي:
\`\`\`javascript
${code}
\`\`\`

قدم الكود المصحح فقط داخل \`\`\`javascript
    `;
    
    const fixedResponse = await askAI(CONFIG.models.primary, fixPrompt);
    const fixedCode = extractCode(fixedResponse);
    
    if (!testSyntax(fixedCode)) {
        throw new Error('Fixed code still has syntax errors');
    }
    
    logger.log('success', 'Code fixed and validated');
    return fixedCode;
}

// ============================================
// Documentation Generation
// ============================================
async function generateDocumentation(code, task) {
    logger.log('info', 'Generating documentation...');
    
    const docPrompt = `
اكتب توثيقاً احترافياً بصيغة Markdown لهذا الكود:

المهمة: ${task}

الكود:
\`\`\`javascript
${code}
\`\`\`

التوثيق يجب أن يشمل:
1. # نظرة عامة (الغرض من الكود)
2. ## المتطلبات (Dependencies)
3. ## التثبيت (Installation)
4. ## الاستخدام (Usage) مع أمثلة
5. ## الوظائف (Functions/Methods)
6. ## مثال كامل
7. ## الملاحظات الأمنية (إن وجدت)
8. ## License

قدم التوثيق فقط بصيغة Markdown.
    `;
    
    const documentation = await askAI(CONFIG.models.reviewer, docPrompt, {
        temperature: 0.7,
        maxTokens: 3000
    });
    
    logger.log('success', 'Documentation generated');
    return documentation;
}

// ============================================
// Main Execution
// ============================================
async function runSuperAI() {
    console.log("\n🚀 ============================================");
    console.log("   TEC Ecosystem - AI Code Generator");
    console.log("   ============================================\n");
    
    // Validate API Key
    if (!process.env.OPENROUTER_API_KEY) {
        logger.log('error', 'OPENROUTER_API_KEY not found in environment variables');
        console.error('\n❌ Please set OPENROUTER_API_KEY in your .env file');
        process.exit(1);
    }
    
    // Task definition
    let task = process.env.TASK || 
        "إنشاء نظام متطور لإدارة وحساب قيمة الدومينات بناءً على الطول والامتداد والكلمات المفتاحية";
    
    logger.log('info', 'Task received', { detail: task });
    
    let attempts = 0;
    let success = false;
    let finalCode = null;
    
    // Select strategy
    const useDual = CONFIG.useDualModel(task);
    const strategy = useDual ? 'dual' : 'single';
    
    logger.log('info', `Strategy selected: ${strategy.toUpperCase()}`, {
        detail: useDual ? 'Critical task detected' : 'Standard generation'
    });
    
    while (attempts < CONFIG.maxAttempts && !success) {
        attempts++;
        logger.log('info', `\n--- Attempt ${attempts}/${CONFIG.maxAttempts} ---`);
        
        try {
            // Generate code
            if (strategy === 'dual') {
                finalCode = await generateWithDualModel(task);
            } else {
                finalCode = await generateWithSingleModel(task);
            }
            
            // Generate documentation
            const documentation = await generateDocumentation(finalCode, task);
            
            // Save files
            fs.writeFileSync(CONFIG.outputFiles.code, finalCode);
            fs.writeFileSync(CONFIG.outputFiles.docs, documentation);
            
            logger.log('success', '\n✨ Build completed successfully!', {
                detail: `Files: ${CONFIG.outputFiles.code}, ${CONFIG.outputFiles.docs}`
            });
            
            success = true;
            
        } catch (error) {
            logger.log('error', `Attempt ${attempts} failed: ${error.message}`);
            
            if (attempts < CONFIG.maxAttempts) {
                // Update task with error context
                task = `أصلح الخطأ التالي في المحاولة السابقة: ${error.message}\n\nالمهمة الأصلية: ${task}`;
                
                logger.log('warning', 'Retrying with error context...');
                await new Promise(r => setTimeout(r, 2000)); // Wait 2s before retry
            }
        }
    }
    
    // Save logs
    logger.save();
    
    if (!success) {
        logger.log('error', '\n🚫 Build failed after maximum attempts');
        console.error('\n❌ Failed to generate stable code. Check build.log for details.');
        process.exit(1);
    }
    
    // Summary
    console.log("\n📊 ============================================");
    console.log("   Build Summary");
    console.log("   ============================================");
    console.log(`   Strategy: ${strategy.toUpperCase()}`);
    console.log(`   Attempts: ${attempts}`);
    console.log(`   Output: ${CONFIG.outputFiles.code}`);
    console.log(`   Docs: ${CONFIG.outputFiles.docs}`);
    console.log(`   Logs: ${CONFIG.outputFiles.logs}`);
    console.log("   ============================================\n");
}

// ============================================
// Execute
// ============================================
if (require.main === module) {
    runSuperAI().catch(error => {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { askAI, generateWithSingleModel, generateWithDualModel };
