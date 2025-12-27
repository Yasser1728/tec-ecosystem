import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function SystemOps() {
  return (
    <>
      <Head>
        <title>Operational Intelligence - System | TEC</title>
        <meta name="description" content="Real-time operational intelligence platform" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Operational Intelligence / الذكاء التشغيلي
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Real-Time Operations Monitoring / مراقبة العمليات في الوقت الفعلي
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Live Dashboard / لوحة حية</h3>
              <p className="text-gray-400">Real-time operations overview</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Performance Metrics / مقاييس الأداء</h3>
              <p className="text-gray-400">Key performance indicators tracking</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Alerts / التنبيهات</h3>
              <p className="text-gray-400">Automated alert system</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
