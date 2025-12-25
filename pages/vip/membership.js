import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function VipMembership() {
  return (
    <>
      <Head>
        <title>Membership Benefits - VIP | TEC</title>
        <meta name="description" content="Explore VIP membership benefits and tiers" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Membership Benefits / مزايا العضوية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Elite Membership Tiers / مستويات العضوية النخبوية
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Gold Tier / المستوى الذهبي</h3>
              <p className="text-gray-400 mb-4">100,000 Pi Annual</p>
              <ul className="space-y-2 text-gray-400">
                <li>• Priority support</li>
                <li>• Exclusive events access</li>
                <li>• Enhanced returns</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Platinum Tier / المستوى البلاتيني</h3>
              <p className="text-gray-400 mb-4">500,000 Pi Annual</p>
              <ul className="space-y-2 text-gray-400">
                <li>• All Gold benefits</li>
                <li>• Private deals access</li>
                <li>• Personal advisor</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Diamond Tier / المستوى الماسي</h3>
              <p className="text-gray-400 mb-4">1,000,000 Pi Annual</p>
              <ul className="space-y-2 text-gray-400">
                <li>• All Platinum benefits</li>
                <li>• Unlimited access</li>
                <li>• Concierge services</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
