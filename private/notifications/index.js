import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Alert() {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        <section className="text-center my-10">
          <h1 className="text-4xl font-bold mb-4">Alerts & Notifications</h1>
          <p className="text-gray-700">
            Stay updated with the latest alerts and notifications in TEC Ecosystem.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
