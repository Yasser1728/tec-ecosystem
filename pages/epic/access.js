import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function EpicAccess() {
  return (
    <>
      <Head>
        <title>Early Access - Epic | TEC</title>
        <meta name="description" content="Get early access to epic opportunities" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Early Access / الوصول المبكر
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            First Access to Epic Opportunities / أول وصول للفرص الملحمية
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Pre-Launch Deals / صفقات قبل الإطلاق</h3>
              <p className="text-gray-400">Access deals before public release</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Exclusive Preview / معاينة حصرية</h3>
              <p className="text-gray-400">Preview upcoming opportunities</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Beta Programs / برامج تجريبية</h3>
              <p className="text-gray-400">Participate in beta tests</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Founder Access / وصول المؤسسين</h3>
              <p className="text-gray-400">Founder-level privileges</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
