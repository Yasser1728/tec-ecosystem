import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function BrookfieldStrategy() {
  return (
    <>
      <Head>
        <title>Real Estate Strategy - Brookfield | TEC</title>
        <meta name="description" content="Strategic real estate investment planning" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Real Estate Strategy / استراتيجية العقارات
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Strategic Investment Planning / التخطيط الاستثماري الاستراتيجي
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Market Analysis / تحليل السوق</h3>
              <p className="text-gray-400">Comprehensive market trend analysis and forecasting</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Investment Timing / توقيت الاستثمار</h3>
              <p className="text-gray-400">Optimal entry and exit strategy planning</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Portfolio Optimization / تحسين المحفظة</h3>
              <p className="text-gray-400">Diversification and risk management strategies</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
