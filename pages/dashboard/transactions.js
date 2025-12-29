import { withAuth } from '../../lib/withAuth';
import { USER_TIERS } from '../../lib/roles';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Transactions({ session }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Demo transactions
  const demoTransactions = [
    {
      id: 'demo-1',
      amount: 100,
      currency: 'PI',
      status: 'COMPLETED',
      description: 'Premium Subscription',
      createdAt: new Date().toISOString(),
      piTxId: 'demo-tx-123456',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <>
      <Head>
        <title>Transactions - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <Link href="/dashboard" className="text-gray-400 hover:text-[#00ff9d]">
              Dashboard
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-white">Transactions</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
            <p className="text-gray-400">View all your Pi Network transactions</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
            <p className="text-gray-400 text-center">
              No transactions yet. Start exploring the ecosystem!
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default withAuth(Transactions, {
  requiredTier: USER_TIERS.STANDARD,
});
