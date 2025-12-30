import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import ConsultationForm from "./ConsultationForm";

export default function BusinessUnitLayout({ config, basePath }) {
  const [showConsultation, setShowConsultation] = useState(false);

  return (
    <>
      <Head>
        <title>
          {config.displayName} - {config.tagline} | TEC
        </title>
        <meta name="description" content={config.description} />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white">
        {/* Hero */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              {config.icon} {config.displayName}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              {config.tagline}
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {config.description}
            </p>

            <button
              onClick={() => setShowConsultation(true)}
              className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Request Consultation
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-gray-800/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose {config.displayName}?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {config.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-[#00ff9d]">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {config.pages.map((page, index) => (
                <Link
                  key={index}
                  href={`${basePath}${page.path}`}
                  className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 hover:border-[#00ff9d] transition-all duration-300 group"
                >
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#00ff9d] transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {page.description}
                  </p>
                  <div className="text-[#00ff9d] text-sm font-semibold">
                    Learn More →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#00ff9d]/10 to-[#00c6ff]/10">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8">
              Schedule a consultation with our expert advisors to discuss your
              needs
            </p>
            <button
              onClick={() => setShowConsultation(true)}
              className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
            >
              Request Consultation
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Consultation Form */}
      {showConsultation && (
        <ConsultationForm
          service={config.displayName}
          onClose={() => setShowConsultation(false)}
        />
      )}
    </>
  );
}
