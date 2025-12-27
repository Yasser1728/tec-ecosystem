import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function AlertUpdates() {
  return (
    <>
      <Head>
        <title>Market Updates - Alert | TEC</title>
        <meta name="description" content="Latest market updates and news" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Market Updates / تحديثات السوق
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Latest Market News & Updates / أحدث أخبار وتحديثات السوق
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Breaking News / الأخبار العاجلة</h3>
              <p className="text-gray-400">Real-time market breaking news</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Market Movers / محركات السوق</h3>
              <p className="text-gray-400">Top market movers and shakers</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Economic Data / البيانات الاقتصادية</h3>
              <p className="text-gray-400">Key economic indicators and releases</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Regulatory Changes / التغييرات التنظيمية</h3>
              <p className="text-gray-400">Important regulatory updates</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
