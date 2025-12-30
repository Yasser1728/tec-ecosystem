import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function EstateListings() {
  return (
    <>
      <Head>
        <title>Featured Properties - Estate | TEC</title>
        <meta name="description" content="Curated luxury property listings" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Featured Properties / العقارات المميزة
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Curated Elite Real Estate / عقارات نخبوية منسقة
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Dubai Marina Penthouse
              </h3>
              <p className="text-gray-400 mb-2">12,500,000 Pi</p>
              <p className="text-gray-400">
                5 bed, 6 bath | 5,000 sq ft | Waterfront
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                London Mayfair Mansion
              </h3>
              <p className="text-gray-400 mb-2">25,000,000 Pi</p>
              <p className="text-gray-400">
                8 bed, 10 bath | 12,000 sq ft | Historic
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Monaco Seafront Villa
              </h3>
              <p className="text-gray-400 mb-2">45,000,000 Pi</p>
              <p className="text-gray-400">
                6 bed, 8 bath | 8,000 sq ft | Private Beach
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                New York Penthouse
              </h3>
              <p className="text-gray-400 mb-2">35,000,000 Pi</p>
              <p className="text-gray-400">
                7 bed, 9 bath | 10,000 sq ft | Central Park View
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
