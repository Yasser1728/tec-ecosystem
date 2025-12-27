import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function ZoneLocations() {
  return (
    <>
      <Head>
        <title>Optimal Locations - Zone | TEC</title>
        <meta name="description" content="Discover optimal economic zone locations" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Optimal Locations / المواقع المثلى
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Strategic Economic Zone Locations / مواقع المناطق الاقتصادية الاستراتيجية
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Dubai Free Zones / المناطق الحرة بدبي</h3>
              <p className="text-gray-400">DIFC, DMCC, Jebel Ali - Tax advantages</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Singapore Zones / مناطق سنغافورة</h3>
              <p className="text-gray-400">Financial and tech special zones</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Hong Kong / هونغ كونغ</h3>
              <p className="text-gray-400">International business hub</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Swiss Cantons / كانتونات سويسرا</h3>
              <p className="text-gray-400">Low-tax business jurisdictions</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
