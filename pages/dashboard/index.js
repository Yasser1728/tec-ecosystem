import { withAuth } from "../../lib/withAuth";
import { USER_TIERS } from "../../lib/roles";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BottomNav } from "../../components/layout";
import { useLanguage } from "../../hooks/useLanguage";

function Dashboard({ session }) {
  const { isRTL } = useLanguage();
  const user = session?.user;
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Fetch audit logs on component mount
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const response = await fetch("/api/audit-logs?limit=10");
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const getStatusBadge = (approved) => {
    if (approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/50">
          ✓ موافق عليها
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/50">
        ✕ مرفوضة
      </span>
    );
  };

  const getRiskBadge = (riskLevel) => {
    const colors = {
      low: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      critical: "bg-red-500/20 text-red-400 border-red-500/50",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[riskLevel] || colors.low}`}
      >
        {riskLevel}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ar", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head>
        <title>Dashboard - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />

        <main className="container mx-auto px-4 py-12 pb-16 md:pb-0">
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
            <h2 className="text-2xl font-bold mb-4">سجل العمليات والموافقات</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              {isLoadingLogs ? (
                <div className="p-8 text-center text-gray-400">
                  <div
                    className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full mb-2"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p>جاري تحميل السجل...</p>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  لا توجد عمليات مسجلة
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          نوع العملية
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          الحالة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          مستوى المخاطرة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          الدمغة (Hash)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          السبب
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          التاريخ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {auditLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div>
                              <div className="font-medium">
                                {log.operationType}
                              </div>
                              {log.domain && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {log.domain}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(log.approved)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRiskBadge(log.riskLevel)}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-400">
                            <div
                              className="max-w-[150px] truncate"
                              title={log.hash}
                            >
                              {log.hash && log.hash.length > 16
                                ? log.hash.substring(0, 16) + "..."
                                : log.hash || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {log.rejectionReason ? (
                              <div
                                className="max-w-xs truncate text-red-400"
                                title={log.rejectionReason}
                              >
                                {log.rejectionReason}
                              </div>
                            ) : (
                              <span className="text-green-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {formatDate(log.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
        <BottomNav />
      </div>
    </>
  );
}

export default withAuth(Dashboard, {
  requiredTier: USER_TIERS.STANDARD,
});
