# TecPi Domain - User Management & Registration

# دومين TecPi - إدارة المستخدمين والتسجيل

---

## 🌐 Language / اللغة

- [English Version](#english-version)
- [النسخة العربية](#النسخة-العربية)

---

# English Version

## 🎯 Domain Mission

The TecPi domain (tecpi.pi) serves as a fully sovereign user management system within the TEC Ecosystem. It provides user registration, authentication scaffolding, and profile management with complete independence from other domains.

**Vision**: To provide a secure, sovereign, and scalable user management foundation that integrates seamlessly through the nexus/gateway without any direct domain coupling.

**Core Values**:

- **Sovereignty**: Complete independence with no direct dependencies on other domains
- **Security**: Secure user data handling with validation and sanitization
- **Integration**: All external integrations exclusively through nexus/gateway
- **Simplicity**: Clean, testable, and maintainable code structure

## 📋 Core Features

### 1. User Registration

- **Secure Registration**: Validates user data before storage
- **Email Validation**: Ensures proper email format
- **Username Validation**: Alphanumeric usernames with 3-20 characters
- **Duplicate Prevention**: Checks for existing usernames and emails
- **Auto-generated IDs**: Unique user identifiers

### 2. User Management

- **Profile Retrieval**: Get user data by username or ID
- **Profile Updates**: Update user information securely
- **Status Tracking**: Monitor user account status
- **Tier Management**: Support for different user tiers (GUEST, STANDARD, PREMIUM)

### 3. Domain Statistics

- **User Metrics**: Track total and active users
- **Reporting**: Generate domain statistics on demand

## 🏗️ Architecture & Sovereignty

### Sovereign Design Principles

This domain follows strict sovereignty principles:

```
┌─────────────────────────────────────────────────┐
│           TecPi Domain (Sovereign)              │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │        Core Services (index.js)          │  │
│  │  • registerUser()                        │  │
│  │  • getUserByUsername()                   │  │
│  │  • getUserById()                         │  │
│  │  • updateUser()                          │  │
│  │  • getDomainStats()                      │  │
│  └──────────────────────────────────────────┘  │
│                     ▲                           │
│                     │                           │
│  ┌──────────────────┴───────────────────────┐  │
│  │        Routes (routes/index.js)          │  │
│  │  • POST /api/tecpi/register              │  │
│  │  • GET  /api/tecpi/user/:username        │  │
│  │  • GET  /api/tecpi/stats                 │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Integration ONLY through
                  │ nexus/gateway
                  ▼
        ┌──────────────────┐
        │  Nexus/Gateway   │
        │  (Central Hub)   │
        └──────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  Other Domains   │
        │  (if needed)     │
        └──────────────────┘
```

### No Direct Dependencies

**✅ What TecPi Does:**

- Manages its own user data
- Exposes well-defined APIs
- Validates all inputs
- Returns structured responses

**❌ What TecPi Does NOT Do:**

- Import or require other domain modules
- Call other domain functions directly
- Share internal data structures
- Depend on other domain implementations

### Integration Through Nexus/Gateway

All cross-domain communication happens through the nexus/gateway:

```javascript
// ✅ CORRECT: Integration through nexus/gateway
// Nexus/Gateway handles routing to TecPi
app.post("/api/tecpi/register", async (req, res) => {
  // Gateway routes to TecPi domain
  const result = await tecPiRoutes.registerUserRoute(req, res);
});

// ❌ WRONG: Direct domain access
// const tecPiService = require('../../domains/tecpi');
// DON'T DO THIS FROM OTHER DOMAINS!
```

## 🔌 API Reference

### User Registration

**POST /api/tecpi/register**

Register a new user in the system.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "user": {
    "id": "tecpi_user_1234567890_abc123",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "status": "ACTIVE",
    "tier": "STANDARD",
    "createdAt": "2026-01-05T20:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "error": "Username already exists"
}
```

**Validation Rules:**

- Username: 3-20 characters, alphanumeric and underscores only
- Email: Valid email format
- Password: Required (will be hashed in production)
- All fields are required except fullName

### Get User Information

**GET /api/tecpi/user/:username**

Retrieve user information by username.

**Query Parameters:**

- `username` (required): Username to lookup

**Response (Success - 200):**

```json
{
  "success": true,
  "user": {
    "id": "tecpi_user_1234567890_abc123",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "status": "ACTIVE",
    "tier": "STANDARD",
    "createdAt": "2026-01-05T20:00:00.000Z"
  }
}
```

**Response (Not Found - 404):**

```json
{
  "success": false,
  "error": "User not found"
}
```

### Get Domain Statistics

**GET /api/tecpi/stats**

Get TecPi domain statistics.

**Response (Success - 200):**

```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "activeUsers": 145,
    "timestamp": "2026-01-05T20:00:00.000Z"
  }
}
```

## 🧪 Testing

### Unit Tests

The domain includes comprehensive unit tests for all functions.

**Running Tests:**

```bash
# Run all TecPi tests
npm test domains/tecpi/tests/unit

# Run with coverage
npm run test:coverage domains/tecpi/tests/unit
```

**Test Coverage:**

- User registration validation
- Duplicate user prevention
- Email and username format validation
- User retrieval by username and ID
- Statistics generation
- Error handling

### Example Test:

```javascript
describe("TecPi Service", () => {
  describe("registerUser", () => {
    test("should register a valid user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      };

      const result = await tecPiService.registerUser(userData);

      expect(result.success).toBe(true);
      expect(result.user.username).toBe("testuser");
      expect(result.user.email).toBe("test@example.com");
    });

    test("should reject duplicate username", async () => {
      const userData = {
        username: "duplicate",
        email: "dup@example.com",
        password: "password123",
      };

      await tecPiService.registerUser(userData);

      await expect(tecPiService.registerUser(userData)).rejects.toThrow(
        "Username already exists",
      );
    });
  });
});
```

## 🔒 Security Considerations

### Current Implementation

- Input validation on all fields
- Email format validation
- Username format validation
- Duplicate prevention
- No sensitive data in responses

### Production Recommendations

1. **Password Hashing**: Implement bcrypt or similar for password storage
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **CAPTCHA**: Add CAPTCHA for registration endpoint
4. **Database**: Replace in-memory storage with proper database
5. **Authentication**: Implement JWT or session-based authentication
6. **Authorization**: Add role-based access control
7. **Input Sanitization**: Add additional sanitization for XSS prevention
8. **HTTPS**: Ensure all communication over HTTPS
9. **Audit Logging**: Log all registration and update attempts

## 📊 Code Quality

### Codacy Compliance

This domain follows best practices to ensure high code quality:

✅ **Style & Formatting:**

- Consistent indentation (2 spaces)
- Proper JSDoc comments on all functions
- Descriptive variable names
- No unused variables or imports

✅ **Error Handling:**

- Comprehensive try-catch blocks
- Meaningful error messages
- Proper error propagation
- Appropriate HTTP status codes

✅ **Code Structure:**

- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Clear separation of concerns
- Modular and testable functions

✅ **Security:**

- Input validation
- SQL injection prevention (when using DB)
- XSS prevention
- No hardcoded secrets

### Linting

Run linter to check code quality:

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

## 🚀 Getting Started

### For Developers

**1. Import the Service:**

```javascript
const tecPiService = require("../domains/tecpi");

// Register a user
const result = await tecPiService.registerUser({
  username: "newuser",
  email: "user@example.com",
  password: "securepass",
  fullName: "New User",
});
```

**2. Use the Routes (through nexus/gateway):**

```javascript
const tecPiRoutes = require("../domains/tecpi/routes");

// In your API gateway/nexus
app.post("/api/tecpi/register", tecPiRoutes.registerUserRoute);
app.get("/api/tecpi/user/:username", tecPiRoutes.getUserRoute);
app.get("/api/tecpi/stats", tecPiRoutes.getStatsRoute);
```

### For API Consumers

**Example: Register a User**

```javascript
const response = await fetch("/api/tecpi/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "johndoe",
    email: "john@example.com",
    password: "securePassword123",
    fullName: "John Doe",
  }),
});

const data = await response.json();
console.log(data.user); // User object
```

## 🔄 Integration Methods

### Event-Driven Integration (Recommended)

```javascript
// TecPi publishes events through nexus/gateway
eventBus.publish("tecpi.user.registered", {
  userId: user.id,
  username: user.username,
  timestamp: new Date().toISOString(),
});

// Other domains listen through nexus/gateway
eventBus.on("tecpi.user.registered", (data) => {
  // Handle user registration in your domain
  console.log("New user registered:", data.username);
});
```

### API Integration (Gateway-based)

```javascript
// From another domain (through gateway)
const response = await fetch("/api/tecpi/user/:username", {
  method: "GET",
  headers: {
    Authorization: "Bearer <token>",
  },
});

const userData = await response.json();
```

## 📈 Future Enhancements

1. **Authentication System**
   - JWT token generation
   - Session management
   - Password reset flow
   - Email verification

2. **Advanced User Management**
   - Profile pictures
   - User preferences
   - Activity history
   - Social profiles

3. **Integration Features**
   - SSO (Single Sign-On)
   - OAuth integration
   - Third-party authentication
   - API key management

4. **Security Enhancements**
   - Two-factor authentication
   - Login attempt tracking
   - Device fingerprinting
   - Suspicious activity alerts

## 📞 Support & Maintenance

- **Domain Owner**: TecPi Team
- **Technical Lead**: To be assigned
- **Documentation**: This README
- **Issue Tracking**: GitHub Issues with `domain:tecpi` label

---

# النسخة العربية

## 🎯 مهمة الدومين

دومين TecPi (tecpi.pi) هو نظام سيادي كامل لإدارة المستخدمين داخل نظام TEC البيئي. يوفر تسجيل المستخدمين، وهيكل المصادقة، وإدارة الملفات الشخصية باستقلالية تامة عن الدومينات الأخرى.

**الرؤية**: توفير أساس آمن وسيادي وقابل للتوسع لإدارة المستخدمين يتكامل بسلاسة عبر nexus/gateway دون أي ربط مباشر بالدومينات.

**القيم الأساسية**:

- **السيادة**: استقلالية كاملة بدون تبعيات مباشرة على دومينات أخرى
- **الأمان**: معالجة آمنة لبيانات المستخدمين مع التحقق والتنظيف
- **التكامل**: جميع التكاملات الخارجية حصريًا عبر nexus/gateway
- **البساطة**: هيكل كود نظيف وقابل للاختبار والصيانة

## 📋 الميزات الأساسية

### 1. تسجيل المستخدمين

- **تسجيل آمن**: يتحقق من بيانات المستخدم قبل التخزين
- **التحقق من البريد الإلكتروني**: يضمن تنسيق البريد الإلكتروني الصحيح
- **التحقق من اسم المستخدم**: أسماء مستخدمين أبجدية رقمية من 3-20 حرفًا
- **منع التكرار**: يفحص أسماء المستخدمين والبريد الإلكتروني الموجودة
- **معرفات تلقائية**: معرفات فريدة للمستخدمين

### 2. إدارة المستخدمين

- **استرجاع الملف الشخصي**: الحصول على بيانات المستخدم باسم المستخدم أو المعرف
- **تحديثات الملف الشخصي**: تحديث معلومات المستخدم بشكل آمن
- **تتبع الحالة**: مراقبة حالة حساب المستخدم
- **إدارة المستويات**: دعم مستويات مستخدم مختلفة (GUEST، STANDARD، PREMIUM)

### 3. إحصائيات الدومين

- **مقاييس المستخدمين**: تتبع إجمالي المستخدمين والمستخدمين النشطين
- **التقارير**: إنشاء إحصائيات الدومين عند الطلب

## 🏗️ الهندسة المعمارية والسيادة

### مبادئ التصميم السيادي

يتبع هذا الدومين مبادئ سيادة صارمة:

```
┌─────────────────────────────────────────────────┐
│           دومين TecPi (سيادي)                  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │     الخدمات الأساسية (index.js)         │  │
│  │  • registerUser()                        │  │
│  │  • getUserByUsername()                   │  │
│  │  • getUserById()                         │  │
│  │  • updateUser()                          │  │
│  │  • getDomainStats()                      │  │
│  └──────────────────────────────────────────┘  │
│                     ▲                           │
│                     │                           │
│  ┌──────────────────┴───────────────────────┐  │
│  │      المسارات (routes/index.js)         │  │
│  │  • POST /api/tecpi/register              │  │
│  │  • GET  /api/tecpi/user/:username        │  │
│  │  • GET  /api/tecpi/stats                 │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ التكامل فقط عبر
                  │ nexus/gateway
                  ▼
        ┌──────────────────┐
        │  Nexus/Gateway   │
        │   (المركز)       │
        └──────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  دومينات أخرى    │
        │   (إذا لزم)      │
        └──────────────────┘
```

### لا تبعيات مباشرة

**✅ ما يفعله TecPi:**

- إدارة بيانات المستخدمين الخاصة به
- عرض واجهات برمجة تطبيقات محددة جيدًا
- التحقق من جميع المدخلات
- إرجاع استجابات منظمة

**❌ ما لا يفعله TecPi:**

- استيراد أو طلب وحدات دومين أخرى
- استدعاء دوال دومين أخرى مباشرة
- مشاركة هياكل البيانات الداخلية
- الاعتماد على تطبيقات دومين أخرى

### التكامل عبر Nexus/Gateway

جميع الاتصالات عبر الدومينات تحدث عبر nexus/gateway:

```javascript
// ✅ صحيح: التكامل عبر nexus/gateway
// Nexus/Gateway يتعامل مع التوجيه إلى TecPi
app.post("/api/tecpi/register", async (req, res) => {
  // Gateway يوجه إلى دومين TecPi
  const result = await tecPiRoutes.registerUserRoute(req, res);
});

// ❌ خطأ: الوصول المباشر للدومين
// const tecPiService = require('../../domains/tecpi');
// لا تفعل هذا من دومينات أخرى!
```

## 🔌 مرجع واجهة برمجة التطبيقات (API)

### تسجيل المستخدم

**POST /api/tecpi/register**

تسجيل مستخدم جديد في النظام.

**نص الطلب:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

**الاستجابة (نجاح - 201):**

```json
{
  "success": true,
  "user": {
    "id": "tecpi_user_1234567890_abc123",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "status": "ACTIVE",
    "tier": "STANDARD",
    "createdAt": "2026-01-05T20:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

**الاستجابة (خطأ - 400):**

```json
{
  "success": false,
  "error": "Username already exists"
}
```

**قواعد التحقق:**

- اسم المستخدم: 3-20 حرفًا، أبجدية رقمية وشرطات سفلية فقط
- البريد الإلكتروني: تنسيق بريد إلكتروني صالح
- كلمة المرور: مطلوبة (سيتم تشفيرها في الإنتاج)
- جميع الحقول مطلوبة باستثناء fullName

### الحصول على معلومات المستخدم

**GET /api/tecpi/user/:username**

استرجاع معلومات المستخدم باسم المستخدم.

**معاملات الاستعلام:**

- `username` (مطلوب): اسم المستخدم للبحث

**الاستجابة (نجاح - 200):**

```json
{
  "success": true,
  "user": {
    "id": "tecpi_user_1234567890_abc123",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "status": "ACTIVE",
    "tier": "STANDARD",
    "createdAt": "2026-01-05T20:00:00.000Z"
  }
}
```

**الاستجابة (غير موجود - 404):**

```json
{
  "success": false,
  "error": "User not found"
}
```

### الحصول على إحصائيات الدومين

**GET /api/tecpi/stats**

الحصول على إحصائيات دومين TecPi.

**الاستجابة (نجاح - 200):**

```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "activeUsers": 145,
    "timestamp": "2026-01-05T20:00:00.000Z"
  }
}
```

## 🧪 الاختبار

### اختبارات الوحدة

يتضمن الدومين اختبارات وحدة شاملة لجميع الدوال.

**تشغيل الاختبارات:**

```bash
# تشغيل جميع اختبارات TecPi
npm test domains/tecpi/tests/unit

# التشغيل مع التغطية
npm run test:coverage domains/tecpi/tests/unit
```

**تغطية الاختبار:**

- التحقق من تسجيل المستخدم
- منع المستخدمين المكررين
- التحقق من تنسيق البريد الإلكتروني واسم المستخدم
- استرجاع المستخدم باسم المستخدم والمعرف
- إنشاء الإحصائيات
- معالجة الأخطاء

## 🔒 اعتبارات الأمان

### التطبيق الحالي

- التحقق من المدخلات على جميع الحقول
- التحقق من تنسيق البريد الإلكتروني
- التحقق من تنسيق اسم المستخدم
- منع التكرار
- لا بيانات حساسة في الاستجابات

### توصيات الإنتاج

1. **تشفير كلمة المرور**: تنفيذ bcrypt أو ما شابه لتخزين كلمة المرور
2. **تحديد المعدل**: إضافة تحديد للمعدل لمنع الإساءة
3. **CAPTCHA**: إضافة CAPTCHA لنقطة نهاية التسجيل
4. **قاعدة البيانات**: استبدال التخزين في الذاكرة بقاعدة بيانات مناسبة
5. **المصادقة**: تنفيذ JWT أو المصادقة القائمة على الجلسة
6. **التفويض**: إضافة التحكم في الوصول القائم على الأدوار
7. **تنظيف المدخلات**: إضافة تنظيف إضافي لمنع XSS
8. **HTTPS**: ضمان جميع الاتصالات عبر HTTPS
9. **سجل التدقيق**: تسجيل جميع محاولات التسجيل والتحديث

## 📊 جودة الكود

### الامتثال لـ Codacy

يتبع هذا الدومين أفضل الممارسات لضمان جودة كود عالية:

✅ **الأسلوب والتنسيق:**

- المسافة البادئة المتسقة (مسافتان)
- تعليقات JSDoc مناسبة على جميع الدوال
- أسماء متغيرات وصفية
- لا متغيرات أو استيرادات غير مستخدمة

✅ **معالجة الأخطاء:**

- كتل try-catch شاملة
- رسائل خطأ ذات معنى
- انتشار خطأ مناسب
- رموز حالة HTTP مناسبة

✅ **هيكل الكود:**

- مبدأ المسؤولية الواحدة
- DRY (لا تكرر نفسك)
- فصل واضح للمسؤوليات
- دوال نمطية وقابلة للاختبار

✅ **الأمان:**

- التحقق من المدخلات
- منع حقن SQL (عند استخدام قاعدة البيانات)
- منع XSS
- لا أسرار مشفرة

### Linting

تشغيل linter للتحقق من جودة الكود:

```bash
npm run lint
npm run lint:fix  # إصلاح المشاكل تلقائيًا
```

## 🔄 طرق التكامل

### التكامل القائم على الأحداث (موصى به)

```javascript
// TecPi ينشر أحداثًا عبر nexus/gateway
eventBus.publish("tecpi.user.registered", {
  userId: user.id,
  username: user.username,
  timestamp: new Date().toISOString(),
});

// الدومينات الأخرى تستمع عبر nexus/gateway
eventBus.on("tecpi.user.registered", (data) => {
  // معالجة تسجيل المستخدم في دومينك
  console.log("تم تسجيل مستخدم جديد:", data.username);
});
```

### تكامل API (قائم على Gateway)

```javascript
// من دومين آخر (عبر gateway)
const response = await fetch("/api/tecpi/user/:username", {
  method: "GET",
  headers: {
    Authorization: "Bearer <token>",
  },
});

const userData = await response.json();
```

## 📈 التحسينات المستقبلية

1. **نظام المصادقة**
   - إنشاء رمز JWT
   - إدارة الجلسة
   - تدفق إعادة تعيين كلمة المرور
   - التحقق من البريد الإلكتروني

2. **إدارة المستخدمين المتقدمة**
   - صور الملف الشخصي
   - تفضيلات المستخدم
   - سجل النشاط
   - الملفات الاجتماعية

3. **ميزات التكامل**
   - SSO (تسجيل الدخول الموحد)
   - تكامل OAuth
   - المصادقة من طرف ثالث
   - إدارة مفاتيح API

4. **تحسينات الأمان**
   - المصادقة الثنائية
   - تتبع محاولات تسجيل الدخول
   - بصمة الجهاز
   - تنبيهات النشاط المشبوه

## 📞 الدعم والصيانة

- **مالك الدومين**: فريق TecPi
- **القائد التقني**: سيتم تعيينه
- **التوثيق**: هذا README
- **تتبع المشكلات**: GitHub Issues مع علامة `domain:tecpi`

---

**آخر تحديث**: يناير 2026  
**الإصدار**: 1.0.0  
**الحالة**: نشط - تطبيق سيادي  
**السيادة**: مفعّلة ✅  
**التكامل عبر Gateway**: مفعّل ✅  
**جودة الكود**: متوافق مع Codacy ✅

---

© 2024-2026 نظام TEC البيئي - جميع الحقوق محفوظة
