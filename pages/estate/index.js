import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Estate() {
  return (
    <>
      <Head>
        <title>Estate - Luxury Real Estate | TEC Ecosystem</title>
        <meta name="description" content="Buy and sell luxury real estate with Pi Network" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              🏠 Estate.pi
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Luxury Real Estate Marketplace
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Buy and sell premium properties worldwide. Powered by Pi Network.
            </p>
            
            <Link 
              href="/estate/buy-guide"
              className="inline-block bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Start Your Journey →
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-gray-800/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Estate?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-2 text-[#00ff9d]">Global Properties</h3>
                <p className="text-gray-400">
                  Access luxury real estate from around the world
                </p>
              </div>

              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-bold mb-2 text-[#00ff9d]">Pay with Pi</h3>
                <p className="text-gray-400">
                  Secure transactions using Pi Network cryptocurrency
                </p>
              </div>

              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2 text-[#00ff9d]">Verified Listings</h3>
                <p className="text-gray-400">
                  All properties are verified and curated by experts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Property Categories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/estate/buy-guide" className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 hover:border-[#00ff9d] transition-all duration-300 group">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00ff9d] transition-colors">Buy Guide</h3>
                <p className="text-gray-400 text-sm">How to buy property with Pi</p>
              </Link>

              <Link href="/estate/countries" className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 hover:border-[#00ff9d] transition-all duration-300 group">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00ff9d] transition-colors">Countries</h3>
                <p className="text-gray-400 text-sm">Countries accepting Pi</p>
              </Link>

              <Link href="/estate/listings" className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 hover:border-[#00ff9d] transition-all duration-300 group">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00ff9d] transition-colors">Featured Properties</h3>
                <p className="text-gray-400 text-sm">Elite property showcase</p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#00ff9d]/10 to-[#00c6ff]/10">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
            <p className="text-gray-400 mb-8">Start browsing our exclusive listings today</p>
            <Link 
              href="/estate/buy-guide"
              className="inline-block bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
