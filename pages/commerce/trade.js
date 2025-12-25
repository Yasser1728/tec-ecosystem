import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CommerceTrade() {
  return (
    <>
      <Head>
        <title>B2B Trading - Commerce | TEC</title>
        <meta name="description" content="Elite B2B trading platform" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            B2B Trading / التجارة بين الشركات
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Elite Business-to-Business Trading / التجارة بين الشركات النخبوية
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Bulk Orders / الطلبات الجماعية</h3>
              <p className="text-gray-400">Large-scale business transactions</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Trade Finance / التمويل التجاري</h3>
              <p className="text-gray-400">Flexible payment and financing options</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Global Network / الشبكة العالمية</h3>
              <p className="text-gray-400">Connect with businesses worldwide</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
