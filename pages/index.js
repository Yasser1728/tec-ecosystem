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

  const testPiSDK = () => {
    console.log('🧪 Testing Pi SDK...');
    console.log('window.Pi exists:', !!window.Pi);
    if (window.Pi) {
      console.log('Pi SDK methods:', Object.keys(window.Pi));
      console.log('Pi SDK:', window.Pi);
    } else {
      console.error('❌ Pi SDK not found!');
      alert('Pi SDK not loaded! Check console for details.');
    }
  };

  const handlePiPayment = async () => {
    console.log('💰 Payment button clicked');
    setPaymentStatus('⏳ Initializing...');
    
    try {
      // Wait for Pi SDK or Sandbox to load (max 10 seconds)
      console.log('⏳ Waiting for Pi SDK/Sandbox...');
      let attempts = 0;
      while (!window.Pi && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.Pi) {
        console.error('❌ Pi SDK/Sandbox not loaded after 10 seconds');
        setPaymentStatus('❌ Failed to load. Please refresh the page.');
        return;
      }

      const mode = window.piSandboxMode ? 'Sandbox' : 'Pi Browser';
      console.log(`✅ ${mode} mode active`);
      
      // Step 1: Authenticate
      console.log('🔐 Step 1: Authenticating...');
      setPaymentStatus('🔐 Authenticating...');
      
      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        (payment) => {
          console.log('⚠️ Incomplete payment:', payment);
        }
      );
      
      console.log('✅ Step 2: Authenticated successfully!');
      console.log('👤 User:', authResult.user);
      setPiUser(authResult.user);
      setPaymentStatus('✅ Authenticated as ' + authResult.user.username);
      
      // Wait a moment before creating payment
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Now create payment
      console.log('🚀 Step 3: Creating payment...');
      setPaymentStatus('💰 Creating payment...');
      
      const payment = await window.Pi.createPayment({
        amount: 1,
        memo: 'TEC Ecosystem - Demo Payment',
        metadata: { productId: 'tec-demo' }
      }, {
        onReadyForServerApproval: async (paymentId) => {
          console.log('✅ Step 4: Payment ready for approval:', paymentId);
          setPaymentStatus('⏳ Approving payment on server...');
          
          try {
            // Call backend to approve payment
            const approveResponse = await fetch('/api/payments/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                paymentId,
                internalId: 'demo_' + Date.now() // In production, get from DB
              })
            });
            
            if (approveResponse.ok) {
              console.log('✅ Payment approved on server');
              setPaymentStatus('✅ Payment approved! ID: ' + paymentId);
            } else {
              console.error('❌ Server approval failed');
              setPaymentStatus('⚠️ Payment approved but server sync failed');
            }
          } catch (error) {
            console.error('❌ Approval API error:', error);
            setPaymentStatus('⚠️ Payment approved (server sync failed)');
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          console.log('✅ Step 5: Payment completed!', { paymentId, txid });
          setPaymentStatus('⏳ Completing payment on server...');
          
          try {
            // Call backend to complete payment
            const completeResponse = await fetch('/api/payments/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                paymentId,
                txid,
                internalId: 'demo_' + Date.now() // In production, get from DB
              })
            });
            
            if (completeResponse.ok) {
              const data = await completeResponse.json();
              console.log('✅ Payment completed on server:', data);
              setPaymentStatus('✅ Payment completed! TX: ' + txid);
            } else {
              console.error('❌ Server completion failed');
              setPaymentStatus('⚠️ Payment completed but server sync failed');
            }
          } catch (error) {
            console.error('❌ Completion API error:', error);
            setPaymentStatus('⚠️ Payment completed (server sync failed)');
          }
        },
        onCancel: (paymentId) => {
          console.log('❌ Payment cancelled by user:', paymentId);
          setPaymentStatus('❌ Payment cancelled');
        },
        onError: (error, payment) => {
          console.error('❌ Payment error:', error, payment);
          setPaymentStatus('❌ Payment error: ' + error.message);
        }
      });
      
      console.log('📦 Payment object created:', payment);
      
    } catch (error) {
      console.error('❌ Fatal error in payment flow:', error);
      console.error('Error stack:', error.stack);
      setPaymentStatus('❌ Error: ' + error.message);
      alert('Payment failed: ' + error.message);
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
                
                {/* Test Button */}
                <button
                  onClick={testPiSDK}
                  className="w-full mb-3 bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 text-sm"
                >
                  🧪 Test Pi SDK (Check Console)
                </button>
                
                {/* Payment Button */}
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
