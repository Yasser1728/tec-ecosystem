import { withAuth } from "../../lib/withAuth";
import { USER_TIERS } from "../../lib/roles";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useApprovalOperation } from "../../lib/useApprovalOperation";

function ApprovalDemo({ session }) {
  const user = session?.user;
  const { submitForApproval, isProcessing, error } = useApprovalOperation();

  const [operationType, setOperationType] = useState("payment_create");
  const [amount, setAmount] = useState(100);
  const [domain, setDomain] = useState("commerce");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    const operationData = {
      operationType,
      domain,
      operationData: {
        amount: parseFloat(amount),
        domain,
        userId: user?.id,
      },
      context: {
        testMode: true,
      },
    };

    const response = await submitForApproval(operationData);
    setResult(response);
  };

  const testScenarios = [
    {
      name: "عملية صغيرة عادية (موافقة)",
      type: "payment_create",
      amount: 100,
      domain: "commerce",
    },
    {
      name: "عملية كبيرة (رفض - تجاوز الحد)",
      type: "payment_create",
      amount: 60000,
      domain: "fundx",
    },
    {
      name: "عملية بمبلغ عالي المخاطر",
      type: "payment_create",
      amount: 15000,
      domain: "estate",
    },
    {
      name: "سحب مالي",
      type: "withdrawal",
      amount: 500,
      domain: "fundx",
    },
  ];

  const loadScenario = (scenario) => {
    setOperationType(scenario.type);
    setAmount(scenario.amount);
    setDomain(scenario.domain);
  };

  return (
    <>
      <Head>
        <title>Approval System Demo - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-[#00ff9d]"
            >
              Dashboard
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-white">Approval System Demo</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              نظام الموافقات والإنذار المبكر
            </h1>
            <p className="text-gray-400">
              اختبر نظام التحقق من الموافقات مع الإشعارات التلقائية
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Test Form */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">اختبار العملية</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع العملية
                  </label>
                  <select
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00ff9d]"
                  >
                    <option value="payment_create">إنشاء دفعة</option>
                    <option value="payment_approve">الموافقة على دفعة</option>
                    <option value="withdrawal">سحب</option>
                    <option value="transfer">تحويل</option>
                    <option value="nft_mint">صك NFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    المبلغ (PI)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00ff9d]"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    المجال
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00ff9d]"
                  >
                    <option value="commerce">Commerce</option>
                    <option value="fundx">FundX</option>
                    <option value="estate">Estate</option>
                    <option value="explorer">Explorer</option>
                    <option value="nexus">Nexus</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "جاري المعالجة..." : "إرسال للموافقة"}
                </button>
              </form>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              {/* Result Display */}
              {result && (
                <div
                  className={`mt-4 p-4 rounded-lg border ${
                    result.success
                      ? "bg-green-500/20 border-green-500/50 text-green-400"
                      : "bg-red-500/20 border-red-500/50 text-red-400"
                  }`}
                >
                  <h3 className="font-semibold mb-2">
                    {result.success ? "✓ موافقة" : "✕ رفض"}
                  </h3>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Test Scenarios */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">سيناريوهات الاختبار</h2>
              <div className="space-y-4">
                {testScenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => loadScenario(scenario)}
                  >
                    <h3 className="font-semibold mb-2">{scenario.name}</h3>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>النوع: {scenario.type}</p>
                      <p>المبلغ: {scenario.amount} PI</p>
                      <p>المجال: {scenario.domain}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">💡 ملاحظة</h3>
                <p className="text-sm text-gray-300">
                  عند رفض العملية، سترى إشعار Toast في الزاوية العلوية اليمنى
                  يوضح سبب الرفض. يمكنك اختبار السيناريوهات المختلفة بالنقر
                  عليها أعلاه.
                </p>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-yellow-400">
                  ⚠️ حدود الأمان
                </h3>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>المبالغ أكثر من 50,000 PI تُرفض تلقائياً</li>
                  <li>المبالغ فوق 10,000 PI تُعتبر عالية المخاطر</li>
                  <li>العمليات السريعة المتكررة تُعتبر مشبوهة</li>
                  <li>المستخدمون الجدد لهم حدود أقل</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              كيف يعمل نظام الموافقات؟
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2 text-[#00ff9d]">
                  1. التحقق من الهوية
                </h3>
                <p className="text-gray-300">
                  يتحقق النظام من هوية المستخدم وصلاحياته قبل معالجة أي عملية
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#00ff9d]">
                  2. التحقق من العملية
                </h3>
                <p className="text-gray-300">
                  يتم التحقق من صحة بيانات العملية وتقييم مستوى المخاطر
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#00ff9d]">
                  3. كشف النشاط المشبوه
                </h3>
                <p className="text-gray-300">
                  يكتشف النظام الأنماط المشبوهة مثل العمليات السريعة المتكررة
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default withAuth(ApprovalDemo, {
  requiredTier: USER_TIERS.STANDARD,
});
