# نظام الموافقات والإنذار المبكر - Approval and Early Warning System

## Overview | نظرة عامة

This document describes the implementation of the forensic audit approval system with early warning notifications in the TEC Ecosystem.

تصف هذه الوثيقة تنفيذ نظام الموافقات للتدقيق الشرعي مع إشعارات الإنذار المبكر في نظام TEC البيئي.

## Features | الميزات

### 1. Database Persistence | الحفظ في قاعدة البيانات

All approval operations and transactions are now saved to a PostgreSQL/Supabase database using Prisma ORM.

جميع عمليات الموافقة والمعاملات يتم حفظها الآن في قاعدة بيانات PostgreSQL/Supabase باستخدام Prisma ORM.

**Database Table:** `audit_logs`

**Fields:**

- `id` - Unique identifier
- `userId` - User who initiated the operation
- `operationType` - Type of operation (payment_create, withdrawal, etc.)
- `operationData` - Full operation details (JSON)
- `approved` - Boolean indicating if operation was approved
- `rejectionReason` - Reason for rejection (if applicable)
- `hash` - Cryptographic hash for immutability
- `identityVerified` - Identity verification status
- `operationValid` - Operation validation status
- `riskLevel` - Risk level (low, medium, high, critical)
- `suspicious` - Whether suspicious activity was detected
- `requestIp` - Request IP address (for audit only)
- `domain` - Business domain (commerce, fundx, etc.)
- `createdAt` - Timestamp

### 2. Dashboard Display | عرض لوحة التحكم

The dashboard (`/pages/dashboard/index.js`) now displays a comprehensive audit log table showing:

لوحة التحكم (`/pages/dashboard/index.js`) تعرض الآن جدول سجل تدقيق شامل يُظهر:

- Operation type | نوع العملية
- Approval status | حالة الموافقة
- Risk level | مستوى المخاطر
- Cryptographic hash (stamp) | الدمغة الرقمية
- Rejection reason (if any) | سبب الرفض (إن وُجد)
- Timestamp | التاريخ والوقت

### 3. Toast Notifications | إشعارات التنبيه

When an operation is rejected, the user immediately receives a Toast notification explaining the rejection reason.

عند رفض أي عملية، يتلقى المستخدم على الفور إشعار Toast يوضح سبب الرفض.

**Notification Types:**

- ✓ Success (green) - Operation approved
- ✕ Error (red) - Operation rejected
- ⚠ Warning (orange) - High risk operation
- ℹ Info (blue) - Informational messages

**Common Rejection Reasons:**

- Identity verification failed | فشل التحقق من الهوية
- Invalid operation data | بيانات العملية غير صحيحة
- Amount exceeds limit | المبلغ يتجاوز الحد
- Suspicious activity detected | كُشف نشاط مشبوه
- Rapid repeated operations | عمليات متكررة سريعة
- Large transaction from new account | معاملة كبيرة من حساب جديد

## Implementation Files | ملفات التنفيذ

### Modified Files | الملفات المعدلة

1. **`prisma/schema.prisma`**
   - Added `AuditLog` model for database storage

2. **`lib/forensic-utils.js`**
   - Added `persistAuditLog()` function to save to database
   - Added `fetchAuditLogs()` to retrieve audit logs
   - Added `getAuditLogCount()` for pagination
   - Added `generateRejectionReason()` helper

3. **`pages/dashboard/index.js`**
   - Added audit log table display
   - Added real-time data fetching from database
   - Added status badges and risk level indicators
   - Added Arabic (RTL) support

4. **`tests/setup.js`**
   - Added Prisma client mock for testing

### New Files | الملفات الجديدة

1. **`lib/toast-notification.js`**
   - Toast notification utility
   - Support for success, error, warning, info types
   - Arabic text support
   - Auto-dismiss and manual close options

2. **`lib/useApprovalOperation.js`**
   - React hook for approval operations
   - Automatic toast notifications on rejection
   - Loading and error state management

3. **`pages/api/audit-logs.js`**
   - API endpoint to fetch audit logs
   - User-based filtering
   - Pagination support

4. **`pages/dashboard/approval-demo.js`**
   - Demo page for testing approval system
   - Test scenarios for different rejection reasons
   - Interactive form for custom operations

5. **`prisma/migrations/20260102_add_audit_logs/migration.sql`**
   - Database migration SQL for AuditLog table

## API Endpoints | نقاط النهاية API

### POST /api/approval

Submit an operation for approval.

#### Sandbox Mode | وضع الاختبار

When running in sandbox mode (`NEXT_PUBLIC_PI_SANDBOX=true` or `PI_SANDBOX_MODE=true`), the approval endpoint automatically approves all operations without performing database or session checks. This is useful for:

عند التشغيل في وضع الاختبار، نقطة نهاية الموافقة توافق تلقائيًا على جميع العمليات دون إجراء فحوصات قاعدة البيانات أو الجلسة. هذا مفيد لـ:

- **Testing** - Quick testing without database setup | اختبار سريع بدون إعداد قاعدة البيانات
- **Development** - Avoid connection errors | تجنب أخطاء الاتصال
- **Demo** - Demonstration purposes | أغراض العرض التوضيحي

**Sandbox Response:**

```json
{
  "approved": true,
  "rejected": false,
  "operationType": "payment_approve",
  "domain": "unknown",
  "auditLogId": "audit-1704672000000",
  "auditHash": "hash-1704672000000",
  "timestamp": "2024-01-08T00:00:00.000Z",
  "riskLevel": "low",
  "reason": "Sandbox mode - auto-approved",
  "message": "Operation approved and logged (sandbox mode)",
  "details": {
    "identityVerified": true,
    "operationValid": true,
    "noSuspiciousActivity": true
  }
}
```

#### Production Mode | وضع الإنتاج

**Request Body:**

```json
{
  "operationType": "payment_create",
  "domain": "commerce",
  "operationData": {
    "amount": 100,
    "domain": "commerce",
    "userId": "user123"
  },
  "context": {
    "testMode": true
  }
}
```

**Response (Approved):**

```json
{
  "approved": true,
  "rejected": false,
  "operationType": "payment_create",
  "domain": "commerce",
  "auditLogId": "clx123456",
  "auditHash": "7823bc0f1af9357190aeece3500b7830...",
  "riskLevel": "low",
  "message": "Operation approved and logged"
}
```

**Response (Rejected):**

```json
{
  "approved": false,
  "rejected": true,
  "reason": "Unusually large transaction amount; Identity verification failed",
  "auditLogId": "clx123456",
  "auditHash": "7823bc0f1af9357190aeece3500b7830...",
  "message": "Operation rejected due to security concerns"
}
```

### GET /api/audit-logs

Fetch audit logs for the authenticated user.

**Query Parameters:**

- `limit` (default: 50) - Number of records to fetch
- `offset` (default: 0) - Pagination offset
- `operationType` (optional) - Filter by operation type
- `approved` (optional) - Filter by approval status (true/false)
- `domain` (optional) - Filter by business domain

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx123456",
      "operationType": "payment_create",
      "approved": true,
      "riskLevel": "low",
      "hash": "7823bc0f...",
      "domain": "commerce",
      "createdAt": "2026-01-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1,
    "hasMore": false
  }
}
```

## Usage Examples | أمثلة الاستخدام

### Using the Approval Hook in React

```javascript
import { useApprovalOperation } from "../../lib/useApprovalOperation";

function MyComponent() {
  const { submitForApproval, isProcessing, error } = useApprovalOperation();

  const handlePayment = async () => {
    const result = await submitForApproval({
      operationType: "payment_create",
      domain: "commerce",
      operationData: {
        amount: 100,
        domain: "commerce",
      },
    });

    if (result.success) {
      // Handle success
      console.log("Payment approved!", result.auditLogId);
    } else {
      // Error is automatically shown via toast
      console.log("Payment rejected:", result.reason);
    }
  };

  return (
    <button onClick={handlePayment} disabled={isProcessing}>
      {isProcessing ? "Processing..." : "Submit Payment"}
    </button>
  );
}
```

### Manual Toast Notifications

```javascript
import {
  showSuccessToast,
  showErrorToast,
  showRejectionNotification,
} from "../../lib/toast-notification";

// Success notification
showSuccessToast("Payment completed successfully!");

// Error notification
showErrorToast("Something went wrong");

// Rejection notification with details
showRejectionNotification("Amount exceeds limit", {
  operationType: "payment_create",
  domain: "commerce",
});
```

## Security Thresholds | حدود الأمان

The system enforces the following security thresholds:

يطبق النظام حدود الأمان التالية:

- **LARGE_TRANSACTION_AMOUNT**: 50,000 PI (Critical risk, auto-reject)
- **HIGH_RISK_AMOUNT**: 10,000 PI (High risk, requires verification)
- **NEW_ACCOUNT_LARGE_AMOUNT**: 1,000 PI (For new accounts)
- **NEW_ACCOUNT_AGE**: 24 hours (Account age threshold)
- **RAPID_OPERATIONS_COUNT**: 5 operations in 1 minute (Suspicious)

## Database Migration | ترحيل قاعدة البيانات

To apply the database migration:

لتطبيق ترحيل قاعدة البيانات:

```bash
# Using Prisma
npx prisma migrate deploy

# Or run the SQL directly
psql -U username -d database_name -f prisma/migrations/20260102_add_audit_logs/migration.sql
```

## Testing | الاختبار

### Test Demo Page

Visit `/dashboard/approval-demo` to test the approval system with pre-configured scenarios:

قم بزيارة `/dashboard/approval-demo` لاختبار نظام الموافقات مع سيناريوهات مُعدة مسبقاً:

1. Normal small operation (approval) | عملية صغيرة عادية (موافقة)
2. Large operation (rejection - exceeds limit) | عملية كبيرة (رفض - تجاوز الحد)
3. High-risk amount | مبلغ عالي المخاطر
4. Withdrawal operation | عملية سحب

### Run Unit Tests

```bash
npm run test:unit
```

All existing forensic-utils tests pass with the new database integration.

جميع اختبارات forensic-utils الحالية تنجح مع تكامل قاعدة البيانات الجديد.

## Architecture | البنية المعمارية

```
┌─────────────────┐
│   Dashboard     │
│  (React UI)     │
└────────┬────────┘
         │ useApprovalOperation()
         │
         ▼
┌─────────────────┐
│  /api/approval  │◄──────┐
│   (Next.js)     │       │
└────────┬────────┘       │
         │                │
         ▼                │
┌─────────────────┐       │
│ forensic-utils  │       │
│  (Validation)   │       │
└────────┬────────┘       │
         │                │
         ▼                │
┌─────────────────┐       │
│  Prisma Client  │       │
│   (Database)    │       │
└────────┬────────┘       │
         │                │
         ▼                │
┌─────────────────┐       │
│   PostgreSQL/   │       │
│    Supabase     │       │
└─────────────────┘       │
         │                │
         │ Audit Log ID   │
         └────────────────┘
         │
         ▼
┌─────────────────┐
│ Toast Notif.    │
│ (If Rejected)   │
└─────────────────┘
```

## Future Enhancements | التحسينات المستقبلية

- [ ] Real-time notifications using WebSocket
- [ ] Admin dashboard for viewing all audit logs
- [ ] Export audit logs to CSV/PDF
- [ ] Machine learning for fraud detection
- [ ] Two-factor authentication for high-risk operations
- [ ] Blockchain integration for ultimate immutability
- [ ] Email notifications for critical operations

## Support | الدعم

For questions or issues, please contact the TEC Ecosystem team or open an issue on GitHub.

للأسئلة أو المشاكل، يرجى الاتصال بفريق TEC Ecosystem أو فتح مشكلة على GitHub.
