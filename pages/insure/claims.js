import Head from 'next/head';
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';

export default function InsureClaims() {
  return (
    <>
      <Head>
        <title>File Claims - Insure | TEC</title>
        <meta name="description" content="Submit and track insurance claims" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            File Claims / تقديم المطالبات
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Fast and Efficient Claims Processing / معالجة سريعة وفعالة للمطالبات
          </p>

          <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg border border-[#00ff9d]/20">
            <div className="space-y-6">
              <div>
                <label className="block text-[#00ff9d] mb-2">Claim Type / نوع المطالبة</label>
                <select className="w-full bg-gray-900 text-white p-3 rounded border border-[#00c6ff]/30">
                  <option>Transaction Protection</option>
                  <option>Asset Damage</option>
                  <option>Fraud Recovery</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[#00c6ff] mb-2">Description / الوصف</label>
                <textarea className="w-full bg-gray-900 text-white p-3 rounded border border-[#00ff9d]/30" rows="4" placeholder="Describe your claim..."></textarea>
              </div>
              
              <button className="w-full bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-3 rounded hover:opacity-90 transition">
                Submit Claim / إرسال المطالبة
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
