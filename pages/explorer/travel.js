import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ExplorerTravel() {
  return (
    <>
      <Head>
        <title>Luxury Travel - Explorer | TEC</title>
        <meta name="description" content="Elite travel experiences and concierge services" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Luxury Travel / السفر الفاخر
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Curated Elite Travel Experiences / تجارب سفر نخبوية منسقة
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Luxury Resorts / المنتجعات الفاخرة</h3>
              <p className="text-gray-400">World's finest hotels and private villas</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Yacht Charters / استئجار اليخوت</h3>
              <p className="text-gray-400">Private yacht experiences worldwide</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Exclusive Experiences / تجارب حصرية</h3>
              <p className="text-gray-400">VIP access to events and attractions</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
