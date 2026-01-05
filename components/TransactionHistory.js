import { useState, useEffect, useCallback } from "react";
import { piAuth } from "../lib/pi-auth";

export default function TransactionHistory() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = useCallback(async () => {
    const user = piAuth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const statusParam = filter !== "all" ? `&status=${filter}` : "";

      const [paymentsRes, statsRes] = await Promise.all([
        fetch(`/api/payments/history?userId=${user.id}${statusParam}`),
        fetch(`/api/payments/stats?userId=${user.id}`),
      ]);

      if (paymentsRes.ok && statsRes.ok) {
        const paymentsData = await paymentsRes.json();
        const statsData = await statsRes.json();

        setPayments(paymentsData.payments);
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error("Failed to load transaction data:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();

    // Set up auto-refresh every 10 seconds
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadData, 10000);
    }

    // Listen for payment completion events
    const handlePaymentCompleted = () => {
      loadData();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("pi-payment-completed", handlePaymentCompleted);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "pi-payment-completed",
          handlePaymentCompleted,
        );
      }
    };
  }, [autoRefresh, loadData]);

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "text-green-400 bg-green-900/20 border-green-600",
      PENDING: "text-yellow-400 bg-yellow-900/20 border-yellow-600",
      CANCELLED: "text-gray-400 bg-gray-900/20 border-gray-600",
      FAILED: "text-red-400 bg-red-900/20 border-red-600",
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusIcon = (status) => {
    const icons = {
      COMPLETED: "✅",
      PENDING: "⏳",
      CANCELLED: "❌",
      FAILED: "⚠️",
    };
    return icons[status] || "⏳";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff9d]"></div>
      </div>
    );
  }

  if (!piAuth.isAuthenticated()) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">
          Please authenticate with Pi Network to view transaction history
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#00ff9d]/10 to-[#00c6ff]/10 border border-[#00ff9d]/30 rounded-lg p-4">
            <p className="text-sm text-gray-400">Total Spent</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalSpent.toFixed(2)} π
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-400">
              {stats.byStatus.COMPLETED || 0}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">
              {stats.byStatus.PENDING || 0}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Failed</p>
            <p className="text-2xl font-bold text-red-400">
              {stats.byStatus.FAILED || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["all", "COMPLETED", "PENDING", "FAILED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-[#00ff9d] text-[#0a0e2b]"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          Auto-refresh
        </label>
      </div>

      {/* Transaction List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(payment.status)}`}
                      >
                        {getStatusIcon(payment.status)} {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-white uppercase">
                        {payment.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                        {payment.description || "No description"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-[#00ff9d]">
                        {payment.amount.toFixed(2)} π
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
