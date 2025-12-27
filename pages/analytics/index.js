import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function Analytics() {
  return (
    <>
      <Head>
        <title>Analytics - Market Intelligence | TEC</title>
        <meta name="description" content="Market intelligence and analytics for elite traders" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Analytics / التحليلات
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Market Intelligence Platform / منصة ذكاء السوق
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Market Trends / اتجاهات السوق</h3>
              <p className="text-gray-400">Real-time market analysis and predictive insights</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Intelligence Reports / تقارير الذكاء</h3>
              <p className="text-gray-400">Comprehensive market intelligence reports</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Forecasting / التنبؤ</h3>
              <p className="text-gray-400">Advanced predictive analytics for strategic planning</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
