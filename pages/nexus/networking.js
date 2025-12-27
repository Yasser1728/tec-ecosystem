import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function NexusNetworking() {
  return (
    <>
      <Head>
        <title>Elite Connections - Nexus | TEC</title>
        <meta name="description" content="Build elite connections across sectors" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Elite Connections / الاتصالات النخبوية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Build Cross-Sector Networks / بناء شبكات عبر القطاعات
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Executive Network / شبكة التنفيذيين</h3>
              <p className="text-gray-400">Connect with C-level executives</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Industry Leaders / قادة الصناعة</h3>
              <p className="text-gray-400">Access industry thought leaders</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Investor Network / شبكة المستثمرين</h3>
              <p className="text-gray-400">Connect with elite investors</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Global Network / الشبكة العالمية</h3>
              <p className="text-gray-400">Worldwide elite connections</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
