import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function EliteInsights() {
  return (
    <>
      <Head>
        <title>Premium Insights - Elite | TEC</title>
        <meta name="description" content="Exclusive insights for elite members" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Premium Insights / رؤى ممتازة
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Exclusive Elite Intelligence / الذكاء النخبوي الحصري
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Market Intelligence / ذكاء السوق</h3>
              <p className="text-gray-400">Exclusive market analysis and predictions</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Investment Opportunities / فرص الاستثمار</h3>
              <p className="text-gray-400">Early access to premium opportunities</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Trend Analysis / تحليل الاتجاهات</h3>
              <p className="text-gray-400">Advanced trend forecasting and analysis</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Expert Reports / تقارير الخبراء</h3>
              <p className="text-gray-400">Comprehensive reports from industry leaders</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
