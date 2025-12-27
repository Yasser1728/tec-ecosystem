import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function FundxStart() {
  return (
    <>
      <Head>
        <title>Getting Started - FundX | TEC</title>
        <meta name="description" content="Start your high-yield investment journey with FundX" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Getting Started / البدء
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Your Journey to Elite Investment / رحلتك إلى الاستثمار النخبوي
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Step 1: Account Setup / إعداد الحساب</h3>
              <p className="text-gray-400">Create your sovereign FundX account with Pi Network integration</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Step 2: Risk Assessment / تقييم المخاطر</h3>
              <p className="text-gray-400">Complete your investment profile and risk tolerance assessment</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Step 3: Choose Strategy / اختر الاستراتيجية</h3>
              <p className="text-gray-400">Select from our curated high-yield investment strategies</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
