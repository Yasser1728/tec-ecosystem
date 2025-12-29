import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function TestPayment() {
  const [piLoaded, setPiLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Pi SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Pi) {
        window.Pi.init({ 
          version: "2.0",
          sandbox: true // Sandbox mode for testing
        });
        setPiLoaded(true);
        setPaymentStatus('✅ Pi SDK loaded successfully');
      }
    };

    script.onerror = () => {
      setPaymentStatus('❌ Failed to load Pi SDK');
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleTestPayment = async () => {
    if (!piLoaded) {
      alert('Pi SDK is not loaded yet. Please wait...');
      return;
    }

    setLoading(true);
    setPaymentStatus('🔄 Creating payment...');

    try {
      const payment = await window.Pi.createPayment({
        amount: 1,
        memo: "Test payment for Pi Developer Portal Step 6",
        metadata: { 
          test: true,
          step: 6,
          app: "TEC Ecosystem",
          timestamp: new Date().toISOString()
        }
      }, {
        onReadyForServerApproval: (paymentId) => {
          console.log('Payment ready for approval:', paymentId);
          setPaymentId(paymentId);
          setPaymentStatus(`✅ Payment created! ID: ${paymentId}`);
          
          // Approve payment on server
          fetch('/api/payments/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          })
          .then(res => res.json())
          .then(data => {
            console.log('Server approval:', data);
            setPaymentStatus(`✅ Payment approved by server`);
          })
          .catch(err => {
            console.error('Approval error:', err);
            setPaymentStatus(`⚠️ Server approval failed: ${err.message}`);
          });
        },
        
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log('Payment ready for completion:', paymentId, txid);
          setPaymentStatus(`✅ Payment completed! TX: ${txid}`);
          
          // Complete payment on server
          fetch('/api/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid })
          })
          .then(res => res.json())
          .then(data => {
            console.log('Server completion:', data);
            setPaymentStatus(`🎉 Payment fully completed! Check Pi Developer Portal now.`);
            setLoading(false);
          })
          .catch(err => {
            console.error('Completion error:', err);
            setPaymentStatus(`⚠️ Server completion failed: ${err.message}`);
            setLoading(false);
          });
        },
        
        onCancel: (paymentId) => {
          console.log('Payment cancelled:', paymentId);
          setPaymentStatus('❌ Payment cancelled by user');
          setLoading(false);
        },
        
        onError: (error, payment) => {
          console.error('Payment error:', error, payment);
          setPaymentStatus(`❌ Payment error: ${error.message}`);
          setLoading(false);
        }
      });

      console.log('Payment object:', payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      setPaymentStatus(`❌ Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Test Payment - TEC Ecosystem</title>
        <meta name="description" content="Test Pi Network payment for Developer Portal Step 6" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                TEC Ecosystem
              </Link>
              <Link href="/" className="text-purple-300 hover:text-purple-100 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              🧪 Test Payment
            </h1>
            <p className="text-purple-200 mb-8">
              Test Pi Network payment for Developer Portal Step 6
            </p>

            {/* Instructions */}
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-200 mb-3">📋 Instructions:</h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-100">
                <li>Make sure you're in <strong>Pi Browser</strong></li>
                <li>Click the "Test Payment" button below</li>
                <li>Complete the payment in the Pi popup (Sandbox mode - no real Pi)</li>
                <li>Wait for confirmation</li>
                <li>Go back to <strong>Pi Developer Portal</strong></li>
                <li>Check if <strong>Step 6</strong> is now marked as complete ✅</li>
              </ol>
            </div>

            {/* Status Display */}
            {paymentStatus && (
              <div className={`rounded-lg p-4 mb-6 ${
                paymentStatus.includes('❌') ? 'bg-red-500/20 border border-red-400/30' :
                paymentStatus.includes('✅') || paymentStatus.includes('🎉') ? 'bg-green-500/20 border border-green-400/30' :
                'bg-yellow-500/20 border border-yellow-400/30'
              }`}>
                <p className="text-white font-mono text-sm">{paymentStatus}</p>
                {paymentId && (
                  <p className="text-gray-300 text-xs mt-2">Payment ID: {paymentId}</p>
                )}
              </div>
            )}

            {/* Test Button */}
            <button
              onClick={handleTestPayment}
              disabled={!piLoaded || loading}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                !piLoaded || loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {loading ? '⏳ Processing...' : piLoaded ? '🧪 Test Payment (1 Pi)' : '⏳ Loading Pi SDK...'}
            </button>

            {/* Info */}
            <div className="mt-8 space-y-4 text-gray-300">
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                <h3 className="font-bold text-purple-200 mb-2">ℹ️ About this test:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>This is a <strong>Sandbox payment</strong> - no real Pi will be charged</li>
                  <li>Amount: 1 Pi (test amount)</li>
                  <li>Purpose: Complete Step 6 in Pi Developer Portal</li>
                  <li>The payment will be processed through Pi Network's test environment</li>
                </ul>
              </div>

              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                <h3 className="font-bold text-green-200 mb-2">✅ After successful payment:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Open Pi Browser</li>
                  <li>Go to: <code className="bg-black/30 px-2 py-1 rounded">https://develop.pi</code></li>
                  <li>Open your TEC Ecosystem app</li>
                  <li>Check the "App Development Checklist"</li>
                  <li>Step 6 should now be marked as complete ✅</li>
                </ol>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                <h3 className="font-bold text-yellow-200 mb-2">⚠️ Troubleshooting:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>If Pi SDK doesn't load, refresh the page</li>
                  <li>Make sure you're using <strong>Pi Browser</strong></li>
                  <li>Check that Sandbox mode is enabled in Pi Developer Portal</li>
                  <li>If Step 6 doesn't activate, wait 5-10 minutes and refresh</li>
                  <li>Check browser console (F12) for error messages</li>
                </ul>
              </div>
            </div>

            {/* Links */}
            <div className="mt-8 pt-6 border-t border-purple-500/30 flex justify-center space-x-6">
              <Link href="/" className="text-purple-300 hover:text-purple-100 transition-colors">
                Home
              </Link>
              <a 
                href="https://develop.pi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-100 transition-colors"
              >
                Pi Developer Portal ↗
              </a>
              <Link href="/admin" className="text-purple-300 hover:text-purple-100 transition-colors">
                Admin Panel
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
