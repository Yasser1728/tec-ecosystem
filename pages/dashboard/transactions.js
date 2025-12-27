import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PiAuthButton from '../../components/PiAuthButton';
import TransactionHistory from '../../components/TransactionHistory';

export default function TransactionsDashboard() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0e2b] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Transaction Dashboard</h1>
            <p className="text-gray-400">View and manage your Pi Network transactions</p>
          </div>

          <div className="mb-6">
            <PiAuthButton
              onAuthSuccess={() => setAuthenticated(true)}
              onAuthError={(error) => console.error('Auth error:', error)}
            />
          </div>

          <TransactionHistory />
        </div>
      </main>
      <Footer />
    </>
  );
}
