import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function TecHub() {
  return (
    <>
      <Head>
        <title>Unified Hub - TEC | Titan Elite Commerce</title>
        <meta name="description" content="Central hub for all TEC sovereign domains" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            TEC Unified Hub / المركز الموحد لـ TEC
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Your Gateway to 24 Sovereign Business Domains / بوابتك إلى 24 مجال أعمال سيادي
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-xl font-bold text-[#00ff9d] mb-2">Finance & Investment</h3>
              <p className="text-gray-400">6 Domains</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-xl font-bold text-[#00c6ff] mb-2">Commerce & Trade</h3>
              <p className="text-gray-400">4 Domains</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-xl font-bold text-[#00ff9d] mb-2">Real Estate</h3>
              <p className="text-gray-400">4 Domains</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-xl font-bold text-[#00c6ff] mb-2">Technology</h3>
              <p className="text-gray-400">5 Domains</p>
            </div>
          </div>

          <div className="mt-8 bg-gray-800 p-8 rounded-lg border border-[#00ff9d]/20">
            <h3 className="text-3xl font-bold text-[#00c6ff] mb-4">Unified Access</h3>
            <p className="text-gray-300 mb-4">
              TEC Hub provides seamless access to all 24 sovereign business domains from a single, 
              unified interface. Navigate the entire ecosystem with ease.
            </p>
            <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-3 px-8 rounded-lg hover:opacity-90 transition">
              Explore All Domains / استكشف جميع المجالات
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
