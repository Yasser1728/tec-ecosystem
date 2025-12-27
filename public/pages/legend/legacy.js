import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function LegendLegacy() {
  return (
    <>
      <Head>
        <title>Legacy Management - Legend | TEC</title>
        <meta name="description" content="Manage and preserve your legendary legacy" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Legacy Management / إدارة الإرث
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Preserve Your Legendary Status / احتفظ بمكانتك الأسطورية
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Family Office / مكتب العائلة</h3>
              <p className="text-gray-400">Comprehensive family wealth management</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Dynasty Planning / تخطيط السلالة</h3>
              <p className="text-gray-400">Multi-generational wealth preservation</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Philanthropic Legacy / الإرث الخيري</h3>
              <p className="text-gray-400">Create lasting charitable impact</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
