import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function FundxStrategies() {
  return (
    <>
      <Head>
        <title>Investment Strategies - FundX | TEC</title>
        <meta name="description" content="5 curated high-yield investment strategies" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Investment Strategies / استراتيجيات الاستثمار
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            5 Elite High-Yield Strategies / 5 استراتيجيات نخبوية عالية العائد
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Strategy 1: Sovereign Growth / النمو السيادي</h3>
              <p className="text-gray-400 mb-2">12-18% annual returns</p>
              <p className="text-gray-400">Long-term wealth accumulation with sovereign assets</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Strategy 2: Elite Trading / التداول النخبوي</h3>
              <p className="text-gray-400 mb-2">20-30% annual returns</p>
              <p className="text-gray-400">Active trading with curated luxury assets</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Strategy 3: Real Estate Focus / التركيز العقاري</h3>
              <p className="text-gray-400 mb-2">15-25% annual returns</p>
              <p className="text-gray-400">Premium property investments worldwide</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Strategy 4: Tech Innovation / الابتكار التقني</h3>
              <p className="text-gray-400 mb-2">25-40% annual returns</p>
              <p className="text-gray-400">Invest in next-gen technology ventures</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20 md:col-span-2">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Strategy 5: Diversified Elite / النخبة المتنوعة</h3>
              <p className="text-gray-400 mb-2">18-28% annual returns</p>
              <p className="text-gray-400">Balanced portfolio across all TEC domains</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
