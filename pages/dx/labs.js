import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function DxLabs() {
  return (
    <>
      <Head>
        <title>Tech Labs - DX | TEC</title>
        <meta name="description" content="Innovation labs for digital experimentation" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Tech Labs / مختبرات التقنية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Innovation & Experimentation / الابتكار والتجريب
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Blockchain Lab / مختبر البلوكتشين</h3>
              <p className="text-gray-400">Decentralized solutions development</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">AI Lab / مختبر الذكاء الاصطناعي</h3>
              <p className="text-gray-400">Machine learning and AI research</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
