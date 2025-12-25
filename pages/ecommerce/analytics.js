import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function EcommerceAnalytics() {
  return (
    <>
      <Head>
        <title>Sales Analytics - Ecommerce | TEC</title>
        <meta name="description" content="Track your sales performance and analytics" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Sales Analytics / تحليلات المبيعات
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Track Performance & Insights / تتبع الأداء والرؤى
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Sales Dashboard / لوحة المبيعات</h3>
              <p className="text-gray-400">Real-time sales performance tracking</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Customer Insights / رؤى العملاء</h3>
              <p className="text-gray-400">Understand buyer behavior and preferences</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
