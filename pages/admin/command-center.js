/**
 * Admin Command Center - System Control Dashboard
 * Central interface for monitoring and controlling the TEC Ecosystem
 */

import { withAuth } from '../../lib/withAuth';
import { USER_TIERS } from '../../lib/roles';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SystemIntegrityMonitor from '../../components/SystemIntegrityMonitor';
import LiquidityStreamDisplay from '../../components/LiquidityStreamDisplay';

function CommandCenter({ session }) {
  return (
    <>
      <Head>
        <title>Command Center - System Control | TEC Ecosystem</title>
        <meta
          name="description"
          content="Central command interface for monitoring system integrity and liquidity"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  🎯 Command Center
                </h1>
                <p className="text-gray-400">
                  Central System Control & Monitoring Dashboard
                </p>
              </div>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                ← Back to Admin
              </Link>
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🛡️</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome, {session?.user?.username || 'Admin'}
                </h2>
                <p className="text-gray-300">
                  You have sovereign control over the TEC Ecosystem. Monitor system
                  integrity, manage liquidity flow, and control the emergency circuit
                  breaker from this interface.
                </p>
              </div>
            </div>
          </div>

          {/* System Integrity Monitor */}
          <div className="mb-8">
            <SystemIntegrityMonitor />
          </div>

          {/* Liquidity Stream Display */}
          <div className="mb-8">
            <LiquidityStreamDisplay />
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/api/audit-logs">
                <div className="bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all">
                  <div className="text-3xl mb-2">📋</div>
                  <h3 className="font-bold mb-1">Audit Logs</h3>
                  <p className="text-sm text-gray-400">View forensic audit trail</p>
                </div>
              </Link>

              <Link href="/admin/users">
                <div className="bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all">
                  <div className="text-3xl mb-2">👥</div>
                  <h3 className="font-bold mb-1">User Management</h3>
                  <p className="text-sm text-gray-400">Manage user accounts</p>
                </div>
              </Link>

              <Link href="/admin/analytics">
                <div className="bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-bold mb-1">Analytics</h3>
                  <p className="text-sm text-gray-400">System analytics & reports</p>
                </div>
              </Link>
            </div>
          </div>

          {/* System Information */}
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">System Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#00ff9d]">
                  🔒 Emergency Circuit Breaker
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Automatically suspends all inter-domain transfers</li>
                  <li>• Activates on detection of financial anomalies</li>
                  <li>• Returns 403 System Lock status to blocked transfers</li>
                  <li>• Can be manually controlled by admin</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#00ff9d]">
                  🔍 Dual Forensic Check
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Source and target validation required</li>
                  <li>• Atomic transaction approval process</li>
                  <li>• Both parties must pass security checks</li>
                  <li>• Immutable audit trail for all transfers</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default withAuth(CommandCenter, {
  requiredTier: USER_TIERS.ADMIN,
});
