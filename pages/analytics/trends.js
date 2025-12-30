import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AnalyticsTrends() {
  return (
    <>
      <Head>
        <title>Market Trends - Analytics | TEC</title>
        <meta
          name="description"
          content="Real-time market trends and analysis"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Market Trends / اتجاهات السوق
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Real-Time Market Analysis / تحليل السوق في الوقت الفعلي
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Price Trends / اتجاهات الأسعار
              </h3>
              <p className="text-gray-400">
                Track asset price movements and trends
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Market Sentiment / معنويات السوق
              </h3>
              <p className="text-gray-400">
                Analyze investor sentiment and confidence
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Volume Analysis / تحليل الحجم
              </h3>
              <p className="text-gray-400">
                Trading volume patterns and insights
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Sector Performance / أداء القطاعات
              </h3>
              <p className="text-gray-400">
                Cross-sector performance comparison
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
