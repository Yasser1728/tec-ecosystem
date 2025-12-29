import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Nexus() {
  return (
    <>
      <Head>
        <title>Nexus.pi - AI-Powered Business Integration | TEC</title>
        <meta name="description" content="Connect, coordinate, and integrate your business with AI-powered solutions" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white">
        {/* Hero */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              🌐 Nexus.pi
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              AI-Powered Business Integration
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Connect. Coordinate. Integrate. Leverage artificial intelligence to streamline 
              your business operations and unlock new opportunities.
            </p>
            
            <Link 
              href="/academy"
              className="inline-block bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Explore AI Tools
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-gray-800/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Solutions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2 text-[#00ff9d]">Smart Automation</h3>
                <p className="text-gray-400">
                  AI-powered automation for business processes
                </p>
              </div>

              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-xl font-bold mb-2 text-[#00ff9d]">Integration</h3>
                <p className="text-gray-400">
                  Connect all your systems seamlessly
                </p>
              </div>

              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2 text-[#00ff9d]">Analytics</h3>
                <p className="text-gray-400">
                  Real-time insights and predictions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Transform Your Business with AI</h2>
            <p className="text-gray-400 mb-8">
              Join thousands using Nexus AI
            </p>
            <Link
              href="/academy"
              className="inline-block bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
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
