import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { logger } from '../../lib/utils/logger.js';

export default function Fundx() {
  const [domainInfo, setDomainInfo] = useState(null);

  useEffect(() => {
    // Fetch domain information
    fetch('/api/domain/info')
      .then(res => res.json())
      .then(data => setDomainInfo(data))
      .catch(err => {
        console.error('Failed to fetch domain info:', err);
        // Set default domain info on error
        setDomainInfo({
          name: 'FundX',
          nameAr: 'فَنْد إكس',
          tier: 'Finance & Investment',
          theme: 'tec-gradient',
          independent: true,
          value: 'sovereign-unit'
        });
      });
  }, []);

  return (
    <div>
      <Head>
        <title>FundX - High-Yield Investment Strategies | TEC Ecosystem</title>
        <meta name="description" content="FundX - Sovereign investment unit offering high-yield strategies on Pi Network" />
        <meta property="og:title" content="FundX - Sovereign Investment Unit" />
        <meta property="og:description" content="Independent business unit with full autonomy on fundx.pi" />
        <meta property="og:type" content="website" />
        <meta name="domain:sovereign" content="true" />
        <meta name="domain:independent" content="true" />
      </Head>
      
      <Header />
      
      <main className="max-w-7xl mx-auto p-4">
        {/* Sovereignty Badge */}
        <div className="my-6 p-4 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] rounded-lg border-2 border-[#00ff9d]">
          <div className="flex items-center justify-center gap-3 text-black font-semibold">
            <span className="text-2xl">🏛️</span>
            <span>Sovereign Unit | fundx.pi</span>
          </div>
        </div>

        <section className="text-center my-10">
          <h1 className="text-4xl font-bold mb-4">FundX</h1>
          <p className="text-gray-700 text-xl mb-2">
            Investment & Finance management within TEC Ecosystem.
          </p>
          <p className="text-gray-600">
            High-yield investment strategies on Pi Network
          </p>
        </section>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-[#00ff9d]/20 hover:border-[#00ff9d] transition-all">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold mb-2">Independent Value</h3>
            <p className="text-gray-600">
              Sovereign business unit with full autonomy and independent operations
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-[#00c6ff]/20 hover:border-[#00c6ff] transition-all">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold mb-2">Dedicated Domain</h3>
            <p className="text-gray-600">
              fundx.pi - Exclusive Pi Network presence with sovereign identity
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-[#00ff9d]/20 hover:border-[#00ff9d] transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Own Analytics</h3>
            <p className="text-gray-600">
              Independent tracking and monetization systems
            </p>
          </div>
        </div>

        {/* Domain Info Display (if available) */}
        {domainInfo && (
          <div className="my-10 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Domain Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Name:</span> {domainInfo.name}
              </div>
              <div>
                <span className="font-semibold">Arabic Name:</span> {domainInfo.nameAr}
              </div>
              <div>
                <span className="font-semibold">Tier:</span> {domainInfo.tier}
              </div>
              <div>
                <span className="font-semibold">Theme:</span> {domainInfo.theme}
              </div>
              <div>
                <span className="font-semibold">Independent:</span> {domainInfo.independent ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-semibold">Value:</span> {domainInfo.value}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
