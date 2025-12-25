import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function EstateBuyGuide() {
  return (
    <>
      <Head>
        <title>Property Buying Guide - Estate | TEC</title>
        <meta name="description" content="Buy property with Pi Network cryptocurrency" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Property Buying with Pi / شراء العقارات بـ Pi
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Your Guide to Pi-Based Real Estate / دليلك للعقارات باستخدام Pi
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Step 1: Property Search / البحث عن العقار</h3>
              <p className="text-gray-400">Browse our curated luxury properties worldwide</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Step 2: Pi Valuation / تقييم Pi</h3>
              <p className="text-gray-400">Get accurate Pi-based property valuations</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Step 3: Secure Transaction / المعاملة الآمنة</h3>
              <p className="text-gray-400">Complete your purchase with Pi Network</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Step 4: Transfer & Ownership / النقل والملكية</h3>
              <p className="text-gray-400">Secure ownership transfer and documentation</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
