import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function Life() {
  return (
    <>
      <Head>
        <title>Life - Long-term Growth | TEC</title>
        <meta name="description" content="Long-term wealth growth and life planning" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Life / الحياة
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Long-term Growth Platform / منصة النمو طويل الأجل
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Growth Strategies / استراتيجيات النمو</h3>
              <p className="text-gray-400">Build lasting wealth with sovereign growth strategies</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Financial Planning / التخطيط المالي</h3>
              <p className="text-gray-400">Comprehensive life and wealth planning tools</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Elite Resources / الموارد النخبوية</h3>
              <p className="text-gray-400">Exclusive educational resources for legacy building</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
