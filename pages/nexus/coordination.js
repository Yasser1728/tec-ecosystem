import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function NexusCoordination() {
  return (
    <>
      <Head>
        <title>Cross-Sector Coordination - Nexus | TEC</title>
        <meta name="description" content="Coordinate across multiple business sectors" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Cross-Sector Coordination / التنسيق بين القطاعات
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Seamless Multi-Sector Operations / عمليات سلسة متعددة القطاعات
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Strategic Alignment / التوافق الاستراتيجي</h3>
              <p className="text-gray-400">Align strategies across sectors</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Resource Optimization / تحسين الموارد</h3>
              <p className="text-gray-400">Optimize resources across domains</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Synergy Creation / خلق التآزر</h3>
              <p className="text-gray-400">Create cross-sector synergies</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
