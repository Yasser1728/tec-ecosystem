import Header from '../../public/components/layout/Header'
import Footer from '../../public/components/layout/Footer'

export default function Nx() {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        <section className="text-center my-10">
          <h1 className="text-4xl font-bold mb-4">NX Services</h1>
          <p className="text-gray-700">
            Explore NX projects and tools in TEC Ecosystem.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
