import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TecOverview() {
  return (
    <>
      <Head>
        <title>Domain Overview - TEC | Titan Elite Commerce</title>
        <meta name="description" content="Comprehensive overview of all TEC domains" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            All Domains Overview / نظرة عامة على جميع المجالات
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Complete Ecosystem at a Glance / النظام البيئي الكامل في لمحة
          </p>

          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-4">Finance & Investment Tier</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div><p className="text-gray-300">• FundX - High-yield strategies</p></div>
                <div><p className="text-gray-300">• Assets - Portfolio management</p></div>
                <div><p className="text-gray-300">• NBF - Sovereign banking</p></div>
                <div><p className="text-gray-300">• Insure - Deal protection</p></div>
                <div><p className="text-gray-300">• VIP - Exclusive opportunities</p></div>
                <div><p className="text-gray-300">• Life - Long-term growth</p></div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-4">Commerce & Trade Tier</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><p className="text-gray-300">• Commerce - B2B trading</p></div>
                <div><p className="text-gray-300">• Ecommerce - Luxury marketplace</p></div>
                <div><p className="text-gray-300">• Connection - Partner networks</p></div>
                <div><p className="text-gray-300">• Elite - Premium consulting</p></div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-4">Real Estate Tier</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><p className="text-gray-300">• Estate - Property investment</p></div>
                <div><p className="text-gray-300">• Brookfield - Landmark projects</p></div>
                <div><p className="text-gray-300">• Explorer - Luxury travel</p></div>
                <div><p className="text-gray-300">• Zone - Economic zones</p></div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-4">Technology Tier</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div><p className="text-gray-300">• DX - Digital transformation</p></div>
                <div><p className="text-gray-300">• NX - Next-gen systems</p></div>
                <div><p className="text-gray-300">• System - Operational intelligence</p></div>
                <div><p className="text-gray-300">• Analytics - Market intelligence</p></div>
                <div><p className="text-gray-300">• Alert - Critical notifications</p></div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-4">Authority & Legacy Tier</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><p className="text-gray-300">• Titan - Market authority</p></div>
                <div><p className="text-gray-300">• Nexus - Cross-sector coordination</p></div>
                <div><p className="text-gray-300">• Epic - Legacy projects</p></div>
                <div><p className="text-gray-300">• Legend - Elite membership</p></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
