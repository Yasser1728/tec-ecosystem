import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { businessUnits } from '../lib/businessUnits';

export default function Ecosystem() {
  const units = Object.entries(businessUnits);

  return (
    <>
      <Head>
        <title>TEC Ecosystem - All Business Units</title>
        <meta name="description" content="Explore all 21 business units in the TEC Ecosystem" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              TEC Ecosystem
            </h1>
            <p className="text-xl text-gray-400">
              21 Business Units Powered by Pi Network
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map(([key, unit]) => (
              <Link 
                key={key} 
                href={`/${key}`}
                className="group"
              >
                <div className={`
                  bg-gradient-to-br ${unit.color} 
                  p-6 rounded-xl shadow-lg 
                  hover:shadow-2xl hover:scale-105 
                  transition-all duration-300
                  border border-white/10
                `}>
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-3">{unit.icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold">{unit.displayName}</h3>
                      <p className="text-sm text-gray-300">{unit.tagline}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-200 mb-4">
                    {unit.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {unit.features?.slice(0, 3).map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-white/20 px-2 py-1 rounded"
                      >
                        {feature.icon} {feature.title}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-[#00ff9d] group-hover:translate-x-2 transition-transform">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
