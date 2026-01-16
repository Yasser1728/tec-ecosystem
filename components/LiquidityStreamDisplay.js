/**
 * Liquidity Stream Display Component
 * Shows system liquidity overview and pending/frozen transfers
 */

import { useState, useEffect } from 'react';
import { logger } from '../lib/utils/logger.js';

export default function LiquidityStreamDisplay() {
  const [liquidityData, setLiquidityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiquidityData();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchLiquidityData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiquidityData = async () => {
    try {
      const response = await fetch('/api/system-control/liquidity-stream');
      if (response.ok) {
        const result = await response.json();
        setLiquidityData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch liquidity data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          💧 Liquidity Stream
        </h2>
        <button
          onClick={fetchLiquidityData}
          className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-lg p-4">
          <p className="text-sm text-blue-400 mb-1">Pending Transfers</p>
          <p className="text-3xl font-bold text-white">
            {liquidityData?.totalPendingTransfers || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg p-4">
          <p className="text-sm text-purple-400 mb-1">Frozen Value</p>
          <p className="text-3xl font-bold text-white">
            {liquidityData?.totalFrozenValue?.toFixed(2) || '0.00'} π
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-4">
          <p className="text-sm text-green-400 mb-1">24h Volume</p>
          <p className="text-3xl font-bold text-white">
            {liquidityData?.recentVolume?.last24Hours || 0}
          </p>
        </div>
      </div>

      {/* Freeze Monitor */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          ❄️ Freeze Monitor
        </h3>

        {liquidityData?.pendingTransfers?.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {liquidityData.pendingTransfers.map((transfer) => (
              <div
                key={transfer.id}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        transfer.status === 'FROZEN'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {transfer.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {transfer.amount} {transfer.currency}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Source Domain</p>
                    <p className="text-white font-semibold">{transfer.sourceDomain}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Target Domain</p>
                    <p className="text-white font-semibold">{transfer.targetDomain}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Created</p>
                    <p className="text-white">{formatDate(transfer.createdAt)}</p>
                  </div>
                  {transfer.frozenAt && (
                    <div>
                      <p className="text-gray-400">Frozen</p>
                      <p className="text-white">{formatDate(transfer.frozenAt)}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500">Transfer ID: {transfer.id}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-gray-400">No pending or frozen transfers</p>
            <p className="text-sm text-gray-500 mt-1">System liquidity is flowing normally</p>
          </div>
        )}
      </div>
    </div>
  );
}
