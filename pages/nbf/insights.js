import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function NbfInsights() {
  return (
    <>
      <Head>
        <title>Banking Insights - NBF | TEC</title>
        <meta
          name="description"
          content="Expert banking insights and market analysis"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Banking Insights / رؤى مصرفية
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Expert Financial Intelligence / الذكاء المالي الخبير
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Market Analysis / تحليل السوق
              </h3>
              <p className="text-gray-400">
                Daily financial market updates and trends
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Economic Forecasts / التوقعات الاقتصادية
              </h3>
              <p className="text-gray-400">
                Expert predictions and strategic guidance
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
