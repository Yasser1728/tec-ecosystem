import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function BrookfieldProjects() {
  return (
    <>
      <Head>
        <title>Landmark Projects - Brookfield | TEC</title>
        <meta
          name="description"
          content="Prestigious real estate development projects"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Landmark Projects / المشاريع البارزة
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Prestigious Development Portfolio / محفظة التطوير المرموقة
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Dubai Titan Tower
              </h3>
              <p className="text-gray-400">
                120-story luxury mixed-use development
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                London Elite District
              </h3>
              <p className="text-gray-400">
                Exclusive residential and commercial complex
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Singapore Tech Hub
              </h3>
              <p className="text-gray-400">Next-gen smart city development</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
