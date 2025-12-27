import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function EcommerceLuxury() {
  return (
    <>
      <Head>
        <title>Luxury Marketplace - Ecommerce | TEC</title>
        <meta name="description" content="High-end luxury goods marketplace" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Luxury Marketplace / السوق الفاخر
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            High-End Goods & Services / السلع والخدمات الراقية
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Designer Fashion / الأزياء المصممة</h3>
              <p className="text-gray-400">Exclusive designer collections</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Fine Jewelry / المجوهرات الفاخرة</h3>
              <p className="text-gray-400">Rare gems and luxury jewelry</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Luxury Vehicles / المركبات الفاخرة</h3>
              <p className="text-gray-400">Premium cars and yachts</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
