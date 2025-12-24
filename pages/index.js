import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ServiceCard from '../components/ServiceCard'

export default function Home() {
  const domainCategories = [
    {
      title: "Commerce & Finance",
      domains: [
        { name: 'FundX', url: '/fundx', description: 'High-yield investment strategies', domain: 'fundx.pi' },
        { name: 'Assets', url: '/assets', description: 'Complete portfolio overview', domain: 'assets.pi' },
        { name: 'NBF', url: '/nbf', description: 'Advanced financial planning', domain: 'nbf.pi' },
        { name: 'Insure', url: '/insure', description: 'Investment protection', domain: 'insure.pi' },
        { name: 'Commerce', url: '/commerce', description: 'Global trade strategies', domain: 'commerce.pi' },
        { name: 'Ecommerce', url: '/ecommerce', description: 'Digital sales optimization', domain: 'ecommerce.pi' },
      ]
    },
    {
      title: "Lifestyle & Elite",
      domains: [
        { name: 'VIP', url: '/vip', description: 'Exclusive investment opportunities', domain: 'vip.pi' },
        { name: 'Life', url: '/life', description: 'Long-term financial growth', domain: 'life.pi' },
        { name: 'Estate', url: '/estate', description: 'Exclusive property opportunities', domain: 'estate.pi' },
        { name: 'Elite', url: '/elite', description: 'Premium trade content', domain: 'elite.pi' },
        { name: 'Titan', url: '/titan', description: 'Exclusive access privileges', domain: 'titan.pi' },
        { name: 'Legend', url: '/legend', description: 'Prestige & social status', domain: 'legend.pi' },
        { name: 'Epic', url: '/epic', description: 'Legacy projects', domain: 'epic.pi' },
      ]
    },
    {
      title: "Technology & Intelligence",
      domains: [
        { name: 'DX', url: '/dx', description: 'Advanced execution', domain: 'dx.pi' },
        { name: 'NX', url: '/nx', description: 'Elite-level insights', domain: 'nx.pi' },
        { name: 'System', url: '/system', description: 'Operational intelligence', domain: 'system.pi' },
        { name: 'Analytics', url: '/analytics', description: 'Performance tracking', domain: 'analytics.pi' },
        { name: 'Explorer', url: '/explorer', description: 'Unique opportunities', domain: 'explorer.pi' },
        { name: 'Alert', url: '/alert', description: 'Critical event updates', domain: 'alert.pi' },
      ]
    },
    {
      title: "Network & Connection",
      domains: [
        { name: 'Nexus', url: '/nexus', description: 'Elite network connections', domain: 'nexus.pi' },
        { name: 'Connection', url: '/connection', description: 'Strategic partnership building', domain: 'connection.pi' },
        { name: 'Brookfield', url: '/brookfield', description: 'Landmark projects', domain: 'brookfield.pi' },
        { name: 'Zone', url: '/zone', description: 'Optimal locations', domain: 'zone.pi' },
        { name: 'TEC', url: '/tec', description: 'Unified elite experience', domain: 'tec.pi' },
      ]
    }
  ];

  return (
    <div className="bg-[#0a0e2b] min-h-screen">
      <Head>
        <title>TEC | Titan Elite Commerce</title>
        <meta name="description" content="Official Luxury Commerce & Finance Ecosystem on Pi Network" />
      </Head>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-24">
        <header className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black titan-gradient-text tracking-tighter mb-6">
            TEC
          </h1>
          <p className="text-xl md:text-2xl font-bold text-[#00c6ff] mb-4">Titan Elite Commerce</p>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The Parent Authority over 24 independent luxury business units. All deals are curated, brokered, and secured.
          </p>
        </header>

        {domainCategories.map((category, idx) => (
          <section key={idx} className="mb-20">
            <h2 className="text-2xl font-black mb-10 border-l-4 border-[#00ff9d] pl-4 uppercase tracking-widest text-white">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.domains.map((domain) => (
                <ServiceCard key={domain.name} service={domain} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  )
}
