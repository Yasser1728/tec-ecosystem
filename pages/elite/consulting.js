import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function EliteConsulting() {
  return (
    <>
      <Head>
        <title>Business Consulting - Elite | TEC</title>
        <meta
          name="description"
          content="Premium business consulting services"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Business Consulting / الاستشارات التجارية
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Elite Strategic Consulting / الاستشارات الاستراتيجية النخبوية
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Strategy Development / تطوير الاستراتيجية
              </h3>
              <p className="text-gray-400">
                Develop winning business strategies with expert guidance
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Market Expansion / توسع السوق
              </h3>
              <p className="text-gray-400">
                Scale your business to new markets
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Financial Advisory / الاستشارات المالية
              </h3>
              <p className="text-gray-400">
                Expert financial planning and optimization
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
