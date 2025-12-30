import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AnalyticsForecast() {
  return (
    <>
      <Head>
        <title>Predictive Insights - Analytics | TEC</title>
        <meta
          name="description"
          content="AI-powered market forecasting and predictions"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Predictive Insights / رؤى تنبؤية
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            AI-Powered Forecasting / التنبؤ بالذكاء الاصطناعي
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Price Forecasts / توقعات الأسعار
              </h3>
              <p className="text-gray-400">ML-powered price predictions</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Risk Predictions / توقعات المخاطر
              </h3>
              <p className="text-gray-400">Predictive risk assessment models</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Opportunity Detection / اكتشاف الفرص
              </h3>
              <p className="text-gray-400">
                AI-identified investment opportunities
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Scenario Planning / تخطيط السيناريوهات
              </h3>
              <p className="text-gray-400">
                Model future scenarios and outcomes
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
