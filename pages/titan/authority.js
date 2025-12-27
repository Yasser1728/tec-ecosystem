import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function TitanAuthority() {
  return (
    <>
      <Head>
        <title>Market Authority - Titan | TEC</title>
        <meta name="description" content="Establish market authority and leadership" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Market Authority / سلطة السوق
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Establish Elite Market Leadership / تأسيس القيادة النخبوية للسوق
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Thought Leadership / قيادة الفكر</h3>
              <p className="text-gray-400">Build authority through insights and expertise</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Market Influence / تأثير السوق</h3>
              <p className="text-gray-400">Shape market trends and directions</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Strategic Positioning / تموضع استراتيجي</h3>
              <p className="text-gray-400">Position yourself as market authority</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Elite Recognition / اعتراف نخبوي</h3>
              <p className="text-gray-400">Gain recognition from industry leaders</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
