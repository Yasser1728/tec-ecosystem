import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { BottomNav } from "./layout";
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

      <main className="min-h-screen bg-gray-900 text-white pb-16 md:pb-0">
        {/* Hero */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-tec-green/5 to-transparent" />
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm mb-6">
              <span>{config.icon}</span>
              TEC Ecosystem
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-tec-green to-tec-blue bg-clip-text text-transparent">
              {config.displayName}
            </h1>
            <p className="text-xl text-gray-300 mb-3">{config.tagline}</p>
            <p className="text-base text-gray-500 mb-10 max-w-2xl mx-auto">
              {config.description}
            </p>

            <button
              onClick={() => setShowConsultation(true)}
              className="bg-gradient-to-r from-tec-green to-tec-blue text-tec-dark px-8 py-3.5 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-tec-green/20 transition-all duration-300"
            >
              Request Consultation
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">
              Why Choose {config.displayName}?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {config.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-7 text-center hover:border-tec-green/30 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-tec-green">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-gray-800/20">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {config.pages.map((page, index) => (
                <Link
                  key={index}
                  href={`${basePath}${page.path}`}
                  className="group bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6 hover:border-tec-green/40 hover:bg-gray-800 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold mb-2 group-hover:text-tec-green transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {page.description}
                  </p>
                  <span className="text-tec-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Schedule a consultation with our expert advisors
            </p>
            <button
              onClick={() => setShowConsultation(true)}
              className="bg-gradient-to-r from-tec-green to-tec-blue text-tec-dark px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-tec-green/20 transition-all"
            >
              Request Consultation
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />

      {showConsultation && (
        <ConsultationForm
          service={config.displayName}
          onClose={() => setShowConsultation(false)}
        />
      )}
    </>
  );
}
