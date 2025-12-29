import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function DxInsights() {
  return (
    <>
      <Head>
        <title>Project Insights - DX | TEC</title>
        <meta name="description" content="Digital transformation insights and best practices" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Project Insights / رؤى المشاريع
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Digital Transformation Intelligence / ذكاء التحول الرقمي
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Success Stories / قصص النجاح</h3>
              <p className="text-gray-400">Case studies from successful transformations</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Best Practices / أفضل الممارسات</h3>
              <p className="text-gray-400">Industry-leading transformation strategies</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
