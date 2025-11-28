import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Dashboard() {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        <section className="text-center my-10">
          <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
          <p className="text-lg text-gray-700">
            Welcome to your TEC Ecosystem dashboard. Manage your services, assets, and more.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: 'Commerce', url: '/commerce' },
            { name: 'Ecommerce', url: '/ecommerce' },
            { name: 'Assets', url: '/assets' },
            { name: 'Fundx', url: '/fundx' },
            { name: 'Estate', url: '/estate' },
            { name: 'Insure', url: '/insure' },
            { name: 'Dx', url: '/dx' },
            { name: 'Explorer', url: '/explorer' },
          ].map((service) => (
            <a
              key={service.name}
              href={service.url}
              className="block border rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
            </a>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}
