import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function DxProjects() {
  return (
    <>
      <Head>
        <title>Digital Transformation Projects - DX | TEC</title>
        <meta name="description" content="Enterprise digital transformation initiatives" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Digital Transformation Projects / مشاريع التحول الرقمي
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Enterprise Digital Innovation / الابتكار الرقمي للمؤسسات
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Cloud Migration / الهجرة السحابية</h3>
              <p className="text-gray-400">Enterprise-scale cloud transformation</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">AI Integration / دمج الذكاء الاصطناعي</h3>
              <p className="text-gray-400">AI-powered business intelligence</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Process Automation / أتمتة العمليات</h3>
              <p className="text-gray-400">Streamline operations with automation</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
