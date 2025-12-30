import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Zone() {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        <section className="text-center my-10">
          <h1 className="text-4xl font-bold mb-4">Zone Platform</h1>
          <p className="text-gray-700">
            Explore zones and areas for collaboration in TEC Ecosystem.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
