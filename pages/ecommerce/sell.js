import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function EcommerceSell() {
  return (
    <>
      <Head>
        <title>Listing Guide - Ecommerce | TEC</title>
        <meta name="description" content="List your luxury items on TEC marketplace" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Listing Guide / دليل البيع
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Sell Your Luxury Items / بيع منتجاتك الفاخرة
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Step 1: Verification / التحقق</h3>
              <p className="text-gray-400">Complete seller verification process</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Step 2: List Item / إدراج المنتج</h3>
              <p className="text-gray-400">Create your luxury item listing</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Step 3: Manage Sales / إدارة المبيعات</h3>
              <p className="text-gray-400">Track and manage your transactions</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
