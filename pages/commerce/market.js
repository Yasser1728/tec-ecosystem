import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CommerceMarket() {
  return (
    <>
      <Head>
        <title>Market Insights - Commerce | TEC</title>
        <meta
          name="description"
          content="B2B market intelligence and insights"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Market Insights / رؤى السوق
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            B2B Market Intelligence / ذكاء سوق الأعمال
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Industry Trends / اتجاهات الصناعة
              </h3>
              <p className="text-gray-400">
                Latest B2B market trends and analysis
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Competitive Analysis / التحليل التنافسي
              </h3>
              <p className="text-gray-400">
                Strategic market positioning insights
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
