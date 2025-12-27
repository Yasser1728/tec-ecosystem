import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function NbfSettlements() {
  return (
    <>
      <Head>
        <title>Pi Settlements - NBF | TEC</title>
        <meta name="description" content="Pi-based settlement and transaction services" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Pi Settlements / تسويات Pi
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Instant Pi-Based Transactions / معاملات Pi الفورية
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Instant Settlement / التسوية الفورية</h3>
              <p className="text-gray-400">Real-time Pi transaction processing</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Bulk Transactions / المعاملات الجماعية</h3>
              <p className="text-gray-400">Process multiple payments efficiently</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">International Settlements / التسويات الدولية</h3>
              <p className="text-gray-400">Cross-border Pi transactions made simple</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
