import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function ZoneMaps() {
  return (
    <>
      <Head>
        <title>Economic Zones Map - Zone | TEC</title>
        <meta name="description" content="Interactive map of global economic zones" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Economic Zones Map / خريطة المناطق الاقتصادية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Global Economic Zone Overview / نظرة عامة على المناطق الاقتصادية العالمية
          </p>

          <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20 mb-8">
            <div className="aspect-video bg-gray-900 rounded flex items-center justify-center">
              <p className="text-gray-400">Interactive Map Coming Soon / الخريطة التفاعلية قريبًا</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Middle East / الشرق الأوسط</h3>
              <p className="text-gray-400">45+ Economic zones</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Asia Pacific / آسيا والمحيط الهادئ</h3>
              <p className="text-gray-400">120+ Economic zones</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Europe / أوروبا</h3>
              <p className="text-gray-400">80+ Economic zones</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
