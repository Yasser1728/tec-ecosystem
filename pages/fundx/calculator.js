import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { withAuth } from "../../lib/withAuth";
import { USER_TIERS } from "../../lib/roles";

function FundxCalculator({ session }) {
  return (
    <>
      <Head>
        <title>ROI Calculator - FundX | TEC</title>
        <meta
          name="description"
          content="Calculate your return on investment with FundX"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            ROI Calculator / حاسبة العائد على الاستثمار
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Calculate Your Investment Returns / احسب عوائد استثمارك
          </p>

          <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg border border-[#00ff9d]/20">
            <div className="space-y-6">
              <div>
                <label className="block text-[#00ff9d] mb-2">
                  Initial Investment (Pi) / الاستثمار الأولي
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-900 text-white p-3 rounded border border-[#00c6ff]/30"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-[#00c6ff] mb-2">
                  Investment Period (Years) / فترة الاستثمار
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-900 text-white p-3 rounded border border-[#00ff9d]/30"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-[#00ff9d] mb-2">
                  Expected Annual Return (%) / العائد السنوي المتوقع
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-900 text-white p-3 rounded border border-[#00c6ff]/30"
                  placeholder="20"
                />
              </div>

              <button className="w-full bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-3 rounded hover:opacity-90 transition">
                Calculate Returns / احسب العوائد
              </button>

              <div className="mt-6 p-4 bg-gray-900 rounded border border-[#00ff9d]/20">
                <p className="text-gray-400 text-center">
                  Your projected returns will appear here
                </p>
                <p className="text-gray-400 text-center">
                  عوائدك المتوقعة ستظهر هنا
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default withAuth(FundxCalculator, {
  requiredTier: USER_TIERS.STANDARD,
});
