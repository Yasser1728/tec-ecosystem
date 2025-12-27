import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TitanAccess() {
  return (
    <>
      <Head>
        <title>Exclusive Access - Titan | TEC</title>
        <meta name="description" content="Access exclusive Titan-level opportunities" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Exclusive Access / الوصول الحصري
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Titan-Level Privileges / امتيازات مستوى تيتان
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Private Deals / صفقات خاصة</h3>
              <p className="text-gray-400">Access to exclusive private deals</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Elite Events / فعاليات نخبوية</h3>
              <p className="text-gray-400">Invitation-only exclusive events</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Direct Access / وصول مباشر</h3>
              <p className="text-gray-400">Direct access to key decision makers</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Priority Support / دعم أولوية</h3>
              <p className="text-gray-400">24/7 concierge-level support</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
