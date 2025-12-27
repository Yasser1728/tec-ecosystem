import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function NexusIntegration() {
  return (
    <>
      <Head>
        <title>Platform Integration - Nexus | TEC</title>
        <meta name="description" content="Integrate all TEC domains seamlessly" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Platform Integration / تكامل المنصة
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Unified TEC Ecosystem / نظام TEC الموحد
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Data Integration / تكامل البيانات</h3>
              <p className="text-gray-400">Seamless data flow across domains</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">API Connectivity / اتصال API</h3>
              <p className="text-gray-400">Robust API integration layer</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Workflow Automation / أتمتة سير العمل</h3>
              <p className="text-gray-400">Automated cross-domain workflows</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Unified Dashboard / لوحة موحدة</h3>
              <p className="text-gray-400">Single view of all domains</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
