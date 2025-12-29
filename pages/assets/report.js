import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AssetsReport() {
  return (
    <>
      <Head>
        <title>Performance Reports - Assets | TEC</title>
        <meta name="description" content="Detailed performance reports and analytics" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Performance Reports / تقارير الأداء
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Comprehensive Asset Performance Analysis / تحليل شامل لأداء الأصول
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Monthly Report / التقرير الشهري</h3>
              <p className="text-gray-400 mb-4">Detailed monthly performance breakdown with insights</p>
              <div className="flex gap-4">
                <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-2 px-6 rounded">
                  View Report
                </button>
                <button className="border border-[#00ff9d] text-[#00ff9d] font-bold py-2 px-6 rounded hover:bg-[#00ff9d]/10">
                  Download PDF
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Quarterly Report / التقرير الفصلي</h3>
              <p className="text-gray-400 mb-4">Comprehensive quarterly analysis and projections</p>
              <div className="flex gap-4">
                <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-2 px-6 rounded">
                  View Report
                </button>
                <button className="border border-[#00c6ff] text-[#00c6ff] font-bold py-2 px-6 rounded hover:bg-[#00c6ff]/10">
                  Download PDF
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Annual Report / التقرير السنوي</h3>
              <p className="text-gray-400 mb-4">Complete annual performance review and strategy recommendations</p>
              <div className="flex gap-4">
                <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-2 px-6 rounded">
                  View Report
                </button>
                <button className="border border-[#00ff9d] text-[#00ff9d] font-bold py-2 px-6 rounded hover:bg-[#00ff9d]/10">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
