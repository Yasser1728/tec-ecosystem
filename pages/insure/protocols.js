import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function InsureProtocols() {
  return (
    <>
      <Head>
        <title>Protection Protocols - Insure | TEC</title>
        <meta name="description" content="Elite deal protection protocols" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Protection Protocols / بروتوكولات الحماية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Comprehensive Deal Protection / حماية شاملة للصفقات
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Transaction Protection / حماية المعاملات</h3>
              <p className="text-gray-400">Secure all Pi-based transactions</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Asset Protection / حماية الأصول</h3>
              <p className="text-gray-400">Comprehensive asset insurance coverage</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Fraud Prevention / منع الاحتيال</h3>
              <p className="text-gray-400">Advanced fraud detection and prevention</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Risk Management / إدارة المخاطر</h3>
              <p className="text-gray-400">Proactive risk assessment and mitigation</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
