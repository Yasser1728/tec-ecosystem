import { withAuth } from "../../lib/withAuth";
import { USER_TIERS } from "../../lib/roles";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function AdminDashboard({ session }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBusinessUnits: 21,
    totalTransactions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Fetch admin stats from API
    // For now, using demo data
    setStats({
      totalUsers: 150,
      activeUsers: 120,
      totalBusinessUnits: 21,
      totalTransactions: 450,
      totalRevenue: 15000,
    });
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">System overview and management</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">👥</span>
                <span className="text-xs text-blue-400 font-semibold">
                  USERS
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.totalUsers}
              </p>
              <p className="text-sm text-gray-400">
                {stats.activeUsers} active
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🏢</span>
                <span className="text-xs text-purple-400 font-semibold">
                  UNITS
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.totalBusinessUnits}
              </p>
              <p className="text-sm text-gray-400">Business Units</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">💰</span>
                <span className="text-xs text-green-400 font-semibold">
                  REVENUE
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.totalRevenue} π
              </p>
              <p className="text-sm text-gray-400">Total Revenue</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📊</span>
                <span className="text-xs text-orange-400 font-semibold">
                  TRANSACTIONS
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.totalTransactions}
              </p>
              <p className="text-sm text-gray-400">Total Transactions</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/admin/users">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-[#00ff9d] transition-all cursor-pointer">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-xl font-bold mb-2">Manage Users</h3>
                <p className="text-gray-400 text-sm">
                  View, edit, and manage user accounts
                </p>
              </div>
            </Link>

            <Link href="/admin/business-units">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-[#00ff9d] transition-all cursor-pointer">
                <div className="text-4xl mb-3">🏢</div>
                <h3 className="text-xl font-bold mb-2">Business Units</h3>
                <p className="text-gray-400 text-sm">
                  Manage all 21 business units
                </p>
              </div>
            </Link>

            <Link href="/admin/analytics">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-[#00ff9d] transition-all cursor-pointer">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="text-gray-400 text-sm">
                  View system analytics and reports
                </p>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-white font-medium">
                      New user registered
                    </p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <span className="text-xs text-green-400">+1 USER</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-white font-medium">
                      Premium subscription purchased
                    </p>
                    <p className="text-xs text-gray-400">15 minutes ago</p>
                  </div>
                </div>
                <span className="text-xs text-green-400">+100 π</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="text-white font-medium">
                      Business unit accessed
                    </p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <span className="text-xs text-blue-400">FUNDX</span>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default withAuth(AdminDashboard, {
  requiredTier: USER_TIERS.ADMIN,
});
