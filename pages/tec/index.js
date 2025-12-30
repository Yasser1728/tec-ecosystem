import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TEC() {
  return (
    <>
      <Head>
        <title>TEC - Unified Portal | Titan Elite Commerce</title>
        <meta
          name="description"
          content="Unified portal for all TEC sovereign business domains"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            TEC Hub / مركز تي إي سي
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Titan Elite Commerce Unified Portal / البوابة الموحدة لتيتان إيليت
            كوميرس
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Unified Access / الوصول الموحد
              </h3>
              <p className="text-gray-400">
                Access all 24 sovereign business domains from one portal
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Domain Overview / نظرة عامة
              </h3>
              <p className="text-gray-400">
                Comprehensive overview of all business units
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Strategic Guidance / التوجيه الاستراتيجي
              </h3>
              <p className="text-gray-400">
                Navigate the TEC ecosystem with expert guidance
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
