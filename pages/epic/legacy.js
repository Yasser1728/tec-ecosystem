import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function EpicLegacy() {
  return (
    <>
      <Head>
        <title>Legacy Projects - Epic | TEC</title>
        <meta name="description" content="Build lasting legacy projects" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Legacy Projects / مشاريع الإرث
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Build Your Lasting Legacy / ابن إرثك الدائم
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Generational Wealth / الثروة عبر الأجيال</h3>
              <p className="text-gray-400">Create wealth that lasts generations</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Landmark Investments / استثمارات بارزة</h3>
              <p className="text-gray-400">Invest in projects that define eras</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Impact Legacy / إرث التأثير</h3>
              <p className="text-gray-400">Make a lasting impact on society</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
