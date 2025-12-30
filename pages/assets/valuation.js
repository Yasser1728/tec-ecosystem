import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AssetsValuation() {
  return (
    <>
      <Head>
        <title>Asset Valuation Tools - Assets | TEC</title>
        <meta
          name="description"
          content="Professional asset valuation and analysis tools"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Asset Valuation / تقييم الأصول
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Professional Valuation Tools / أدوات التقييم الاحترافية
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Real Estate Valuation / التقييم العقاري
              </h3>
              <p className="text-gray-400 mb-4">
                Comprehensive property valuation based on market data
              </p>
              <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-2 px-6 rounded">
                Value Property
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Luxury Asset Appraisal / تقييم الأصول الفاخرة
              </h3>
              <p className="text-gray-400 mb-4">
                Expert appraisal for art, collectibles, and luxury items
              </p>
              <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-2 px-6 rounded">
                Request Appraisal
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Portfolio Analysis / تحليل المحفظة
              </h3>
              <p className="text-gray-400 mb-4">
                Complete portfolio performance and risk analysis
              </p>
              <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-2 px-6 rounded">
                Analyze Portfolio
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Market Comparison / مقارنة السوق
              </h3>
              <p className="text-gray-400 mb-4">
                Compare your assets against market benchmarks
              </p>
              <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-2 px-6 rounded">
                Compare Assets
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
