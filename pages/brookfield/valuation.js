import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function BrookfieldValuation() {
  return (
    <>
      <Head>
        <title>Property Valuation - Brookfield | TEC</title>
        <meta
          name="description"
          content="Professional property valuation services"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Property Valuation / تقييم العقارات
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Expert Property Assessment / التقييم العقاري الخبير
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Residential Valuation / التقييم السكني
              </h3>
              <p className="text-gray-400">
                Comprehensive home and apartment valuations
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Commercial Valuation / التقييم التجاري
              </h3>
              <p className="text-gray-400">
                Office and retail property assessments
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Land Valuation / تقييم الأراضي
              </h3>
              <p className="text-gray-400">
                Development land and plot assessments
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Portfolio Valuation / تقييم المحفظة
              </h3>
              <p className="text-gray-400">
                Complete property portfolio analysis
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
