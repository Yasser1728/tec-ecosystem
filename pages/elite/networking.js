import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function EliteNetworking() {
  return (
    <>
      <Head>
        <title>Networking Events - Elite | TEC</title>
        <meta
          name="description"
          content="Exclusive elite networking opportunities"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Networking Events / فعاليات التواصل
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Elite Networking Opportunities / فرص التواصل النخبوي
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Executive Roundtables / مائدة مستديرة تنفيذية
              </h3>
              <p className="text-gray-400">
                Monthly gatherings of C-level executives
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Industry Summits / قمم الصناعة
              </h3>
              <p className="text-gray-400">Annual elite industry conferences</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Private Dinners / عشاء خاص
              </h3>
              <p className="text-gray-400">Intimate networking dinners</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Virtual Meetups / لقاءات افتراضية
              </h3>
              <p className="text-gray-400">Online networking sessions</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
