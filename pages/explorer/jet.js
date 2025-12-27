import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function ExplorerJet() {
  return (
    <>
      <Head>
        <title>Private Jet Charter - Explorer | TEC</title>
        <meta name="description" content="Elite private jet charter services" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Private Jet Charter / استئجار الطائرات الخاصة
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Luxury Travel Excellence / التميز في السفر الفاخر
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Light Jets / الطائرات الخفيفة</h3>
              <p className="text-gray-400">6-8 passengers | 3,000 km range</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Midsize Jets / الطائرات متوسطة الحجم</h3>
              <p className="text-gray-400">8-10 passengers | 5,000 km range</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Heavy Jets / الطائرات الثقيلة</h3>
              <p className="text-gray-400">12-16 passengers | 10,000+ km range</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
