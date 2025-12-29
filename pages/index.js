import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticlesCanvas from '../components/ParticlesCanvas';
import PiAuthButton from '../components/PiAuthButton';

export default function Home() {
  const [piUser, setPiUser] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePiAuth = (user) => {
    setPiUser(user);
    console.log('Pi User authenticated:', user);
  };

  const handlePiPayment = async () => {
    setPaymentStatus('Initializing payment...');
    
    // Wait for Pi SDK to load
    let attempts = 0;
    while (!window.Pi && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.Pi) {
      setPaymentStatus('❌ Pi SDK not loaded. Please refresh the page.');
      alert('Pi SDK not loaded. Please refresh the page and try again.');
      return;
    }

    try {
      // First, authenticate with payments scope
      console.log('🔐 Authenticating with payments scope...');
      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        (payment) => {
          console.log('Incomplete payment found:', payment);
        }
      );
      
      console.log('✅ Authenticated:', authResult.user.username);
      setPiUser(authResult.user);
      
      // Now create payment
      console.log('🚀 Creating payment with Pi SDK...');
      const payment = await window.Pi.createPayment({
        amount: 1,
        memo: 'TEC Ecosystem - Demo Payment',
        metadata: { productId: 'tec-demo' }
      }, {
        onReadyForServerApproval: (paymentId) => {
          console.log('✅ Payment ready:', paymentId);
          setPaymentStatus('✅ Payment approved! Payment ID: ' + paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log('✅ Payment completed:', paymentId, txid);
          setPaymentStatus('✅ Payment completed! Transaction: ' + txid);
        },
        onCancel: (paymentId) => {
          console.log('❌ Payment cancelled:', paymentId);
          setPaymentStatus('❌ Payment cancelled');
        },
        onError: (error, payment) => {
          console.error('❌ Payment error:', error);
          setPaymentStatus('❌ Payment error: ' + error.message);
        }
      });
      console.log('Payment object:', payment);
    } catch (error) {
      console.error('❌ Payment creation error:', error);
      setPaymentStatus('❌ Error: ' + error.message);
    }
  };

  const domains = [
    { name: 'FundX', path: '/fundx', icon: '📊', desc: 'Elite Investment Strategies' },
    { name: 'Assets', path: '/assets', icon: '💼', desc: 'Portfolio Management' },
    { name: 'NBF', path: '/nbf', icon: '🏦', desc: 'Sovereign Banking' },
    { name: 'Estate', path: '/estate', icon: '🏠', desc: 'Luxury Real Estate' },
    { name: 'Explorer', path: '/explorer', icon: '✈️', desc: 'Luxury Travel' },
    { name: 'VIP', path: '/vip', icon: '👑', desc: 'Exclusive Opportunities' },
    { name: 'Elite', path: '/elite', icon: '⭐', desc: 'Premium Consulting' },
    { name: 'Nexus', path: '/nexus', icon: '🔗', desc: 'Elite Networking' },
  ];

  return (
    <>
      <Head>
        <title>TEC - Titan Elite Commerce | 24 Luxury Business Domains</title>
        <meta name="description" content="Titan Elite Commerce - Private marketplace for elite opportunities across 24 luxury business domains powered by Pi Network" />
        <meta name="keywords" content="TEC, Titan Elite Commerce, Pi Network, luxury marketplace, elite commerce, blockchain" />
      </Head>
      
      <Header />
      
      <main className="relative min-h-screen bg-gray-900 text-white">
        <ParticlesCanvas />
        
        {/* Hero Section */}
        <section className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
            TEC Ecosystem
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Titan Elite Commerce
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            24 Independent Luxury Business Units | Private Marketplace | Powered by Pi Network
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tec/hub" className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Explore Domains
            </Link>
            <Link href="/tec/overview" className="border border-[#00ff9d] text-[#00ff9d] px-8 py-3 rounded-lg font-semibold hover:bg-[#00ff9d]/10 transition-all duration-300">
              Learn More
            </Link>
          </div>

          {/* Pi Network Integration */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#00ff9d] mb-4 text-center">
                🌐 Pi Network Integration
              </h3>
              
              {/* Pi Auth */}
              <div className="mb-6">
                <PiAuthButton 
                  onAuthSuccess={handlePiAuth}
                  onAuthError={(error) => console.error('Auth error:', error)}
                />
                {piUser && (
                  <div className="mt-3 text-sm text-gray-400 text-center">
                    ✅ Authenticated as: {piUser.username}
                  </div>
                )}
              </div>

              {/* Pi Payment Demo */}
              <div className="border-t border-gray-700 pt-6">
                <p className="text-gray-400 text-sm mb-4 text-center">
                  Try a demo payment with Pi (Sandbox Mode)
                </p>
                <button
                  onClick={handlePiPayment}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  💎 Pay 1 Pi - Demo Payment
                </button>
                {paymentStatus && (
                  <div className="mt-3 text-sm text-gray-400 text-center">
                    {paymentStatus}
                  </div>
                )}
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                💡 Sandbox Mode: Test payments without real Pi
              </div>
            </div>
          </div>
        </section>

        {/* Featured Domains */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Domains</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain) => (
              <Link 
                key={domain.name}
                href={domain.path}
                className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 hover:border-[#00ff9d] hover:shadow-lg hover:shadow-[#00ff9d]/20 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{domain.icon}</div>
                <h3 className="text-xl font-bold text-[#00ff9d] mb-2 group-hover:text-[#00c6ff] transition-colors">
                  {domain.name}
                </h3>
                <p className="text-gray-400 text-sm">{domain.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/tec/overview" className="text-[#00ff9d] hover:text-[#00c6ff] transition-colors">
              View all 24 domains →
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Private Marketplace</h3>
              <p className="text-gray-400">No public catalogs. All deals are curated and brokered.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2">Elite Focus</h3>
              <p className="text-gray-400">Exclusive opportunities for high-net-worth individuals.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-2">Pi Network Integration</h3>
              <p className="text-gray-400">Sovereign settlements using Pi cryptocurrency.</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
