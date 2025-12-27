import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function VipOpportunities() {
  return (
    <>
      <Head>
        <title>Exclusive Opportunities - VIP | TEC</title>
        <meta name="description" content="Access exclusive VIP investment opportunities" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Exclusive Opportunities / فرص حصرية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Elite-Only Investment Deals / صفقات استثمارية للنخبة فقط
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Private Equity / الأسهم الخاصة</h3>
              <p className="text-gray-400 mb-2">Minimum: 500,000 Pi</p>
              <p className="text-gray-400">Exclusive access to pre-IPO opportunities</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Luxury Real Estate / العقارات الفاخرة</h3>
              <p className="text-gray-400 mb-2">Minimum: 1,000,000 Pi</p>
              <p className="text-gray-400">Premier properties worldwide</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Venture Capital / رأس المال الاستثماري</h3>
              <p className="text-gray-400 mb-2">Minimum: 250,000 Pi</p>
              <p className="text-gray-400">Invest in next-gen technology startups</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Art & Collectibles / الفنون والمقتنيات</h3>
              <p className="text-gray-400 mb-2">Minimum: 100,000 Pi</p>
              <p className="text-gray-400">Rare art and luxury collectibles</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
