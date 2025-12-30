import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TitanStrategy() {
  return (
    <>
      <Head>
        <title>Strategic Decisions - Titan | TEC</title>
        <meta
          name="description"
          content="Elite strategic decision-making framework"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Strategic Decisions / القرارات الاستراتيجية
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Elite Decision-Making Framework / إطار اتخاذ القرارات النخبوي
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Strategic Analysis / التحليل الاستراتيجي
              </h3>
              <p className="text-gray-400">
                Comprehensive market and competitive analysis
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Decision Framework / إطار القرارات
              </h3>
              <p className="text-gray-400">
                Structured approach to strategic decisions
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Risk Management / إدارة المخاطر
              </h3>
              <p className="text-gray-400">
                Assess and mitigate strategic risks
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
