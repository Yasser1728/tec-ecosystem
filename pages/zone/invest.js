import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function ZoneInvest() {
  return (
    <>
      <Head>
        <title>Investment Guides - Zone | TEC</title>
        <meta name="description" content="Comprehensive economic zone investment guides" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Investment Guides / أدلة الاستثمار
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Zone Investment Strategy Guides / أدلة استراتيجية الاستثمار في المناطق
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Setup Guide / دليل الإعداد</h3>
              <p className="text-gray-400">Step-by-step zone company registration</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Tax Benefits / المزايا الضريبية</h3>
              <p className="text-gray-400">Understand tax advantages and incentives</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Legal Framework / الإطار القانوني</h3>
              <p className="text-gray-400">Legal requirements and regulations</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
