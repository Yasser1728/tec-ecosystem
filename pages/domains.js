import Head from "next/head";
import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  domainMapping,
  getDomainStats,
  getDomainsByCategory,
  isDomainOperational,
} from "../lib/domainMapping";

export default function Domains() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  
  const stats = getDomainStats();
  const categories = [
    { id: "all", name: "All", count: stats.total },
    { id: "Financial", name: "Financial", count: stats.byCategory.Financial },
    { id: "Premium", name: "Premium", count: stats.byCategory.Premium },
    { id: "Commerce", name: "Commerce", count: stats.byCategory.Commerce },
    { id: "Technology", name: "Technology", count: stats.byCategory.Technology },
    { id: "Specialized", name: "Specialized", count: stats.byCategory.Specialized },
    { id: "Hub", name: "Hub", count: stats.byCategory.Hub },
  ];

  // Filtered domains based on category and search
  const filteredDomains = useMemo(() => {
    let domains = selectedCategory === "all"
      ? Object.entries(domainMapping).map(([domain, config]) => ({ domain, ...config }))
      : getDomainsByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      domains = domains.filter((d) =>
        d.domain.toLowerCase().includes(query) ||
        d.name.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query)
      );
    }

    return domains;
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (categoryId) => {
    setIsLoading(true);
    setSelectedCategory(categoryId);
    setTimeout(() => setIsLoading(false), 150);
  };

  return (
    <>
      <Head>
        <title>Our .pi Domains - TEC Ecosystem</title>
        <meta
          name="description"
          content="24 premium .pi domains owned by TEC Ecosystem"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              Our .pi Domain Portfolio
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              24 Premium Domains on Pi Network
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/50 rounded-full px-6 py-2">
              <span className="text-green-400 text-2xl" aria-label="All domains secured">✓</span>
              <span className="text-green-400 font-semibold">
                All Domains Secured
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-xl p-6">
              <div className="text-4xl mb-2" aria-hidden="true">🌐</div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-gray-400">Total Domains</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-6">
              <div className="text-4xl mb-2" aria-hidden="true">✅</div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.active}
              </div>
              <div className="text-sm text-gray-400">Active Domains</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6">
              <div className="text-4xl mb-2" aria-hidden="true">🏆</div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.byPriority["Tier 1"]}
              </div>
              <div className="text-sm text-gray-400">Tier 1 Domains</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-6">
              <div className="text-4xl mb-2" aria-hidden="true">📂</div>
              <div className="text-3xl font-bold text-white mb-1">
                {Object.keys(stats.byCategory).length}
              </div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <label htmlFor="domain-search" className="sr-only">
                Search domains
              </label>
              <input
                id="domain-search"
                type="text"
                placeholder="Search domains by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff9d] transition-colors"
                aria-label="Search for domains"
              />
            </div>

            {/* Category Tabs */}
            <div 
              className="flex gap-2 overflow-x-auto pb-2"
              role="tablist"
              aria-label="Domain categories"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  role="tab"
                  aria-selected={selectedCategory === category.id}
                  aria-controls="domain-grid"
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? "bg-[#00ff9d] text-gray-900"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff9d]"></div>
              <p className="mt-4 text-gray-400">Loading domains...</p>
            </div>
          )}

          {/* Domains Grid */}
          {!isLoading && (
            <div id="domain-grid" role="tabpanel">
              {filteredDomains.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-xl text-gray-400 mb-2">No domains found</p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filter
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-sm text-gray-400">
                    Showing {filteredDomains.length} domain{filteredDomains.length !== 1 ? 's' : ''}
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDomains.map(({ domain, route, name, nameAr, priority, status, sla }) => {
                      const isOperational = isDomainOperational(domain);
                      const healthStatus = isOperational
                        ? sla >= 99.9
                          ? "excellent"
                          : sla >= 99.5
                            ? "good"
                            : "fair"
                        : "offline";

                      return (
                        <Link key={domain} href={route}>
                          <article 
                            className="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-[#00ff9d] transition-all cursor-pointer"
                            aria-label={`Visit ${name} domain`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#00ff9d] transition-colors">
                                  {domain}
                                </h3>
                                <p className="text-sm text-gray-400">{name}</p>
                                {nameAr && (
                                  <p className="text-xs text-gray-500 mt-1" lang="ar">
                                    {nameAr}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  priority === "Tier 1"
                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                                    : priority === "Tier 2"
                                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                      : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
                                }`}
                                aria-label={`Priority: ${priority}`}
                              >
                                {priority}
                              </span>
                            </div>

                            <div className="space-y-2 mb-4">
                              {/* Health Status */}
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Health:</span>
                                <span
                                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                    healthStatus === "excellent"
                                      ? "bg-green-500/20 text-green-400"
                                      : healthStatus === "good"
                                        ? "bg-blue-500/20 text-blue-400"
                                        : healthStatus === "fair"
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : "bg-red-500/20 text-red-400"
                                  }`}
                                  aria-label={`Health status: ${healthStatus}`}
                                >
                                  <span className="inline-block w-2 h-2 rounded-full bg-current"></span>
                                  {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
                                </span>
                              </div>

                              {/* SLA */}
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">SLA:</span>
                                <span className="text-gray-300 font-medium">{sla}%</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs px-3 py-1 rounded-full ${
                                  status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                                aria-label={`Status: ${status}`}
                              >
                                {status === "active" ? "✓ Active" : "Inactive"}
                              </span>
                              <span className="text-[#00ff9d] text-sm group-hover:translate-x-1 transition-transform">
                                Visit →
                              </span>
                            </div>
                          </article>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-8 mt-12">
            <h2 className="text-3xl font-bold mb-4">
              Why These Domains Matter
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-3" aria-hidden="true">🎯</div>
                <h3 className="text-xl font-bold mb-2">
                  First-Mover Advantage
                </h3>
                <p className="text-gray-400">
                  Secured premium names early in Pi Network's domain system
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3" aria-hidden="true">💎</div>
                <h3 className="text-xl font-bold mb-2">Valuable Assets</h3>
                <p className="text-gray-400">
                  Domain values increase as Pi Network ecosystem grows
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3" aria-hidden="true">🌐</div>
                <h3 className="text-xl font-bold mb-2">Complete Ecosystem</h3>
                <p className="text-gray-400">
                  24 domains covering all major business categories
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/ecosystem"
              className="inline-block bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all text-lg"
            >
              Explore All Business Units
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
