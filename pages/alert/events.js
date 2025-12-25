import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AlertEvents() {
  return (
    <>
      <Head>
        <title>Event Tracking - Alert | TEC</title>
        <meta name="description" content="Track important market events and calendars" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Event Tracking / تتبع الأحداث
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Market Event Calendar & Tracking / تقويم وتتبع أحداث السوق
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Earnings Calendar / تقويم الأرباح</h3>
              <p className="text-gray-400">Track company earnings announcements</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Economic Events / الأحداث الاقتصادية</h3>
              <p className="text-gray-400">Central bank meetings, policy decisions</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Industry Events / أحداث الصناعة</h3>
              <p className="text-gray-400">Conferences, summits, and major events</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
