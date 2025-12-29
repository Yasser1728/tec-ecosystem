import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function InsureCoverage() {
  return (
    <>
      <Head>
        <title>Coverage Overview - Insure | TEC</title>
        <meta name="description" content="Comprehensive coverage options and details" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Coverage Overview / نظرة عامة على التغطية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Elite Protection Plans / خطط حماية نخبوية
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Basic Coverage / التغطية الأساسية</h3>
              <p className="text-gray-400 mb-2">Up to 100,000 Pi per transaction</p>
              <p className="text-gray-400">Standard protection for all TEC deals</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Premium Coverage / التغطية الممتازة</h3>
              <p className="text-gray-400 mb-2">Up to 1,000,000 Pi per transaction</p>
              <p className="text-gray-400">Enhanced protection with priority support</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Elite Coverage / التغطية النخبوية</h3>
              <p className="text-gray-400 mb-2">Unlimited coverage</p>
              <p className="text-gray-400">Complete protection for all elite transactions</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
