import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function LifeGrowth() {
  return (
    <>
      <Head>
        <title>Growth Strategies - Life | TEC</title>
        <meta name="description" content="Long-term wealth growth strategies" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Growth Strategies / استراتيجيات النمو
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Build Lasting Wealth / بناء ثروة دائمة
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Compound Growth / النمو المركب</h3>
              <p className="text-gray-400">Maximize returns through strategic reinvestment</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Diversification / التنويع</h3>
              <p className="text-gray-400">Build resilient multi-asset portfolios</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Legacy Planning / تخطيط الإرث</h3>
              <p className="text-gray-400">Secure generational wealth transfer</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Risk Management / إدارة المخاطر</h3>
              <p className="text-gray-400">Protect and preserve your wealth</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
