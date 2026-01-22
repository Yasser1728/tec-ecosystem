# 🤖 TEC Assistant - دليل الاستخدام الكامل

## 📋 نظرة عامة

**TEC Assistant** هو المساعد الذكي للنظام البيئي TEC، يوفر:

- 🎯 **إشارات يومية** - توجيهات ذكية لكل يوم
- 💬 **دردشة تفاعلية** - دعم باللغتين العربية والإنجليزية
- 🔥 **نظام المكافآت** - Streak & XP system
- 💎 **مدفوعات Pi Network** - فتح المميزات المدفوعة

---

## ✅ الحالة الحالية

### شغال الآن:
- ✅ صفحة TEC Assistant (`/assistant`)
- ✅ Signals API (`/api/v1/tec-assistant/signals/today`)
- ✅ Chat API (`/api/tec/assistant`)
- ✅ دعم اللغة العربية
- ✅ دعم اللغة الإنجليزية
- ✅ Mock data mode (للتطوير بدون قاعدة بيانات)

### قيد التطوير:
- ⏳ Database integration
- ⏳ Pi Network payments
- ⏳ User authentication
- ⏳ Gamification system (Streaks & XP)

---

## 🚀 كيفية الاستخدام

### 1️⃣ فتح TEC Assistant

```
http://localhost:3000/assistant
```

أو في Production:
```
https://tec-ecosystem.vercel.app/assistant
```

### 2️⃣ استخدام Chat API

#### English Request:
```bash
curl -X POST http://localhost:3000/api/tec/assistant \
  -H "Content-Type: application/json" \
  -d '{"message":"What domains are available?"}'
```

#### Arabic Request:
```bash
curl -X POST http://localhost:3000/api/tec/assistant \
  -H "Content-Type: application/json" \
  -d '{"message":"ما هي المجالات المتاحة؟"}'
```

#### Response Format:
```json
{
  "success": true,
  "content": "Response text...",
  "suggestions": ["Option 1", "Option 2"],
  "links": [
    {"text": "Link Text", "url": "/path"}
  ],
  "timestamp": "2026-01-22T10:00:00.000Z"
}
```

### 3️⃣ الحصول على إشارة اليوم

```bash
curl http://localhost:3000/api/v1/tec-assistant/signals/today
```

#### Response:
```json
{
  "success": true,
  "data": {
    "signal": {
      "id": "signal-2026-01-22",
      "date": "2026-01-22T00:00:00.000Z",
      "type": "POSITIVE",
      "color": "green",
      "emoji": "🟢",
      "message": "Great day ahead! Opportunities are favorable.",
      "generatedAt": "2026-01-22T10:00:00.000Z"
    }
  }
}
```

---

## 🎨 Signal Types

### 🟢 POSITIVE
- **اللون:** أخضر
- **الرسالة:** "Great day ahead! Opportunities are favorable."
- **معنى:** يوم إيجابي - فرص جيدة

### 🔵 NEUTRAL
- **اللون:** أزرق
- **الرسالة:** "Balanced day. Proceed with normal activities."
- **معنى:** يوم متوازن - استمر بشكل طبيعي

### 🟡 CAUTION
- **اللون:** أصفر
- **الرسالة:** "Exercise caution. Review decisions carefully."
- **معنى:** احذر - راجع قراراتك بعناية

---

## 💬 نماذج الأسئلة

### English:
```
- "What domains are available?"
- "How do I make payments with Pi Network?"
- "Tell me about TEC Estate"
- "What subscription tiers are available?"
```

### Arabic:
```
- "ما هي المجالات المتاحة؟"
- "كيف أدفع باستخدام Pi Network؟"
- "أخبرني عن TEC Estate"
- "ما هي مستويات الاشتراك المتاحة؟"
```

---

## 🔧 للمطورين

### Structure:

```
/pages/assistant/index.js          # UI Page
/pages/api/tec/assistant.js        # Chat API
/pages/api/v1/tec-assistant/
  └─ signals/today.ts              # Signals API
/apps/tec/services/
  └─ aiAssistantService.js         # Business Logic
```

### Running Locally:

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start dev server
npm run dev

# Test endpoints
npm run test:assistant
```

### Testing:

```bash
# Test assistant page
curl http://localhost:3000/assistant

# Test chat API
curl -X POST http://localhost:3000/api/tec/assistant \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Test signals API
curl http://localhost:3000/api/v1/tec-assistant/signals/today
```

---

## 📝 API Documentation

### POST `/api/tec/assistant`

**Request:**
```json
{
  "message": "string (required)",
  "userId": "string (optional)",
  "context": {
    "domain": "string (optional)",
    "tier": "string (optional)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "content": "string",
  "suggestions": ["string"],
  "links": [{"text": "string", "url": "string"}],
  "timestamp": "ISO8601"
}
```

### GET `/api/v1/tec-assistant/signals/today`

**Response:**
```json
{
  "success": true,
  "data": {
    "signal": {
      "id": "string",
      "date": "ISO8601",
      "type": "POSITIVE|NEUTRAL|CAUTION",
      "color": "string",
      "emoji": "string",
      "message": "string",
      "generatedAt": "ISO8601"
    }
  }
}
```

---

## 🌐 Language Detection

الـ Assistant يكتشف اللغة تلقائياً:

- **إذا كانت الرسالة بالعربية** → يرد بالعربية
- **إذا كانت الرسالة بالإنجليزية** → يرد بالإنجليزية

```javascript
// Arabic detection
const isArabic = /[\u0600-\u06FF]/.test(message);
```

---

## 🚨 استكشاف الأخطاء

### ❌ Error: "Cannot find module aiAssistantService"

**الحل:**
```bash
# تأكد من وجود الملف
ls apps/tec/services/aiAssistantService.js

# أعد تشغيل الخادم
npm run dev
```

### ❌ Error: "Database connection failed"

**الحل:**
الـ Assistant يعمل في **Mock Mode** افتراضياً (بدون قاعدة بيانات).
لا حاجة لقاعدة بيانات في التطوير.

### ❌ Error: "Signal API returns error"

**الحل:**
```bash
# اختبر الـ endpoint
curl http://localhost:3000/api/v1/tec-assistant/signals/today

# يجب أن ترى:
{"success":true,"data":{...}}
```

---

## 📊 Monitoring

### Development:
```bash
# Check logs
npm run dev

# Watch for errors in console
```

### Production (Vercel):
```
Vercel Dashboard → Your Project → Logs
```

---

## 🔐 Security

### Environment Variables:
```bash
# Development (.env)
DATABASE_URL=postgresql://...    # Optional in mock mode
NEXTAUTH_SECRET=your-secret

# Production (Vercel)
# Set in: Vercel Dashboard → Settings → Environment Variables
```

### API Security:
- ✅ Input validation
- ✅ Rate limiting (TODO)
- ✅ CORS headers
- ✅ No sensitive data in responses

---

## 📖 المراجع

- [TEC Assistant Specification](../apps/tec/TEC_ASSISTANT_SPECIFICATION.md)
- [TEC Assistant Architecture](../apps/tec/TEC_ASSISTANT_ARCHITECTURE_DIAGRAM.md)
- [Vercel Deployment Guide](../VERCEL_GITHUB_INTEGRATION.md)

---

## 🆘 الدعم

### Issues:
https://github.com/tec-ecosystem/tec-ecosystem/issues

### Discord:
(لو موجود)

---

**آخر تحديث:** 2026-01-22  
**الإصدار:** 1.0  
**الحالة:** ✅ Working in Development Mode
