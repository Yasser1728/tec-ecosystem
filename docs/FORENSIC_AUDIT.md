# نظام التدقيق الجنائي (Forensic Audit System)

## نظرة عامة / Overview

نظام التدقيق الجنائي هو نظام أمان مركزي متقدم يحمي جميع العمليات المالية والحساسة في منظومة TEC. يوفر النظام التحقق من الهوية، والتحقق من صحة العمليات، واكتشاف الأنشطة المشبوهة، والتسجيل غير القابل للتغيير.

The Forensic Audit System is an advanced centralized security system that protects all financial and sensitive operations in the TEC Ecosystem. The system provides identity verification, operation validation, suspicious activity detection, and immutable logging.

---

## المكونات الرئيسية / Key Components

### 1. خادم التدقيق المركزي / Central Audit Server
**الملف / File:** `pages/api/approval.js`

خادم API مركزي يستقبل جميع طلبات العمليات المالية والحساسة من جميع النطاقات (commerce، fundx، إلخ).

A central API server that receives all financial and sensitive operation requests from all domains (commerce, fundx, etc.).

**الوظائف الرئيسية / Main Functions:**
- التحقق من هوية المستخدم / User identity verification
- التحقق من صحة العملية / Operation validation
- كشف الأنشطة المشبوهة / Suspicious activity detection
- اتخاذ قرارات الموافقة/الرفض / Approval/rejection decisions
- التسجيل غير القابل للتغيير / Immutable logging

### 2. أدوات التدقيق الجنائي / Forensic Utilities
**الملف / File:** `lib/forensic-utils.js`

مكتبة شاملة توفر جميع وظائف التدقيق والتحقق الأمنية.

A comprehensive library providing all audit and security verification functions.

**الوظائف المتاحة / Available Functions:**
- `createImmutableLogEntry()` - إنشاء سجل غير قابل للتغيير مع تجزئة تشفيرية
- `verifyUserIdentity()` - التحقق من هوية المستخدم والجلسة
- `validateOperation()` - التحقق من صحة بيانات العملية
- `detectSuspiciousActivity()` - كشف الأنماط المشبوهة
- `createAuditEntry()` - إنشاء سجل تدقيق شامل

---

## أنواع العمليات / Operation Types

يدعم النظام الأنواع التالية من العمليات التي تتطلب تدقيقاً:

The system supports the following operation types that require auditing:

```javascript
AUDIT_OPERATION_TYPES = {
  PAYMENT_CREATE: 'payment_create',        // إنشاء دفع / Create payment
  PAYMENT_APPROVE: 'payment_approve',      // الموافقة على دفع / Approve payment
  PAYMENT_COMPLETE: 'payment_complete',    // إكمال دفع / Complete payment
  PAYMENT_CANCEL: 'payment_cancel',        // إلغاء دفع / Cancel payment
  NFT_MINT: 'nft_mint',                   // سك NFT / Mint NFT
  SUBSCRIPTION_CREATE: 'subscription_create', // إنشاء اشتراك / Create subscription
  WITHDRAWAL: 'withdrawal',                // سحب / Withdrawal
  TRANSFER: 'transfer',                    // تحويل / Transfer
  DOMAIN_PURCHASE: 'domain_purchase',      // شراء نطاق / Domain purchase
}
```

---

## مستويات المخاطر / Risk Levels

```javascript
RISK_LEVELS = {
  LOW: 'low',           // منخفض / Low
  MEDIUM: 'medium',     // متوسط / Medium
  HIGH: 'high',         // عالي / High
  CRITICAL: 'critical'  // حرج / Critical
}
```

---

## التكامل / Integration

### كيفية استدعاء خادم التدقيق / How to Call Audit Server

جميع العمليات المالية يجب أن تستدعي `/api/approval` قبل التنفيذ:

All financial operations must call `/api/approval` before execution:

```javascript
// مثال: إنشاء دفع / Example: Creating a payment
const approvalResponse = await fetch('/api/approval', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    operationType: 'payment_create',
    operationData: {
      amount: 100,
      currency: 'PI',
      userId: 'user123',
    },
    domain: 'commerce',
    context: {
      // معلومات إضافية / Additional information
    }
  })
});

const result = await approvalResponse.json();

if (result.approved) {
  // المتابعة مع العملية / Proceed with operation
  console.log('Audit Log ID:', result.auditLogId);
} else {
  // رفض العملية / Reject operation
  console.error('Rejected:', result.reason);
}
```

### النطاقات المدمجة / Integrated Domains

#### 1. Commerce (التجارة)
- **الملف / File:** `pages/api/payments/create-payment.js`
- **الوظيفة / Function:** إنشاء الدفعات / Payment creation
- **التكامل / Integration:** ✅ مكتمل / Complete

#### 2. FundX (الاستثمار)
- **التكامل / Integration:** من خلال `pages/api/payments/` APIs
- **الوظيفة / Function:** جميع العمليات الاستثمارية / All investment operations

---

## السجلات غير القابلة للتغيير / Immutable Logs

### هيكل السجل / Log Structure

كل سجل تدقيق يحتوي على:

Each audit log contains:

```javascript
{
  id: "uuid",                    // معرف فريد / Unique ID
  timestamp: "ISO-8601",         // الوقت / Timestamp
  operationType: "string",       // نوع العملية / Operation type
  operationData: {},             // بيانات العملية / Operation data
  user: {                        // معلومات المستخدم / User info
    id: "string",
    email: "string",
    piId: "string"
  },
  identityCheck: {},             // نتيجة التحقق من الهوية / Identity check result
  validationResult: {},          // نتيجة التحقق / Validation result
  suspicionResult: {},           // نتيجة كشف الشبهات / Suspicion detection result
  approved: true/false,          // الموافقة / Approval status
  hash: "sha256-hash",           // التجزئة التشفيرية / Cryptographic hash
  immutable: true                // غير قابل للتغيير / Immutable flag
}
```

### التحقق من السلامة / Integrity Verification

التجزئة التشفيرية (SHA-256) تضمن عدم العبث بالسجلات:

The cryptographic hash (SHA-256) ensures logs cannot be tampered with:

```javascript
import crypto from 'crypto';

const hash = crypto
  .createHash('sha256')
  .update(JSON.stringify(logEntry))
  .digest('hex');
```

---

## الكشف عن الأنشطة المشبوهة / Suspicious Activity Detection

النظام يكشف تلقائياً عن:

The system automatically detects:

1. **العمليات السريعة المتكررة / Rapid Repeated Operations**
   - أكثر من 5 عمليات في دقيقة واحدة
   - More than 5 operations in 1 minute

2. **المبالغ الكبيرة بشكل غير عادي / Unusually Large Amounts**
   - معاملات تتجاوز 50,000 PI
   - Transactions exceeding 50,000 PI

3. **الحسابات الجديدة / New Accounts**
   - معاملات كبيرة من حسابات عمرها أقل من 24 ساعة
   - Large transactions from accounts less than 24 hours old

4. **المستخدمون غير المتحققين / Unverified Users**
   - عمليات من مستخدمين بدون تحقق من البريد الإلكتروني
   - Operations from users without email verification

---

## الإعدادات البيئية / Environment Configuration

أضف إلى ملف `.env.local`:

Add to `.env.local` file:

```bash
# تفعيل التدقيق الجنائي / Enable forensic audit
NEXT_PUBLIC_ENABLE_FORENSIC_AUDIT=true

# مفتاح التشفير / Encryption key
FORENSIC_AUDIT_SECRET=your-secret-key

# حد المخاطر العالية / High risk threshold
FORENSIC_AUDIT_HIGH_RISK_THRESHOLD=10000

# تفعيل السجلات غير القابلة للتغيير / Enable immutable logs
FORENSIC_AUDIT_IMMUTABLE_LOGS=true
```

**⚠️ مهم / Important:** لا تضع المفاتيح السرية في الكود البرمجي أبداً! استخدم `.env.local` فقط.

**⚠️ Important:** Never put secret keys in the code! Use `.env.local` only.

---

## الأمان / Security

### أفضل الممارسات / Best Practices

1. **إدارة المفاتيح / Key Management**
   - استخدم مفاتيح قوية (32+ حرف) / Use strong keys (32+ characters)
   - قم بتدوير المفاتيح بشكل دوري / Rotate keys periodically
   - احفظ المفاتيح في `.env.local` فقط / Store keys in `.env.local` only

2. **المراقبة / Monitoring**
   - راقب السجلات بانتظام / Monitor logs regularly
   - راجع العمليات المرفوضة / Review rejected operations
   - تتبع الأنشطة المشبوهة / Track suspicious activities

3. **النسخ الاحتياطي / Backup**
   - احتفظ بنسخ احتياطية من السجلات / Keep log backups
   - استخدم تخزين آمن غير قابل للتغيير / Use secure immutable storage

---

## مثال تطبيقي / Practical Example

### إنشاء دفع مع التدقيق / Creating Payment with Audit

```javascript
// في واجهة المستخدم / In frontend
async function createPayment(amount, domain) {
  try {
    // 1. استدعاء API إنشاء الدفع / Call payment creation API
    const response = await fetch('/api/payments/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        domain,
        userId: currentUser.id,
        memo: 'Purchase from Commerce'
      })
    });

    const result = await response.json();

    // 2. التحقق من موافقة التدقيق / Check audit approval
    if (result.forensicAudit?.approved) {
      console.log('✅ Payment approved by forensic audit');
      console.log('Audit Log ID:', result.forensicAudit.auditLogId);
      
      // 3. المتابعة مع معالجة الدفع / Proceed with payment processing
      return result;
    } else {
      console.error('❌ Payment rejected:', result.reason);
      throw new Error(result.reason);
    }
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
}
```

---

## الاختبار / Testing

### اختبار التدقيق الجنائي / Testing Forensic Audit

```javascript
// اختبار الموافقة / Test approval
const approvedCase = {
  operationType: 'payment_create',
  operationData: { amount: 100, userId: 'user123' },
  domain: 'commerce'
};

// اختبار الرفض / Test rejection
const rejectedCase = {
  operationType: 'payment_create',
  operationData: { amount: 100000, userId: 'newuser' }, // مبلغ كبير / Large amount
  domain: 'commerce'
};
```

---

## الصيانة / Maintenance

### مراجعة السجلات / Log Review

```bash
# عرض سجلات التدقيق / View audit logs
grep "FORENSIC AUDIT LOG" logs/*.log

# البحث عن العمليات المرفوضة / Search for rejected operations
grep "REJECTED" logs/*.log
```

### التنظيف / Cleanup

السجلات يجب الاحتفاظ بها لمدة لا تقل عن:

Logs should be retained for at least:
- 90 يوماً للعمليات العادية / 90 days for normal operations
- 1 سنة للعمليات المشبوهة / 1 year for suspicious operations
- 7 سنوات للعمليات المالية (امتثال) / 7 years for financial operations (compliance)

---

## الأسئلة الشائعة / FAQ

### س: هل التدقيق الجنائي يؤثر على الأداء؟
### Q: Does forensic audit affect performance?

لا، التأثير ضئيل جداً. كل عملية تدقيق تستغرق أقل من 100 ميلي ثانية.

No, the impact is minimal. Each audit operation takes less than 100ms.

### س: ماذا يحدث إذا فشل خادم التدقيق؟
### Q: What happens if the audit server fails?

في حالة الفشل، يتم رفض العملية تلقائياً لضمان الأمان (fail-safe).

In case of failure, the operation is automatically rejected to ensure security (fail-safe).

### س: هل يمكن تعديل السجلات بعد إنشائها؟
### Q: Can logs be modified after creation?

لا، السجلات غير قابلة للتغيير بفضل التجزئة التشفيرية SHA-256.

No, logs are immutable thanks to SHA-256 cryptographic hashing.

---

## الدعم / Support

للمساعدة أو الإبلاغ عن مشاكل:

For help or to report issues:

- **GitHub Issues:** https://github.com/Yasser1728/tec-ecosystem/issues
- **الأمان / Security:** security@tec-ecosystem.com
- **الوثائق / Documentation:** docs/SECURITY.md

---

## الترخيص / License

نظام التدقيق الجنائي جزء من منظومة TEC ومرخص بموجب MIT License للمكونات العامة.

The Forensic Audit System is part of the TEC Ecosystem and licensed under MIT License for public components.

---

**آخر تحديث / Last Updated:** 2026-01-02
**الإصدار / Version:** 1.0.0
