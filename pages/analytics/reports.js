import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AnalyticsReports() {
  return (
    <>
      <Head>
        <title>Intelligence Reports - Analytics | TEC</title>
        <meta name="description" content="Comprehensive market intelligence reports" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Intelligence Reports / تقارير الذكاء
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Comprehensive Market Intelligence / ذكاء السوق الشامل
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Daily Reports / التقارير اليومية</h3>
              <p className="text-gray-400">Daily market intelligence and insights</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Weekly Analysis / التحليل الأسبوعي</h3>
              <p className="text-gray-400">Comprehensive weekly market reviews</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Monthly Outlook / التوقعات الشهرية</h3>
              <p className="text-gray-400">Strategic monthly market forecasts</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
