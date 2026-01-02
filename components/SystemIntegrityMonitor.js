/**
 * System Integrity Monitor Component
 * Displays system integrity level and circuit breaker status
 */

import { useState, useEffect } from 'react';

export default function SystemIntegrityMonitor({ onRefresh }) {
  const [liquidityData, setLiquidityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchLiquidityData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchLiquidityData, 10000);
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

  const toggleCircuitBreaker = async () => {
    const isActive = liquidityData?.systemIntegrity?.circuitBreakerActive;
    const reason = isActive
      ? 'Manual deactivation'
      : prompt('Enter reason for activating circuit breaker:');

    if (!isActive && !reason) {
      return; // User cancelled
    }

    setToggling(true);
    try {
      const response = await fetch('/api/system-control/circuit-breaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activate: !isActive,
          reason,
        }),
      });

      if (response.ok) {
        await fetchLiquidityData();
        if (onRefresh) onRefresh();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.message || error.error}`);
      }
    } catch (error) {
      console.error('Failed to toggle circuit breaker:', error);
      alert('Failed to toggle circuit breaker');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const integrityLevel = liquidityData?.systemIntegrity?.level || 'NORMAL';
  const circuitBreakerActive =
    liquidityData?.systemIntegrity?.circuitBreakerActive || false;

  const getLevelColor = (level) => {
    switch (level) {
      case 'NORMAL':
        return 'from-green-500 to-emerald-500';
      case 'WARNING':
        return 'from-yellow-500 to-orange-500';
      case 'CRITICAL':
        return 'from-orange-500 to-red-500';
      case 'LOCKED':
        return 'from-red-500 to-red-700';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'NORMAL':
        return '✅';
      case 'WARNING':
        return '⚠️';
      case 'CRITICAL':
        return '🚨';
      case 'LOCKED':
        return '🔒';
      default:
        return '❓';
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${getLevelColor(integrityLevel)}/20 border-2 border-${getLevelColor(integrityLevel).split(' ')[0].split('-')[1]}-500 rounded-xl p-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {getLevelIcon(integrityLevel)} System Integrity
        </h2>
        <button
          onClick={fetchLiquidityData}
          className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Integrity Level */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Integrity Level</p>
          <p className="text-3xl font-bold text-white">{integrityLevel}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Circuit Breaker</p>
          <p className="text-3xl font-bold text-white">
            {circuitBreakerActive ? '🔴 ACTIVE' : '🟢 INACTIVE'}
          </p>
        </div>
      </div>

      {/* Lock Reason */}
      {liquidityData?.systemIntegrity?.lockReason && (
        <div className="mb-6 p-4 bg-black/30 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Lock Reason</p>
          <p className="text-white">{liquidityData.systemIntegrity.lockReason}</p>
        </div>
      )}

      {/* Circuit Breaker Toggle */}
      <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
        <div>
          <p className="text-white font-semibold mb-1">Emergency Circuit Breaker</p>
          <p className="text-sm text-gray-400">
            {circuitBreakerActive
              ? 'All transfers are currently suspended'
              : 'System is operating normally'}
          </p>
        </div>
        <button
          onClick={toggleCircuitBreaker}
          disabled={toggling}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            circuitBreakerActive
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
          } ${toggling ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {toggling ? '...' : circuitBreakerActive ? 'DEACTIVATE' : 'ACTIVATE'}
        </button>
      </div>
    </div>
  );
}
