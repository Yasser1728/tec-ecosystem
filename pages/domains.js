import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { domainMapping, getDomainStats, getDomainsByCategory } from '../lib/domainMapping';

export default function Domains() {
  const stats = getDomainStats();
  const categories = ['Financial', 'Premium', 'Commerce', 'Technology', 'Specialized', 'Hub'];

  return (
    <>
      <Head>
        <title>Our .pi Domains - TEC Ecosystem</title>
        <meta name="description" content="24 premium .pi domains owned by TEC Ecosystem" />
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
              <span className="text-green-400 text-2xl">✓</span>
              <span className="text-green-400 font-semibold">All Domains Secured</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-xl p-6">
              <div className="text-4xl mb-2">🌐</div>
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Domains</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-6">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-3xl font-bold text-white mb-1">{stats.active}</div>
              <div className="text-sm text-gray-400">Active Domains</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-3xl font-bold text-white mb-1">{stats.byPriority['Tier 1']}</div>
              <div className="text-sm text-gray-400">Tier 1 Domains</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-6">
              <div className="text-4xl mb-2">📂</div>
              <div className="text-3xl font-bold text-white mb-1">{Object.keys(stats.byCategory).length}</div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
          </div>

          {/* Domains by Category */}
          {categories.map((category) => {
            const domains = getDomainsByCategory(category);
            if (domains.length === 0) return null;

            return (
              <div key={category} className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
                    {category}
                  </span>
                  <span className="text-sm text-gray-500">({domains.length} domains)</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {domains.map(({ domain, route, name, priority, status }) => (
                    <Link key={domain} href={route}>
                      <div className="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-[#00ff9d] transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#00ff9d] transition-colors">
                              {domain}
                            </h3>
                            <p className="text-sm text-gray-400">{name}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            priority === 'Tier 1' 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                              : priority === 'Tier 2'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                          }`}>
                            {priority}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {status === 'active' ? '✓ Active' : 'Inactive'}
                          </span>
                          <span className="text-[#00ff9d] text-sm group-hover:translate-x-1 transition-transform">
                            Visit →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-8 mt-12">
            <h2 className="text-3xl font-bold mb-4">Why These Domains Matter</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2">First-Mover Advantage</h3>
                <p className="text-gray-400">
                  Secured premium names early in Pi Network's domain system
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">💎</div>
                <h3 className="text-xl font-bold mb-2">Valuable Assets</h3>
                <p className="text-gray-400">
                  Domain values increase as Pi Network ecosystem grows
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">🌐</div>
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
