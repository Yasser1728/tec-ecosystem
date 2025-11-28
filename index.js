import Header from '../components/Header'
import Footer from '../components/Footer'
import ServiceCard from '../components/ServiceCard'

export default function Home() {
  const services = [
    { name: 'Commerce', url: '/commerce', description: 'Marketplace & Stores', domain: 'commerce.pi' },
    { name: 'Assets', url: '/assets', description: 'Digital Assets & Wallet', domain: 'assets.pi' },
    { name: 'Analytics', url: '/analytics', description: 'Dashboard & Reports', domain: 'analytics.pi' },
    { name: 'Fundx', url: '/fundx', description: 'Investment & Finance', domain: 'fundx.pi' },
    { name: 'Estate', url: '/estate', description: 'Real Estate Listings', domain: 'estate.pi' },
    { name: 'Insure', url: '/insure', description: 'Insurance Services', domain: 'insure.pi' },
    { name: 'Dx', url: '/dx', description: 'Developer Tools & API', domain: 'dx.pi' },
    { name: 'Explorer', url: '/explorer', description: 'Pi Network Explorer', domain: 'explorer.pi' },
  ]

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        <section className="text-center my-10">
          <h1 className="text-4xl font-bold mb-4">TEC Ecosystem</h1>
          <p className="text-lg text-gray-700">
            Unified Platform for Commerce, Finance, Assets & Analytics on Pi Network.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
  }
