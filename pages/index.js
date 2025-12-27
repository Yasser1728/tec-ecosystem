import Header from '../public/components/layout/Header';
import Footer from '../public/components/layout/Footer';
import ParticlesCanvas from '../public/components/ui/ParticlesCanvas';
import ServiceCard from '../public/components/ui/ServiceCard';

export default function Home() {
  return (
    <>
      <Header />
      <main className="p-8">
        <ParticlesCanvas />
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ServiceCard title="Service A" description="Description of service A" />
          <ServiceCard title="Service B" description="Description of service B" />
          <ServiceCard title="Service C" description="Description of service C" />
        </section>
      </main>
      <Footer />
    </>
  );
}
