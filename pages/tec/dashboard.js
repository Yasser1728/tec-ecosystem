import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getDomainStats, getDomainsByCategory } from "../../lib/domainMapping";

/**
 * TEC Dashboard Page
 * Unified dashboard showing all 24 domains with quick stats and activity
 * 
 * @component
 * @version 2.0.0
 */
export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const stats = getDomainStats();

  // Mock data for quick stats - in production, this would come from API
  const quickStats = {
    totalAssets: "$125.4M",
    activeDeals: 247,
    notifications: 12,
    uptime: "99.99%",
  };

  // Mock recent activity - in production, this would come from API
  const recentActivity = [
    {
      id: 1,
      type: "transaction",
      domain: "fundx.pi",
      message: "New investment opportunity in Tech sector",
      time: "5 minutes ago",
      icon: "💰",
    },
    {
      id: 2,
      type: "alert",
      domain: "alert.pi",
      message: "System health check completed successfully",
      time: "15 minutes ago",
      icon: "✅",
    },
    {
      id: 3,
      type: "recommendation",
      domain: "tec.pi",
      message: "AI recommends reviewing Estate portfolio",
      time: "1 hour ago",
      icon: "🤖",
    },
    {
      id: 4,
      type: "update",
      domain: "commerce.pi",
      message: "New B2B deal pending approval",
      time: "2 hours ago",
      icon: "📦",
    },
  ];

  const categories = [
    { id: "all", name: "All Domains", count: stats.total },
    { id: "Financial", name: "Financial", count: stats.byCategory.Financial },
    { id: "Premium", name: "Premium", count: stats.byCategory.Premium },
    { id: "Commerce", name: "Commerce", count: stats.byCategory.Commerce },
    { id: "Technology", name: "Technology", count: stats.byCategory.Technology },
    { id: "Specialized", name: "Specialized", count: stats.byCategory.Specialized },
    { id: "Hub", name: "Hub", count: stats.byCategory.Hub },
  ];

  const getFilteredDomains = () => {
    if (selectedCategory === "all") {
      return Object.entries(stats.byCategory)
        .flatMap(([category]) => getDomainsByCategory(category));
    }
    return getDomainsByCategory(selectedCategory);
  };

  return (
    <>
      <Head>
        <title>TEC Dashboard - Unified Control Center | TEC.pi</title>
        <meta
          name="description"
          content="Unified dashboard for managing all 24 TEC domains with AI-powered insights and real-time monitoring"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
                  TEC Dashboard
                </h1>
                <p className="text-gray-400 text-lg">
                  لوحة تحكم تي إي سي - Your unified control center
                </p>
              </div>
              <Link
                href="/tec/ai-assistant"
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                🤖 AI Assistant
              </Link>
            </div>
          </div>

          {/* Quick Stats Widgets */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">💎</div>
                <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                  Live
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {quickStats.totalAssets}
              </div>
              <div className="text-sm text-gray-400">Total Assets</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">📊</div>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {quickStats.activeDeals}
              </div>
              <div className="text-sm text-gray-400">Active Deals</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">🔔</div>
                {quickStats.notifications > 0 && (
                  <span className="text-xs text-pink-400 bg-pink-500/20 px-2 py-1 rounded">
                    New
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {quickStats.notifications}
              </div>
              <div className="text-sm text-gray-400">Notifications</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">⚡</div>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                  Healthy
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {quickStats.uptime}
              </div>
              <div className="text-sm text-gray-400">System Uptime</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Domain Access Panel - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Domain Access
                  </h2>
                  <span className="text-sm text-gray-400">
                    {stats.active} of {stats.total} active
                  </span>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === category.id
                          ? "bg-[#00ff9d] text-gray-900"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>

                {/* Domain Grid */}
                <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {getFilteredDomains().map(({ domain, route, name, nameAr, status, sla, priority }) => (
                    <Link key={domain} href={route}>
                      <div className="group bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:border-[#00ff9d] transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00ff9d] transition-colors">
                              {domain}
                            </h3>
                            <p className="text-sm text-gray-400">{name}</p>
                            {nameAr && (
                              <p className="text-xs text-gray-500 mt-1" lang="ar">
                                {nameAr}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {priority && (
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  priority === "Tier 1"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : priority === "Tier 2"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {priority}
                              </span>
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                status === "active"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {status === "active" ? "●" : "○"}
                            </span>
                            <span className="text-xs text-gray-500">
                              SLA: {sla}%
                            </span>
                          </div>
                        </div>
                        <div className="text-[#00ff9d] text-sm group-hover:translate-x-1 transition-transform">
                          Access →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 hover:border-gray-500 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{activity.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white mb-1">
                            {activity.message}
                          </div>
                          <div className="text-xs text-gray-400">
                            {activity.domain}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/tec/activity"
                  className="block text-center text-sm text-[#00c6ff] hover:text-[#00ff9d] mt-4 transition-colors"
                >
                  View all activity →
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/tec/ai-assistant"
                    className="block w-full bg-gradient-to-r from-[#00ff9d]/20 to-[#00c6ff]/20 border border-[#00ff9d]/30 text-white px-4 py-3 rounded-lg hover:border-[#00ff9d] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🤖</span>
                      <span className="font-medium">Ask AI Assistant</span>
                    </div>
                  </Link>
                  <Link
                    href="/domains"
                    className="block w-full bg-gray-700/50 border border-gray-600 text-white px-4 py-3 rounded-lg hover:border-gray-500 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌐</span>
                      <span className="font-medium">Browse All Domains</span>
                    </div>
                  </Link>
                  <Link
                    href="/tec/overview"
                    className="block w-full bg-gray-700/50 border border-gray-600 text-white px-4 py-3 rounded-lg hover:border-gray-500 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      <span className="font-medium">View Analytics</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  System Health
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">AI Assistant</span>
                    <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Dashboard</span>
                    <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Domain Router</span>
                    <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">All Services</span>
                    <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                      {quickStats.uptime} Uptime
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Banner */}
          <div className="mt-8 bg-gradient-to-r from-[#00ff9d]/10 to-[#00c6ff]/10 border border-[#00ff9d]/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  💎 Upgrade Your Plan
                </h3>
                <p className="text-gray-400">
                  Unlock premium features and unlimited access with Pi payments
                </p>
              </div>
              <Link
                href="/upgrade"
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
              >
                Upgrade Now
              </Link>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Need Help?
                </h3>
                <p className="text-gray-400">
                  Our AI Assistant is available 24/7 to guide you through the ecosystem
                </p>
              </div>
              <Link
                href="/tec/ai-assistant"
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
              >
                Launch Assistant
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
