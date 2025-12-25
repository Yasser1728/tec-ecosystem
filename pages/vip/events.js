import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function VipEvents() {
  return (
    <>
      <Head>
        <title>VIP Events Calendar - VIP | TEC</title>
        <meta name="description" content="Exclusive VIP events and networking opportunities" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            VIP Events Calendar / تقويم الفعاليات النخبوية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Exclusive Networking Events / فعاليات التواصل الحصرية
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-[#00ff9d]">Elite Investment Summit / قمة الاستثمار النخبوي</h3>
                <span className="text-[#00c6ff]">Feb 15, 2025</span>
              </div>
              <p className="text-gray-400 mb-2">Dubai, UAE</p>
              <p className="text-gray-400">Annual gathering of top investors and entrepreneurs</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-[#00c6ff]">Luxury Property Showcase / عرض العقارات الفاخرة</h3>
                <span className="text-[#00ff9d]">Mar 22, 2025</span>
              </div>
              <p className="text-gray-400 mb-2">Monaco</p>
              <p className="text-gray-400">Exclusive preview of premier properties</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-[#00ff9d]">Private Networking Gala / حفل التواصل الخاص</h3>
                <span className="text-[#00c6ff]">Apr 10, 2025</span>
              </div>
              <p className="text-gray-400 mb-2">London, UK</p>
              <p className="text-gray-400">Elite members-only networking event</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
