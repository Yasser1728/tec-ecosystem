import { withAuth } from "../../lib/withAuth";
import { USER_TIERS } from "../../lib/roles";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function Dashboard({ session }) {
  const user = session?.user;

  return (
    <>
      <Head>
        <title>Dashboard - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-gray-400">
              Manage your account and explore the TEC Ecosystem
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Account Tier</p>
                <p className="text-2xl font-bold text-[#00ff9d]">
                  {user?.tier}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Pi ID</p>
                <p className="text-sm font-mono text-gray-300">{user?.piId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                  {user?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/ecosystem">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-[#00ff9d] transition-all cursor-pointer">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className="text-xl font-bold mb-2">Explore Ecosystem</h3>
                <p className="text-gray-400 text-sm">
                  Browse all 21 business units
                </p>
              </div>
            </Link>

            <Link href="/dashboard/profile">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-[#00ff9d] transition-all cursor-pointer">
                <div className="text-3xl mb-3">👤</div>
                <h3 className="text-xl font-bold mb-2">My Profile</h3>
                <p className="text-gray-400 text-sm">
                  View and edit your profile
                </p>
              </div>
            </Link>

            <Link href="/dashboard/transactions">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-[#00ff9d] transition-all cursor-pointer">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-xl font-bold mb-2">Transactions</h3>
                <p className="text-gray-400 text-sm">
                  View your payment history
                </p>
              </div>
            </Link>
          </div>

          {/* Upgrade CTA (if not premium) */}
          {user?.tier === USER_TIERS.STANDARD && (
            <div className="bg-gradient-to-r from-[#00ff9d]/10 to-[#00c6ff]/10 border border-[#00ff9d]/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                  <p className="text-gray-400">
                    Unlock advanced features and unlimited access
                  </p>
                </div>
                <Link
                  href="/upgrade"
                  className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-400 text-center py-8">
                No recent activity
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default withAuth(Dashboard, {
  requiredTier: USER_TIERS.STANDARD,
});
