import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AlertNotifications() {
  return (
    <>
      <Head>
        <title>Critical Alerts - Alert | TEC</title>
        <meta
          name="description"
          content="Real-time critical market alerts and notifications"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Critical Alerts / التنبيهات الحرجة
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Real-Time Notifications / الإشعارات في الوقت الفعلي
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Price Alerts / تنبيهات الأسعار
              </h3>
              <p className="text-gray-400">
                Get notified of significant price movements
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Market Alerts / تنبيهات السوق
              </h3>
              <p className="text-gray-400">
                Critical market events and changes
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Portfolio Alerts / تنبيهات المحفظة
              </h3>
              <p className="text-gray-400">
                Important updates on your investments
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
