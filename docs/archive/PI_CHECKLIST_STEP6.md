# ✅ تفعيل الخطوة 6 في Pi Developer Portal Checklist

## 🎯 المشكلة

في **Pi Developer Portal** → **App Development Checklist**  
الخطوة 6: **"Test a payment in Sandbox"** لسه مش متفعلة ✅

---

## 📋 الحل: كيف تفعّل الخطوة 6

### الطريقة الصحيحة:

#### 1️⃣ افتح Pi Developer Portal

```
https://develop.pi
```

في Pi Browser

---

#### 2️⃣ اذهب إلى تطبيقك

1. **My Apps** → **TEC Ecosystem**
2. ستجد **"App Development Checklist"** في الصفحة الرئيسية

---

#### 3️⃣ الخطوة 6: Test a Payment in Sandbox

**ما تحتاج عمله:**

##### A. تأكد من Sandbox Mode مفعّل:

```
Settings → Development Mode
☑ Enable Sandbox Mode
```

##### B. اعمل اختبار دفع من **داخل Pi Developer Portal**:

1. في صفحة التطبيق، ابحث عن:

   ```
   "Test Payment" أو "Payment Testing" أو "Sandbox Payment"
   ```

2. اضغط على **"Test Payment"** أو **"Create Test Payment"**

3. املأ البيانات:

   ```
   Amount: 1 Pi
   Memo: Test payment for TEC Ecosystem
   ```

4. اضغط **"Submit"** أو **"Create Payment"**

5. **أكمل الدفع الوهمي** في النافذة المنبثقة

---

##### C. أو اعمل اختبار من التطبيق نفسه:

إذا كان عندك صفحة دفع في التطبيق:

1. افتح التطبيق في Pi Browser:

   ```
   https://tec-ecosystem.vercel.app
   ```

2. اذهب لصفحة فيها دفع (مثلاً صفحة اشتراك Premium)

3. اضغط على **"Pay with Pi"**

4. أكمل الدفع الوهمي

5. **ارجع لـ Pi Developer Portal**

6. في صفحة التطبيق، اضغط **"Refresh"** أو **"Check Status"**

7. الخطوة 6 المفروض تتفعل تلقائياً ✅

---

## 🔍 إذا الخطوة لسه مش متفعلة

### جرب هذه الطرق:

#### الطريقة 1: من Payment History

1. في Pi Developer Portal → تطبيقك
2. اذهب إلى **"Payments"** أو **"Payment History"**
3. ابحث عن الدفعة الناجحة اللي عملتها
4. اضغط عليها
5. اضغط **"Mark as Tested"** أو **"Verify Payment"**

---

#### الطريقة 2: من Checklist نفسها

1. في صفحة **App Development Checklist**
2. اضغط على الخطوة 6 نفسها
3. ستفتح صفحة تفاصيل
4. اضغط **"I have completed this step"** أو **"Mark as Done"**
5. قد يطلب منك:
   - Payment ID (من الدفعة الناجحة)
   - Screenshot (صورة للدفعة)
   - Confirmation

---

#### الطريقة 3: استخدم Pi SDK للاختبار

إذا عندك صفحة في التطبيق، أضف هذا الكود:

```javascript
// في صفحة اختبار (مثلاً /test-payment)
import { useEffect } from "react";

export default function TestPayment() {
  useEffect(() => {
    // تحميل Pi SDK
    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.Pi.init({
        version: "2.0",
        sandbox: true, // مهم للـ Sandbox
      });
    };
  }, []);

  const handleTestPayment = async () => {
    try {
      const payment = await window.Pi.createPayment(
        {
          amount: 1,
          memo: "Test payment for Pi Developer Portal Step 6",
          metadata: {
            test: true,
            step: 6,
            app: "TEC Ecosystem",
          },
        },
        {
          onReadyForServerApproval: (paymentId) => {
            console.log("Payment ID:", paymentId);
            // أرسل للـ backend للموافقة
            fetch("/api/payments/approve", {
              method: "POST",
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            console.log("Payment completed:", paymentId, txid);
            // أكمل الدفع
            fetch("/api/payments/complete", {
              method: "POST",
              body: JSON.stringify({ paymentId, txid }),
            });
          },
          onCancel: (paymentId) => {
            console.log("Payment cancelled");
          },
          onError: (error, payment) => {
            console.error("Payment error:", error);
          },
        },
      );

      console.log("Payment created:", payment);
      alert("✅ Payment test successful! Check Pi Developer Portal.");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Payment test failed: " + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Test Payment for Pi Developer Portal Step 6
      </h1>
      <button
        onClick={handleTestPayment}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg"
      >
        🧪 Test Payment (1 Pi)
      </button>
      <p className="mt-4 text-gray-600">
        This will create a test payment in Sandbox mode. After completion, check
        Pi Developer Portal.
      </p>
    </div>
  );
}
```

**استخدمها:**

1. احفظ الكود في `pages/test-payment.js`
2. افتح: `https://tec-ecosystem.vercel.app/test-payment`
3. اضغط الزر
4. أكمل الدفع الوهمي
5. ارجع لـ Pi Developer Portal وشوف الخطوة 6

---

## 🎯 الخطوات بالترتيب (ملخص سريع)

```
1. Pi Developer Portal → تطبيقك
2. تأكد Sandbox Mode مفعّل ✅
3. اعمل دفعة اختبار (من Portal أو من التطبيق)
4. أكمل الدفع الوهمي
5. ارجع للـ Portal
6. Refresh الصفحة
7. الخطوة 6 المفروض تتفعل ✅
```

---

## 📊 كيف تعرف إن الخطوة اتفعلت؟

### قبل:

```
App Development Checklist:
☑ Step 1: Create app
☑ Step 2: Configure OAuth
☑ Step 3: Add API keys
☑ Step 4: Test authentication
☑ Step 5: Configure payments
☐ Step 6: Test a payment in Sandbox  ← لسه مش متفعلة
☐ Step 7: Submit for review
```

### بعد:

```
App Development Checklist:
☑ Step 1: Create app
☑ Step 2: Configure OAuth
☑ Step 3: Add API keys
☑ Step 4: Test authentication
☑ Step 5: Configure payments
☑ Step 6: Test a payment in Sandbox  ← اتفعلت! ✅
☐ Step 7: Submit for review
```

---

## 🆘 إذا لسه مش شغالة

### جرب:

1. **امسح Cache:**
   - في Pi Browser: Settings → Clear Cache
   - أعد فتح Pi Developer Portal

2. **سجل خروج ودخول:**
   - Logout من Pi Developer Portal
   - Login مرة تانية

3. **انتظر شوية:**
   - أحياناً يأخذ 5-10 دقائق للتحديث

4. **تواصل مع Pi Support:**
   - إذا عملت كل حاجة صح ولسه مش شغالة
   - Email: support@minepi.com
   - قول لهم:
     ```
     "I completed a test payment in Sandbox mode,
     but Step 6 in the App Development Checklist
     is not marked as complete. Payment ID: [xxx]"
     ```

---

## ✅ بعد ما الخطوة 6 تتفعل

**الخطوة التالية:**

```
Step 7: Submit for Review
```

هتقدر تقدم التطبيق للمراجعة وتنشره على Pi Network!

---

## 💡 نصيحة مهمة

**قبل ما تقدم للمراجعة (Step 7):**

تأكد من:

- ✅ جميع الـ 24 نطاق شغالة
- ✅ المصادقة تعمل بشكل صحيح
- ✅ الدفع يعمل (اختبرته في Sandbox)
- ✅ التطبيق منشور على Vercel
- ✅ لا توجد أخطاء في Logs
- ✅ الصفحات تفتح بسرعة
- ✅ Terms & Privacy موجودة

---

**هل تحتاج مساعدة في إنشاء صفحة اختبار الدفع؟**

أو تريد كود جاهز لاختبار الدفع؟
