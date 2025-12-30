import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function EstateCountries() {
  return (
    <>
      <Head>
        <title>Countries Accepting Pi - Estate | TEC</title>
        <meta
          name="description"
          content="Countries and regions accepting Pi for real estate"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Countries Accepting Pi / الدول التي تقبل Pi
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Global Pi Real Estate Markets / أسواق العقارات العالمية بـ Pi
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                United Arab Emirates
              </h3>
              <p className="text-gray-400">
                Dubai, Abu Dhabi - Premium properties
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Switzerland
              </h3>
              <p className="text-gray-400">
                Geneva, Zurich - Luxury residences
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                United Kingdom
              </h3>
              <p className="text-gray-400">London - Elite properties</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Monaco</h3>
              <p className="text-gray-400">Exclusive waterfront estates</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Singapore
              </h3>
              <p className="text-gray-400">Premium urban living</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                United States
              </h3>
              <p className="text-gray-400">
                New York, Miami, LA - Luxury homes
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
