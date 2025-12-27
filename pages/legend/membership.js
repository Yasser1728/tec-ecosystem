import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function LegendMembership() {
  return (
    <>
      <Head>
        <title>Elite Membership - Legend | TEC</title>
        <meta name="description" content="The ultimate Legend membership tier" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Elite Membership / العضوية النخبوية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            The Ultimate Legend Status / المكانة الأسطورية النهائية
          </p>

          <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg border border-[#00ff9d]/20">
            <h3 className="text-3xl font-bold text-[#00ff9d] mb-6 text-center">Legend Membership / عضوية الأسطورة</h3>
            <p className="text-2xl text-[#00c6ff] mb-6 text-center">10,000,000 Pi Annual</p>
            
            <div className="space-y-4">
              <div className="border-b border-gray-700 pb-3">
                <p className="text-lg text-gray-300">• Unlimited access to all TEC domains</p>
              </div>
              <div className="border-b border-gray-700 pb-3">
                <p className="text-lg text-gray-300">• Personal wealth management team</p>
              </div>
              <div className="border-b border-gray-700 pb-3">
                <p className="text-lg text-gray-300">• 24/7 elite concierge services</p>
              </div>
              <div className="border-b border-gray-700 pb-3">
                <p className="text-lg text-gray-300">• Guaranteed allocation in all deals</p>
              </div>
              <div className="border-b border-gray-700 pb-3">
                <p className="text-lg text-gray-300">• Private jet access worldwide</p>
              </div>
              <div className="border-b border-gray-700 pb-3">
                <p className="text-lg text-gray-300">• Exclusive global events</p>
              </div>
              <div className="pb-3">
                <p className="text-lg text-gray-300">• Direct line to TEC executives</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-4 rounded-lg text-lg hover:opacity-90 transition">
              Apply for Legend Status / تقدم بطلب للمكانة الأسطورية
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
