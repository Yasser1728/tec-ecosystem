import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ConnectionPartners() {
  return (
    <>
      <Head>
        <title>Partner Matching - Connection | TEC</title>
        <meta
          name="description"
          content="Find and connect with strategic partners"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Partner Matching / مطابقة الشركاء
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Strategic Partner Discovery / اكتشاف الشركاء الاستراتيجيين
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                AI Matching / المطابقة الذكية
              </h3>
              <p className="text-gray-400">
                AI-powered partner recommendations
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Verified Network / الشبكة الموثقة
              </h3>
              <p className="text-gray-400">Access verified elite partners</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
