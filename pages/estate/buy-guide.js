import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ConsultationForm from "../../components/ConsultationForm";

export default function EstateBuyGuide() {
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  return (
    <>
      <Head>
        <title>How to Buy Property with Pi | Estate.pi - TEC</title>
        <meta
          name="description"
          content="Complete guide to purchasing luxury real estate using Pi Network cryptocurrency"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-gray-400">
            <Link href="/" className="hover:text-[#00ff9d]">
              TEC
            </Link>
            {" > "}
            <Link href="/estate" className="hover:text-[#00ff9d]">
              Estate
            </Link>
            {" > "}
            <span className="text-white">Buy Guide</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              🏠 How to Buy Property with Pi
            </h1>
            <p className="text-xl text-gray-300">
              Your complete guide to purchasing luxury real estate using Pi
              Network
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#00ff9d]">
              Why Buy Real Estate with Pi?
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Pi Network enables sovereign settlements for luxury real estate
                transactions, offering a secure, transparent, and efficient way
                to invest in property worldwide.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-3xl mb-2">🔒</div>
                  <h3 className="font-bold mb-2">Secure</h3>
                  <p className="text-sm">Blockchain-verified transactions</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-bold mb-2">Fast</h3>
                  <p className="text-sm">Quick settlement process</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-3xl mb-2">🌍</div>
                  <h3 className="font-bold mb-2">Global</h3>
                  <p className="text-sm">Access properties worldwide</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Steps Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              The 4-Step Legal Process
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-gray-800 border-l-4 border-[#00ff9d] rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#00ff9d] text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-[#00ff9d]">
                      Property Selection & Verification
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Browse curated luxury properties. Each listing is verified
                      by our expert team to ensure authenticity and legal
                      compliance.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-[#00ff9d] mt-1">✓</span>
                        <span>Legal title verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00ff9d] mt-1">✓</span>
                        <span>Property inspection reports</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00ff9d] mt-1">✓</span>
                        <span>Market valuation assessment</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-800 border-l-4 border-[#00c6ff] rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#00c6ff] text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-[#00c6ff]">
                      Consultation & Deal Structuring
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Work with dedicated advisors to structure the perfect deal
                      customized to your goals.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-[#00c6ff] mt-1">✓</span>
                        <span>1-on-1 consultation with expert advisor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00c6ff] mt-1">✓</span>
                        <span>Custom payment plan options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00c6ff] mt-1">✓</span>
                        <span>Legal documentation preparation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-800 border-l-4 border-purple-500 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-purple-400">
                      Pi Settlement & Smart Contracts
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Execute transactions using Pi Network's secure blockchain.
                      Smart contracts ensure transparency.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">✓</span>
                        <span>Escrow protection via smart contracts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">✓</span>
                        <span>Milestone-based payment release</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">✓</span>
                        <span>Blockchain-verified records</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-gray-800 border-l-4 border-yellow-500 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-500 text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-yellow-400">
                      Ownership Transfer & Support
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Complete legal transfer with full support. We handle all
                      paperwork and ensure smooth handover.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Legal title transfer assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Property handover coordination</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Post-purchase support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Start Your Real Estate Journey?
            </h2>
            <p className="text-gray-300 mb-6">
              Schedule a consultation with our expert advisors.
            </p>
            <button
              onClick={() => setShowConsultationForm(true)}
              className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              📞 Request Consultation
            </button>
          </div>

          {/* Related Links */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/estate/countries"
              className="bg-gray-800 border border-gray-700 hover:border-[#00ff9d] rounded-lg p-4 transition-all"
            >
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-bold mb-1">Countries Guide</h3>
              <p className="text-sm text-gray-400">Countries accepting Pi</p>
            </Link>
            <Link
              href="/estate/listings"
              className="bg-gray-800 border border-gray-700 hover:border-[#00ff9d] rounded-lg p-4 transition-all"
            >
              <div className="text-2xl mb-2">🏠</div>
              <h3 className="font-bold mb-1">Featured Properties</h3>
              <p className="text-sm text-gray-400">Browse elite listings</p>
            </Link>
            <Link
              href="/insure"
              className="bg-gray-800 border border-gray-700 hover:border-[#00ff9d] rounded-lg p-4 transition-all"
            >
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-bold mb-1">Protect Investment</h3>
              <p className="text-sm text-gray-400">Insurance options</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Consultation Form */}
      {showConsultationForm && (
        <ConsultationForm
          service="Estate - Real Estate"
          onClose={() => setShowConsultationForm(false)}
        />
      )}
    </>
  );
}
